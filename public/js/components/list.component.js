// components/list.component.js
// ============================
import {SmartComponent} from "../lib/component.js";
export class list extends SmartComponent {
    constructor(...args) {
        super();
        const me = this;
        me.childs = [];
    };
    render () {
        const me = this;
        // console.log("New list!!!!", {
        //     target: me.target,
        //     parent: me.parent,
        //     options: me.options,
        // });
        return;
    };
};
