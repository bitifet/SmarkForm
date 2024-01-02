import pkg from './package.json';

import { babel } from '@rollup/plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import terser from '@rollup/plugin-terser';
import pug from './rollup-plugins/rollup-plugin-pug';
import sass from './rollup-plugins/rollup-plugin-sass';

const isProduction = process.env.BUILD === 'production';

export default [
    {
        input: 'src/main.js',
        output: [
            {   // ES module
                file: pkg.main,
                format: 'es',
                compact: true,
            },
            {   // UMD module
                name: 'SmarkForm',
                file: pkg.umd,
                format: 'umd',
                compact: true,
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
            ...(isProduction ? [
                terser(),
            ] : [])
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
                outputDir: "examples",
            }),
            pug({
                pretty: true,
                outputDir: "examples",
                locals: {
                    isProduction,
                    pkg,
                },
            }),
        ],
    },
];
