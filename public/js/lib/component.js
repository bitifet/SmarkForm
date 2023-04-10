// lib/component.js
// ================
const componentTypes = {};

import {Events} from "./events.js";

const sym_smart = Symbol("smart_component");

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

