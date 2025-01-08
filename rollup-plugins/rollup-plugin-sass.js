import rollupPlugin from "./rollup-plugin.factory.js";
import sass from 'sass';
const name = "sass";
const inputExtension = "scss";
const outputExtension = "css";

function compiler(file, {
    outputStyle = "compressed", // 'expanded'
    ...options
}) {
    const result = sass.renderSync({
        file,
        outputStyle,
        ...options
    });
    const dependencies = result.stats.includedFiles;
    const output = result.css.toString();
    return {output, dependencies};
};

export default rollupPlugin({
    name,
    inputExtension,
    outputExtension,
    compiler,
});

