# Step 02 — Approve Information Architecture and Route Map

## Session goal

Turn the proposed information architecture into an explicit, approved
collection/page/nav schema and canonical URL map before creating parallel site
structure. This completes the decision gate in `spc/SmarkForm_docs_refact.md`
§§5 and 9.

## Dependencies

- Step 01's inventories, ledgers, and open questions.
- Maintainer review is required before proceeding with structural migration.

## Work

1. Review the proposed audience paths and collection tree in the refactoring
   spec. Confirm section names, hierarchy, nav order, page grouping, and which
   pages are new versus moved/renamed.
2. Decide whether **When SmarkForm Fits** belongs in About and approve its
   neutral scope, evidence requirements, and comparison destination.
3. Settle final permalinks for every user-facing page, including the homepage,
   candidate final Showcase, Start Here installation pages, Using SmarkForm,
   Guides, Accessibility, Component Reference, Advanced Concepts, audience
   resources, and community pages.
4. For each old public permalink that changes, choose retain, redirect/alias,
   or a documented reason no redirect is practical. Check explicit front matter
   rather than inferring URLs from filenames.
5. Decide names and `nav_order` values for new Jekyll collections and pages.
   Account for root pages and non-reader-facing technical material separately.
6. Approve whether any source-content decision from Step 01 is deferred. Do not
   resolve deferrals by omitting the material during the later move.
7. Publish the signed-off schema/route map in the project planning artifact or
   update this step's companion ledger, with the maintainer decision recorded.

## Required references

- `spc/SmarkForm_docs_refact.md` §§4–5, §7 Stage 0, and §9.
- Step 01 content and URL inventories.
- `docs/_config.yml` and the current source page front matter.
- Existing inbound links and the generated sitemap conventions in `AGENTS.md`.

## Deliverables

- An approved collection, page, and navigation schema.
- An approved canonical permalink map plus explicit old-URL decisions.
- A short list of any remaining deferrals and who must resolve them.

## Verification / done when

- Every reader-facing source and planned destination has exactly one intended
  final route and collection.
- There are no unreviewed duplicate route assumptions or unresolved collisions.
- The maintainer has approved the taxonomy and route/redirect policy. Do not
  begin Step 03 until this gate is satisfied.

## Delegation

Use one decision owner. Read-only link/route inventory can be delegated, but
collection names, canonical URLs, and redirects require maintainer approval and
must not be parallelized into competing proposals.
