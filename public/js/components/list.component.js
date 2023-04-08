
import {SmartComponent} from "../lib/component.js";

export class list extends SmartComponent {
    render () {
        const me = this;
        console.log("New list!!!!", {
            target: me.target,
            parent: me.parent,
            options: me.options,
        });
        ///const Child = createChild(target, options);
        return;
    };
};
