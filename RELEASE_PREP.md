# Release Prep: 0.16.0

## Release Notes Summary

SmarkForm 0.16.0 ships a **secure-by-default** posture for mixin types and JSON-encoded
form submission — all new cross-origin and script-execution capabilities are opt-in,
protecting applications that haven't explicitly chosen to allow them.  It also debuts a
brand-new **"A Picture is Worth a Thousand Words"** comparison page that runs live
SmarkForm, React, and Vue event-planner demos side-by-side, makes sortable lists easier to
use with dedicated drag handles, and fixes Shift+Space fold/unfold inside `<summary>`
inputs.  The npm tarball is also trimmed to only include the production bundle files.

### Features
- **Sortable list drag handles**: SmarkForm `label` elements now act as dedicated drag handles for sortable lists, preventing accidental drags when selecting text inside inputs.
- **Shift+Space inside `<summary>`**: Correctly toggles collapsible `<details>` sections when focus is on a `<summary>`-hosted input, with focus restored after folding.
- **`allowExternalMixins`** (default `"block"`): Mixin references to external URLs are blocked by default; opt in with `"same-origin"` or `"allow"`.
- **`allowLocalMixinScripts`** / **`allowSameOriginMixinScripts`** / **`allowCrossOriginMixinScripts`** (default `"block"`): `<script>` elements in mixin templates are blocked by default; opt in with `"allow"` or silently strip with `"noscript"`.
- **`enableJsonEncoding`** (default `false`): `enctype="application/json"` submission is now disabled by default; set `enableJsonEncoding: true` to re-enable.
- **Security options are root-only**: Mixin security options can no longer be overridden via `data-smark` markup, closing a privilege-escalation vector.

### Bug Fixes
- Corrected error code typo: `LIST_ITEM_TYPE_MISSMATCH` → `LIST_ITEM_TYPE_MISMATCH` (**breaking** for any code that matched the old string).
- Fixed Shift+Space toggle in React and Vue comparison demos.

### Other
- New "A Picture is Worth a Thousand Words" comparison page with live SmarkForm, React, and Vue demos.
- New `doctabs` component for full-document examples in docs.
- `npm files` allowlist: `dist/examples/**` no longer included in the npm tarball.
- Example CSS now served from GitHub CDN (cdn.jsdelivr.net/gh) so it stays up to date without an npm publish.
- New docs chapters: Security Considerations, Error Codes Reference.
- CSS style standardisation across showcase, quick-start, FAQ, and index pages.
- Dev-dependency updates.

### Proposed Commit Message (for the final squashed commit)

```
Version 0.16.0
```

---

## Telegram Announcement

<Channel: https://t.me/s/smarkform>

---

🚀 **SmarkForm 0.16.0 is out!**

This release hardens security defaults (external mixins and JSON encoding are now opt-in), introduces a live framework comparison page showing SmarkForm, React, and Vue side-by-side, and ships several UX improvements including smarter drag handles and Shift+Space fold/unfold inside summary inputs.

Key highlights:
- 🔒 Secure-by-default mixin options & `enableJsonEncoding` opt-in
- 🖼️ New "A Picture is Worth a Thousand Words" React/Vue comparison page
- 🎯 Dedicated drag handles for sortable lists + Shift+Space `<summary>` fix

📦 npm: `npm install smarkform@0.16.0`
🔗 Docs: https://smarkform.bitifet.net
📝 Changelog: https://github.com/bitifet/SmarkForm/releases/tag/0.16.0

---

## Social Media Texts

> All variants below are fully written and ready to copy. Adjust emoji or tone to taste.

### Twitter / X

> **IMPORTANT:** All tweets have been checked with `wc -c` to fit within 288 characters.

#### Public (general audience)

```
🚀 #SmarkForm 0.16.0 released!

Secure-by-default mixin & JSON options, a live React/Vue comparison page, smarter drag handles, and Shift+Space fold fix.

#OpenSource #JavaScript #WebDev #Forms

📦 npm i smarkform@0.16.0
🔗 https://smarkform.bitifet.net
```

#### Frontend Developers

```
🚀 #SmarkForm 0.16.0 is here!

New secure-by-default mixin options, dedicated drag handles for sortable lists, and a live side-by-side React/Vue comparison.

Forms just got safer and smoother 💪

#FrontEnd #JavaScript #WebDev

🔗 https://smarkform.bitifet.net
```

#### HTML-driven Devs

```
🚀 #SmarkForm 0.16.0 — secure HTML forms by default!

External mixins & JSON encoding are now opt-in. Declare safe forms in plain HTML, no framework needed.

#HTML #OpenSource #WebDev #Forms

🔗 https://smarkform.bitifet.net
```

