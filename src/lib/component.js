// lib/component.js
// ================
const componentTypes = {};

import {Events} from "./events.js";

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
    ruleError: class ruleError extends Error {//{{{
        constructor(code, message, path) {
            super(`RuleError(${path}): ${message}`);
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

function inferType(node) {//{{{
    return "input";
    // Future component types may be infered for some input types.
};//}}}

export class SmartComponent extends Events {
    constructor(//{{{
        target
        , {
            property_name = "smart",
            ...options
        } = {}
        , parent
    ) {
        super();

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

        me.actions = [];
        me.property_name = property_name;
        me.selector = `[data-${me.property_name}]`;
        me.typeName = me.constructor.name;
        me.types = componentTypes;
        me.target = target;
        me.options = options;
        me.setNodeOptions(me.target, me.options);

        me.parent = parent;
        if (! me.parent instanceof SmartComponent) throw me.renderError(
            'INVALID_PARENT'
            , `Smart Components must have valid Smart Component parent.`
        );
        me.root = (
            me.parent === null ? me
            : me.parent
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

        me.onRenderedTasks = [];

        me.children = {};
        me.target[sym_smart] = me;
        me.render();
        me.onRenderedTasks.forEach(task=>task());
        me.onRenderedTasks = null;
    };//}}}
    onRendered(cbk) {//{{{
        const me = this;
        if (me.onRenderedTasks) {
            me.onRenderedTasks.push(cbk);
        } else {
            cbk();
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
        if (! options.action && ! options.type) options.type = inferType(node);
        me.setNodeOptions(node, options);
        return options;
    };//}}}
    setNodeOptions(node, options) {//{{{
        const me = this;
        node.dataset[me.property_name] = JSON.stringify(options);
    };//}}}
    enhance(node, defaultOptions) {//{{{
        const me = this;

        // Sanityze and store options:{{{
        let options = me.getNodeOptions(node, defaultOptions);
        //}}}

        // Classify:{{{
        if (options.action) {
            if (! options.type) options.type = "action"; // Make type optional for actions.
            if (options.type != "action") throw me.renderError(
                "WRONG_ACTION_TYPE"
                , `Actions must be of type "action" but "${options.type}" given.`
            );
            delete options.name; // Actions are always unnamed.
        } else if (typeof options.type != "string") {
            throw me.renderError(
                "NO_TYPE_PROVIDED"
                , `Invalid SmartFom item: type is mandatory for non action elements.`
            );
        };
        //}}}

        // Enhance:{{{
        const ctrl = me.types[options.type];
        if (! ctrl) throw me.renderError(
            "UNKNOWN_TYPE"
            , `Unimplemented SmartForm component controller: ${options.type}`,
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
            || target.parentElement.closest(me.selector)[sym_smart]
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
        let base=this;
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
            ((current, name)=>(
                current === undefined ? null
                : name == ".." ? current.parent
                : current.children[name]
            ))
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
        if (! me.target.id) me.target.id = me.getPath();
        document.location.hash = me.target.id;
    };//}}}
    getActions(actionNames = null) {//{{{
        const me = this;
        const myCurrentActions = [];
        for (
            const acc
            of [...me.root.target.querySelectorAll(me.selector)]
                .map(target=>target[sym_smart])
        ) {
            const options = acc.getActionArgs()
            if (! options) continue; // Not an action.
            if (! Object.is(options.context, me)) continue;
            if ( // Matches actionName string or any in actionName array:
                actionNames
                && ! (1 + [actionNames].flat().findIndex(n=>n==options.action))
            ) continue;
            myCurrentActions.push(acc);
        };
        return myCurrentActions;
    };//}}}
    getActionArgs() {}; // Let's easily filter out non action compoenents.

    // Error types:
    renderError(code, message) {//{{{
        const me = this;
        return new errors.renderError(code, message, me.getPath());
    };//}}}
    ruleError(code, message) {//{{{
        const me = this;
        return new errors.ruleError(code, message, me.getPath());
    };//}}}
};

export function createType(name, controller) {//{{{
    if (componentTypes[name] !== undefined) throw new Error(
        `Duplicate component type definition: ${name}`
    );
    if (! (controller.prototype instanceof SmartComponent)) throw new Error(
        `Bad component type implementation for: ${name}`
    );
    componentTypes[name] = controller;
};//}}}

