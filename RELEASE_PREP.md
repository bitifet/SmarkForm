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
(`on`/`onAll`/`onLocal`, `focusenter`/`focusleave`) and improved developer tooling.

### Features
- **Mixin Types**: Components can now reference typed mixins (via `#` in `data-smark-type`). Mixin `<style>` and `<script>` blocks declared as top-level siblings inside `<template>` are extracted and applied per-instance, enabling fully self-contained, reusable interactive components.
- **DOM-like event API**: New `on()`, `onAll()`, and `onLocal()` methods; `focusenter`/`focusleave` events; enriched event metadata for cleaner scripting.
- **Auto-stop dev server**: `npm run dev` now automatically terminates any previously running instance before starting a new one.

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
DOM-like event API and improved developer tooling.

Key highlights:
- 🧩 Mixin Types: `<style>`/`<script>` siblings in templates, applied per instance
- 🎯 New DOM-like event API: `on()` / `onAll()` / `onLocal()`, `focusenter`/`focusleave`
- 🛠️ Improved developer tooling (`npm run dev` auto-stop, Rollup bump)

📦 npm: `npm install smarkform@0.14.0`
🔗 Docs: https://smarkform.bitifet.net
📝 Changelog: https://github.com/bitifet/SmarkForm/releases/tag/0.14.0

---

## Social Media Texts

> All variants below are fully written and ready to copy. Adjust emoji or tone to taste.

### Twitter / X

> Each community gets a **4-tweet thread**. Tweet 1 announces the release and signals the
> thread; tweets 2–3 cover the key Mixin Types features and nuances; tweet 4 wraps up with
> additional improvements and a call to action. **The documentation links are identical in every
> thread** (same link per tweet position); only wording, emoji, and hashtags vary between
> communities. Deeper angle changes are applied where the community warrants it.
>
> **Link sets per tweet position (same across all 13 threads):**
> - Tweet 1: 📖 `/advanced_concepts/mixin_types` · 🎯 `/about/showcase#mixins`
> - Tweet 2: 📖 `/advanced_concepts/mixin_types#styles` · ❓ `/about/faq#mixin-types`
> - Tweet 3: 📖 `/advanced_concepts/mixin_types#scripts` · 🔒 `/advanced_concepts/mixin_types#cross-origin-script-security-policy`
> - Tweet 4: 📖 `/advanced_concepts/events` · 📦 `npm i smarkform@0.14.0` · 🔗 `https://smarkform.bitifet.net`

---

#### Public (general audience)

**Tweet 1/4**
```
🚀 #SmarkForm 0.14.0 — Mixin Types! 🧵 1/4

Package behaviour, styles & scripts inside <template> elements.
Self-contained, reusable form components — no extra JS modules.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types
🎯 https://smarkform.bitifet.net/about/showcase#mixins
```

**Tweet 2/4**
```
🎨 #SmarkForm 2/4 — Styles in your templates

Add a <style> sibling inside <template>.
SmarkForm injects it once per document — deduplicated across all instances.
Components carry their own CSS. No extra stylesheet.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#styles
❓ https://smarkform.bitifet.net/about/faq#mixin-types
```

**Tweet 3/4**
```
⚙️ #SmarkForm 3/4 — Scripts, nesting & safety

<script> siblings run per instance as lifecycle hooks.
Compose via `#` chains · load from external URLs.
XSS guard (crossOriginMixins) + circular dep detection.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#scripts
🔒 https://smarkform.bitifet.net/advanced_concepts/mixin_types#cross-origin-script-security-policy
```

**Tweet 4/4**
```
✨ #SmarkForm 4/4 — Also in 0.14.0

New DOM-like event API: on() / onAll() / onLocal().
focusenter & focusleave events with richer metadata.

#OpenSource #JavaScript #WebDev #Forms
📖 https://smarkform.bitifet.net/advanced_concepts/events
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

---

#### Frontend Developers

**Tweet 1/4**
```
🧩 #SmarkForm 0.14.0 — Mixin Types are here! 🧵 1/4

Drop a <style> or <script> as siblings inside your <template>.
SmarkForm extracts & applies them per instance. Zero extra module wiring.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types
🎯 https://smarkform.bitifet.net/about/showcase#mixins
```

