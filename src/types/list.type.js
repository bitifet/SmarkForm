// types/list.type.js
// ==================

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
            for(let i=0; i<me.min_items; i++) await me.addItem({silent: true});

            // Initialize "count" actions and reinject empty_list template:
            if (me.min_items == 0) await me.renum();

            // Let screen readers know lists may change.
            me.targetNode.setAttribute("aria-live", "polite");
            me.targetNode.setAttribute("aria-atomic", "true");
        });
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
        const stripEmpties = ! me.inheritedOption("exportEmpties", false);
        for (const child of me.children) {
            if (stripEmpties && await child.isEmpty()) {
                if (list.length < me.min_items) emptyChilds.push(child);
                continue;
            };
            list.push(await child.export(null, {silent: true}));
        };
        for (let i=0; list.length < me.min_items; i++) {
            list.push(await emptyChilds[i].export(null, {silent: true}));
        };
        return list;
    };//}}}
    @action
    @import_from_target
    async import(data = [], {focus} = {}) {//{{{
        const me = this;
        // Auto-update in case of scalar to array template upgrade:
        if (! (data instanceof Array)) data = [data];
        // Load data:
        for (
            let i = 0;
            i < Math.min(data.length, me.max_items); // Limit to allowed items
            i++
        ) {
            if (me.children.length <= i) await me.addItem({silent: true}); // Make room on demand
            await me.children[i].import(data[i], {focus, silent: true});
        };
        // Remove extra items if possible (over min_items):
        for (
            let i = Math.max(data.length, me.min_items);
            i < me.children.length;
        ) await me.removeItem({silent: true});
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
        ) me.children[i].clear({silent: true});
        if (focus) me.focus();
        return; // await me.export(null, {silent: true});
    };//}}}
    @action
    @mutex("list_mutating")
    @smartdisabling
    async addItem(_data, options = {}) {//{{{
        const me = this;
        // Parameters checking and resolution:{{{
        options.action = "addItem";
        options.origin ||= null; // (Internal call)
        options.context ||= me;  // (Internal call)
        options.source ||= null; // Source component to copy data from.
        options.target ||= null; // Target child component to insert before/after.
        options.position ||= "after";
        options.autoscroll ||= null;   // "elegant" / "self" / "parent" / (falsy)
        options.failback ||= "throw";  // "none" / "throw" (default)
        if (options.position != "after" && options.position != "before") throw me.renderError(
            'LIST_WRONG_ADDITEM_POSITION'
            , `Invalid value for addItem() position property: ${options.position}`
        );
        if (me.children.length >= me.max_items) {
            switch (options.failback) {
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
        if (me.children.length && ! options.target) options.target = ( // Auto target:
            options.position == "before" ?  me.children[0] // Insert at the beginning
            : me.children[me.children.length - 1]  // Append at the end
        );
        //}}}
        // DOM element creation:{{{
        const newItemTarget = me.templates.item.cloneNode(true);
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
                    if (! child.targetNode.isSameNode(options.target.targetNode)) {
                        return child;
                    } else {
                        // Append or prepend new item to the target child:
                        child.targetNode[options.position](newItemTarget);
                            // Note that options.position is ensured to be "after" or "before" above.
                        newItem = await me.enhance(newItemTarget, {type: "form"});
                        await newItem.rendered;
                        const chunk = [child, newItem];
                        // Ensure correct order:
                        if (options.position == "before") chunk.reverse();
                        return chunk; // Array that will be flattened later...
                    };
                })
            ))
                .flat()
            ;
        };
        await me.renum();
        //}}}
        // Copy data from source component if specified:{{{
        if (options.source) {
            const sourceComponent = newItem.find(options.source);
            if (!! sourceComponent) {
                const data = await sourceComponent.export();
                await newItem.import(data, {silent: true});
            };
        };
        //}}}
        // Autoscroll handling:{{{
        if (options.autoscroll == "elegant" && !! newItem) {
            makeRoom(newItem.targetNode, - newItem.offsetHeight);
        } else {
            const moveTarget = (
                ! newItem ? null
                : options.autoscroll == "self" ? newItem
                : options.autoscroll == "parent" ? newItem.parent
                : null
            );
            if (moveTarget) moveTarget.moveTo();
        };
        //}}}
        if (me.renderedSync) newItem.focus();
        return newItem;
    };//}}}
    @action
    @mutex("list_mutating")
    @smartdisabling
    async removeItem(_data, options = {}) {//{{{
        const me = this;
        options.action = "removeItem";
        options.origin ||= null; // (Internal call)
        options.context ||= me;  // (Internal call)
        options.target ||= null; // Target child component to remove.
        options.autoscroll ||= null;   // "elegant" / "self" / "parent" / (falsy)
        let preserve_non_empty = options.preserve_non_empty ||= false;
        options.failback ||= "throw";  // "none" / "clear" / "throw" (default)
        if (! options.target) {
            if (preserve_non_empty) for (
                const t of [...me.children]
                .reverse() // Pick last first
            ) if (await t.isEmpty()) {
                options.target = t;
                break;
            };
            if (! options.target) {
                options.target = me.children[me.children.length - 1];
                preserve_non_empty = false;
                // Allow non empty removal as last chance if no target
                // specified.
            };
        };
        const targets = (
            options.target instanceof Array ? options.target
            : [options.target]
        );
        for (const currentTarget of [...targets].reverse()) {
            if (me.children.length <= me.min_items) {
                switch (options.failback) {
                    case "none":
                        break;
                    case "clear":
                        await currentTarget.clear({silent: true});
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
            if (preserve_non_empty && ! await currentTarget.isEmpty()) continue;
            // Locate target child and rebuild children array without it:{{{
            let oldItem = null;
            let newFocusPosition = null;
            const newChildren = me.children
                .filter((child, i, all)=>{
                    if (child.targetNode.isSameNode(currentTarget.targetNode)) {
                        if (options.autoscroll == "elegant") {
                            makeRoom(child.targetNode, child.targetNode.offsetHeight);
                        } else {
                            const moveTarget = (
                                options.autoscroll == "self" ? child
                                : options.autoscroll == "parent" ? child.parent
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
            // }}}
            // Perform removal:{{{
            await me.emit("removeItem_beforeRender", {
                ...options,
                target: oldItem,
                targetNode: oldItem.targetNode,
            }, false);
            await oldItem.unrender();
            me.children = newChildren;
            await me.renum();
            await me.emit("removeItem_afterRender", {
                ...options,
                target: oldItem,
                targetNode: oldItem.targetNode,
            }, false);
            if (newFocusPosition !== null) {
                me.children[newFocusPosition].focus();
            };
            // }}}
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
    async clear(_data, {focus} = {}) {//{{{
        const me = this;
        return await me.import([], {focus, silent: true});
    };//}}}
    @action
    count(_data, {delta = 0} = {}) {//{{{
        // Return number of children.
        // But also it's sole existence allow reinjecting contents to it.
        const me = this;
        return me.children.length + Number(delta);
    };//}}}
    @action
    position(_data, {target, offset = 1} = {}) {//{{{
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
            tgg.targetNode.innerText = me.position(args.data, {...args, silent: true});
        });
        me.getTriggers("count").forEach(tgg=>{
            const me = this;
            const args = tgg.getTriggerArgs();
            tgg.targetNode.innerText = me.count(args.data, {...args, silent: true});
        });
    };//}}}
};
