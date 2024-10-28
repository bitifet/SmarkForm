// types/list.decorators/smartdisabling.deco.js
// ============================================

async function updateTriggers(context) {
    await context.rendered;
    for (const tg of context.getTriggers(["removeItem", "addItem"])) {
        tg.target.disabled = (
            tg.options.action == "removeItem" ? context.children.length <= context.min_items
            : context.children.length >= context.max_items
        );
    };
};

export const smartdisabling = function list_smartdisabling_decorator(target, {kind}) {
    if (kind == "class") {
        return class smartdisablingClass extends target {
            async render(...args) {//{{{
                const retv = await super.render(...args);
                const me = this;
                setTimeout(()=>updateTriggers(me), 1);
                    // FIXME (Why do we need to delay it?)
                    // Even more: Why it is even needed with min_items >= 1??

                return retv;
            };//}}}
        };
    } else if (kind == "method") {
        return async function smartdisablingMethod(...args) {
            const me = this;
            const retv = await target.call(me, ...args);
            updateTriggers(me);
            return retv;
        };
    };
};
