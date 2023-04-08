// SmartForm.js
// ============

import {form} from "./components/form.component.js";
import {list} from "./components/list.component.js";
import {text} from "./components/text.component.js";

import {createComponent} from "./lib/component.js";

for (const [name, controller] of Object.entries({
    form,
    list,
    text,
})) createComponent(name,controller);


function onActionClick(ev) {
    const me = this;

    console.log("clicked!!", ev);
    
        // Enhance actions:
        // TO DO... 💡💡💡💡💡💡💡💡💡 

};

export {createComponent};

export class SmartForm extends form {
    constructor(...args) {
        super(...args);
        const me = this;

        me.target.addEventListener(
            "click"
            , onActionClick
            , true
        );

    };

};

