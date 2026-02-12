// lib/component.js
// ================
const componentTypes = {};

import {events} from "./events.js";
import legacy from "./legacy.js";
import {parseJSON, replaceWrongNode} from "./helpers.js";

const sym_smart = Symbol("smart_component");
const re_valid_typename_chars = /^[a-z0-9_]+$/i;
const re_has_wildcards = /[\*\?]/;
const wild2regex = wname => new RegExp(//{{{
    "^"
    + wname
        .replace(/\*+/g, ".*")
        .replace(/\?/g, ".")
    + "$"
);//}}}

const errors = {
    renderError: class renderError extends Error {//{{{
        constructor(code, message, path) {
            super(`RenderError(${path}): ${message}`);
            this.code = code;
            this.path = path;
            this.stack = this.stack
                .split("\n")
                .slice(2)
                .join("\n")
            ;
        };
    },//}}}
};

function inferType(node, parentComponent) {//{{{
    switch (node.tagName.toLowerCase()) {
        case "ul":
        case "ol":
        case "table":
        case "thead":
        case "tbody":
        case "tfoot":
            return "list";
        case "input":
            const type = String(node.getAttribute("type")||"").toLowerCase();
            if (parentComponent.isSingleton) return parentComponent.options.type;
            switch(type) {
                case "number":
                case "date":
                case "time":
                case "datetime-local":
                case "radio":
                case "color":
                    return type;
            };
        case "textarea":
        case "select":
            return "input";
        case "label":
            return "label";
        default:
            //(implicit)//if (parentComponent.options.type == "list") return "form";
        case "form":
            return "form";
    };
};//}}}

