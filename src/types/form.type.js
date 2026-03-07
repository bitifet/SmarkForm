// types/form.type.js
// ==================

import {SmarkField} from "../lib/field.js";
import {action} from "./trigger.type.js";
import {foldable} from "../decorators/foldable.deco.js";
import {export_to_target} from "../decorators/export_to_target.deco.js";
import {import_from_target} from "../decorators/import_from_target.deco.js";
import {getRoots, parseJSON} from "../lib/helpers.js";

// Symbol used to guard against double-binding of the native submit handler.
const sym_submit_bound = Symbol('smarkform_submit_bound');

// Symbol used to record the last explicitly-clicked submit-type button.
// Set by the click listener; cleared by the submit listener.
// A null value means the submission was NOT triggered by a button click
// (e.g. Enter key in a text field or programmatic form.submit()) and
// must be blocked, since SmarkForm uses Enter for field navigation.
const sym_submit_click = Symbol('smarkform_submit_click');

// Flatten a nested export object into a list of {name, value} pairs.//{{{
// keyStyle:   'bracket' (default) → parent[child]  |  'dot' → parent.child
// arrayStyle: 'repeat'  (default) → same name       |  'index' → name[i] / name.i
function flattenData(data, {keyStyle = 'bracket', arrayStyle = 'repeat'} = {}) {
    const entries = [];
    function flatten(value, path) {
        if (value === undefined) return; // omit undefined
        if (value === null) {
            if (path) entries.push({name: path, value: ''});
            return;
        }
        const type = typeof value;
        if (type === 'function' || type === 'symbol') throw new Error(
            'UNSUPPORTED_EXPORT_VALUE'
        );
        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                let childPath;
                if (arrayStyle === 'index') {
                    childPath = keyStyle === 'dot'
                        ? `${path}.${index}`
                        : `${path}[${index}]`;
                } else {
                    childPath = path; // repeat: same key for every element
                }
                flatten(item, childPath);
            });
            return;
        }
        if (type === 'object') {
            for (const [key, val] of Object.entries(value)) {
                const childPath = path
                    ? (keyStyle === 'dot' ? `${path}.${key}` : `${path}[${key}]`)
                    : key;
                flatten(val, childPath);
            }
            return;
        }
        // Primitive: string | number | boolean
        entries.push({name: path, value: String(value)});
    }
    flatten(data, '');
    return entries;
}//}}}

// Submit form data as JSON via fetch().//{{{
async function _submitJSON(data, {action, method, target}) {
    if (target !== '_self') {
        console.warn(
            `SmarkForm: JSON submission to target "${target}" is not supported;`
            + ` coercing to "_self".`
        );
    }
    const response = await fetch(action, {
        method: method.toUpperCase(),
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    if (response.redirected) {
        window.location.assign(response.url);
    } else {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
            const html = await response.text();
            document.open();
            document.write(html);
            document.close();
        }
    }
}//}}}

// Submit flattened entries using a temporary hidden native <form>.//{{{
async function _submitFormEncoded(entries, {action, method, enctype, target}) {
    const normalizedMethod = method.toLowerCase();
    if (normalizedMethod !== 'get' && normalizedMethod !== 'post') throw new Error(
        `SmarkForm: HTTP method "${method}" is not supported for enctype `
        + `"${enctype}". Use enctype="application/json" for non-GET/POST methods.`
    );
    const tempForm = document.createElement('form');
    tempForm.method = normalizedMethod;
    tempForm.action = action;
    tempForm.enctype = enctype;
    tempForm.target = target;
    tempForm.style.display = 'none';
    for (const {name, value} of entries) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        tempForm.appendChild(input);
    }
    document.body.appendChild(tempForm);
    try {
        tempForm.submit();
    } finally {
        // Best-effort cleanup (the page may navigate away before this runs)
        setTimeout(() => tempForm.remove(), 0);
    }
}//}}}

