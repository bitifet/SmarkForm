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


import {SmarkField} from "../lib/component.js";
import {smartdisabling} from "./list.decorators/smartdisabling.deco.js";
import {action} from "./trigger.type.js";
import {foldable} from "../decorators/foldable.deco.js";
import {sortable} from "./list.decorators/sortable.deco.js";
import {export_to_target} from "../decorators/export_to_target.deco.js";
import {import_from_target} from "../decorators/import_from_target.deco.js";
import {mutex} from "../decorators/mutex.deco.js";
import {makeRoom, getRoots, parseJSON} from "../lib/helpers.js";


// Private helpers:
// ----------------

function makeNonNavigable(target) {//{{{
    if (
        // Tabindex not explicitly defined:
        target.getAttribute("tabindex") === null
    ) {
        target.setAttribute("tabindex", "-1");
    };
};//}}}

function loadTemplates(me) {//{{{
    const templates = {};
    for (const child of [...me.targetNode.children]) {
        const {role = "item"} = parseJSON(child.getAttribute("data-smark")) || {};
        switch (role) {
            case "empty_list":
            case "header":
            case "separator":
            case "last_separator":
            case "footer":
            case "placeholder": // (Only with max_items defined)
                child.setAttribute("data-role", role);
            case "item": // (Default)
                if (templates[role] !== undefined) throw me.renderError(
                    'LIST_DUPLICATE_TEMPLATE'
                    , `Repated list template role ${role}`
                );
                templates[role] = child;
                templates[role].remove();
            break;
        };
    };
    if (me.targetNode.children.length) {
        const {role = "(unspecified)"} = parseJSON(
            me.targetNode.children[0].getAttribute("data-smark")
        ) || {};
        throw me.renderError(
            'LIST_UNKNOWN_TEMPLATE_ROLE'
            , `Unknown list template role ${role}`
        );
    };
    if (! templates.last_separator) {
        templates.last_separator = templates.separator; // (If any)
    };
    if (
        templates.item.querySelector("[id]") !== null // Contains IDs
    ) throw me.renderError(
        'LIST_CONTAINS_ID'
        , `List components are not allowed to contain elements with 'id' attribute`
    );
    return templates;
};//}}}




// List component type:
// --------------------

