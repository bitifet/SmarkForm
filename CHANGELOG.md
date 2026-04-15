# Changelog

All notable changes to this project will be documented in this file.

This changelog was generated from [GitHub Releases](https://github.com/bitifet/SmarkForm/releases)
and associated tags. The project is currently pre-1.0.0; note-keeping policy and formatting
conventions may change when 1.0.0 is reached. Older release history will be archived into
`docs/changelog-archive/*.md` at that point.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.16.0] — 2026-04-14

🔒 Secure-by-default mixin & JSON options · 🖼️ Framework comparison page · 🎯 Drag-handle improvements · 🔑 Shift+Space in `<summary>` inputs · 📦 npm distribution fix.

SmarkForm 0.16.0 ships a hardened security posture for mixin and JSON-encoding features (all disabled by default), introduces a brand-new "A Picture is Worth a Thousand Words" framework comparison page with live React and Vue side-by-side demos, improves drag handles for sortable lists, and fixes Shift+Space fold/unfold inside `<summary>` inputs.

### Security

- **`allowExternalMixins`** (`"block"` | `"same-origin"` | `"allow"`, default `"block"`):
  Mixin type references that point to an external URL are now blocked by default.
  Set to `"same-origin"` to allow same-origin templates, or `"allow"` to allow
  cross-origin templates.  Blocked fetches throw `MIXIN_EXTERNAL_FETCH_BLOCKED`
  (or `MIXIN_CROSS_ORIGIN_FETCH_BLOCKED` for `"same-origin"` mode + cross-origin URL).

- **`allowLocalMixinScripts`** (`"block"` | `"noscript"` | `"allow"`, default `"block"`):
  `<script>` elements inside local (`#id`) mixin templates are blocked by default.
  Set to `"allow"` to execute them, or `"noscript"` to silently discard them
  (render the mixin without scripts).  Blocked scripts throw `MIXIN_SCRIPT_LOCAL_BLOCKED`.

- **`allowSameOriginMixinScripts`** (`"block"` | `"noscript"` | `"allow"`, default `"block"`):
  Same policy control for same-origin external mixin templates (`MIXIN_SCRIPT_SAME_ORIGIN_BLOCKED`).

- **`allowCrossOriginMixinScripts`** (`"block"` | `"noscript"` | `"allow"`, default `"block"`):
  Same policy control for cross-origin external mixin templates (`MIXIN_SCRIPT_CROSS_ORIGIN_BLOCKED`).

- **Security options are now root-only** (privilege escalation fix):
  All four mixin security options (`allowExternalMixins`, `allowLocalMixinScripts`,
  `allowSameOriginMixinScripts`, `allowCrossOriginMixinScripts`) are now read
  exclusively from the root SmarkForm instance options.  Previously they used
  `inheritedOption`, which walked the full component chain and could allow a
  malicious external mixin template to set escalated permissions on its own
  `data-smark` attribute and have them take effect for its descendants.  With this
  fix, only the JavaScript-side root constructor options are honoured — HTML markup
  cannot override them.  **This is a breaking change** if any non-root component
  relied on overriding security options via `data-smark`.

- **`enableJsonEncoding`** (`boolean`, default `false`):
  The `enctype="application/json"` submit path (which sends form data via `fetch()`) is
  now **disabled by default**.  Set `enableJsonEncoding: true` on the root SmarkForm
  instance to re-enable it.  Attempting JSON-encoded submission without the flag throws a
  clear error pointing to this option.

### Features

- **Sortable list drag handles**: SmarkForm `label` elements are now used as dedicated drag handles for sortable lists, preventing accidental drag initiation when selecting text inside inputs.
- **Shift+Space fold/unfold inside `<summary>`**: Correctly toggles collapsible `<details>` sections when focus is on an input hosted inside a `<summary>`, with focus restored after folding.

### Bug Fixes

- Corrected error code typo: `LIST_ITEM_TYPE_MISSMATCH` → `LIST_ITEM_TYPE_MISMATCH`
  (the previous spelling had a doubled S).  The updated code string is now consistent
  with all other `*_MISMATCH` error codes in the library.  **This is a breaking change**
  for any code that catches this specific error code by string comparison.
- Fixed Shift+Space toggle in React and Vue framework demos (mirrors SmarkForm behaviour).

### Distribution

