
const componentTypes = {};

export class SmartComponent {
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
        //me.typeName = me.constructor.name;
        me.components = componentTypes;

        me.target = target;
        me.options = options;
        me.parent = parent;

        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log(me.constructor.name);
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");



        me.childs = {};

        console.log("-rrr----------------------");

        me.render();
        console.log("-rrr----------------------");

    };
    // createChild(target, options) {
    //     const child = new SmartForm(
    //         target
    //         , {
    //             parent: me,
    //         }
    //     );
    //     console.log ("CHILD NAME:", child.name);
    //
    //
    //     return child;
    // };

};

export function createComponent(name, controller) {//{{{
    // if (componentTypes[name] !== undefined) throw new Error(
    //     `Duplicate component type definition: ${name}`
    // );
    // if (! (controller.prototype instanceof SmartComponent)) throw new Error(
    //     `Bad component type implementation for: ${name}`
    // );
    componentTypes[name] = controller;
};//}}}
