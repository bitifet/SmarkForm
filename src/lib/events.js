// lib/events.js
// =============

const sym_local_events = Symbol("Events");
const sym_on_events = Symbol("onEvents");
const sym_all_events = Symbol("allEvents");
const re_actionEvHandler = /^on(?:Before|After)Action_/;
const re_localEvHandler = /^onLocal_/;
const re_onEvHandler = /^on_/;
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

// Per-event metadata.
//
// `bubbles` controls whether `.on()` propagates the event up the SmarkForm
// component tree.  It intentionally mirrors native DOM bubbling for same-named
// events so that `.on()` behaves like a DOM addEventListener with the default
// (bubble) phase: events that don't bubble in the DOM (focus, blur,
// mouseenter, mouseleave) also don't bubble in SmarkForm under `.on()`.
//
// `.onAll()` always bubbles regardless of this flag.
// `.onLocal()` never bubbles regardless of this flag.
//
// Events marked `synthetic: true` are pure SmarkForm-level events; no DOM
// listener is attached for them.
//
// Events NOT listed here (e.g. action lifecycle events such as
// AfterAction_export) default to { bubbles: true } so that existing behaviour
// is preserved.
const supportedFieldEventTypes = {
    // Keyboard
    keydown:      { bubbles: true },
    keyup:        { bubbles: true },
    keypress:     { bubbles: true },
    // Input
    beforeinput:  { bubbles: true },
    input:        { bubbles: true },
    change:       { bubbles: true },
    // Focus — do NOT bubble under .on() (matches DOM)
    focus:        { bubbles: false },
    blur:         { bubbles: false },
    focusin:      { bubbles: true },
    focusout:     { bubbles: true },
    // Mouse
    click:        { bubbles: true },
    dblclick:     { bubbles: true },
    contextmenu:  { bubbles: true },
    mousedown:    { bubbles: true },
    mouseup:      { bubbles: true },
    mousemove:    { bubbles: true },
    mouseenter:   { bubbles: false }, // does not bubble in DOM
    mouseleave:   { bubbles: false }, // does not bubble in DOM
    mouseover:    { bubbles: true },
    mouseout:     { bubbles: true },
    // Synthetic SmarkForm-level focus-boundary events (no DOM listener).
    // Emitted by the root's focusin/focusout capture handler using an LCA
    // algorithm to track focus transitions across component boundaries.
    focusenter:   { bubbles: true, synthetic: true },
    focusleave:   { bubbles: true, synthetic: true },

    // Uncomment to enable additional DOM event types:
    // select:    { bubbles: true },
    // dragstart: { bubbles: true }, dragend: { bubbles: true },
    // dragover:  { bubbles: true }, dragenter: { bubbles: true },
    // dragleave: { bubbles: true }, drop:      { bubbles: true },
    // touchstart:{ bubbles: true }, touchend:  { bubbles: true },
    // touchmove: { bubbles: true }, touchcancel:{ bubbles: true },
    // wheel:     { bubbles: true }, scroll:    { bubbles: true },
    // copy:      { bubbles: true }, cut:       { bubbles: true },
    // paste:     { bubbles: true },
};

function registerEvHandler(evList, evType, evHandler) {
    const me = this;
    if (! evList.has(evType)) evList.set(evType, []);
    evList.get(evType).push(evHandler.bind(me));
    return me; // Make chainable.
};

// Find the lowest common ancestor (LCA) of two ancestor-path arrays.
// Returns the first element of `pathA` that also appears in `pathB`,
// or null if no common ancestor exists (focus to/from outside the root).
function findLCA(pathA, pathB) {
    const setB = new Set(pathB);
    return pathA.find(c => setB.has(c)) ?? null;
};

// Emit focusleave / focusenter events for a focus transition from
// `oldComp` to `newComp` (either may be null when focus crosses the
// SmarkForm root boundary).
//
// Algorithm:
//   1. Compute ancestor paths for both components.
//   2. Find their LCA.
//   3. Emit focusleave on each component in oldPath up to (excluding) LCA,
//      innermost first.
//   4. Emit focusenter on each component in newPath up to (excluding) LCA,
//      innermost first (so the deepest field gets focusenter before containers
//      do, matching the bubbling direction used by .onAll() listeners).
async function emitFocusBoundaryEvents(oldComp, newComp) {
    const oldPath = oldComp ? ([oldComp, ...oldComp.parents]) : [];
    const newPath = newComp ? ([newComp, ...newComp.parents]) : [];
    const lca = findLCA(oldPath, newPath);

    for (const comp of oldPath) {
        if (comp === lca) break;
        await comp.emit('focusleave', { type: 'focusleave', context: comp });
    }
    for (const comp of newPath) {
        if (comp === lca) break;
        await comp.emit('focusenter', { type: 'focusenter', context: comp });
    }
};


