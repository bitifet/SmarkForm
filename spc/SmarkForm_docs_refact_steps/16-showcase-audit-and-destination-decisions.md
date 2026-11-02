# Step 16 — Showcase Audit and Destination Decisions

## Session goal

Close the Showcase three/four-way coverage ledger before replacing the legacy
long page. Verify what the candidate final Showcase demonstrates and what
canonical pages already contain.

## Dependencies

- Step 01's initial Showcase inventory and Step 02's approved final Showcase
  route/design direction.
- Steps 07–15's canonical content should be far enough along to verify actual
  destinations (not just planned links).

## Work

1. Compare every legacy Showcase section, heading, include, capture, CSS/JS,
   demo value, notes, test, and distinctive behavior against:
   `showcase2.md`, historical analysis/plan docs, and actual canonical pages.
2. Verify the four candidate examples: Just a Form, Project Kanban Board, Race
   Registration System, and Product Configurator. Record exact feature coverage
   and any missing canonical explanation/example.
3. Fact-check the candidate claims listed in SPC §4: business-rule validation,
   empty-to-null wording, “scoped” mixin CSS, `moving_depth` relationship,
   mask output/unmasked value, and external-library robustness.
4. Decide per locator: retain in final Showcase, move to exact canonical
   destination (with sufficient prose and runnable example), combine into a
   candidate example, or reviewed not-retained with rationale.
5. Reconcile old Showcase decisions in `docs/showcase_analysis.md` and
   `AGENTS/Showcase-Restructure-Plan.md`; mark superseded decisions explicitly
   rather than treating planning notes as current truth.
6. Confirm destination coverage for masking, prefixed options, wildcard actions,
   cross-list movement, nested forms/lists, hotkeys, event behavior, mixins,
   template roles, and file/media examples.

## Required references

- `spc/SmarkForm_docs_refact.md` §§4 “Showcase-specific migration principle,”
  Stage 5, and the candidate example map.
- `docs/_about/showcase.md`, `docs/_about/showcase2.md`,
  `docs/showcase_analysis.md`, `AGENTS/Showcase-Restructure-Plan.md`.
- Actual destination pages, source/spec/tests for each claim, and co-located
  example manifest/tests.

## Deliverables

- Closed Showcase source-to-destination ledger.
- Candidate claim correction list and missing-destination blockers.
- Maintainer decisions for any not-retained content.

## Verification / done when

- Every legacy section/capture/test is accounted for with precise locators.
- Each claimed destination actually contains the required explanation and
  example; mere mention does not count.
- All candidate feature claims are supported by implementation/tests or corrected.
- No destructive legacy Showcase replacement begins until ledger gaps and
  decisions are resolved.

## Delegation

A read-only agent can audit one candidate example or a disjoint legacy section,
provided every capture/test locator is reported. Do not permit delegated agents
to delete legacy examples or declare coverage complete; the primary agent closes
the authoritative ledger and obtains maintainer decisions.
