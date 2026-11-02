# Step 12 — Component Reference Foundation and Cheatsheet

## Session goal

Establish the Component Reference collection, orienting overview, and a useful
home for the Developer Cheatsheet before migrating type-specific references.

## Dependencies

- Steps 01–03; collection names and page routes approved.
- Step 06's conceptual model is available for concise orientation.

## Work

1. Register Component Reference collection/nav and move the existing overview
   from Getting Started to its approved route. The overview should orient readers
   and link to the type pages, not restate their complete APIs.
2. Move the Developer Cheatsheet into Component Reference. Preserve generated
   TOC rules, all useful examples, cross-reference targets, and the validator's
   assumptions. Do not hand-edit generated TOC output.
3. Update page titles/descriptions, `nav_order`, permalinks, aliases, and links
   from Core Concepts, Quick Start, Guides, and old pages.
4. Add an index/overview map for all current built-in types, including trigger,
   label, select, and all media types. Do not omit types simply because the
   old overview grouped them differently.
5. Keep the component overview's scope distinct from detailed type references.
   Link to specific behavior and the Cheatsheet as appropriate.

## Required references

- `spc/SmarkForm_docs_refact.md` §§4–5 and proposed Component Reference tree.
- `docs/_getting_started/core_component_types.md`,
  `docs/_resources/cheatsheet.md`, `scripts/validate-cheatsheet.js`,
  `scripts/generate-chaptertocs.js`.
- `src/main.js` type registry and current type-specific docs/source.

## Deliverables

- Component Reference collection, overview, and migrated Cheatsheet.
- Complete index links and updated cross-references.

## Verification / done when

- Every implemented built-in type is represented and links to its detailed
  reference.
- The overview does not replace detailed type docs or claim an undocumented
  type behavior.
- Cheatsheet heading/link validation succeeds after generated TOCs are refreshed.
- Collection links, nav ordering, descriptions, and old/new routes build cleanly.

## Delegation

Cheatsheet link audit can be delegated read-only. Keep overview, collection
configuration, and route edits with one owner because they affect site-wide nav.