export const events = function events_decorator(targetComponentType, {kind}) {
    if (kind == "class") {
        return class eventEnabledTarget extends targetComponentType {
            constructor(target, optionsSrc, ...args) {// {{{

                // Capture before/after action event handlers through
                // onBeforeAction_xxx / onAfterAction_xxx options
                // ...and onLocal_xxx / on_xxx / onAll_xxx regular event handlers.
                const options = {};
                const onOptionCallbacks = [];
                for (
                    const [key, value]
                    of Object.entries(optionsSrc)
                ) if (re_actionEvHandler.test(key)) {
                    onOptionCallbacks.push([key.substring(2), value, "onLocal"])
                } else if (re_localEvHandler.test(key)) {
                    onOptionCallbacks.push([key.substring(8), value, "onLocal"])
                } else if (re_onEvHandler.test(key)) {
                    onOptionCallbacks.push([key.substring(3), value, "on"])
                } else if (re_allEvHandler.test(key)) {
                    onOptionCallbacks.push([key.substring(6), value, "onAll"])
                } else {
                    // Treat the rest as regular options:
                    options[key] = value;
                };

                // Call original constructor:
                super(target, options, ...args);

                // Events enhancing:
                const me = this;
                me[sym_local_events] = new Map();
                me[sym_on_events] = new Map();
                me[sym_all_events] = new Map();
                me.onLocal = registerEvHandler.bind(me, me[sym_local_events]);
                // .on() uses DOM-like bubbling: the event's `bubbles` metadata
                // determines whether it propagates to ancestor components.
                me.on = registerEvHandler.bind(me, me[sym_on_events]);
                // .onAll() always bubbles, regardless of event metadata.
                me.onAll = registerEvHandler.bind(me, me[sym_all_events]);

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

                    // Handle the Space key on data inputs/textareas/selects
                    // inside a <summary> element.
                    //
                    // How the browser toggle is triggered: when Space is pressed
                    // while focus is on an element within <summary>, browsers
                    // fire a synthetic click on the <summary> after keyup
                    // (keyboard activation behavior).  The click causes the
                    // <details> to toggle.
                    //
                    // Two cases handled here:
                    //
                    //   Shift+Space — toggle the <details> open/closed without
                    //   typing a space into the field.  Shift+Space has no
                    //   OS-level or browser-level meaning (unlike Alt+Space,
                    //   which is captured by Brave and other browsers before the
                    //   page can see it).  We call ev.preventDefault() to stop
                    //   the character from being inserted and manually flip the
                    //   details.open flag ourselves.
                    //
                    //   Plain Space — type a space character normally without
                    //   toggling the <details>.  A one-shot capture-phase click
                    //   listener on the <summary> suppresses the synthetic click
                    //   that browsers fire after Space keyup.  A keyup listener
                    //   cleans it up via setTimeout(0) if no click arrives.
                    me.targetNode.addEventListener('keydown', ev => {
                        if (ev.key !== ' ') return;
                        const tag = (ev.target?.tagName ?? '').toUpperCase();
                        const type = (ev.target?.type ?? '').toLowerCase();
                        if (!(
                            (
                                tag === 'INPUT'
                                && type !== 'checkbox'
                                && type !== 'radio'
                                && type !== 'submit'
                                && type !== 'button'
                                && type !== 'image'
                                && type !== 'reset'
                            )
                            || tag === 'TEXTAREA'
                            || tag === 'SELECT'
                        )) return;
                        const summary = ev.target?.closest?.('summary');
                        if (!summary) return;
                        if (ev.shiftKey && !ev.altKey && !ev.ctrlKey && !ev.metaKey) {
                            // Shift+Space: toggle the <details> open/closed and
                            // prevent the space character from being typed.
                            ev.preventDefault();
                            const details = summary.closest('details');
                            if (details) details.open = !details.open;
                            return;
                        }
                        if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
                        // Plain Space: prevent the <details> toggle but allow
                        // the space character to be typed normally.
                        // One-shot suppressor for the synthetic click that the
                        // browser fires on <summary> after Space keyup.
                        const suppressor = e => {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                        };
                        summary.addEventListener('click', suppressor, { capture: true, once: true });
                        // Cleanup: if the browser doesn't fire a click (e.g.
                        // the input is not inside a real <summary>), remove
                        // the suppressor after the keyup completes.
                        ev.target.addEventListener('keyup', () => {
                            setTimeout(() => {
                                summary.removeEventListener('click', suppressor, true);
                            }, 0);
                        }, { once: true });
                    }, true); // synchronous, capture phase

                    for (const [evType, meta] of Object.entries(supportedFieldEventTypes)) {
                        if (meta.synthetic) continue;
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

                    // focusenter / focusleave synthetic boundary events.
                    //
                    // Track the last focused SmarkForm component.  On every
                    // focusin compute the LCA of old and new components and emit
                    // focusleave / focusenter for the components that crossed a
                    // container boundary.  This is done without relying on
                    // relatedTarget (omitted by some browsers) and correctly
                    // handles focus travelling to/from outside the root.
                    //
                    // IMPORTANT: In Chrome (and many browsers), Promise microtasks
                    // run BETWEEN the focusout and focusin events that occur during
                    // a focus transition within the root.  Using Promise.resolve()
                    // in the focusout handler would therefore incorrectly conclude
                    // that focus left the root before the focusin fires.  We use
                    // setTimeout(fn, 0) instead, which runs after the current task
                    // (including the pending focusin), and cancel it in the focusin
                    // handler when focus stays within the root.
                    let lastFocusedComponent = null;
                    let pendingFocusLeaveTimer = null;

                    me.targetNode.addEventListener('focusin', ev => {
                        // Cancel any pending "focus left root" timer — focus is
                        // moving to another element inside the root.
                        if (pendingFocusLeaveTimer !== null) {
                            clearTimeout(pendingFocusLeaveTimer);
                            pendingFocusLeaveTimer = null;
                        }
                        const newComp = me.getComponent(ev.target);
                        void emitFocusBoundaryEvents(lastFocusedComponent, newComp);
                        lastFocusedComponent = newComp;
                    }, true);

                    me.targetNode.addEventListener('focusout', ev => {
                        // Defer: if focusin fires first (focus moved within root)
                        // the timer is cancelled above.  If the timer fires,
                        // focus truly left the root.
                        const leavingComp = lastFocusedComponent;
                        pendingFocusLeaveTimer = setTimeout(() => {
                            pendingFocusLeaveTimer = null;
                            if (lastFocusedComponent === leavingComp) {
                                // Focus went outside the root.
                                void emitFocusBoundaryEvents(leavingComp, null);
                                lastFocusedComponent = null;
                            }
                        }, 0);
                    }, true);
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
                    const realPreventDefault = event.preventDefault;
                    event.preventDefault = () => {
                        event.defaultPrevented = true;
                        if (typeof realPreventDefault === 'function') realPreventDefault();
                    };
                    event.stopPropagation = () => propagationStopped = true;
                    event.stopImmediatePropagation = () => immediatePropagationStopped = true;
                };

                // Look up whether this event type bubbles for .on() handlers.
                // Events not listed in supportedFieldEventTypes (e.g. action
                // lifecycle events such as AfterAction_export) default to
                // bubbles:true to preserve existing behaviour.
                const eventBubbles = (supportedFieldEventTypes[evType]?.bubbles) ?? true;

                // Event target phase — local, then on, then onAll handlers:
                const targetHandlers = [
                    ...(me[sym_local_events].get(evType) || []),
                    ...(me[sym_on_events].get(evType) || []),
                    ...(me[sym_all_events].get(evType) || []),
                ];
                for (const handler of targetHandlers) {
                    if (immediatePropagationStopped) break;
                    await handler(event);
                };
                // Events bubbling phase:
                //   .on() handlers only run here if the event bubbles.
                //   .onAll() handlers always run.
                for (const parent of me.parents) {
                    if (propagationStopped) break;
                    const parentHandlers = [
                        ...(eventBubbles ? (parent[sym_on_events].get(evType) || []) : []),
                        ...(parent[sym_all_events].get(evType) || []),
                    ];
                    for (const handler of parentHandlers) {
                        if (immediatePropagationStopped) break;
                        await handler(event);
                    };
                }
                // Event hooks (default behavior hooks):
                for (const eventHook of me.eventHooks[evType]) {
                    // WARNING: eventHooks are called inconditionally!
                    // They should check if event.defaultPrevented is set by themselves.
                    // This may seem counter-intuitive and unhandy, but it will allow, for instance,
                    // to implement a fake default prevention to "change" events (which are not natively cancelable) by restoring previous value.
                    await eventHook(event);
                };
                // Sync handler-modified data back to evData so action decorators
                // that do `data = options.data` after emit() pick up handler changes
                // (e.g. BeforeAction_import handlers that modify ev.data).
                if (evData && Object.prototype.hasOwnProperty.call(evData, 'data')) {
                    evData.data = event.data;
                };
                return ! event.defaultPrevented;
            };// }}}
        };
    };
};

