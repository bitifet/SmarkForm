// SmarkForm.js
// ============

import {createType} from "./lib/component.js";

// Import core component types and event handlers:
import {trigger, onTriggerClick} from "./types/trigger.type.js";
import {form} from "./types/form.type.js";
import {list} from "./types/list.type.js";
import {singleton} from "./types/singleton.type.js";
import {input} from "./types/input.type.js";

// Load core component types:
for (const [name, controller] of Object.entries({
    trigger,
    form,
    list,
    singleton,
    input,
})) createType(name,controller);



class SmarkForm extends form {
    constructor(
        target
        , {
            customActions = {},
            ...formOptions
        } = {}
    ) {
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
        me.setNodeOptions(me.target, options);
        me.actions = {
            ...me.actions,
            ...Object.fromEntries(
                Object.entries(customActions)
                    .map(([name, ctrl])=>[name, ctrl.bind(me)])
            ),
        };
        me.target.addEventListener(
            "click"
            , onTriggerClick.bind(me)
            , true
        );
    };
};

SmarkForm.createType = createType;

export default SmarkForm;

