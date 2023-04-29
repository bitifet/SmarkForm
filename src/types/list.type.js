// types/list.type.js
// ==================

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
import {makeRoom} from "../lib/helpers.js";
import {foldable} from "../decorators/foldable.deco.js";
import {action} from "./action.type.js";


@foldable
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
            for(let i=0; i<me.min_items; i++) me.addItem();
            if (me.min_items == 0) {
                // Update "count" actions in case of not already updated by
                // me.addItem:
                me.getActions("count").forEach(
                    acc=>acc.target.innerText = String(me.children.length)
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
    @action
    async addItem(options = {}) {
        const me = this;
        // Parameters checking and resolution:{{{
        let {
            target,
            position = "after",
            autoscroll,   // "self" / "parent" / (falsy)
        } = options;
        if (position != "after" && position != "before") throw me.renderError(
            'LIST_WRONG_ADDITEM_POSITION'
            , `Invalid value for addItem() position property: ${position}`
        );
        if (me.children.length >= me.max_items) throw me.ruleError(
            'LIST_MAX_ITEMS_REACHED'
            , `Cannot add items over max_items boundary`
        );
        if (me.children.length && ! target) target = (
            position == "before" ?  me.children[0] // Insert at the beginning
            : me.children[me.children.length - 1]  // Append at the end
        );
        //}}}
        // DOM element creation:{{{
        const newItem = me.itemTpl.cloneNode(true);
        //}}}
        // newItem event emitting:{{{
        const onRenderedCbks = [];
            // Allow for handy callback instead of two separate event handlers
        await me.emit("newItem", {
                newItem,
                options,
                onRendered: cbk => onRenderedCbks.push(cbk),
        });
        //}}}
        // Child component creation and insertion:{{{
        let newChild;
        if (! me.children.length) {
            me.target.appendChild(newItem);
            newChild = me.enhance(newItem, {type: "form", name: 0});
            me.children.push(newChild);
        } else {
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
        //}}}
        // Update counter actions (if any):{{{
        me.getActions("count").forEach(
            acc=>acc.target.innerText = String(me.children.length)
        );
        //}}}
        // Autoscroll handling:{{{
        if (autoscroll == "elegant" && !! newChild) {
            makeRoom(newChild.target, - newChild.offsetHeight);
        } else {
            const moveTarget = (
                ! newChild ? null
                : autoscroll == "self" ? newChild
                : autoscroll == "parent" ? newChild.parent
                : null
            );
            if (moveTarget) moveTarget.moveTo();
        };
        //}}}
        // Execute "onRendered" callbacks and emit newChild event:{{{
        onRenderedCbks.forEach(cbk=>cbk(newChild));
        me.emit("newChild", {
            child: newChild,
            originalOptions: options,
        });
        //}}}
    };
    @action
    removeItem(options = {}) {//{{{
        const me = this;
        let {
            target,
            autoscroll,
            keep_non_empty,
            failback,
        } = options;
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
        if (target instanceof Array) return target.map(t=>me.removeItem({...options, target: t}));
        if (me.children.length <= me.min_items) {
            switch (failback) {
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
                    if (autoscroll == "elegant") {
                        makeRoom(child.target, child.target.offsetHeight);
                    } else {
                        const moveTarget = (
                            autoscroll == "self" ? child
                            : autoscroll == "parent" ? child.parent
                            : null
                        );
                        if (moveTarget) moveTarget.moveTo();
                    };
                    child.target.remove();
                    return false;
                };
                return true;
            })
            .map((c,i)=>(c.name = i, c))
        ;
        me.getActions("count").forEach(
            acc=>acc.target.innerText = String(me.children.length)
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
    @action
    empty() {//{{{
        const me = this;
        return me.import([]);
    };//}}}
    @action
    count() {}; // Does nothing. Just allow reinject contents to it.
};
