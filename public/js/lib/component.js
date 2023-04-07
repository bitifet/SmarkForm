
export class SmartComponent {
    constructor(
        target
        , {
            parent = null,
        } = {}
    ) {
        const me = this;
        me.parent = parent;
        me.target = target;

        me.childs = {};
    };

};
