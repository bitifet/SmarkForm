// lib/field.js
// ============

import {SmarkComponent} from "./component.js";
import {action} from "../types/trigger.type.js";

export class SmarkField extends SmarkComponent {
    constructor(...args){
        super(...args);
        this._isField = true;
        this.defaultValue = undefined; // Should be redefined by derived classes.
        this.emptyValue = undefined;   // Type-level empty value (for clear action)
        if (! Object.is(this, this.root)) {
            this.name = this.validName(
                this.options.name
                , this.targetNode.getAttribute("name")
            );
        };
        if (this.options.hasOwnProperty("value")) {
            if (this.targetNode.getAttribute("value") !== null) { // Conflict
                throw this.renderError(
                    'VALUE_CONFLICT'
                    , `Initial value specied both as "value" option and HTML "value" attribute.`
                );
            };
            this.onRendered(()=>{
                // This situation won't occur until after rendering, allowing
                // for modifications to defaultValue in constructors of
                // derived classes.
                this.defaultValue = this.options.value;
                this.reset();
            });
            if ( this.targetFieldNode) {
                this.targetNode.setAttribute("value", this.defaultValue);
            };
        };
    };
    @action
    async clear(_data, options = {}) {//{{{
        // Clear removes all user-provided values, resetting to type-level empty state
        // (ignoring any configured defaults)
        const clearValue = this.emptyValue !== undefined ? this.emptyValue : undefined;
        await this.import(clearValue, {silent: true, ...options});
    };//}}}
    @action
    async reset(_data, options = {}) {//{{{
        // Reset reverts to the configured default values (including any prepopulated defaults)
        await this.import(this.defaultValue, {silent: true, ...options});
    };//}}}
    // Note: Future 'null' action would explicitly set the entire form/field to null.
    // For nested forms, this would set the form value to null rather than clearing fields.
    // Implementation placeholder for when null action is needed:
    // @action
    // async null(_data, options = {}) {
    //     // Set the entire form/field to null (not clearing individual fields)
    //     await this.import(null, {silent: true, ...options});
    // }
};

