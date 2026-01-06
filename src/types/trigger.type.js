// types/trigger.type.js
// =====================
import {SmarkComponent} from "../lib/component.js";

export const action = function action_decorator(targetMtd, {kind, name, addInitializer}) {
    if (kind == "method") addInitializer(function registerAction() {
        const me = this;
        this.actions[name] = async function (data, options = {}) {
            // Actions are async functions that can be triggered by trigger
            // components.
            // They receive data and options as arguments.
            // They emit BeforeAction_<name> and AfterAction_<name> events.
            // The options argument is passed to event handlers as is but with
            // data property set to data argument.
            // If a BeforeAction_<name> event handler calls event.preventDefault(),
            // the action is cancelled.
            // Some actions may accept a "focus" option to focus the target component
            // after the action is performed. When tey are executed via trigger components,
            // the default value of that option is true.
            if (! Object.hasOwnProperty(options, "focus")) options.focus = true;
            let defaultPrevented = false;
            options.data = data;
            if (! options.silent) {
                defaultPrevented = ! await me.emit(`BeforeAction_${name}`, options);
                data = options.data; // Update data in case it was modified by event handlers.
            };
            if (defaultPrevented) return; // Action cancelled by event handler.
            // Cal the method implementing the action.
            // It receives data and options arguments.
            // Here options.data is set to the input data argument.
            // After execution, options.data is updated with the returned data.
            data = await targetMtd.call(me, data, options);
            options.data = data;
            if (! options.silent) {
                me.emit(`AfterAction_${name}`, options);
            };
            // The resulting action method returns the data returned by the
            // original method.
            // Options object can be mutated inside the original method and
            // that mutations will be visible to the AfterAction_xxxx event
            // handlers.
            return data;
        };
    });
};

export class trigger extends SmarkComponent {
    constructor(node, options, ...args){
        delete options.name; // Triggers are always unnamed.
        return super(node, options, ...args);
    };
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
        me.targetNode.disabled = true;
    };//}}}
    enable() {//{{{
        const me = this;
        me.targetNode.disabled = false;
    };//}}}
    getTriggerArgs() {//{{{
        const me = this;
        const parents = [me, ...me.parents];
        const {
            // property: local variable
            action,
            context: contextPath,     // Define context component
            target: targetPath,       // Define targetted child component
            ...otherOptions
        } = me.options;
        if (! action) return; // Not a trigger component.

        const context = (
            contextPath ? me.parent.find(contextPath)
            : parents.find(p=>(typeof p.actions[action] == "function"))
        );

        const target = (
            targetPath ? context?.find(targetPath) // Explicit target (context relative)
            : contextPath ? null // Explicit context path => don't mind component position
            : (
                parents
                    .slice(1) // Skip self
                    .find(p=>p.parent?.targetNode.isSameNode(context?.targetNode))
                || null
            )
        );

        return {
            action,
            origin: me,
            context,
            target,
            ...otherOptions,
        };

    };//}}}
};

export async function onTriggerClick(ev) {
    const me = this;
    const triggerComponent = me.getComponent(ev.target);
    const options = triggerComponent.getTriggerArgs();
    if (! options) return; // Not a trigger.
    const {context, action, data} = options;
    const mtd = context?.actions[action]
    if (
        typeof mtd != "function"
    ) throw me.renderError(
        "UNKNOWN_ACTION"
        , `Unknown action ${action}`
        + (context ? ` for ${context.options.type}` : "")
    );
    return await mtd(data, options);
};


