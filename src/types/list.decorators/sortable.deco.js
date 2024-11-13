// types/list.decorators/sortable.deco.js
// ======================================

import {mutex} from "../../decorators/mutex.deco.js";

export const sortable = function list_sortable_decorator(target, {kind}) {
    if (kind == "class") {
        return class sortableTarget extends target {
            async render(...args) {//{{{
                const retv = await super.render(...args);
                const me = this;

                me.sortable = !! me.options.sortable;
                me.templates.item.setAttribute("draggable", me.sortable);
                me.children.forEach(c=>c.targetNode.setAttribute("dragable", me.sortable));
                if (me.sortable) {
                    let dragSource = null;
                    let dragDest = null;
                    me.targetNode.addEventListener("dragstart", e => {
                        if (dragSource === null) {
                            dragSource = e.target
                            e.stopPropagation();
                        } else {
                            // Single dragging at a time.
                            e.preventDefault();
                        };
                    });
                    me.targetNode.addEventListener("dragover", e => e.preventDefault());
                    me.targetNode.addEventListener("drop", e => {
                        if (! dragSource) return; // Already dropped
                        let target = e.target;
                        while (
                            target.parentElement
                            && target.parentElement != dragSource.parentElement
                        ) target = target.parentElement;
                        dragDest = target;
                    });
                    me.targetNode.addEventListener("dragend", async () => {
                        if (dragDest)  await me.move({
                            from: me.getComponent(dragSource),
                            to: me.getComponent(dragDest),
                        });
                        dragSource = null;
                        dragDest = null;
                    });
                };

                return retv;
            };//}}}
            @mutex("list_mutating")
            async move(options = {}) {//{{{
                const me = this;
                let {
                    from,
                    to,
                } = options;

                // // FIXME: Avoid nested sortables to interact.
                // console.log({from, to}); // <--- See this!!!

                //
                // TODO: Convert to action!!!
                //
                if (
                    to === null // Dropped outside
                    || from === null // (Shouldn't happen)
                ) return;
                const fromi = Number(from?.name);
                const toi = Number(to?.name);
                if (fromi == toi) {
                    return;
                } else if (fromi < toi) {
                    const newChunk = [
                        ...me.children.slice(fromi + 1, toi + 1),
                        me.children[fromi],
                    ].map((c, i)=>{
                        c.name = i+fromi;
                        c.updateId();
                        return c;
                    });
                    me.children.splice(fromi, toi - fromi + 1, ...newChunk);
                } else if (fromi > toi) {
                    const newChunk = [
                        me.children[fromi],
                        ...me.children.slice(toi, fromi),
                    ].map((c, i)=>{
                        c.name = i+toi;
                        c.updateId();
                        return c;
                    });
                    me.children.splice(toi, fromi - toi + 1, ...newChunk);
                };
                const inc = fromi < toi ? 1 : -1;
                const moveMethod = inc > 0 ? "after" : "before";
                to.targetNode[moveMethod](from.targetNode);
            };//}}}
        };
    };
};
