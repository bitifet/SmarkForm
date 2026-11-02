# Step 09 — Core Task Guides

## Session goal

Place the existing task-oriented form guides under Guides while preserving
their detailed behavior and examples.

## Dependencies

- Steps 01–03 establish ledgers, final routes, and parallel staging.
- Step 07's canonical action/path description should be available for links.

## Work

1. Move/revise Data Import and Export, Form Traversing, Value Coercion, and
   Field Masking at their approved Guides routes.
2. Preserve every distinct explanation, lifecycle caveat, option/method detail,
   code example, and sampletab test. Link to Step 07 for context/path rules.
3. Resolve overlap by assigning each complete explanation a canonical page;
   avoid copying full APIs into Using SmarkForm or Core Concepts.
4. Verify import/export shapes/defaults, traversal timing/path semantics,
   coercion boundaries, and mask registration/focus behavior against source,
   tests, and specs.
5. Update references from Quick Start/Using SmarkForm, FAQ, component pages,
   cheatsheet, agent resources, and old pages.
6. Update temporary migration markers and close ledger entries only after the
   actual destination is checked.

## Required references

- `spc/SmarkForm_docs_refact.md` §§4–5, proposed Guides, Stage 1, and Stage 4.
- Current `docs/_working_with_forms/data_import_and_export.md`,
  `form_traversing.md`, `value_coercion.md`, and `field_masking.md`.
- Related source/specs/tests and `AGENTS/Documentation-Examples.md`.

## Deliverables

- Four task-guide pages at approved routes with updated nav/cross-links.
- Complete transfer-ledger records for all moved sections/examples.

## Verification / done when

- Detailed API/reference material remains findable and technically complete.
- Every page's front matter, collection path, permalink, nav order, TOC and
  description match the approved schema.
- Internal links resolve in the dual-tree build; sampletab IDs/tests remain
  accounted for and parseable.
- Planned functionality is labeled as planned and not described as available.

## Delegation

Read-only audits of separate guide topics can be delegated. Keep each page's
edits with one owner and have the primary agent integrate shared links and
ledger updates.