- **npm `files` allowlist**: Narrowed `files` in `package.json` to only the four
  production bundle files (`dist/SmarkForm.{esm,umd}.js` + source maps), so
  `dist/examples/**` is no longer included in the npm tarball.

### Tests

- Added security-option tests to `test/mixin_types.tests.js` covering all four mixin
  security options and all associated error codes.
- Added `enableJsonEncoding` tests to `test/type_form_submit.tests.js`:
  - Blocked-by-default case (new test).
  - Existing JSON-encoding tests updated to opt in with `enableJsonEncoding: true`.
- Added `dist_sync.tests.js`: verifies that `dist/` and `docs/_resources/dist` are
  byte-for-byte identical (guards against stale download files on the docs site).

### Documentation

- **New "A Picture is Worth a Thousand Words" comparison page** (`docs/_about/in_pictures.md`):
  Live side-by-side demos of the same event-planner form implemented in SmarkForm, React,
  and Vue — including Enter/Shift+Enter navigation, Space toggle, Ctrl-hold hotkey reveal,
  and Ctrl+=/Ctrl+- shortcuts — with a comparison table of JS line counts and features.
- New `doctabs` component: a lightweight two-tab Source+Preview component for full HTML
  document examples, using a sandboxed iframe and lazy tab activation.
- `docs/_advanced_concepts/mixin_types.md`: new "Mixin Security Options" section with
  option reference table, error code table, and `smarkformOptions` playground parameter.
- `docs/_about/faq.md`: new FAQ entries for all four mixin security options and
  `enableJsonEncoding`; updated JSON submission examples to include the opt-in requirement;
  added new Q&A on API stability and versioning policy (0.x.y, tilde-range recommendation,
  invitation to production users to get in touch).
- `docs/_component_types/type_form.md`: added `enableJsonEncoding` warning to the
  JSON encoding section of the `submit` action docs.
- `docs/_advanced_concepts/security_considerations.md`: new dedicated **Security
  Considerations** chapter summarising all secure-by-default options, the rationale
  behind each restriction, and guidance on enabling features safely.  Updated to include
  a "Security Options are Root-Only" section explaining the privilege-escalation fix.
- `docs/_advanced_concepts/error_codes.md`: new **Error Codes Reference** chapter with
  a full catalogue of all SmarkForm error codes, descriptions, and fix guidance.  Sections
  reordered to Core → Form → List → Fields → Input → Label → Mixin Types → Native Type
  Parsing Errors.
- `AGENTS/Documentation-Guidelines.md`: added naming convention — use `myForm` (not `el`)
  as the variable name in all JS code examples throughout the documentation.
- `test/doc/WRITING_TESTS.md`: documented the new `smarkformOptions` include parameter.
- Docs CDN: example CSS files now served from `cdn.jsdelivr.net/gh/bitifet/SmarkForm` (GitHub CDN) instead of jsDelivr npm CDN, so the latest styles are always available without a new npm publish.
- CSS style standardisation: hotkey badge and animation styles unified across showcase, quick-start, FAQ, and index pages.

> **⚠️ Breaking change policy (0.x.y):** SmarkForm is in early development.
> Breaking changes may occur in any minor release (`0.x.0`).  Patch releases
> (`0.x.y+1`) are always safe.  Pin to `~0.x.y` in npm to receive bug fixes
> only.  See the new FAQ entry *"Is SmarkForm's API stable?"* for details.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.16.0)

---

## [0.15.0] — 2026-04-08

🗑️ Remove `foldable` decorator · 🌿 Native `<details>`/`<summary>` collapsible sections · ⌨️ Rich keyboard navigation for collapsible fields · 🐛 Multiple UX fixes.

SmarkForm 0.15.0 bids farewell to the early `foldable` decorator — a layout-oriented feature that never quite fit SmarkForm's philosophy — and replaces it with something better: first-class support for the native HTML `<details>`/`<summary>` elements. This gives developers more power, cleaner markup, and a richer keyboard experience (auto-open on navigation, Shift+Space toggle, Alt+Enter unfold-and-enter) — while removing complexity from the library itself.

### Removed
- **`foldable` decorator**: Removed from `form` and `list` component types. Use native `<details>`/`<summary>` elements instead — they provide the same collapsing behaviour with more flexibility and better browser/assistive-technology support.

