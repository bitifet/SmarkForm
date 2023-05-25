// types/action.type.js
// ====================
import {SmarkComponent} from "../lib/component.js";


export const action = function action_decorator(targetMtd, {kind, name, addInitializer}) {
    if (kind == "method") addInitializer(function registerAction() {
        this.actions[name] = targetMtd.bind(this);
    });
};


export class action_type extends SmarkComponent {
    render(){};
    disable() {//{{{
        const me = this;
        me.target.disabled = true;
    };//}}}
    enable() {//{{{
        const me = this;
        me.target.disabled = false;
    };//}}}
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
                if (typeof p.actions[actionName] != "function") return false;
                return true;
            })
        );

        const target = (
            toTarget ? context.find(toTarget) // Explicit target (context relative)
            : path ? null // Explicit context path => don't mind component position
            : parents.find(p=>p.parent?.target.isSameNode(context?.target))
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
    const mtd = context?.actions[action]
    if (
        typeof mtd != "function"
    ) throw me.renderError(
        "UNKNOWN_ACTION"
        , `Unknown action ${action}`
        + (context ? ` for ${context.options.type}` : "")
    );
    mtd(options);
};


