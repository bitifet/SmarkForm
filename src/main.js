// SmartForm.js
// ============

import {createType} from "./lib/component.js";

// Import core component types and event handlers:
import {form} from "./types/form.type.js";
import {singleton} from "./types/singleton.type.js";
import {list} from "./types/list.type.js";
import {input} from "./types/input.type.js";
import {action, onActionClick} from "./types/action.type.js";

// Load core component types:
for (const [name, controller] of Object.entries({
    form,
    singleton,
    action,
    list,
    input,
})) createType(name,controller);


export {createType};

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

