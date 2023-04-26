import cleanup from 'rollup-plugin-cleanup';
import pkg from './package.json';
import { babel } from '@rollup/plugin-babel';

export default [
    // browser-friendly UMD build
    {
        input: 'src/main.js',
        output: [
            {   // ES module
                file: pkg.main,
                format: 'es',
                compact: true,
            },
            {   // Browser script
                name: 'SmartForm',
                file: pkg.browser,
                format: 'umd',
                compact: true,
            },
        ],
        plugins: [
            babel({ babelHelpers: 'bundled' }),
            cleanup(),
        ]
    },
];
