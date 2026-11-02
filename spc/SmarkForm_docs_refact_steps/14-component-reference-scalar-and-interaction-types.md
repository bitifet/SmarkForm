# Step 14 — Component Reference: Scalar and Interaction Types

## Session goal

Migrate and verify scalar/control component references, plus Trigger and Label,
without flattening their distinct values, native behavior, or accessibility
responsibilities.

## Dependencies

- Step 12's Component Reference foundation/routes.
- Steps 07 and 11 for shared action/path and accessible-label guidance.

## Work

1. Move and audit Number, Date, Time, DateTime-Local, Color, Radio, Select,
   Trigger, and Label references to their approved routes.
2. Verify each type's supported element, inferred/explicit type behavior,
   export/import shape, null/empty semantics, defaults, and native attribute
   interactions from implementation/spec/tests.
3. Keep Trigger action configuration/API distinct from action identifiers and
   shared path semantics. Link to the canonical Step 07 guide rather than
   repeating incomplete rules.
4. Keep Label's association/API detail here while linking to Accessible Labels
   and Names for broader authoring semantics and caveats.
5. Preserve or improve existing sampletabs and co-located tests. Update
   `demoValue`, notes, captures, and test locators according to agent guidance.
6. Record every legacy source locator and destination in the ledger; do not
   retire any old example solely because a scalar type looks simple.

## Required references

- `spc/SmarkForm_docs_refact.md` §§4–5 and accessibility evidence in §6.
- `docs/_component_types/type_number.md`, `type_date.md`, `type_time.md`,
  `type_datetime-local.md`, `type_color.md`, `type_radio.md`, `type_select.md`,
  `type_trigger.md`, `type_label.md`.
- `src/types/` implementations, `src/lib/component.js` inference, specs, and
  corresponding Playwright tests.
- `AGENTS/Documentation-Guidelines.md`, `AGENTS/Documentation-Examples.md`.

## Deliverables

- Accurate type references for scalar and interaction/control types.
- Updated cross-links, migrated examples, and closed ledger entries.

## Verification / done when

- Type-specific distinctions and native HTML reliance are accurately stated.
- No generalized validation or accessibility guarantee is introduced.
- All affected examples/tests remain collected and relevant tests pass.
- Page metadata, TOCs, links, and final routes are correct.

## Delegation

Independent read-only reviews by type family are reasonable. Assign a single
editor to each disjoint file set and designate one integrator for terminology,
nav/links, and ledger; do not parallelize shared page edits.
