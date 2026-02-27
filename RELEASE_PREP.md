# Release Prep: 0.13.0

## Release Notes Summary

SmarkForm 0.13.0 is a landmark release that delivers a wave of new features, deep developer-
experience improvements, comprehensive documentation, and a polished branding identity — all
while keeping the library at zero runtime dependencies.

New `time` and `datetime-local` component types complete the family of native date/time pickers
with the same null-aware, flexible import/export interface the rest of the library provides.
A brand-new `reset` action lets users restore any form, field, or list to its configured default
value with a single click or API call, and `import()` now updates the default automatically so
"Load then Reset" just works. UX is sharper too: lists retain keyboard focus when they become
empty, and `min_items: 0` can now coexist peacefully with a pre-populated default initial item.

On the documentation front, the site gains an automatic light/dark color scheme, a brand-new
End-User Guide (for people filling in SmarkForm-powered forms, not only developers), a thorough
Branding section with a parametric SVG logo in eight variants, a revised FAQ, improved examples
with pre-filled demo data, and printer-friendly page layouts. A Code of Conduct is now in place,
and the project's landing page highlights SmarkForm's AI-agent-friendly design.

### Features

- **New `time` component type**: Null-aware `<input type="time">` wrapper. Accepts `Date` objects,
  epoch timestamps, and ISO `HH:mm:ss` strings; exports normalized `HH:mm:ss` or `null`.
- **New `datetime-local` component type**: Null-aware `<input type="datetime-local">` wrapper.
  Accepts `Date`, epoch, and ISO `YYYY-MM-DDTHH:mm:ss` strings; exports the same format or `null`.
- **`reset` action**: All fields, forms, and lists now expose a `reset` trigger action that
  restores the component to its configured `defaultValue` (distinct from `clear`, which removes
  all user values regardless of defaults).
- **Default value via `value` option**: Any component can declare a default value through its
  `data-smark` options: `{"value": "Alice"}`. On initialization the form resets to that state,
  and `reset()` restores it at any time.
- **`import()` updates the default** (`setDefault: true` by default): After importing data,
  `reset()` restores to the imported state. "Load and Reset naturally work together." Opt out
  with `setDefault: false` when needed (e.g. preview-without-committing patterns).
- **Focus retention on empty lists**: When the last item is removed from a list, keyboard focus
  automatically moves to the nearest "addItem" trigger, keeping the user in the flow without
  reaching for the mouse.
- **`min_items: 0` with default items**: Lists can now have `min_items: 0` (allowing fully empty
  lists) while still rendering one or more items by default via the `value` option.
- **Parametric SVG logo** (8 variants): Full, compact, monochrome, and light/dark versions of
  the SmarkForm logo, all generated from a single Pug template with parameterised colours and
  geometry. Read the story behind it:
  https://dev.to/bitifet/generating-a-parametric-svg-logo-with-pug-8m0
- **Branding section in docs**: Logo assets, CDN links, copy-paste badge snippets, placement
  and accessibility guidelines, and a user-guide link pattern for SmarkForm-powered apps.
- **End-User Guide**: A dedicated guide at `/resources/user_guide` for people *filling in*
  SmarkForm forms — covering keyboard navigation, hotkey discovery, list management, and
  accessibility tips.
- **Code of Conduct**: Contributor Covenant added to the repository.
- **Automatic light/dark color scheme** for the documentation site: CSS `prefers-color-scheme`
  media queries plus a JS logo switcher — no configuration, no user action required.
- **AI-agent-ready**: Landing page and features page updated to highlight SmarkForm's declarative,
  markup-driven design as a natural fit for AI coding assistants.
- **Improved error detection and visual reporting**: Misconfigured components are replaced in the
  DOM by a visible error node (red badge with error code, clickable to re-log to the console),
  making development-time mistakes impossible to miss.
- **Singleton options sync**: When a wrapper component (singleton pattern) and its inner field
  both declare options, they are now properly merged with a clear conflict error if keys collide.

### Bug Fixes

- Fixed hotkeys-reveal regression: releasing Alt while holding Ctrl now correctly returns to the
  first reveal level instead of collapsing entirely.
- Fixed `VALUE_CONFLICT` detection: declaring both a `value` HTML attribute and a `"value"` option
  in `data-smark` on the same element now throws a clear render error.
