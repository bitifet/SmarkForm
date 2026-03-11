# Release Prep: 0.13.1

## Release Notes Summary

SmarkForm 0.13.1 is an improvement and polish release on top of 0.13.0. It includes several bug fixes and mobile accessibility improvements to the documentation. As the headline, the documentation examples are now fully editable in the browser — readers can modify the source code of any example, hit **Run**, and see the result immediately, without leaving the page. As a bonus, the native `<form>` element is now fully supported: standard enctypes perform a real form submit under the hood (including `mailto:` URLs), while the non-standard `enctype="application/json"` provides genuine JSON transport and enables all HTTP methods — such as `PUT` and `PATCH` — which are not supported by the HTML standard.

### Features

- **Editable live documentation examples**: every example in the documentation can now be edited directly in the browser. Readers can tweak the HTML, CSS, or JavaScript, click **Run**, and see the updated result live — without leaving the page. This dramatically lowers the barrier to experimenting with SmarkForm and understanding how it works.
- **Native `<form>` support**: SmarkForm now works with the standard `<form>` element out of the box, including configurable graceful degradation for nested data to commonly used serialisation patterns. Standard enctypes (`application/x-www-form-urlencoded`, `multipart/form-data`) perform a real browser form submit under the hood — full `mailto:` support included. The non-standard `enctype="application/json"` provides genuine JSON transport and unlocks HTTP methods like `PUT` and `PATCH` that the HTML standard does not support.
- **`demoValue` round-trip smoke tests**: co-located documentation examples can now declare a `demoValue` that is automatically imported and re-exported to verify round-trip fidelity, keeping documentation accurate as the library evolves.

### Bug Fixes

- Fixed `setDefault` propagation: only the directly targeted field updates its stored default; descendants now always receive `setDefault:false` during an import.
- Fixed nested sub-form data being silently discarded when the `value` constructor option was provided.
- Fixed missing `await` on async calls across the codebase, resolving potential async timing issues.
- Fixed `sampletabs` import button to pass `setDefault:false`, so **Clear** correctly restores the original sample data rather than the last-imported value.
- Fixed submit button inner-element click tracking and `mailto:` JSON encoding edge cases.
- Fixed Enter-key propagation to prevent accidental form submissions on text inputs.

### Other

- Documentation: responsive sidebar typography, sticky TOC height cap, TOC counters via JS span injection, improved mobile nav font and padding.
- Documentation: FAQ updated with entries for form tag optionality and Enter-key / buttons / `mailto:` behaviour.
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

An improvement and polish release on top of 0.13.0, delivering several bug fixes, mobile accessibility improvements, and the biggest documentation upgrade since launch.

The headline: **every documentation example is now editable in the browser**. Edit the HTML, CSS, or JS, hit **Run**, and see the result immediately — without leaving the page. No sandbox to set up, no local install needed. Just open the docs and start playing.

As a bonus, the native `<form>` element is now fully supported: standard enctypes do a real browser form submit under the hood (including `mailto:` URLs), while `enctype="application/json"` provides genuine JSON transport and enables `PUT`, `PATCH`, and other HTTP methods the standard doesn't support.

Highlights:
- ✏️ **Editable examples** — edit source code in the docs and run it live
- 🧾 **Native `<form>` support** — real browser submit for standard enctypes, JSON transport for `PUT`/`PATCH`
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

Every documentation example is now editable in the browser. Tweak the code, hit Run, see the result — live, no setup needed.

Plus bug fixes, mobile accessibility improvements, and native <form> support with real browser submit and JSON transport.

#JavaScript #WebDev #OpenSource #Forms

📦 npm i smarkform@0.13.1
🔗 https://smarkform.bitifet.net
```

#### Frontend Developers

```
#SmarkForm 0.13.1 🎉

The docs now let you edit examples live in the browser. Change the HTML/CSS/JS, hit Run, see the result immediately.

Also: native <form> support — real browser submit for standard enctypes (mailto: included), JSON transport for PUT/PATCH.

#FrontEnd #JavaScript #Forms

📦 npm i smarkform@0.13.1
```

#### HTML-Driven Devs

```
#SmarkForm 0.13.1 — the docs just levelled up.

Every example is now editable in the browser. Edit the HTML, hit Run, and see what happens. No sandbox needed.

Also: native <form> fully supported, including mailto: and JSON transport for PUT/PATCH — all via data-smark attributes.

#HTML #WebComponents #Forms

📦 npm i smarkform@0.13.1
🔗 https://smarkform.bitifet.net
```

#### Open Source Contributors

```
#SmarkForm 0.13.1 shipped! 🛠️

Polish release: editable live docs examples, native <form> support, setDefault fix, nested data loss fix, and mobile accessibility improvements.

Contributions welcome! 🙏

#OpenSource #JavaScript

📦 npm i smarkform@0.13.1
🔗 https://github.com/bitifet/SmarkForm
```

#### Software Engineering

```
#SmarkForm 0.13.1:

Documentation examples are now editable live in the browser — edit, Run, iterate.

