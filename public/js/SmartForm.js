
const sym_options = Symbol("Options");
const re_valid_typename_chars = /^[a-z0-9_]+$/i;

import {getRoots, validName} from "./lib/helpers.js";
import {components as controllers} from "./components/index.js";
import {SmartComponent} from "./lib/component.js";

function onActionClick(ev) {
    const me = this;

    console.log("clicked!!", ev);
};





export class SmartForm extends SmartComponent {

    constructor(
        target
        , {
            property_name = "smart",
            ...options
        } = {}
    ) {
        super(target, options);
        const me = this;
        me.property_name = property_name;

        me.render();

        console.log("Parent:", me.parent);

        if (me.parent === null) me.target.addEventListener(
            "click"
            , onActionClick
            , true
        );

    };

    async render() {//{{{
        const me = this;
        const templates = [];
        const actions = {};

        const selector = `[data-${me.property_name}]`;

        for (
            const node
            of getRoots(me.target, selector)
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



