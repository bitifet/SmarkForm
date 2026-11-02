# Step 01 — Baseline Inventory and Content Ledger

## Session goal

Establish a verified snapshot of the documentation and close the initial
content inventory before changing any reader-facing page. This is the execution
of Stage 0's audit work in `spc/SmarkForm_docs_refact.md` §7.

## Dependencies

- None. This is the first implementation session.
- Treat the information architecture and all new destinations as proposals
  until Step 02 records maintainer approval.

## Work

1. Record the branch, commit, status, and relevant current `main` ancestry. Read
   the approved refactoring spec and all relevant `AGENTS/` guidance first.
2. Preserve and identify pre-existing worktree changes before starting. At the
   time this plan was written, `docs/_data/package.json` was already modified
   in `doc_refact`; do not reset, overwrite, or stage it without understanding
   its origin and asking if ownership is unclear.
3. Create a page-level inventory of every current user-facing page, permalink,
   collection, nav order, incoming links, and likely destination. Include
   root-level pages and collections, not just files in `_about/`.
4. Build the authoritative content-transfer ledger described in the spec. For
   each source section record its heading/locator, prose/API detail, sampletab
   include and capture names, HTML/CSS/JS, demo value, notes, tests, and one of:
   keep, rewrite, move (with destination), verify/correct, or defer.
5. Make a separate Showcase comparison ledger using the legacy Showcase,
   `showcase2.md`, `docs/showcase_analysis.md`,
   `AGENTS/Showcase-Restructure-Plan.md`, and actual canonical destination
   pages. Do not assume an earlier migration decision was completed.
6. Inventory internal links/fragments and claims needing verification, including
   validation, accessibility, framework comparisons, bundle size, sorting,
   context/target semantics, current/future status, and `data-smark` syntax.
7. Record every unresolved maintainer decision instead of silently choosing a
   route, deleting content, changing behavior, or making a new product claim.

## Required references

- `spc/SmarkForm_docs_refact.md` §§2–4, especially the Quick Start and Showcase
  transfer checklists.
- `AGENTS/Documentation-Guidelines.md`
- `AGENTS/Documentation-Examples.md`
- `AGENTS/Documentation-Tracking.md`
- `docs/showcase_analysis.md`
- `AGENTS/Showcase-Restructure-Plan.md`
- `test/` and `scripts/collect-docs-examples.js` when enumerating example tests.

## Deliverables

- A source-revision/baseline note.
- A complete content-transfer ledger, including all source examples/tests.
- A Showcase-specific crosswalk and an issues/decisions list for Step 02.
- No reader-facing documentation changes in this session.

## Verification / done when

- Every inventory source has a destination or an explicit defer/not-retained
  decision with rationale; no substantive passage, API detail, capture, or test
  is unaccounted for.
- All sampletab captures and test identifiers are recorded exactly.
- The candidate final Showcase and historic migration records have been checked
  against current implementation and existing canonical docs.
- Unresolved decisions, URL assumptions, and the pre-existing dirty file are
  visible in the handoff.

## Delegation

Do not delegate page edits. A read-only agent may independently inventory a
bounded source set (for example, Showcase captures) if the parent agent specifies
the exact files and reconciles its findings into the single authoritative
ledger. No removal decision is delegated.
