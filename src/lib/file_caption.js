// Shared singleton caption and rename behavior for file-like media fields.

export function getCaption(me) {//{{{
    if (! me.isSingleton) return null;
    const marked = Array.from(me.targetNode.querySelectorAll("[data-smark]"))
        .find(node => me.getComponent(node)?.options?.action === "rename");
    const caption = marked || me.targetNode.querySelector("figcaption[contenteditable]");
    if (caption) caption.contentEditable = "true";
    return caption || null;
};//}}}

export function captionText(me) {//{{{
    const caption = getCaption(me);
    return caption ? String(caption.textContent || "").trim() : "";
};//}}}

export function syncCaption(me, value) {//{{{
    const caption = getCaption(me);
    if (! caption) return;
    const name = String(value?.name ?? "");
    if (caption.textContent !== name) caption.textContent = name;
};//}}}

export function bindCaption(me) {//{{{
    const caption = getCaption(me);
    if (caption) {
        caption.addEventListener("input", () => {
            const inner = me.children[""];
            if (inner?._file) inner._file.name = caption.textContent.trim();
        });
    };
    me.targetNode.addEventListener("change", () => {
        syncCaption(me, me.children[""]?._file || null);
    });
    syncCaption(me, me.children[""]?._file || null);
};//}}}

export async function rename(me, _data, options = {}) {//{{{
    const node = options.origin?.targetNode || getCaption(me);
    if (! node) return await me.export(null, {silent: true});
    node.contentEditable = "true";
    syncCaption(me, me.children[""]?._file || me._file || null);
    node.focus();
    return await me.export(null, {silent: true});
};//}}}
