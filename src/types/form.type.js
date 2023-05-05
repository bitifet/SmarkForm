// types/form.type.js
// ==================

import {SmartComponent} from "../lib/component.js";
import {getRoots} from "../lib/helpers.js";
import {foldable} from "../decorators/foldable.deco.js";
import {action} from "./action.type.js";

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
    exportSync() {//{{{
        const me = this;
        return Object.fromEntries(
            Object.entries(me.children).map(
                ([key, child])=>[key, child.exportSync()]
            )
        );
    };//}}}
    async import(data = {}) {//{{{
        const me = this;
        const dataConstructor = Object(data).constructor;
        if (dataConstructor !== {}.constructor) throw me.renderError(
            'FORM_NOT_PLAIN_OBJECT'
            , `Expected plain object for form import, ${dataConstructor.name} given.`
        );
        return Object.fromEntries(
            await Promise.all(
                Object.entries(me.children).map(
                    async ([key, target]) => {
                        // Could have used target.then(...) but, event
                        // components' import() method SHOULD be async, it
                        // would have failed in case it's not.
                        // Forcing it to be async is not possible because
                        // transpilers would break this check.
                        // ...and, IMHO, this approach is better than a dirty
                        // Promise.resolve(...)
                        const value = await target.import(data[key]);
                        return [key, value];
                    }
                )
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
    @action
    empty() {//{{{
        const me = this;
        return me.import({});
    };//}}}
};