- Minor correction in the color component type export path.

### Other

- Schedule example: layout migrated from HTML table to CSS grid, fixing horizontal scrollbars on
  narrow viewports; `exportEmpties: false` and default-value documentation added.
- FAQ expanded: new entries for default values and reset, singleton behavior, null exports, and
  the API interface.
- Documentation examples pre-filled with realistic demo data throughout.
- Documentation pages are printer-friendly (print stylesheet included in the page layout).
- Co-located example tests extended; test-pick workflow gains "repeat last" and "test with all"
  options.
- Dev-dependency updates: `rollup` → 4.57+, `@playwright/test` → 1.58.x, Babel 7.29.

---

## Telegram Announcement

<Channel: https://t.me/s/smarkform>

---

🚀 **SmarkForm 0.13.0 is out — and it's a big one!**

This has been one of the most active development cycles since the 0.11/0.12 series, and the result is a release that moves the needle on multiple fronts at once: new component types, new actions, important UX improvements, a complete documentation overhaul, and a proper branding identity. Let me walk you through it.

---

🕐 **New component types: `time` and `datetime-local`**

The family of native date/time pickers is now complete. The new `time` and `datetime-local` component types work exactly like `date` and `number` — null-aware, smart about what they accept (Date objects, epoch timestamps, ISO strings), and consistent in what they export. No more hacking an `<input type="time">` inside a generic input wrapper — SmarkForm just handles it.

---

🔄 **Default values + the new `reset` action**

This is the one that unlocks real-world form patterns. You can now declare a default value for any component directly in its `data-smark` options:

```html
<input data-smark='{"name":"status","value":"draft"}' type="text">
```

And there is a new `reset` trigger action that restores the form to that state:

```html
<button data-smark='{"action":"reset"}'>Reset to defaults</button>
```

`reset` is now distinct from `clear`: `clear` wipes everything to the empty/null state, while `reset` brings you back to the configured defaults. Both are available on all field types, forms, and lists.

There's also a subtlety worth knowing: `import()` now updates the component's default by default (`setDefault: true`). This means "Load data then Reset" just works — after loading a record, hitting Reset brings you back to *that* loaded record, not the HTML initialization state. Use `setDefault: false` for preview-without-committing patterns.

---

⌨️ **UX: focus retention and flexible list minimums**

Two small changes that make a real difference when navigating forms with the keyboard:

1. **Focus retention on empty lists**: When you remove the last item from a list, focus automatically moves to the "Add item" button. No more losing track of where you are and having to mouse back in.

2. **`min_items: 0` + default items**: You can now set `min_items: 0` (so the list can be fully emptied by the user) while still having it start with one or more items by default via the `value` option. Previously these two features conflicted.

---

🎨 **A proper logo — generated with Pug!**

SmarkForm now has a full set of SVG logo assets: 8 variants covering light/dark backgrounds, compact/full sizes, and monochrome versions — all generated from a single parametric Pug template.

The Pug-as-SVG-generator approach turned out to be elegant enough that I wrote about it:
📝 https://dev.to/bitifet/generating-a-parametric-svg-logo-with-pug-8m0

All variants are available on jsDelivr CDN and documented in the new Branding section.

---

📖 **Documentation: a complete overhaul**

The 0.13.0 documentation cycle has been the most thorough one yet:

- **End-User Guide** (`/resources/user_guide`): A guide written *for the people filling in your forms*, not just for developers. Covers keyboard navigation, hotkey discovery, list management, and accessibility tips. Link to it from your app — users will thank you.
- **Branding section**: Copy-paste logo badges, CDN links, placement guidelines, and a design rationale.
- **Code of Conduct** in the repository.
- **Expanded FAQ**: New entries on default values, reset, null exports, singletons, and the upcoming API interface.
- **Pre-filled demo data** throughout the documentation examples — forms now show realistic data instead of empty placeholders, making it much easier to understand what they do at a glance.
- **Printer-friendly pages**: The chapter layout now includes a print stylesheet.
- **Automatic light/dark theme**: The docs site detects your OS color-scheme preference and switches automatically — no config, no button.
- **AI-agent-ready landing page**: Explicit mention of SmarkForm's suitability for AI-assisted development, with concrete examples.

