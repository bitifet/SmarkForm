# Release Prep: 0.13.1

## Release Notes Summary

SmarkForm 0.13.1 is a focused bug-fix and polish release on top of 0.13.0. It delivers a new `submit` action for form components (with full URL-encoded, JSON, and `mailto:` transport support), fixes a `setDefault` propagation bug where descendants incorrectly inherited the default-update flag, resolves nested sub-form data being silently lost when using the `value` constructor option, and adds missing `await` calls across the codebase. Documentation receives responsive sidebar/TOC improvements and FAQ updates. A new `demoValue` round-trip smoke-test infrastructure validates all co-located documentation examples automatically.

### Features

- **`submit` action** for the `form` component type: submits the form with configurable encoding (`urlencoded`, `json`) and transport (`fetch`, `xhr`, `native`, `mailto:`), including `formaction`/`formmethod` overrides and Enter-key prevention.
- **`demoValue` round-trip smoke tests**: co-located documentation examples can now declare a `demoValue` that is automatically imported and re-exported to verify round-trip fidelity.

### Bug Fixes

- Fixed `setDefault` propagation: descendants now always receive `setDefault:false` during an import; only the directly targeted field updates its stored default value.
- Fixed nested sub-form data being silently discarded when the `value` constructor option was provided.
- Fixed missing `await` on async calls across the codebase (could cause intermittent data-race issues).
- Fixed `sampletabs` import button: it now passes `setDefault:false` so that clicking **Clear** correctly restores the original sample data instead of the last-imported value.
- Fixed submit button inner-element click tracking and `mailto:` JSON encoding edge cases.
- Fixed Enter-key propagation so it no longer accidentally triggers `submit` on text inputs.

### Other

- Documentation: responsive sidebar typography, sticky TOC height cap, TOC counter rewritten via JS span injection, mobile nav font/padding improvements.
- Documentation: FAQ updated — form tag optionality, submit action entry, Enter/buttons/mailto Q&A.
- Dev-dependency: bumped `@rollup/plugin-babel` from 6.1.0 to 7.0.0.
- Agent/CI instructions updates.

### Proposed Commit Message (for the final squashed commit)

```
Version 0.13.1
```

---

## Telegram Announcement

<Channel: https://t.me/s/smarkform>

---

🚀 **SmarkForm 0.13.1 is out!**

This patch release brings a brand-new `submit` action for form components — complete with `fetch`/`xhr`/`native`/`mailto:` transports and JSON encoding — plus a raft of bug fixes around `setDefault` propagation, nested sub-form data, and missing awaits. The docs site now has a fully responsive sidebar/TOC and all co-located examples are validated by automated round-trip smoke tests.

Key highlights:
- ✨ New `submit` action: flexible form submission with multiple transports & encodings
- 🐛 `setDefault` propagation fixed — only the targeted field updates its default
- 🧪 `demoValue` smoke tests for all co-located documentation examples

📦 npm: `npm install smarkform@0.13.1`
🔗 Docs: https://smarkform.bitifet.net
📝 Changelog: https://github.com/bitifet/SmarkForm/releases/tag/0.13.1

---

## Social Media Texts

> All variants below are fully written and ready to copy. Adjust emoji or tone to taste.

### Twitter / X

#### Public (general audience)

```
#SmarkForm 0.13.1 released!

✨ New `submit` action: fetch/xhr/native/mailto:, urlenc/JSON — declarative HTML.

🐛 setDefault fix, nested sub-form data loss & missing awaits fixed.

#OpenSource #JavaScript #WebDev #Forms

📦 npm i smarkform@0.13.1
🔗 https://smarkform.bitifet.net
```

#### Frontend Developers

```
#SmarkForm 0.13.1 is out 🎉

✨ `submit` action — fetch/xhr/native/mailto:, urlenc/JSON, declarative.
🐛 setDefault fix: only targeted field updates default.
🧪 demoValue round-trip tests.

#FrontEnd #JavaScript #Forms

📦 npm i smarkform@0.13.1
🔗 https://smarkform.bitifet.net
```

#### HTML-Driven Devs

```
#SmarkForm 0.13.1 — declarative form submission arrives 🚀

Add a `submit` action: choose transport (fetch/native/mailto:) and encoding (urlencoded/json) — zero JS.

#HTML #WebComponents #NoFramework #Forms

📦 npm i smarkform@0.13.1
🔗 https://smarkform.bitifet.net
```

#### Open Source Contributors

```
#SmarkForm 0.13.1 is live! 🛠️

New submit action, demoValue tests, setDefault & await fixes.

Contributions welcome — every PR counts! 🙏

#OpenSource #JavaScript

📦 npm i smarkform@0.13.1
🔗 https://github.com/bitifet/SmarkForm
```

#### Software Engineering

```
#SmarkForm 0.13.1 ships a new `submit` action:
• Transport: fetch · xhr · native · mailto:
• Encoding: urlencoded / json
• formaction/formmethod overrides
• Enter-key prevention built-in

All declarative HTML. #JavaScript #SoftwareEngineering

📦 npm i smarkform@0.13.1
```

