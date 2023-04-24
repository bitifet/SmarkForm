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


import {SmartComponent} from "../lib/component.js";
export class list extends SmartComponent {
    render () {//{{{
        const me = this;
        me.originalDisplayProp = me.target.style.display;

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
            , {
                type: me.options.of || "form", // Use form as default.
            }
        );
        if (
            me.options.of
            && tplOptions.type != me.options.of
        ) throw me.renderError(
            'LIST_ITEM_TYPE_MISSMATCH'
            , `List item type missmatch`
        );
        me.itemTpl.remove();
        // onRendered tweaks:
        me.root.onRendered(()=>{
            if (!! me.options.folded) me.fold();
            for(let i=0; i<me.min_items; i++) me.addItem();
            if (me.min_items == 0) {
                // Update "count" actions in case of not already updated by
                // me.addItem:
                me.getActions("count").forEach(
                    ac=>ac.target.innerText = String(me.children.length)
                );
            };
        });
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
        // Remove extra items if possible (over min_items):
        for (
            let i = Math.max(data.length, me.min_items);
            i < me.children.length;
        ) me.removeItem();
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
        position = "after",
        autoscroll,   // "self" / "parent" / (falsy)
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
        let newChild;
        if (! me.children.length) {
            me.target.appendChild(newItem);
            newChild = me.enhance(newItem, {type: "form", name: 0});
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
                        newChild = me.enhance(newItem, {type: "form"});
                        return [child, newChild]; // Right order, flatted later...
                    } else {
                        child.target.before(newItem);
                        newChild = me.enhance(newItem, {type: "form"});
                        return [newChild, child]; // Right order, flatted later...
                    };
                })
                .flat()
                .map((c,i)=>(c.name = i, c))
            ;
        };
        me.getActions("count").forEach(
            ac=>ac.target.innerText = String(me.children.length)
        );
        const moveTarget = (
            ! newChild ? null
            : autoscroll == "self" ? newChild
            : autoscroll == "parent" ? newChild.parent
            : null
        );
        if (moveTarget) moveTarget.moveTo();
    };//}}}
    removeItem({//{{{
        target,
        ...options
    } = {}) {
        const me = this;
        let {keep_non_empty} = options;
        if (! target) {
            target = [...me.children]
                .reverse()
                .find((t, i)=>(
                    ! keep_non_empty // Pick last (reversed => first)
                    || t.isEmpty()
                ))
            ;
            if (! target) {
                target = me.children[me.children.length - 1];
                keep_non_empty = false;
                // Allow non empty removal as last chance if no target
                // specified.
            };
        };
        if (target instanceof Array) return target.map(t=>me.removeItem({target: t, ...options}));
        if (me.children.length <= me.min_items) {
            switch (options.failback) {
                case "none":
                    break;
                case "clear":
                    target.empty();
                    return;
                case "throw":
                default:
                    throw me.ruleError(
                        'LIST_MIN_ITEMS_REACHED'
                        , `Cannot remove items under min_items boundary`
                    )
            };
        };
        if (keep_non_empty && ! target.isEmpty()) return;
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
        me.getActions("count").forEach(
            ac=>ac.target.innerText = String(me.children.length)
        );
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
        return me.import([]);
    };//}}}
    fold({//{{{
        operation = "toggle", // Values: "fold" / "unfold" / "toggle"
        origin,
        foldedClass,
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
        if (foldedClass && origin) {
            origin.target.classList[
                isFolded ? "add"
                : "remove"
            ](foldedClass)
        };
        me.getActions(["addItem", "removeItem"]).map(
            isFolded ? ac => ac.disable()
            : ac => ac.enable()
        );
    };//}}}
    count() {}; // Does nothing. Just allow reinject contents to it.
};
