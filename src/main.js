// SmarkForm.js
// ============

import {createType} from "./lib/component.js";
import {hotKeys_handler} from "./lib/hotkeys.js";

// Import core component types and event handlers:
import {trigger, onTriggerClick} from "./types/trigger.type.js";
import {label} from "./types/label.type.js";
import {form} from "./types/form.type.js";
import {list} from "./types/list.type.js";
import {input} from "./types/input.type.js";
import {number} from "./types/number.type.js";
import {date} from "./types/date.type.js";
import {time} from "./types/time.type.js";
import {datetimeLocal} from "./types/datetime-local.type.js";
import {radio} from "./types/radio.type.js";
import {color} from "./types/color.type.js";


// Load core component types:
for (const [name, controller] of Object.entries({
    trigger,
    label,
    form,
    list,
    input,
    number,
    date,
    time,
    "datetime-local": datetimeLocal,
    radio,
    color,
})) createType(name,controller);


class SmarkForm extends form {
    constructor(
        targetNode
        , {
            ...restOptions
        } = {}
    ) {
        // Auto-scan global mask scripts from the document:
        SmarkForm._scanGlobalMasks();

        // Split options: smark_* prefixed → constructor-only, everything else
        // (including on_* event handlers) → pass-through to root form component.
        const ctorOnly = {};
        const formOptions = {};
        for (const [k, v] of Object.entries(restOptions)) {
            // smark_* options must also flow through to root.options so the mixin
            // system can read them during the render phase (which starts inside
            // super()). They are filtered from setNodeOptions below to prevent
            // data-smark serialization.
            formOptions[k] = v;
            if (k.startsWith('smark_')) {
                ctorOnly[k] = v;
            }
        }

        // Resolve string selectors to DOM nodes:
        if (typeof targetNode === "string") {
            const resolved = document.querySelector(targetNode);
            if (!resolved) throw new Error(
                `SmarkForm: selector "${targetNode}" did not match any element`
            );
            targetNode = resolved;
        }
        const options = {
            ...formOptions,
            name: "",
            type: "form",
        };
        super(
            targetNode
            , options
            , null // (Root has no parent)
        );
        const me = this;
        // setNodeOptions must NOT receive on_* or smark_* keys — they contain
        // functions and constructor-only flags that cannot be serialized to
        // the data-smark attribute.
        me.setNodeOptions(me.targetNode, Object.fromEntries(
            Object.entries(options).filter(([k]) =>
                !k.startsWith('on_') && !k.startsWith('smark_')
            )
        ));
        // TODO: use private Symbol (see PROMPTS.md "Private actions")
        // Merge globally registered custom actions
        me.actions = {
            ...me.actions,
            ...Object.fromEntries(
                Object.entries(SmarkForm._customActions)
                    .map(([name, ctrl])=>[name, ctrl.bind(me)])
            ),
        };
        me.targetNode.addEventListener(
            "click"
            , onTriggerClick.bind(me)
            , true
        );
        new hotKeys_handler(me);
    };
    async render() {
        const me = this;
        me.targetNode.setAttribute("aria-busy", "true");
        await super.render();
        me.targetNode.setAttribute("aria-busy", "false");
    };
};

// --- Declarative Masking API ---
SmarkForm._maskRegistry = {};
SmarkForm._scanned = false;
// Constructor-only options and their defaults:
SmarkForm._ctorDefaults = {
    smark_mask_throwOnMissing: true,
};

SmarkForm.registerMask = function(name, factory) {
    if (typeof name !== 'string' || !name) {
        throw new Error('SmarkForm.registerMask: name must be a non-empty string.');
    }
    if (typeof factory !== 'function') {
        throw new Error('SmarkForm.registerMask: factory must be a function.');
    }
    SmarkForm._maskRegistry[name] = factory;
};

// --- Custom Actions API ---
SmarkForm._customActions = {};

SmarkForm.registerCustomAction = function(name, handler) {
    if (typeof name !== 'string' || !name) {
        throw new Error('SmarkForm.registerCustomAction: name must be a non-empty string.');
    }
    if (typeof handler !== 'function') {
        throw new Error('SmarkForm.registerCustomAction: handler must be a function.');
    }
    SmarkForm._customActions[name] = handler;
};

SmarkForm._scanGlobalMasks = function() {
    if (SmarkForm._scanned) return;
    SmarkForm._scanned = true;
    const scripts = document.querySelectorAll('script[type="smark-mask"]');
    for (const script of scripts) {
        if (script.closest('template')) continue;
        const name = script.getAttribute('data-name');
        if (!name) continue;
        if (SmarkForm._maskRegistry[name]) continue;
            try {
                const factory = (new Function('return (' + script.textContent.trim() + ')'))();
                if (typeof factory === 'function') {
                SmarkForm._maskRegistry[name] = factory;
            }
        } catch (e) {
            console.warn(
                `SmarkForm: failed to evaluate mask script "${name}":`, e
            );
        }
    }
};

SmarkForm.createType = createType;

export default SmarkForm;