---

🛠️ **Developer experience**

- **Visual render errors**: If you misconfigure a component, it is now replaced in the DOM by a red error badge with a short error code. Click it to re-log the full error to the console. No more silent failures during development.
- **Singleton options sync**: Wrapper components and their inner fields now properly merge options, with a clear conflict error if the same key is declared in both.

---

🪲 **Bug fixes**

- Hotkey reveal regression: releasing Alt while holding Ctrl now correctly returns to the first reveal level.
- `VALUE_CONFLICT` detection: setting both an HTML `value` attribute and a `"value"` in `data-smark` now raises a visible error instead of silently ignoring one.

---

📦 npm: `npm install smarkform@0.13.0`
🔗 Docs: https://smarkform.bitifet.net
📝 Changelog: https://github.com/bitifet/SmarkForm/releases/tag/0.13.0
🔧 GitHub: https://github.com/bitifet/SmarkForm

---

## Social Media Texts

> All variants below are fully written and ready to copy. Adjust emoji or tone to taste.

### Twitter / X

#### Public (general audience)

```
🚀 SmarkForm 0.13.0 released — one of the biggest updates yet!

✨ New time & datetime-local component types
🔄 New reset action + default values
⌨️  Lists keep focus when emptied
🎨 Parametric SVG logo (8 variants)
📖 End-User Guide, Branding section, auto dark mode docs

Zero runtime dependencies. Pure HTML forms. Powerful.

#OpenSource #JavaScript #WebDev #Forms

📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### Frontend Developers

```
🚀 SmarkForm 0.13.0 is a big one for frontend devs!

New time/datetime-local field types with full null awareness.
A new reset action distinct from clear — because "restore defaults" ≠ "wipe everything."
Lists keep keyboard focus when you remove the last item.
Auto dark mode for the docs.

If you build complex HTML forms without a framework, this is your library.

#FrontEnd #JavaScript #CSS #Forms #HTML

📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### HTML-driven devs

```
🚀 SmarkForm 0.13.0 is out!

Pure HTML form power, now with:
- time & datetime-local types (null-aware, smart input handling)
- reset action via data-smark (restore defaults, not just clear)
- default values directly in HTML attributes
- Focus stays in lists when you empty them

No framework. No JS templates. No runtime dependencies.
Just smart HTML + one tiny library.

#HTML #VanillaJS #WebDev #Forms

📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### Open Source Contributors

```
🚀 SmarkForm 0.13.0 shipped!

Big cycle: new component types, reset action, focus retention, parametric SVG logo, 
End-User Guide, Branding section, Code of Conduct, auto dark mode...

Contributions welcome! The project is more documented and contributor-friendly than ever.
→ https://github.com/bitifet/SmarkForm

#OpenSource #JavaScript #HacktoberFest

📦 npm i smarkform@0.13.0
```

#### Software Engineering

```
🚀 SmarkForm 0.13.0: meaningful complexity, clean API.

• 2 new component types (time, datetime-local) — null-aware, accept Date/epoch/ISO
• reset() vs clear() — restore defaults vs wipe to empty
• import() updates defaultValue — "Load then Reset" just works
• Focus retention on empty lists — keyboard-first UX
• Visual render errors — no more silent misconfiguration
• Singleton options merging — clear conflict detection

Zero deps. Works with any stack.

#SoftwareEngineering #JavaScript #WebDev

📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### Build in Public

```
🚀 Shipped SmarkForm 0.13.0 — one of my biggest releases!

What went in:
✅ time + datetime-local types
✅ reset action + default values
✅ import() updates the default
✅ Focus retention on empty lists
✅ Parametric SVG logo (wrote about it too!)
✅ End-User Guide for form users
✅ Code of Conduct
✅ Auto dark/light docs
✅ Visual render errors for devs
✅ 118 tests passing

Building in public, learning in public 🙌

#BuildInPublic #OpenSource #IndieHacker

📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### I can code

```
🚀 SmarkForm 0.13.0 — packed release!

I added time & datetime-local field types (null-aware, just like date).
A reset action to restore form defaults (not just clear).
Lists now keep focus when you empty them — keyboard UX win!
Auto dark/light mode for the docs.
And I published an article about the new parametric SVG logo 🎨

#ICanCode #JavaScript #WebDev

📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### Tech Founders

```
🚀 SmarkForm 0.13.0 — production-ready form infra upgrade.

If you're building web products with forms, this release adds:
• Time and datetime-local field types with smart null handling
• Reset to defaults (distinct from clear) — users can undo their edits
• import() updates the default — Load + Reset patterns just work
• End-User Guide your users can actually read
• Branding + logo assets if you want to attribute SmarkForm

Zero runtime deps. Works with any framework or none.

#TechFounders #ProductDev #JavaScript

📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### Web Developers

```
🚀 SmarkForm 0.13.0 is live!

Highlights:
⏱️  time + datetime-local component types
🔄 reset action (restores defaults, not just clears)
⌨️  Focus stays in lists when last item is removed
🎨 8-variant parametric SVG logo
📖 End-User Guide + Branding section
🌗 Auto dark/light docs theme
🛠️  Visual render errors during development

📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net

#WebDev #JavaScript #Forms #OpenSource
```

#### Tech Twitter

```
🚀 SmarkForm 0.13.0 dropped.

The new time + datetime-local component types finally complete the date/time set.
Also: a brand new reset action, focus retention on empty lists, auto dark/light docs,
an End-User Guide, and a parametric SVG logo generated from Pug (yes, really — wrote about it).

#TechTwitter #JavaScript #WebDev

📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### Javascript

```
🚀 SmarkForm 0.13.0 — packed vanilla-JS form library update.

✨ time + datetime-local types (null-aware)
🔄 reset vs clear — restore defaults or wipe
📥 import() now updates defaultValue
⌨️  Focus retention on empty lists
🎨 SVG logo generated with Pug — article: dev.to/bitifet/generating-a-parametric-svg-logo-with-pug-8m0
📖 End-User Guide + Branding + Code of Conduct
🌗 Auto color scheme docs
🛠️  Visual render errors

📦 Zero runtime dependencies.

#JavaScript #VanillaJS #OpenSource

📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### Actually Build in Public

```
📦 SmarkForm 0.13.0 is live.

What shipped (the honest list):
- time + datetime-local component types (null-aware, accept Date/epoch/ISO)
- reset action + defaultValue support on all fields, forms, and lists
- import() updates defaultValue (setDefault:true) — Load+Reset just works
- Focus retention when lists become empty
- min_items:0 + default items now work together
- Parametric SVG logo in 8 variants (Pug template — dev.to article too)
- Branding docs + logo CDN links
- End-User Guide (for form fillers, not devs)
- Code of Conduct
- Auto light/dark color scheme in docs (CSS prefers-color-scheme)
- AI-agent-ready landing page
- Visual render error nodes (no more silent failures)
- Singleton options merging with conflict detection
- Expanded FAQ, pre-filled demo data, printer-friendly pages
- Dev deps bumped (rollup, playwright, babel)
- 118 passing tests ✅

#ActuallyBuildInPublic #OpenSource

🔗 https://github.com/bitifet/SmarkForm
```

#### Front End Fraternity

```
🚀 SmarkForm 0.13.0 — for the HTML/CSS/JS purists.

This one's big:
→ time + datetime-local types (same null-aware interface as date/number)
→ reset action in any data-smark trigger (restore defaults, not just clear)
→ Auto light/dark theme via CSS prefers-color-scheme (no JS framework, no config)
→ SVG logo from a Pug generator — clean parametric approach
→ End-User Guide for keyboard-first navigation in SmarkForm-powered forms

Check it out:

#FrontEndFraternity #CSS #JavaScript #HTML #VanillaJS

📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

---

### LinkedIn

#### Public (general audience)

