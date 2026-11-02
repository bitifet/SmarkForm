# Step 03 — Create Parallel Staging Structure

## Session goal

Create the approved new site skeleton alongside complete temporary `old_`
copies, so reviewers can compare both architectures without losing the current
site. This is Stage 1 in `spc/SmarkForm_docs_refact.md`.

## Dependencies

- Steps 01 and 02 are complete; the route map is approved.
- Do not move substantive content yet beyond what is required to establish the
  route skeleton and preserve the legacy source.

## Work

1. Snapshot the current worktree again and preserve unrelated user edits. Never
   blanket-reset, delete, or overwrite files to make the migration easier.
2. Preserve a complete temporary `old_` copy of each reader-facing page being
   moved or substantively revised, and place a baseline copy at its approved
   canonical destination. This keeps both reading trees usable and gives later
   sessions an exact comparison source. Pages that remain in an unchanged
   collection can stay shared; update their links only where the approved route
   map requires it. Create stubs only for genuinely new pages. Keep `_includes`,
   `_layouts`, assets, site tooling, and technical/presentation sources outside
   the archive operation. Keep the Community collection/routes unchanged and do
   not edit `docs/_community/contact.md`.
3. Handle `docs/index.md` specially: preserve its complete source as a legacy
   page and create the new canonical root page; ensure only the new one owns `/`.
4. Register old and new collections in `docs/_config.yml` and
   `just_the_docs.collections`, with the agreed names/nav order. Add new page
   stubs with approved final permalinks; give every old page a unique temporary
   permalink. Keep the stable `/resources/dist/` download URLs by copying
   generated bundles into a static `docs/resources/dist/` directory; do not
   retain a reader-facing Resources collection just to host build artifacts.
5. Implement the approved old-URL aliases for relocated pages. Under the
   selected clean-route policy, add the approved redirect plugin to the docs
   bundle/config and `redirect_from` entries to canonical pages. Redirect
   outputs must occupy old public URLs; staging copies belong only under the
   separate `/old/...` namespace. Keep aliases distinct from staging permalinks.
6. Add unique generated chapter-TOC include slugs for old copies so they cannot
   collide with canonical pages. Preserve `docs/_resources/examples.capture.md`
   as the original source helper and place identical support copies beside the
   old and new Examples pages: Jekyll `include_relative` rejects `..` traversal,
   so each page must include a same-directory copy. Point each capture at
   generated hidden support files under that page's
   `.example_sources/dist/examples/` directory; hidden assets must not become
   public routes or sitemap entries.
7. Add the temporary legacy nav sections after the new nav. Keep archive pages
   out of the sitemap and add a tested `noindex` rule for `/old/` routes.
8. Update links and navigation needed for the two structures to coexist using
   the approved old-to-new map. Active canonical docs, `docs/404.html`,
   `docs/llms.txt`, nav/aux links, and the cheatsheet validator should point to
   canonical routes. Legacy links may deliberately stay within the legacy tree
   or point to current answers; redirect aliases must keep either choice
   resolvable.
9. Update generated-file plumbing for the new example source directory:
   `rollup.config.js`, `.gitignore`, `test/dist_sync.tests.js`, and
   `.github/workflows/pages.yml` must keep distribution copies, ignored outputs,
   and synchronization checks consistent. Update `scripts/validate-cheatsheet.js`
   to the approved Component Reference source path/TOC slug.
10. Add paired migration markers for clear one-to-one page copies and update the
    authoritative locator-to-destination ledger. For pages that will be split
    (Quick Start, Introduction, Core Concepts) or the legacy Showcase, do not
    imply complete transfer with a page-level marker; add precise section/capture
    markers in the later content sessions after destinations are verified.
    Markers never replace the ledger.

## Required references

- `spc/SmarkForm_docs_refact.md` §4, “Temporary `old_` staging and URL
  migration,” Stage 1, and Step 02's approved route map.
- `docs/_config.yml`, `docs/Gemfile`, `docs/Gemfile.lock`, page front matter,
  `docs/robots.txt`, sitemap settings, `scripts/collect-docs-examples.js`.
- `docs/_showcase_examples/examples.md`,
  `docs/_old_resources/old_examples.md`, shared
  `docs/_resources/examples.capture.md` and their same-directory support copies,
  `scripts/validate-cheatsheet.js`, root `README.md`, and `docs/llms.txt` for
  route-dependent references.
- `AGENTS/Documentation-Guidelines.md` for front matter and page structure.

## Deliverables

- New collection/nav structure with baseline content at moved routes and stubs
  only for genuinely new pages.
- Complete temporary legacy tree with unique routes.
- Tested redirect aliases from old public URLs to new clean canonical routes.
- Temporary-page `noindex`/sitemap behavior and unique old chapter-TOC slugs.
- Updated build/copy/ignore/test/validator paths for moved example assets and
  Cheatsheet.
- Migration markers and ledger initialized for every moved source locator.
- The authoritative locator ledger is `03-source-destination-ledger.md`; it
  records the 57 source pages, all inventoried H2–H4 locators, 131 sampletab
  includes, and 376 capture declarations as staged/pending rather than falsely
  marking baseline copies as completed ports.

## Verification / done when

- `bundle exec jekyll build` succeeds with both structures present.
- Every output route is unique; the homepage resolves only once.
- Each old public permalink redirects to the correct canonical page and does not
  conflict with a staging page; redirect outputs behave as intended in the local
  Jekyll and GitHub Pages build workflows.
- Internal nav and links used by both trees resolve; legacy output is not in the
  sitemap and is not indexable if publicly exposed. Verify redirect pages are
  not treated as duplicate canonical content in the sitemap.
- All source content remains present and all temporary routes are visibly
  staging-only. No TOC generated artifacts are committed.

## Delegation

Do not parallelize renaming/config changes. If the tree is large, a read-only
agent may check route uniqueness or compare source/destination filenames after
the structure is created; the primary agent owns all moves and ledger updates.
