# Step 19 — Final Build, Validation, and Staging Cleanup

## Session goal

Close all preservation/link/example checks, remove temporary `old_` staging and
migration scaffolding, then validate the exact publishable documentation tree.

## Dependencies

- Steps 01–18 complete; ledger and maintainer decisions closed.
- Do not begin destructive cleanup until all new pages and routes have passed
  review in the dual-tree build.

## Work

1. Compare original source headings, capture/test IDs, demo values, and unique
   explanations against destinations. Close every ledger entry and document
   reviewed not-retained decisions.
2. Refresh generated chapter TOCs and run cheatsheet validation, docs-example
   collection, route/link/fragment validation against the full rendered `_site`,
   and Jekyll build. Include root pages, collection routes, redirects, images,
   and fragments—not only changed Markdown.
3. Run relevant co-located and full Playwright suites after the new content is
   final. Build the package first where the project workflow requires it. Fix
   failures attributable to the docs edits; report environment blockers clearly.
4. Preview and inspect Home, Quick Start, Using SmarkForm, Core Concepts,
   Showcase, component pages, responsive/mobile layouts, keyboard interactions,
   and sampletab editor behavior.
5. Review the complete diff for omitted content, stale names/claims, temporary
   paths, generated artifacts, unrelated changes, invalid front matter, missing
   descriptions, and links that still point at the legacy tree.
6. Remove every temporary legacy page/collection, old navigation section,
   migration comment, staging config, temporary permalink, `noindex`/sitemap
   staging rule, and staging-only reference. Do not remove redirects explicitly
   approved for changed old public URLs.
7. Rebuild and rerun route/link checks after deletion. Inspect final nav and
   sitemap to prove no staging path ships. Update gitignored `UPDATED_DOCS.md`
   by affected page and update `AGENTS.md` if guidance/automation changed.

## Required references

- `spc/SmarkForm_docs_refact.md` §§4 “Temporary old staging,” 7 Stage 6, and 8
  acceptance criteria.
- `AGENTS.md` Playwright/collector/TOC/Jekyll sections;
  `AGENTS/Documentation-Tracking.md`.
- `package.json`, `playwright.config.js`, `scripts/collect-docs-examples.js`,
  `scripts/generate-chaptertocs.js`, `scripts/validate-cheatsheet.js`, and
  rendered `_site`.

## Deliverables

- Final publishable docs tree with temporary scaffolding removed.
- Closed content/Showcase ledgers and a concise validation report.
- Updated ignored documentation tracker and any necessary agent guidance.

## Verification / done when

- Jekyll build, generated TOC validation, cheatsheet validation, complete
  internal route/link/fragment checks, collector, and relevant Playwright tests
  pass (or any blocker is explicitly reported to the maintainer).
- All original substantial content has a retained/replaced destination or an
  approved explicit disposition.
- Sampletabs remain runnable, tests are present, and final mobile/keyboard
  preview is manually inspected.
- No temporary legacy source, collection, route, marker, nav item, sitemap
  entry, or staging config remains; approved public redirects still work.
- All acceptance criteria in SPC §8 are checked against the final rendered site.

## Delegation

Independent final checks (link crawl, capture-ID comparison, claim review) can
be delegated read-only. Do not delegate deletion of the legacy tree. The primary
agent must close the ledger, perform the cleanup, rerun the full checks on the
post-cleanup site, and report exact commands/results.