#### Build in Public

```
Just shipped #SmarkForm 0.13.1 🚢

New submit action + fixing a subtle setDefault bug (only the targeted field updates its default).

Also added demoValue round-trip tests to validate all doc examples automatically.

#buildinpublic #indiedev
```

#### I Can Code

```
#SmarkForm 0.13.1 is out!

You can now submit an HTML form with fetch/xhr/mailto: using just a data-smark attribute — no JS needed.

Perfect for learners who want powerful forms without a framework 🙌

#icancode #learntocode #JavaScript #HTML
```

#### Tech Founders

```
#SmarkForm 0.13.1:

If you build web products and need reliable HTML forms — this patch fixes data-loss bugs in nested sub-forms and adds a `submit` action with JSON encoding.

Less glue code. More shipping. #startup #founder #nocode #Forms
```

#### Web Developers

```
#SmarkForm 0.13.1 released 🚀

- New `submit` action (fetch/xhr/native/mailto:, urlencoded/json)
- setDefault propagation fix
- Nested sub-form data-loss fix
- Responsive sidebar/TOC docs improvements

#WebDev #JavaScript #OpenSource #Forms

📦 npm i smarkform@0.13.1
```

#### Tech Twitter

```
#SmarkForm 0.13.1 🧵

1/ New `submit` action — fetch/xhr/native/mailto:, urlenc/JSON, declarative.
2/ setDefault fixed — child fields don't inherit parent's default update.
3/ demoValue smoke tests validate all doc examples.

#JavaScript #WebDev
```

#### JavaScript

```
#SmarkForm 0.13.1 🟨

New: declarative `submit` action for forms (fetch/xhr/native/mailto:, urlencoded/json)
Fixed: setDefault propagation, nested sub-form data loss, missing awaits
Added: demoValue round-trip smoke tests

#JavaScript #JS #OpenSource

📦 npm i smarkform@0.13.1
```

#### Actually Build in Public

```
Shipped #SmarkForm 0.13.1 tonight.

The new submit action posts form data to an API or encodes as JSON for mailto: — one HTML attribute.

Also fixed a setDefault propagation bug that lurked for a few releases.

#actuallybuildingit #buildinpublic
```

#### Front End Fraternity

```
#SmarkForm 0.13.1 for #FrontEndFraternity 🤝

✨ `submit` action — fetch/xhr/mailto:, urlenc/JSON
🐛 setDefault: only targeted field updates default
🧪 Round-trip tests for every doc example

#FrontEnd #JavaScript #HTML

📦 npm i smarkform@0.13.1
🔗 https://smarkform.bitifet.net
```

---

### LinkedIn Article

#### Content

**Title:** SmarkForm 0.13.1: Declarative Form Submission, `setDefault` Fix & Automated Doc Tests

**Intro paragraph:**

SmarkForm 0.13.1 is now available. While it's a patch release, it brings one genuinely new capability — a `submit` action for the `form` component type — alongside a batch of important bug fixes and infrastructure improvements. Here's what changed and why it matters.

**Section: New `submit` action**

The `submit` action gives you declarative form submission without writing event-handling boilerplate. You choose the transport (`fetch`, `xhr`, native browser submit, or `mailto:`) and the encoding (`application/x-www-form-urlencoded` or `application/json`). `formaction` and `formmethod` overrides on individual submit buttons are respected, and Enter-key prevention is built in. A `BeforeAction_submit` event fires so you can intercept or cancel programmatically if needed.

**Section: Bug fixes**

The most impactful fix closes a `setDefault` propagation bug: when you called `import()` on a form or list, child fields were incorrectly inheriting the `setDefault:true` flag and overwriting their own stored defaults. Now only the directly targeted field updates its default; all descendants receive `setDefault:false`.

A second fix prevents nested sub-form data from being silently discarded when the `value` constructor option is provided. This was a silent data-loss bug that could go unnoticed in production.

Missing `await` calls scattered across the codebase are also resolved, closing potential async timing issues.

**Section: demoValue smoke tests**

Co-located documentation examples can now declare a `demoValue`. The test suite will automatically import that value and re-export it, verifying round-trip fidelity. This means a documentation example that accidentally uses a wrong format (e.g. `"12:30"` instead of `"12:30:00"` for a time field) will fail the test suite immediately.

**Section: Documentation**

The docs site sidebar and TOC received a responsive overhaul: sticky TOC height is now capped to prevent scroll clipping, TOC counters are rendered via JS span injection for reliability, and mobile nav typography was improved. The FAQ was updated with entries for the `submit` action, form-tag optionality, and Enter-key behaviour.

**Closing:**

As always, you can install via `npm install smarkform@0.13.1`. Full changelog: https://github.com/bitifet/SmarkForm/releases/tag/0.13.1

> **Note:** The changelog link above will only be live after completing the GitHub Release step in the Manual Steps section below. Verify the link is active before posting.