```
🚀 SmarkForm 0.13.0 is now available — and it's one of the most substantial releases to date!

SmarkForm is a lightweight, zero-dependency HTML form enhancement library. It handles complex
form scenarios — dynamic lists, nested structures, data import/export, keyboard shortcuts — purely
through HTML attributes and a tiny JavaScript constructor. No framework required.

Here's what 0.13.0 brings:

🕐 New component types: `time` and `datetime-local`
Both work just like the existing `date` and `number` types: null-aware, accepting Date objects,
epoch numbers, or ISO strings — always exporting a normalized value or null.

🔄 New `reset` action + default values
Any field, form, or list can now declare a `defaultValue` via its data-smark options. A new
`reset` trigger action restores to that state. This is distinct from `clear`, which wipes to
the type-level empty state. After `import()`, reset restores the imported data — making
"Load and Reset" patterns trivially easy.

⌨️ Keyboard UX: focus retention + flexible list minimums
When the last list item is removed, focus moves to the "Add item" button automatically.
And `min_items: 0` now coexists with pre-populated defaults.

🎨 Parametric SVG logo (8 variants)
Full, compact, monochrome, and dark/light versions — all generated from one Pug template.
Available on jsDelivr CDN, documented in a new Branding section of the docs.

📖 Full documentation overhaul
• End-User Guide for people filling in SmarkForm-powered forms
• Branding section with copy-paste badge snippets
• Code of Conduct
• Expanded FAQ with reset/default, null export, singleton, and API interface entries
• Pre-filled demo data throughout examples
• Printer-friendly page layouts
• Automatic light/dark color scheme for the docs site

🛠️ Developer experience
Visual render errors replace misconfigured components in the DOM, making mistakes visible
immediately. Singleton option merging now raises clear conflict errors.

If you build web applications and haven't tried SmarkForm yet, 0.13.0 is a great starting point:
🔗 https://smarkform.bitifet.net

#OpenSource #JavaScript #WebDev #Forms #FrontEnd #HTML #UX
```

#### Full Stack Titans

```
🚀 SmarkForm 0.13.0 — a solid framework-agnostic form library update.

For full-stack engineers building data-rich web UIs: SmarkForm manages complex form state
(nested objects, dynamic lists, import/export, keyboard navigation) from plain HTML attributes
with zero runtime dependencies.

What's new in 0.13.0:

Completion of the date/time type family:
• `time` — null-aware, accepts Date/epoch/HH:mm:ss, exports normalized ISO or null
• `datetime-local` — same interface for combined date+time inputs

Reset semantics finally formalized:
• `defaultValue` configurable per component via `data-smark` options
• New `reset` action distinct from `clear`
• `import()` updates the default by default (opt out with `setDefault: false`)

UX improvements:
• Focus retention when emptying a list — no keyboard flow break
• `min_items: 0` + pre-populated defaults now work together correctly

Documentation:
• End-User Guide, Branding section, Code of Conduct
• Expanded FAQ, pre-filled examples, printer-friendly layouts
• Auto dark/light color scheme

DX:
• Visual render errors in the DOM — no more silent misconfiguration
• Singleton option conflict detection

📦 npm install smarkform@0.13.0
🔗 https://smarkform.bitifet.net

#FullStack #JavaScript #OpenSource #WebDevelopment #HTML
```

#### Software Developer

```
🚀 SmarkForm 0.13.0 — the "get the foundations right" release.

This one completes several features that were partially in place and adds the connective tissue
that makes them work together cleanly.

What caught my attention building this:

The reset/clear distinction matters more than I expected. "Clear" removes everything; "reset"
restores to the last configured default. And because import() now updates that default, you can
build Load/Reset UX patterns that feel natural without any extra state management.

The focus retention on empty lists is one of those changes that feels tiny in a PR but massive
in actual use. When you remove the last item and the cursor disappears into the void, you lose
the user. This fix keeps the keyboard-first flow intact.

The time and datetime-local types also matter: before this, you had to wrap them in a generic
input and handle null/Date/ISO conversion yourself. Now SmarkForm does it.

Zero runtime dependencies. Works with or without a framework.

📦 npm i smarkform@0.13.0
🔗 https://github.com/bitifet/SmarkForm

#SoftwareDevelopment #JavaScript #OpenSource #WebDev #UX
```

#### CSS3/HTML5 The future of front end

