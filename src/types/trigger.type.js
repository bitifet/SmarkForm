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
        const parents = [...me.parents];
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


