// types/list.decorators/smartdisabling.deco.js
// ============================================

export async function updateTriggers(context) {
    for (const tg of context.getTriggers(["removeItem", "addItem"])) {
        const options = tg.getTriggerArgs() || {};
        tg.targetNode.disabled = (
            options.action == "removeItem" ? (
                context.children.length <= context.min_items
                && options.failback != "clear" // Unless clearing function
            )
            : context.children.length >= context.max_items
        );
    };
    // Movement actions own their candidate/disabled-state rules. This hook
    // keeps the generic add/remove decorator independent of those rules.
    if (typeof context._refreshMovementTriggers == "function") {
        await context._refreshMovementTriggers();
    } else if (typeof context._updateMovementTriggers == "function") {
        await context._updateMovementTriggers();
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
            await updateTriggers(this);
            return retv;
        };
    };
};
