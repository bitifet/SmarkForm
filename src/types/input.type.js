// types/input.type.js
// ===================
import {form} from "./form.type.js";
import {action} from "./trigger.type.js";
export class input extends form {
    async render() {//{{{
        const me = this;
        me.isSingleton = ! (
            me.targetNode.tagName === "INPUT"
            || me.targetNode.tagName === "SELECT"
            || me.targetNode.tagName === "TEXTAREA"
        );
        me.isCheckbox = (
            ! me.isSingleton
            && String(me.targetNode.type).toLowerCase() == "checkbox"
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
        me.targetFieldNode = (
            me.isSingleton ? Object.values(me.children)[0].targetNode
            : me.targetNode
        );
        // console.log("New input!!!!", {
        //     targetNode: me.targetNode,
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
            : me.isCheckbox ? !!me.targetNode.checked
            : me.targetNode.value
        );
    };//}}}
    @action
    async import({data = "", focus = true}) {//{{{
        const me = this;
        if (me.isSingleton) {
            return await super.import({data: Object.fromEntries(
                [[Object.keys(me.children)[0], data]]
            ), focus});
        } else if (me.isCheckbox) {
            me.targetNode.checked = !! data;
        } else {
            me.targetNode.value = data;
        };
        // me.targetNode.dispatchEvent(
        //     new customEvent("change", {})
        // );
        if (focus) me.focus();
        return me.targetNode.value;
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
    async empty({empty}) {//{{{
        const me = this;
        await me.import({data: "", focus});
    };//}}}
};
