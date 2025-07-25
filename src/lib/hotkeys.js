// lib/hotkeys.js
// ==============

export class hotKeys_handler {
    constructor(form) {
        const me = this;
        me.form = form;
        me.revealed = null;
        const onStatusChange = hotKeys_handler.onStatusChange.bind(me);
        me.form.targetNode.addEventListener("keydown", onStatusChange, true);
        me.form.targetNode.addEventListener("keyup", onStatusChange, true);
        me.form.targetNode.addEventListener("focusout", onStatusChange, true);
        me.form.targetNode.addEventListener("focusin", onStatusChange, true);
    };
    static onStatusChange(ev) {
        const me = this;

        // Deactivation:
        if (ev.type == "keyup") {
            if (ev.key == "Control") me.reveal(false);
            return;
        };

        // Focus leave:
        if (ev.type == "focusout") {
            if (me.revealed !== null) {
                me.reveal(); // Unreveal, but keep activated.
            };
            return;
        };

        // Focus enter:
        if (ev.type == "focusin" && me.revealed === null) {
            return; // No hotkeys revealed.
            // Otherwise behave as new activation
        };

        // ev.type is "keydown" or "focusin"
        const ctrlKey = ev.ctrlKey || ev.key == "Control";
        const altKey = ev.altKey || ev.key == "Alt";
        const activation = (
            // Pressing ctrl key with or without alt key
            ctrlKey && (ev.key == "Control" || ev.key == "Alt")
            // Reentering focus after some action without deactivation
            || ev.type == "focusin"
        );

        // (Re)activation:
        if (activation) {
            const level = altKey ? 2 : 1;
            me.reveal(ev.target, level); // Activate and reveal.
        } else if (me.revealed instanceof Array) {
            const targettedTrigger = me.revealed.find(
                t=>t.options.hotkey == ev.key
            );
            if (targettedTrigger) {
                ev.preventDefault();
                ev.stopPropagation();
                targettedTrigger.targetNode.click();
            };
        };
    };
    reveal(target, level = 1) {
        const me = this;

        // Conceal previous target triggers' hotkeys if any:
        if (me.revealed !== null) {
            for (const t of me.revealed) {
                t.targetNode.removeAttribute("data-hotkey");
            };
            me.revealed.length = 0;
        };

        if (target === false) {
            me.revealed = null; // Deactivate hot keys
        };

        if (target) {

            // Reveal new target triggers' hotkeys:
            const component = me.form.getComponent(target);
            const activeContexts = [component, ...component.parents];
            const activeContextsSet = new Set(activeContexts);

            const candidateTriggers = activeContexts
                .map((c, lv)=>(
                    c.getTriggers('*')    // All triggers.
                    .map(tg=>({
                        tg,
                        lv,   // Ancestor level.
                        args: tg.getTriggerArgs() || {},
                        hotkey: String(tg.options.hotkey || ""),
                    }))
                ))
                .flat()
                .filter(({args, hotkey})=>(
                    hotkey.length
                    && activeContextsSet.has(args.context)
                ))
                .sort((ta,tb)=>(
                    activeContextsSet.has(tb.args.target)
                    - activeContextsSet.has(ta.args.target)
                    - tb.lv
                    + ta.lv
                ))
            ;

            const usedKeys = new Set();
            me.revealed = [];

            for (const candidate of candidateTriggers) {
                if (usedKeys.has(candidate.hotkey)) continue; // Used by more preferent tg.
                if (! candidate.tg.targetNode.disabled) {
                    candidate.tg.targetNode.setAttribute("data-hotkey", candidate.hotkey);
                };
                // (UX): Perform the following even if disabled for behavioral
                // consistency...
                usedKeys.add(candidate.hotkey); // ...don't activate others in place.
                me.revealed.push(candidate.tg); // ...keep preventing event propagation.
            };

        };

    };
};
