# Release Prep: 0.13.1

## Release Notes Summary

SmarkForm 0.13.1 is an improvement and polish release on top of 0.13.0. It includes several bug fixes and mobile accessibility improvements to the documentation. As a bonus, it finally enhances the native `<form>` with configurable graceful degradation for nested data, mimicking commonly used patterns, plus a non-standard `enctype="application/json"`. Standard enctypes perform a real form submit under the hood, providing support for any standard configuration (including `mailto:` URLs), while the new JSON transport option provides real JSON transport and enables all HTTP methods — such as `PUT` and `PATCH` — which are not supported by the standards.

### Features

- **`submit` action** for the `form` component type: enhances the native `<form>` element with configurable graceful degradation for nested data, mimicking commonly used serialisation patterns. Standard enctypes (`application/x-www-form-urlencoded`, `multipart/form-data`) perform a real browser form submit under the hood — supporting any standard configuration, including `mailto:` URLs. The non-standard `enctype="application/json"` provides genuine JSON transport and unlocks all HTTP methods, including `PUT` and `PATCH`, which the HTML standard does not support. Individual submit buttons can override the action URL and method via `formaction`/`formmethod`, and Enter-key prevention is built in.
- **`demoValue` round-trip smoke tests**: co-located documentation examples can now declare a `demoValue` that is automatically imported and re-exported to verify round-trip fidelity, keeping documentation accurate as the library evolves.

### Bug Fixes

- Fixed `setDefault` propagation: only the directly targeted field updates its stored default; descendants now always receive `setDefault:false` during an import.
- Fixed nested sub-form data being silently discarded when the `value` constructor option was provided.
- Fixed missing `await` on async calls across the codebase, resolving potential async timing issues.
- Fixed `sampletabs` import button to pass `setDefault:false`, so **Clear** correctly restores the original sample data rather than the last-imported value.
- Fixed submit button inner-element click tracking and `mailto:` JSON encoding edge cases.
- Fixed Enter-key propagation to prevent accidental `submit` triggers on text inputs.

### Other

- Documentation: responsive sidebar typography, sticky TOC height cap, TOC counters via JS span injection, improved mobile nav font and padding.
- Documentation: FAQ updated with entries for form tag optionality, the new `submit` action, and Enter-key / buttons / `mailto:` behaviour.
- Dev-dependency: `@rollup/plugin-babel` bumped from 6.1.0 to 7.0.0.
- Agent/CI instruction updates.

### Proposed Commit Message (for the final squashed commit)

```
Version 0.13.1
```

---

## Telegram Announcement

<Channel: https://t.me/s/smarkform>

---

🚀 **SmarkForm 0.13.1 is out!**

An improvement and polish release on top of 0.13.0, delivering several bug fixes and mobile accessibility improvements to the documentation site.

The headline addition is a new `submit` action that enhances the native `<form>` element with something it always lacked: configurable graceful degradation for nested data. Standard enctypes (`urlencoded`, `multipart/form-data`) perform a real browser form submit under the hood — full `mailto:` support included. The non-standard `enctype="application/json"` goes further, providing genuine JSON transport and enabling HTTP methods like `PUT` and `PATCH` that the standard does not support.

Highlights:
- ✨ New `submit` action — real browser submit for standard enctypes (incl. `mailto:`), JSON transport for PUT/PATCH
- 🐛 `setDefault` propagation fix — only the targeted field updates its default
- 🐛 Nested sub-form data loss fix
- 📱 Mobile accessibility improvements and responsive docs sidebar/TOC

📦 `npm install smarkform@0.13.1`
🔗 Docs: https://smarkform.bitifet.net
📝 Changelog: https://github.com/bitifet/SmarkForm/releases/tag/0.13.1

---

## Social Media Texts

> All variants below are fully written and ready to copy. Adjust emoji or tone to taste.

### Twitter / X

#### Public (general audience)

```
#SmarkForm 0.13.1 is out!

Polish release: bug fixes, mobile accessibility doc improvements, and a new `submit` action that enhances native <form> — real browser submit for standard enctypes (mailto: included), JSON transport for PUT/PATCH.

#JavaScript #WebDev #OpenSource #Forms

📦 npm i smarkform@0.13.1
🔗 https://smarkform.bitifet.net
```

#### Frontend Developers

```
#SmarkForm 0.13.1 🎉

New `submit` action enhances native <form>:
• Standard enctypes → real browser submit (mailto: supported)
• JSON transport → enables PUT, PATCH and other non-standard methods

Plus setDefault fix, nested data loss fix, mobile doc improvements.

#FrontEnd #JavaScript #Forms

📦 npm i smarkform@0.13.1
```

#### HTML-Driven Devs

```
#SmarkForm 0.13.1 — native <form> finally gets what it was missing.

New `submit` action: graceful degradation for nested data, real browser submit for standard enctypes (incl. mailto:), and JSON transport for PUT/PATCH — all configurable in HTML.

#HTML #WebComponents #Forms

📦 npm i smarkform@0.13.1
🔗 https://smarkform.bitifet.net
```

#### Open Source Contributors

