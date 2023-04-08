// components/form.component.js
// ============================


import {SmartComponent} from "../lib/component.js";
import {getRoots, validName} from "../lib/helpers.js";

const sym_options = Symbol("Options");
const re_valid_typename_chars = /^[a-z0-9_]+$/i;

export class form extends SmartComponent {
    render() {//{{{
        const me = this;
        const templates = [];
        const actions = {};

        const selector = `[data-${me.property_name}]`;

            console.log(selector);
            console.log(getRoots(me.target, selector));

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
            const ctrl = me.components[options.type];
            if (! ctrl) throw new Error([
                "Unimplemented SmartForm component controller:",
                options.type,
            ].join(" "));

            console.log("******", options.name, ctrl);
            me.childs[options.name] = new ctrl (
                tpl
                , options
                , me
            );

        };

        console.log("===========================");
        console.log(me.childs);
        console.log("===========================");

        // Enhance actions:
        // TO DO... 💡💡💡💡💡💡💡💡💡 


    };//}}}
};
