# Step 06 — Core Concepts and Data Syntax

## Session goal

Make Core Concepts the concise conceptual bridge from marked-up HTML to a
component tree and JSON values, preserving supported shorthand and the reason
for JSON configuration.

## Dependencies

- Steps 01–03; route map and temporary parallel structure.
- Use the product sentence and first-success path settled in Steps 04–05.

## Work

1. Reorder the page around markup → component tree → value mapping → forms and
   lists → scalar fields → actions/paths.
2. Add an accessible diagram or ASCII model with root form, named subform,
   list/template item, and nested field. Explain that DOM layout is not itself
   the data model.
3. Add a minimal runnable nested-data example with actual expected export. Use
   supported current syntax, `myForm` naming, and `await myForm.rendered` before
   component-dependent work.
4. Make bare `data-smark`, type shorthand, prefixed attributes, and JSON options
   discoverable in a progression. Explain literal suffix behavior, snake_case
   option names, precedence, and structured-value limits accurately.
5. Resolve obsolete, draft, and duplicate prose explicitly. Preserve distinct
   sampletabs and tests; link to component references rather than cloning their
   complete option details.
6. Keep context/action/path exposition to a correct overview and route the
   detailed explanation to the canonical page handled in Step 07.

## Required references

- `spc/SmarkForm_docs_refact.md` §§3, 4, 5, and 6; Stage 3.
- `docs/_getting_started/core_concepts.md` and `core_component_types.md`.
- `AGENTS/Documentation-Guidelines.md`, `AGENTS/Documentation-Examples.md`.
- `src/lib/helpers.js`, `src/lib/component.js`, component type source, tests, and
  relevant specs when verifying syntax or export shape.

## Deliverables

- Reordered Core Concepts content with accurate model/syntax examples.
- Updated source/destination ledger for material moved from the old page.
- Cross-links to Using SmarkForm, action/path guidance, and component references.

## Verification / done when

- A newcomer can explain how annotated elements become fields and structured
  data without inferring that arbitrary DOM nesting determines JSON shape.
- Every syntax example is supported and every prefixed-attribute/type claim is
  verified against current implementation.
- Co-located examples/tests, headings, TOC anchors, and page front matter pass
  their structural checks.

## Delegation

One primary editor should own the page. A read-only technical review of the
diagram/value mapping is useful; do not let a second agent independently rewrite
the same Core Concepts captures.
