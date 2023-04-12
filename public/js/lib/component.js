// lib/component.js
// ================
const componentTypes = {};

import {Events} from "./events.js";
import {validName} from "../lib/helpers.js";

const sym_smart = Symbol("smart_component");
////const sym_options = Symbol("Options");
const re_valid_typename_chars = /^[a-z0-9_]+$/i;


export class SmartComponent extends Events {//{{{
    constructor(
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
    };
    getNodeOptions(node) {
        const me = this;
        return (
            node.dataset[me.property_name] || ""
        ).trim() || null;
    };
    setNodeOptions(node, options) {
        const me = this;
        node.dataset[me.property_name] = options;
    };
    enhance(node, defaultOptions = null) {
        const me = this;

        // Sanityze and store options:{{{
        let options = me.getNodeOptions(node);

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
        options = {...defaultOptions, ...options};

        const name = validName(
            options.name
            , node.getAttribute("name")
        );
        options.parent = me;
        ////node[sym_options] = options;
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


    };
    getComponent(target) {
        const me = this;
        return (
            target[sym_smart]
            || target.parentElement.closest(me.selector)[sym_smart]
            || null
        );
    };
    find(path="") { // (Still in draft state...)
        let base=this;
        if (path[0] == "/") while (base.parent) base = base.parent;
        return path
            .split("/")
            .filter(x=>x)
            .reduce(
                ((current, name)=>(
                    current === undefined ? null
                    : name == ".." ? current.parent
                    : current.childs[name]
                ))
                , base
            )
        ;
    };
    Error(message) {
        const me = this;
        return new Error(
            `RenderError(${me.path}): ${message}`
        );
    };

};//}}}

export function createComponent(name, controller) {//{{{
    if (componentTypes[name] !== undefined) throw new Error(
        `Duplicate component type definition: ${name}`
    );
    if (! (controller.prototype instanceof SmartComponent)) throw new Error(
        `Bad component type implementation for: ${name}`
    );
    componentTypes[name] = controller;
};//}}}

