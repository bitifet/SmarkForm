// SmartForm.js
// ============

import {form} from "./components/form.component.js";
import {action} from "./components/action.component.js";
import {list} from "./components/list.component.js";
import {text} from "./components/text.component.js";

import {createComponent} from "./lib/component.js";

for (const [name, controller] of Object.entries({
    form,
    action,
    list,
    text,
})) createComponent(name,controller);


function onActionClick(ev) {
    const me = this;
    const {options, parent} = me.getComponent(ev.originalTarget);
    const { action, for: path} = options;

    if (! action) return; // Not an action component.

    const target = (
        path ? parent.childs[path]
        : parent
    );

    console.log("TARGET:", target);


    if (typeof target[action] != "function") throw me.Error(
        `Unimplemented action ${action} for ${target.options.type}`
    );
    console.log("####", options.action, {target});
    console.log("clicked!!", ev);
    console.log(options);
    
    target[action](options);

};

export {createComponent};

export class SmartForm extends form {
    constructor(target, formOptions, ...args) {
        const options = {
            ...formOptions,
            name: "[root]",
            type: "form",
        };
        super(
            target
            , options
            , ...args
        );
        const me = this;

        me.target.dataset[me.property_name] = options;

        me.target.addEventListener(
            "click"
            , onActionClick.bind(me)
            , true
        );

    };

};

