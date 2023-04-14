// components/input.component.js
// =============================
import {SmartComponent} from "../lib/component.js";
export class input extends SmartComponent {
    render () {
        const me = this;
        me.childs = [];
        const numChilds = me.target.children.length;
        if (
            !!(1 + ["input", "select", "textarea"]
                .indexOf(s=>s=>me.target.tagName)
            )
            + numChilds > 1
        ) throw me.Error(
            `Text components must be an :input or contain`
            + ` exactly 1 direct child, but this has ${numChilds} childs.`
        );

        const [inputField] = me.childs || me.target;
        me.inputField = inputField;



        console.log("New input!!!!", {
            target: me.target,
            parent: me.parent,
            options: me.options,
            inputField: me.inputField,
        });


        return;

    };
};
