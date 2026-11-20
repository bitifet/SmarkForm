// types/list.decorators/smartdisabling.deco.js
// ============================================

import {normalizeCycle, normalizeDirection, normalizeMoveDepth} from "./move_options.js";

export async function updateTriggers(context) {
    for (
        const tg of context.getTriggers([
            "removeItem", "addItem", "next", "previous",
        ])
    ) {
        const options = tg.getTriggerArgs() || {};
        switch (options.action) {
            case "removeItem":
                tg.targetNode.disabled = (
                    context.children.length <= context.min_items
                    && options.failback != "clear" // Unless clearing function
                );
                break;
            case "addItem":
                tg.targetNode.disabled = (
                    context.children.length >= context.max_items
                );
                break;
            default: { // "next" / "previous"
                const target = (
                    Array.isArray(options.target)
                    ? options.target[0]
                    : options.target
                );
                const from = context.children.find(child => (
                    child === target
                    || (
                        target?.targetNode
                        && child.targetNode.contains(target.targetNode)
                    )
                )) || null;
                tg.targetNode.disabled = ! context._moveCandidate(from, {
                    depth: normalizeMoveDepth(options.depth ?? 0, context.moving_depth),
                    direction: normalizeDirection(
                        options.action === "previous" ? -1 : 1
                    ),
                    cycle: normalizeCycle(options.cycle),
                });
            };
        };
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
