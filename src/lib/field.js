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
        const hasValueAttr = this.targetNode.getAttribute("value") !== null;
        const hasValueOption = this.options.hasOwnProperty("value");
        if (hasValueAttr && hasValueOption) { // Conflict
            throw this.renderError(
                'VALUE_CONFLICT'
                , `Initial value specied both as "value" option and HTML "value" attribute.`
            );
        };
        this.onRendered(async ()=>{
            // This situation won't occur until after rendering, allowing
            // for modifications to defaultValue in constructors of
            // derived classes.
            this.defaultValue = (
                hasValueOption ? this.options.value
                : hasValueAttr ? this.targetNode.getAttribute("value")
                : this.emptyValue
            );
            if ( this.targetFieldNode) {
                this.targetNode.setAttribute("value", this.defaultValue);
            };
            await this.reset(null, {silent: true, focus: false});
        });
    };
    @action
    async clear(_data, options = {}) {//{{{
        // Clear removes all user-provided values, resetting to type-level empty state
        // (ignoring any configured defaults)
        await this.import(this.emptyValue, {silent: true, setDefault: false, ...options});
    };//}}}
    @action
    async reset(_data, options = {}) {//{{{
        // Reset reverts to the configured default values (including any prepopulated defaults)
        await this.import(undefined, {silent: true, ...options});
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

