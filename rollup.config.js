import { babel } from '@rollup/plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import terser from '@rollup/plugin-terser';
import pug from './rollup-plugins/rollup-plugin-pug.js';
import sass from './rollup-plugins/rollup-plugin-sass.js';
import copy from 'rollup-plugin-copy'
import { readFileSync, promises as fs } from 'fs';
import path from 'path';

///import pkg from './package.json' assert { type: 'json' };
///-> Importing JSON modules is an experimental feature and might change at any time
const pkg = JSON.parse(readFileSync('./package.json'));

const isProduction = process.env.BUILD === 'production';


const copyTargets = [
    { src: "package.json", dest: "docs/_data/" },
    { src: "dist/*", dest: "docs/_resources/dist" },
];




const computed_plugin = ()=>({
    name: 'computed_plugin',
    async writeBundle() {
        const filePath = path.resolve('dist', 'SmarkForm.esm.js');
        try {
            const stats = await fs.stat(filePath);
            const bundleSizeKB = Math.round(stats.size / 1024);

            const fileContents = JSON.stringify({
                bundleSizeKB
            });

            // Write the file size to another file
            const outputFilePath = path.resolve('docs/_data', 'computed.json');
            await fs.writeFile(outputFilePath, fileContents);

        } catch (error) {
            console.error(`compute_plugin: Error generating computed data: ${error.message}`);
        }
    },
});




export default [
    {
        input: 'src/main.js',
        output: [
            {   // ES module
                file: pkg.browser,
                format: 'es',
                compact: true,
                sourcemap: true,
            },
            {   // UMD module
                name: 'SmarkForm',
                file: pkg.umd,
                format: 'umd',
                compact: true,
                sourcemap: true,
            },
        ],
        plugins: [
            babel({
                babelHelpers: 'bundled',
                presets: [
                    ['@babel/preset-env', {
                        //useBuiltIns: "usage",
                        // targets: {
                        //     esmodules: true,
                        // },
                    }],
                ],
                plugins: [
                    ["@babel/plugin-proposal-decorators", { "version": "2023-01" }]
                ]
            }),
            cleanup(),
            terser({
                compress: {
                    // Fix terser bug removing actually used assignment:
                    unused: false,
                },
            }),
            copy({
                targets: copyTargets,
                ...(
                    ! isProduction ? {hook: "writeBundle"}
                        // Copies files after every rebuild making jekyll site
                        // to reload while in dev (watch) mode.
                        // BUT makes 'npm run build' to fail.
                        // This (almost) fixes that...
                    : {}
                )
            }),
        ]
    },
    {
        input: 'src/examples/index.js',
        output: {
            file: 'tmp/index.js',
        },
        plugins: [
            computed_plugin(),
            sass({
                outputStyle: "expanded",
                outputDir: "dist/examples",
            }),
            pug({
                pretty: true,
                outputDir: "dist/examples",
                locals: {
                    isProduction,
                    pkg,
                },
            }),
            copy({
                targets: copyTargets,
            }),
        ],
    },
];
