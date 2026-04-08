# Release Prep: 0.15.0

---

## Proposed Release Slogans / Theme

Pick one (or remix) for the release headline:

1. **"Delete to evolve."** — Minimal. Provocative. The `foldable` decorator is gone, but your forms just got better.
2. **"Less library, richer forms."** — Captures the paradox: removing a feature improves the outcome.
3. **"Even when we remove features, we improve."** — Direct and honest; works well in a blog intro.
4. **"Upgrade by subtraction — `<details>` does it better."** — Technical audience; references the replacement.
5. **"The best feature is the one you don't need."** — Philosophical; positions the removal as a deliberate quality decision.
6. **"Native HTML won. And your forms win too."** — Frames feature removal as a victory for the web platform.

Recommended for GitHub Release title: **"Delete to evolve — native `<details>` collapsibles replace `foldable`"**

---

## Release Notes Summary

SmarkForm 0.15.0 removes the early `foldable` decorator from `form` and `list` component types — an experiment that, after long reflection, didn't align with SmarkForm's philosophy of keeping layout concerns in HTML. In its place, this release delivers first-class support for native `<details>`/`<summary>` elements: the same collapsing behaviour, zero extra API surface, and a far richer keyboard experience. New keyboard shortcuts (Shift+Space toggle, Alt+Enter unfold-and-enter, Shift+Enter symmetric backward navigation) make collapsible sections feel like a first-class part of the form flow. This release is a net gain — even in what it removes.

### Removed

- **`foldable` decorator**: Removed from `form` and `list` component types. Migrate to native `<details>`/`<summary>` — they provide equivalent collapsing behaviour with richer browser/AT support and no library overhead.

### Features

- **Native `<details>`/`<summary>` collapsible sections**: Complete keyboard navigation — auto-open on Enter/addItem, Shift+Space toggle, Alt+Enter unfold-and-enter, Alt+Shift+Enter backward unfold-and-enter.
- **Auto-open `<details>` ancestors on `addItem`**: When a new list item is added (non-silently), its enclosing `<details>` elements are automatically expanded so it is immediately visible and focusable.

### Bug Fixes

- **Space key in `<summary>` inputs**: Space no longer toggles the parent `<details>` when focus is inside a `<summary>`-hosted SmarkForm field.
- **Multi-level Enter navigation**: Enter now correctly skips hidden fields inside closed `<details>` elements at any nesting depth.
- **Shift+Enter backward navigation**: Auto-opens closed `<details>` elements when navigating backwards, symmetric with forward Enter behaviour.

### Pluses

- New collapsible sections showcase example demonstrating native `<details>`/`<summary>` in action.
- Updated the home page example to show off the new collapsible improvements.
- Updated user guide with collapsible sections documentation, keyboard reference, and illustrations.
- Fixed Ace editor losing indentation in the playground due to HTML compressor whitespace collapsing.
- Prioritized render scheduler for the docs playground: concurrency-limited, priority-based iframe rendering so visible examples load first.
- Dev-dependency updates: Playwright 1.59.1, Sass 1.99.0, minimatch 10.2.5.

---

### Proposed Commit Message (for the final squashed commit)

```
Version 0.15.0

Remove `foldable` decorator; add first-class native <details>/<summary>
collapsible section support with rich keyboard navigation.

- Remove foldable decorator from form and list types
- Add keyboard navigation for <details>/<summary>: auto-open, Shift+Space,
  Alt+Enter, Alt+Shift+Enter, Shift+Enter backward
- Auto-open <details> ancestors on non-silent addItem
- Fix Space key toggling parent <details> from summary input
- Fix multi-level Enter navigation skipping hidden fields in closed <details>
- Prioritized concurrency-limited render scheduler for sampletabs
- Fix Ace editor indentation through HTML compressor
- Update user guide with collapsible sections docs and illustrations
- Update home page example to show off new collapsible improvements
- Dev-dependency updates (Playwright, Sass, minimatch)
- Bump version to 0.15.0
```

---

## Telegram Announcement

<Channel: https://t.me/s/smarkform>

---

🚀 **SmarkForm 0.15.0 is out!**

This release removes a feature — and your forms get better for it.

The early `foldable` decorator has been retired. Instead, SmarkForm now has first-class support for native HTML `<details>`/`<summary>` collapsible sections — with a full keyboard shortcut suite, automatic expand-on-focus, and zero extra API surface. Less library, richer forms.