```
#SmarkForm 0.13.1 shipped! 🛠️

Polish release: new submit action, setDefault fix, nested data loss fix, and mobile accessibility improvements to the docs.

Contributions welcome! 🙏

#OpenSource #JavaScript

📦 npm i smarkform@0.13.1
🔗 https://github.com/bitifet/SmarkForm
```

#### Software Engineering

```
#SmarkForm 0.13.1:

New `submit` action delegates to a real browser form submit for standard enctypes — no XHR/fetch shim. Nested data is gracefully degraded to flat key patterns (configurable). JSON transport adds PUT/PATCH support.

#JavaScript #SoftwareEngineering

📦 npm i smarkform@0.13.1
```

#### Build in Public

```
Just shipped #SmarkForm 0.13.1 🚢

New submit action — real browser form submit under the hood, not a fetch shim. Nested data degrades gracefully to common flat-key patterns. JSON transport unlocks PUT/PATCH.

Also fixed a subtle setDefault propagation bug.

#buildinpublic #indiedev
```

#### I Can Code

```
#SmarkForm 0.13.1 is out!

You can now add a `submit` action to any HTML form — it does a real browser submit, supports mailto: links, and can send JSON for PUT/PATCH requests.

No JS boilerplate needed 🙌

#icancode #learntocode #JavaScript #HTML
```

#### Tech Founders

```
#SmarkForm 0.13.1:

If you build web products with HTML forms — this patch fixes data-loss bugs in nested sub-forms and adds a `submit` action with real browser submit (incl. mailto:) and JSON transport for PUT/PATCH.

Less glue code. More shipping. #startup #nocode #Forms
```

#### Web Developers

```
#SmarkForm 0.13.1 released 🚀

- New `submit` action: real browser submit for standard enctypes (mailto: supported), JSON transport for PUT/PATCH
- setDefault propagation fix
- Nested sub-form data-loss fix
- Mobile accessibility improvements in the docs

#WebDev #JavaScript #OpenSource

📦 npm i smarkform@0.13.1
```

#### Tech Twitter

```
#SmarkForm 0.13.1 🧵

1/ New `submit` action — standard enctypes do a real browser submit (mailto: included); JSON transport enables PUT, PATCH.
2/ Nested data gracefully degraded to common flat-key patterns.
3/ setDefault fix: child fields no longer inherit parent's default update.

#JavaScript #WebDev
```

#### JavaScript

```
#SmarkForm 0.13.1 🟨

New: `submit` action — real browser submit for urlencoded/multipart (incl. mailto:), JSON transport for PUT/PATCH
Fixed: setDefault propagation, nested sub-form data loss, missing awaits
Added: demoValue round-trip smoke tests, mobile doc accessibility

#JavaScript #JS #OpenSource

📦 npm i smarkform@0.13.1
```

#### Actually Build in Public

```
Shipped #SmarkForm 0.13.1 tonight.

New submit action delegates to a real browser form submit — not a fetch shim — with graceful degradation for nested data. JSON transport adds PUT/PATCH support.

Fixed a setDefault bug that quietly lurked for a few releases.

#actuallybuildingit #buildinpublic
```

#### Front End Fraternity

```
#SmarkForm 0.13.1 for #FrontEndFraternity 🤝

✨ `submit` action — real browser submit (incl. mailto:), JSON transport for PUT/PATCH
🐛 setDefault: only targeted field updates default
📱 Mobile accessibility improvements in the docs

#FrontEnd #JavaScript #HTML

📦 npm i smarkform@0.13.1
🔗 https://smarkform.bitifet.net
```

---

### LinkedIn Article

#### Content

**Title:** SmarkForm 0.13.1: Native Form Enhancement, Bug Fixes and Mobile-Friendly Docs

**Intro paragraph:**

SmarkForm 0.13.1 is now available. This is an improvement and polish release on top of 0.13.0 — several bug fixes, mobile accessibility improvements to the documentation site, and one notable feature addition: a `submit` action that enhances the native `<form>` element with capabilities the HTML standard has always left to third-party libraries.

**Section: New `submit` action**

The `submit` action gives SmarkForm forms configurable graceful degradation for nested data, mimicking commonly used serialisation patterns. When you use a standard enctype (`application/x-www-form-urlencoded` or `multipart/form-data`), SmarkForm performs a real browser form submit under the hood — not a fetch/XHR simulation. This means full compatibility with any standard server-side configuration, including `mailto:` URLs for email-based form workflows.

The non-standard `enctype="application/json"` takes things further: it sends a genuine JSON payload, unlocking HTTP methods that the HTML standard does not support — `PUT`, `PATCH`, and others. Individual submit buttons can override the action URL and method via `formaction`/`formmethod`, and Enter-key prevention is built in. A `BeforeAction_submit` event fires so you can intercept or cancel programmatically when needed.

**Section: Bug fixes**

The most impactful fix closes a `setDefault` propagation bug: when calling `import()` on a form or list, child fields were incorrectly inheriting the `setDefault:true` flag and overwriting their own stored defaults. Now only the directly targeted field updates its default; all descendants receive `setDefault:false`.

