// src/lib/legacy.js
// =================

export default {
    disEnhance(me) {

        // Prevent <form>'s default behaviour:
        if (me.targetNode.tagName.toLowerCase()) {
            me.targetNode.addEventListener('submit', function(event) {

                // Avoid form's regular submission:
                event.preventDefault();

                // More work may be needed to be done here (let's give it some
                // more thought...)

            });
        };

    },
};
