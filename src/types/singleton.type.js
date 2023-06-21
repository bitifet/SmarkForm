// types/singleton.type.js
// =======================

import {form} from "./form.type.js";
import {action} from "./action.type.js";

export class singleton extends form {
    async render() {//{{{
        await super.render();
        const me = this;
        const numFields = Object.keys(me.children).length;
        if (numFields != 1) throw me.renderError(
            'NOT_A_SINGLETON'
            , `Singleton forms are only allowed to contain exactly one`
            + ` data field but ${numFields} found.`
        );
    };//}}}
    @action
    async export() {//{{{
        return Object.values(await super.export())[0];
    };//}}}
    @action
    async import({data = ""}) {//{{{
        const me = this;
        return await super.import(Object.fromEntries(
            [[Object.keys(me.children)[0], data]]
        ));
    };//}}}
    @action
    async empty() {//{{{
        const me = this;
        await me.import({data: ""});
    };//}}}
};

