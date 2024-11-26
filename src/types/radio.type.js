// types/radio.type.js
// ===================
import {input} from "./input.type.js";
import {action} from "./trigger.type.js";
import {randomId} from "../lib/helpers.js";
export class radio extends input {
    constructor(...args) {
        super(...args);
        const me = this;
        const singleton = me.parent.children[me.name];
        if (singleton) {
            me.targetNode.setAttribute("name", singleton.sharedNodeName);
            singleton.radioButtons.push(me.targetNode);
            return {}; // Not a field.
        } else {
            // Provide unique name for DOM navigation to work properly:
            me.sharedNodeName = randomId();
            me.targetNode.setAttribute("name", me.sharedNodeName);
            me.radioButtons = [
                me.targetNode
            ];
        };
        return me;
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
    async export() {//{{{
        return this.radioButtons.find(r=>r.checked)?.value;
    };//}}}
    @action
    async import({data = null, focus = true}) {//{{{
        const selected = this.radioButtons.find(r=>r.value === data);
        if (selected) selected.checked = true;
        if (focus) this.focus();
    };//}}}
    async isEmpty() {//{{{
        return ! (1 + this.radioButtons.findIndex(r=>r.checked));
    };//}}}
};

