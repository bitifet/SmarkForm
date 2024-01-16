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


import {SmarkComponent} from "../lib/component.js";
import {makeRoom} from "../lib/helpers.js";
import {foldable} from "../decorators/foldable.deco.js";
import {action} from "./trigger.type.js";
import {mutex} from "../decorators/mutex.deco.js";


// Helpers:
// --------

function makeNonNavigable(target) {//{{{
    if (
        // Tabindex not explicitly defined:
        target.getAttribute("tabindex") === null
    ) {
        target.setAttribute("tabindex", "-1");
    };
};//}}}


// List component type:
// --------------------

@foldable
export class list extends SmarkComponent {
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
                type: me.options.of, // Allow to specify items type from list declaration.
            }
        );
        if (
            me.options.of
            && tplOptions.type != me.options.of
        ) throw me.renderError(
            'LIST_ITEM_TYPE_MISSMATCH'
            , `List item type missmatch`
        );
        // onRendered tweaks:
        me.root.onRendered(async ()=>{
            for(let i=0; i<me.min_items; i++) await me.addItem();
            if (me.min_items == 0) {
                // Update "count" actions in case of not already updated by
                // me.addItem:
                me.getTriggers("count").forEach(
                    acc=>acc.target.innerText = String(me.children.length)
                );
            };
        });
        me.itemTpl.remove();

        // Sortable implementation:
        me.sortable = !! me.options.sortable;
        me.itemTpl.setAttribute("draggable", me.sortable);
        me.children.forEach(c=>c.target.setAttribute("dragable", me.sortable));
        if (me.sortable) {
            let dragSource = null;
            let dragDest = null;
            me.target.addEventListener("dragstart", e => {
                if (dragSource === null) {
                    dragSource = e.target
                } else {
                    // Single dragging at a time.
                    e.preventDefault();
                };
            });
            me.target.addEventListener("dragover", e => e.preventDefault());
            me.target.addEventListener("drop", e => {
                let target = e.target;
                while (
                    target.parentElement
                    && target.parentElement != dragSource.parentElement
                ) target = target.parentElement;
                dragDest = target;
            });
            me.target.addEventListener("dragend", async () => {
                if (dragDest)  await me.move(
                    me.getComponent(dragSource)
                    , me.getComponent(dragDest)
                );
                dragSource = null;
                dragDest = null;
            });
        };

        return;
    };//}}}
    async move(from, to) {//{{{
        const me = this;
        if (
            to === null // Dropped outside
            || from === null // (Shouldn't happen)
        ) return;
        const fromi = Number(from?.name);
        const toi = Number(to?.name);
        if (fromi == toi) {
            return;
        } else if (fromi < toi) {
            const newChunk = [
                ...me.children.slice(fromi + 1, toi + 1),
                me.children[fromi],
            ].map((c, i)=>{
                c.name = i+fromi;
                c.updateId();
                return c;
            });
            me.children.splice(fromi, toi - fromi + 1, ...newChunk);
        } else if (fromi > toi) {
            const newChunk = [
                me.children[fromi],
                ...me.children.slice(toi, fromi),
            ].map((c, i)=>{
                c.name = i+toi;
                c.updateId();
                return c;
            });
            me.children.splice(toi, fromi - toi + 1, ...newChunk);
        };
        const inc = fromi < toi ? 1 : -1;
        const moveMethod = inc > 0 ? "after" : "before";
        to.target[moveMethod](from.target);
    };//}}}
    onTriggerRender({action, origin}) {//{{{
        switch (action) {
            case "addItem":
            case "removeItem":
                makeNonNavigable(origin.target);
                break;
        };
    };//}}}
    @mutex("list_mutating")
    @action
    async export() {//{{{
        const me = this;
        const list = [];
        const stripEmpties = ! me.inherittedOption("exportEmpties", false);
        for (const child of me.children) {
            if (stripEmpties && await child.isEmpty()) continue;
            list.push(await child.export())
        };
        return list;
    };//}}}
    @action
    async import({data = []}) {//{{{
        const me = this;
        // Auto-update in case of scalar to array template upgrade:
        if (! data instanceof Array) data = [data];
        // Load data:
        for (
            let i = 0;
            i < Math.min(data.length, me.max_items); // Limit to allowed items
            i++
        ) {
            if (me.children.length <= i) await me.addItem(); // Make room on demand
            await me.children[i].import({data: data[i]});
        };
        // Remove extra items if possible (over min_items):
        for (
            let i = Math.max(data.length, me.min_items);
            i < me.children.length;
        ) await me.removeItem();
        // Report if data doesn't fit:
        if (data.length > me.max_items) {
            me.emit("error", {
                code: 'LIST_IMPORT_OVERFLOW',
                message: `Trying to import array greater than list's max_items. Data beyond max_items ignored.`,
                context: me,
                data,
                options: me.options,
            });
        };
        // Clear items over imported data if min_items is greater:
        for (
            let i = data.length;
            i < me.children.length; // (Due to min_items)
            i++
        ) me.children[i].empty();
        return; // await me.export();
    };//}}}
    @action
    @mutex("list_mutating")
    async addItem(options = {}) {//{{{
        const me = this;
        // Parameters checking and resolution:{{{
        let {
            action,
            origin = null, // (Internal call)
            context = me,  // (Internal call)
            target,
            position = "after",
            autoscroll,   // "elegant" / "self" / "parent" / (falsy)
        } = options;
        if (position != "after" && position != "before") throw me.renderError(
            'LIST_WRONG_ADDITEM_POSITION'
            , `Invalid value for addItem() position property: ${position}`
        );
        if (me.children.length >= me.max_items) {
            me.emit("error", {
                code: 'LIST_MAX_ITEMS_REACHED',
                message: `Cannot add items over max_items boundary`,
                options,
            });
            return;
        };
        if (me.children.length && ! target) target = ( // Auto target:
            position == "before" ?  me.children[0] // Insert at the beginning
            : me.children[me.children.length - 1]  // Append at the end
        );
        //}}}
        // DOM element creation:{{{
        const newItemTarget = me.itemTpl.cloneNode(true);
        //}}}
        // addItem event emitting:{{{
        const onRenderedCbks = [];
            // Allow for handy callback instead of two separate event handlers
        await me.emit("addItem", {
                action,
                origin,
                context,
                target,  // <--- Effective target.
                position,
                newItemTarget,
                options, // <- Original options (including target)
                onRendered: cbk => onRenderedCbks.push(cbk),
        });
        //}}}
        // Child component creation and insertion:{{{
        let newItem;
        if (! me.children.length) {
            me.target.appendChild(newItemTarget);
            newItem = await me.enhance(newItemTarget, {type: "form", name: 0});
            await newItem.rendered;
            me.children.push(newItem);
            newItem.name = 0;
            newItem.updateId();
        } else {
            me.children = (await Promise.all(
                me.children.map(async (child, i)=>{
                    if (! child.target.isSameNode(target.target)) return child;
                    if (position == "after") {
                        child.target.after(newItemTarget);
                        newItem = await me.enhance(newItemTarget, {type: "form"});
                        await newItem.rendered;
                        return [child, newItem]; // Right order, flatted later...
                    } else {
                        child.target.before(newItemTarget);
                        newItem = await me.enhance(newItemTarget, {type: "form"});
                        await newItem.rendered;
                        return [newItem, child]; // Right order, flatted later...
                    };
                })
            ))
                .flat()
                .map((c,i)=>{
                    c.name = i;
                    c.updateId();
                    return c;
                })
            ;
        };
        //}}}
        // Autoscroll handling:{{{
        if (autoscroll == "elegant" && !! newItem) {
            makeRoom(newItem.target, - newItem.offsetHeight);
        } else {
            const moveTarget = (
                ! newItem ? null
                : autoscroll == "self" ? newItem
                : autoscroll == "parent" ? newItem.parent
                : null
            );
            if (moveTarget) moveTarget.moveTo();
        };
        //}}}
        // Execute "onRendered" callbacks:{{{
        onRenderedCbks.forEach(cbk=>cbk(newItem));
        //}}}
        me.getTriggers("count").forEach(
            acc=>acc.target.innerText = String(me.children.length)
        );
    };//}}}
    @action
    @mutex("list_mutating")
    async removeItem(options = {}) {//{{{
        const me = this;
        let {
            action,
            origin = null, // (Internal call)
            context = me,  // (Internal call)
            target,
            autoscroll,   // "elegant" / "self" / "parent" / (falsy)
            keep_non_empty,
            failback,
        } = options;
        if (! target) {
            if (keep_non_empty) for (
                const t of [...me.children]
                .reverse() // Pick last first
            ) if (await t.isEmpty()) {
                target = t;
                break;
            };
            if (! target) {
                target = me.children[me.children.length - 1];
                keep_non_empty = false;
                // Allow non empty removal as last chance if no target
                // specified.
            };
        };
        const targets = (
            target instanceof Array ? target
            : [target]
        );
        for (const currentTarget of [...targets].reverse()) {
            if (me.children.length <= me.min_items) {
                switch (failback) {
                    case "none":
                        break;
                    case "clear":
                        await currentTarget.empty();
                        return;
                    case "throw":
                    default:
                        me.emit("error", {
                            code: 'LIST_MIN_ITEMS_REACHED',
                            message: `Cannot remove items under min_items boundary`,
                            options,
                        });
                        return;
                };
            };
            if (keep_non_empty && ! await currentTarget.isEmpty()) continue;
            let oldItem = null;
            const newChildren = me.children
                .filter(child=>{
                    if (child.target.isSameNode(currentTarget.target)) {
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

                        oldItem = child;
                        return false;
                    };
                    return true;
                })
                .map((c,i)=>{
                    c.name = i;
                    c.updateId();
                    return c;
                })
            ;
            // removeItem event emitting:{{{
            const onRemovedCbks = [];
                // Allow for handy callback instead of two separate event handlers
            await me.emit("removeItem", {
                action,
                origin,
                context,
                target: currentTarget,  // <--- Effective target.
                oldItem,                 // Child going to be removed.
                oldItemTarget: oldItem.target, // Its target (analogous to addItem event).
                options,
                onRemoved: cbk => onRemovedCbks.push(cbk),
            });
            //}}}

            oldItem.target.remove();
            me.children = newChildren;

            me.getTriggers("count").forEach(
                acc=>acc.target.innerText = String(me.children.length)
            );

            // Execute "onRemoved" callbacks:{{{
            onRemovedCbks.forEach(cbk=>cbk());
            //}}}

        };

    };//}}}
    async isEmpty() {//{{{
        const me = this;
        for (
            const child of me.children
        ) if (
            ! await child.isEmpty()
        ) return false;
        return true;
    };//}}}
    @action
    async empty() {//{{{
        const me = this;
        return await me.import({data: []});
    };//}}}
    @action
    count() {//{{{
        // Return number of children.
        // But also it's sole existence allow reinjecting contents to it.
        const me = this;
        return me.children.length;
    };//}}}
};
