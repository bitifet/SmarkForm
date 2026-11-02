# Step 08 — Using SmarkForm Guide

## Session goal

Create the complete developer-facing **Using SmarkForm** guide as the next step
after Quick Start, curating the long legacy tutorial into a coherent path rather
than reproducing it verbatim.

## Dependencies

- Steps 01–07: transfer ledger, approved routes, parallel staging, positioning,
  Quick Start, Core Concepts, and canonical action/context/path explanation.
- Step 05 provides the initial outline/source-locator map and links Quick Start
  to this final guide route.

## Work

1. Reopen the Quick Start ledger and account for every remaining useful source
   section, capture, note, CSS/JS, demo value, and test before transfer.
2. Build a practical progression: create and export a useful form; compose
   nested data/lists; use common actions and context; import/export; then choose
   next steps for guides, reference, and customization.
3. Preserve examples that teach a distinct step. Merge only genuinely repeated
   explanations; link to Core Concepts, task guides, Events, and Component
   Reference for full detail rather than reproducing their APIs.
4. Keep the developer audience explicit so the guide does not read like the
   separate end-user User Guide.
5. Reuse verified syntax and paths. Trigger paths inside editor-wrapped
   sampletabs must be relative. Use `demoValue`, capture/fold conventions,
   notes, and tests as required.
6. Reconcile native form submission, validation, lookup timing, defaults, list
   semantics, and hotkey examples with the canonical pages and current source.
7. Update paired migration markers and source/destination ledger rows only after
   destination prose/examples are complete and reviewed.

## Required references

- `spc/SmarkForm_docs_refact.md` §4 Quick Start transfer checklist, §5 Using
  SmarkForm responsibility, and Stage 4.
- `docs/_getting_started/quick_start.md` legacy source and its approved short
  replacement; `docs/_getting_started/core_concepts.md`; Step 01 ledger.
- Steps 06–07 canonical concepts and path explanations.
- `AGENTS/Documentation-Guidelines.md`, `AGENTS/Documentation-Examples.md`,
  `test/co_located_tests.tests.js`.

## Deliverables

- Complete practical Using SmarkForm guide at the approved Guides route.
- Closed transfer ledger for the legacy Quick Start's valuable material.
- Quick Start next-step link verified against the final route.

## Verification / done when

- The tutorial has a coherent beginning-to-end progression and distinct role
  from Quick Start and reference pages.
- Every useful legacy section/capture/test has an exact destination or reviewed
  disposition; no material was dropped just to shorten the source.
- Samples parse, have valid demo values and paths, and preserve tests/controls.
- The guide links correctly to canonical references and passes docs collection,
  build, and relevant example tests.

## Delegation

Do not assign separate agents to edit sections in the same guide. A read-only
review of the learning sequence or a bounded source-to-destination audit can be
delegated; one primary agent owns prose, examples, tests, and ledger closure.
