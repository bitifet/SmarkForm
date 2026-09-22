import {setMediaLoading} from "../lib/helpers.js";

// Adds reference-counted loading state to media fields. Each asynchronous phase
// owns one lease, so render-time URL work and element decoding cannot hide one
// another's spinner prematurely.
export const media_spinner = targetClass => class mediaSpinner extends targetClass {
    spin(active) {//{{{
        const me = this;
        me._spinCount = Math.max(0, (me._spinCount || 0) + (active ? 1 : -1));
        if (me.targetNode) setMediaLoading(me.targetNode, me._spinCount > 0);
        if (! me._spinCount) me._onMediaSpinEnd?.();
    };//}}}
};
