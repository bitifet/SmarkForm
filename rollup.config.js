import { babel } from '@rollup/plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import terser from '@rollup/plugin-terser';
import pug from './rollup-plugins/rollup-plugin-pug.js';
import sass from './rollup-plugins/rollup-plugin-sass.js';
import copy from 'rollup-plugin-copy'

///import pkg from './package.json' assert { type: 'json' };
///-> Importing JSON modules is an experimental feature and might change at any time
import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync('./package.json'));

const isProduction = process.env.BUILD === 'production';

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
        ]
    },
    {
        input: 'src/examples/index.js',
        output: {
            file: 'tmp/index.js',
        },
        plugins: [
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
                targets: [
                    { src: "package.json", dest: "docs/_data/" },
                    { src: "dist/*", dest: "docs/_resources/dist" },
                ]
            }),

        ],
    },
];
