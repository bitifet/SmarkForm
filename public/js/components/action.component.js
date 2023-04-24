// components/action.component.js
// ==============================
import {SmartComponent} from "../lib/component.js";
export class action extends SmartComponent {
    render(){};
    getActionArgs() {//{{{
        const me = this;
        const parents = [...me.parents];
        const { action:actionSpec, for: path, to: toTarget} = me.options;
        if (! actionSpec) return; // Not an action component.

        // Allow binding actions to specific component types:
        // (Syntax "type:action")
        let [actionName, targetType] = actionSpec.split(":").reverse();

        const context = (
            path ? me.parent.find(path)
            : parents.find(p=>{
                if (targetType && p.typeName != targetType) return false;
                if (typeof p[actionName] != "function") return false;
                return true;
            })
        );

        const target = (
            toTarget ? context.find(toTarget) // Explicit target (context relative)
            : path ? null // Explicit context path => don't mind component position
            : parents.find(p=>p.parent.target.isSameNode(context.target))
        );

        if (typeof context[actionName] != "function") throw me.renderError(
            'UNKNOWN_ACTION'
            , `Unimplemented action ${actionSpec}`
            + (context ? ` for ${context.options.type}` : "")
        );

        return {
            action: actionName,
            origin: me,
            context,
            target,
            ...me.options
        };

    };//}}}
};

export function onActionClick(ev) {
    const me = this;
    const actionComponent = me.getComponent(ev.target);
    const options = actionComponent.getActionArgs();
    if (! options) return; // Not an action.
    const {context, action} = options;
    context[action](options);
};


