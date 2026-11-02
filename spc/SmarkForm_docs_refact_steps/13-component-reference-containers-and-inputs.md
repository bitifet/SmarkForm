# Step 13 — Component Reference: Containers and Inputs

## Session goal

Migrate and verify the detailed Form, List, and Input component references while
preserving their specialized APIs, examples, and edge cases.

## Dependencies

- Step 12's Component Reference collection and canonical type routes.
- Step 06's updated core model and Step 07's context/target explanation.

## Work

1. Move Form, List, and Input references to their approved routes. Preserve
   type-specific option/action/default/constraint information and working
   sampletabs/tests.
2. Check Form import/export, JSON/native submission, submitter semantics,
   defaults/reset, and field omission rules against current source/tests.
3. Check List templates/roles, min/max, sorting and cross-list movement,
   templates, file-like append behavior, actions, defaults, and `export_empties`
   against source/spec/tests.
4. Check Input field behavior including masks, placeholder/value precedence,
   `set_default`, empty/null behavior, and native attributes. Do not merge
   behavior belonging to specialized field types into generic Input prose.
5. Replace duplicated context/path details with accurate links to Step 07's
   canonical explanation. Preserve compact local examples that teach type use.
6. Apply migration markers/ledger updates to every moved section and example.

## Required references

- `spc/SmarkForm_docs_refact.md` §§4–5 and Component Reference proposal.
- `docs/_component_types/type_form.md`, `type_list.md`, `type_input.md`.
- `src/types/form.type.js`, `list.type.js`, `input.type.js`, list decorators,
  specs and `test/type_form_submit.tests.js`, `test/type_list.tests.js`.
- `AGENTS/Documentation-Examples.md` and `AGENTS/SmarkForm-Usage.md`.

## Deliverables

- Accurate Form, List, Input reference pages at final routes.
- Preserved/updated examples and source/destination ledger closure.

## Verification / done when

- All described options/actions/defaults match current implementation and tests.
- Lists' direct-child template semantics and form/list data shapes remain clear.
- Existing example IDs/captures/tests are preserved or have reviewed equivalents.
- Pages build, routes/links resolve, and relevant examples parse/execute.

## Delegation

The three pages can receive independent read-only API audits. Avoid simultaneous
edits to the same pages; one primary agent must synchronize shared terminology,
cross-links, and the transfer ledger.
