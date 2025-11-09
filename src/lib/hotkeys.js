// lib/hotkeys.js
// ==============

// const l = (label, cbk=x=>x)=>d=>(console.log(`${label}: `, cbk(d)), d);

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
            if (ev.key == "Control") return void me.reveal(false);
            if (ev.key != "Alt") return;
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

        // Determine ctrlKey and altKey status properly:
        // (Found differences between versions of the same browser)
        const ctrlKey = ev.ctrlKey || ev.key == "Control";
        const altKey = ev.altKey && ev.type != "keyup" || ev.key == "Alt" && ev.type == "keydown";
        // ev.type is "keydown" (or "keyup" in case of Alt) or "focusin"
        const activation = (
            // Pressing ctrl key with or without alt key
            ctrlKey && (ev.key == "Control" || ev.key == "Alt")
            // Reentering focus after some action without deactivation
            || ev.type == "focusin"
        );

        // (Re)activation:
        if (activation) {
            const level = altKey ? 2 : 1;
            // Activate and reveal:
            return void me.reveal(ev.target, level);
        };

        // Hotkey stroke:
        if (me.revealed instanceof Array) {
            const targettedTrigger = me.revealed.find(
                t=>t.options.hotkey == ev.key
            );
            if (targettedTrigger) {
                // Prevent default and stop propagation:
                //   Even if disabled to avoid weird behaviour with repetitions
                //   (Ex. using "+" to add items to a list would zoom in
                //   some browsers when max_items is reached).
                ev.preventDefault();
                ev.stopPropagation();
                // Perform the action:
                if (! targettedTrigger.targetNode.disabled) {
                    // Unless trigger is disabled
                    targettedTrigger.targetNode.click();
                };
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
            const activeContexts = getActiveContexts(component);
            const candidateTriggers = activeContexts
                // .map(l("activeContexts", ({name, targetNode})=>({name, targetNode})))
                .map((ctx, distance)=>{
                    const candidates = [];
                    for (const tg of ctx.getTriggers('*')) {
                        const hotkey = String(tg.options.hotkey || "");
                        if (hotkey == "") continue; // Ignore triggers without hotkey.
                        const args = tg.getTriggerArgs() || {};
                        candidates.push({
                            tg,
                            distance,   // Number of ancestors levels.
                            args,
                            hotkey,
                        });
                    };
                    return candidates;
                })
                // .map(l("Triggers", tlist=>tlist.map(({hotkey, distance, tg, args})=>({hotkey, distance, tg, args}))))
                .flat()
                .sort((ta,tb)=>{
                    const atargetnode = ta.args.target?.targetNode;
                    const btargetnode = tb.args.target?.targetNode;
                    const bcontained = btargetnode ? .5 * btargetnode.contains(component.targetNode) : 0;
                    const acontained = atargetnode ? .5 * atargetnode.contains(component.targetNode) : 0;
                    const retv = (
                        // Prefer triggers with nearest context:
                        + ta.distance - tb.distance
                        // Prefer triggers contained in ancestors (not siblings):
                        + bcontained - acontained
                    );
                    // if (true || ta.hotkey == "-" && tb.hotkey == "-") {
                    //     console.log(`--(${ta.hotkey} - ${tb.hotkey})------------------------------------------------`);
                    //     console.log("--", ta.tg.targetNode, tb.tg.targetNode, component.targetNode);
                    //     console.log("--", ta.distance, tb.distance, - tb.distance + ta.distance);
                    //     console.log("--", + acontained, + bcontained, + bcontained - acontained);
                    //     console.log(`===========> ${retv}`);
                    // };
                    return retv;
                })
            ;

            const seen = new Map(); // hotkey => [times seen, distance from target]
            me.revealed = [];

            for (const candidate of candidateTriggers) {
                const [times, distance] = seen.get(candidate.hotkey) || [1, 0];
                if (times < level) {
                    seen.set(candidate.hotkey, [times + 1, candidate.distance]);
                    continue; // Level not reached.
                };
                if (times > level) {
                    continue; // Used by more preferent tg.
                };
                if (
                    Object.is(candidate.tg.targetNode, target)
                    || candidate.distance > distance
                ) { // Don't pick more than one per "ancestory" level.
                    if (! candidate.tg.targetNode.disabled) {
                        candidate.tg.targetNode.setAttribute("data-hotkey", candidate.hotkey);
                    };
                    me.revealed.push(candidate.tg); // Let stroke detection know it matched.
                    // Avoid activating the following candidates by "oveflowing" their times seen count:
                    // (UX): Do it even if disabled for behavioral consistency...
                    seen.set(candidate.hotkey, [times + 1, candidate.distance]);
                };
            };

        };

    };
};

function getComponentSiblings(context) {
    const children = context.parent?.children || [];
    const position = Object.keys(children).findIndex((name)=>(name === context.name));
    const brothers = Object.values(children);
    const backwards = brothers.slice(0, position).reverse();
    const forwards = brothers.slice(position + 1);
    return [...forwards, ...backwards];
};

function getActiveContexts(component) {
    const upwards = [component, ...component.parents];
    return [
        ...upwards,
        ...upwards.map(getComponentSiblings).flat()
    ];
};

