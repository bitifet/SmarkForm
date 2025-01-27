// src/decorators/export_to_target.deco.js
// =======================================

export const export_to_target = function export_to_target_decorator(method, {kind}) {
    if (kind == "method") {
        return async function export_mtd({target, ...options}={}) {
            const me = this;
            const value = await method.call(me, options);
            try {
                await target.import({data: value});
            } catch (error) {
                // target not provided or invalid
            };
            return value;
        };
    };
};
