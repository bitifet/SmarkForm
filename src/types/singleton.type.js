// types/singleton.type.js
// =======================

import {form} from "./form.type.js";
import {action} from "./action.type.js";

export class singleton extends form {
    render() {//{{{
        super.render();
        const me = this;
        const numFields = Object.keys(me.children).length;
        if (numFields != 1) throw me.renderError(
            'NOT_A_SINGLETON'
            , `Singleton forms are only allowed to contain exactly one`
            + ` data field but ${numFields} found.`
        );
    };//}}}
    exportSync() {//{{{
        return Object.values(super.exportSync())[0];
    };//}}}
    async import(value = "") {//{{{
        const me = this;
        return await super.import(Object.fromEntries(
            [[Object.keys(me.children)[0], value]]
        ));
    };//}}}
    @action
    async empty() {//{{{
        const me = this;
        await me.import("");
    };//}}}
};

