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
    // (Done in parent class) @export_to_target
    async export(...args) {//{{{
        const me = this;
        const data = await super.export(...args);
        if (me.isSingleton) return data; // Overload only inner field
        return (
            data.length && ! isNaN(data) ? Number(data)
            : null
        );
    };//}}}
    @action
    // (Done in parent class) @import_from_target
    async import(data = null, options = {}) {//{{{
        const me = this;
        const typename = typeof data;
        if (me.isSingleton) return await super.import(data, options); // Overload only inner field
        const retv =  await super.import((
            typename == "number" ? data
            : typename == "string" && data.length && ! isNaN(data) ? Number(data)
            : null
        ), options);
        return retv;
    };//}}}
    async isEmpty() {//{{{
        const me = this;
        const value = await me.export(null, {silent: true});
        return value === null;
    };//}}}
};