**Tweet 2/4**
```
🎨 #SmarkForm 2/4 — CSS lives in the template

Add a <style> sibling inside <template>.
Injected once per document — deduplicated across all instances.
Your component carries its own CSS. No separate stylesheet needed.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#styles
❓ https://smarkform.bitifet.net/about/faq#mixin-types
```

**Tweet 3/4**
```
⚙️ #SmarkForm 3/4 — Scripts, composability & safety

<script> siblings run as lifecycle hooks per rendered instance.
Compose via `#` chains · load mixins from external URLs.
XSS guard via crossOriginMixins · circular dep detection built in.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#scripts
🔒 https://smarkform.bitifet.net/advanced_concepts/mixin_types#cross-origin-script-security-policy
```

**Tweet 4/4**
```
✨ #SmarkForm 4/4 — Also in 0.14.0

New DOM-like event API: on() / onAll() / onLocal().
focusenter & focusleave events with enriched metadata.

#FrontEnd #JavaScript #WebComponents #Forms
📖 https://smarkform.bitifet.net/advanced_concepts/events
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

---

#### HTML-driven devs

**Tweet 1/4**
```
🚀 #SmarkForm 0.14.0 — Mixin Types, all in HTML! 🧵 1/4

Add <style> and <script> directly inside <template> tags.
No build step, no module bundler — your templates just work.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types
🎯 https://smarkform.bitifet.net/about/showcase#mixins
```

**Tweet 2/4**
```
🎨 #SmarkForm 2/4 — Style with plain HTML

A <style> element inside <template> is all it takes.
SmarkForm extracts it and applies it — no preprocessors, no naming conventions.
Pure HTML. Pure CSS. Pure simplicity.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#styles
❓ https://smarkform.bitifet.net/about/faq#mixin-types
```

**Tweet 3/4**
```
⚙️ #SmarkForm 3/4 — Behaviour, composition & safety

Add a <script> sibling for per-instance behaviour.
Reference mixins locally (#id) or from external files (URL#id).
XSS protection via crossOriginMixins. No circular deps possible.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#scripts
🔒 https://smarkform.bitifet.net/advanced_concepts/mixin_types#cross-origin-script-security-policy
```

**Tweet 4/4**
```
✨ #SmarkForm 4/4 — Also in 0.14.0

Cleaner event API: on() / onAll() / onLocal().
focusenter & focusleave events — progressively enhanced.

#HTML #ProgressiveEnhancement #WebDev #NoFramework
📖 https://smarkform.bitifet.net/advanced_concepts/events
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

---

#### Open Source Contributors

**Tweet 1/4**
```
🎉 #SmarkForm 0.14.0 is out — Mixin Types! 🧵 1/4

OSS, MIT-licensed, zero runtime deps.
Self-contained reusable components via <template> siblings. Contributions welcome!

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types
🎯 https://smarkform.bitifet.net/about/showcase#mixins
```

**Tweet 2/4**
```
🎨 #SmarkForm 2/4 — Styles in your templates

Add a <style> sibling inside <template>.
SmarkForm injects it into the document once — deduplicated across all instances.
Components carry their own CSS. No extra files.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#styles
❓ https://smarkform.bitifet.net/about/faq#mixin-types
```

**Tweet 3/4**
```
⚙️ #SmarkForm 3/4 — Scripts, nesting & safety

<script> siblings run per instance as lifecycle hooks.
Nest mixins freely via `#` chains · load from external URLs.
XSS guard (crossOriginMixins) + circular dep detection included.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#scripts
🔒 https://smarkform.bitifet.net/advanced_concepts/mixin_types#cross-origin-script-security-policy
```

**Tweet 4/4**
```
✨ #SmarkForm 4/4 — Also in 0.14.0

New DOM-like event API: on() / onAll() / onLocal().
focusenter & focusleave events with richer metadata.

#OpenSource #OSS #JavaScript #Community
📖 https://smarkform.bitifet.net/advanced_concepts/events
📦 npm i smarkform@0.14.0
�� https://smarkform.bitifet.net
```

---

#### Software Engineering

**Tweet 1/4**
```
⚙️ #SmarkForm 0.14.0 — Mixin Types 🧵 1/4

Components now carry their own behaviour, styles & scripts.
No side-channel wiring. Clean separation of concerns.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types
🎯 https://smarkform.bitifet.net/about/showcase#mixins
```

**Tweet 2/4**
```
🎨 #SmarkForm 2/4 — Co-located styles

