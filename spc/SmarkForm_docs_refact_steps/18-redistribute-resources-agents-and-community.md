# Step 18 — Redistribute Resources, Agent Material, and Community Pages

**Status:** Resource pages are finalized in their approved audience collections;
the old public route redirects, `/resources/dist/` is retained only for static
assets, and no reader-facing Resources collection remains. Community routes and
nav order are verified; the protected Contact page is byte-identical. See
[`18-resource-and-community-transfer-map.md`](18-resource-and-community-transfer-map.md).

## Session goal

Move remaining resources to their approved audiences/tasks and complete the
reader-facing collection structure without retaining a catch-all Resources
section by default.

## Dependencies

- Steps 01–03 and approved routes.
- Relevant target collections from Steps 08–17 should exist.

## Work

1. Move downloadable examples and Playground to Showcase & Examples; installation
   overview/CDN/Download pages to Start Here; Cheatsheet to Component Reference;
   User Guide to For End Users; AI resources and Forms/Usage references to AI &
   Agents.
2. Move/retain Community pages in their own collection, using the approved
   route/nav map. Preserve contributor, support, contact, license, branding, and
   Build in Public content. **Do not edit `docs/_community/contact.md`**: the
   maintainer has explicitly asked that this page remain unchanged, including
   its content, front matter, permalink, and nav order. Keep its existing route.
3. Audit all links from Home, docs, readme/skills, footer/aux links, and examples
   to relocated pages. Update references in docs `AGENTS/` mirrors where
   affected.
4. Keep technical docs, presentations, source assets, site-maintenance notes,
   includes/layouts, and capture-only Markdown in appropriate source locations;
   they are not ordinary reader-facing collection pages.
5. Re-evaluate whether any remaining coherent resource set truly needs a
   Resources collection. Do not preserve an empty/catch-all section by habit.
6. Update migration markers and ledger for every moved source section/page.

## Required references

- `spc/SmarkForm_docs_refact.md` §§4–5 and the approved route map.
- `docs/_resources/*`, `docs/_community/*`, root `README.md`, skills, site
  includes/config, and `docs/_data/examples.csv`.
- `AGENTS/Documentation-Tracking.md` for later docs-content tracking.

## Deliverables

- Resources distributed into their approved audience collections.
- Community and AI/agent nav/routes and all incoming links updated.
- Complete source-to-destination records.

## Verification / done when

- Every resource page has a clear audience/task destination; no useful file or
  page disappears without a reviewed decision.
- Examples selector still includes all intended downloads and links.
- Header/footer/aux links, skills, agent references, and internal links resolve.
- Page metadata/nav and collection routes build cleanly; no empty catch-all
  collection remains unless explicitly approved.

## Delegation

Read-only link inventory can be delegated by collection. Moves and Jekyll config
changes should be owned by one integrator; keep generated assets and source
infrastructure out of bulk renames.