@events
export class SmarkComponent {
    constructor(//{{{
        targetNode
        , {
            property_name = "smark",
            ...options
        } = {}
        , parent
    ) {
        const me = this;

        me.validName = (function nameGenerator() {//{{{
            let counter = 0;
            return function(...names){
                if (me.parent.isSingleton) return "";
                    // Singleton target components are unnamed.
                for (
                    let n0 of names
                ) if (
                    typeof n0 == "string"
                ) {
                    n0 = n0.trim();
                    if (n0.length) return n0;
                };
                return 'UNNAMED'+(++counter);
            };
        })();//}}}

        me.actions = {};
        me.property_name = property_name;
        me.selector = `[data-${me.property_name}]`;
        me.types = componentTypes;
        me.targetNode = targetNode;
        me.options = options;
        me.setNodeOptions(me.targetNode, me.options);

        me.parent = parent;
        if (! me.parent instanceof SmarkComponent) throw me.renderError(
            'INVALID_PARENT'
            , `Smark Components must have valid Smark Component parent.`
        );
        me.root = (
            me.parent === null ? me
            : me.parent.root
        );

        // Parents iterator:
        me.parents = {};
        me.parents[Symbol.iterator] = function* () {
            let current = me.parent;
            while (current) {
                yield current;
                current = current.parent;
            };
        };

        // Calculate prefix or disable autoId:
        const autoId = me.inheritedOption("autoId", false);
        me.genId = (
            autoId === false ? false
                // Do not auto-generate IDs.
            : autoId === true ? p => p.replace(/\//g, "_")
                // Use "_path_in_underscore_style".
            : typeof autoId == "string" ? p => autoId+p.replace(/\//g, "_")
                // Use "prefix" + "_path_in_underscore_style".
            : typeof autoId == "function" ? autoId
                // Use fn(path) custom style.
            : false
                // Failback to disabled.
        );

        me.onRenderedTasks = [];

        let setRendered;
        me.renderedSync = false;
        me.rendered = new Promise(resolve => setRendered = resolve);

        me.children = {};
        me.targetNode[sym_smart] = me;

        (async ()=>{
            await me.render();
            for (
                const task of me.onRenderedTasks
            ) await task();
            me.onRenderedTasks = null;
            setRendered(true);
            setTimeout(()=>me.renderedSync = true, 1);
            await me.emit("afterRender", {
                context: me
            }, false);
        })();
        if (me.options.onRendered) me.onRendered(me.options.onRendered);

    };//}}}
    async unrender() {
        const me = this;
        await me.emit("beforeUnrender", {
            context: me
        }, false);
        me.targetNode.remove();
    };
    onRendered(cbk) {//{{{
        const me = this;
        if (me.onRenderedTasks) {
            me.onRenderedTasks.push(cbk.bind(me));
        } else {
            cbk.bind(me)();
        };
    };//}}}
    getNodeOptions(node, defaultOptions) {//{{{
        const me = this;
        let optionsSrc = (
            node.dataset[me.property_name] || ""
        ).trim() || null;
        if (optionsSrc === "data-"+me.property_name) {
            // Accept <input data-smark="data-smark"> as special case since
            // <input data-smark> is not automatically converted to
            // data-smark="true" by the browser like other tags.
            optionsSrc = null;
        };
        let explicitOptions = parseJSON(optionsSrc);
        if (! explicitOptions && optionsSrc !== null) {
            if (re_valid_typename_chars.test(optionsSrc)) {
                explicitOptions = {type: optionsSrc};
            } else {
                throw me.renderError(
                    "INVALID_OPTIONS_OBJECT"
                    , `data-${me.property_name}: must be a valid JSON object.`
                );
            };
        };
        const options = {
            ...defaultOptions,
            ...explicitOptions,
        };
        const isSingletonTarget = (
            me.isSingleton // New component's parent is a singleton
            && options.type !== "label"           // And not a trigger
            && ! options.hasOwnProperty("action") // Neither a label
        );
        if (isSingletonTarget) {
            // Merge singleton options into child component options:
            for (const key of Object.keys(me.options)) {
                if ( // Skip if...
                    key === "name"
                    || key === "type" && options[key] === "label"
                ) continue;
                if (options.hasOwnProperty(key)) {
                    throw me.renderError(
                        'SINGLETON_OPTION_CONFLICT',
                        `Singleton field option defined both in parent and schild for key: ${key}.`
                    );
                };
                if (key !== "type") {
                    options[key] = me.options[key];
                };
            };
        };
        if (! options.action && ! options.type) options.type = inferType(node, me);
        me.setNodeOptions(node, options);
        return options;
    };//}}}
    setNodeOptions(node, options) {//{{{
        const me = this;
        node.dataset[me.property_name] = JSON.stringify(options);
    };//}}}
    async enhance(node, defaultOptions) {//{{{
        const me = this;

        // Sanityze and store options:{{{
        let options = me.getNodeOptions(node, defaultOptions);
        //}}}

        // Prevent default behaviours:{{{
        legacy.disEnhance(me);
        //}}}

        // Classify:{{{
        if (options.action) {
            if (! options.type) options.type = "trigger"; // Make type optional for triggers.
            if (options.type != "trigger") throw me.renderError(
                "ACTION_IN_NON_TRIGGER"
                , `"action" property is only allowed for "trigger" components but "${options.type}" type specified.`
            );
        } else if (typeof options.type != "string") {
            throw me.renderError(
                "NO_TYPE_PROVIDED"
                , `Invalid SmarkForm item: type is mandatory for non trigger components.`
            );
        };
        //}}}

        // Enhance:{{{
        const ctrl = me.types[options.type];
        if (! ctrl) throw me.renderError(
            "UNKNOWN_TYPE"
            , `Unimplemented SmarkForm component controller: ${options.type}`,
        );
        return new ctrl (
            node
            , options
            , me
        );
        //}}}

    };//}}}
    getComponent(target) {//{{{
        const me = this;
        return (
            target[sym_smart]
            || target.parentElement?.closest(me.selector)[sym_smart]
            || null
        );
    };//}}}
    getPath() {//{{{
        const me = this;
        const ancestors = [...me.parents].map(p=>p.name).reverse();
        if (me.name) ancestors.push(me.name); // Compute parent path inside labels (or singletons?).
        return ancestors.join("/") || "/";
    };//}}}
    find(path="") { // {{{
        const me = this;
        let base = me;
        while ( // Always detect real fields in singletons, labels and triggers.
            ! base.name
            && base.parent !== null // Not root form
        ) {
            base = base.parent;
        };
        path = String(path); // Allow numbers (arrays simply won't match).
        if (path[0] == "/") while (base.parent) base = base.parent;
        const parts = path
            .split("/")
            .filter(x=>x)
        ;
        // (Recursive) Multi-match search (path with '*' wildcards):
        // (Returns array of components)
        const firstWildcardPos = parts.findIndex(p=>re_has_wildcards.test(p));
        if (firstWildcardPos >= 0) {
            const re_pattern = wild2regex(parts[firstWildcardPos]);
            const pivotPath = parts.slice(0, firstWildcardPos).join("/");
            const restPath = parts.slice(firstWildcardPos + 1).join("/");
            const pivot = base.find(pivotPath);
            const pivotChilds = Object.entries(pivot.children);
            return pivotChilds
                .filter(([name,child])=>child && re_pattern.test(name))
                .map(([,child])=>child.find(restPath))
                .flat(Infinity)
            ;
        };
        // Straight search (wildcardless path)
        // (Returns single component)
        return parts.reduce(
            (current, name)=>{
                if (current === undefined) return;   // No match.
                if (name == "..") return current.parent;  // Go up one level.
                if ( // Special syntax for list siblings (.+n / .-n)
                    name[0] == "."
                ) {
                    if (name == ".") return current; // Current node.
                    if (! current.parent) return; // Root node => no siblings.
                    const delta = parseInt(name.slice(1));
                    if (isNaN(delta)) return; // Invalid sibling syntax.
                    if (current.parent.options.type == "list") {
                        const n = parseInt(current.name) + delta
                        if (! isNaN(n)) return current.parent.children[n];
                    } else {
                        const keys = Object.keys(current.parent.children);
                        const currentPosition = keys.findIndex(key=>key==current.name);
                        const newKey = keys[currentPosition + delta];
                        return current.parent.children[newKey];
                    };
                } else {
                    return current.children[name];
                };
            }
            , base
        );
    };//}}}
    inheritedOption(optName, defaultValue) {//{{{
        const me = this;
        for (
            const p of [me, ...me.parents]
        ) if (
            p.options[optName] !== undefined
        ) return p.options[optName];
        return defaultValue;
    };//}}}
    moveTo(){//{{{
        const me = this;
        if (! me.targetNode.id) me.targetNode.id = me.getPath();
        document.location.hash = me.targetNode.id;
        // Avoid noisy url hash "randomish" effect:
        window.history.pushState({}, undefined,window.location.pathname);
            // Like 'document.location.hash = ""' but without leaving leading
            // hash character.
    };//}}}
    getTriggers(actionNames = "") {//{{{
        const me = this;
        const myCurrentActions = [];
        const actionKeys = new Set([actionNames]
            .flat()
            .map(String)
            .filter(x=>x)
        );
        const returnAll = actionKeys.has("*");
        for (
            const tgg
            of [me, ...me.root.targetNode.querySelectorAll(me.selector)]
                .map(target=>target[sym_smart])
                .filter(x=>x) // Ignore not yet rendered.
        ) {
            const options = tgg.getTriggerArgs()
            if (! options) continue; // Not a trigger
            if (
                ! Object.is(options.context, me) // Current context
                && ! Object.is(tgg, me)          // Trigger focused itself
            ) continue;
            if (
                returnAll
                || actionKeys.has(options.action)
            ) myCurrentActions.push(tgg);
        };
        return myCurrentActions;
    };//}}}
    updateId() {//{{{
        const me = this;
        if (me.genId === false) return; // Abort if disabled.
        const newId = me.genId(me.getPath());
        if (me.targetNode.id != newId) {
            me.targetNode.id = newId;
            for (
                const child
                of Object.values(me.children)
            ) child.updateId();
        };
        return me.targetNode.id
    };//}}}
    focus() {//{{{
        const me = this;
        for (const fname in me.children) {
            return me.children[fname].focus();
        };
        if (me.targetFieldNode) {
            // Prefer fields over triggers, forms, etc...
            me.targetFieldNode.focus();
        } else {
            me.targetNode.focus();
        }
    };//}}}
    getTriggerArgs() {}; // Let's easily filter out non trigger compoenents.
    // Error types:
    renderError(code, message) {//{{{
        const me = this;
        const targetNode = (
            me.parent?.isSingleton ? me.parent.targetNode
            : me.targetNode
        );
        const error = new errors.renderError(code, message, me.getPath());
        replaceWrongNode(targetNode, error);
        return error;
    };//}}}
};

export function createType(name, controller) {//{{{
    if (componentTypes[name] !== undefined) throw new Error(
        `Duplicate component type definition: ${name}`
    );
    if (! (controller.prototype instanceof SmarkComponent)) throw new Error(
        `Bad component type implementation for: ${name}`
    );
    componentTypes[name] = controller;
};//}}}

