// types/label.type.js
// ===================
import {SmarkComponent} from "../lib/component.js";
import {randomId} from "../lib/helpers.js";
import {getRoots} from "../lib/helpers.js";

export class label extends SmarkComponent {
    constructor(node, {allow_select = false, ...options}, ...args){
        delete options.name; // Labels are always unnamed.
        super(node, {allow_select, ...options}, ...args);
        const me = this;
        me.eventHooks.click.push(
            function click_hook(ev) {
                // Mimic native label behavior for non-native fields:
                if (ev.defaultPrevented) return;
                const {target} = me.getLabelArgs();
                if (! target?.targetFieldNode) target.focus();
            },
        );
    };
    async render(){
        const me = this;
        // Enhance triggers inside the label:
        for (
            const node
            of getRoots(me.targetNode, me.selector)
        ) {
            const newItem = await me.enhance(node);
            if (!! newItem?._isField) {
                throw me.renderError(
                    'FIELD_IN_LABEL'
                    , `Non action components not allowed in labels, found ${newItem.name} in form ${me.getPath()}.`
                );
            };
        };
        me.parent.onRendered(async ()=>{
            const nodeType = String(me.targetNode.tagName).toLowerCase();
            const labelArgs = me.getLabelArgs();
            const labelledField = labelArgs.target || {};
            await labelledField.rendered; // Ensure target field is rendered.
            if (labelledField.targetFieldNode) { // Apply only to native inputs (scalars)
                if (! labelledField.targetFieldNode.id) { // Ensure targetted field has an Id
                    labelledField.targetFieldNode.id = randomId();
                };
                me.targetNode.setAttribute("for", labelledField.targetFieldNode.id);
            };

            // Automatically link label and field for screen readers:
            if (
                nodeType != "label"   // Not a native <label>
            ) {
                // Ensure label has an Id:
                if (! me.targetNode.id) {
                    me.targetNode.id = randomId();
                };
                // Get previous aria-labelledby values:
                const alb_arr = (
                    labelledField.targetNode.getAttribute("aria-labelledby")
                    || ""
                )
                    .split(" ")
                    .filter(id => id)
                ;
                // Add label id if not already present:
                if (0 > alb_arr.indexOf(me.targetNode.id)) {
                    alb_arr.push(me.targetNode.id);
                };
                // Reinject updated list:
                labelledField.targetNode.setAttribute(
                    "aria-labelledby"
                    , alb_arr.join(" ")
                );
            } else {
                if (! labelledField.targetFieldNode) {
                    throw me.renderError(
                        'LABEL_FOR_NONFIELD'
                        , `Native <label> tags targetting non native field are not allowed in HTML, you should use different tag.`
                    );
                };
            };

            // Make labels non-selectable unless "allow_select" option is set
            // to true.
            if (! me.options.allow_select) {
                me.targetNode.style["user-select"] = "none";
            };
        });
    };
    getLabelArgs() {//{{{
        const me = this;
        let context, target;

        const {
            // property: local variable
            context: contextPath,     // Define context component
            target: targetPath,       // Define targetted child component
            ...otherOptions
        } = me.options;

        if (! contextPath && ! targetPath) {
            // Guess ;-)
            context = me.parent;
            const candidates = context.targetNode.querySelectorAll(me.selector);
            let found = false;
            for (const childName in candidates) {
                if (found) {
                    let targetComponent = me.getComponent(candidates[childName]);
                    if (targetComponent?._isField) {
                        // FIXME : Dig deeper in case of non native field tags
                        // (forms, lists, singletons...)
                        // It may require to await for rendering or even listen
                        // to events (lists with minItems = 0);
                        target = targetComponent;
                        break;
                    };
                } else if (
                    Object.is(candidates[childName], me.targetNode)
                ) {
                    found = true;;
                };
            };
        } else {
            context = (
                contextPath ? me.parent.find(contextPath)
                : me.parent
            );
            target = (
                targetPath ? context.find(targetPath) // Explicit target (context relative)
                : context
            );
        };

        return {
            origin: me,
            context,
            target,
            ...otherOptions,
        };

    };//}}}
};
