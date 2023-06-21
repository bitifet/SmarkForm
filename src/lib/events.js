// lib/events.js
// =============

const sym_local_events = Symbol("Events");
const sym_all_events = Symbol("allEvents");
const re_actionEvHandler = /^on(?:Before|After)Action_/;
const re_localEvHandler = /^onLocal_/;
const re_allEvHandler = /^onAll_/;

function registerEvHandler(evList, evType, evHandler) {
    const me = this;
    if (! evList.has(evType)) evList.set(evType, []);
    evList.get(evType).push(evHandler.bind(me));
    return me; // Make chainable.
};

export const events = function events_decorator(target, {kind}) {
    if (kind == "class") {
        return class eventEnebledTarget extends target {
            constructor(target, optionsSrc, ...args) {

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
                const ImRoot = Object.is(me, me.root);
                me[sym_local_events] = new Map();
                if (ImRoot) me.root[sym_all_events] = new Map();
                me.onLocal = registerEvHandler.bind(me, me[sym_local_events]);
                me.onAll = registerEvHandler.bind(me.root, me.root[sym_all_events]);
                me.on = me.onLocal; // Handy and readable alias for local events.

                // Setup action handlers provided through options:
                for (
                    const [evt, handler, listenLevel]
                    of onOptionCallbacks
                ) me[listenLevel](evt, handler);

            };
            async emit(evType, evData) {
                const me = this;
                const handlers = [ // Local handlers, then global ones:
                    ...(me[sym_local_events].get(evType) || []),
                    ...(me.root[sym_all_events].get(evType) || []),
                ];
                let defaultPrevented = false;
                if (handlers.length) {
                    let propagationStopped = false;
                    evData.preventDefault = () => defaultPrevented = true;
                    evData.stopPropagation = () => propagationStopped = true;
                    for (const handler of handlers) {
                        if (propagationStopped) break;
                        await handler(evData);
                    };
                };
                return ! defaultPrevented;
            };
        };
    };
};

