// lib/events.js
// =============

const sym_local_events = Symbol("Events");
const sym_all_events = Symbol("allEvents");
const re_actionEvHandler = /^on(?:Before|After)Action_/;
const re_localEvHandler = /^onLocal_/;
const re_allEvHandler = /^onAll_/;

import {createArrayPuller} from "./helpers.js";

const supportedFieldEventTypes = [
    "keydown", "keyup", "keypress",
    "beforeinput", "input", "change",
    "focus", "blur",
    "click", "dblclick", "contextmenu",
    "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout",
    "focusin", "focusout",

    // "select", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop",
    // "touchstart", "touchend", "touchmove", "touchcancel",
    // "wheel", "scroll", "resize",
    // "copy", "cut", "paste",
];

function registerEvHandler(evList, evType, evHandler) {
    const me = this;
    if (! evList.has(evType)) evList.set(evType, []);
    evList.get(evType).push(evHandler.bind(me));
    return me; // Make chainable.
};


export const events = function events_decorator(targetComponentType, {kind}) {
    if (kind == "class") {
        return class eventEnabledTarget extends targetComponentType {
            constructor(target, optionsSrc, ...args) {// {{{

                // Capture before/after action event hanlers through
                // onBeforeAction_xxx / onAfterAction_xxx options
                // ...and onLocal_xxx / onAll_xxx regular event handlers.
                const options = {};
                const onOptionCallbacks = [];
                for (
                    const [key, value]
                    of Object.entries(optionsSrc)
                ) if (key.match(re_actionEvHandler)) {
                    onOptionCallbacks.push([key.substring(2), value, "onLocal"])
                } else if (key.match(re_localEvHandler)) {
                    onOptionCallbacks.push([key.substring(8), value, "onLocal"])
                } else if (key.match(re_allEvHandler)) {
                    onOptionCallbacks.push([key.substring(6), value, "onAll"])
                } else {
                    // Threat the rest as regular options:
                    options[key] = value;
                };

                // Call original constructor:
                super(target, options, ...args);

                // Events enhancing:
                const me = this;
                me[sym_local_events] = new Map();
                me[sym_all_events] = new Map();
                me.onLocal = registerEvHandler.bind(me, me[sym_local_events]);
                me.onAll = registerEvHandler.bind(me, me[sym_all_events]);
                me.on = me.onAll; // Handy alias for listening all events.

                // Create event hooks object:
                me.eventHooks = createArrayPuller(super.eventHooks);
                    // eventHooks are eventHandlers provided by the component type.
                    // They are processed after regular events if not default prevented.

                // Field events redirection:
                if (
                    // Do it only once and from root component target:
                    Object.is(me, me.root)
                ) {
                    for (const evType of supportedFieldEventTypes) {
                        me.targetNode.addEventListener(evType, ev=>{
                            const targetComponent = me.getComponent(ev.target);
                            const evData = {
                                type: evType,
                                originalEvent: ev,
                                context: targetComponent,
                                preventDefault: ev.preventDefault.bind(ev),
                                stopPropagation: ev.stopPropagation.bind(ev),
                                stopImmediatePropagation: ev.stopImmediatePropagation.bind(ev),
                            };
                            targetComponent.emit(evType, evData);
                        }, true); // Use capture phase
                    };
                };

                // Setup action handlers provided through options:
                for (
                    const [evt, handler, listenLevel]
                    of onOptionCallbacks
                ) me[listenLevel](evt, handler);

            };// }}}
            async emit(evType, evData) {// {{{
                const me = this;
                let propagationStopped = false;
                let immediatePropagationStopped = false;
                const event = {
                    ...evData,
                    type: evType,
                    defaultPrevented: false,
                    preventDefault: () => event.defaultPrevented = true,
                    stopPropagation: () => propagationStopped = true,
                    stopImmediatePropagation: () => immediatePropagationStopped = true,
                };
                // Event target phase:
                const targetHandlers = [ // Local handlers, then global ones:
                    ...(me[sym_local_events].get(evType) || []),
                    ...(me[sym_all_events].get(evType) || []),
                ];
                for (const handler of targetHandlers) {
                    if (immediatePropagationStopped) break;
                    await handler(evData);
                };
                // Events bubbling phase:
                for (const parent of me.parents) {
                    if (propagationStopped) break;
                    const parentHandlers = parent[sym_all_events].get(evType) || [];
                    for (const handler of parentHandlers) {
                        if (immediatePropagationStopped) break;
                        await handler(evData);
                    };
                }
                // Event hooks (default behavior hooks)::
                for (const eventHook of me.eventHooks[evType]) {
                    // WARNING: eventHooks are called inconditionally!
                    // They should check if event.defaultPrevented is set by themselves.
                    // This may seem counter-intuitive and unhandy, but it will allow, for instance,
                    // to implement a fake default prevention to "change" events (which are not natively cancelable) by restoring previous value.
                    await eventHook(evData);
                };
                return ! event.defaultPrevented;
            };// }}}
        };
    };
};

