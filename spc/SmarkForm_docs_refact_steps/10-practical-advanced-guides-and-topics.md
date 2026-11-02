# Step 10 — Practical Advanced Guides and Topic Moves

## Session goal

Move Events, Mixin Types, Singleton Pattern, and Animations into Guides, while
retaining the constructor, security, and error references in Advanced Concepts.

## Dependencies

- Steps 01–03 and approved page/collection routes.
- Step 07's action/context/target explanation and Step 09's task-guide moves.

## Work

1. Move Events, Mixin Types, The Singleton Pattern, and Animations to their
   approved Guides routes. Preserve full technical depth; these are practical
   developer tools, not disposable advanced material.
2. Keep The SmarkForm Constructor, Security Considerations, and Error Codes in
   Advanced Concepts. Update prerequisite links and navigation descriptions.
3. Keep API Interface visibly labeled planned/not implemented unless current
   implementation is verified. Do not imply API metadata or code generation.
4. Reconcile event/action lifecycle text with Step 07 and the task guides. Use
   links rather than copying complete event or mixin references into tutorials.
5. Preserve all unique code captures/tests, security details, mixin policy
   caveats, style/script limitations, singleton behavior, and animation
   controls. Verify each claim against specs/source/tests.
6. Update FAQ, type pages, cheatsheet, skill/agent references, old/new nav, and
   migration markers. Close ledger entries only after inspecting destinations.

## Required references

- `spc/SmarkForm_docs_refact.md` §§4–5 and proposed Guides/Advanced Concepts.
- Current `docs/_advanced_concepts/events.md`, `mixin_types.md`,
  `the_singleton_pattern.md`, `animations.md`, constructor, security, and error
  pages.
- `spc/mixins.md`, media/animation specs, source, and tests.
- `AGENTS/Documentation-Guidelines.md`, `AGENTS/Documentation-Examples.md`.

## Deliverables

- Four practical topic guides and the retained Advanced Concepts pages at final
  routes.
- Updated links/nav and source/destination ledger entries.

## Verification / done when

- All moved pages preserve unique detail and runnable/tested examples.
- Security, mixin, event, singleton, and animation statements match source/specs.
- API Interface is accurately marked as planned if still unimplemented.
- Routes, TOCs, front matter, links, and examples pass structural checks.

## Delegation

Read-only fact checks by topic (for example, mixin policy or event lifecycle) are
appropriate. Do not parallelize edits within a page; one integrator owns links,
navigation, and ledger closure.