#### Hero Image Prompt

A clean flat-design illustration of an HTML form with a stylised "submit" button glowing in the brand accent colour. A JSON payload floats nearby, connected by a dashed line to a server icon. The SmarkForm logo appears top-left. Palette: white background, dark-navy text, SmarkForm brand gradient accent (indigo → teal). Style: minimal, technical, professional.

### LinkedIn Posts

#### Full Stack Titans

```
🚀 SmarkForm 0.13.1 is live — and it's a meaningful patch for full-stack developers.

The headline addition is a new `submit` action for the `form` component type. It gives you declarative control over how form data is serialised and sent:
  • Transports: fetch · XHR · native browser submit · mailto:
  • Encodings: URL-encoded or JSON
  • Respects formaction/formmethod button overrides

On top of that, this release fixes a setDefault propagation bug (child fields were incorrectly inheriting the parent's default-update flag) and a silent data-loss issue in nested sub-forms.

If you're building full-stack web apps that rely on server-side form processing, this one is worth the upgrade.

🔗 https://smarkform.bitifet.net

#FullStack #JavaScript #WebDev #Forms #OpenSource
```

#### Software Developer

```
🛠️ SmarkForm 0.13.1 — patch release notes for developers:

• New: `submit` action — configure transport & encoding declaratively in HTML
• Fixed: setDefault propagation — descendants no longer inherit parent's default-update flag
• Fixed: nested sub-form data silently discarded with `value` constructor option
• Fixed: missing `await` on async calls (potential race conditions resolved)
• Added: demoValue round-trip smoke tests for co-located documentation examples

Full changelog: https://github.com/bitifet/SmarkForm/releases/tag/0.13.1

#SoftwareDevelopment #JavaScript #OpenSource #WebDev
```

#### CSS3/HTML5 The Future of Front End

```
💡 SmarkForm 0.13.1 brings declarative form submission to HTML.

With the new `submit` action, you can configure how your form is submitted — fetch, XHR, native, or even mailto: with JSON — purely through `data-smark` attributes. No JavaScript required in your templates.

This fits squarely into the HTML-first, progressive-enhancement philosophy that CSS3/HTML5 front-end development has always championed.

Give it a try: npm install smarkform@0.13.1
🔗 https://smarkform.bitifet.net

#HTML5 #CSS3 #FrontEnd #ProgressiveEnhancement #WebDev
```

#### Software Development

```
📦 SmarkForm 0.13.1 released.

This patch introduces a `submit` action with multiple transport/encoding options (fetch · XHR · native · mailto:, urlencoded · JSON) and fixes a `setDefault` propagation issue that caused child components to incorrectly inherit a parent's default-value update during `import()`. Nested sub-form data loss and missing async awaits are also resolved.

A new `demoValue` round-trip test infrastructure validates all documentation examples automatically — ensuring documentation stays accurate as the library evolves.

#SoftwareDevelopment #JavaScript #OpenSource #Testing
```

#### Software Engineering

```
🔬 SmarkForm 0.13.1: lessons from a subtle async bug

This release includes a fix for missing `await` calls across the codebase. These were cases where an async function was called without `await`, meaning errors could be silently swallowed and execution could continue in an indeterminate state.

Finding these is a good reminder: in JavaScript, forgetting `await` doesn't throw — it just does the wrong thing quietly. Worth auditing your own async call sites if you maintain a library.

Patch also includes a new `submit` action, setDefault propagation fix, and demoValue round-trip tests.

Full notes: https://github.com/bitifet/SmarkForm/releases/tag/0.13.1

#SoftwareEngineering #JavaScript #AsyncAwait #CodeQuality #OpenSource
```

---

## Security Notes

No open vulnerabilities after `npm audit fix`.

`npm audit` reported 0 vulnerabilities before and after the release preparation. No `--force` flag was required.

---

## Manual Steps (for the user to perform after review)

Once you have reviewed this document and are happy with the release notes, perform the following steps **manually** in the order listed:

1. **Squash and commit the PR branch to `main`**:
   ```bash
   git checkout main
   git merge --squash copilot/prepare-0131-release
   git commit -m "Version 0.13.1"
   ```

2. **Tag the release**:
   ```bash
   git tag 0.13.1
   git push origin main
   git push origin 0.13.1
   ```

3. **Create the GitHub Release** via the GitHub web UI:
   - Tag: `0.13.1`
   - Title: `SmarkForm 0.13.1`
   - Body: copy the Release Notes Summary and bullets from this document.
   - URL: https://github.com/bitifet/SmarkForm/releases/new?tag=0.13.1

4. **Publish to npm**:
   ```bash
   npm publish
   ```

5. **Rebase the `stable` branch**:
   ```bash
   git checkout stable
   git rebase main
   git push origin stable
   ```

6. **Post announcements** using the Telegram and social media texts above.

7. **Delete this file** (`RELEASE_PREP.md`) after completing the above steps.
