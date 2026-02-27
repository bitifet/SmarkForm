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

<Channel: https://t.me/smarkform>

---

🚀 **SmarkForm 0.13.0 is out!**

A lot of time has passed since the last SmarkForm release, but it has not been in vain.

SmarkForm 0.13.0 brings many small improvements that, together, make it a much more complete and mature solution.

From a deep revision of the documentation (now printer and dark mode friendly) that includes new FAQs and a simple but complete illustrated guide for end-users, to multiple improvements and bug fixes, passing through a new brand image with its new SVG logo; this new version represents an important step forward in the evolution of the library.

Carefully attending to every detail, from the workflows in the development process but especially putting emphasis on a user experience that is more intuitive and accessible than ever, SmarkForm 0.13.0 is a release that I'm very proud of and that I hope will be very useful for all of you.

---

🤖 **AI-agent ready**

SmarkForm's clean, declarative API makes it a natural fit for AI-assisted development. Describe a form in plain language to any capable AI assistant and get complete, working code immediately — no bespoke tooling, no framework setup.

To put this to the test, the new example on the documentation's landing page was generated 100% by an AI assistant, with no further tweaks. It works perfectly out of the box, which speaks for itself.

Check the dedicated **AI and Agents resources** section for prompts, patterns, and guidance on getting the best results: https://smarkform.bitifet.net/about/ai

---

⌨️ **UX improvements**

This release chases perfection in the day-to-day experience of using SmarkForm-powered forms:

- **Better focus management**: Lists now retain keyboard focus when they become empty, automatically moving it to the "Add item" button so users never lose their place.
- **Default values**: Any field, form, or list can declare a default value directly in its `data-smark` options — a clean, declarative way to set the starting state.
- **New `reset` action**: A dedicated `reset` trigger restores the form to its configured defaults. This is intentionally distinct from `clear`, which wipes to the empty state — because "restore defaults" and "wipe everything" are different user intents.
- **`import()` updates the default**: After loading data, `reset` brings you back to *that* loaded state, not only the HTML initialization state. "Load and Reset" patterns just work.
- **Flexible list minimums**: `min_items: 0` (fully emptiable lists) and pre-populated defaults makes flexibility (allowing for 0 items) and usability (starting with 1, probably with handy defaults) to converge without friction.
- And a number of smaller behavioral tweaks and bug fixes throughout, always chasing that last bit of consistency.

---

🛠️ **DX improvements**

The development experience has also seen significant improvements:

- **Fixed workflow issues**: The test-pick script gains "repeat last" and "test with all" options; the schedule example migrates to CSS grid to fix layout issues in narrow viewports.
- **Visual DOM error nodes**: Misconfigured components are now replaced in the DOM by a visible error badge with a short error code — clickable to re-log the full error to the console. No more silent failures that are hard to track down.
- **Singleton option conflict detection**: When a wrapper component and its inner field both declare options for the same key, a clear render error is raised immediately instead of silently ignoring one of them.

---

🎨 **New SVG logo — generated with Pug!**

SmarkForm now has a proper brand identity: 8 SVG logo variants covering light/dark backgrounds, compact/full sizes, and monochrome versions — all generated from a single parametric Pug template.

The approach is documented in an article on dev.to if you're curious about the technique:
📝 https://dev.to/bitifet/generating-a-parametric-svg-logo-with-pug-8m0

All variants are available on jsDelivr CDN. The new **Branding section** in the docs has copy-paste badge snippets, placement guidelines, and a link pattern for SmarkForm-powered applications to include it if they like as a quality seal and feature hint for their users..

---

📖 **Documentation overhaul**

The 0.13.0 documentation is the most complete yet:

- A new **End-User Guide** written for people filling in SmarkForm-powered forms (not just developers), covering keyboard navigation, hotkey discovery, and list management.
- Expanded **FAQ** with new entries for default values, reset, null exports, singletons, and the upcoming API interface.
- Examples throughout the docs now have **pre-filled demo data** so you can see what each form does at a glance.
- **Printer-friendly** page layouts — the print stylesheet is now built into the chapter template.
- **Automatic light/dark theme** — the docs site detects your OS color-scheme preference and switches automatically, no config needed.
- A **Code of Conduct** is now part of the project.

---

🔗 **Documentation:** https://smarkform.bitifet.net

Stay up to date by following the official **Telegram channel**: https://t.me/smarkform

