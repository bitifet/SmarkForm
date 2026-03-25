# Release Prep: 0.14.0

## Release Checklist

- [ ] Target version confirmed: **0.14.0**
- [ ] Previous release tag identified: **0.13.2**
- [ ] Commit history reviewed; user-facing summary produced (see below)
- [ ] `npm audit` run; vulnerabilities addressed (`npm audit fix` applied — 0 vulnerabilities)
- [ ] `npm test` passes
- [ ] `package.json` version updated to `0.14.0`
- [ ] `npm install` run (updates `package-lock.json`)
- [ ] `docs/_data/package.json` matches root `package.json` (both `0.14.0`)
- [ ] `npm run build` succeeds
- [ ] `npm test` passes after build
- [ ] `CHANGELOG.md` updated with `[0.14.0]` entry scaffold
- [ ] `RELEASE_PREP.md` reviewed and signed off
- [ ] `RELEASE_PREP.md` removed before final squash merge
- [ ] User reminded of manual steps (tag, GitHub Release, npm publish, stable rebase)

### Key Files to Review Before Publishing

| Item | Location |
|------|--------|
| Version number | `package.json` · `docs/_data/package.json` |
| Changelog entry | `CHANGELOG.md` — replace `TBD` date and refine bullets |
| Tests | `npm test` (full matrix) |
| Build artefacts | `npm run build` → `dist/` |
| Documentation | `docs/` — ensure mixin-types page and showcase are up to date |
| Git tag | Create `0.14.0` tag after squash merge |
| GitHub Release | Draft in GitHub UI using the release notes below |
| npm publish | `npm publish` after tagging |
| Stable branch | `git checkout stable && git rebase main && git push origin stable` |

---

## Flagship Feature: Mixin Types Support

SmarkForm 0.14.0 introduces **Mixin Types** — a first-class mechanism for packaging reusable
behaviour, styles, and scripts directly inside `<template>` elements.

### What are Mixin Types?

A **mixin type** is a component whose `data-smark-type` attribute contains a `#` (e.g.,
`data-smark-type="input#myMixin"`). The engine looks up the named mixin template and:

1. Clones the mixin's root element into the component's DOM.
2. Extracts `<style>` and `<script>` blocks declared as **top-level siblings** inside the
   `<template>` (not inside the root element) and applies them once per document (styles) or
   once per instance (scripts), scoped to the component.

### Why it matters

- **Self-contained components**: behaviour, styles, and logic travel with the template — no
  separate JS modules needed.
- **Composable**: mix multiple typed behaviours by chaining mixin refs.
- **Safe cross-origin loading**: controlled via the `crossOriginMixins` option.
- **Works with SmarkForm's rendering pipeline**: scripts run as `onRendered` tasks, so
  `AfterAction_*` listeners are always active before the corresponding action fires.

### Key implementation files

| File | Role |
|------|------|
| `src/lib/mixin.js` | Mixin expansion engine; style/script extraction |
| `src/lib/component.js` | `enhance()` hook; `_mixinChain` circular-dep detection |
| `test/mixin_types.tests.js` | Full test suite for Mixin Types |
| `docs/_advanced_concepts/mixin_types.md` | User-facing documentation |
| `docs/_about/showcase.md` | Showcase examples (schedule, sortable, etc.) |

---

## Release Notes Summary

SmarkForm 0.14.0 is a feature release centred on **Mixin Types** — a powerful new mechanism
that lets components be enriched with reusable behaviour, styles, and scripts declared directly
inside `<template>` elements. This release also ships a cleaner DOM-like event API
(`on`/`onAll`/`onLocal`, `focusenter`/`focusleave`) and several bug fixes.

### Features
- **Mixin Types**: Components can now reference typed mixins (via `#` in `data-smark-type`). Mixin `<style>` and `<script>` blocks declared as top-level siblings inside `<template>` are extracted and applied per-instance, enabling fully self-contained, reusable interactive components.
- **DOM-like event API**: New `on()`, `onAll()`, and `onLocal()` methods; `focusenter`/`focusleave` events; enriched event metadata for cleaner scripting.
- **Auto-stop dev server**: `npm run dev` now automatically terminates any previously running instance before starting a new one.

### Bug Fixes
- Fixed `setDefault` propagation in `export_to_target` (values no longer leak into descendants).
- Fixed Reset button targeting (now correctly targets the root form).
- Restored Ctrl+C support for `npm run dev`.
- Fixed CSS tab collapse when no `cssSource` and edit mode is off.
- Replaced `toISOString()` with local date formatter to avoid UTC day-shift in `UTC+` timezones.
- Added responsive CSS breakpoint to `scheduleRow` mixin; fixed `draggable` typo in `sortable`.

