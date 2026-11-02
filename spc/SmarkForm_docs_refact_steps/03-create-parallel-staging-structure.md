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
2. Rename/copy only reader-facing collections/pages to the agreed temporary
   `old_` namespace. Keep `_includes`, `_layouts`, assets, site tooling, and
   technical/presentation sources outside the archive operation.
3. Handle `docs/index.md` specially: preserve its complete source as a legacy
   page and create the new canonical root page; ensure only the new one owns `/`.
4. Register old and new collections in `docs/_config.yml` and
   `just_the_docs.collections`, with the agreed names/nav order. Add new page
   stubs with approved final permalinks; give every old page a unique temporary
   permalink.
5. Implement the approved old-URL aliases for relocated pages. Under the
   selected clean-route policy, add the approved redirect plugin to the docs
   bundle/config and `redirect_from` entries to canonical pages. Redirect
   outputs must occupy old public URLs; staging copies belong only under the
   separate `/old/...` namespace. Keep aliases distinct from staging permalinks.
6. Add the temporary legacy nav section after the new nav. Keep archive pages
   out of the sitemap and add `noindex` if the branch preview can be public.
7. Update links and navigation needed for the two structures to coexist. Use
   the approved old-to-new map; legacy links may deliberately stay within the
   legacy tree where that preserves its reading path.
8. Add paired source/destination migration markers at safe boundaries and
   initialize the authoritative locator-to-destination ledger. Mark deliberately
   unported material with its recorded decision; comments never replace the
   ledger.

## Required references

- `spc/SmarkForm_docs_refact.md` §4, “Temporary `old_` staging and URL
  migration,” Stage 1, and Step 02's approved route map.
- `docs/_config.yml`, `docs/Gemfile`, `docs/Gemfile.lock`, page front matter,
  `docs/robots.txt`, sitemap settings, `scripts/collect-docs-examples.js`.
- `AGENTS/Documentation-Guidelines.md` for front matter and page structure.

## Deliverables

- New collection/nav structure with page stubs at final routes.
- Complete temporary legacy tree with unique routes.
- Tested redirect aliases from old public URLs to new clean canonical routes.
- Migration markers and ledger initialized for every moved source locator.

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