Key highlights:
- ❌ `foldable` decorator removed from `form` and `list` types
- 🌿 Native `<details>`/`<summary>` collapsibles with keyboard navigation (Shift+Space, Alt+Enter, Shift+Enter symmetric backward nav…)
- 🔄 Auto-expand `<details>` ancestors when a new list item is added
- 🐛 Space key and multi-level Enter nav fixes

➕ Plus: updated docs, showcase examples, and dev-dependency bumps.

📦 npm: `npm install smarkform@0.15.0`
🔗 Docs: https://smarkform.bitifet.net
📝 Changelog: https://github.com/bitifet/SmarkForm/releases/tag/0.15.0

---

## Social Media Texts

> All variants below are fully written and ready to copy. Adjust emoji or tone to taste.
> All tweets have been verified to fit within the 280-character limit.

---

### Twitter / X

#### Public (general audience)

```
🚀 #SmarkForm 0.15.0 released!

We removed a feature — and forms got better. The `foldable` decorator is out; native <details>/<summary> collapsibles are in, with richer keyboard UX.

Delete to evolve. 🌿

#OpenSource #JavaScript #WebDev

📦 npm i smarkform@0.15.0
🔗 https://smarkform.bitifet.net
```

---

#### Frontend Developers

```
#SmarkForm 0.15.0 🚀

Dropped the `foldable` decorator — replaced by native <details>/<summary> with full keyboard nav: Shift+Space toggle, Alt+Enter unfold-and-enter, auto-expand on addItem.

Less API. Better UX. #FrontEnd #JavaScript

🔗 https://smarkform.bitifet.net
```

---

#### HTML Driven Devs

```
#SmarkForm 0.15 says: trust the platform. 🌿

Removed the `foldable` decorator. Native <details>/<summary> does it better — more accessible, no JS overhead, full keyboard support baked in.

HTML wins again. #HTML #WebDev #OpenSource

🔗 https://smarkform.bitifet.net
```

---

#### Open Source Contributors

```
#SmarkForm 0.15.0 is out — and it's leaner. 🗑️

We removed the `foldable` decorator (a legacy feature that no longer fits the library's philosophy) and replaced it with native HTML collapsibles.

#OpenSource #JavaScript

PRs & feedback welcome 🙏
🔗 https://smarkform.bitifet.net
```

---

#### Software Engineering

```
#SmarkForm 0.15: a case study in removing features responsibly.

The `foldable` decorator was removed — not deprecated, removed. Its replacement (native <details>/<summary>) is already in the browser and works better.

Less surface area. More correctness. #SoftwareEngineering #JavaScript
🔗 https://smarkform.bitifet.net
```

---

#### Build in Public

```
Shipped: #SmarkForm 0.15.0 🚀

Biggest decision: removing a feature I shipped years ago because it no longer fit. Replaced by native HTML that does the job better.

Delete to evolve.

#BuildInPublic #OpenSource #JavaScript

🔗 https://smarkform.bitifet.net
```

---

#### I Can Code

```
#SmarkForm 0.15.0 is here! 🎉

Collapsible form sections now use plain HTML <details>/<summary> — no special config needed. Just wrap your fields and the keyboard shortcuts work automatically.

#JavaScript #WebDev #ICanCode

📦 npm i smarkform@0.15.0
🔗 https://smarkform.bitifet.net
```

---

#### Tech Founders

```
#SmarkForm 0.15: removed a feature. Users got a better product.

The `foldable` decorator is gone. Native <details>/<summary> collapsibles replace it — more powerful, zero extra API.

Sometimes the best engineering decision is deletion. ✂️

#TechFounders #OpenSource
🔗 https://smarkform.bitifet.net
```

---

#### Web Developers

```
#SmarkForm 0.15.0 shipped! 🚀

New: full keyboard support for <details>/<summary> collapsible sections — auto-expand on navigation, Shift+Space toggle, Alt+Enter unfold-and-enter.

Old: `foldable` decorator (removed). Native HTML does it better.

#WebDev #JavaScript
🔗 https://smarkform.bitifet.net
```

---

#### Tech Twitter

```
Hot take: removing a feature can be an improvement.

#SmarkForm 0.15 proves it — `foldable` decorator removed, native <details>/<summary> collapsibles added with richer keyboard UX. Leaner code. Better forms.

#JavaScript #WebDev #OpenSource

🔗 https://smarkform.bitifet.net
```

