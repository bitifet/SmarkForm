// SmartForm.js
// ============

import {createComponent} from "./lib/component.js";

// Import core components and event handlers:
import {form} from "./components/form.component.js";
import {singleton} from "./components/singleton.component.js";
import {list} from "./components/list.component.js";
import {input} from "./components/input.component.js";
import {action, onActionClick} from "./components/action.component.js";

// Load core components:
for (const [name, controller] of Object.entries({
    form,
    singleton,
    action,
    list,
    input,
})) createComponent(name,controller);


export {createComponent};

export class SmartForm extends form {
    constructor(target, formOptions) {
        const options = {
            ...formOptions,
            name: "",
            type: "form",
        };
        super(
            target
            , options
            , null // (Root has no parent)
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

