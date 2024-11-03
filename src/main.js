// SmarkForm.js
// ============

import {createType} from "./lib/component.js";
import {hotKeys_handler} from "./lib/hotkeys.js";

// Import core component types and event handlers:
import {trigger, onTriggerClick} from "./types/trigger.type.js";
import {label} from "./types/label.type.js";
import {form} from "./types/form.type.js";
import {list} from "./types/list.type.js";
import {input} from "./types/input.type.js";
import {number} from "./types/number.type.js";
import {date} from "./types/date.type.js";


// Load core component types:
for (const [name, controller] of Object.entries({
    trigger,
    label,
    form,
    list,
    input,
    number,
    date,
})) createType(name,controller);


class SmarkForm extends form {
    constructor(
        targetNode
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
            targetNode
            , options
            , null // (Root has no parent)
        );
        const me = this;
        me.setNodeOptions(me.targetNode, options);
        me.actions = {
            ...me.actions,
            ...Object.fromEntries(
                Object.entries(customActions)
                    .map(([name, ctrl])=>[name, ctrl.bind(me)])
            ),
        };
        me.targetNode.addEventListener(
            "click"
            , onTriggerClick.bind(me)
            , true
        );
        new hotKeys_handler(me);
    };
    async render() {
        const me = this;
        me.targetNode.setAttribute("aria-busy", "true");
        await super.render();
        me.targetNode.setAttribute("aria-busy", "false");
    };
};

SmarkForm.createType = createType;

export default SmarkForm;

