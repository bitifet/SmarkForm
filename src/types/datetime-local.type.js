// types/datetime-local.type.js
// ==============================
import {input} from "./input.type.js";
import {action} from "./trigger.type.js";
import {parseDateTime, validateInputType} from "../lib/helpers.js";

function ISODateTimeLocal(value) {//{{{
    // Format as YYYY-MM-DDTHH:mm:ss (local time, no timezone)
    const year = String(value.getFullYear()).padStart(4, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');
    const seconds = String(value.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};//}}}

export class datetimeLocal extends input {
    async render() {//{{{
        await super.render();
        const me = this;
        try {
            validateInputType(
                me.targetFieldNode,
                "datetime-local",
                'NOT_A_DATETIME_LOCAL_FIELD',
                `Datetime-local inputs require an INPUT tag of type "datetime-local".`
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
        if (! data.length) return null;
        const value = parseDateTime(data);
        return (
            isNaN(value) ? null
            : ISODateTimeLocal(value)
        );
    };//}}}
    @action
    // (Done in parent class) @import_from_target
    async import(data = null, {focus = true} = {}) {//{{{
        const me = this;
        if (me.isSingleton) return await super.import(data, {focus}); // Overload only inner field
        const value = (
            data instanceof Date ? data // Accept Date instance
            : typeof data == "number" ? new Date(data) // Accept epoch
            : ! data || (typeof data != "string") ? NaN // Reject nullish
            : parseDateTime(data) // Handle strings
        );
        const retv = await super.import((
            isNaN(value) ? null
            : ISODateTimeLocal(value)
        ), {focus});
        return retv;
    };//}}}
    async isEmpty() {//{{{
        const me = this;
        const value = await me.export(null, {silent: true});
        return value === null;
    };//}}}
};