@foldable
export class form extends SmarkField {
    constructor(...args) {
        super(...args);
        const me = this;
        me.defaultValue = {};
        me.emptyValue = {}; // Type-level empty state for clear action
        // Focus forms on click (likewise to field types):
        this.eventHooks.click.push ( ev => {
            if (
                ev.defaultPrevented
                // Unless focus_on_click explicitly set to false
                || ! me.inheritedOption('focus_on_click', true)
            ) return;
            this.focus();
        });
        // Attach native submit interception for root <form> elements:
        if (
            Object.is(me, me.root)
            && me.targetNode.tagName.toLowerCase() === 'form'
            && ! me.targetNode[sym_submit_bound]
        ) {
            me.targetNode[sym_submit_bound] = true;
            // Track explicit clicks on submit-type buttons.  This lets the
            // submit listener distinguish "user clicked a submit button" from
            // "browser fired submit because Enter was pressed in a text field".
            // In SmarkForm, Enter navigates between fields and must NOT submit.
            me.targetNode.addEventListener('click', (ev) => {
                const target = ev.target;
                if (! target) return;
                const tag = target.tagName.toLowerCase();
                const type = (target.getAttribute('type') || '').toLowerCase();
                if (
                    (tag === 'button' && type !== 'reset' && type !== 'button')
                    || (tag === 'input' && (type === 'submit' || type === 'image'))
                ) {
                    me.targetNode[sym_submit_click] = target;
                }
            }, true);
            me.targetNode.addEventListener('submit', async (event) => {
                event.preventDefault();
                const clickedBtn = me.targetNode[sym_submit_click];
                me.targetNode[sym_submit_click] = null;
                // Block submissions not initiated by a submit button click
                // (Enter key in any field, programmatic form.submit(), etc.)
                if (! clickedBtn) return;
                // If the clicked button is a SmarkForm trigger it was already
                // handled by onTriggerClick — don't invoke the action twice.
                const clickedComponent = me.getComponent(clickedBtn);
                if (clickedComponent?.getTriggerArgs?.()) return;
                await me.actions.submit(null, {
                    submitter: event.submitter || clickedBtn,
                });
            });
        }
    };
    mountField(newItem) {
        const me = this;
        if (!! newItem?._isField) {
            if (me.children[newItem.name] !== undefined) throw me.renderError(
                'REPEATED_FIELD_NAME'
                , `Field name '${newItem.name}' used more than once in this form level.`
            );
            me.children[newItem.name] = newItem;
            newItem.updateId();
        };
    };
    async render() {//{{{
        const me = this;
        me.originalDisplayProp = me.targetNode.style.display;
        // Enhance childs:
        for (
            const node
            of getRoots(me.targetNode, me.selector)
        ) {
            const newItem = await me.enhance(node);
            me.mountField(newItem);
        };
    };//}}}
    @action
    @export_to_target
    async export(_data, {exportEmpties} = {}) {//{{{
        const me = this;
        return Object.fromEntries(
            await Promise.all(Object.entries(me.children).map(
                async ([key, child])=>[key, await child.export(null, {silent: true, exportEmpties})]
            ))
        );
    };//}}}
    @action
    @import_from_target
    async import(data, {focus = false, silent = false, setDefault = true} = {}) {//{{{
        const me = this;
        const isReset = data === undefined;
        if (isReset) {
            data = me.defaultValue; // Undefined clears to default:
        } else if (data === "") {
            data = {};
        }
        // Ensure data is a plain object (or valid JSON string):
        const dataConstructor = Object(data).constructor;
        if (
            dataConstructor !== {}.constructor // Not a plain object
            && ! (data = parseJSON(data))      // Neither a (valid) JSON string
        ) throw new Error(
            'FORM_NOT_PLAIN_OBJECT'
            , `Expected plain object or vailid JSON for form import, ${dataConstructor.name} given.`
        );
        const childSetDefault = !isReset && setDefault;
        const retv = Object.fromEntries(
            await Promise.all(
                Object.entries(me.children).map(
                    async ([key, target]) => {
                        // Could have used target.then(...) but, event
                        // components' import() method SHOULD be async, it
                        // would have failed in case it's not.
                        // Forcing it to be async is not possible because
                        // transpilers would break this check.
                        // ...and, IMHO, this approach is better than a dirty
                        // Promise.resolve(...)
                        const value = await target.import(data[key], {focus: focus && !silent, silent, setDefault: childSetDefault});
                        return [key, value];
                    }
                )
            )
        );
        if (childSetDefault) {
            me.defaultValue = await me.export(null, {silent: true, exportEmpties: true});
        };
        if (focus && !silent) me.focus();
        return retv;
    };//}}}
    async isEmpty() {//{{{
        const me = this;
        for (
            const child of Object.values(me.children)
        ) if (
            ! await child.isEmpty()
        ) return false;
        return true;
    };//}}}
    @action
    async submit(_data, options = {}) {//{{{
        const me = this;

        // Always delegate to the root form so the entire form is submitted.
        if (! Object.is(me, me.root)) {
            return me.root.actions.submit(_data, options);
        }

        // Export the current form state.
        const exportedData = await me.export(null, {silent: true});

        // Resolve the effective submitter:
        // - native submit → options.submitter (set by the DOM submit listener)
        // - trigger click → options.origin?.targetNode (the trigger button)
        const formNode = me.targetNode;
        const submitter = options.submitter || options.origin?.targetNode || null;

        // Resolve effective submission attributes (matching native form rules).
        const effectiveAction = (
            submitter?.getAttribute?.('formaction')
            || formNode.getAttribute('action')
            || location.href
        );
        const effectiveMethod = (
            submitter?.getAttribute?.('formmethod')
            || formNode.getAttribute('method')
            || 'get'
        ).toLowerCase();
        const effectiveEnctype = (
            submitter?.getAttribute?.('formenctype')
            || formNode.getAttribute('enctype')
            || 'application/x-www-form-urlencoded'
        );
        const effectiveTarget = (
            submitter?.getAttribute?.('formtarget')
            || formNode.getAttribute('target')
            || '_self'
        );

        // Extra entries: include submitter name/value when present.
        const extraEntries = [];
        if (submitter?.name) {
            extraEntries.push({
                name: submitter.name,
                value: submitter.value ?? '',
            });
        }

        if (effectiveEnctype === 'application/json') {
            await _submitJSON(exportedData, {
                action: effectiveAction,
                method: effectiveMethod,
                target: effectiveTarget,
                // Submitter name/value is intentionally NOT merged into the
                // JSON body.  For JSON submissions the developer has full
                // control over the payload.  The submitter element (if any)
                // is available on options.submitter inside BeforeAction_submit
                // / AfterAction_submit handlers for custom handling.
            });
        } else {
            const keyStyle = me.inheritedOption('keyStyle', 'bracket');
            const arrayStyle = me.inheritedOption('arrayStyle', 'repeat');
            const entries = [
                ...flattenData(exportedData, {keyStyle, arrayStyle}),
                ...extraEntries,
            ];
            await _submitFormEncoded(entries, {
                action: effectiveAction,
                method: effectiveMethod,
                enctype: effectiveEnctype,
                target: effectiveTarget,
            });
        }

        return exportedData;
    };//}}}
};
