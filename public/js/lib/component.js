
const componentTypes = {};

export class SmartComponent {
    constructor(
        target
        , {
            parent = null,
        } = {}
    ) {
        const me = this;
        me.typeName = 

        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log(me.constructor.name);
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");


        me.parent = parent;
        me.target = target;

        me.childs = {};
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
    if (componentTypes[name] !== undefined) throw new Error(
        `Duplicate component type definition: ${name}`
    );
    if (! (controller.prototype instanceof SmartComponent)) throw new Error(
        `Bad component type implementation for: ${name}`
    );
    componentTypes[name] = controller;
};//}}}
