// types/number.type.js
// ====================
import {input} from "./input.type.js";
import {action} from "./trigger.type.js";
import {validateInputType} from "../lib/helpers.js";
export class number extends input {
    async render() {//{{{
        await super.render();
        const me = this;
        try {
            validateInputType(
                me.targetFieldNode,
                "number",
                'NOT_A_NUMBER_FIELD',
                `Number inputs require an INPUT tag of type "number".`
            );
        } catch (error) {
            throw me.renderError(error.code, error.message);
        }
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