Native <form> support uses real browser submit for standard enctypes (no fetch shim), JSON transport for PUT/PATCH via enctype="application/json". Nested data degrades gracefully to configurable flat-key patterns.

#JavaScript #SoftwareEngineering

📦 npm i smarkform@0.13.1
```

#### Build in Public

```
Just shipped #SmarkForm 0.13.1 🚢

Editable live docs examples — you can now edit any example's source code and run it right there in the page.

Also added native <form> support: real browser submit under the hood, JSON transport for PUT/PATCH.

#buildinpublic #indiedev
```

#### I Can Code

```
#SmarkForm 0.13.1 is out!

The documentation now lets you edit and run the examples right in the page. Change the code, hit Run, and watch it work. Best way to learn how it works 🙌

#icancode #learntocode #JavaScript #HTML
```

#### Tech Founders

```
#SmarkForm 0.13.1:

The docs now have editable live examples — your team can experiment in the browser without setting up anything locally.

Also fixes data-loss bugs in nested sub-forms and adds full <form> support with real browser submit and JSON transport for PUT/PATCH.

Less friction. More shipping. #startup #nocode #Forms
```

#### Web Developers

```
#SmarkForm 0.13.1 released 🚀

- ✏️ Editable live documentation examples — edit source code and click Run
- 🧾 Native <form> support: real browser submit (mailto: included), JSON transport for PUT/PATCH
- 🐛 setDefault propagation fix
- 🐛 Nested sub-form data-loss fix
- 📱 Mobile accessibility improvements in the docs

#WebDev #JavaScript #OpenSource

📦 npm i smarkform@0.13.1
```

#### Tech Twitter

```
#SmarkForm 0.13.1 🧵

1/ Docs examples are now editable — change the source, hit Run, see the result live.
2/ Native <form> fully supported: real browser submit for standard enctypes (mailto: too), JSON transport for PUT/PATCH.
3/ setDefault fix: child fields no longer inherit parent's default update.

#JavaScript #WebDev
```

#### JavaScript

```
#SmarkForm 0.13.1 🟨

New: editable live docs examples (edit + Run in the browser)
New: native <form> support — real browser submit (urlencoded/multipart/mailto:), JSON transport for PUT/PATCH
Fixed: setDefault propagation, nested sub-form data loss, missing awaits
Added: demoValue round-trip smoke tests, mobile doc accessibility

#JavaScript #JS #OpenSource

📦 npm i smarkform@0.13.1
```

#### Actually Build in Public

```
Shipped #SmarkForm 0.13.1 tonight.

Made the documentation examples editable — readers can now tweak the source code and run it live in the browser. No sandbox, no setup. Just the docs.

Also landed native <form> support with real browser submit and JSON transport for PUT/PATCH.

#actuallybuildingit #buildinpublic
```

#### Front End Fraternity

```
#SmarkForm 0.13.1 for #FrontEndFraternity 🤝

✏️ Editable live docs examples — edit source code and Run in the browser
🧾 Native <form>: real browser submit (incl. mailto:), JSON transport for PUT/PATCH
🐛 setDefault: only targeted field updates default
📱 Mobile accessibility improvements in the docs

#FrontEnd #JavaScript #HTML

📦 npm i smarkform@0.13.1
🔗 https://smarkform.bitifet.net
```

---

### LinkedIn Article

#### Content

**Title:** SmarkForm 0.13.1: Live Editable Docs, Native Form Support, and Bug Fixes

**Intro paragraph:**

SmarkForm 0.13.1 is now available. This is an improvement and polish release on top of 0.13.0 — several bug fixes, mobile accessibility improvements to the documentation site, and a headline addition that changes how developers experience the documentation itself.

**Section: Live editable documentation examples**

Every example in the SmarkForm documentation is now editable directly in the browser. Readers can open any page, modify the HTML, CSS, or JavaScript in the example, click **Run**, and see the result immediately — live, in the page, with no setup required.

This is more than a quality-of-life improvement. It removes the biggest friction point in learning any library: the gap between reading about something and actually trying it. With editable examples, that gap disappears. You read, you experiment, you understand — all without leaving the documentation.

**Section: Native `<form>` support**

SmarkForm now works naturally with the standard `<form>` element, including configurable graceful degradation for nested data to commonly used serialisation patterns. Standard enctypes (`application/x-www-form-urlencoded`, `multipart/form-data`) perform a real browser form submit under the hood — not a fetch/XHR simulation. This means full compatibility with any standard server-side configuration, including `mailto:` URLs for email-based form workflows.

The non-standard `enctype="application/json"` goes further: it sends a genuine JSON payload, unlocking HTTP methods that the HTML standard does not support — `PUT`, `PATCH`, and others — all configurable through `data-smark` attributes.

**Section: Bug fixes**

The most impactful fix closes a `setDefault` propagation bug: when calling `import()` on a form or list, child fields were incorrectly inheriting the `setDefault:true` flag and overwriting their own stored defaults. Now only the directly targeted field updates its default; all descendants receive `setDefault:false`.

A second fix prevents nested sub-form data from being silently discarded when the `value` constructor option is provided — a silent data-loss bug that could go unnoticed in production.

Missing `await` calls scattered across the codebase are also resolved, closing potential async timing issues.

**Section: Mobile accessibility and documentation**

The documentation site received a responsive overhaul focused on mobile accessibility: sticky TOC height is now capped to prevent scroll clipping, TOC counters are rendered via JS span injection for reliability, and mobile nav typography and padding were improved.

**Section: demoValue smoke tests**

Co-located documentation examples can now declare a `demoValue`. The test suite automatically imports that value and re-exports it, verifying round-trip fidelity. A documentation example that accidentally uses an incorrect format will fail the test suite immediately — keeping documentation accurate as the library evolves.

**Closing:**

As always, install via `npm install smarkform@0.13.1`. Full changelog: https://github.com/bitifet/SmarkForm/releases/tag/0.13.1

> **Note:** The changelog link above will only be live after completing the GitHub Release step in the Manual Steps section below. Verify the link is active before posting.

#### Hero Image Prompt

A clean flat-design illustration of a browser window showing a code editor alongside a live form preview, with an arrow connecting them and a "Run" button in between. The SmarkForm logo appears top-left. Secondary element: a small `<form>` tag connected to transport channels (browser submit, JSON stream, mailto: envelope). Palette: white background, dark-navy text, SmarkForm brand gradient accent (indigo → teal). Style: minimal, technical, engaging.

### LinkedIn Posts

#### Full Stack Titans

```
🚀 SmarkForm 0.13.1 is live — and the documentation just got a whole lot better.

