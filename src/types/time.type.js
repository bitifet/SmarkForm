// types/time.type.js
// ===================
import {input} from "./input.type.js";
import {action} from "./trigger.type.js";

function parseTimeStr(str) {//{{{
    // Accept "HH:mm" format (5 characters)
    if (str.length === 5 && str[2] === ":") {
        const hours = parseInt(str.substring(0, 2), 10);
        const minutes = parseInt(str.substring(3, 5), 10);
        if (
            hours >= 0 && hours <= 23
            && minutes >= 0 && minutes <= 59
        ) {
            return str + ":00"; // Add seconds
        }
    }
    
    // Accept "HH:mm:ss" format (8 characters)
    if (str.length === 8 && str[2] === ":" && str[5] === ":") {
        const hours = parseInt(str.substring(0, 2), 10);
        const minutes = parseInt(str.substring(3, 5), 10);
        const seconds = parseInt(str.substring(6, 8), 10);
        if (
            hours >= 0 && hours <= 23
            && minutes >= 0 && minutes <= 59
            && seconds >= 0 && seconds <= 59
        ) {
            return str;
        }
    }
    
    // Accept "HHmmss" format (6 characters)
    if (str.length === 6) {
        const hours = parseInt(str.substring(0, 2), 10);
        const minutes = parseInt(str.substring(2, 4), 10);
        const seconds = parseInt(str.substring(4, 6), 10);
        if (
            hours >= 0 && hours <= 23
            && minutes >= 0 && minutes <= 59
            && seconds >= 0 && seconds <= 59
        ) {
            return [
                str.substring(0, 2),
                str.substring(2, 4),
                str.substring(4, 6),
            ].join(":");
        }
    }
    
    // Accept "HHmm" format (4 characters)
    if (str.length === 4) {
        const hours = parseInt(str.substring(0, 2), 10);
        const minutes = parseInt(str.substring(2, 4), 10);
        if (
            hours >= 0 && hours <= 23
            && minutes >= 0 && minutes <= 59
        ) {
            return [
                str.substring(0, 2),
                str.substring(2, 4),
                "00"
            ].join(":");
        }
    }
    
    return null;
};//}}}

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
        const targetTag = me.targetFieldNode.tagName;
        const targetType = me.targetFieldNode.getAttribute("type");
        if (
            targetTag != "INPUT"
            || (targetType || "time").toLowerCase() != "time"
        ) throw me.renderError(
            'NOT_A_TIME_FIELD'
            , `Time inputs require an INPUT tag of type "time".`
        );
        if (! targetType) me.targetFieldNode.type = "time"; // Autofill
    };//}}}
    @action
    // (Done in parent class) @export_to_target
    async export(...args) {//{{{
        const me = this;
        const data = await super.export(...args);
        if (me.isSingleton) return data; // Overload only inner field
        if (! data.length) return null;
        const value = parseTimeStr(data);
        return value; // Already in HH:mm:ss format or null
    };//}}}
    @action
    // (Done in parent class) @import_from_target
    async import(data = null, {focus = true} = {}) {//{{{
        const me = this;
        if (me.isSingleton) return await super.import(data, {focus}); // Overload only inner field
        const value = (
            data instanceof Date ? ISOTime(data) // Accept Date instance
            : typeof data == "number" ? ISOTime(new Date(data)) // Accept epoch
            : ! data || (typeof data != "string") ? null // Reject nullish
            : parseTimeStr(data) // Handle strings
        );
        const retv = await super.import(value, {focus});
        return retv;
    };//}}}
    async isEmpty() {//{{{
        const me = this;
        const value = await me.export(null, {silent: true});
        return value === null;
    };//}}}
};
