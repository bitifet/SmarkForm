import rollupPlugin from "./rollup-plugin.factory.js";
import * as sass from 'sass';
const name = "sass";
const inputExtension = "scss";
const outputExtension = "css";

function compiler(file, {
    outputStyle = "compressed", // 'expanded'
    ...options
}) {
    const result = sass.compile(file, {
        outputStyle,
        ...options
    });
    const output = result.css.toString();
    return {output, dependencies: [file]};
};

export default rollupPlugin({
    name,
    inputExtension,
    outputExtension,
    compiler,
});

