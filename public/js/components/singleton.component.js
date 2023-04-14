// components/singleton.component.js
// =================================

import {form} from "./form.component.js";

export class singleton extends form {
    render() {
        super.render();
        const me = this;
        const numFields = Object.keys(me.childs).length;
        if (numFields != 1) throw me.Error(
            `Singleton forms are only allowed to contain exactly one`
            + ` data field but ${numFields} found.`
        );
    };
    export() {
        return Object.values(super.export())[0];
    };
};

