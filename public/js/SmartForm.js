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


    const options = ev.target.dataset[me.property_name] || {};

    const context = me.getComponent(ev.target);
        // FIXME: For removeItem button this returns null!!!??

    console.log("clicked!!", ev);
    console.log(context.options);
    
        // Enhance actions:
        // TO DO... 💡💡💡💡💡💡💡💡💡 

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