For questions, ideas, and suggestions, join the conversation in the **Telegram community chat** or open a discussion in the **GitHub brainstorm**:
🐙 https://github.com/bitifet/SmarkForm

---

📦 **Additional resources**

- NPM: https://www.npmjs.com/package/smarkform
- GitHub: https://github.com/bitifet/SmarkForm
- AI & Agents resources: https://smarkform.bitifet.net/about/ai

---

## Social Media Texts

> All variants below are fully written and ready to copy. Adjust emoji or tone to taste.

### Twitter / X

#### Public (general audience)

```
🚀 SmarkForm 0.13.0 — one of the biggest updates yet!

✨ time & datetime-local types
🔄 reset action + default values
⌨️ Focus stays in lists
🤖 AI-agent ready
📖 End-User Guide + auto dark mode

Pure HTML. Zero deps.

#OpenSource #JavaScript #WebDev
🔗 https://smarkform.bitifet.net
```

#### Frontend Developers

```
🚀 SmarkForm 0.13.0 — big frontend update!

time/datetime-local types, null-aware.
reset ≠ clear: restore defaults, not wipe.
Focus stays when last item removed.
Auto dark mode docs.

Pure HTML.

#FrontEnd #JavaScript #Forms
📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### HTML-driven devs

```
🚀 SmarkForm 0.13.0 is out!

Pure HTML form power, now with:
- time & datetime-local types
- reset via data-smark (restore defaults)
- Focus stays when list empties

No framework. Zero deps.

#HTML #VanillaJS #WebDev
📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### Open Source Contributors

```
🚀 SmarkForm 0.13.0 shipped!

New types, reset action, focus retention,
SVG logo, End-User Guide, Code of Conduct...

More documented & contributor-friendly than ever.
Contributions welcome!

#OpenSource #JavaScript
📦 npm i smarkform@0.13.0
🐙 https://github.com/bitifet/SmarkForm
```

#### Software Engineering

```
🚀 SmarkForm 0.13.0 — clean API, zero deps.

• time + datetime-local (null-aware)
• reset vs clear — defaults vs empty
• import() updates default
• Focus retention on lists
• Visual render errors, conflict detection

#SoftwareEngineering #JavaScript
🔗 https://smarkform.bitifet.net
```

#### Build in Public

```
🚀 Shipped SmarkForm 0.13.0!

✅ time + datetime-local types
✅ reset + default values
✅ Focus retention on empty lists
✅ AI-agent ready (landing page: 100% AI!)
✅ Auto dark/light docs + 118 tests ✅

#BuildInPublic #OpenSource
📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### I can code

```
🚀 SmarkForm 0.13.0 — packed!

time & datetime-local (null-aware).
reset restores defaults, not just clear.
Focus stays in lists — keyboard UX win!
Landing page: 100% AI-generated 🤖
New SVG logo 🎨

#ICanCode #JavaScript
📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### Tech Founders

```
🚀 SmarkForm 0.13.0 — form infra upgrade.

• time + datetime-local types (null-aware)
• Reset to defaults (distinct from clear)
• import() updates default — Load+Reset works
• AI-agent ready: generate forms by description

#TechFounders #JavaScript
🔗 https://smarkform.bitifet.net
```

#### Web Developers

```
🚀 SmarkForm 0.13.0 is live!

⏱️ time + datetime-local types
🔄 reset action (restores defaults)
⌨️ Focus stays in lists
🤖 AI-agent ready (landing page: 100% AI!)
🌗 Auto dark/light docs

#WebDev #JavaScript #Forms
📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### Tech Twitter

```
🚀 SmarkForm 0.13.0 dropped.

time + datetime-local types complete the date/time set.
Also: reset action, focus retention, AI-agent ready docs,
SVG logo from Pug, End-User Guide, auto dark/light.

#TechTwitter #JavaScript
📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### Javascript

```
🚀 SmarkForm 0.13.0 — vanilla-JS update.

✨ time + datetime-local types (null-aware)
🔄 reset vs clear — restore defaults or wipe
⌨️ Focus retention on empty lists
🤖 AI-agent ready — declarative API

#JavaScript #VanillaJS
📦 npm i smarkform@0.13.0
🔗 https://smarkform.bitifet.net
```

#### Actually Build in Public

