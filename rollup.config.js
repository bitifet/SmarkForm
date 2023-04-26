import pkg from './package.json';

import { babel } from '@rollup/plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import terser from '@rollup/plugin-terser';

export default [
    {
        input: 'src/main.js',
        output: [
            {   // ES module
                file: pkg.main,
                format: 'es',
                compact: true,
            },
            {   // Browser-frindly UMD build
                name: 'SmartForm',
                file: pkg.browser,
                format: 'umd',
                compact: true,
            },
        ],
        plugins: [
            babel({ babelHelpers: 'bundled' }),
            cleanup(),
            terser(),
        ]
    },
];
