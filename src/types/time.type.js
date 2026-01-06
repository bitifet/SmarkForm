// types/time.type.js
// ===================
import {input} from "./input.type.js";
import {action} from "./trigger.type.js";
import {parseTime, validateInputType} from "../lib/helpers.js";

function ISOTime(value) {//{{{
    // Extract time from Date object in HH:mm:ss format
    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');
    const seconds = String(value.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};//}}}

export class time extends input {
    async render() {//{{{
        await super.render();
        const me = this;
        try {
            validateInputType(
                me.targetFieldNode,
                "time",
                'NOT_A_TIME_FIELD',
                `Time inputs require an INPUT tag of type "time".`
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
        const value = parseTime(data);
        return value; // Already in HH:mm:ss format or null
    };//}}}
    @action
    // (Done in parent class) @import_from_target
    async import(data = null, options = {}) {//{{{
        const me = this;
        if (me.isSingleton) return await super.import(data, options); // Overload only inner field
        const value = (
            data instanceof Date ? ISOTime(data) // Accept Date instance
            : typeof data == "number" ? ISOTime(new Date(data)) // Accept epoch
            : ! data || (typeof data != "string") ? null // Reject nullish or non-strings
            : parseTime(data) // Handle strings
        );
        const retv = await super.import(value, options);
        return retv;
    };//}}}
    async isEmpty() {//{{{
        const me = this;
        const value = await me.export(null, {silent: true});
        return value === null;
    };//}}}
};
