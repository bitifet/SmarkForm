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
            const sons = Object.values(me.children);
            if (sons.length != 1) throw me.renderError(
                'NOT_A_SINGLETON'
                , `Singleton forms are only allowed to contain exactly one`
                + ` data field but ${sons.length} found.`
            );
            const son = sons[0];
            if (me.options.type !== son.options.type) throw me.renderError(
                'SINGLETON_TYPE_MISMATCH'
                , `Singleton type (${me.options.type})`
                + ` does not match child field type (${son.options.type}).`
            );
            me.targetFieldNode = son.targetNode;
        } else {
            me.targetFieldNode = me.targetNode;
        };
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
    async import({data = "", focus = true} = {}) {//{{{
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
    async clear({focus} = {}) {//{{{
        const me = this;
        await me.import({focus});
    };//}}}
};