<style> as a top-level sibling inside <template>.
Injected once per document — deduplicated. Scoped by design.
The component definition is the source of truth.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#styles
❓ https://smarkform.bitifet.net/about/faq#mixin-types
```

**Tweet 3/4**
```
⚙️ #SmarkForm 3/4 — Scripts, composability & safety

<script> siblings run as onRendered tasks — per instance.
Mixin chains via `#`. External load via URL.
XSS protection: crossOriginMixins opt-in. Circular dep detection at construction time.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#scripts
🔒 https://smarkform.bitifet.net/advanced_concepts/mixin_types#cross-origin-script-security-policy
```

**Tweet 4/4**
```
✨ #SmarkForm 4/4 — Also in 0.14.0

DOM-consistent event API: on() / onAll() / onLocal().
focusenter & focusleave events; enriched event metadata.

#SoftwareEngineering #JavaScript #DesignPatterns
📖 https://smarkform.bitifet.net/advanced_concepts/events
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

---

#### Build in Public

**Tweet 1/4**
```
🏗️ Shipped #SmarkForm 0.14.0 — Mixin Types! 🧵 1/4

Biggest feature to date: self-contained components via <template> blocks.
Style + script + markup — all in one place. Zero extra wiring.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types
🎯 https://smarkform.bitifet.net/about/showcase#mixins
```

**Tweet 2/4**
```
🎨 #SmarkForm 2/4 — What Mixin Styles look like

Drop a <style> sibling inside <template>.
SmarkForm injects it once per document — deduplicated across instances.
The template *is* the component. Styles included.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#styles
❓ https://smarkform.bitifet.net/about/faq#mixin-types
```

**Tweet 3/4**
```
⚙️ #SmarkForm 3/4 — Scripts, nesting & safety

Add a <script> sibling for per-instance lifecycle hooks.
Compose mixins via `#` · load from URLs (XSS-guarded).
Circular dep detection baked in. No surprises.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#scripts
🔒 https://smarkform.bitifet.net/advanced_concepts/mixin_types#cross-origin-script-security-policy
```

**Tweet 4/4**
```
✨ #SmarkForm 4/4 — Also shipped in 0.14.0

New DOM-like event API: on() / onAll() / onLocal().
focusenter & focusleave with richer metadata.

#BuildInPublic #IndieHacker #JavaScript #OpenSource
📖 https://smarkform.bitifet.net/advanced_concepts/events
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

---

#### I can code

**Tweet 1/4**
```
💡 New release! #SmarkForm 0.14.0 — Mixin Types 🧵 1/4

Ever wanted form components that bring their own styles & logic?
Now you can — just add <style>/<script> inside your <template>. 👇

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types
🎯 https://smarkform.bitifet.net/about/showcase#mixins
```

**Tweet 2/4**
```
🎨 #SmarkForm 2/4 — CSS inside <template>? Yes!

Add a <style> block as a sibling of your template's root element.
SmarkForm injects it automatically — once per page, not per instance.
Your component now has its own style. No extra files to manage.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#styles
❓ https://smarkform.bitifet.net/about/faq#mixin-types
```

**Tweet 3/4**
```
⚙️ #SmarkForm 3/4 — Scripts, reuse & safety

Add a <script> to give your component behaviour.
Reuse the same mixin many times. Load from external files.
Built-in XSS protection and circular dep detection keep you safe.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#scripts
🔒 https://smarkform.bitifet.net/advanced_concepts/mixin_types#cross-origin-script-security-policy
```

**Tweet 4/4**
```
✨ #SmarkForm 4/4 — More in 0.14.0

Easier event handling: on() / onAll() / onLocal().
New focusenter & focusleave events.

#ICanCode #LearnToCode #JavaScript #WebDev
📖 https://smarkform.bitifet.net/advanced_concepts/events
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

---

#### Tech Founders

**Tweet 1/4**
```
🚀 #SmarkForm 0.14.0 — Mixin Types for form components 🧵 1/4

Build self-contained form widgets with styles & logic baked in.
Less glue code = faster product iteration. ⚡

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types
🎯 https://smarkform.bitifet.net/about/showcase#mixins
```

**Tweet 2/4**
```
🎨 #SmarkForm 2/4 — Self-contained styles

