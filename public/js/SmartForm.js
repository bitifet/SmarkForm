
const sym_options = Symbol("Options");
const re_valid_typename_chars = /^[a-z0-9_]+$/i;

import {components as controllers} from "./components/index.js";

function getRoots(target, selector){//{{{
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

const validName = (function nameGenerator() {//{{{
    let counter = 0;
    return function(n0){
        if (typeof n0 == "string") {
            n0 = n0.trim();
            if (n0.length) return n0;
        };
        return 'UNNAMED'+(++counter);
    };
})();//}}}


function onActionClick(ev) {
    const me = this;

    console.log("clicked!!", ev);
};


export class SmartForm {

    constructor(//{{{
        target
        , {
            property_name = "smart",
            parent = null,
        } = {}
    ) {
        const me = this;
        me.parent = parent;
        me.target = target;
        me.property_name = property_name;
        me.selector = `[data-${me.property_name}]`;
        me.childs = {};

        me.render();

        console.log("Parent:", me.parent);

        if (me.parent === null) me.target.addEventListener(
            "click"
            , onActionClick
            , true
        );

    };//}}}

    async render() {//{{{
        const me = this;

        const templates = [];
        const actions = {};

        for (
            const node
            of getRoots(me.target, me.selector)
        ) {

            // Sanityze and store options:{{{
            let options = (node.dataset[me.property_name] || "").trim();
            options = (
                // Accept 'str' as shorthand for '{type: "str"}':
                options.match(re_valid_typename_chars) ? {type: options}
                // Otherwise it must be a valid JSON:
                : JSON.parse(options)
            );
            const name = validName(options.name);
            options.name = name;
            options.parent = me;
            node[sym_options] = options;
            //}}}

            // Classify:{{{
            if (typeof options.type == "string") {
                if (options.action) throw new Error ([
                    "Invalid SmartForm item options:",
                    "type and action are not allowed for same element."
                ].join(" "));
                templates.push(node);
            } else if (typeof options.action == "string") {
                if (! actions[name]) actions[name] = [];
                actions[name].push(node);
            } else {
                if (options.action) throw new Error ([
                    "Invalid SmartForm item options:",
                    "no type or action specified for this element."
                ].join(" "));
            };
            //}}}

        };

        // Enhance components:
        for (const tpl of templates) {
            const options = tpl[sym_options];
            const ctrl = controllers[options.type];
            if (! ctrl) throw new Error([
                "Unimplemented SmartForm controller:",
                options.type,
            ].join(" "));
            me.childs[options.name] = await ctrl (
                tpl
                , options
                , {
                    parent: me,
                    createChild(target, options) {
                        const child = new SmartForm(
                            target
                            , {
                                parent: me,
                            }
                        );
                        console.log ("CHILD NAME:", child.name);


                        return child;
                    },
                }
            );

        };

        console.log("===========================");
        console.log(me.childs);
        console.log("===========================");

        // Enhance actions:
        // TO DO... 💡💡💡💡💡💡💡💡💡 


    };//}}}

};



