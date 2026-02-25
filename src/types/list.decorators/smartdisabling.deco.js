// types/list.decorators/smartdisabling.deco.js
// ============================================

async function updateTriggers(context) {
    for (const tg of context.getTriggers(["removeItem", "addItem"])) {
        tg.targetNode.disabled = (
            tg.options.action == "removeItem" ? (
                context.children.length <= context.min_items
                && tg.options.failback != "clear" // Unless clearing function
            )
            : context.children.length >= context.max_items
        );
    };
};

export const smartdisabling = function list_smartdisabling_decorator(target, {kind}) {
    if (kind == "class") {
        return class smartdisablingClass extends target {
            async render(...args) {//{{{
                const retv = await super.render(...args);
                await updateTriggers(this);
                return retv;
            };//}}}
        };
    } else if (kind == "method") {
        return async function smartdisablingMethod(...args) {
            const retv = await target.call(this, ...args);
            updateTriggers(this);
            return retv;
        };
    };
};
