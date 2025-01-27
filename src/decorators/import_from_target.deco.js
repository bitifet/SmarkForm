// src/decorators/import_from_target.deco.js
// =========================================

export const import_from_target = function import_from_target_decorator(method, {kind}) {
    if (kind == "method") {
        return async function import_mtd({target, data, ...options}={}) {
            const me = this;
            try {
                data = await target.export();
            } catch (error) {
                // target not provided or invalid
            };
            return await method.call(me, {data, ...options});
        };
    };
};
