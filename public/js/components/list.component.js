// components/list.component.js
// ============================
import {SmartComponent} from "../lib/component.js";
export class list extends SmartComponent {
    render () {
        const me = this;
        me.childs = [];
        const numChilds = me.target.children.length;
        if (numChilds != 1) throw new Error(
            `List components must contain exactly 1 direct childs, but ${numChilds} given.`
        );
        me.itemTpl = me.target.children[0]; ///.cloneNode(true);
        if (
            me.itemTpl.querySelector("[id]") !== null // Contains IDs
        ) throw new Error(
            `List components are not allowed to contain elements with 'id' attribute.`
        );

        me.itemTpl.remove();

        console.log("New list!!!!", {
            target: me.target,
            parent: me.parent,
            options: me.options,
            path: me.path,
        });

        return;
    };
    addItem() {
        const me = this;
        const newItem = me.itemTpl.cloneNode(true);
        me.target.appendChild(newItem);
        const newChild = me.enhance(newItem, {type: "form"});
        me.childs.push(newChild);
    };
};
