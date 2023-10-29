// types/input.type.js
// ===================
import {SmarkComponent} from "../lib/component.js";
import {action} from "./trigger.type.js";
export class input extends SmarkComponent {
    render() {//{{{
        const me = this;
        me.isCheckbox = String(me.target.type).toLowerCase() == "checkbox";
        // console.log("New input!!!!", {
        //     target: me.target,
        //     parent: me.parent,
        //     options: me.options,
        //     inputField: me.inputField,
        // });
        return;
    };//}}}
    @action
    async export() {//{{{
        const me = this;
        return (
            me.isCheckbox ? !!me.target.checked
            : me.target.value
        );
    };//}}}
    @action
    async import({data = ""}) {//{{{
        const me = this;
        if (me.isCheckbox) {
            me.target.checked = !! data;
        } else {
            me.target.value = data;
        };
        // me.target.dispatchEvent(
        //     new customEvent("change", {})
        // );
        return me.target.value;
    };//}}}
    async isEmpty() {//{{{
        const me = this;
        const value = (
            me.isCheckbox ? "" // Do not consider checkboxes.
            : await me.export()
        );
        return ! value.trim().length;
            // Native input's value type is always a string.
    };//}}}
    @action
    async empty() {//{{{
        const me = this;
        await me.import({data: ""});
    };//}}}
};
