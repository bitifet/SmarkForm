// Reference-counted media loading decorator. Each async phase owns a spin
// lease, and the visual overlay remains until the final lease is released.
export const media_spinner = targetClass => class mediaSpinner extends targetClass {
    _showMediaSpinner() {//{{{
        const me = this;
        const node = me.targetNode;
        const parent = node?.parentElement;
        if (! node || ! parent) return;
        const state = me._mediaSpinnerState ||= {
            nodeVisibility: node.style.visibility,
            parentPosition: parent.style.position,
        };
        if (! state.overlay) {
            if (getComputedStyle(parent).position === "static") {
                parent.style.position = "relative";
            };
            const overlay = document.createElement("span");
            overlay.setAttribute("aria-hidden", "true");
            Object.assign(overlay.style, {
                position: "absolute",
                display: "block",
                pointerEvents: "none",
                zIndex: "1",
                backgroundColor: "rgba(31, 41, 55, .78)",
                backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">'
                    + '<circle cx="20" cy="20" r="14" fill="none" stroke="white"'
                    + ' stroke-width="4" stroke-linecap="round" stroke-dasharray="22 66">'
                    + '<animateTransform attributeName="transform" type="rotate"'
                    + ' from="0 20 20" to="360 20 20" dur=".8s" repeatCount="indefinite"/>'
                    + '</circle></svg>'
                )}")`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "2.5rem 2.5rem",
            });
            state.overlay = overlay;
            parent.appendChild(overlay);
        };
        state.overlay.style.left = `${node.offsetLeft}px`;
        state.overlay.style.top = `${node.offsetTop}px`;
        state.overlay.style.width = `${node.offsetWidth}px`;
        state.overlay.style.height = `${node.offsetHeight}px`;
        node.style.visibility = "hidden";
    };//}}}
    _hideMediaSpinner() {//{{{
        const state = this._mediaSpinnerState;
        if (! state) return;
        state.overlay?.remove();
        this.targetNode.style.visibility = state.nodeVisibility;
        if (state.parentPosition) this.targetNode.parentElement.style.position = state.parentPosition;
        else this.targetNode.parentElement.style.removeProperty("position");
        this._mediaSpinnerState = null;
    };//}}}
    spin(active) {//{{{
        const me = this;
        me._spinCount = Math.max(0, (me._spinCount || 0) + (active ? 1 : -1));
        if (me._spinCount === 1) me._showMediaSpinner();
        if (! me._spinCount) {
            me._hideMediaSpinner();
            me._onMediaSpinEnd?.();
        };
    };//}}}
    watchMediaLoading(node, events, onFinish) {//{{{
        const me = this;
        me._mediaLoadFinish?.();
        me.spin(true);
        let finished = false;
        const timer = setTimeout(finish, 10000);
        function finish() {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            for (const event of events) node.removeEventListener(event, finish);
            me._mediaLoadFinish = null;
            onFinish?.();
            me.spin(false);
        };
        for (const event of events) node.addEventListener(event, finish);
        me._mediaLoadFinish = finish;
        return finish;
    };//}}}
};
