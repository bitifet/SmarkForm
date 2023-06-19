// types/form.type.js
// ==================

import {SmarkComponent} from "../lib/component.js";
import {getRoots} from "../lib/helpers.js";
import {foldable} from "../decorators/foldable.deco.js";
import {action} from "./action.type.js";

@foldable
export class form extends SmarkComponent {
    async render() {//{{{
        const me = this;
        me.originalDisplayProp = me.target.style.display;
        // Enhance childs:
        for (
            const node
            of getRoots(me.target, me.selector)
        ) {
            const newItem = await me.enhance(node);
            if (newItem.options.type != "action") {
                newItem.name = me.validName(
                    newItem.options.name
                    , node.getAttribute("name")
                );
                me.children[newItem.name] = newItem;
                newItem.updateId();
            };
        };
    };//}}}
    @action
    async export() {//{{{
        const me = this;
        return Object.fromEntries(
            await Promise.all(Object.entries(me.children).map(
                async ([key, child])=>[key, await child.export()]
            ))
        );
    };//}}}
    @action
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
    async isEmpty() {//{{{
        const me = this;
        for (
            const child of Object.values(me.children)
        ) if (
            ! await child.isEmpty()
        ) return false;
        return true;
    };//}}}
    @action
    async empty() {//{{{
        const me = this;
        return await me.import({});
    };//}}}
};
