
import {action} from "../types/trigger.type.js";

export const foldable = function foldable_decorator(target, {kind}) {
    if (kind == "class") {
        return class foldableTarget extends target {
            render(...args) {//{{{
                const retv = super.render(...args);
                const me = this;
                me.root.onRendered(()=>{
                    me.fold(null, {
                        operation: ( !! me.options.folded ? "fold" : "unfold"),
                        autofocus: false, // Never focus during initial render
                    });
                });
                return retv;
            };//}}}
            @action
            fold(_data, {//{{{
                operation = "toggle", // Values: "fold" / "unfold" / "toggle"
                origin,
                autofocus = true,
            } = {}) {
                const me = this;
                const wasFolded = me.targetNode.style.display == "none";
                const isFolded = (
                    operation == "fold" ? true
                    : operation == "unfold" ? false
                    : ! wasFolded
                );
                me.targetNode.style.display = (
                    isFolded ? "none"
                    : me.originalDisplayProp
                );

                me.getTriggers("fold").forEach(tgg => {
                    const {foldedClass, unfoldedClass} = tgg.options;
                    if (foldedClass) tgg.targetNode.classList[
                        isFolded ? "add"
                        : "remove"
                    ](foldedClass);
                    if (unfoldedClass) tgg.targetNode.classList[
                        isFolded ? "remove"
                        : "add"
                    ](unfoldedClass);
                });

                me.getTriggers(["addItem", "removeItem"]).map(
                    isFolded ? tgg => tgg.disable()
                    : tgg => tgg.enable()
                );

                // Set focus accordingly:
                autofocus && (isFolded ? origin : me)?.focus();
            };//}}}
        };
    };
};