Add a <style> sibling inside <template>.
SmarkForm handles injection & deduplication automatically.
One component definition. Works everywhere you use it.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#styles
❓ https://smarkform.bitifet.net/about/faq#mixin-types
```

**Tweet 3/4**
```
⚙️ #SmarkForm 3/4 — Scripts, composability & safety

<script> siblings give components their own behaviour.
Compose mixins via `#` chains · load from external URLs.
XSS guard & circular dep detection included. Ship with confidence.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#scripts
🔒 https://smarkform.bitifet.net/advanced_concepts/mixin_types#cross-origin-script-security-policy
```

**Tweet 4/4**
```
✨ #SmarkForm 4/4 — Also in 0.14.0

Cleaner event API: on() / onAll() / onLocal().
focusenter & focusleave for better UX hooks.

#TechFounders #JavaScript #ProductDev #WebDev
📖 https://smarkform.bitifet.net/advanced_concepts/events
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

---

#### Web Developers

**Tweet 1/4**
```
🌐 #SmarkForm 0.14.0 is live — Mixin Types! 🧵 1/4

Bundle styles & scripts inside <template> elements.
Self-contained, reusable components — no extra files or module wiring.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types
🎯 https://smarkform.bitifet.net/about/showcase#mixins
```

**Tweet 2/4**
```
🎨 #SmarkForm 2/4 — Styles in the template

Add a <style> sibling inside <template>.
Injected once per document — deduplicated across all instances.
Your component brings its own CSS wherever it's used.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#styles
❓ https://smarkform.bitifet.net/about/faq#mixin-types
```

**Tweet 3/4**
```
⚙️ #SmarkForm 3/4 — Scripts, nesting & safety

<script> siblings run per instance as lifecycle hooks.
Compose via `#` chains · load from external URLs.
XSS guard via crossOriginMixins · circular dep detection built in.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#scripts
🔒 https://smarkform.bitifet.net/advanced_concepts/mixin_types#cross-origin-script-security-policy
```

**Tweet 4/4**
```
✨ #SmarkForm 4/4 — Also in 0.14.0

New DOM-like event API: on() / onAll() / onLocal().
focusenter & focusleave events with richer metadata.

#WebDevelopment #JavaScript #HTML #Forms
📖 https://smarkform.bitifet.net/advanced_concepts/events
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

---

#### Tech Twitter

**Tweet 1/4**
```
🔥 #SmarkForm 0.14.0 — Mixin Types 🧵 1/4

Components now carry their own <style> & <script> siblings.
Per-instance injection, deduplication, zero extra modules.
This is how reusable form UIs should work. 👇

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types
🎯 https://smarkform.bitifet.net/about/showcase#mixins
```

**Tweet 2/4**
```
🎨 #SmarkForm 2/4 — Styles

<style> top-level sibling inside <template>.
→ Injected once into the document.
→ Deduplicated across all instances.
→ Zero extra CSS files. Zero tooling.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#styles
❓ https://smarkform.bitifet.net/about/faq#mixin-types
```

**Tweet 3/4**
```
⚙️ #SmarkForm 3/4 — Scripts, chains & safety

<script> siblings → run per instance as lifecycle hooks.
Mixin chains via `#`. External load via URL + fetch cache.
XSS protection: crossOriginMixins opt-in. Cyclic ref detection built in.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#scripts
🔒 https://smarkform.bitifet.net/advanced_concepts/mixin_types#cross-origin-script-security-policy
```

**Tweet 4/4**
```
✨ #SmarkForm 4/4 — Also in 0.14.0

DOM-like event API: on() / onAll() / onLocal().
focusenter & focusleave. Richer event metadata.

#TechTwitter #JavaScript #WebDev #OpenSource
📖 https://smarkform.bitifet.net/advanced_concepts/events
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

---

#### Javascript

**Tweet 1/4**
```
⚡ #SmarkForm 0.14.0 — Mixin Types in plain JS! 🧵 1/4

<style>/<script> siblings inside <template> → applied per instance.
No bundler, no module wiring. Pure browser JS.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types
🎯 https://smarkform.bitifet.net/about/showcase#mixins
```