### Other
- Dev-dependency updates (Rollup bump).
- Minor documentation corrections.

### Suggested GitHub Release title

```
SmarkForm 0.14.0 — Mixin Types
```

### Suggested GitHub Release body

```markdown
## SmarkForm 0.14.0 — Mixin Types

SmarkForm 0.14.0 delivers **Mixin Types** — a first-class way to package reusable behaviour,
styles, and scripts inside `<template>` elements. Components reference typed mixins via `#` in
`data-smark-type`; the engine extracts `<style>`/`<script>` siblings and applies them
per-instance, enabling fully self-contained, composable components with no extra JS modules.

### ✨ Features
- **Mixin Types**: `<style>` and `<script>` siblings inside `<template>` are extracted and applied per mixin instance.
- **DOM-like event API**: `on()`, `onAll()`, `onLocal()`; `focusenter`/`focusleave` events; richer event metadata.
- **Auto-stop dev server**: `npm run dev` terminates any previous instance automatically.

### 🐛 Bug Fixes
- Fixed `setDefault` propagation in `export_to_target`.
- Fixed Reset button targeting (root form instead of demo sub-form).
- Restored Ctrl+C support for `npm run dev`.
- Fixed CSS tab collapse when `cssSource` is absent and edit mode is off.
- Replaced `toISOString()` with local date formatter (avoids UTC day-shift in `UTC+` timezones).
- Responsive CSS breakpoint for `scheduleRow` mixin; fixed `draggable` typo in `sortable`.

### 📦 Other
- Dev-dependency updates (Rollup bump).
- Minor documentation corrections.

**Full Changelog**: https://github.com/bitifet/SmarkForm/blob/main/CHANGELOG.md
```

### Suggested squash commit message

```
Version 0.14.0
```

---

## Telegram Announcement

<Channel: https://t.me/s/smarkform>

---

🚀 **SmarkForm 0.14.0 — Mixin Types — is out!**

This release introduces **Mixin Types**: package behaviour, styles, and scripts directly inside
`<template>` elements for fully self-contained, reusable components. Also ships a cleaner
DOM-like event API and several bug fixes.

Key highlights:
- 🧩 Mixin Types: `<style>`/`<script>` siblings in templates, applied per instance
- 🎯 New DOM-like event API: `on()` / `onAll()` / `onLocal()`, `focusenter`/`focusleave`
- 🐛 Bug fixes: `setDefault` propagation, Reset button, date formatting, and more

📦 npm: `npm install smarkform@0.14.0`
🔗 Docs: https://smarkform.bitifet.net
📝 Changelog: https://github.com/bitifet/SmarkForm/releases/tag/0.14.0

---

## Social Media Texts

> All variants below are fully written and ready to copy. Adjust emoji or tone to taste.

### Twitter / X

#### Public (general audience)

```
🚀 #SmarkForm 0.14.0 released — Mixin Types!

Package behaviour, styles & scripts inside <template> elements.
Self-contained, reusable form components — no extra JS modules needed.

#OpenSource #JavaScript #WebDev #Forms

📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

#### Frontend Developers

```
🧩 #SmarkForm 0.14.0 — Mixin Types are here!

Drop a <style> or <script> as a sibling inside your <template>.
SmarkForm extracts & applies them per instance automatically.
Self-contained components with zero extra module wiring. 🚀

#FrontEnd #JavaScript #WebComponents #Forms
📦 npm i smarkform@0.14.0
```

#### HTML-driven devs

```
🚀 #SmarkForm 0.14.0 brings Mixin Types — all in plain HTML!

Add <style> and <script> directly inside <template> tags.
No build step, no module bundler — your templates just work.

#HTML #ProgressiveEnhancement #WebDev #NoFramework
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

#### Open Source Contributors

```
🎉 #SmarkForm 0.14.0 is out!

New: Mixin Types, DOM-like event API & bug fixes.
OSS, MIT-licensed, zero runtime deps. Contributions welcome!

#OpenSource #OSS #JavaScript #Community
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

#### Software Engineering

```
⚙️ #SmarkForm 0.14.0 — Mixin Types via <template> siblings

Behaviour, styles & scripts travel with the component definition.
No side-channel wiring, circular-dep detection included.
Clean separation of concerns for complex form UIs. 🧱

#SoftwareEngineering #JavaScript #DesignPatterns #WebDev
📦 npm i smarkform@0.14.0
```

#### Build in Public

```
🏗️ Shipped #SmarkForm 0.14.0 — Mixin Types

Biggest feature yet: self-contained components via <template> blocks.
Style + script + markup in one place. Zero extra wiring. 🚀

Building in public — here's what's next 👇 [thread]

#BuildInPublic #IndieHacker #JavaScript #OpenSource
📦 npm i smarkform@0.14.0
```

