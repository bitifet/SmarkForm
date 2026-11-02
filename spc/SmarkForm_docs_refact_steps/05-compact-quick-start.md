# Step 05 — Compact Quick Start

## Session goal

Replace the roughly 1,000-line Quick Start with a short first-success path that
points to the later **Using SmarkForm** guide. Do not transfer or delete the
long tutorial in this session.

## Dependencies

- Steps 01–03; the approved route map and parallel staging structure.
- Step 04's product language should be settled before writing opening text.

## Work

1. Use the Quick Start transfer checklist in the spec and Step 01 ledger. Record
   every section, capture, note, CSS/JS block, demo value, and test before
   changing or deleting source material.
2. Keep the new Quick Start to the shortest useful path: load/init, mark a few
   fields, export a meaningful object, and link to installation choices and
   Core Concepts. End with a prominent next step to **Using SmarkForm**.
3. Do not copy the old long tutorial wholesale or retire its source sections;
   draft a Using SmarkForm outline and source-locator map now, while Step 08 will
   write and transfer the material after Core Concepts and action/path semantics
   are settled.
4. Reconcile “no form tag needed” language with the actual supported root and
   native form-submit behavior. Correct any claim that SmarkForm itself
   validates data; point to native constraints/custom hooks accurately.
5. Retain a compact, executable first-success sampletab, realistic `demoValue`,
   notes, and testability. Do not hardcode demo values in custom `jsHead`; use
   relative trigger contexts in editor examples.
6. Update the legacy and new page migration markers only for content actually
   moved; leave the rest for the later ledgered transfer.

## Required references

- `spc/SmarkForm_docs_refact.md` §4 Quick Start transfer checklist, §5 proposed
  reading paths/page responsibilities, and Stage 2.
- `docs/_getting_started/quick_start.md`, `getting_smarkform.md`,
  `core_concepts.md`, and the source pages named in the transfer ledger.
- `AGENTS/Documentation-Examples.md` and `AGENTS/Documentation-Guidelines.md`.
- `test/co_located_tests.tests.js`, `scripts/collect-docs-examples.js`.

## Deliverables

- Short Quick Start with a working first-success example and next-step links.
- A proposed Using SmarkForm outline mapped to legacy source locators, ready for
  the later authoring session.
- Updated ledger entries only for material actually moved in this step; all
  remaining old tutorial material remains explicitly pending Step 08.

## Verification / done when

- No lengthy tutorial sections are silently discarded or prematurely declared
  transferred.
- Sampletab captures remain syntactically intact; demo values/tests remain
  valid; editor-local paths are relative.
- Home → Quick Start → Core Concepts and the planned Using SmarkForm destination
  are clear, with no broken placeholder route.
- Build/collector parsing succeeds and relevant co-located examples can be
  executed; do not defer a discovered regression to the final cleanup step.

## Delegation

Avoid parallel editing the entry path. A read-only reviewer may assess the
first-success sequence; the primary agent owns edits and example tests.
