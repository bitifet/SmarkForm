// types/list.decorators/sortable.deco.js
// ======================================

import {mutex} from "../../decorators/mutex.deco.js";

export const sortable = function list_sortable_decorator(target, {kind}) {
    if (kind == "class") {
        return class sortableTarget extends target {
            render(...args) {//{{{
                const retv = super.render(...args);
                const me = this;

                me.sortable = !! me.options.sortable;
                me.itemTpl.setAttribute("draggable", me.sortable);
                me.children.forEach(c=>c.target.setAttribute("dragable", me.sortable));
                if (me.sortable) {
                    let dragSource = null;
                    let dragDest = null;
                    me.target.addEventListener("dragstart", e => {
                        if (dragSource === null) {
                            dragSource = e.target
                        } else {
                            // Single dragging at a time.
                            e.preventDefault();
                        };
                    });
                    me.target.addEventListener("dragover", e => e.preventDefault());
                    me.target.addEventListener("drop", e => {
                        let target = e.target;
                        while (
                            target.parentElement
                            && target.parentElement != dragSource.parentElement
                        ) target = target.parentElement;
                        dragDest = target;
                    });
                    me.target.addEventListener("dragend", async () => {
                        if (dragDest)  await me.move(
                            me.getComponent(dragSource)
                            , me.getComponent(dragDest)
                        );
                        dragSource = null;
                        dragDest = null;
                    });
                };

                return retv;
            };//}}}
            @mutex("list_mutating")
            async move(from, to) {//{{{
                const me = this;
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
                to.target[moveMethod](from.target);
            };//}}}
        };
    };
};