```
🚀 SmarkForm 0.13.0 — the most HTML/CSS-native form library just got better.

SmarkForm is built on the idea that HTML attributes + CSS classes should drive form behavior.
No virtual DOM, no template language, no framework coupling.

0.13.0 highlights for the HTML/CSS crowd:

⏱️ time + datetime-local types: proper support for native date/time inputs, with null
awareness (which the browser gives you for free as "" but which JSON needs as null).

🌗 Auto color scheme: the docs site now switches between light and dark automatically using
CSS prefers-color-scheme media queries — no JavaScript involved in the decision, just a
logo switcher on top. Exactly how it should be done.

🎨 Parametric SVG logo: 8 variants generated from a single Pug template. The parameters
control colors, size, compact/full layout. Read about the approach:
→ dev.to/bitifet/generating-a-parametric-svg-logo-with-pug-8m0

🔄 reset vs clear in HTML: now you can add a reset button to any form with just:
<button data-smark='{"action":"reset"}'>Restore defaults</button>

And "defaults" can be set right in the HTML via the value option in data-smark.

#CSS3 #HTML5 #FrontEnd #JavaScript #OpenSource #SVG

📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### Software Development

```
🚀 SmarkForm 0.13.0 — developer-experience and completeness release.

SmarkForm handles complex HTML form state (nested objects, dynamic lists, keyboard shortcuts,
import/export) with zero runtime dependencies. 0.13.0 focuses on making the existing foundation
more complete and ergonomic.

Key additions:

New component types:
• time — null-aware time field, accepts Date/epoch/ISO
• datetime-local — null-aware combined date+time field

Default value semantics:
• Configure defaultValue via data-smark value option
• reset action restores to defaultValue (vs. clear which wipes to empty)
• import() updates defaultValue so Load+Reset patterns work naturally

UX improvements:
• Focus retention when lists become empty (keyboard flow preserved)
• min_items:0 + value-populated defaults now work together

Documentation:
• End-User Guide (for form fillers), Branding section, Code of Conduct
• Expanded FAQ, printer-friendly layouts, pre-filled demo data
• Auto light/dark color scheme

DX:
• Visual DOM error nodes for render errors (no silent failures)
• Singleton option conflict detection

📦 npm install smarkform@0.13.0
🔗 https://smarkform.bitifet.net

#SoftwareDevelopment #JavaScript #OpenSource #WebDev #DX
```

#### Software Engineering

```
🚀 SmarkForm 0.13.0 — completeness and correctness.

Engineering notes on what changed and why it matters:

Component type coverage:
The `time` and `datetime-local` types complete the date/time family.
All four now share the same null-aware contract: accept Date/epoch/ISO, export normalized ISO
or null. The implementation validates the target element type at render time, producing a visual
error node if wrong — fail-fast during development, not silently at runtime.

Default value and reset semantics:
`defaultValue` is now a first-class concept. Fields set it from the `value` option or HTML
attribute. `reset()` restores to it. `import()` updates it by default (`setDefault:true`).
This makes the common Load+Reset flow trivially correct without extra state management.

Focus retention:
The `focusretention` decorator on the list's `removeItem` method moves focus to the first
available `addItem` trigger when the list hits zero items. Small decorator, real UX impact.

Error detection:
`renderError()` on every component replaces the target DOM node with a styled error node on
misconfiguration. This turns silent, hard-to-debug failures into immediately visible problems.

Test suite: 118 Playwright tests across Chromium, Firefox, and WebKit.
Zero runtime dependencies.

📦 npm install smarkform@0.13.0
🔗 https://github.com/bitifet/SmarkForm

#SoftwareEngineering #JavaScript #OpenSource #WebDevelopment
```

---

## Security Notes

No open vulnerabilities after `npm audit`. Audit run on 2026-02-27 before cutting the release:

```
found 0 vulnerabilities
```

---

## Manual Steps Reminder

> ⚠️ The following steps are **NOT automated**. The user must perform them manually after
> reviewing and merging this PR.

### 1. Squash and commit

After the PR is reviewed and approved:

```bash
git checkout main
git merge --squash copilot/prepare-release-0-13-0
git commit -m "Version 0.13.0"
```

### 2. Tag the release

```bash
git tag 0.13.0
git push origin 0.13.0
```

### 3. Create GitHub Release

- Go to: https://github.com/bitifet/SmarkForm/releases/new
- Tag: `0.13.0`
- Title: `Version 0.13.0`
- Body: copy from **Release Notes Summary** section above
- Publish the release

### 4. Publish to npm

```bash
npm publish
```

### 5. Rebase stable branch

```bash
git checkout stable
git rebase main
git push origin stable
```

### 6. Remove this file

Delete `RELEASE_PREP.md` before or as part of the squash commit. It should not appear in the
final `main` history.
