# Release Prep: 0.14.1

## Release Notes Summary

This is a patch release that fixes a bug where `BeforeAction_import` handlers could not alter the imported data. When a handler modified `ev.data`, the change was silently discarded because the import action read the original value from the options object instead of the handler-modified one. A sync-back step in `emit()` now ensures handler modifications are picked up correctly.

### Bug Fixes
- **`BeforeAction_import` data modification**: Changes made to `ev.data` inside a `BeforeAction_import` handler are now correctly applied before the import proceeds.

### Other
- Dev-dependency update (`serialize-javascript`).
- Dev-dependency security fix (`brace-expansion` — moderate vulnerability in transitive dep).

### Proposed Commit Message (for the final squashed commit)

```
Version 0.14.1
```

---

## Telegram Announcement

<Channel: https://t.me/s/smarkform>

---

🚀 **SmarkForm 0.14.1 is out!**

This patch release fixes a subtle but impactful bug: `BeforeAction_import` handlers that modified `ev.data` were silently ignored — the import action was reading the original data instead. It's now fixed.

Key highlights:
- 🐛 `BeforeAction_import` handlers can now alter imported data as expected.

📦 npm: `npm install smarkform@0.14.1`
🔗 Docs: https://smarkform.bitifet.net
📝 Changelog: https://github.com/bitifet/SmarkForm/releases/tag/0.14.1

---

## Social Media Texts

> All variants below are fully written and ready to copy. Adjust emoji or tone to taste.

### Twitter / X

#### Public (general audience)

```
🐛 #SmarkForm 0.14.1 released!

BeforeAction_import handlers can now modify imported data — a subtle bug silently discarded ev.data changes. Now fixed.

#OpenSource #JavaScript #WebDev #Forms

📦 npm i smarkform@0.14.1
🔗 https://smarkform.bitifet.net
```

#### Frontend Developers

```
🐛 #SmarkForm 0.14.1 — patch release!

If you use BeforeAction_import to transform data before import, this fix is for you. ev.data changes were silently dropped. Now they stick.

#JavaScript #FrontEnd #WebDev #Forms

📦 npm i smarkform@0.14.1
```

#### HTML-driven Devs

```
🐛 #SmarkForm 0.14.1 is out!

Small but important fix: BeforeAction_import handlers now correctly apply ev.data modifications before the import runs.

#HTML #JavaScript #WebDev

📦 npm i smarkform@0.14.1
🔗 https://smarkform.bitifet.net
```

#### Open Source Contributors

```
🐛 #SmarkForm 0.14.1 — bug fix patch!

BeforeAction_import ev.data modifications were silently discarded. Fixed with a sync-back step in emit(). Clean, minimal, tested.

PRs and issues welcome! 🙌

#OpenSource #JavaScript

📦 npm i smarkform@0.14.1
```

#### Software Engineering

```
🐛 #SmarkForm 0.14.1 — patch release.

Root cause: emit() spread-copied evData for handlers; data = options.data was read post-emit, missing handler mutations. Fix: sync ev.data back to options after handlers run.

#SoftwareEngineering #JavaScript #BugFix
```

#### Build in Public

```
🐛 Shipped #SmarkForm 0.14.1 today!

A bug where BeforeAction_import couldn't modify imported data — discovered, diagnosed, and fixed. Small release, real impact.

#BuildInPublic #OpenSource #JavaScript

📦 npm i smarkform@0.14.1
```

#### I Can Code

```
🐛 #SmarkForm 0.14.1 is live!

Bug fixed: event handlers that modify data before import now work as expected. ev.data changes are no longer silently dropped.

#ICanCode #JavaScript #WebDev

📦 npm i smarkform@0.14.1
🔗 https://smarkform.bitifet.net
```

#### Tech Founders

```
🐛 #SmarkForm 0.14.1 — reliability patch.

BeforeAction_import data transformations were silently failing. Fixed. If you rely on import hooks for data preprocessing, upgrade now.

#TechFounders #OpenSource #JavaScript

📦 npm i smarkform@0.14.1
```

#### Web Developers

```
🐛 #SmarkForm 0.14.1 released!

Quick heads-up: if you use BeforeAction_import to transform data, this patch fixes a bug where ev.data changes were ignored. Now they work correctly.

#WebDev #JavaScript #Forms

📦 npm i smarkform@0.14.1
```

#### Tech Twitter

```
🐛 #SmarkForm 0.14.1 — bug fix release.

BeforeAction_import: ev.data changes were silently dropped post-handler. Fixed with a sync-back in emit(). Small diff, real impact.

#JavaScript #OpenSource

📦 npm i smarkform@0.14.1
🔗 https://smarkform.bitifet.net
```

#### JavaScript

```
🐛 #SmarkForm 0.14.1 — JavaScript patch release.

BeforeAction_import handlers can now correctly modify ev.data before import runs. Was silently dropped before. Now fixed!

#JavaScript #JS #WebDev #Forms

📦 npm i smarkform@0.14.1
```

#### Actually Build in Public

```
🐛 Just shipped #SmarkForm 0.14.1!

Found a bug: BeforeAction_import handlers that modified ev.data were silently ignored. Tracked it to emit() spread-copying evData. Fix is a sync-back step. Tests green. Shipped.

#ActuallyBuildInPublic #OpenSource

📦 npm i smarkform@0.14.1
```

#### Front End Fraternity

```
🐛 #SmarkForm 0.14.1 — patch for import hook bug!

BeforeAction_import handlers that modify ev.data before import now actually work. Was a silent discard bug. Fixed and shipped.

#FrontEndFraternity #JavaScript #WebDev

📦 npm i smarkform@0.14.1
```

