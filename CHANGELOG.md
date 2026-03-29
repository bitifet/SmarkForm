# Changelog

All notable changes to this project will be documented in this file.

This changelog was generated from [GitHub Releases](https://github.com/bitifet/SmarkForm/releases)
and associated tags. The project is currently pre-1.0.0; note-keeping policy and formatting
conventions may change when 1.0.0 is reached. Older release history will be archived into
`docs/changelog-archive/*.md` at that point.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

<!-- Add new entries here when preparing the next release. -->

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

[Unreleased]: https://github.com/bitifet/SmarkForm/compare/0.13.1...HEAD
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
