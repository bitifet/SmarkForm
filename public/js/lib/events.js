// lib/events.js
// =============

const sym_events = Symbol("Events");

export class Events {
    constructor() {
        const me = this;
        me[sym_events] = new Set();
    };
    on(evType, evHandler) {
        const me = this;
        if (! me[sym_events].has(evType)) me[sym_events].set(evType, []);
        me[sym_events].get(evType).push(evHandler.bind(me));
    };
    emit(evType, evData) {
        const me = this;
        if (! me[sym_events].has(evType)) {
            console.error(
                `${me.constructor.name} has no handler for ${evType} action`
            );
            return;
        };
        for (const handler of me[sym_events].get(evType)) {
            handler(evData);
        };
    };
};
