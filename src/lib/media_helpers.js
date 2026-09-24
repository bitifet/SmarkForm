export function findFileLikeListAncestor(component) {//{{{
    for (const ancestor of component.parents) {
        if (ancestor.options.type !== "list") continue;
        return {
            list: ancestor,
            capable: !! component.types[ancestor.tplType]?.isFileLike,
            dropEnabled: ancestor.options.fileDrop !== false,
        };
    };
    return null;
};//}}}

export async function processFileBatch(objects, pipeline, context = {}) {//{{{
    const result = [];
    for (const object of objects || []) {
        const processed = await pipeline(object, context);
        if (processed) result.push(processed);
    };
    return result;
};//}}}

export async function processFileSource(source, pipeline, context = {}) {//{{{
    const objects = await source();
    if (! objects?.length) return objects;
    return await processFileBatch(objects, pipeline, context);
};//}}}

export function createMediaNotifier(eventName) {//{{{
    let toastEl = null;
    let toastTimer = null;
    const showToast = message => {
        if (toastTimer) clearTimeout(toastTimer);
        if (toastEl?.parentNode) toastEl.remove();
        toastEl = document.createElement("div");
        toastEl.setAttribute("role", "status");
        toastEl.setAttribute("aria-live", "polite");
        Object.assign(toastEl.style, {
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "80vw",
            padding: "10px 16px",
            borderRadius: "6px",
            background: "rgba(40,40,40,.92)",
            color: "#fff",
            font: "14px/1.4 system-ui, sans-serif",
            boxShadow: "0 2px 12px rgba(0,0,0,.35)",
            zIndex: "2147483000",
            pointerEvents: "none",
        });
        toastEl.textContent = message;
        document.body.appendChild(toastEl);
        toastTimer = setTimeout(() => {
            toastEl?.remove?.();
            toastEl = null;
            toastTimer = null;
        }, 4000);
    };
    return (component, detail) => {
        const event = new CustomEvent(eventName, {
            bubbles: true,
            cancelable: true,
            detail,
        });
        if (component.targetNode.dispatchEvent(event) !== false) {
            showToast(detail.message);
        };
    };
};//}}}