### Features
- **Native `<details>`/`<summary>` collapsible sections**: Full keyboard navigation support for forms using native HTML collapsible sections, including auto-open on Enter/addItem, Shift+Space toggle, Alt+Enter unfold-and-enter, and Shift+Enter symmetric skip.
- **Auto-open `<details>` ancestors on `addItem`**: New list items now automatically expand their enclosing `<details>` elements so they are immediately visible and focusable.

### Bug Fixes
- **Space key in `<summary>` inputs**: Prevented the Space key from toggling the parent `<details>` element when focus is inside a `<summary>`-hosted input.
- **Multi-level Enter navigation**: Fixed Enter navigation skipping hidden fields inside closed `<details>` elements across multiple nesting levels.
- **Shift+Enter backward navigation**: Fixed Shift+Enter to auto-open closed `<details>` when navigating backwards, symmetric with forward navigation.
- **Alt+Shift+Enter**: Opens and enters the previous `<details>` section when navigating backwards.

### Pluses
- New collapsible sections showcase example demonstrating native `<details>`/`<summary>` in action.
- Updated the home page example to show off the new collapsible improvements.
- Updated user guide with collapsible sections documentation and illustrations.
- Fixed Ace editor losing indentation due to HTML compressor whitespace collapsing.
- Prioritized render scheduler for the docs playground: concurrency-limited iframe rendering so visible examples load first.
- Dev-dependency updates (Playwright, Sass, minimatch).

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.15.0)

---

## [0.14.2] — 2026-03-31

✨ Mixin parameterization · 🐛 Preserve native `preventDefault()` in event API · 🔒 Security: script check after param substitution · 🧪 HTML validity testing in docs smoke tests.

This release delivers the principal new feature of **mixin parameterization** — DOM snippet parameters for mixin types (`data-for` / `data-id`) — enabling safe, per-instance DOM binding in reusable mixin templates. It also fixes several important bugs in the event API and security pipeline, and integrates HTML validity checks into the co-located docs smoke tests.

### Features
- **DOM snippet parameters for mixin types**: Snippet parameters (direct children of a placeholder with `data-for="<id>"`) replace elements in the template clone by id, with ids converted to `data-id` for safe scoping. See the new "Snippet Parameters" section in the mixin types documentation.

### Bug Fixes
- **Event API `preventDefault()` preservation**: Preserve the real DOM `preventDefault()` in `emit()` and call it synchronously in the `keydown` handler, so native browser defaults are correctly suppressed.
- **Security — nested script check order**: Moved the nested `<script>` check to run *after* snippet parameter substitution, so injected parameters are also validated.
- **Docs example HTML fixes**: Fixed invalid HTML in showcase examples, including an unclosed `<div>` in `event_planner_showcase`, and corrected textarea CSS alignment.

### Tests / Tooling
- **HTML validity testing**: Integrated HTML validity checks into the co-located docs smoke tests; removed the separate static test file.

### Documentation
- Added "Snippet Parameters" section to `mixin_types.md` with examples.
- Updated showcase mixin examples to use `data-for` / `data-id` and aligned CSS classes.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.14.2)

---

## [0.14.1] — 2026-03-29

🐛 Bug fix: `BeforeAction_import` handlers can now alter imported data.

`BeforeAction_import` handlers that modified `ev.data` were silently ignored — the import action was reading the original value instead of the handler-modified one. This patch syncs `ev.data` back to the options object after all `Before` handlers run, so modifications are properly applied.

### Bug Fixes
- **`BeforeAction_import` data modification**: Changes made to `ev.data` inside a `BeforeAction_import` handler are now correctly applied before the import proceeds.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.14.1)

---

## [0.14.0] — 2026-03-26

✨ Mixin Types · 🎯 DOM-like event API (`on`/`onAll`/`onLocal`) · 🛠️ Improved tooling.

SmarkForm 0.14.0 is a feature release centred on **Mixin Types** — a powerful new mechanism that lets components be enriched with reusable behaviour, styles, and scripts declared directly inside `<template>` elements. This release also ships a cleaner DOM-like event API and improved developer tooling.