---

### LinkedIn Article

#### Content

**SmarkForm 0.14.1: Fixing a Silent Data Modification Bug in Import Hooks**

SmarkForm 0.14.1 is a targeted patch release that addresses a subtle but impactful bug in the event system. If you've been using `BeforeAction_import` handlers to transform or validate data before it is imported into a form, you may have noticed that modifications to `ev.data` inside those handlers were silently discarded — the import action was reading the original data from the options object instead of the handler-modified value.

**Root cause**: When `emit()` invoked handlers, it spread-copied `evData` into the event object. After all handlers ran, the action decorator read `data = options.data`, which still held the original value — never receiving the handler's update.

**The fix**: A sync-back step in `emit()` now updates `evData.data` (and therefore `options.data`) with the final `event.data` value after all handlers have run. This ensures that any `BeforeAction` handler that modifies `ev.data` has its change properly propagated to the action that follows.

This is a zero-breaking-change patch. No API surface changed — only the previously broken behaviour now works as documented.

**Upgrade**: `npm install smarkform@0.14.1`

#### Hero Image Prompt

Minimalist flat-design illustration of a data pipeline with a filter node in the middle. Left side shows raw data flowing in; the filter node is labelled "BeforeAction handler"; right side shows transformed data flowing into a clean form UI. Subtle bug-fix theme: a small red dot on the filter node turning green. SmarkForm brand colours (teal/blue palette). Clean, professional, no clutter.

### LinkedIn Posts

#### Full Stack Titans

```
🐛 SmarkForm 0.14.1 — patch release for full-stack teams.

If you use BeforeAction_import to transform data before it lands in your forms, you'll want this fix. A subtle bug was silently discarding ev.data changes made inside those handlers — the import action never saw them.

What's new:
• Fixed: BeforeAction_import ev.data modifications now correctly propagate to the import action.
• Zero breaking changes — drop-in upgrade.

SmarkForm is an open-source, declarative HTML-first form library for building rich, data-aware web forms without heavy framework overhead.

🔗 https://smarkform.bitifet.net
📦 npm install smarkform@0.14.1

#JavaScript #WebDev #Forms #OpenSource #FullStack
```

#### Software Developer

```
🐛 SmarkForm 0.14.1 is out — a small but important bug fix.

BeforeAction_import handlers that modified ev.data before the import ran were having their changes silently dropped. The root cause: emit() spread-copied the event data, and the action decorator read the original options object post-emit. Fixed with a sync-back step.

What's fixed:
• BeforeAction_import: ev.data changes now propagate correctly.
• Transitive dependency security patch (brace-expansion).

If you're using import hooks, upgrade now.

#JavaScript #SoftwareDevelopment #OpenSource #WebDev
```

#### CSS3/HTML5 The Future of Front End

```
🐛 SmarkForm 0.14.1 — patch for HTML-first form developers.

This release fixes a bug where BeforeAction_import event handlers couldn't modify the data being imported into a form. Now they can — as documented. No changes to the HTML API, no breaking changes.

What's fixed:
• BeforeAction_import handlers can now alter ev.data before import runs.

SmarkForm lets you build rich, accessible forms with clean HTML markup and minimal JavaScript.

🔗 https://smarkform.bitifet.net

#HTML5 #CSS3 #JavaScript #WebDev #Forms
```

#### Software Development

```
🐛 SmarkForm 0.14.1 released — targeted bug fix.

A race-condition-style bug in the event emission system was causing BeforeAction_import handler modifications to ev.data to be silently discarded. This patch adds a sync-back step in emit() that ensures handler changes are visible to the action decorator.

Highlights:
• BeforeAction_import data modification now works as documented.
• Dev-dependency security update included.

Zero breaking changes.

#SoftwareDevelopment #JavaScript #OpenSource #BugFix
```

#### Software Engineering

```
🐛 SmarkForm 0.14.1 — a patch worth understanding.

The bug: emit() spread-copied evData into the event object passed to handlers. After handlers ran, data = options.data was read, which still held the original — never reflecting handler mutations to ev.data.

The fix: after all handlers complete, if evData has a 'data' property, sync it back from event.data so downstream action decorators receive the updated value.

Clean, minimal, zero-breaking patch.

Highlights:
• BeforeAction_import: ev.data mutations now propagate correctly.
• Transitive dep security fix (brace-expansion).

#SoftwareEngineering #JavaScript #OpenSource #EventDrivenArchitecture
```

---

## Security Notes

One moderate-severity vulnerability was found in a transitive devDependency (`brace-expansion < 1.1.13 || >= 4.0.0 < 5.0.5`, advisory GHSA-f886-m6hf-6m8v). It was resolved via `npm audit fix`. No open vulnerabilities remain.

---

## Manual Steps for the User

When you are satisfied with this document and the PR changes:

1. **Remove this file** (`RELEASE_PREP.md`) from the branch.
2. **Squash-merge the PR** into `main` with the commit message:
   ```
   Version 0.14.1
   ```
3. **Tag the release**:
   ```bash
   git tag 0.14.1 && git push origin 0.14.1
   ```
4. **Create a GitHub Release** at https://github.com/bitifet/SmarkForm/releases/new using the release notes from the "Release Notes Summary" section above.
5. **Publish to npm**:
   ```bash
   npm publish
   ```
6. **Rebase the stable branch**:
   ```bash
   git checkout stable && git rebase main && git push origin stable
   ```
