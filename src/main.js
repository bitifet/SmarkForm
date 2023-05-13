// SmartForm.js
// ============

import {createType} from "./lib/component.js";

// Import core component types and event handlers:
import {action_type as action, onActionClick} from "./types/action.type.js";
import {form} from "./types/form.type.js";
import {list} from "./types/list.type.js";
import {singleton} from "./types/singleton.type.js";
import {input} from "./types/input.type.js";

// Load core component types:
for (const [name, controller] of Object.entries({
    action,
    form,
    list,
    singleton,
    input,
})) createType(name,controller);



class SmartForm extends form {
    constructor(
        target
        , rootActions = {}
        , formOptions = {}
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
        me.target.dataset[me.property_name] = options;
        me.actions = {
            ...me.actions,
            ...Object.fromEntries(
                Object.entries(rootActions)
                    .map(([name, ctrl])=>[name, ctrl.bind(me)])
            ),
        };
        me.target.addEventListener(
            "click"
            , onActionClick.bind(me)
            , true
        );
    };
};

SmartForm.createType = createType;

export default SmartForm;