### Features
- **Mixin Types**: Components can now reference typed mixins (via `#` in the `data-smark-type` attribute). Mixin `<style>` and `<script>` blocks declared as top-level siblings inside `<template>` are extracted and applied per-instance, enabling fully self-contained, reusable interactive components.
- **DOM-like event API**: New `on()`, `onAll()`, and `onLocal()` methods; `focusenter`/`focusleave` events; enriched event metadata for cleaner scripting.
- **Auto-stop dev server**: `npm run dev` now automatically terminates any previously running instance before starting a new one.

### Other
- Dev-dependency updates (Rollup bump).
- Minor documentation corrections.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.14.0)

---

## [0.13.2] — 2026-03-16

🐛 Workaround for Chromium/Brave Android IME "Next" double-advance bug in scalar list fields · 🧪 Chromium mobile and Safari mobile added to CI test matrix · ✨ Smart value coercion docs · 📖 Responsive iframe height in sampletabs · 🎞️ List item animations in showcase demo.

A Chromium bug (`IME_ACTION_NEXT`) was causing double-advance when navigating between list inputs on Android/Brave. This release ships a timestamp-based workaround to detect and suppress the spurious synthetic keydown event. A bug report has been filed with the Chromium project. Chromium mobile (Pixel 5 emulation) and Safari mobile are now part of the automated test suite to prevent regressions on mobile platforms.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.13.2)

---

## [0.13.1] — 2026-03-12

🐛 Bug fixes: `setDefault` propagation, missing `await` in async calls, nested sub-form data loss, `submit` action edge cases · ✨ New `submit` action for form components with full encoding/transport support · 🧪 `demoValue` round-trip smoke tests for co-located docs examples · 📖 Documentation improvements: responsive sidebar/TOC, FAQ updates · 🔧 Dev-dependency updates.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.13.1)

---

## [0.13.0] — 2026-03-03

✨ New `time` and `datetime-local` component types · 🔄 `reset` action + default values · ⌨️ Focus retention on empty lists · 🎨 Parametric SVG logo · 📖 End-User Guide, Branding section, Code of Conduct · 🌗 Auto dark/light docs theme · 🛠️ Visual render errors.

SmarkForm 0.13.0 delivers new date/time field types, a brand-new `reset` action with configurable default values (with `import()` updating the default so "Load then Reset" just works), UX improvements for keyboard users, a comprehensive documentation overhaul, and a parametric SVG logo in eight variants.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.13.0)

---

## [0.12.9] — 2025-12-18

👌 Smarter labels (implicit association, legends...)

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.12.9)

---

## [0.12.8] — 2025-11-23

Maintenance version.

(Just a workaround for an edge case I've barely seen in one specific browser and version).

No more changes (other than new passing co-located tests).

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.12.8)

---

## [0.12.7] — 2025-10-23

🪲 Fixed pesky form auto-focus bug on render.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.12.7)

---

## [0.12.6] — 2025-10-23

— That's one small step for a user, one giant leap for SmarkForm —

A small UX improvement (forms now focus on click, just like regular fields) is the only visible
change for users in this release.

But under the hood it comes with…

⚡ Major improvements to testing infrastructure and coverage:
  👉 Migrated the test suite to Playwright, covering Chromium, Firefox, and WebKit.
  👉 Added smoke tests for all examples in the documentation.
  👉 Co-located, feature-specific tests for each example are now possible—and enforced.

⚡ Better documentation landing:
  👉 Improved repository README.md and the SmarkForm manual's landing page.
  👉 Fully revamped Contact and Contributing guidelines, removing duplication and inconsistencies.
  👉 Created and documented a Telegram announcements channel and community chat.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.12.6)

---

## [0.12.5] — *(tag only — no GitHub Release entry)*

👌 `focus_on_click` form option (default=`true`): forms now get focused when clicked,
   like regular fields. Disable with `focus_on_click: false`.

> **Note:** This version has a git tag and commit but no associated GitHub Release entry.
> See the [tag page](https://github.com/bitifet/SmarkForm/releases/tag/0.12.5) for more details.

---

## [0.12.4] — 2025-09-24

♿ Reviewed label's a11y behaviour
   → See: https://github.com/bitifet/SmarkForm/discussions/25

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.12.4)

---

## [0.12.3] — 2025-09-15

👌 Improvements to label component type
     💪 Made focus on click work even for subforms and lists.
     ♿ Auto-adds aria-label to its targeted field.

