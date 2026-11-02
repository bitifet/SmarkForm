# Step 17 — Refactor the Final Showcase

## Session goal

Create the approved concise, visual, feature-dense Showcase using `showcase2.md`
as a starting point, after Step 16 has confirmed all destinations and claims.

## Dependencies

- Step 16's Showcase ledger is closed and not-retained decisions are approved.
- Canonical type/guide destinations from Steps 07–15 are present enough to link.

## Work

1. Refine the four approved feature-dense examples and shared page hierarchy.
   Do not reproduce the legacy long Showcase with only paragraphs removed.
2. Keep interactive examples that efficiently show complementary capabilities;
   do not force each legacy demo to survive as a separate Showcase entry.
3. Explain playground controls once per relevant reading context. Keep each
   example's notes focused on the demonstrated behavior and link to canonical
   detail.
4. Correct every claim identified in Step 16 and verify links, source captures,
   demo data, mask behavior, styles, component paths, and tests.
5. Preserve distinctive legacy behavior through the final examples or tested
   canonical examples according to the ledger. Add no unsupported behaviors.
6. Use approved permalink, page metadata, and navigation. Maintain paired
   migration markers and update ledger statuses as material lands.

## Required references

- `spc/SmarkForm_docs_refact.md` §§4 “Showcase-specific migration principle,”
  candidate map, and Stage 5.
- `docs/_about/showcase2.md`, `docs/_about/showcase.md`, Step 16 ledger.
- `AGENTS/Documentation-Examples.md`, `AGENTS/Documentation-Guidelines.md`,
  current specs/tests for every showcased feature.

## Deliverables

- Final Showcase at approved route with verified examples and canonical links.
- Updated migration markers and Showcase ledger closure.

## Verification / done when

- All candidate examples render and their claims match runtime behavior.
- Page is scannable and visual; controls are explained once, not repeated in each
  note block.
- Every removed legacy item has an exact covered destination or reviewed
  not-retained decision.
- Collector/co-located tests cover all final examples; route and internal links
  work in the parallel build.

## Delegation

Avoid parallel page edits. Read-only agents may test separate examples and
report reproducible bugs/claim mismatches; the primary editor integrates all
results and retains responsibility for the final ledger.