Every example in the docs is now editable in the browser. You can change the source code, hit Run, and see the result immediately. No sandbox, no local setup, no friction — just read, experiment, and understand.

This release also adds full support for the native <form> element: standard enctypes delegate to a real browser form submit under the hood (including mailto: workflows), while enctype="application/json" enables genuine JSON transport and unlocks PUT, PATCH, and other HTTP methods the standard doesn't support.

Plus: setDefault propagation fix, nested sub-form data-loss fix, and mobile accessibility improvements throughout the docs.

If you haven't tried SmarkForm yet, now is a great time to open the docs and just start playing.

🔗 https://smarkform.bitifet.net

#FullStack #JavaScript #WebDev #Forms #OpenSource
```

#### Software Developer

```
🛠️ SmarkForm 0.13.1 — release notes for developers:

• New: live editable documentation examples — edit source code and click Run in the browser
• New: native <form> support — real browser submit for standard enctypes (incl. mailto:), JSON transport for PUT/PATCH
• Fixed: setDefault propagation — descendants no longer inherit parent's default-update flag
• Fixed: nested sub-form data silently discarded with `value` constructor option
• Fixed: missing `await` on async calls (potential race conditions resolved)
• Added: demoValue round-trip smoke tests for co-located documentation examples

Full changelog: https://github.com/bitifet/SmarkForm/releases/tag/0.13.1

#SoftwareDevelopment #JavaScript #OpenSource #WebDev
```

#### CSS3/HTML5 The Future of Front End

```
💡 SmarkForm 0.13.1: the docs now let you experiment live in the browser.

Every example is editable — change the HTML, CSS, or JS, hit Run, and see what happens. Instant feedback, no setup needed. This is how documentation should work.

Also: native <form> is now fully supported. Standard enctypes do a real browser form submit — mailto: URLs work out of the box. The non-standard JSON transport adds PUT/PATCH for those who need it, all via data-smark attributes.

HTML-first, progressive-enhancement, zero JavaScript boilerplate.

npm install smarkform@0.13.1
🔗 https://smarkform.bitifet.net

#HTML5 #CSS3 #FrontEnd #ProgressiveEnhancement #WebDev
```

#### Software Development

```
📦 SmarkForm 0.13.1 released.

The headline feature is live editable documentation examples: every example in the docs can now be modified and run directly in the browser, giving readers an instant feedback loop for experimenting with the library.

This release also adds native <form> support with nested data handling: standard enctypes delegate to a real browser submit (including mailto: URLs), while enctype="application/json" provides genuine JSON transport and enables HTTP methods like PUT and PATCH.

Also fixed: setDefault propagation bug, nested sub-form data loss, missing awaits. Added demoValue round-trip test infrastructure for documentation accuracy.

#SoftwareDevelopment #JavaScript #OpenSource #Testing
```

#### Software Engineering

```
🔬 SmarkForm 0.13.1: documentation that you can run

Editable live examples are a design decision as much as a feature. The best way to understand a library's behaviour is to modify it and observe what changes. Static code snippets require a context switch; editable examples keep you in the flow.

Technical highlights: native <form> support uses a real browser form submit for standard enctypes — no fetch shim — with configurable graceful degradation for nested data. enctype="application/json" provides genuine JSON transport and unlocks PUT/PATCH.

Also fixed missing await calls across the codebase — a quiet reminder that in JavaScript, a forgotten await doesn't throw; it just does the wrong thing.

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
