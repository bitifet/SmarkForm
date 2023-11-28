// types/input.type.js
// ===================
import {form} from "./form.type.js";
import {action} from "./trigger.type.js";
export class input extends form {
    async render() {//{{{
        const me = this;
        me.isSingleton = ! (
            me.target.tagName === "INPUT"
            || me.target.tagName === "SELECT"
            || me.target.tagName === "TEXTAREA"
        );
        me.isCheckbox = (
            ! me.isSingleton
            && String(me.target.type).toLowerCase() == "checkbox"
        );
        if (me.isSingleton) {
            await super.render();
            const numFields = Object.keys(me.children).length;
            if (numFields != 1) throw me.renderError(
                'NOT_A_SINGLETON'
                , `Singleton forms are only allowed to contain exactly one`
                + ` data field but ${numFields} found.`
            );
        }
        me.targetField = (
            me.isSingleton ? me.children[0]
            : me.target
        );
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
            me.isSingleton ? Object.values(await super.export())[0]
            : me.isCheckbox ? !!me.target.checked
            : me.target.value
        );
    };//}}}
    @action
    async import({data = ""}) {//{{{
        const me = this;
        if (me.isSingleton) {
            return await super.import({data: Object.fromEntries(
                [[Object.keys(me.children)[0], data]]
            )});
        } else if (me.isCheckbox) {
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
