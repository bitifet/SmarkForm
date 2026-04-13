// types/label.type.js
// ===================
import {SmarkComponent} from "../lib/component.js";
import {randomId} from "../lib/helpers.js";
import {getRoots} from "../lib/helpers.js";

export class label extends SmarkComponent {
    constructor(node, {allow_select = false, ...options}, ...args){
        delete options.name; // Labels are always unnamed.
        super(node, {allow_select, ...options}, ...args);
        const me = this;
        // If this label element is nested inside a <summary> (but is not the
        // summary itself), stop the click from bubbling to <summary> so it
        // does not trigger the <details> fold/unfold.  Only the disclosure
        // triangle (::before / ::marker on <summary>) should fold/unfold.
        // This must be a synchronous DOM listener — the SmarkForm async
        // click hook fires too late to stop DOM propagation.
        const parentSummary = me.targetNode.closest("summary");
        if (parentSummary && parentSummary !== me.targetNode) {
            me.targetNode.addEventListener('click', ev => ev.stopPropagation());
        };
        me.eventHooks.click.push(
            function click_hook(ev) {
                // Mimic native label behavior for non-native fields:
                if (ev.defaultPrevented) return;
                const {target} = me.getLabelArgs();
                if (
                    ! target?.targetFieldNode  // Non-scalar: focus the component
                    || (me.nodeType === "legend") // Legend: focus first child field
                    || (me.nodeType !== "label")  // Non-native element (span, strong…):
                                                  // must simulate focus explicitly since
                                                  // setAttribute("for", …) has no effect
                                                  // on non-<label> elements.
                ) target?.focus();
            },
        );
    };
    async render(){
        const me = this;
        // Detect invalid use of the <summary> element directly as a SmarkForm
        // label.  When <summary> is the label, its click behaviour (to focus
        // the related field) conflicts with the browser's native <details>
        // fold/unfold activation.  Use a non-native element (e.g. <span>)
        // INSIDE the <summary> as the SmarkForm label instead, and preserve
        // the disclosure triangle (::before / ::marker on <summary>) for
        // fold/unfold.
        if (
            String(me.targetNode.tagName).toLowerCase() === "summary"
        ) throw me.renderError(
            'SUMMARY_AS_LABEL'
            , `The <summary> element cannot be used directly as a SmarkForm label. `
            + `Clicking a <summary>-as-label would both focus the related field AND `
            + `toggle the <details> fold/unfold, which conflict. `
            + `Use a non-native element inside the <summary> instead: `
            + `<span data-smark='{"type":"label"}'> inside <summary> in form ${me.getPath()}.`
        );
        // Detect invalid use of a native <label> inside a <summary>:
        // browsers suppress the <details> toggle for interactive content
        // (including <label>) inside <summary>, so a native label cannot be
        // placed there.  Use a non-native element (e.g. <span>) as the
        // SmarkForm label inside <summary> instead.
        if (
            String(me.targetNode.tagName).toLowerCase() === "label"
            && me.targetNode.closest("summary")
        ) throw me.renderError(
            'LABEL_INSIDE_SUMMARY'
            , `Native <label> elements are not allowed inside a <summary> element `
            + `because browsers suppress the <details> toggle for interactive content `
            + `inside <summary>. Use a non-native element (e.g. <span>) as the `
            + `SmarkForm label inside <summary> instead in form ${me.getPath()}.`
        );
        // Enhance triggers inside the label:
        let childField = null;
        for (
            const node
            of getRoots(me.targetNode, me.selector)
        ) {
            const newItem = await me.enhance(node);
            if (!! newItem?._isField) {
                if (childField !== null) throw me.renderError(
                    'EXTRA_FIELD_IN_LABEL'
                    , `Labels can wrap only one target field, but multiple fields found in form ${me.getPath()}.`
                );
                if (me.options.target !== undefined) {
                    throw me.renderError(
                        'LABEL_EXPLICIT_TARGET'
                        , `Labels wrapping their target field cannot define explicit target option in form ${me.getPath()}.`
                    );
                };
                childField = newItem;
                childField.parent = me.parent;
                me.parent.mountField(childField);
            };
        };
        me.parent.onRendered(async ()=>{
            const me = this;
            me.nodeType = String(me.targetNode.tagName).toLowerCase();
            const labelArgs = me.getLabelArgs();
            const labelledField = labelArgs.target || {};
            await labelledField.rendered; // Ensure target field is rendered.
            if (labelledField.targetFieldNode) { // Apply only to native inputs (scalars)
                if (! labelledField.targetFieldNode.id) { // Ensure targetted field has an Id
                    labelledField.targetFieldNode.id = randomId();
                };
                me.targetNode.setAttribute("for", labelledField.targetFieldNode.id);
            };

            // Automatically link label and field for screen readers:
            if (
                me.nodeType != "label"   // Not a native <label>
            ) {
                // Ensure label has an Id:
                if (! me.targetNode.id) {
                    me.targetNode.id = randomId();
                };
                // Get previous aria-labelledby values:
                const alb_arr = (
                    labelledField.targetNode.getAttribute("aria-labelledby")
                    || ""
                )
                    .split(" ")
                    .filter(id => id)
                ;
                // Add label id if not already present:
                if (0 > alb_arr.indexOf(me.targetNode.id)) {
                    alb_arr.push(me.targetNode.id);
                };
                // Reinject updated list:
                labelledField.targetNode.setAttribute(
                    "aria-labelledby"
                    , alb_arr.join(" ")
                );
            } else {
                if (! labelledField.targetFieldNode) {
                    throw me.renderError(
                        'LABEL_FOR_NONFIELD'
                        , `Native <label> tags targetting non native field are not allowed in HTML, you should use different tag.`
                    );
                };
            };

            // Mark this node as a SmarkForm label so sortable lists can
            // use it as a drag handle.
            me.targetNode.setAttribute("data-smark-label", "");

            // Make labels non-selectable unless "allow_select" option is set
            // to true.
            if (! me.options.allow_select) {
                me.targetNode.style["user-select"] = "none";
            };

            // Auto-fix missing disclosure triangle.
            //
            // When a SmarkForm label is placed inside a <summary> that uses
            // display:flex / display:grid, the native ::marker disclosure
            // triangle disappears (flex/grid items suppress list-item markers).
            // Detect this condition and inject a lightweight CSS fallback so
            // developers get the triangle automatically without having to add
            // a manual ::before rule.
            //
            // Detection conditions (both must be true):
            //   1. The parent <summary> has a computed display other than
            //      "list-item" (e.g. flex / grid).
            //   2. The <summary> has no custom ::before content set by the
            //      page's CSS (content === "none" means nothing is provided).
            //
            // Fix: set data-sf-triangle-fix attribute on the <summary> and
            // inject a once-per-document <style> tag that provides the
            // fallback triangle via ::before.  The rules use :where() for
            // zero specificity so any developer CSS takes precedence.
            if (typeof window !== "undefined") {
                const labelSummary = me.targetNode.closest("summary");
                if (labelSummary && labelSummary !== me.targetNode) {
                    const summaryDisplay = window.getComputedStyle(labelSummary).display;
                    const beforeContent = window.getComputedStyle(labelSummary, "::before").content;
                    if (
                        summaryDisplay !== "list-item"
                        && beforeContent === "none"
                    ) {
                        labelSummary.setAttribute("data-sf-triangle-fix", "");
                        if (!document.getElementById("sf-disclosure-triangle-style")) {
                            const style = document.createElement("style");
                            style.id = "sf-disclosure-triangle-style";
                            style.textContent = [
                                ":where(summary[data-sf-triangle-fix]) { list-style: none; }",
                                ":where(summary[data-sf-triangle-fix])::before {",
                                "  content: \"▶\"; font-size: .75em;",
                                "  transition: transform .15s; flex-shrink: 0; cursor: pointer;",
                                "}",
                                ":where(details[open] > summary[data-sf-triangle-fix])::before {",
                                "  transform: rotate(90deg);",
                                "}",
                            ].join("\n");
                            document.head.appendChild(style);
                        };
                    };
                };
            };
        });
    };
    getLabelArgs() {//{{{
        const me = this;
        let context, target;

        const {
            // property: local variable
            context: contextPath,     // Define context component
            target: targetPath,       // Define targetted child component
            ...otherOptions
        } = me.options;

        if (! contextPath && ! targetPath) {
            // Guess ;-)
            context = me.parent;
            if (
                me.nodeType === "legend"
                && context.targetNode.tagName.toLowerCase() === "fieldset"
            ) {
                target = Object.values(context.children)[0]; // First child of fieldset
            } else {
                const candidates = context.targetNode.querySelectorAll(me.selector);
                let found = false;
                for (const childName in candidates) {
                    if (found) {
                        let targetComponent = me.getComponent(candidates[childName]);
                        if (targetComponent?._isField) {
                            target = targetComponent;
                            break;
                        };
                    } else if (
                        Object.is(candidates[childName], me.targetNode)
                    ) {
                        found = true;
                    };
                };
            };
        } else {
            context = (
                contextPath ? me.parent.find(contextPath)
                : me.parent
            );
            target = (
                targetPath ? context.find(targetPath) // Explicit target (context relative)
                : context
            );
        };

        return {
            origin: me,
            context,
            target,
            ...otherOptions,
        };

    };//}}}
};
