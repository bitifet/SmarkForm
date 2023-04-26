// components/form.component.js
// ============================

import {SmartComponent} from "../lib/component.js";
import {getRoots} from "../lib/helpers.js";
import {foldable} from "../decorators/foldable.deco.js";

@foldable
export class form extends SmartComponent {
    render() {//{{{
        const me = this;
        me.originalDisplayProp = me.target.style.display;
        for (
            const node
            of getRoots(me.target, me.selector)
        ) {
            const newChild = me.enhance(node);
            if (newChild.options.type != "action") {
                newChild.name = me.validName(
                    newChild.options.name
                    , node.getAttribute("name")
                );
                me.children[newChild.name] = newChild;
            };
        };
    };//}}}
    export() {//{{{
        const me = this;
        return Object.fromEntries(
            Object.entries(me.children).map(
                ([key, child])=>[key, child.export()]
            )
        );
    };//}}}
    import(data = {}) {//{{{
        const me = this;
        const dataConstructor = Object(data).constructor;
        if (dataConstructor !== {}.constructor) throw me.renderError(
            'FORM_NOT_PLAIN_OBJECT'
            , `Expected plain object for form import, ${dataConstructor.name} given.`
        );
        return Object.fromEntries(
            Object.entries(me.children).map(
                ([key, target]) => [key, target.import(data[key])]
            )
        );
    };//}}}
    isEmpty() {//{{{
        const me = this;
        return (
            0 > Object.values(me.children)
                .findIndex(
                    child=>!child.isEmpty()
                )
        );
    };//}}}
    empty() {//{{{
        const me = this;
        return me.import({});
    };//}}}
};
