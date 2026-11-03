# Step 18 — Resource and Community Transfer Map

**Status:** Reader-facing resources live in their approved audience collections;
there is no `resources` reader collection in `docs/_config.yml`. The
`old_resources` collection remains temporary staging until Step 19, while
`/resources/dist/` remains a stable static download-asset route (not a
navigation section). The protected Contact page is unchanged.

## Resource destination audit

| Source / canonical destination | Step 18 disposition |
|---|---|
| `_getting_started/getting_smarkform.md` → `docs/_start_here/getting_smarkform.md` | Reworked the stale installation overview into a concise choice of CDN, npm, downloaded bundles, or source checkout. Removed the obsolete 0.5.1 script listing and unsupported CommonJS/AMD remote-URL examples. Links point to the dedicated CDN/Download guides and Quick Start. The approved route remains `/start_here/getting_smarkform`. |
| `_resources/CDN.md` → `docs/_start_here/cdn.md` | Finalized pinned-current versus unpinned-latest ESM/UMD URLs, stylesheet CDN links, and cross-links to the installation and download pages. Corrected the prior typo-driven link to Getting SmarkForm. Kept `/resources/CDN` as the redirect alias. |
| `_resources/download.md` → `docs/_start_here/download.md` | Finalized ESM/UMD, CSS, older releases, and boilerplate guidance. The stable static downloads stay at `/resources/dist/`; clarified that this is an asset URL space, not a reader-facing Resources section. Kept `/resources/download` as the redirect alias. |
| `_resources/examples.md` → `docs/_showcase_examples/examples.md` | Finalized the nine-item selector. `docs/_data/examples.csv` entries now match source example titles/descriptions. Selector values are already root/baseurl URLs, so the iframe, fullscreen, download, and source tabs now use the value directly instead of prefixing `.` and resolving from the Examples page directory. Kept `/resources/examples` as the redirect alias. |
| `_resources/playground.md` → `docs/_showcase_examples/playground.md` | Step 17 had finalized the two calculator examples and their source/test behavior. Step 18 removed the remaining migration/noindex metadata; `/resources/playground` remains an alias. |
| `_resources/ai-agents.md` → `docs/_ai_agents/resources.md` | Finalized the index to the current Forms/Usage references and both installable skill formats; links use the canonical `/ai_agents/...` routes. Removed staging/noindex metadata. |
| `_resources/AGENTS/SmarkForm-Forms.md` → `docs/_ai_agents/smarkform_forms.md` | Retained the implementation-focused reference, current root-relative and CDN examples, nav exclusion, and `/resources/AGENTS/SmarkForm-Forms` redirect. Clarified UMD as a browser-global script and npm as an ESM bundler import; removed the unsupported Node CommonJS UMD `require()` snippet. Removed migration/sitemap suppression so the direct canonical URL is indexable and linked from the AI resources page. |
| `_resources/AGENTS/SmarkForm-Usage.md` → `docs/_ai_agents/smarkform_usage.md` | Retained the internals/use-pattern reference and Step 07/13 behavior corrections; kept it nav-excluded, indexable, and linked from the AI resources page. Retained `/resources/AGENTS/SmarkForm-Usage` redirect. Updated the root `AGENTS/SmarkForm-Usage.md` repository tree to show `resources/dist`, `_showcase_examples/.example_sources`, and `_ai_agents` separately. |
| `_resources/cheatsheet.md` → `docs/_component_reference/cheatsheet.md` | Already finalized in Step 12 and updated in Step 13; retained as the indexable Component Reference quick lookup with `/resources/cheatsheet` redirect. |
| `_resources/user_guide.md` → `docs/_for_end_users/user_guide.md` | Already finalized in Step 11; retained in the separate For End Users collection with `/resources/user_guide` redirect. |

The Home-page links, header navigation, CDN aux link, Examples/Showcase links,
FAQ references, and agent/skills links now point to canonical audience routes.
The `src/examples/include/credits.pug` source now links to the Downloadable
Examples route; the Pages workflow rebuilds those generated example files. Old
`/resources/...` links inside staged `_old_*` pages remain untouched; redirect
aliases continue to serve those historical routes while the staging collections
remain present.

## Community pages and protected Contact

| Page | Route/nav status | Step 18 action |
|---|---|---|
| Support | `/community/support`, `nav_order:1` | Kept in Community; made the About FAQ link use `relative_url` so it respects the configured baseurl. |
| Contributing | `/community/contributing`, `nav_order:2` | Kept in Community; repository contribution links remain current. |
| License | `/community/license`, `nav_order:3` | Kept in Community at its approved route. |
| Contact | `/community/contact`, `nav_order:4` | **No edit.** SHA-256 is unchanged: `7eb3bda53f6d5c3db6c73a3be90002492cafee857e05ee9a2acccf26441d1590`. |
| Branding | `/community/branding`, `nav_order:5` | Kept in Community; links to the canonical User Guide route. |
| Build in Public | `/community/build-in-public`, `nav_order:6` | Kept in Community at its approved route. |

The collection/nav order matches the Step 02 approved route map. No Community
page moved out of its audience collection; Contact's content, front matter,
permalink, and nav order were not touched.

## Static assets, examples, and automation

* `/resources/dist/` remains a static-asset path used by downloadable ESM/UMD,
  example styles, the boilerplate, and SmarkForm preview iframes. It is not a
  Jekyll collection or a nav section.
* `docs/_data/examples.csv` still contains **all nine intended downloadable
  examples**. Each URL maps to a source build in `dist/examples/`; the blank
  starter template remains on the Download page rather than in the selector.
* Added `scripts/sync_documentation_assets.sh`. The Pages workflow and local
  Jekyll build/serve helpers copy root `dist/` to both `docs/dist/` (selector
  routes) and `docs/resources/dist/` (stable download routes), and copy example
  source extracts to the hidden canonical and staged `.example_sources` paths
  required by `include_relative`. The helper does not rewrite the protected
  `docs/_data/package.json`.
* Root `README.md`, skills, `AGENTS/` mirrors, `docs/_config.yml` aux/external
  links, and the Community sources were checked for relocated `/resources/...`
  links. Remaining public legacy URLs are intentional `redirect_from` entries;
  staged old pages and generated assets are not rewritten as part of this step.
* There is no empty public Resources collection. `old_resources` remains a
  temporary legacy staging collection and is removed with the other `_old_*`
  collections in Step 19.

## Verification

* Reviewed all nine CSV rows against `src/examples/*.pug`; the Pages workflow
  regenerates `dist/examples` before syncing static files.
* Jekyll build passes; canonical examples, CDN/Download, AI & Agents, Playground,
  and Community pages render. Rendered public-link and fragment checks report
  zero broken links/fragments; root README site URLs resolve. The nine selector
  URLs and all five stable download asset paths exist in the built site. All nine
  legacy `/resources/...` aliases build and target their canonical routes; the
  moved pages appear in the sitemap.
* Confirmed `docs/_community/contact.md` remains byte-identical and `/community/contact`
  retains `nav_order:4`.
* Node/npm and Playwright are unavailable in this environment. The source Pug
  examples were not rebuilt and co-located browser tests were not run; the Pages
  workflow rebuilds example HTML before syncing. The Jekyll build verified the
  current selector/source data and static asset paths.
