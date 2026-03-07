// src/lib/legacy.js
// =================

const sym_legacy_prevent = Symbol('smarkform_legacy_prevent');

export default {
    disEnhance(me) {

        // Prevent <form>'s default submission behaviour (fallback stub).
        // The form component type attaches a smarter handler on top of this.
        if (
            me.targetNode.tagName.toLowerCase() === 'form'
            && ! me.targetNode[sym_legacy_prevent]
        ) {
            me.targetNode[sym_legacy_prevent] = true;
            me.targetNode.addEventListener('submit', function(event) {
                event.preventDefault();
            });
        };

    },
};
