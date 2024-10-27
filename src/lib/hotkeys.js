// lib/hotkeys.js
// ==============

export class hotKeys_handler {
    constructor(form) {
        const me = this;
        me.form = form;
        me.revealed = null;
        me.form.target.addEventListener(
            "keydown"
            , me.onKeydown.bind(me)
            , true
        );
        me.form.target.addEventListener(
            "keyup"
            , me.onKeyup.bind(me)
            , true
        );
        me.form.target.addEventListener(
            "focusout"
            , me.onFocusout.bind(me)
            , true
        );
        me.form.target.addEventListener(
            "focusin"
            , me.onFocusin.bind(me)
            , true
        );
    };
    onKeydown(ev) {
        const me = this;
        if (ev.key == "Control") {
            me.reveal(ev.target); // Activate and reveal.
        } else if (ev.ctrlKey) {
            const targettedTrigger = me.revealed.find(
                t=>t.options.hotkey == ev.key
            );
            if (targettedTrigger) {
                ev.preventDefault();
                ev.stopPropagation();
                targettedTrigger.target.click();
            };
        };
    };
    onKeyup(ev) {
        const me = this;
        if (ev.key == "Control") {
            me.reveal(false); // Deactivate
        };
    };
    onFocusout(ev) {
        const me = this;
        if (me.revealed !== null) {
            me.reveal(); // Unreveal, keep activated.
        };
    };
    onFocusin(ev) {
        const me = this;
        if (me.revealed !== null) {
            me.reveal(ev.target); // Update revealed triggers
        };
    };
    reveal(target) {
        const me = this;

        // Conceal previous target triggers' hotkeys if any:
        if (me.revealed !== null) {
            for (const t of me.revealed) {
                t.target.removeAttribute("data-hotkey");
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
                if (! candidate.tg.target.disabled) {
                    candidate.tg.target.setAttribute("data-hotkey", candidate.hotkey);
                };
                // (UX): Perform the following even if disabled for behavioral
                // consistency...
                usedKeys.add(candidate.hotkey); // ...don't activate others in place.
                me.revealed.push(candidate.tg); // ...keep preventing event propagation.
            };

        };

    };
};
