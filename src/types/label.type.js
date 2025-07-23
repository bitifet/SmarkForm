// types/label.type.js
// ===================
import {SmarkComponent} from "../lib/component.js";
import {randomId} from "../lib/helpers.js";
import {getRoots} from "../lib/helpers.js";

// TODO:
// =====
//
//   🚀 Add support for (smarkform) fields contained in the label.
//      👉 Now we can just not enhance the label (<label>Bla bla bla<input
//         data-smark></label>) and it will (in this case natively) work.
//      👉 ...but this does not allow us to use other SmarkForm fields such as
//         forms and lists (since they can contain more than one native field
//         which is not allowed by <label> tag.
//      💡 But we can use different tag (with {data-smark="label"}) and just
//         create the native <label> tag around the text.

export class label extends SmarkComponent {
    constructor(node, {allow_select = false, ...options}, ...args){
        delete options.name; // Labels are always unnamed.
        return super(node, {allow_select, ...options}, ...args);
    };
    async render(){
        const me = this;
        // Enhance acctions:
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
        me.parent.onRendered(()=>{
            const labelArgs = me.getLabelArgs();
            const {targetFieldNode} = labelArgs.target || {};
            if (targetFieldNode) { // Apply only to native inputs (scalars)
                if (! targetFieldNode.id) { // Ensure targetted field has an Id
                    targetFieldNode.id = randomId();
                };
                me.targetNode.setAttribute("for", targetFieldNode.id);
            };
            if (! me.options.allow_select) {
                // Make labels non-selectable unless "allow_select" option
                // is set  to true.
                me.targetNode.style["user-select"] = "none";
            };
        });
    };
    getLabelArgs() {//{{{
        const me = this;
        const parents = [...me.parents];
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
