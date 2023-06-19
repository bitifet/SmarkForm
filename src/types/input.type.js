// types/input.type.js
// ===================
import {SmarkComponent} from "../lib/component.js";
import {action} from "./action.type.js";
export class input extends SmarkComponent {
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
    @action
    async export() {//{{{
        const me = this;
        return me.target.value;
    };//}}}
    @action
    async import(value = "") {//{{{
        const me = this;
        me.target.value = value;
        // me.target.dispatchEvent(
        //     new customEvent("change", {})
        // );
        return me.target.value;
    };//}}}
    async isEmpty() {//{{{
        const me = this;
        const value = await me.export();
        return ! value.trim().length;
            // Native input's value type is always a string.
    };//}}}
    @action
    async empty() {//{{{
        const me = this;
        await me.import("");
    };//}}}
};
