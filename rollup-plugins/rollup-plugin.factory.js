import Path from 'path'
import {promises as Fs, exists} from 'fs'
const fileExists = async path => new Promise(resolve=>exists(path, resolve));

const generators = new Map();


export default function rollup_pluginFactory({
    name,
    inputExtension,
    outputExtension,
    compiler,
}) {

    return function rollup_plugin_pug ({
        outputDir = "",
        ...options
    } = {}) {
        return {
            name, // this name will show up in warnings and errors
            async resolveId ( id, callSitePath) {
                if (id.endsWith(`.${inputExtension}`)) {
                    const callSiteDir = Path.dirname(callSitePath);
                    const fullPath = Path.join(callSiteDir, id);


                    const destPath = Path.join(
                        Path.resolve(outputDir)
                        , id.substring(0, id.length - inputExtension.length) + outputExtension
                    );

                    generators.set(id, {
                        fullPath,
                        destPath,
                    });


                    // this signals that rollup should not ask other plugins or check
                    // the file system to find this id
                    return id;
                }
                return null; // other ids should be handled as usually
            },
            async load ( id ) {
                const g = generators.get(id);
                if (! g) return null;
                return {
                        code: `export default "";`, // Don't render any code
                        moduleSideEffects: false,
                }
            },
            async transform (code, id) {
                if (! id.endsWith(`.${inputExtension}`)) return;

                const {
                    fullPath,
                    destPath,
                } = generators.get(id);
                if (! fullPath) return null;
                const destDirName = Path.dirname(destPath);

                // Compile:
                const {output, dependencies} = compiler(fullPath, options);

                // Add/refresh file watchers:
                this.addWatchFile(fullPath)
                for(const dep of dependencies) this.addWatchFile(dep);

                if (! await fileExists(destDirName)){
                    await Fs.mkdir(destDirName, { recursive: true });
                };

                await Fs.writeFile(destPath, output);

                return `export default "";`; // Don't render any code
            },
        };
    };

}