A second fix prevents nested sub-form data from being silently discarded when the `value` constructor option is provided — a silent data-loss bug that could go unnoticed in production.

Missing `await` calls scattered across the codebase are also resolved, closing potential async timing issues.

**Section: Mobile accessibility and documentation**

The documentation site received a responsive overhaul focused on mobile accessibility: sticky TOC height is now capped to prevent scroll clipping, TOC counters are rendered via JS span injection for reliability, and mobile nav typography and padding were improved. The FAQ was updated with entries for form tag optionality, the new `submit` action, and Enter-key behaviour.

**Section: demoValue smoke tests**

Co-located documentation examples can now declare a `demoValue`. The test suite automatically imports that value and re-exports it, verifying round-trip fidelity. A documentation example that accidentally uses an incorrect format will fail the test suite immediately — keeping documentation accurate as the library evolves.

**Closing:**

As always, install via `npm install smarkform@0.13.1`. Full changelog: https://github.com/bitifet/SmarkForm/releases/tag/0.13.1

> **Note:** The changelog link above will only be live after completing the GitHub Release step in the Manual Steps section below. Verify the link is active before posting.

#### Hero Image Prompt

A clean flat-design illustration of an HTML form connected to multiple transport channels: a browser form submit arrow, a JSON data stream, and a mailto: envelope. A small nested-data tree is shown flattening into a flat key-value list. The SmarkForm logo appears top-left. Palette: white background, dark-navy text, SmarkForm brand gradient accent (indigo → teal). Style: minimal, technical, professional.

### LinkedIn Posts

#### Full Stack Titans

```
🚀 SmarkForm 0.13.1 is live — a meaningful patch for full-stack developers.

The headline addition is a new `submit` action that enhances the native `<form>` element. Standard enctypes delegate to a real browser form submit under the hood — not a fetch/XHR shim — giving you full compatibility with server-side form handling and `mailto:` workflows. The non-standard `enctype="application/json"` enables genuine JSON transport and unlocks `PUT`, `PATCH`, and other HTTP methods the standard doesn't support.

This release also fixes a `setDefault` propagation bug (child fields were incorrectly inheriting the parent's default-update flag) and a silent data-loss issue in nested sub-forms.

If you're building full-stack apps that rely on server-side form processing, this one is worth the upgrade.

🔗 https://smarkform.bitifet.net

#FullStack #JavaScript #WebDev #Forms #OpenSource
```

#### Software Developer

```
🛠️ SmarkForm 0.13.1 — patch release notes for developers:

• New: `submit` action — real browser submit for standard enctypes (incl. mailto:), JSON transport for PUT/PATCH
• Fixed: setDefault propagation — descendants no longer inherit parent's default-update flag
• Fixed: nested sub-form data silently discarded with `value` constructor option
• Fixed: missing `await` on async calls (potential race conditions resolved)
• Added: demoValue round-trip smoke tests for co-located documentation examples

Full changelog: https://github.com/bitifet/SmarkForm/releases/tag/0.13.1

#SoftwareDevelopment #JavaScript #OpenSource #WebDev
```

#### CSS3/HTML5 The Future of Front End

```
💡 SmarkForm 0.13.1 brings native `<form>` enhancement to HTML.

The new `submit` action gives you configurable graceful degradation for nested form data. Standard enctypes do a real browser form submit — `mailto:` URLs work out of the box. The non-standard JSON transport adds PUT/PATCH for those who need it, all configured through `data-smark` attributes.

This fits squarely into the HTML-first, progressive-enhancement philosophy that CSS3/HTML5 front-end development has always championed.

npm install smarkform@0.13.1
🔗 https://smarkform.bitifet.net

#HTML5 #CSS3 #FrontEnd #ProgressiveEnhancement #WebDev
```

#### Software Development

```
📦 SmarkForm 0.13.1 released.

The headline feature is a `submit` action that enhances native `<form>` with nested data support: standard enctypes delegate to a real browser submit (including `mailto:` URLs), while `enctype="application/json"` provides genuine JSON transport and enables HTTP methods like `PUT` and `PATCH`.

This release also fixes a `setDefault` propagation issue that caused child components to incorrectly inherit a parent's default-value update during `import()`, and resolves a silent data-loss bug in nested sub-forms. A new `demoValue` round-trip test infrastructure validates all documentation examples automatically.

#SoftwareDevelopment #JavaScript #OpenSource #Testing
```

#### Software Engineering

```
🔬 SmarkForm 0.13.1: real browser submit vs. a fetch shim

The new `submit` action deliberately delegates to a real browser form submit for standard enctypes — not a fetch/XHR simulation. This preserves full browser-native compatibility (including `mailto:`) while still handling nested data through configurable graceful degradation to commonly used flat-key patterns.

This release also fixes missing `await` calls across the codebase — a good reminder that in JavaScript, a forgotten `await` doesn't throw; it just does the wrong thing quietly.

Patch also includes a setDefault propagation fix, a nested sub-form data-loss fix, and demoValue round-trip tests.

Full notes: https://github.com/bitifet/SmarkForm/releases/tag/0.13.1

#SoftwareEngineering #JavaScript #WebDev #CodeQuality #OpenSource
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
