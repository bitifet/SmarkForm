// components/form.component.js
// ============================

import {SmartComponent} from "../lib/component.js";
import {getRoots, validName} from "../lib/helpers.js";

const sym_options = Symbol("Options");
const re_valid_typename_chars = /^[a-z0-9_]+$/i;

export class form extends SmartComponent {
    render() {
        const me = this;
        const templates = [];

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
            const name = validName(
                options.name
                , node.getAttribute("name")
            );
            options.name = name;
            options.parent = me;
            node[sym_options] = options;
            //}}}

            // Classify:{{{
            if (options.action) {
                options.type ||= "action"; // Make type optional for actions.
                if (options.type != "action") throw new Error(
                    `Actions must be of type "action" but "${options.type}" given.`
                );
            } else if (typeof options.type != "string") {
                throw new Error(
                    `Invalid SmartFom item: type is mandatory for non action elements.`
                );
            };
            templates.push(node);
            //}}}

        };

        // Enhance components:{{{
        for (const tpl of templates) {
            const options = tpl[sym_options];
            const ctrl = me.components[options.type];
            if (! ctrl) throw new Error([
                "Unimplemented SmartForm component controller:",
                options.type,
            ].join(" "));
            ///////////////////////////////////////////////////////////
            console.log("Creating child for " + me.options.name + " with name: " + options.name);
            ///////////////////////////////////////////////////////////
            me.childs[options.name] = new ctrl (
                tpl
                , options
                , me
            );
        };//}}}

    };
};
