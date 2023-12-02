// types/number.type.js
// ====================
import {input} from "./input.type.js";
import {action} from "./trigger.type.js";
export class number extends input {
    async render() {//{{{
        await super.render();
        const me = this;
        const targetTag = me.targetField.tagName;
        const targetType = me.targetField.getAttribute("type");
        if (
            targetTag != "INPUT"
            || (targetType || "number").toLowerCase() != "number"
        ) throw me.renderError(
            'NOT_A_NUMBER_FIELD'
            , `Number inputs require an INPUT tag of type "number".`
        );
        if (! targetType) me.targetField.type = "number"; // Autofill
    };//}}}
    @action
    async export() {//{{{
        const data = await super.export();
        return (
            data.length && ! isNaN(data) ? Number(data)
            : null
        );
    };//}}}
    @action
    async import({data = null}) {//{{{
        const typename = typeof data;
        return await super.import({data:(
            typename == "number" ? data
            : typename == "string"
                && data.length
                && ! isNaN(data)
                ? Number(data)
            : null
        )});
    };//}}}
    async isEmpty() {//{{{
        const me = this;
        const value = await me.export();
        return value === null;
    };//}}}
};
