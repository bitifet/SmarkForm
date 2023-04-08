// lib/component.js
// ================
const componentTypes = {};

export class SmartComponent {//{{{
    constructor(
        target
        , {
            property_name = "smart",
            ...options
        } = {}
        , parent = null
    ) {
        const me = this;
        me.property_name = property_name;
        me.typeName = me.constructor.name;
        me.components = componentTypes;
        me.target = target;
        me.options = options;
        me.parent = parent;
        me.childs = {};
        me.render();
    };
    find(path="") { // (Still in draft state...)
        const me=this;
        console.log(me.childs);
        return path.split(".").reduce(
            (current, name)=>current.childs[name]
            , me
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

