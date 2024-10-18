// types/label.type.js
// ===================
import {SmarkComponent} from "../lib/component.js";

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
//
//   🚀 Implement "text templating" feature.
//      👉 This should allow to include contextual data in the text of the
//         label.
//      ⚡ For example, list item position for list items...
//

export class label extends SmarkComponent {
    constructor(node, options, ...args){
        delete options.name; // Labels are always unnamed.
        return super(node, options, ...args);
    };
    render(){
        const me = this;
        me.parent.onRendered(()=>{
            const labelArgs = me.getLabelArgs();
            const {targetField} = labelArgs.target || {};
            if (targetField) { // Apply only to native inputs (scalars)
                if (! targetField.id) { // Ensure targetted field has an Id
                    targetField.id = Math.random().toString(36).substring(2);
                };
                me.target.setAttribute("for", targetField.id);
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
            const candidates = context.target.querySelectorAll(me.selector);
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
                    Object.is(candidates[childName], me.target)
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
