// SmarkForm.js
// ============

import {createType} from "./lib/component.js";

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



function onKeydown(ev) {
    const me = this;

    if (ev.key == "Control") {

        const component = me.getComponent(ev.target);

        const context = (
            component.parent.isSingleton ? component.parent
            : component
        );

        me.revealedTriggers = [component, ...component.parents]
            .flatMap(p=>p.getTriggers('*'))
            .filter(t=>Object.is(t.getTriggerArgs()?.target?.target, context.target))

        for (const t of me.revealedTriggers) {
            const {hotkey} = t.options;
            if (hotkey) t.target.setAttribute('data-hotkey', hotkey);
        };


    } else if (ev.ctrlKey) {

        const targettedTrigger = me.revealedTriggers.find(
            t=>t.options.hotkey == ev.key
        );


        if (targettedTrigger) {
            ev.preventDefault();
            ev.stopPropagation();
            targettedTrigger.target.click();
        };

    };
};

function onReleaseCondition(ev) {
    const me = this;
    if (
        ev.type == "focusout"
        || ev.key == "Control"
    ) {
        for (let t of me.revealedTriggers) {
            t.target.removeAttribute("data-hotkey");
        };
        me.revealedTriggers = [];
    };
};



class SmarkForm extends form {
    revealedTriggers = [];
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
        me.target.addEventListener(
            "keydown"
            , onKeydown.bind(me)
            , true
        );
        me.target.addEventListener(
            "keyup"
            , onReleaseCondition.bind(me)
            , true
        );
        me.target.addEventListener(
            "focusout"
            , onReleaseCondition.bind(me)
            , true
        );
    };
};

SmarkForm.createType = createType;

export default SmarkForm;