```
📦 SmarkForm 0.13.0 shipped.

- time + datetime-local (null-aware)
- reset action + defaultValue
- Focus retention on empty lists
- AI-agent ready — landing page: 100% AI!

118 tests ✅

#ActuallyBuildInPublic #OpenSource
🔗 https://smarkform.bitifet.net
🐙 https://github.com/bitifet/SmarkForm
```

#### Front End Fraternity

```
🚀 SmarkForm 0.13.0 — for HTML/CSS/JS purists.

→ time + datetime-local (null-aware)
→ reset in data-smark (restores defaults)
→ Auto light/dark via CSS prefers-color-scheme
→ AI-agent ready: describe a form, get code

#FrontEndFraternity #VanillaJS
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

🤖 AI-agent ready
SmarkForm's clean, declarative API makes it a natural fit for AI-assisted development.
The new documentation landing page example was generated 100% by an AI assistant, with no
further tweaks. Dedicated AI & Agents resources: https://smarkform.bitifet.net/about/ai

🎨 Parametric SVG logo (8 variants)
All generated from one Pug template. Available on jsDelivr CDN, documented in a new Branding
section of the docs.

📖 Full documentation overhaul
• End-User Guide for people filling in SmarkForm-powered forms
• Branding section with copy-paste badge snippets
• Code of Conduct
• Expanded FAQ, pre-filled demo data, printer-friendly layouts
• Automatic light/dark color scheme for the docs site

🛠️ Developer experience
Visual render errors replace misconfigured components in the DOM. Singleton option merging
now raises clear conflict errors.

🔗 Docs: https://smarkform.bitifet.net
📦 NPM: https://www.npmjs.com/package/smarkform
🐙 GitHub: https://github.com/bitifet/SmarkForm
🤖 AI resources: https://smarkform.bitifet.net/about/ai
💬 Community: https://t.me/smarkform

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

AI-agent ready:
• Declarative API + zero tooling = natural fit for AI-generated forms
• Resources: https://smarkform.bitifet.net/about/ai

Documentation & DX:
• End-User Guide, Branding section, Code of Conduct
• Expanded FAQ, pre-filled examples, printer-friendly layouts
• Auto dark/light color scheme
• Visual render errors in the DOM, singleton option conflict detection

🔗 https://smarkform.bitifet.net
📦 https://www.npmjs.com/package/smarkform
🐙 https://github.com/bitifet/SmarkForm

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

And the AI-agent readiness is worth calling out: the docs landing page now has an example that
was generated 100% by AI, with no further tweaks. The declarative approach makes it uniquely
suited to AI-assisted development.

Zero runtime dependencies. Works with or without a framework.

🔗 https://smarkform.bitifet.net
📦 https://www.npmjs.com/package/smarkform
🐙 https://github.com/bitifet/SmarkForm
🤖 https://smarkform.bitifet.net/about/ai

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

🎨 Parametric SVG logo: 8 variants generated from a single Pug template. Read about the
approach: https://dev.to/bitifet/generating-a-parametric-svg-logo-with-pug-8m0

🔄 reset vs clear in HTML: add a reset button to any form with just:
<button data-smark='{"action":"reset"}'>Restore defaults</button>
Defaults are set right in the HTML via the value option in data-smark.

🤖 AI-agent ready: describe a form, get working code. The declarative approach means any
capable AI assistant can generate correct SmarkForm markup from a plain-language description.

🔗 https://smarkform.bitifet.net
📦 https://www.npmjs.com/package/smarkform
🤖 https://smarkform.bitifet.net/about/ai

#CSS3 #HTML5 #FrontEnd #JavaScript #OpenSource #SVG
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

AI-agent ready:
• Declarative API is a natural fit for AI code generation
• Landing page example generated 100% by AI, no tweaks
• Resources: https://smarkform.bitifet.net/about/ai

DX:
• Visual DOM error nodes for render errors (no silent failures)
• Singleton option conflict detection

🔗 https://smarkform.bitifet.net
📦 https://www.npmjs.com/package/smarkform
🐙 https://github.com/bitifet/SmarkForm

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
misconfiguration. Fail-fast during development, not silently at runtime.

AI-agent readiness:
The declarative, self-describing data-smark API makes SmarkForm uniquely suited to AI code
generation. Resources: https://smarkform.bitifet.net/about/ai

Test suite: 118 Playwright tests across Chromium, Firefox, and WebKit.
Zero runtime dependencies.

🔗 https://smarkform.bitifet.net
📦 https://www.npmjs.com/package/smarkform
🐙 https://github.com/bitifet/SmarkForm

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
