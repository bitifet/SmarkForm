// components/text.component.js
// ============================
import {SmartComponent} from "../lib/component.js";
export class text extends SmartComponent {
    render () {
        const me = this;
        console.log("New text!!!!", {
            target: me.target,
            parent: me.parent,
            options: me.options,
        });
        ///const Child = createChild(target, options);
        return;
    };
};