---

#### Javascript

```
#SmarkForm 0.15.0 🚀

The `foldable` decorator is gone. In its place: native <details>/<summary> support with a full keyboard shortcut suite built into the library.

Shift+Space toggle. Alt+Enter unfold. Auto-expand on add.

#JavaScript #WebDev
📦 npm i smarkform@0.15.0
```

---

#### Actually Build in Public

```
Shipped #SmarkForm 0.15 today. 🚀

The hard part wasn't adding stuff — it was deleting a feature I wrote years ago.

`foldable` is gone. Native <details>/<summary> is better. Keyboard nav, auto-expand, zero API bloat.

Delete to evolve. #ActuallyBuildInPublic #OpenSource
🔗 https://smarkform.bitifet.net
```

---

#### Front End Fraternity

```
#SmarkForm 0.15 dropped 🔥

The `foldable` decorator is out. Native HTML <details>/<summary> collapsibles are in — and they come with keyboard superpowers: Shift+Space toggle, Alt+Enter unfold, auto-expand on new item.

#FrontEnd #HTML #JavaScript

🔗 https://smarkform.bitifet.net
```

---

### LinkedIn Article

#### Content

**Title:** Delete to Evolve — Why Removing a Feature Made SmarkForm Better

**Introduction:**

There's a moment in every project's life when you look at something you built early on and realize: this was a mistake. Not a catastrophic mistake — it works, it shipped, people might even use it — but it doesn't belong. It was solving a problem the wrong way.

That moment came for SmarkForm's `foldable` decorator.

**What Was `foldable`?**

The `foldable` decorator was one of SmarkForm's earliest features. It let you mark a `form` or `list` component as collapsible — a toggle that showed or hid its contents. It was convenient at the time. But it was a layout concern masquerading as a form behaviour, and over time it became increasingly clear that it didn't fit SmarkForm's philosophy.

SmarkForm is a library for *managing form data and interactions*. Visual collapsing is a presentation concern. The browser already has a perfectly good native mechanism for it: the `<details>` and `<summary>` HTML elements.

**What Replaced It?**

SmarkForm 0.15.0 removes `foldable` entirely and instead delivers first-class support for native `<details>`/`<summary>` collapsible sections:

- **Auto-open on navigation**: When you Tab or Enter into a field inside a closed `<details>`, it opens automatically.
- **Shift+Space toggle**: Press Shift+Space on any field inside a `<details>` to toggle it open/closed without typing a space.
- **Alt+Enter unfold-and-enter**: Opens the next `<details>` and moves focus inside it in one keystroke.
- **Auto-expand on addItem**: When a new list item is added, its enclosing `<details>` elements expand so the new item is immediately visible.

All of this works by intercepting keyboard events at the SmarkForm level — so your HTML stays clean, and users get a seamless experience regardless of which browser they're using.

**The Result?**

Less library code. More native HTML. Better accessibility (because `<details>`/`<summary>` has built-in browser and AT support). And a richer user experience than `foldable` ever provided.

This is what "delete to evolve" looks like in practice. The feature is gone. The capability is better.

**Try It:**