> 🙏 **NOTE:** Hope this little step would make SmarkForm forms more accessible to everybody.
> By the way, I am not an accessibility expert. If you are and you'd like to contribute with your
> feedback, ideas or whatever, please don't hesitate to contact me.

More info:
  📖 Reference Manual: [https://smarkform.bitifet.net](https://smarkform.bitifet.net)
  👀 Showcase: [https://smarkform.bitifet.net/about/showcase](https://smarkform.bitifet.net/about/showcase)
  👉 NPM: [https://npmjs.org/package/smarkform](https://npmjs.org/package/smarkform)
  👉 GitHub: [https://github.com/bitifet/SmarkForm](https://github.com/bitifet/SmarkForm)

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.12.3)

---

## [0.12.2] — 2025-09-12

👌 Well curated hotkeys behavior
   🪲 Fixed bug introduced in 0.12.1
   ⚡ Global review/refactor/test.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.12.2)

---

## [0.12.1] — 2025-09-09

💪 Smarter hotkeys discovery.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.12.1)

---

## [0.12.0] — 2025-09-08

💥 BREAKING: New action's signature
   👌 Leaner than before.
   ☑️  Backward compatible except for direct call
      → Simple forms (Markup only) won't be affected.
      → Custom event handlers calling actions programmatically may be.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.12.0)

---

## [0.11.1] — 2025-09-06

Visually evident render errors.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.11.1)

---

## [0.11.0] — 2025-09-03

Version 0.11.0

👉 Implemented new `afterRender` and `beforeUnrender` events.

💥 BREAKING:
   ✂️  Removed (hopefully never used) targetType spec for triggers.
   🚀 Made `BeforeAction_xxx` and `AfterAction_xxx` events to always fire
      (not only when invoked from trigger components).
   ↩️  Made `.on()` alias to `.onAll()` instead of `.onLocal()`
     → Which makes more sense with current bubbling schema.
   👌 Standardized native events mapping footprint.
   ❌ Removed (deprecated) `addItem` and `removeItem` (and replaced
      existing examples by its alternative with using `afterRender` and
      `beforeUnrender` events).
   ❌ Renamed `keep_non_empty` to `preserve_non_empty`.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.11.0)

---

## [0.10.1] — 2025-08-06

Moved event bubbling before eventHooks.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.10.1)

---

## [0.10.0] — 2025-08-05

⚡ (Real) event bubbling support.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.10.0)

---

## [0.9.1] — 2025-07-31

Fixed unwanted colorpicker behaviour with Enter key.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.9.1)

---

## [0.9.0] — 2025-07-30

New eventHooks and smoother navigation.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.9.0)

---

## [0.8.8] — 2025-07-21

Allow triggers inside labels.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.8.8)

---

## [0.8.7] — 2025-07-16

Implemented new `source` option to `addItem` action allowing for
copying data from another list item.

> **Note:** The original release body appears to be truncated in GitHub. See the
> [GitHub Release page](https://github.com/bitifet/SmarkForm/releases/tag/0.8.7) for details.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.8.7)

---

## [0.8.6] — 2025-07-10

**Full Changelog**: https://github.com/bitifet/SmarkForm/compare/0.8.5...0.8.6

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.8.6)

---

## Older Tags (no GitHub Release notes)

The following version tags exist in the repository but do not have associated GitHub Release
entries. Release notes for these versions were not published via the GitHub Releases feature.