#### I can code

```
💡 New release! #SmarkForm 0.14.0

Ever wanted form components that bring their own styles & logic?
Now you can — just add <style>/<script> inside your <template>. 🧩

#ICanCode #LearnToCode #JavaScript #WebDev
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

#### Tech Founders

```
🚀 #SmarkForm 0.14.0 — Mixin Types for form components

Build reusable, self-contained form widgets with styles & logic
baked in. Less glue code = faster product iteration. ⚡

#TechFounders #JavaScript #ProductDev #WebDev
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

#### Web Developers

```
🌐 #SmarkForm 0.14.0 is live!

Mixin Types let you bundle styles + scripts inside <template>.
Also: DOM-like event API (on/onAll/onLocal) & bug fixes.

#WebDevelopment #JavaScript #HTML #Forms
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

#### Tech Twitter

```
🔥 #SmarkForm 0.14.0 drops Mixin Types

Components now carry their own <style> & <script> siblings.
Per-instance injection, circular-dep detection, zero extra modules.

This is how reusable form UIs should work. 🧵👇

#TechTwitter #JavaScript #WebDev #OpenSource
📦 npm i smarkform@0.14.0
```

#### Javascript

```
⚡ #SmarkForm 0.14.0 — Mixin Types in plain JS!

- <style>/<script> siblings inside <template> → applied per instance
- New on() / onAll() / onLocal() event API
- focusenter / focusleave events with rich metadata

#JavaScript #JS #ESModules #WebDev
📦 npm i smarkform@0.14.0
```

#### Actually Build in Public

```
✅ Shipped: #SmarkForm 0.14.0 — Mixin Types

Weeks of work distilled into one clean API:
drop <style>/<script> inside <template>, SmarkForm does the rest.

What I learned building this → [thread] 🧵

#ActuallyBuildInPublic #JavaScript #OpenSource #Shipping
📦 npm i smarkform@0.14.0
```

#### Front End Fraternity

```
👊 #SmarkForm 0.14.0 is here, fam!

Mixin Types: self-contained components with styles & logic in <template>.
DOM-like event API. Bug fixes. Ship it. 🚢

#FrontEndFraternity #FrontEnd #JavaScript #CSS #HTML
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

---

### LinkedIn Article

#### Content

**SmarkForm 0.14.0: Mixin Types — Build Self-Contained, Reusable Form Components**

SmarkForm 0.14.0 is available now, and it brings the most significant addition to the
library's component model to date: **Mixin Types**.

**What are Mixin Types?**

Until now, if you wanted to attach custom behaviour to a form component, you had to wire up
JavaScript separately — either inline or via a module. Mixin Types change that by letting you
declare `<style>` and `<script>` blocks as *siblings of the root element* inside a `<template>`:

```html
<template id="myWidget">
  <input type="text" data-smark>
  <style>
    /* scoped to this component */
    input { border-radius: 6px; }
  </style>
  <script>
    // runs once per rendered instance
    this.on('AfterAction_change', ({ value }) => console.log('changed:', value));
  </script>
</template>
```

SmarkForm extracts those blocks and applies them per-instance — styles are injected into the
document once (deduplicated), scripts run as `onRendered` tasks so event listeners are always
active before the first action fires.

**Why this matters**

- Zero extra wiring: the template is the component — behaviour travels with the markup.
- Composable: chain multiple mixin refs via `#` in `data-smark-type`.
- Safe: circular dependency detection is built in; cross-origin loading is opt-in via `crossOriginMixins`.
- Compatible: works seamlessly with the rest of SmarkForm's rendering pipeline.

**Other highlights in 0.14.0**

Beyond Mixin Types, this release ships a DOM-like event API (`on()`, `onAll()`, `onLocal()`)
with `focusenter`/`focusleave` events and richer metadata, plus several bug fixes (including a
`setDefault` propagation edge case, Reset button targeting, and a UTC day-shift date formatting
bug).

**Get started**

```bash
npm install smarkform@0.14.0
```

Documentation: https://smarkform.bitifet.net

#### Hero Image prompt

A clean, modern developer workspace illustration. A transparent HTML `<template>` tag floats
in the centre, containing three nested blocks colour-coded in soft blues and greens: one for
markup (`<input>`), one for `<style>`, and one for `<script>`. Curved arrows show the blocks
being "extracted" and applied to multiple form component instances arranged in a grid below.
Background is a dark IDE-style gradient. Text overlay: "SmarkForm 0.14.0 — Mixin Types".
Style: flat design, developer-friendly, high contrast.

### LinkedIn Posts

#### Full Stack Titans

