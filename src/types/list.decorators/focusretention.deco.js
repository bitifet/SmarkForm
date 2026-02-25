// types/list.decorators/focusretention.deco.js
// ============================================

// Keep focus inside the list when it becomes empty so that new items can be added through keyboard.
// (Also focusing addItem trigger allows to re-add it with just hitting Space or Enter key)
export const focusretention = function list_focusretention_decorator(target, {kind}) {
    if (kind == "method") {
        return async function focusretentionMethod(_data, options, ...args) {
            const me = this;
            const retv = await target.call(me, _data, options, ...args);
            if (
                !! options?.focus
                && me.count() === 0
            ) {
                const someAddItemTrigger = me.getTriggers("addItem", 1)[0];
                if (someAddItemTrigger) {
                    someAddItemTrigger.targetNode.focus();
                };
            };
            return retv;
        };
    };
};
