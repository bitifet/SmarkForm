
import rollupPlugin from "./rollup-plugin.factory.js";
import Pug from "pug";

const name = "pug";
const inputExtension = "pug";
const outputExtension = "html";

function compiler(inputFilePath, {
    debug = false,
    pretty = false,
    locals = {},
    ...options
}) {
    const render = Pug.compileFile(inputFilePath, {
            inlineRuntimeFunctions: false,
            compileDebug: !!debug,
            debug: false,
            pretty,
            ...options
    });
    const {dependencies} = render;
    const output = render(locals);
    return {output, dependencies};
};

export default rollupPlugin({
    name,
    inputExtension,
    outputExtension,
    compiler,
});