#### Open Source Contributors

```
🚀 #SmarkForm 0.16.0 shipped!

Hardened security defaults, a React/Vue live comparison, drag handles & UX fixes.

OSS form library — vanilla JS, no deps, MIT.

Want to contribute? 👇

#OpenSource #JavaScript #Forms

🔗 https://smarkform.bitifet.net
```

#### Software Engineering

```
🚀 #SmarkForm 0.16.0 — secure-by-default!

Mixin script execution & cross-origin fetches are now blocked unless explicitly opted in. Closes a privilege-escalation vector in the mixin pipeline.

#SoftwareEngineering #JavaScript #Security

🔗 https://smarkform.bitifet.net
```

#### Build in Public

```
🚀 Shipped #SmarkForm 0.16.0!

- 🔒 Secure-by-default mixin & JSON options
- 🖼️ Live React/Vue comparison page
- 🎯 Drag handles + Shift+Space summary fix

Building a vanilla JS form library one release at a time 🧱

#BuildInPublic #OpenSource

🔗 https://smarkform.bitifet.net
```

#### I Can Code

```
🚀 #SmarkForm 0.16.0 out now!

Add rich forms to any page — no framework, no build step. This release locks down security and adds a live React/Vue comparison so you can see the difference yourself.

#ICanCode #JavaScript #WebDev

🔗 https://smarkform.bitifet.net
```

#### Tech Founders

```
🚀 #SmarkForm 0.16.0 — enterprise-ready security defaults

Mixin scripts & external fetches blocked by default. JSON encoding opt-in. Protect your users without changing your forms.

Vanilla JS · No deps · MIT

#TechFounders #JavaScript #OpenSource

🔗 https://smarkform.bitifet.net
```

#### Web Developers

```
🚀 #SmarkForm 0.16.0 is live!

✅ Secure-by-default mixin options
✅ Dedicated drag handles for sortable lists
✅ Live React/Vue comparison page
✅ Shift+Space fold fix in <summary> inputs

#WebDev #JavaScript #Forms

🔗 https://smarkform.bitifet.net
```

#### Tech Twitter

```
🚀 #SmarkForm 0.16.0 released!

Secure-by-default mixin & JSON options, live React/Vue demo comparison, smarter drag handles.

Vanilla HTML forms that just work — no framework required.

#TechTwitter #JavaScript #OpenSource

🔗 https://smarkform.bitifet.net
```

#### JavaScript

```
🚀 #SmarkForm 0.16.0 — pure vanilla JS form library

New: secure-by-default mixin options, `enableJsonEncoding` opt-in, drag handles, Shift+Space fix.

0 runtime deps. Full form logic in HTML attributes.

#JavaScript #WebDev #OpenSource

🔗 https://smarkform.bitifet.net
```

#### Actually Build in Public

```
📦 #SmarkForm 0.16.0 is out!

This one was focused on hardening defaults — external mixins blocked, JSON encoding opt-in, security root-only options.

Also snuck in a React/Vue live comparison and drag-handle UX improvements.

#ActuallyBuildInPublic #JavaScript

🔗 https://smarkform.bitifet.net
```

#### Front End Fraternity

```
🚀 #SmarkForm 0.16.0 shipped!

Secure mixin defaults, live React/Vue comparison, smarter drag-to-sort handles & keyboard fold fixes.

Pure HTML · Vanilla JS · Zero deps

#FrontEndFraternity #JavaScript #WebDev

🔗 https://smarkform.bitifet.net
```

---

### LinkedIn Article

#### Content

**SmarkForm 0.16.0: Secure by Default, Compared to React and Vue**

SmarkForm is a lightweight, zero-dependency JavaScript library that lets you build rich, accessible forms using plain HTML attributes — no framework, no build step required.

Version 0.16.0 focuses on two themes: **security hardening** and **community transparency**.

On the security front, all cross-origin and script-injection capabilities are now disabled by default. External mixin templates, scripts inside mixin templates, and JSON-encoded form submission all require explicit opt-in through root-level constructor options. This means existing applications that haven't asked for these features are automatically protected — and new applications have a safe starting point.

