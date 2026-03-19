// lib/events.js
// =============

const sym_local_events = Symbol("Events");
const sym_all_events = Symbol("allEvents");
const re_actionEvHandler = /^on(?:Before|After)Action_/;
const re_localEvHandler = /^onLocal_/;
const re_allEvHandler = /^onAll_/;

// WORKAROUND: Detect native IME-driven focus advances (Chromium mobile IME_ACTION_NEXT) and
// mark synthetic keydown events so page handlers can short-circuit duplicate navigation.
// See: PR #112 and squashed commit: https://github.com/bitifet/SmarkForm/commit/5c67cc9993e186060c4e9c33244dc613c9b51294
// Upstream bug: https://issues.chromium.org/issues/492805133
// How recently a field must have gained focus (in milliseconds) for an
// Enter keydown on that field to be treated as a Chromium IME_ACTION_NEXT
// advance rather than a deliberate user keypress.
//
// Native IME focus+keydown gap:  < 0.01 ms  (same C++ call stack)
// Minimum human interaction gap: > 100 ms   (focus, then press Enter)
//
// 20 ms sits safely between these two extremes.
const IME_FOCUS_AGE_MS = 20;

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
                ) if (re_actionEvHandler.test(key)) {
                    onOptionCallbacks.push([key.substring(2), value, "onLocal"])
                } else if (re_localEvHandler.test(key)) {
                    onOptionCallbacks.push([key.substring(8), value, "onLocal"])
                } else if (re_allEvHandler.test(key)) {
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
                    // Detect Chromium IME_ACTION_NEXT double-advance.
                    //
                    // On Chromium-based mobile browsers (e.g. Brave/Android),
                    // pressing the IME "Next" action key causes two things:
                    //   1. Focus advances natively to the next input field
                    //      (FocusNextElement — JS has no chance to intercept).
                    //   2. A synthetic KeyEvent(ENTER) is dispatched on the
                    //      newly-focused element.
                    //
                    // Both happen in the same C++ call stack, so `focus(N)`
                    // and `keydown(Enter, N)` are < 0.01 ms apart — far
                    // below IME_FOCUS_AGE_MS (defined at module top, 20 ms).
                    // Normal user interaction always exceeds 100 ms.
                    //
                    // Strategy: stamp each focusable field with
                    // `_sfLastFocusTime` when it gains focus.  When
                    // `keydown(Enter)` fires, if the focus age is below
                    // IME_FOCUS_AGE_MS the IME caused the focus — stamp
                    // `ev._sfImeAdvanced` so the async keydown hook skips
                    // its own navigation (the IME already moved focus).
                    //
                    // Enter on buttons/submit inputs is intentionally NOT
                    // suppressed so that Tab → Enter on a submit button still
                    // fires a click (and therefore the submit action).
                    me.targetNode.addEventListener('focus', (ev) => {
                        ev.target._sfLastFocusTime = performance.now();
                    }, true);
                    me.targetNode.addEventListener('keydown', (ev) => {
                        if (ev.key !== 'Enter') return;
                        const tag = (ev.target?.tagName ?? '').toUpperCase();
                        const type = (ev.target?.type ?? '').toLowerCase();
                        if (
                            tag === 'SELECT'
                            || (
                                tag === 'INPUT'
                                && type !== 'submit'
                                && type !== 'image'
                                && type !== 'button'
                                && type !== 'reset'
                            )
                            || (tag === 'TEXTAREA' && (ev.ctrlKey || ev.shiftKey))
                        ) {
                            ev.preventDefault();
                            // If the field gained focus very recently (within
                            // IME_FOCUS_AGE_MS), the IME moved focus here
                            // right before dispatching this synthetic keydown.
                            // Mark the event so the async hook does not
                            // navigate a second time.
                            // An unset _sfLastFocusTime means the field was
                            // never focused via our listener — treat age as
                            // Infinity so it is never treated as an IME advance.
                            const focusAge = ev.target._sfLastFocusTime !== undefined
                                ? performance.now() - ev.target._sfLastFocusTime
                                : Infinity;
                            if (focusAge < IME_FOCUS_AGE_MS) ev._sfImeAdvanced = true;
                        }
                    }, true); // synchronous, capture phase
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
                            // Intentional fire-and-forget: DOM event listeners
                            // must return synchronously; the async emit is
                            // dispatched and its promise is intentionally not awaited here.
                            void targetComponent.emit(evType, evData);
                        }, true); // Use capture phase
                    };
                };

                // Setup action handlers provided through options:
                for (
                    const [evt, handler, listenLevel]
                    of onOptionCallbacks
                ) me[listenLevel](evt, handler);

            };// }}}
            async emit(evType, evData, preventable = true) {// {{{
                const me = this;
                let propagationStopped = false;
                let immediatePropagationStopped = false;
                const event = {
                    ...evData,
                    type: evType,
                    defaultPrevented: false,
                };
                if (preventable) {
                    event.preventDefault = () => event.defaultPrevented = true;
                    event.stopPropagation = () => propagationStopped = true;
                    event.stopImmediatePropagation = () => immediatePropagationStopped = true;
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