@foldable
@sortable
@smartdisabling
export class list extends SmarkField {
    async #appendChild(child) {//{{{
        const me = this;
        if (me.templates.header) {
            me.templates.header.after(child);
        } else {
            me.targetNode.appendChild(child);
        };
    };//}}}
    async render () {//{{{
        const me = this;
        me.originalDisplayProp = me.targetNode.style.display;

        me.min_items = Math.max(0,
            typeof me.options.min_items == "number" ? me.options.min_items
            : 1
        );
        me.max_items = Math.max(me.min_items,
            typeof me.options.max_items == "number" ? me.options.max_items
            : Infinity
        );
        me.children = [];
        me.templates = loadTemplates(me);
        me.placeholders = [];
        const tplOptions = me.getNodeOptions(
            me.templates.item
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

        for (const tpl of [
            me.templates.header,
            me.templates.footer,
        ]) if (!! tpl) {
            me.targetNode.appendChild(tpl);
            // Enhance childs:
            for (
                const node
                of getRoots(tpl, me.selector)
            ) {
                const newItem = await me.enhance(node);
                if (!! newItem?._isField) {
                    throw me.renderError(
                        'FIELD_IN_WRONG_LIST_TEMPLATE'
                        , `Fields are not allowed in list's template roles other than item.`
                    );
                };
            };
        };

        // onRendered tweaks:
        me.root.onRendered(async ()=>{
            for(let i=0; i<me.min_items; i++) await me.addItem();

            // Initialize "count" actions and reinject empty_list template:
            if (me.min_items == 0) await me.renum();

            // Let screen readers know lists may change.
            me.targetNode.setAttribute("aria-live", "polite");
            me.targetNode.setAttribute("aria-atomic", "true");
        });
        return;
    };//}}}
    onTriggerRender({action, origin, context}) {//{{{
        switch (action) {
            case "addItem":
            case "removeItem":
                if (
                    // Placed inside
                    (1 + [...origin.parents].findIndex(p=>Object.is(p, context)))
                    && origin.options.hotkey
                ) {
                    // Skip them in keyboard navigation.
                    makeNonNavigable(origin.targetNode);
                };
                break;
        };
    };//}}}
    @mutex("list_mutating")
    @action
    @export_to_target
    async export() {//{{{
        const me = this;
        const list = [];
        const emptyChilds = [];
        const stripEmpties = ! me.inherittedOption("exportEmpties", false);
        for (const child of me.children) {
            if (stripEmpties && await child.isEmpty()) {
                if (list.length < me.min_items) emptyChilds.push(child);
                continue;
            };
            list.push(await child.export())
        };
        for (let i=0; list.length < me.min_items; i++) {
            list.push(await emptyChilds[i].export());
        };
        return list;
    };//}}}
    @action
    @import_from_target
    async import({data = [], focus} = {}) {//{{{
        const me = this;
        // Auto-update in case of scalar to array template upgrade:
        if (! (data instanceof Array)) data = [data];
        // Load data:
        for (
            let i = 0;
            i < Math.min(data.length, me.max_items); // Limit to allowed items
            i++
        ) {
            if (me.children.length <= i) await me.addItem(); // Make room on demand
            await me.children[i].import({data: data[i], focus});
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
        ) me.children[i].clear();
        if (focus) me.focus();
        return; // await me.export();
    };//}}}
    @action
    @mutex("list_mutating")
    @smartdisabling
    async addItem(options = {}) {//{{{
        const me = this;
        // Parameters checking and resolution:{{{
        let {
            action,
            origin = null, // (Internal call)
            context = me,  // (Internal call)
            source = null,
            target,
            position = "after",
            autoscroll,   // "elegant" / "self" / "parent" / (falsy)
            failback,
        } = options;
        if (position != "after" && position != "before") throw me.renderError(
            'LIST_WRONG_ADDITEM_POSITION'
            , `Invalid value for addItem() position property: ${position}`
        );
        if (me.children.length >= me.max_items) {
            switch (failback) {
                case "none":
                    break;
                case "throw":
                default:
                    me.emit("error", {
                        code: 'LIST_MAX_ITEMS_REACHED',
                        message: `Cannot add items over max_items boundary`,
                        options,
                    });
            };
            return;
        };
        if (me.children.length && ! target) target = ( // Auto target:
            position == "before" ?  me.children[0] // Insert at the beginning
            : me.children[me.children.length - 1]  // Append at the end
        );
        //}}}
        // DOM element creation:{{{
        const newItemTarget = me.templates.item.cloneNode(true);
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
            await me.#appendChild(newItemTarget);
            newItem = await me.enhance(newItemTarget, {type: "form", name: 0});
            await newItem.rendered;
            me.children.push(newItem);
            newItem.name = 0;
        } else {
            me.children = (await Promise.all(
                me.children.map(async (child, i)=>{
                    if (! child.targetNode.isSameNode(target.targetNode)) return child;
                    if (position == "after") {
                        child.targetNode.after(newItemTarget);
                        newItem = await me.enhance(newItemTarget, {type: "form"});
                        await newItem.rendered;
                        return [child, newItem]; // Right order, flatted later...
                    } else {
                        child.targetNode.before(newItemTarget);
                        newItem = await me.enhance(newItemTarget, {type: "form"});
                        await newItem.rendered;
                        return [newItem, child]; // Right order, flatted later...
                    };
                })
            ))
                .flat()
            ;
        };
        await me.renum();
        //}}}
        // Copy data from source component if specified:{{{
        if (source) {
            const sourceComponent = newItem.find(source);
            if (!! sourceComponent) {
                const data = await sourceComponent.export();
                newItem.import({data});
            };
        };
        //}}}
        // Autoscroll handling:{{{
        if (autoscroll == "elegant" && !! newItem) {
            makeRoom(newItem.targetNode, - newItem.offsetHeight);
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
        if (me.renderedSync) newItem.focus();
    };//}}}
    @action
    @mutex("list_mutating")
    @smartdisabling
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
                        await currentTarget.clear();
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
            let newFocusPosition = null;
            const newChildren = me.children
                .filter((child, i, all)=>{
                    if (child.targetNode.isSameNode(currentTarget.targetNode)) {
                        if (autoscroll == "elegant") {
                            makeRoom(child.targetNode, child.targetNode.offsetHeight);
                        } else {
                            const moveTarget = (
                                autoscroll == "self" ? child
                                : autoscroll == "parent" ? child.parent
                                : null
                            );
                            if (moveTarget) moveTarget.moveTo();
                        };

                        oldItem = child;

                        newFocusPosition = (
                            (all.length -i > 1) ? newFocusPosition = i // More above
                            : i == 0 ? null           // No items left
                            : i - 1                   // Removing last item
                        );

                        return false;
                    };
                    return true;
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
                oldItemTarget: oldItem.targetNode, // Its target (analogous to addItem event).
                options,
                onRemoved: cbk => onRemovedCbks.push(cbk),
            });
            //}}}

            oldItem.targetNode.remove();
            me.children = newChildren;
            await me.renum();

            // Execute "onRemoved" callbacks:{{{
            onRemovedCbks.forEach(cbk=>cbk());
            //}}}

            if (newFocusPosition !== null) {
                me.children[newFocusPosition].focus();
            };

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
    async clear({focus} = {}) {//{{{
        const me = this;
        return await me.import({data: [], focus});
    };//}}}
    @action
    count({delta = 0} = {}) {//{{{
        // Return number of children.
        // But also it's sole existence allow reinjecting contents to it.
        const me = this;
        return me.children.length + Number(delta);
    };//}}}
    @action
    position({target, offset = 1} = {}) {//{{{
        return Number(target?.name) + Number(offset);
    };//}}}
    async renum(){//{{{
        const me = this;

        // Update child index:
        for (const i in me.children) {
            me.children[i].name = i;
            me.children[i].updateId();
        };

        // Handle separators:
        if (
            !! me.templates.separator
            || !! me.templates.last_separator
        ) for (const i in me.children) {

            const isLastNode = i >= me.children.length - 1;
            const sepRole = (
                i <= 0 ? null
                : isLastNode ? "last_separator"
                : "separator"
            );

            const currentNode = me.children[i].targetNode;
            const prevNode = currentNode.previousElementSibling;
            const prevNode_role = prevNode && prevNode.getAttribute("data-role");
            if (prevNode_role !== sepRole) {
                if (!! prevNode_role) prevNode.remove();
                const sepTemplate = me.templates[sepRole];
                if (!! sepRole && !! sepTemplate) currentNode.parentElement.insertBefore(sepTemplate.cloneNode(true), currentNode);
            };
            if (isLastNode) { // LastItem
                const nextNode = currentNode.nextElementSibling;
                if (!! nextNode) nextNode.remove();
            };

        };

        // Handle empty_list template:
        if (me.templates.empty_list) {
            if (me.children.length) {
                me.templates.empty_list.remove(); // (from DOM)
            } else {
                await me.#appendChild(me.templates.empty_list);
            };
        };

        // Handle placeholder template:
        if (
            me.templates.placeholder
            && !! me.max_items // (Only if we have a finite padding limit)
        ) {
            let placeHoldersCount = (me.max_items || 0) - me.children.length;
            if (
                placeHoldersCount > 0
                && me.children.length === 0
                && !! me.templates.empty_list
            ) placeHoldersCount--; // Discount the hole occupied by empty_list
            if (me.placeholders.length < placeHoldersCount) {
                for (let i = me.placeholders.length; i < placeHoldersCount; i++) {
                    const placeholder = me.templates.placeholder.cloneNode(true);
                    if (me.templates.footer) {
                        me.templates.footer.before(placeholder);
                    } else {
                        me.targetNode.appendChild(placeholder);
                    };
                    me.placeholders.push(placeholder);
                };
            } else { // me.placeholders.length >= placeHoldersCount
                for (let i = me.placeholders.length; i > placeHoldersCount; i--) {
                    me.placeholders.pop().remove();
                };
            };
        };

        // Update counter triggers:
        me.getTriggers("position").forEach(tgg=>{
            const me = this;
            const args = tgg.getTriggerArgs();
            tgg.targetNode.innerText = me.position(args);
        });
        me.getTriggers("count").forEach(tgg=>{
            const me = this;
            const args = tgg.getTriggerArgs();
            tgg.targetNode.innerText = me.count(args);
        });
    };//}}}
};
