// types/number.type.js
// ====================
import {input} from "./input.type.js";
import {action} from "./trigger.type.js";
export class number extends input {
    async render() {//{{{
        await super.render();
        const me = this;
        const targetTag = me.targetFieldNode.tagName;
        const targetType = me.targetFieldNode.getAttribute("type");
        if (
            targetTag != "INPUT"
            || (targetType || "number").toLowerCase() != "number"
        ) throw me.renderError(
            'NOT_A_NUMBER_FIELD'
            , `Number inputs require an INPUT tag of type "number".`
        );
        if (! targetType) me.targetFieldNode.type = "number"; // Autofill
    };//}}}
    @action
    async export() {//{{{
        const me = this;
        const data = await super.export();
        if (me.isSingleton) return data; // Overload only inner field
        return (
            data.length && ! isNaN(data) ? Number(data)
            : null
        );
    };//}}}
    @action
    async import({data = null, focus = true} = {}) {//{{{
        const me = this;
        const typename = typeof data;
        if (me.isSingleton) return await super.import({data, focus}); // Overload only inner field
        const retv =  await super.import({data:(
            typename == "number" ? data
            : typename == "string"
                && data.length
                && ! isNaN(data)
                ? Number(data)
            : null
        ), focus});
        return retv;
    };//}}}
    async isEmpty() {//{{{
        const me = this;
        const value = await me.export();
        return value === null;
    };//}}}
};
