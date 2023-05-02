
const sym_mux = Symbol("smart_mutex");

class Mutex {
    constructor() {
        this.mtx = Promise.resolve();
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

export const mutex = function method_mutex_generator(muxName) {
    return function mutex_decorator(target, {kind}) {
        if (kind == "method") {
            return async function muxed_target(...args) {
                const me = this;
                if (! me[sym_mux]) me[sym_mux] = {};
                if (! me[sym_mux][muxName]) me[sym_mux][muxName] = new Mutex();
                const unlock = await me[sym_mux][muxName].lock(); // Await previous muxed call (if any)
                let err, retv;
                try {
                    retv = await target.call(me, ...args);
                } catch (error) {
                    err = error;
                };
                unlock();
                if (err) throw err;
                return retv;
            };

        };
    };
};
