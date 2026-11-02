# Step 07 — Actions, Context, Target, and Paths

## Session goal

Make the shared action-addressing model accurate and consistent across Core
Concepts, Trigger, Form Traversing, Using SmarkForm, FAQ, and agent guidance.

## Dependencies

- Steps 01–06; canonical target page names/routes are approved.
- Use Step 06's component-tree diagram/model as the conceptual anchor.

## Work

1. Establish a single precise explanation: natural context walks ancestors to
   the nearest component implementing the action; triggers are not path nodes.
2. Explain explicit `context` resolution from the trigger's enclosing field,
   relative and absolute paths, action implementation requirements, and
   wildcard/list behavior where relevant.
3. Keep `target` distinct from `context`; explain that target paths resolve from
   the effective context and describe direction/action-specific import/export
   copy semantics.
4. Design examples/diagram for root form, nested form, list and item. Keep each
   example compact and runnable. Use relative paths inside editor-wrapped
   sampletabs.
5. Align the Core Concepts overview, Trigger/API reference, Form Traversing,
   Using SmarkForm, FAQ, and `AGENTS/SmarkForm-Usage.md`. Put full detail in its
   canonical location and use links elsewhere.
6. Check current behavior against wildcard multi-context dispatch, nested lists,
   methods that do not implement an action, and current error behavior.

## Required references

- `spc/SmarkForm_docs_refact.md` §§3, 4, 6 “Component tree, context, target,
  and paths,” and Stage 4.
- `docs/_getting_started/core_concepts.md`, Trigger component page, form
  traversing, FAQ, Using SmarkForm, and usage agent references.
- `src/types/trigger.type.js`, `src/lib/component.js`, actions/events code, and
  `test/trigger_multicontext.tests.js` plus relevant traversal tests.

## Deliverables

- Canonical action/context/target/path explanation and visual or examples.
- Consistent short reminders and cross-links across affected pages.
- Ledger entries for any source passages moved or retired.

## Verification / done when

- Text and examples distinguish trigger location, effective context, path base,
  and target base with no contradictory shortcut.
- Relative/absolute and wildcard behaviors match source/tests.
- Example paths work inside sampletab editor wrapping and collection/test runs.
- Cross-page terminology and error descriptions agree.

## Delegation

A read-only reviewer can test the mental model against source and focused tests.
Do not delegate edits to several destination pages simultaneously; one owner
should synchronize the wording and migration ledger.
