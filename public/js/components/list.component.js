// components/list.component.js
// ============================

// TODO:
// =====
//
// 👉 Keep first item in place:
//    -------------------------
//     
//    For lists allowing 0 items, make first element disabled and not visible
//    instead of completely removing from DOM.
//
//    This would avoid lots of visual layout issues.



import {SmartComponent} from "../lib/component.js";
export class list extends SmartComponent {
    render () {
        const me = this;
        me.childs = [];
        const numChilds = me.target.children.length;
        if (numChilds != 1) throw me.Error(
            `List components must contain exactly 1 direct childs, but ${numChilds} given.`
        );
        me.itemTpl = me.target.children[0];
        if (
            me.itemTpl.querySelector("[id]") !== null // Contains IDs
        ) throw me.Error(
            `List components are not allowed to contain elements with 'id' attribute.`
        );
        const tplOptions = {
            type: me.options.of,
            ...me.getNodeOptions(me.itemTpl),
        };
        if (tplOptions.type != me.options.of) throw me.Error(
            `List item type missmatch.`
        );
        if (! tplOptions.type) tplOptions.type = "form"; // Use form as default.
        me.setNodeOptions(me.itemTpl, tplOptions);
        me.itemTpl.remove();
        return;
    };
    addItem() {
        const me = this;
        const newItem = me.itemTpl.cloneNode(true);
        me.target.appendChild(newItem);
        const newChild = me.enhance(newItem, {type: "form", name: me.childs.length});
        me.childs.push(newChild);
    };
    removeItem({target}) {
        const me = this;
        me.childs = me.childs
            .filter(child=>{
                if (child.target.isSameNode(target.target)) {
                    child.target.remove();
                    return false;
                };
                return true;
            })
            .map((c,i)=>(c.name = i, c))
        ;
    };
};