**Tweet 2/4**
```
🎨 #SmarkForm 2/4 — CSS from <template> siblings

Add a <style> inside <template> as a top-level sibling.
SmarkForm extracts & injects it once — deduplicated per mixin id.
Your components carry their own style declarations.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#styles
❓ https://smarkform.bitifet.net/about/faq#mixin-types
```

**Tweet 3/4**
```
⚙️ #SmarkForm 3/4 — Scripts, composition & safety

<script> siblings execute as onRendered tasks per instance.
Compose via `#` chains. Fetch from external URLs with cache.
crossOriginMixins opt-in for XSS safety. Cyclic dep detection built in.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#scripts
🔒 https://smarkform.bitifet.net/advanced_concepts/mixin_types#cross-origin-script-security-policy
```

**Tweet 4/4**
```
✨ #SmarkForm 4/4 — Also in 0.14.0

New on() / onAll() / onLocal() event API.
focusenter / focusleave events with rich metadata.

#JavaScript #JS #ESModules #WebDev
📖 https://smarkform.bitifet.net/advanced_concepts/events
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

---

#### Actually Build in Public

**Tweet 1/4**
```
✅ Shipped: #SmarkForm 0.14.0 — Mixin Types 🧵 1/4

Weeks of work distilled into one clean API:
drop <style>/<script> inside <template> and SmarkForm handles the rest.
Here's what you get 👇

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types
🎯 https://smarkform.bitifet.net/about/showcase#mixins
```

**Tweet 2/4**
```
🎨 #SmarkForm 2/4 — Styles that travel with the component

A <style> sibling inside <template>.
Injected once per document, deduplicated automatically.
No separate stylesheet. No naming convention. Just HTML.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#styles
❓ https://smarkform.bitifet.net/about/faq#mixin-types
```

**Tweet 3/4**
```
⚙️ #SmarkForm 3/4 — Scripts, nesting & protection

<script> siblings run per instance — full lifecycle access.
Chain mixins via `#`. Pull from external URLs.
XSS opt-in guard + circular dep detection. No silent failures.

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#scripts
🔒 https://smarkform.bitifet.net/advanced_concepts/mixin_types#cross-origin-script-security-policy
```

**Tweet 4/4**
```
✨ #SmarkForm 4/4 — Also shipped

DOM-like event API: on() / onAll() / onLocal().
focusenter / focusleave events with proper metadata.

#ActuallyBuildInPublic #JavaScript #OpenSource #Shipping
📖 https://smarkform.bitifet.net/advanced_concepts/events
📦 npm i smarkform@0.14.0
🔗 https://smarkform.bitifet.net
```

---

#### Front End Fraternity

**Tweet 1/4**
```
👊 #SmarkForm 0.14.0 — Mixin Types! 🧵 1/4

Self-contained components with styles & logic in <template>.
Drop in, stamp out, no wiring needed. Let's go! 🚢

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types
🎯 https://smarkform.bitifet.net/about/showcase#mixins
```

**Tweet 2/4**
```
🎨 #SmarkForm 2/4 — CSS in your <template>

Add a <style> sibling inside <template>.
SmarkForm injects it once — deduplicated across instances.
Your components carry their own CSS. No extra stylesheet. 🎯

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#styles
❓ https://smarkform.bitifet.net/about/faq#mixin-types
```

**Tweet 3/4**
```
⚙️ #SmarkForm 3/4 — Scripts, nesting & safety

<script> siblings run per instance as lifecycle hooks.
Chain mixins via `#`. Load from URLs with XSS guard.
Circular dep detection built in. No surprises. 🧱

📖 https://smarkform.bitifet.net/advanced_concepts/mixin_types#scripts
🔒 https://smarkform.bitifet.net/advanced_concepts/mixin_types#cross-origin-script-security-policy
```

**Tweet 4/4**
```
✨ #SmarkForm 4/4 — Also in 0.14.0

DOM-like event API: on() / onAll() / onLocal().
focusenter & focusleave events with richer metadata.

#FrontEndFraternity #FrontEnd #JavaScript #CSS #HTML
📖 https://smarkform.bitifet.net/advanced_concepts/events
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
with `focusenter`/`focusleave` events and richer metadata, plus improved developer tooling.

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
• 🛠️ Improved developer tooling

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
• Improved developer tooling

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
• Improved developer tooling

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
• Improved developer tooling

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
• Improved developer tooling

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
