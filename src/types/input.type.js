// types/input.type.js
// ===================
import {form} from "./form.type.js";
import {action} from "./trigger.type.js";
import {export_to_target} from "../decorators/export_to_target.deco.js";
import {import_from_target} from "../decorators/import_from_target.deco.js";
import {parseJSON} from "../lib/helpers.js";
export class input extends form {
    constructor(...args) {//{{{
        super(...args);
        const me = this;
        me.defaultValue = "";
        me.emptyValue = ""; // Type-level empty state for clear action
        me.eventHooks.keydown.push(
            function keydown_hook(ev) {
                if (ev.defaultPrevented) return;
                if (ev.originalEvent.key === "Enter") {
                    const backwards = ev.originalEvent.shiftKey;
                    if (
                        ev.context.targetNode.tagName === "TEXTAREA"
                        && ! ev.originalEvent.ctrlKey
                        && ! backwards
                    ) return; // Require Ctrl key to escape textareas.
                    let nextField = (
                        ! backwards ? ev.context.find(".+1") || ev.context.find("../.+1")
                        : ev.context.find(".-1") || ev.context.find("../.-1")
                    );
                    if (nextField) {
                        nextField.focus();
                        ev.originalEvent.preventDefault();
                        ev.originalEvent.stopPropagation();
                    };
                };
            },
        );
    }; // }}}
    _setTargetFieldValue(value) {//{{{
        const me = this;
        if (me.isSingleton) return; // (Only for real field)
        me.targetFieldNode.value = value;
    };//}}}
    async render() {//{{{
        const me = this;
        me.isSingleton = ! (
            me.targetNode.tagName === "INPUT"
            || me.targetNode.tagName === "SELECT"
            || me.targetNode.tagName === "TEXTAREA"
        );
        me.isCheckbox = (
            ! me.isSingleton
            && String(me.targetNode.type).toLowerCase() == "checkbox"
        );
        if (me.isSingleton) {
            await super.render();
            const sons = Object.values(me.children);
            if (sons.length != 1) throw me.renderError(
                'NOT_A_SINGLETON'
                , `Singleton forms are only allowed to contain exactly one`
                + ` data field but ${sons.length} found.`
            );
            const son = sons[0];
            if (me.options.type !== son.options.type) throw me.renderError(
                'SINGLETON_TYPE_MISMATCH'
                , `Singleton type (${me.options.type})`
                + ` does not match child field type (${son.options.type}).`
            );
            me.targetFieldNode = son.targetNode;
        } else {
            me.targetFieldNode = me.targetNode;
        };
    };//}}}
    @action
    @export_to_target
    async export(_data, options) {//{{{
        const me = this;
        if (me.isSingleton) return await me.children[""].export(_data, options);
        const nodeFld = me.targetFieldNode;
        let retv;
        if (me.isCheckbox) {
            retv = !! nodeFld.checked;
        } else if (
            me.options.encoding === "json"
            && nodeFld.tagName.toUpperCase() === "SELECT"
            && nodeFld.options[nodeFld.selectedIndex]?.getAttribute("value") === null
        ) {
            // Keep fallback working when encoding is json and value attribute is not set.
            // (and don't expetct <opton> inner text to be JSON)
            retv = JSON.stringify(nodeFld.options[nodeFld.selectedIndex].text);
        } else {
            retv = nodeFld.value;
        };
        return (
            me.options.encoding === "json" ? parseJSON(retv) || null
            : retv
        );
    };//}}}
    @action
    @import_from_target
    async import(data, options = {}) {//{{{
        const me = this;
        if (me.isSingleton) return await me.children[""].import(data, options);
        const isReset = data === undefined;
        // Undefined clears to default:
        if (isReset) data = me.defaultValue;
        let {focus = false, silent = false, setDefault = true} = options;
        const nodeFld = me.targetFieldNode;
        if (
            typeof data === "object"
            && me.options.type === "input"    // Not in a derivated field types
            || me.options.encoding === "json" // JSON encoding specified
        ) {
            data ||= null;
            const isTextarea = nodeFld.tagName.toUpperCase() === "TEXTAREA";
            data = (
                isTextarea ? JSON.stringify(data, null, 4) // Pretty print
                : JSON.stringify(data) // Compact print
            ) || "";
        };
        if (me.isCheckbox) {
            me.targetNode.checked = !! data;
        } else if (
            me.options.encoding === "json"
            && nodeFld.tagName.toUpperCase() === "SELECT"
        ) {
            me._setTargetFieldValue(data || "null"); // Faster, but won't work if value attribute is not set.
            if (nodeFld.selectedIndex === -1) {
                // Fallback when value attribute is not set.
                const parsed = parseJSON(data) || "";
                const idx = Array.from(nodeFld.options).findIndex(
                    opt => opt.text === parsed
                );
                if (idx !== -1) nodeFld.selectedIndex = idx;
            };
        } else {
            me._setTargetFieldValue(data);
        };
        if (!isReset && setDefault) {
            me.defaultValue = await me.export(null, {silent: true});
        };
        if (focus && !silent) me.focus();
        return me.targetNode.value;
    };//}}}
    async isEmpty() {//{{{
        const me = this;
        const value = (
            me.isCheckbox ? "" // Do not consider checkboxes.
            : await me.export(null, {silent: true})
        );
        return ! value.trim().length;
            // Native input's value type is always a string.
    };//}}}
};
