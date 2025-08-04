"use strict";
export function getRoots(target, selector){//{{{
    const parent = target.parentNode;
    const isTop = (
        parent === null ? n => n === null
        : n=>(n===null)||n.isSameNode(target)
    );
    return [
        ...target.querySelectorAll(selector)
    ].filter(
        e=>isTop(e.parentNode.closest(selector))
    );
};//}}}

export function makeRoom(element, pixels) {//{{{
    let parent = element.parentNode;
    const direction = (
        pixels >= 0 ? 1
        : -1
    );
    while (parent) {
        // Check if parent has vertical scroll bar
        if (parent.scrollHeight > parent.clientHeight * direction) {
            // Get the maximum amount that can be scrolled in this parent
            var maxScroll = parent.scrollHeight - parent.clientHeight * direction;

            // If desired amount is less than maximum scroll, perform scroll
            if (pixels <= maxScroll * direction) {
                parent.scrollTop += pixels;
                return;
            } else {
              // If desired amount is greater than maximum scroll,
              // scroll to maximum and subtract it from desired amount
              parent.scrollTop = maxScroll;
              pixels -= maxScroll;
            };
        };
        parent = parent.parentNode;
    };
};//}}}

export function randomId() {//{{{
    return Math.random().toString(36).substring(2);
};//}}}

export function parseJSON(str) {//{{{
    try {
        return JSON.parse(str);
    } catch (err) {};
};//}}}

export function createArrayPuller(parentStore) {//{{{
    // Create an object that populates arrays to each accessed property
    const arrayStore = {};
    for (const prop in parentStore) {
        arrayStore[prop] = [...parentStore[prop]]; // Copy existing arrays
        // This allows to remove inherited properties individually if needed
    }
    // Dynamically create an array per each accessed property:
    Object.defineProperty(arrayStore, '_dynamic', {
      get() {
        return new Proxy(this, {
          get(target, prop) {
            if (prop in target) {
              return target[prop];
            }
            target[prop] = [];
            return target[prop];
          }
        });
      }
    });
    return arrayStore._dynamic;
};//}}}