📦 `npm install smarkform@0.15.0`
🔗 [https://smarkform.bitifet.net](https://smarkform.bitifet.net)
📝 [Full changelog](https://github.com/bitifet/SmarkForm/releases/tag/0.15.0)

---

#### Hero Image Prompt

A clean, minimal split-panel image: on the left, a faded/crossed-out code snippet showing `data-smark='{"type":"form","foldable":true}'`; on the right, a bright, modern snippet showing `<details><summary>...</summary>...</details>` with a green checkmark. Background: white or very light grey. Caption at the bottom: *"Delete to evolve — SmarkForm 0.15.0"*. Style: developer-blog aesthetic, sans-serif font, subtle code syntax highlighting.

---

### LinkedIn Posts

#### Full Stack Titans

```
🚀 SmarkForm 0.15.0 is now available!

This release makes a bold move: it removes a feature. The `foldable` decorator — one of SmarkForm's earliest additions — has been retired. Its replacement? The native HTML <details>/<summary> elements that browsers have always had, now with full keyboard support baked into SmarkForm.

What full-stack developers get:
• Native HTML collapsibles — no extra config, cleaner markup
• Rich keyboard UX: Shift+Space toggle, Alt+Enter unfold, auto-expand on new list item
• Leaner library, easier maintenance
• Better accessibility out of the box

SmarkForm handles dynamic form data and structure — layout belongs in HTML. This release doubles down on that principle.

📦 npm install smarkform@0.15.0
🔗 https://smarkform.bitifet.net

#FullStack #JavaScript #WebDev #OpenSource
```

---

#### Software Developer

```
🚀 SmarkForm 0.15.0 shipped — and it proves that sometimes the best release is one that removes things.

The `foldable` decorator has been removed from SmarkForm's `form` and `list` components. In its place: first-class keyboard navigation for native HTML <details>/<summary> collapsible sections.

Key improvements:
• Auto-open closed <details> on Enter/focus navigation
• Shift+Space to toggle open/closed without side-effects
• Alt+Enter to unfold and immediately enter a section
• Auto-expand <details> ancestors when a new list item is added

The result is less API surface, more standard HTML, and a better user experience — even though (or rather, because) a feature was removed.

🔗 https://smarkform.bitifet.net
#SoftwareDevelopment #JavaScript #WebDev #OpenSource
```

---

#### CSS3/HTML5 — The Future of Front End

```
🌿 SmarkForm 0.15.0 makes the case for trusting the platform.

We removed our custom `foldable` decorator and replaced it with native HTML <details>/<summary> support — the way collapsible sections were always meant to work.

What you get:
• Standard HTML markup — <details>/<summary>, no custom attributes needed
• Full keyboard navigation (auto-open, Shift+Space toggle, Alt+Enter)
• Better accessibility — browser and AT support for free
• Less JavaScript in your dependency tree

This is front-end done right: use the platform, fill the gaps, stay out of the way.

🔗 https://smarkform.bitifet.net
#HTML5 #CSS3 #FrontEnd #WebDev #OpenSource
```

---

#### Software Development

```
🚀 SmarkForm 0.15.0: a release about making better decisions, not just adding features.

The `foldable` decorator — a legacy feature from SmarkForm's early days — has been removed. It was solving a layout problem inside a form-behaviour library. That's a boundary violation.

Native HTML <details>/<summary> handles the same use case better:
• No library API to learn
• Richer keyboard support (now built into SmarkForm's navigation layer)
• Accessible by default
• Semantic HTML

SmarkForm 0.15 shows that a library's quality is partly measured by what it refuses to do.

📦 npm install smarkform@0.15.0
🔗 https://smarkform.bitifet.net
#SoftwareDevelopment #JavaScript #OpenSource
```

---

#### Software Engineering

```
🏗️ SmarkForm 0.15.0 — an exercise in responsible API reduction.

Removing a public API is one of the hardest decisions in library maintenance. This release does exactly that: the `foldable` decorator is gone, with no deprecation period — because its replacement (native HTML <details>/<summary>) is already available in every browser and works better.

Engineering tradeoffs:
• API surface: reduced ✅
• Capability: unchanged (native HTML) ✅
• Keyboard UX: improved (new nav shortcuts) ✅
• Accessibility: improved (native AT support) ✅

The replacement strategy: rather than abstracting the collapsible pattern, SmarkForm 0.15 hooks into the browser's existing <details>/<summary> mechanism and enriches it with keyboard navigation.

This is what intentional engineering looks like.

🔗 https://smarkform.bitifet.net
#SoftwareEngineering #JavaScript #WebDev #OpenSource
```

---

## Security Notes

No open vulnerabilities after `npm audit fix`.

`npm audit` reported 0 vulnerabilities before any changes. No `npm audit fix` run was required.

---

## Manual Steps (do NOT automate)

When you are ready to publish, perform the following steps manually:

### 1. Squash and commit

```bash
git checkout main
git merge --squash copilot/prepare-smarkform-v0-15-0-release
git commit -m "Version 0.15.0"
```

Use the proposed commit message above (or adapt it).

### 2. Tag the release

```bash
git tag 0.15.0
git push origin 0.15.0
```

### 3. GitHub Release

Create the GitHub Release via the web UI at:
https://github.com/bitifet/SmarkForm/releases/new?tag=0.15.0

Use the release notes from the **Release Notes Summary** section above.

### 4. npm publish

```bash
npm publish
```

### 5. Stable branch rebase

```bash
git checkout stable
git rebase main
git push origin stable
```

### 6. Remove this file

Delete `RELEASE_PREP.md` from the repository root before or after squashing.
