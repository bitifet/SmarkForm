
import rollupPlugin from "./rollup-plugin.factory.js";
import Pug from "pug";

const name = "pug";
const inputExtension = "pug";
const outputExtension = "html";

const re_tag = /<([^>]+)>/g;

function swapQuoting(html) {//{{{
    // Make output samples' JSONs more readables.

    // Parse all HTML tags:
    html = html.replace(re_tag, function(match) {
        // Extract tag contents:
        var content = match.slice(1, -1);

        // Encode single quotes:
        content = content.replace(/'/g, "&apos;");

        // Switch external quoting from dobule to single quotes.
        content = content.replace(/"/g, "'");

        // Decode encoded double quotes (&quot; -> ")
        content = content.replace(/&quot;/g, '"');

        // Rebuild tag with parsed content:
        return '<' + content + '>';
    });

    return html;
};//}}}

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
    const output = swapQuoting(
        render(locals)
    );
    return {output, dependencies};
};

export default rollupPlugin({
    name,
    inputExtension,
    outputExtension,
    compiler,
});

