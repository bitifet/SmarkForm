// lib/component.js
// ================
const componentTypes = {};

import {events} from "./events.js";
import legacy from "./legacy.js";

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
            //if (parentComponent.options.type == "list") return "form";
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
            let current = me;
            while (current) {
                yield current;
                current = current.parent;
            };
        };

        // Calculate prefix or disable autoId:
        const autoId = me.inherittedOption("autoId", false);
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
        })();
        if (me.options.onRendered) me.onRendered(me.options.onRendered);

    };//}}}
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
        const optionsSrc = (
            node.dataset[me.property_name] || ""
        ).trim() || null;
        const options = {
            ...defaultOptions,
            ...(()=>{
                try {
                    const opt = JSON.parse(optionsSrc);
                    if (typeof opt != "object") throw new Error("NO_OBJECT");
                    return opt;
                } catch (err) {
                    return (
                        optionsSrc.match(re_valid_typename_chars) ? {type: optionsSrc}
                        : {}
                    );
                };
            })(),
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
        return (
            [...me.parents].map(p=>p.name)
            .reverse()
            .join("/") // Root parent being "" => Starting "/".
            || "/" // No join (0 parents => root node)
        );
    };//}}}
    find(path="") { // {{{
        const me = this;
        let base = me;
        path = String(path); // Allow numbers (arrays simply won't match).
        if (path[0] == "/") while (base.parent) base = base.parent;
        const parts = path
            .split("/")
            .filter(x=>x)
        ;

        // (Recursive) Multi-match search (path with '*' wildcards):
        // (Returns array of components)
        const firstWildcardPos = parts.findIndex(p=>p.match(re_has_wildcards));
        if (firstWildcardPos >= 0) {
            const re_pattern = wild2regex(parts[firstWildcardPos]);
            const pivotPath = parts.slice(0, firstWildcardPos).join("/");
            const restPath = parts.slice(firstWildcardPos + 1).join("/");
            const pivot = base.find(pivotPath);
            const pivotChilds = Object.entries(pivot.children);
            return pivotChilds
                .filter(([name,child])=>child && name.match(re_pattern))
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
        )
    ;
    };//}}}
    inherittedOption(optName, defaultValue) {//{{{
        const me = this;
        for (
            const p of me.parents
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
            of [...me.root.targetNode.querySelectorAll(me.selector)]
                .map(target=>target[sym_smart])
                .filter(x=>x) // Ignore not yet rendered.
        ) {
            const options = tgg.getTriggerArgs()
            if (! options) continue; // Not a trigger
            if (! Object.is(options.context, me)) continue;
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
        if (me.targetFieldNode) me.targetFieldNode.focus();
    };//}}}
    getTriggerArgs() {}; // Let's easily filter out non trigger compoenents.
    // Error types:
    renderError(code, message) {//{{{
        const me = this;
        return new errors.renderError(code, message, me.getPath());
    };//}}}
};

export class SmarkField extends SmarkComponent {
    constructor(...args){
        super(...args);
        this._isField = true;
        if (! Object.is(this, this.root)) {
            this.name = this.validName(
                this.options.name
                , this.targetNode.getAttribute("name")
            );
            if (this.options.hasOwnProperty("value")) {
                if (this.targetNode.getAttribute("value") !== null) { // Conflict
                    throw me.renderError(
                        'VALUE_CONFLICT'
                        , `Initial value specied both as "value" option and HTML "value" attribute.`
                    );
                };
                this.targetNode.setAttribute("value", this.options.value);
            };
        };
    };
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

