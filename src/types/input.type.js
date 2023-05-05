// types/input.type.js
// ===================
import {SmartComponent} from "../lib/component.js";
import {action} from "./action.type.js";
export class input extends SmartComponent {
    render() {//{{{
        const me = this;
        // console.log("New input!!!!", {
        //     target: me.target,
        //     parent: me.parent,
        //     options: me.options,
        //     inputField: me.inputField,
        // });
        return;
    };//}}}
    exportSync() {//{{{
        const me = this;
        return me.target.value;
    };//}}}
    async import(value = "") {//{{{
        const me = this;
        me.target.value = value;
        // me.target.dispatchEvent(
        //     new customEvent("change", {})
        // );
        return me.target.value;
    };//}}}
    isEmpty() {//{{{
        const me = this;
        const value = me.exportSync();
        return ! value.trim().length;
            // Native input's value type is always a string.
    };//}}}
    @action
    empty() {//{{{
        const me = this;
        me.import("");
    };//}}}
};
