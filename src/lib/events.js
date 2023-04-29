// lib/events.js
// =============

const sym_events = Symbol("Events");

export class Events {
    constructor() {
        const me = this;
        me[sym_events] = new Map();
    };
    on(evType, evHandler) {
        const me = this;
        if (! me[sym_events].has(evType)) me[sym_events].set(evType, []);
        me[sym_events].get(evType).push(evHandler.bind(me));
    };
    async emit(evType, evData) {
        const me = this;
        if (me[sym_events].has(evType)) {
            function preventDefault(reason) {
                throw new Error(`Default prevented${reason ? ": "+reason : ""}.`);
            };
            me[sym_events].get(evType).forEach(
                handler => handler({
                    ...evData,
                    preventDefault,
                })
            )
        };
        // Resolve (undefined) no matter which errors could have happened in
        // event handlers UNLESS preventDefault() were called.
        return;
    };
};
