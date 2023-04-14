// components/form.component.js
// ============================

import {SmartComponent} from "../lib/component.js";
import {getRoots} from "../lib/helpers.js";

export class form extends SmartComponent {
    render() {
        const me = this;
        for (
            const node
            of getRoots(me.target, me.selector)
        ) {
            const newChild = me.enhance(node);
            const {name} = newChild.options;
            if (name) me.childs[name] = newChild;
        };
    };
    export() {
        const me = this;
        return Object.fromEntries(
            Object.entries(me.childs).map(
                ([key, child])=>[key, child.export()]
            )
        );
    };
};
