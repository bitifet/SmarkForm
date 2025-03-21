// types/form.type.js
// ==================

import {SmarkField} from "../lib/component.js";
import {action} from "./trigger.type.js";
import {foldable} from "../decorators/foldable.deco.js";
import {export_to_target} from "../decorators/export_to_target.deco.js";
import {import_from_target} from "../decorators/import_from_target.deco.js";
import {getRoots, parseJSON} from "../lib/helpers.js";

@foldable
export class form extends SmarkField {
    async render() {//{{{
        const me = this;
        me.originalDisplayProp = me.targetNode.style.display;
        // Enhance childs:
        for (
            const node
            of getRoots(me.targetNode, me.selector)
        ) {
            const newItem = await me.enhance(node);
            if (!! newItem?._isField) {
                if (me.children[newItem.name] !== undefined) throw me.renderError(
                    'REPEATED_FIELD_NAME'
                    , `Field name '${newItem.name}' used more than once in this form level.`
                );
                me.children[newItem.name] = newItem;
                newItem.updateId();
            };
        };
    };//}}}
    @action
    @export_to_target
    async export() {//{{{
        const me = this;
        return Object.fromEntries(
            await Promise.all(Object.entries(me.children).map(
                async ([key, child])=>[key, await child.export()]
            ))
        );
    };//}}}
    @action
    @import_from_target
    async import({data = {}, focus = true} = {}) {//{{{
        const me = this;
        const dataConstructor = Object(data).constructor;
        if (
            dataConstructor !== {}.constructor // Not a plain object
            && ! (data = parseJSON(data))      // Neither a (valid) JSON string
        ) throw me.renderError(
            'FORM_NOT_PLAIN_OBJECT'
            , `Expected plain object or vailid JSON for form import, ${dataConstructor.name} given.`
        );
        const retv = Object.fromEntries(
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
                        const value = await target.import({data: data[key], focus});
                        return [key, value];
                    }
                )
            )
        );
        if (focus) me.focus();
        return retv;
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
    async clear({focus} = {}) {//{{{
        const me = this;
        return await me.import({data: {}, focus});
    };//}}}
};
