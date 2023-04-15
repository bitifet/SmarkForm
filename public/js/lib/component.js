// lib/component.js
// ================
const componentTypes = {};

import {Events} from "./events.js";
import {validName} from "../lib/helpers.js";

const sym_smart = Symbol("smart_component");
const re_valid_typename_chars = /^[a-z0-9_]+$/i;
const re_has_wildcards = /[\*\?]/;
const wild2regex = wname => new RegExp(
    "^"
    + wname
        .replace(/\*+/g, ".*")
        .replace(/\?/g, ".")
    + "$"
);


export class SmartComponent extends Events {
    constructor(//{{{
        target
        , {
            property_name = "smart",
            ...options
        } = {}
        , parent = null
    ) {
        super();

        const me = this;
        me.property_name = property_name;
        me.selector = `[data-${me.property_name}]`;
        me.typeName = me.constructor.name;
        me.components = componentTypes;
        me.target = target;
        me.options = options;
        me.setNodeOptions(me.target, me.options);
        me.parent = parent;
        me.path = (
            me.parent === null ? ""
            : me.parent.path + "." + me.options.name
        ).replace(/^\./, "");
        me.childs = {};

        // Parents iterator:
        me.parents = {};
        me.parents[Symbol.iterator] = function* () {
            let current = me;
            while (current) {
                yield current;
                current = current.parent;
            };
        };
        me.target[sym_smart] = me;
        me.render();
    };//}}}
    getNodeOptions(node, defaultOptions) {//{{{
        const me = this;
        let options = (
            node.dataset[me.property_name] || ""
        ).trim() || null;

        try {
            options = (
                // Accept 'str' as shorthand for '{type: "str"}':
                options.match(re_valid_typename_chars) ? {type: options}
                // Otherwise it must be a valid JSON:
                : JSON.parse(options)
            );
        } catch(err) {
            if (typeof defaultOptions != "object") throw me.Error(
                `No options object provided`
            );
            options = {};
        };
        if (typeof defaultOptions == "object") {
            options = {...defaultOptions, ...options};
            me.setNodeOptions(node, options);
        };
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
        const name = validName(
            options.name
            , node.getAttribute("name")
        );
        //}}}

        // Classify:{{{
        if (options.action) {
            options.type ||= "action"; // Make type optional for actions.
            if (options.type != "action") throw me.Error(
                `Actions must be of type "action" but "${options.type}" given.`
            );
            delete options.name; // Actions are always unnamed.
        } else if (typeof options.type != "string") {
            throw me.Error(
                `Invalid SmartFom item: type is mandatory for non action elements.`
            );
        } else {
            options.name = name;
        };
        //}}}

        // Enhance:{{{
        const ctrl = me.components[options.type];
        if (! ctrl) throw me.Error([
            "Unimplemented SmartForm component controller:",
            options.type,
        ].join(" "));
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
    find(path="") { // {{{
        let base=this;
        if (path[0] == "/") while (base.parent) base = base.parent;
        if (! path.split) console.log("path.split:", path.split, typeof path.split);
        const parts = path
            .split("/")
            .filter(x=>x)
        ;

        // (Recursive) Multi-match search (path with '*' wildcards):
        // (Returns array of components)
        const firstWildcardPos = parts.findIndex(p=>p.match(re_has_wildcards));
        if (firstWildcardPos >= 0) {
            const re_pattern = wild2regex(parts[firstWildcardPos]);
            console.log(re_pattern);
            const pivotPath = parts.slice(0, firstWildcardPos).join("/");
            const restPath = parts.slice(firstWildcardPos + 1).join("/");
            const pivot = base.find(pivotPath);
            const pivotChilds = Object.entries(pivot.childs);
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
                : current.childs[name]
            ))
            , base
        )
    ;
    };//}}}
    Error(message) {//{{{
        const me = this;
        return new Error(
            `RenderError(${me.path}): ${message}`
        );
    };//}}}

};

export function createComponent(name, controller) {//{{{
    if (componentTypes[name] !== undefined) throw new Error(
        `Duplicate component type definition: ${name}`
    );
    if (! (controller.prototype instanceof SmartComponent)) throw new Error(
        `Bad component type implementation for: ${name}`
    );
    componentTypes[name] = controller;
};//}}}

