// types/input.type.js
// ===================
import {form} from "./form.type.js";
import {action} from "./trigger.type.js";
import {export_to_target} from "../decorators/export_to_target.deco.js";
import {import_from_target} from "../decorators/import_from_target.deco.js";
import {parseJSON, isHiddenByClosedDetails} from "../lib/helpers.js";

// Symbol used to mark a native keydown event as already handled for Enter
// navigation.  Guards against the same event object being dispatched to our
// hook more than once.
const sym_enter_handled = Symbol('smarkform_enter_handled');

// Find the adjacent field (next or prev) from `context`, walking up through
// ancestor lists when the current level has no more siblings.  This replaces
// the old 2-level `find(".+1") || find("../.+1")` pattern so that Enter
// correctly crosses from the last field of a nested form-type list item up
// into the parent form and beyond.
function findAdjacentField(context, backwards) {
    const delta = backwards ? '.-1' : '.+1';
    // First try a sibling on the same level.
    let candidate = context.find(delta);
    if (!candidate) {
        // Walk up through ancestors until we find a sibling or exhaust parents.
        let ancestor = context;
        while (!candidate) {
            ancestor = ancestor?.parent;
            if (!ancestor) break;
            candidate = ancestor.find(delta);
        }
    }
    return candidate || undefined;
}

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
                    // Guard: skip if this event was already handled.
                    if (ev.originalEvent[sym_enter_handled]) return;
                    ev.originalEvent[sym_enter_handled] = true;
                    // IME-advance guard: Chromium's IME_ACTION_NEXT natively
                    // moves focus to the next field (firing focus(N)) and then
                    // dispatches a synthetic keydown(Enter) on that same field
                    // — all in the same browser task.  events.js detects this
                    // (focus + keydown in the same task, no microtask gap) and
                    // stamps _sfImeAdvanced on the native event.  The IME
                    // already advanced focus; we must not navigate again.
                    //
                    // Short-circuit synthetic keydown events produced after native IME focus advances
                    // (Chromium mobile IME_ACTION_NEXT). See PR #112 and commit:
                    // https://github.com/bitifet/SmarkForm/commit/5c67cc9993e186060c4e9c33244dc613c9b51294
                    // Upstream bug: https://issues.chromium.org/issues/492805133
                    // Illustrative canonical form of the check below:
                    // if (ev.originalEvent && ev.originalEvent._sfImeAdvanced) return;
                    if (ev.originalEvent._sfImeAdvanced) return;
                    const backwards = ev.originalEvent.shiftKey;
                    const altKey = ev.originalEvent.altKey;
                    if (
                        ev.context.targetNode.tagName === "TEXTAREA"
                        && ! ev.originalEvent.ctrlKey
                        && ! backwards
                    ) return; // Require Ctrl key to escape textareas.
                    // Find the adjacent field, traversing up through ancestor
                    // lists as needed (fixes navigation from the last field of
                    // a nested form-type list item to the next list item or to
                    // the field after the list).
                    let nextField = findAdjacentField(ev.context, backwards);
                    let openHidden = false;
                    if (altKey) {
                        // Alt+Enter / Alt+Shift+Enter: open closed <details> so
                        // the user can navigate into hidden fields.
                        if (nextField) {
                            // If the destination's root is itself a closed
                            // <details> (e.g. a list item form), open it first.
                            if (
                                nextField.targetNode.tagName === 'DETAILS'
                                && !nextField.targetNode.open
                            ) nextField.targetNode.open = true;
                            // Open any remaining closed <details> ancestors.
                            let node = nextField.targetNode.parentElement;
                            while (node) {
                                if (node.tagName === 'DETAILS' && !node.open) node.open = true;
                                node = node.parentElement;
                            }
                            openHidden = true; // let focus() recurse into hidden children
                        }
                    } else {
                        // Default Enter (both forward and backward): skip fields
                        // that are hidden inside a closed <details> — keeps
                        // navigation on visible fields only.
                        const seen = new Set();
                        while (nextField && isHiddenByClosedDetails(nextField.targetNode)) {
                            if (seen.has(nextField)) break; // Safety: prevent loops
                            seen.add(nextField);
                            const further = findAdjacentField(nextField, backwards);
                            if (!further) { nextField = null; break; }
                            nextField = further;
                        }
                    }
                    if (nextField) {
                        ev.originalEvent.preventDefault();
                        ev.originalEvent.stopPropagation();
                        nextField.focus({backwards, openHidden});
                    };
                };
            },
        );
    }; // }}}
    _setTargetFieldValue(value) {//{{{
        const me = this;
        if (me.isSingleton) return; // (Only for real field)
        me.targetFieldNode.value = value;
        if (me._maskInstance != null) {
            me.targetFieldNode.dispatchEvent(new Event("input", {bubbles: true}));
        };
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
        // Prevent native IME "Next" focus advance on Chromium-based mobile
        // browsers (e.g. Brave for Android).
        //
        // When an <input> is inside a <form> with more inputs, Chromium
        // automatically tells the Android IME to use IME_ACTION_NEXT, which
        // causes the soft-keyboard to show "Next" on the action key.  When
        // the user presses it the browser calls FocusNextElement() at the
        // native layer — completely bypassing JavaScript — and focus advances
        // to the next DOM input before any JS event fires.  SmarkForm's async
        // keydown hook then fires (triggered by the synthesised KeyEvent the
        // keyboard also sends) and advances focus a second time, skipping one
        // item per press.
        //
        // Setting enterkeyhint to any value other than "next" makes Chromium
        // use a different IME action (e.g. IME_ACTION_DONE) that does NOT
        // advance focus natively, leaving SmarkForm's own Enter-key navigation
        // as the sole handler.  We only set it when the author has not already
        // specified an enterkeyhint, so explicit overrides are always respected.
        {
            const fld = me.targetFieldNode;
            const tag = fld.tagName?.toUpperCase();
            const type = fld.type?.toLowerCase?.() ?? '';
            if (
                tag === 'INPUT'
                && type !== 'submit'
                && type !== 'button'
                && type !== 'image'
                && type !== 'reset'
                && type !== 'checkbox'
                && type !== 'radio'
                && !fld.hasAttribute('enterkeyhint')
            ) {
                fld.setAttribute('enterkeyhint', 'done');
            }
        }
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
        } else if (
            me._maskInstance != null
            && me._maskInstance.unmaskedValue !== undefined
        ) {
            retv = me._maskInstance.unmaskedValue;
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
    mask(callback) {//{{{
        const me = this;
        // For singletons, delegate to the inner field so _maskInstance lives
        // where export() reads it from.
        if (me.isSingleton) {
            me.children[""].mask(callback);
            return me;
        };
        const fld = me.targetFieldNode;
        if (
            fld
            && fld.tagName === "INPUT"
        ) {
            const currentType = (fld.getAttribute("type") || "text").toLowerCase();
            if (currentType !== "text") {
                me._originalType = currentType;
                fld.setAttribute("type", "text");
            };
        };
        me._maskInstance = callback(fld) ?? null;
        return me;
    };//}}}
};
