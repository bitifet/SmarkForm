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

