// components/action.component.js
// ==============================
import {SmartComponent} from "../lib/component.js";
export class action extends SmartComponent {
    render(){};
};

export function onActionClick(ev) {
    const me = this;

    const actionTarget = me.getComponent(ev.target);
    const {options, parent} = actionTarget;
    const parents = [...actionTarget.parents];
    const { action, for: path, to: toTarget} = options;

    if (! action) return; // Not an action component.

    // Allow binding actions to specific component types:
    // (Syntax "type:action")
    let [targetAction, targetType] = action.split(":").reverse();

    const context = (
        path ? parent.find(path)
        : parents.find(p=>{
            if (targetType && p.typeName != targetType) return false;
            if (typeof p[targetAction] != "function") return false;
            return true;
        })
    );

    const target = (
        toTarget ? context.find(toTarget) // Explicit target (context relative)
        : path ? null // Explicit context path => don't mind component position
        : parents.find(p=>p.parent.target.isSameNode(context.target))
    );

    if (typeof context[targetAction] != "function") throw me.renderError(
        'UNKNOWN_ACTION'
        , `Unimplemented action ${action}`
        + (context ? ` for ${context.options.type}` : "")
    );

    context[targetAction]({
        origin: actionTarget,
        context,
        target,
        ...options
    });

};