On the transparency front, a new **"A Picture is Worth a Thousand Words"** comparison page invites you to read — and run — the same event-planner form built three ways: with SmarkForm, with React, and with Vue. The comparison table shows JS line counts, feature coverage, and the interaction patterns each framework enables (or doesn't). The demos are live in the browser, so you can inspect the source, interact with each version, and decide for yourself.

Other highlights include dedicated drag handles for sortable lists (so text selection no longer starts a drag), Shift+Space fold/unfold inside `<summary>` inputs, a trimmed npm tarball, and a GitHub CDN for example CSS files.

Full changelog: https://github.com/bitifet/SmarkForm/releases/tag/0.16.0
Docs: https://smarkform.bitifet.net

#### Hero Image Prompt

A clean, modern split-screen illustration showing three identical form interfaces side by side — labeled "SmarkForm", "React", and "Vue" — with the SmarkForm one written in minimal HTML markup and the other two in JSX/template syntax. Subtle security shield icon glowing green in the background. Soft blue-grey palette, minimal whitespace, developer-tool aesthetic.

### LinkedIn Posts

#### Full Stack Titans

```
🚀 SmarkForm 0.16.0 is out — and it comes with hardened security defaults.

External mixin fetches, mixin scripts, and JSON-encoded form submission are now all blocked by default. Full-stack developers building multi-origin or user-generated-content forms no longer need to remember to lock these down — they're locked by default.

This release also ships a live SmarkForm vs React vs Vue comparison page so you can evaluate the tradeoffs yourself.

What's new:
• 🔒 Secure-by-default mixin & JSON options
• 🖼️ Live React/Vue comparison demos
• 🎯 Drag handles for sortable lists

🔗 https://smarkform.bitifet.net

#JavaScript #WebDev #OpenSource #Forms #Security
```

#### Software Developer

```
🚀 SmarkForm 0.16.0 released!

If you're building forms with SmarkForm, this release tightens the security defaults so you don't have to think about them. External mixins and JSON encoding are opt-in now.

Also: a live side-by-side comparison with React and Vue, dedicated drag handles for sortable lists, and Shift+Space fold/unfold in summary inputs.

What's new:
• 🔒 Secure-by-default mixin & JSON encoding options
• 🖼️ React/Vue comparison page with live demos
• 🎯 Drag-handle UX improvements

🔗 https://smarkform.bitifet.net

#JavaScript #SoftwareDevelopment #WebDev #OpenSource
```

#### CSS3/HTML5 The Future of Front End

```
🚀 SmarkForm 0.16.0 is here!

This release is a great example of what you can do with plain HTML and a thin JS library. Security is enforced through constructor options — not hidden framework magic. The comparison page shows the same form in SmarkForm, React, and Vue — written in clean, readable HTML vs JSX components.

What's new:
• 🔒 Secure mixin & JSON defaults
• 🖼️ Live HTML vs React vs Vue comparison
• 🎯 Drag handles via native label elements

🔗 https://smarkform.bitifet.net

#HTML5 #CSS3 #FrontEnd #JavaScript #OpenSource
```

#### Software Development

```
🚀 SmarkForm 0.16.0 — secure-by-default form library

The security model now mirrors best practices from other ecosystems: everything potentially dangerous is blocked until explicitly allowed. External mixin fetches, mixin scripts, and JSON encoding all require opt-in.

This release also ships a real-world framework comparison (SmarkForm / React / Vue) with live, runnable demos and a feature table.

What's new:
• 🔒 Hardened mixin & JSON security defaults
• 🖼️ Live framework comparison page
• 🎯 Drag handles + Shift+Space UX fixes

🔗 https://smarkform.bitifet.net

#SoftwareDevelopment #JavaScript #OpenSource #WebDev
```

#### Software Engineering

```
🚀 SmarkForm 0.16.0 — closes a privilege-escalation vector in the mixin pipeline

Security options (allowExternalMixins, allowLocalMixinScripts, etc.) are now read exclusively from the root constructor options. Previously they used inheritedOption(), which could allow a malicious external mixin template to escalate its own permissions via data-smark attributes. The fix ensures only JavaScript-side root options are honoured.

Also ships: live React/Vue comparison, drag handles, Shift+Space summary fix.

🔗 https://smarkform.bitifet.net

#SoftwareEngineering #Security #JavaScript #OpenSource
```

---

## Security Notes

No open vulnerabilities after `npm audit`. All mixin and JSON-encoding security improvements in this release are proactive hardening measures, not responses to known CVEs.

---

## Manual Steps for the User

After reviewing this document and the PR, complete the release with these steps:

1. **Squash and commit** (on the `main` branch after PR merge):
   ```bash
   git merge --squash copilot/release-0-16-0 && git commit
   # Use "Version 0.16.0" as the commit message
   ```

2. **Tag**:
   ```bash
   git tag 0.16.0 && git push origin 0.16.0
   ```

3. **GitHub Release**: Create via the GitHub web UI using the release notes from the "Release Notes Summary" section above. Link the tag `0.16.0`.

4. **npm publish**:
   ```bash
   npm publish
   ```

5. **Stable branch rebase**:
   ```bash
   git checkout stable && git rebase main && git push origin stable
   ```

6. **Remove this file** (`RELEASE_PREP.md`) before or as part of the squash commit.
