
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
        };
    };
};
