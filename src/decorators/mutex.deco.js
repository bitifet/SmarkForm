const sym_mux = Symbol("smart_mutex");
export const sym_mutex_key = Symbol("mutex_ongoing_key");

class Mutex {
    constructor() {
        this.mtx = Promise.resolve();
        this.ongoingKey = null;
    };
    lock() {
        // Sync operation:
        let nextResolve;
        const nextMtx = new Promise(resolve => {
            nextResolve = () => resolve();
        });
        const currMtx = this.mtx;
        this.mtx = nextMtx;
        // Async behaviour:
        return currMtx.then(function unlock() {
            return nextResolve
        });
    };
}

export const mutex = function method_mutex_decorator(muxName) {
    return function mutex_decorator(target, {kind}) {
        if (kind == "method") {
            return async function muxed_target(...args) {
                const me = this;
                if (! me[sym_mux]) me[sym_mux] = {};
                if (! me[sym_mux][muxName]) me[sym_mux][muxName] = new Mutex();
                const mtx = me[sym_mux][muxName];

                // Reentrant check: if options carry our ongoing key, skip lock
                const options = args[args.length - 1];
                if (options?.[sym_mutex_key] && mtx.ongoingKey === options[sym_mutex_key]) {
                    return await target.call(me, ...args);
                };

                const unlock = await mtx.lock();
                const key = Symbol(muxName);
                mtx.ongoingKey = key;
                if (options && typeof options === 'object') {
                    options[sym_mutex_key] ??= key;
                };

                let err, retv;
                try {
                    retv = await target.call(me, ...args);
                } catch (error) {
                    err = error;
                } finally {
                    mtx.ongoingKey = null;
                    unlock();
                };
                if (err) throw err;
                return retv;
            };

        };
    };
};
