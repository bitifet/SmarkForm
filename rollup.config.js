import pkg from './package.json';

import { babel } from '@rollup/plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import terser from '@rollup/plugin-terser';
import scss from 'rollup-plugin-scss';
import pug from './rollup-plugins/rollup-plugin-pug';

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
            {   // Browser-frindly script (exports SmarkForm as global var)
                name: 'SmarkForm',
                file: pkg.browser,
                format: 'iife',
                compact: false,
                globals: {
                    SmarkForm: "SmarkForm",
                },
            },
        ],
        plugins: [
            babel({ babelHelpers: 'bundled' }),
            cleanup(),
            terser(),
        ]
    },
    {
        input: 'src/playground/app.js',
        output: {
            file: 'playground/public/app.js',
            format: 'umd',
            compact: false,
        },
        plugins: [
            scss({
                fileName: "index.css",
            }),
            pug({
                pretty: true,
                outputDir: "playground/public",
            }),
        ]
    },

];
