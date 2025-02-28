// types/radio.type.js
// ===================
import {input} from "./input.type.js";
import {action} from "./trigger.type.js";
import {export_to_target} from "../decorators/export_to_target.deco.js";
import {import_from_target} from "../decorators/import_from_target.deco.js";
import {randomId} from "../lib/helpers.js";
export class radio extends input {
    constructor(...args) {
        super(...args);
        const me = this;
        let master = me.parent.children[me.name];
        let retv = me;
        if (master) {
            me.targetNode.setAttribute("name", master.sharedNodeName);
            master.radioButtons.push(me.targetNode);
            retv = {}; // Not the master field.
        } else {
            master = me;
            // Provide unique name for DOM navigation to work properly:
            master.sharedNodeName = randomId();
            master.targetNode.setAttribute("name", master.sharedNodeName);
            master.radioButtons = [
                master.targetNode
            ];
        };
        let changeEventHandler = onRadioInteraction.bind(master);
        me.targetNode.addEventListener("click", changeEventHandler);
        me.targetNode.addEventListener("keydown", changeEventHandler);
        return retv;
    };
    async render() {//{{{
        await super.render();
        const me = this;
        const targetTag = me.targetFieldNode.tagName;
        const targetType = me.targetFieldNode.getAttribute("type");
        if (
            targetTag != "INPUT"
            || (targetType || "radio").toLowerCase() != "radio"
        ) throw me.renderError(
            'NOT_A_RADIO_FIELD'
            , `Radio inputs require an INPUT tag of type "radio".`
        );
        if (! targetType) me.targetFieldNode.type = "radio"; // Autofill
    };//}}}
    @action
    @export_to_target
    async export() {//{{{
        return this.radioButtons.find(r=>r.checked)?.value || null;
    };//}}}
    @action
    @import_from_target
    async import({data = null, focus = true} = {}) {//{{{
        const selected = this.radioButtons.find(r=>r.value === data);
        if (selected) {
            selected.checked = true;
        } else {
            this.radioButtons.forEach(r=>r.checked = false);
        };
        if (focus) this.focus();
    };//}}}
    async isEmpty() {//{{{
        return ! (1 + this.radioButtons.findIndex(r=>r.checked));
    };//}}}
};

function onRadioInteraction(event) {//{{{
    if (
        event.type === "click"
        || event.type === "keydown" && event.code === "Delete"
        // NOTE: Some browsers also send fake click events for toggling radio
        //       buttons.
        //       This approach avoids to interfere with that behavior while
        //       ensuring a consistent keyboard resetting method (through the
        //       Delete key).
    ) {
        const me = this;
        let checked = true; // All raddio buttons become checked on click.
        const lastSelection = Object.is(me.lastClicked?.target, event.target);
        if (lastSelection) checked = (
            ! me.lastClicked.checked    // Click  => Toggle
            && event.type !== "keydown" // Delete => Reset
        );
        me.lastClicked = {
            target: event.target,
            checked,
        };
        event.target.checked = checked;
    };
};//}}}
