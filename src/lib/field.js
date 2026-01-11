// lib/field.js
// ============

import {SmarkComponent} from "./component.js";
import {action} from "../types/trigger.type.js";

export class SmarkField extends SmarkComponent {
    constructor(...args){
        super(...args);
        this._isField = true;
        this.defaultValue = undefined; // Should be redefined by derived classes.
        if (! Object.is(this, this.root)) {
            this.name = this.validName(
                this.options.name
                , this.targetNode.getAttribute("name")
            );
        };
        if (this.options.hasOwnProperty("value")) {
            if (this.targetNode.getAttribute("value") !== null) { // Conflict
                throw me.renderError(
                    'VALUE_CONFLICT'
                    , `Initial value specied both as "value" option and HTML "value" attribute.`
                );
            };
            if (! this.targetFieldNode) {
                this.onRendered(()=>{
                    // This situation won't occur until after rendering, allowing
                    // for modifications to defaultValue in constructors of
                    // derived classes.
                    this.defaultValue = this.options.value;
                    this.clear();
                });
            } else {
                this.targetNode.setAttribute("value", this.defaultValue);
            };
        };
    };
    @action
    async clear(_data, options = {}) {//{{{
        const me = this;
        await me.import(undefined, {silent: true, ...options});
    };//}}}
};

