// types/date.type.js
// ==================
import {input} from "./input.type.js";
import {action} from "./trigger.type.js";
const re_timePart = /T.*/;
function parseDateStr(str) {//{{{
    // Accept "YYYYMMDD":
    if (str.length == 8) return new Date([
        str.substring(0, 4),
        str.substring(4, 6),
        str.substring(6, 8),
    ].join("-"));

    // Accept "YYYY-MM-DD" (like date inputs)
    // > new Date("2023-11-30")
    // 2023-11-30T00:00:00.000Z
    // ...but don't accept if not zero-padded:
    // > new Date("2023-11-3")
    // 2023-11-02T23:00:00.000Z
    if (
        str.length == 10
        && str[4] == "-"
        && str[7] == "-"
    ) return new Date(str);

    // Also don't accept other locale dependant formats:
    // > new Date("11/30/2023")
    // 2023-11-29T23:00:00.000Z

    return NaN;
};//}}}
function ISODate(value) {//{{{
    return value.toISOString().replace(re_timePart, "");
};//}}}
export class date extends input {
    async render() {//{{{
        await super.render();
        const me = this;
        const targetTag = me.targetFieldNode.tagName;
        const targetType = me.targetFieldNode.getAttribute("type");
        if (
            targetTag != "INPUT"
            || (targetType || "date").toLowerCase() != "date"
        ) throw me.renderError(
            'NOT_A_DATE_FIELD'
            , `Date inputs require an INPUT tag of type "date".`
        );
        if (! targetType) me.targetFieldNode.type = "date"; // Autofill
    };//}}}
    @action
    // (Done in parent class) @export_to_target
    async export(...args) {//{{{
        const me = this;
        const data = await super.export(...args);
        if (me.isSingleton) return data; // Overload only inner field
        if (! data.length) return null;
        const value = parseDateStr(data);
        return (
            isNaN(value) ? null
            : ISODate(value)
        );
    };//}}}
    @action
    async import({data = null, focus = true} = {}) {//{{{
        const me = this;
        if (me.isSingleton) return await super.import({data, focus}); // Overload only inner field
        const value = (
            data instanceof Date ? data // Accept Date instance
            : typeof data == "number" ? new Date(data) // Accept epoch
            : ! data || (typeof data != "string") ? NaN // Reject nullish
            : parseDateStr(data) // Handle strings
        );
        const retv = await super.import({data:(
            isNaN(value) ? null
            : ISODate(value)
        ), focus});
        return retv;
    };//}}}
    async isEmpty() {//{{{
        const me = this;
        const value = await me.export();
        return value === null;
    };//}}}
};
