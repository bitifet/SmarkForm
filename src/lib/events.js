// lib/events.js
// =============

const sym_local_events = Symbol("Events");
const sym_all_events = Symbol("allEvents");

function registerEvHandler(evList, evType, evHandler) {
    const me = this;
    if (! evList.has(evType)) evList.set(evType, []);
    evList.get(evType).push(evHandler.bind(me));
};

export const events = function events_decorator(target, {kind}) {
    if (kind == "class") {
        return class eventEnebledTarget extends target {
            constructor(...args) {
                super(...args);
                const me = this;
                const ImRoot = Object.is(me, me.root);
                me[sym_local_events] = new Map();
                if (ImRoot) me.root[sym_all_events] = new Map();
                me.onLocal = registerEvHandler.bind(me, me[sym_local_events]);
                me.onAll = registerEvHandler.bind(me.root, me.root[sym_all_events]);
                me.on = ( // Handy alias:
                    ImRoot ? me.onAll
                    : me.onLocal
                );
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
                    const preventDefault = () => defaultPrevented = true;
                    const stopPropagation = () => propagationStopped = true;
                    for (const handler of handlers) {
                        if (propagationStopped) break;
                        await handler({
                            ...evData,
                            preventDefault,
                            stopPropagation,
                        });
                    };
                };
                return ! defaultPrevented;
            };
        };
    };
};

