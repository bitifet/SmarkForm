// components/singleton.component.js
// =================================

import {form} from "./form.component.js";

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
    export() {//{{{
        return Object.values(super.export())[0];
    };//}}}
    import(value = "") {//{{{
        const me = this;
        return super.import(Object.fromEntries(
            [[Object.keys(me.children)[0], value]]
        ));
    };//}}}
};

