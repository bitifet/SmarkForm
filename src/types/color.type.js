// types/color.type.js
// ===================
import {input} from "./input.type.js";
import {action} from "./trigger.type.js";
import {parseJSON} from "../lib/helpers.js";
const re_color = /^#([a-f0-9]{3}){1,2}$/i;
const disabled_style = `
    opacity: .5;
    background: repeating-linear-gradient(
            45deg,
            black,
            black 10px,
            white 10px,
            white 20px
        ),
        black;
    background-blend-mode: difference;
`;
export class color extends input {
    async render() {//{{{
        await super.render();
        const me = this;

        if (me.isSingleton) return; // (Only for real field)

        // Check targetField's type attribute:
        const targetTag = me.targetFieldNode.tagName;
        const targetType = me.targetFieldNode.getAttribute("type");
        if (
            targetTag != "INPUT"
            || (targetType || "color").toLowerCase() != "color"
        ) throw me.renderError(
            'NOT_A_COLOR_FIELD'
            , `Color inputs require an INPUT tag of type "color".`
        );
        if (! targetType) me.targetFieldNode.type = "color"; // Autofill

        // Iniitialize me.isDefined flag:
        const valueAttr = me.targetFieldNode.getAttribute("value");
        me.isDefined = (
            valueAttr !== null         // value property not defined
            && valueAttr.trim() !== "" // value property defined (string)
        );

        // Remember original "style" attribute and update if appropriate:
        me.defaultStyleAttr = me.targetFieldNode.getAttribute("style") + ";";
        if (! me.isDefined) me.targetFieldNode.setAttribute(
            "style"
            , me.defaultStyleAttr + disabled_style
        );

        // Handle me.isDefined set:
        const resetDefined = ev=>{
            if (
                ev.code    !== "Enter"
                && ev.Code !== "Space"
                && ev.code !== undefined // ev.type must be "click" or "change"
                    // && ev.type !== "click" // Click event
                    // && ev.type !== "change" // Change event
            ) return;
            me.isDefined = true;
            me.targetFieldNode.setAttribute("style", me.defaultStyleAttr);
        };
        me.targetFieldNode.addEventListener("keydown", resetDefined);
        me.targetFieldNode.addEventListener("click", resetDefined);
        me.targetFieldNode.addEventListener("change", resetDefined);

    };//}}}
    @action
    // (Done in parent class) @export_to_target
    async export(...args) {//{{{
        const me = this;
        let data = await super.export(...args);
        if (! me.isSingleton) data = (
            me.isDefined && data.match(re_color) ? data.toLowerCase()
            : null
        );
        return data;
    };//}}}
    @action
    async import({data = null, focus = true} = {}) {//{{{
        const me = this;
        if (
            ! me.isSingleton // Only for real field
            && data === null
        ) {
            me.isDefined = false;
            me.targetFieldNode.setAttribute(
                "style"
                , me.defaultStyleAttr + disabled_style
            );
        };
        const value = await super.import({data, focus});
        return (
            me.isDefined ? value
            : null
        );
    };//}}}
    async isEmpty() {//{{{
        const me = this;
        const value = await me.export();
        return value === null;
    };//}}}
};

