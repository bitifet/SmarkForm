# Step 19 — Final Validation and Staging Cleanup Transfer Map

**Status:** Final cleanup is complete. The temporary `old_*` source collections,
their route/navigation configuration, paired migration comments, and the
in-progress Showcase controls were removed. Approved public redirects remain.
The former source locators in `03-source-destination-ledger.md` and the Step
transfer maps are historical audit records, not live file paths.

## Preservation and cleanup record

* Before deletion, compared the old FAQ and canonical FAQ headings, samples, and
  capture bodies. The four sample IDs and seven capture declarations match;
  all capture bodies are identical. Seven detailed fit-environment subheadings
  were consolidated into the current concise fit summary and link to the fuller
  `When SmarkForm Fits` page; the rationale is recorded in the Step 03 FAQ rows.
* Verified the two Showcase inventories before cleanup: 20 legacy sample IDs,
  73 captures, six custom test captures; and four candidate sample IDs, 17
  original captures. Step 17's map accounts for each transfer, adaptation, or
  reviewed not-retained decision. The final candidate retains the four IDs and
  all 17 source capture names.
* Removed **52 tracked legacy Markdown files** from seven temporary collections:
  `_old_home` (1), `_old_about` (7), `_old_getting_started` (4),
  `_old_component_types` (16), `_old_working_with_forms` (7),
  `_old_advanced_concepts` (7), and `_old_resources` (10).
* Removed the seven `old_*` collection and Just-the-Docs navigation entries,
  stale generated `chaptertoc/old_*.html` includes, and the ignored staged
  `_old_resources/.example_sources` build copies. Canonical
  `docs/_showcase_examples/.example_sources` remains build-generated for the
  downloadable Examples source tabs.
* Removed paired `BEGIN old PORTED TO` / `END old PORTED TO` comments from
  canonical documentation, `migration_in_progress` metadata from the final
  Showcase, and the `/old/` / migration-marker noindex rule. The internal
  Examples capture helper retains an explicit `noindex`, `sitemap: false`,
  `nav_exclude`, and `search_exclude` because it is build infrastructure, not a
  reader page. The 404 remains noindex.
* Kept the original `docs/_resources/examples.capture.md` helper as source
  infrastructure and the canonical same-directory helper beside Examples;
  neither is a Resources collection page. `/resources/dist/` remains the stable
  static download URL space and is populated by the asset-sync helper.
* Contact is unchanged: SHA-256
  `7eb3bda53f6d5c3db6c73a3be90002492cafee857e05ee9a2acccf26441d1590`, route
  `/community/contact`, and `nav_order: 4`. The pre-existing
  `docs/_data/package.json` modification was not touched or staged.

## Redirect and route verification

* Retained aliases for the approved old public URLs: moved Getting Started,
  Component Types, Working with Forms, Advanced Concepts, Resources, and
  `/about/showcase`/`/about/showcase2`. No `/old/` URL is retained as a redirect.
* The Examples, Playground, Start Here, AI & Agents, Community, Component
  Reference, Guides, Accessibility, About, and Showcase canonical routes build.
* The generated sitemap includes the final Showcase and all moved indexable
  resource/agent pages; it contains no `/old/` route or old collection output.
  Internal capture infrastructure remains excluded intentionally.
* Rendered public-link/fragment checks report **zero broken links or fragments**;
  every root README site URL resolves. Every retained old public alias builds
  and targets its canonical route.
* The Examples selector contains nine CSV entries; each output file is present
  at `/dist/examples/`. The ESM/UMD bundles, example CSS, and boilerplate exist
  at the stable `/resources/dist/` URLs. The selector uses site-root URLs, and
  `sync_documentation_assets.sh` populates both asset spaces and hidden source
  extracts from root `dist/`.
* Contact and package-data protection were checked again after cleanup; only the
  pre-existing `docs/_data/package.json` diff remains outside the Step 19 stage.

## Tests and environment limits

* Jekyll build passes with the final tree. Shell syntax checks pass for
  `scripts/sync_documentation_assets.sh`, `scripts/build_documentation_site.sh`,
  and `scripts/liveserve_documentation_site.sh`; `git diff --check` passes.
* Node/npm are unavailable, so the chapter-TOC generator, cheatsheet validator,
  docs-example collector, package/Pug rebuild, and Playwright/co-located browser
  suites could not run. The Pages workflow rebuilds package/example assets before
  syncing them. The generated Getting SmarkForm TOC was refreshed locally; the
  remaining source-derived TOCs are unchanged. Browser/editor/mobile previews
  were not manually inspected.
* The pre-existing `docs/_data/package.json` change remains unstaged and
  untouched. No push was performed.
