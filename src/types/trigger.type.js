// types/trigger.type.js
// =====================
import {SmarkComponent} from "../lib/component.js";

const beforeEvent = Symbol("beforeEventName");
const afterEvent = Symbol("afterEventName");

export const action = function action_decorator(targetMtd, {kind, name, addInitializer}) {
    if (kind == "method") addInitializer(function registerAction() {
        this.actions[name] = targetMtd.bind(this);
        this.actions[name][beforeEvent] = `BeforeAction_${name}`;
        this.actions[name][afterEvent] = `AfterAction_${name}`;
    });
};


export class trigger extends SmarkComponent {
    render(){
        const me = this;
        me.parent.onRendered(()=>{
            const triggerArgs = me.getTriggerArgs();
            if (
                typeof triggerArgs.context?.onTriggerRender == "function"
            ) triggerArgs.context.onTriggerRender(triggerArgs);
        });
    };
    disable() {//{{{
        const me = this;
        me.target.disabled = true;
    };//}}}
    enable() {//{{{
        const me = this;
        me.target.disabled = false;
    };//}}}
    getTriggerArgs() {//{{{
        const me = this;
        const parents = [...me.parents];
        const { action:actionSpec, for: path, to: toTarget} = me.options;
        if (! actionSpec) return; // Not a trigger component.

        // Allow binding triggers to specific component types:
        // (Syntax "type:action")
        let [actionName, targetType] = actionSpec.split(":").reverse();

        const context = (
            path ? me.parent.find(path)
            : parents.find(p=>{
                if (targetType && p.options.type != targetType) return false;
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

export async function onTriggerClick(ev) {
    const me = this;
    const triggerComponent = me.getComponent(ev.target);
    const options = triggerComponent.getTriggerArgs();
    if (! options) return; // Not a trigger.
    const {context, action} = options;
    const mtd = context?.actions[action]
    if (
        typeof mtd != "function"
    ) throw me.renderError(
        "UNKNOWN_ACTION"
        , `Unknown action ${action}`
        + (context ? ` for ${context.options.type}` : "")
    );
    if (await me.emit(mtd[beforeEvent], options)) {
        const data = await mtd(options);
        me.emit(mtd[afterEvent], {...options, data});
    };
};


