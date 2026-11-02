# Step 04 — Claim Evidence and Caveats

This note records the evidence used for the Home, Introduction, **When SmarkForm
Fits**, Features, FAQ, and Roadmap claims. It is a review aid, not public
documentation. Re-check the cited files when behavior or build artifacts change.

## Product claims

| Claim | Evidence | Caveat / wording used |
|---|---|---|
| SmarkForm turns annotated HTML into a component tree whose fields, nested forms, and lists import/export objects and arrays. | `src/lib/component.js` (component construction and tree), `src/types/form.type.js` (object export/import), `src/types/list.type.js` (array export/import), `src/types/input.type.js` (scalar values). | Describes the model, not a schema renderer or a framework adapter. |
| The authored HTML/CSS stays in place. | Enhancement walks existing DOM (`src/lib/component.js`); no required stylesheet or layout is injected. | Authors still own semantics, labels, focus behavior, visual design, and responsive layout. |
| `data-smark` marks components; type/name can often be inferred. | `src/lib/component.js` (`inferType`, option parsing), `docs/_start_here/core_concepts.md`. | The JSON form is still needed for explicit/structured options. |
| Named fields become object properties; lists become arrays; forms/lists nest. | `src/types/form.type.js`, `src/types/list.type.js`, `src/types/list.decorators/*`; co-located examples. | Empty values and `export_empties` affect the exact exported shape; the docs link to value-coercion and import/export pages rather than overpromising. |
| SmarkForm does not render a schema or replace the application. | Project scope and public API (`src/main.js`); no schema/render layer in `src/`. | The comparison page explicitly says a schema-rendered library may fit better when the UI must be generated. |
| No runtime dependencies. | `package.json` has no `dependencies` or `peerDependencies`; bundle inputs are the project sources. | Build-time devDependencies are not runtime dependencies. |
| ESM and UMD builds. | `rollup.config.js` outputs `dist/SmarkForm.esm.js` and `dist/SmarkForm.umd.js`. | Feature selection/tree-shaking and server compression change the transferred size. |
| Measured bundle snapshot: about 109 KB minified, roughly 30 KB gzip. | `dist/SmarkForm.umd.js` = 112,302 bytes; `gzip -c` = 30,954 bytes; `docs/_data/computed.json` `bundleSizeKB` = 109. | Stated as a snapshot for version 0.25.0's UMD artifact, not a guarantee for every build or format. |
| Tested across Chromium, Firefox, WebKit, and mobile emulation. | `playwright.config.js` projects: `chromium`, `firefox`, `webkit`, `chromium-mobile`, `safari-mobile`. | Automated coverage is not a support guarantee or an accessibility certification. |
| Stable but pre-1.0; public API may evolve. | `package.json` version `0.25.0`; FAQ stability answer; changelog. | Implemented behavior is tested, but the project does not promise a frozen API before 1.0.0. |

## Capability claims

| Claim | Evidence | Caveat / wording used |
|---|---|---|
| Lists grow/shrink, enforce `min_items`/`max_items`, and support `sortable`. | `src/types/list.type.js`, `src/types/list.decorators/sortable.deco.js`, `docs/_component_reference/list.md`. | Sorting is **manual drag-and-drop**; automatic sorting by field value is not implemented. |
| `addItem`/`removeItem` triggers are automatically enabled/disabled at list bounds. | `src/types/list.decorators/smartdisabling.deco.js` (`updateTriggers`). | This applies to list add/remove triggers; the page explicitly says other actions keep their authored enabled state. |
| Actions use context and paths, not DOM selectors. | `src/lib/component.js` (path/context resolution), `docs/_guides/form_traversing.md`, `docs/_component_reference/trigger.md`. | The fuller action/context/target explanation is Step 07's canonical work; Step 04 links to the existing pages. |
| `Enter`/`Shift+Enter` navigation and context-aware hotkeys. | `src/lib/component.js` keyboard handling; `docs/_accessibility/keyboard_navigation.md`, `docs/_accessibility/hotkeys.md`. | Authors still own focus order, focus visibility, and custom interactions. |
| List changes are announced through `aria-live`. | `src/types/list.type.js` sets `aria-live="polite"` and `aria-atomic="true"` on the list target. | It does not make arbitrary list markup accessible. |
| Label wiring preserves authored `aria-labelledby`. | `src/types/label.type.js` (label target/labelled field handling). | Does not replace semantic labels or author-provided names. |
| `aria-busy` is set while the root renders. | `src/main.js` sets `aria-busy="true"` / `"false"` during initialization. | Rendering is asynchronous; the page does not claim a specific timing. |
| Custom component types can be registered with `SmarkForm.createType`. | `src/main.js` exports `SmarkForm.createType = createType`; `src/lib/component.js` `createType`. | Step 04 mentions the API without inventing a standalone custom-types page. |
| Mixin types, field masking, media fields. | `src/lib/mixin.js`, `src/types/file.type.js`, `image.type.js`, `video.type.js`, `audio.type.js`, `docs/_guides/*`. | Media acquire/import behavior and layout responsibilities are documented on their canonical pages. |
| No built-in validation rule engine or official framework adapter. | No validation/adapter module in `src/`; FAQ framework answer; project scope. | Native constraints, hooks, application checks, and server-side validation remain the application's responsibility. |

## Comparison-page caveats

The Event Planner comparison moved from `_about/introduction.md` to
`_about/when_smarkform_fits.md`. Changes made during the move:

* The opening now states that the comparison is **illustrative, not a
  benchmark**.
* Dependency rows no longer assert unverified React/Vue gzip sizes.
* A measured SmarkForm artifact note was added, scoped to version 0.25.0's UMD
  build and the build used for this page.
* The implementation-time paragraph now states that the figures are rough,
  retrospective, method-free Copilot estimates and must not be extrapolated.
* New sections list what the comparison does **not** measure (performance,
  accessibility conformance, security, ecosystem, team factors) and what the
  application still owns.
* Code-line and timing tables are retained as illustrative data; they are not
  presented as reproducible measurements.

## Follow-up ownership

* Step 07 owns the canonical action/context/target/path explanation.
* Steps 08–13 own the detailed component-reference, guide, and accessibility
  re-review.
* Step 17 owns the final Showcase mapping and any old fragment-anchor recovery.
* Step 19 owns removal of staging markers, legacy collections, and temporary
  `sitemap: false` flags.