```
🚀 SmarkForm 0.14.0 is out — and it changes how you build reusable form components.

Introducing Mixin Types: declare <style> and <script> blocks directly inside <template>,
and SmarkForm injects them per component instance — styles deduplicated, scripts
sandboxed and lifecycle-aware.

No separate modules, no manual wiring. The template *is* the component.

What's new:
• 🧩 Mixin Types — self-contained components via <template> siblings
• 🎯 DOM-like event API: on() / onAll() / onLocal(), focusenter/focusleave
• 🐛 Bug fixes: setDefault propagation, date formatting, Reset button

If you're building complex forms in a full-stack JS project and want to cut the glue
code, SmarkForm 0.14.0 is worth a look.

🔗 https://smarkform.bitifet.net
#FullStack #JavaScript #WebDev #OpenSource #Forms
```

#### Software Developer

```
⚙️ SmarkForm 0.14.0 — Mixin Types

This release ships a clean new pattern for component composition:
drop a <style> or <script> tag as a sibling inside your <template>,
and SmarkForm handles injection, deduplication, and lifecycle binding automatically.

It's a small API surface with a big impact on how you organise form UI code.

What's new:
• Mixin Types (<style>/<script> siblings in <template>)
• on() / onAll() / onLocal() event API with focusenter/focusleave
• Bug fixes across setDefault, Reset button, date formatting, and dev tooling

📦 npm install smarkform@0.14.0
🔗 https://smarkform.bitifet.net
#SoftwareDevelopment #JavaScript #OpenSource #WebDev
```

#### CSS3/HTML5 The future of front end

```
🎨 SmarkForm 0.14.0 — Style your form components from inside <template>!

Mixin Types let you embed a <style> block directly inside a <template> tag.
SmarkForm extracts it and applies it to every rendered instance — scoped,
deduplicated, and with zero extra build tooling.

HTML + CSS, the way it should be — self-contained and composable.

What's new:
• <style> and <script> siblings inside <template>
• DOM-like event API for cleaner scripting
• Several bug fixes

🔗 https://smarkform.bitifet.net
#HTML5 #CSS3 #FrontEnd #WebComponents #JavaScript
```

#### Software Development

```
🛠️ SmarkForm 0.14.0 released — featuring Mixin Types

A new component model where behaviour, styles, and scripts are
co-located inside <template> elements. SmarkForm manages extraction,
deduplication, and instance-scoped execution automatically.

Highlights:
• Mixin Types: self-contained components, zero extra wiring
• DOM-like event API (on/onAll/onLocal) + focusenter/focusleave
• Bug fixes: setDefault propagation, date UTC shift, dev server Ctrl+C

MIT licensed, zero runtime dependencies.

📦 npm install smarkform@0.14.0
🔗 https://smarkform.bitifet.net
#SoftwareDevelopment #JavaScript #OpenSource #WebDev
```

#### Software Engineering

```
📐 SmarkForm 0.14.0 — Mixin Types and a cleaner event model

From a software engineering perspective, Mixin Types solve a real
composition problem: how to ship reusable UI components that carry
their own behaviour without coupling to external modules.

The solution is elegant — <style> and <script> siblings inside <template>
are extracted by the engine, applied per instance, with circular dependency
detection and cross-origin controls built in.

Also in this release:
• on() / onAll() / onLocal() for a DOM-consistent event API
• focusenter / focusleave with enriched event metadata
• Bug fixes: setDefault propagation, reset button scoping, UTC date shift

📦 npm install smarkform@0.14.0
🔗 https://smarkform.bitifet.net
#SoftwareEngineering #DesignPatterns #JavaScript #OpenSource
```

---

## Security Notes

`npm audit fix` was run as part of this release preparation. One high-severity vulnerability
in `picomatch` (GHSA-3v7f-55p6-f55p, method injection in POSIX character classes) was
resolved automatically. No open vulnerabilities after `npm audit fix`.

---

## Manual Steps (do NOT automate without explicit user request)

After reviewing this document and the CHANGELOG entry, the maintainer should:

1. **Update the `[0.14.0]` date** in `CHANGELOG.md` (replace `TBD` with the actual release date).
2. **Remove `RELEASE_PREP.md`** from the repository root.
3. **Squash and commit** the PR to `main`:
   ```bash
   git merge --squash <branch> && git commit -m "Version 0.14.0"
   ```
4. **Tag the release**:
   ```bash
   git tag 0.14.0 && git push origin 0.14.0
   ```
5. **Create a GitHub Release** via the GitHub web UI using the release notes above.
6. **Publish to npm**:
   ```bash
   npm publish
   ```
7. **Rebase the stable branch**:
   ```bash
   git checkout stable && git rebase main && git push origin stable
   ```
