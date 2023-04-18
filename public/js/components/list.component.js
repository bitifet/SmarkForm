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
//
//
// 👉 Make removeItem() to clear non removable items:
//    -----------------------------------------------
//
//    If children.length reaches minItems (so removing items is not allowed)
//    make removeItem() to clear its value instead.
//
//    This would requiere a kind of "resetValue()" in components to correctly
//    handle the value to set as "empty".
//


import {SmartComponent} from "../lib/component.js";
export class list extends SmartComponent {
    render () {//{{{
        const me = this;
        me.min_items = Math.max(0,
            typeof me.options.min_items == "number" ? me.options.min_items
            : 1
        );
        me.max_items = Math.max(me.min_items,
            typeof me.options.max_items == "number" ? me.options.max_items
            : Infinity
        );
        me.children = [];
        const numChilds = me.target.children.length;
        if (numChilds != 1) throw me.renderError(
            'LIST_WRONG_NUM_CHILDREN'
            , `List components must contain exactly 1 direct children, but ${numChilds} given`
        );
        me.itemTpl = me.target.children[0];
        if (
            me.itemTpl.querySelector("[id]") !== null // Contains IDs
        ) throw me.renderError(
            'LIST_CONTAINS_ID'
            , `List components are not allowed to contain elements with 'id' attribute`
        );
        const tplOptions = me.getNodeOptions(
            me.itemTpl
            , {type: me.options.of}
        );
        if (tplOptions.type != me.options.of) throw me.renderError(
            'LIST_ITEM_TYPE_MISSMATCH'
            , `List item type missmatch`
        );
        if (! tplOptions.type) tplOptions.type = "form"; // Use form as default.
        me.setNodeOptions(me.itemTpl, tplOptions);
        me.itemTpl.remove();

        for(let i=0; i<me.min_items; i++) me.addItem();

        return;
    };//}}}
    export() {//{{{
        const me = this;
        const targettedChildren = (
            me.inherittedOption("exportEmpties", false) ? me.children
            : me.children.filter(ch=>!ch.isEmpty())
        );
        return targettedChildren.map(ch=>ch.export());
    };//}}}
    import(data = []) {//{{{
        const me = this;
        // Auto-update in case of scalar to array template upgrade:
        if (! data instanceof Array) data = [data];
        // Load data:
        for (
            let i = 0;
            i < Math.min(data.length, me.max_items); // Limit to allowed items
            i++
        ) {
            if (me.children.length <= i) me.addItem(); // Make room on demand
            me.children[i].import(data[i]);
        };
        // Complete (empty unused items) to min_items if needed:
        for (
            let i = me.children.length;
            i < me.min_items;
            i++
        ) me.chldren[i].empty();
        // Report if data doesn't fit:
        if (data.length > me.max_items) {
            console.error(`Max of ${me.max_items} items exceeded by ${data.length - me.max_items} while data loadig`);
            // FIXME: Improve handling of this situation having it implies
            // data loss.
        };
        return me.export();
    };//}}}
    addItem({//{{{
        target,
        position = "after"
    } = {}) {
        const me = this;
        if (position != "after" && position != "before") throw me.renderError(
            'LIST_WRONG_ADDITEM_POSITION'
            , `Invalid value for addItem() position property: ${position}`
        );
        if (me.children.length >= me.max_items) throw me.ruleError(
            'LIST_MAX_ITEMS_REACHED'
            , `Cannot add items over max_items boundary`
        );
        const newItem = me.itemTpl.cloneNode(true);
        if (! me.children.length) {
            me.target.appendChild(newItem);
            const newChild = me.enhance(newItem, {type: "form", name: 0});
            me.children.push(newChild);
        } else {
            if (! target) target = (
                position == "before" ?  me.children[0] // Insert at the beginning
                : me.children[me.children.length - 1]  // Append at the end
            );
            me.children = me.children
                .map((child, i)=>{
                    if (! child.target.isSameNode(target.target)) return child;
                    if (position == "after") {
                        child.target.after(newItem);
                        const newChild = me.enhance(newItem, {type: "form"});
                        return [child, newChild]; // Right order, flatted later...
                    } else {
                        child.target.before(newItem);
                        const newChild = me.enhance(newItem, {type: "form"});
                        return [newChild, child]; // Right order, flatted later...
                    };
                })
                .flat()
                .map((c,i)=>(c.name = i, c))
            ;
        };
    };//}}}
    removeItem({//{{{
        target,
        ...options
    } = {}) {
        const me = this;
        if (me.children.length <= me.min_items) throw me.ruleError(
            'LIST_MIN_ITEMS_REACHED'
            , `Cannot remove items under min_items boundary`
        );
        if (target === undefined) target = me.children[me.children.length - 1];
        if (target instanceof Array) return target.map(t=>me.removeItem({target: t, ...options}));
        if (options.keep_non_empty && ! target.isEmpty()) return;
        me.children = me.children
            .filter(child=>{
                if (child.target.isSameNode(target.target)) {
                    child.target.remove();
                    return false;
                };
                return true;
            })
            .map((c,i)=>(c.name = i, c))
        ;
    };//}}}
    isEmpty() {//{{{
        const me = this;
        return (
            0 > me.children.findIndex(
                child=>!child.isEmpty()
            )
        );
    };//}}}
    empty() {//{{{
        const me = this;
        me.import([]);
    };//}}}
};
