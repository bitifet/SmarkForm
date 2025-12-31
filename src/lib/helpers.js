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

export function replaceWrongNode(targetNode, error) {// {{{
    // Create the outer <div> element
    const errorNode = document.createElement('div');
    errorNode.setAttribute('title', error.message);
    errorNode.setAttribute('style', "display: inline-block; padding: .5em 1em; background: red; color: yellow; border-radius: 50% 0%");
    // Add the text with the error code
    errorNode.appendChild(document.createTextNode(error.code));
    // Create the inner clicable button
    const clicableNode = document.createElement('span');
    clicableNode.setAttribute('title', 'Log the error again');
    clicableNode.setAttribute('style', 'cursor: pointer; font-weight: bold; background-color: white; color: red; border-radius: 50%; padding: 0 4px; margin-left: 8px;');
    clicableNode.textContent = '↧';
    clicableNode.addEventListener('click', () => {
        console.error(error);
    });
    errorNode.appendChild(clicableNode);
    // Replace the targetNode with the errorNode
    targetNode.replaceWith(errorNode);
};// }}}

export function parseTime(str) {//{{{
    // Accept "HH:mm" format (5 characters)
    if (str.length === 5 && str[2] === ":") {
        const hours = parseInt(str.substring(0, 2), 10);
        const minutes = parseInt(str.substring(3, 5), 10);
        if (
            hours >= 0 && hours <= 23
            && minutes >= 0 && minutes <= 59
        ) {
            return str + ":00"; // Add seconds
        }
    }
    
    // Accept "HH:mm:ss" format (8 characters)
    if (str.length === 8 && str[2] === ":" && str[5] === ":") {
        const hours = parseInt(str.substring(0, 2), 10);
        const minutes = parseInt(str.substring(3, 5), 10);
        const seconds = parseInt(str.substring(6, 8), 10);
        if (
            hours >= 0 && hours <= 23
            && minutes >= 0 && minutes <= 59
            && seconds >= 0 && seconds <= 59
        ) {
            return str;
        }
    }
    
    // Accept "HHmmss" format (6 characters)
    if (str.length === 6) {
        const hours = parseInt(str.substring(0, 2), 10);
        const minutes = parseInt(str.substring(2, 4), 10);
        const seconds = parseInt(str.substring(4, 6), 10);
        if (
            hours >= 0 && hours <= 23
            && minutes >= 0 && minutes <= 59
            && seconds >= 0 && seconds <= 59
        ) {
            return [
                str.substring(0, 2),
                str.substring(2, 4),
                str.substring(4, 6),
            ].join(":");
        }
    }
    
    // Accept "HHmm" format (4 characters)
    if (str.length === 4) {
        const hours = parseInt(str.substring(0, 2), 10);
        const minutes = parseInt(str.substring(2, 4), 10);
        if (
            hours >= 0 && hours <= 23
            && minutes >= 0 && minutes <= 59
        ) {
            return [
                str.substring(0, 2),
                str.substring(2, 4),
                "00"
            ].join(":");
        }
    }
    
    return null;
};//}}}

export function parseDateTime(str) {//{{{
    // Accept "YYYYMMDDTHHmmss" format
    if (str.length === 15 && str[8] === "T") {
        const date = [
            str.substring(0, 4),
            str.substring(4, 6),
            str.substring(6, 8),
        ].join("-");
        const time = [
            str.substring(9, 11),
            str.substring(11, 13),
            str.substring(13, 15),
        ].join(":");
        return new Date(`${date}T${time}`);
    }
    
    // Accept "YYYYMMDDTHHmm" format
    if (str.length === 13 && str[8] === "T") {
        const date = [
            str.substring(0, 4),
            str.substring(4, 6),
            str.substring(6, 8),
        ].join("-");
        const time = [
            str.substring(9, 11),
            str.substring(11, 13),
            "00",
        ].join(":");
        return new Date(`${date}T${time}`);
    }
    
    // Accept "YYYY-MM-DDTHH:mm:ss" format (standard datetime-local format)
    if (
        str.length === 19
        && str[4] === "-"
        && str[7] === "-"
        && str[10] === "T"
        && str[13] === ":"
        && str[16] === ":"
    ) {
        return new Date(str);
    }
    
    // Accept "YYYY-MM-DDTHH:mm" format (datetime-local without seconds)
    if (
        str.length === 16
        && str[4] === "-"
        && str[7] === "-"
        && str[10] === "T"
        && str[13] === ":"
    ) {
        return new Date(str + ":00");
    }
    
    // Accept ISO 8601 strings with timezone info (like .toISOString() output)
    // Example: "2023-12-25T14:30:45.789Z"
    const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/);
    if (isoMatch) {
        return new Date(str);
    }
    
    return NaN;
};//}}}

export function setTabIndex(target, value = "-1") {//{{{
    // Set tabindex attribute only if not explicitly defined
    if (target.getAttribute("tabindex") === null) {
        target.setAttribute("tabindex", value);
    }
};//}}}