| Tag | Tag Page |
|-----|----------|
| 0.8.5 | [tag/0.8.5](https://github.com/bitifet/SmarkForm/releases/tag/0.8.5) |
| 0.8.4 | [tag/0.8.4](https://github.com/bitifet/SmarkForm/releases/tag/0.8.4) |
| 0.8.3 | [tag/0.8.3](https://github.com/bitifet/SmarkForm/releases/tag/0.8.3) |
| 0.8.2 | [tag/0.8.2](https://github.com/bitifet/SmarkForm/releases/tag/0.8.2) |
| 0.8.1 | [tag/0.8.1](https://github.com/bitifet/SmarkForm/releases/tag/0.8.1) |
| 0.8.0 | [tag/0.8.0](https://github.com/bitifet/SmarkForm/releases/tag/0.8.0) |
| *(additional older tags)* | [All tags](https://github.com/bitifet/SmarkForm/tags) |
| 0.3.0 | [tag/0.3.0](https://github.com/bitifet/SmarkForm/releases/tag/0.3.0) |
| 0.2.0 | [tag/0.2.0](https://github.com/bitifet/SmarkForm/releases/tag/0.2.0) |
| 0.1.5 | [tag/0.1.5](https://github.com/bitifet/SmarkForm/releases/tag/0.1.5) |
| 0.1.4 | [tag/0.1.4](https://github.com/bitifet/SmarkForm/releases/tag/0.1.4) |
| 0.1.3 | [tag/0.1.3](https://github.com/bitifet/SmarkForm/releases/tag/0.1.3) |
| 0.1.2 | [tag/0.1.2](https://github.com/bitifet/SmarkForm/releases/tag/0.1.2) |
| 0.1.1 | [tag/0.1.1](https://github.com/bitifet/SmarkForm/releases/tag/0.1.1) |
| 0.1.0 | [tag/0.1.0](https://github.com/bitifet/SmarkForm/releases/tag/0.1.0) |
| 0.0.7 | [tag/0.0.7](https://github.com/bitifet/SmarkForm/releases/tag/0.0.7) |
| 0.0.6 | [tag/0.0.6](https://github.com/bitifet/SmarkForm/releases/tag/0.0.6) |
| 0.0.5 | [tag/0.0.5](https://github.com/bitifet/SmarkForm/releases/tag/0.0.5) |
| 0.0.4 | [tag/0.0.4](https://github.com/bitifet/SmarkForm/releases/tag/0.0.4) |
| 0.0.3 | [tag/0.0.3](https://github.com/bitifet/SmarkForm/releases/tag/0.0.3) |
| 0.0.2 | [tag/0.0.2](https://github.com/bitifet/SmarkForm/releases/tag/0.0.2) |
| 0.0.1 | [tag/0.0.1](https://github.com/bitifet/SmarkForm/releases/tag/0.0.1) |

> For the complete list of all tags see: https://github.com/bitifet/SmarkForm/tags

---

Full release history is also available on the Releases page:
https://github.com/bitifet/SmarkForm/releases

**Policy:** Keep full history until 1.0.0; after 1.0.0 archive older releases into
`docs/changelog-archive/*.md`.

[Unreleased]: https://github.com/bitifet/SmarkForm/compare/0.15.0...HEAD
[0.13.1]: https://github.com/bitifet/SmarkForm/releases/tag/0.13.1
[0.13.0]: https://github.com/bitifet/SmarkForm/releases/tag/0.13.0
[0.12.9]: https://github.com/bitifet/SmarkForm/releases/tag/0.12.9
[0.12.8]: https://github.com/bitifet/SmarkForm/releases/tag/0.12.8
[0.12.7]: https://github.com/bitifet/SmarkForm/releases/tag/0.12.7
[0.12.6]: https://github.com/bitifet/SmarkForm/releases/tag/0.12.6
[0.12.5]: https://github.com/bitifet/SmarkForm/releases/tag/0.12.5
[0.12.4]: https://github.com/bitifet/SmarkForm/releases/tag/0.12.4
[0.12.3]: https://github.com/bitifet/SmarkForm/releases/tag/0.12.3
[0.12.2]: https://github.com/bitifet/SmarkForm/releases/tag/0.12.2
[0.12.1]: https://github.com/bitifet/SmarkForm/releases/tag/0.12.1
[0.12.0]: https://github.com/bitifet/SmarkForm/releases/tag/0.12.0
[0.11.1]: https://github.com/bitifet/SmarkForm/releases/tag/0.11.1
[0.11.0]: https://github.com/bitifet/SmarkForm/releases/tag/0.11.0
[0.10.1]: https://github.com/bitifet/SmarkForm/releases/tag/0.10.1
[0.10.0]: https://github.com/bitifet/SmarkForm/releases/tag/0.10.0
[0.9.1]: https://github.com/bitifet/SmarkForm/releases/tag/0.9.1
[0.9.0]: https://github.com/bitifet/SmarkForm/releases/tag/0.9.0
[0.8.8]: https://github.com/bitifet/SmarkForm/releases/tag/0.8.8
[0.8.7]: https://github.com/bitifet/SmarkForm/releases/tag/0.8.7
[0.8.6]: https://github.com/bitifet/SmarkForm/releases/tag/0.8.6
