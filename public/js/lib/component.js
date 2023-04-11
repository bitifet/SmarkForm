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
        console.log("tttttttt", target);
        if (target) /// FIXME!!!!
        target[sym_smart] = me;
        me.render();
    };
    enhance(node) {
        const me = this;

        // Sanityze and store options:{{{
        let options = (node.dataset[me.property_name] || "").trim();
        options = (
            // Accept 'str' as shorthand for '{type: "str"}':
            options.match(re_valid_typename_chars) ? {type: options}
            // Otherwise it must be a valid JSON:
            : JSON.parse(options)
        );
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
            if (options.type != "action") throw new Error(
                `Actions must be of type "action" but "${options.type}" given.`
            );
            delete options.name; // Actions are always unnamed.
        } else if (typeof options.type != "string") {
            throw new Error(
                `Invalid SmartFom item: type is mandatory for non action elements.`
            );
        } else {
            options.name = name;
        };
        //}}}

        // Enhance:{{{
        const ctrl = me.components[options.type];
        if (! ctrl) throw new Error([
            "Unimplemented SmartForm component controller:",
            options.type,
        ].join(" "));
        ///////////////////////////////////////////////////////////
        console.log("Creating child for " + me.options.name + " with name: " + options.name, node, options);
        ///////////////////////////////////////////////////////////
        return new ctrl (
            node
            , options
            , me
        );
        //}}}


    };
    getComponent(target) {
        const me = this;

        console.log("//////////////////");
        console.log(target);
        console.log("//////////////////");


        return (
            target[sym_smart]
            || target.parentElement.closest(me.selector)[sym_smart]
            || null
        );
    };
    find(path="") { // (Still in draft state...)
        const me=this;
        return path
            .split(".")
            .filter(x=>x)
            .reduce(
                ((current, name)=>current.childs[name])
                , me
            )
        ;
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

