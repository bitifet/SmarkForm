
import {action} from "../types/action.type.js";

export const foldable = function foldable_decorator(target, {kind}) {
    if (kind == "class") {
        return class foldableTarget extends target {
            render(...args) {//{{{
                const retv = super.render(...args);
                const me = this;
                me.root.onRendered(()=>{
                    me.fold({operation: (
                        !! me.options.folded ? "fold"
                        : "unfold"
                    )});
                });
                return retv;
            };//}}}
            @action
            fold({//{{{
                operation = "toggle", // Values: "fold" / "unfold" / "toggle"
            } = {}) {
                const me = this;
                const wasFolded = me.target.style.display == "none";
                const isFolded = (
                    operation == "fold" ? true
                    : operation == "unfold" ? false
                    : ! wasFolded
                );
                me.target.style.display = (
                    isFolded ? "none"
                    : me.originalDisplayProp
                );

                me.getActions("fold").forEach(acc => {
                    const {foldedClass, unfoldedClass} = acc.options;
                    if (foldedClass) acc.target.classList[
                        isFolded ? "add"
                        : "remove"
                    ](foldedClass);
                    if (unfoldedClass) acc.target.classList[
                        isFolded ? "remove"
                        : "add"
                    ](unfoldedClass);
                });

                me.getActions(["addItem", "removeItem"]).map(
                    isFolded ? acc => acc.disable()
                    : acc => acc.enable()
                );
            };//}}}
        };
    };
};
