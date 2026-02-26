# Release Process — Agent Guide

This document is a reusable step-by-step guide for preparing a SmarkForm release. In a future chat, point the assistant here and it will follow these steps with minimal extra instructions needed.

---

## 0. Gather Release Information

Before starting, confirm the following. Ask the user if anything is missing:

- **Target version** (required — e.g. `0.13.0`). Format: `x.y.z`, no leading `v`, no `-rc` suffix.
- **Communities** to include in announcement variants (e.g. "JavaScript developers", "Web developers", "Open-source contributors"). Ask if not provided — they affect the social-media text variants.
- Any specific highlights the user wants to emphasise in the release notes.

---

## 1. Identify the Previous Release

1. Run `git tag --sort=-version:refname | head -10` to list the most recent tags.
2. Tags follow the format `x.y.z` (no leading `v`).
3. Note the previous release tag (usually the most recent tag before the target version).
4. Optionally, locate the corresponding "Version x.y.z" commit:
   ```bash
   git log --oneline --grep="Version x.y.z"
   ```

---

## 2. Review Commit History & Produce Release Summary

List commits since the previous tag:

```bash
git log <previous-tag>..HEAD --oneline
```

Produce a **user-facing summary** grouped as:

- **Features** — new capabilities, new component types, new options
- **Bug fixes** — regressions fixed, edge-case corrections
- **Other** — docs improvements, tooling, dependency bumps, internal refactors

**Brevity rules:**
- Minor or trivial fixes may be grouped into a single line, e.g. *"Minor bug fixes and internal improvements."*
- Dependency-only bumps can be grouped as *"Dependency updates."*
- Omit internal-only commits (refactors, CI tweaks) unless they have user-visible impact.
- Keep each bullet to one line.

---

## 3. Security Audit

Run `npm audit`. If vulnerabilities are found:

1. Run `npm audit fix` (policy A — apply automatically).
2. Run `npm test` to ensure tests still pass.
3. If tests fail after `npm audit fix`:
   - Analyse the failure to determine whether the dependency change caused it.
   - Revert only the dependency changes that caused test failures (`npm install <pkg>@<previous-version>`).
   - If the vulnerability cannot be fixed without breaking tests, note it in the Security section of the working document (see §7) and leave it for the user to decide.
4. If `npm audit fix --force` would be needed (breaking changes), **do not run it automatically** — report to the user and ask for guidance.

---

## 4. Run Tests

```bash
npm test
```

All tests must pass before proceeding. If any fail, fix them or report them to the user before continuing.

---

## 5. Update Version Numbers

1. Update `"version"` in **root `package.json`** to the target version.
2. Run `npm install` to regenerate `package-lock.json` with the new version.
3. Verify that **`docs/_data/package.json`** matches. This file is a copy of `package.json` produced by Rollup. To update it immediately without a full build:
   ```bash
   cp package.json docs/_data/package.json
   ```
   *(The full `npm run build` at the end will also update it.)*

---

## 6. Run Final Build

```bash
npm run build
```

This bundles the library and copies updated files (including `docs/_data/package.json`) to their expected locations. Confirm there are no build errors.

Run `npm test` again after the build to confirm everything is still green.

---

## 7. Update CHANGELOG.md

Open `CHANGELOG.md` and fill in the `[Unreleased]` section:

1. Replace the `## [Unreleased]` heading with `## [<target-version>] — <YYYY-MM-DD>`.
2. Add a short summary paragraph (same as the release summary from §2, condensed to one or two sentences if possible).
3. Add a `[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/<target-version>)` link.
4. Add a blank `## [Unreleased]` section above it for future entries.

Example:

```markdown
## [Unreleased]

<!-- Add new entries here when preparing the next release. -->

---

## [0.13.0] — 2026-03-15

Brief one-line description of the release theme.

[GitHub Release](https://github.com/bitifet/SmarkForm/releases/tag/0.13.0)

---
```

---

## 8. Create the Working Document

Create (or overwrite) `RELEASE_PREP.md` **at the repository root**. This file is git-ignored by convention — do not commit it. Its purpose is to store all release-related texts in one place for the user to review and copy from.

> **Note:** Do not commit `RELEASE_PREP.md`. Add it to `.gitignore` if it isn't already there.

### Contents of `RELEASE_PREP.md`

````markdown
# Release Prep: <target-version>

## Release Notes Summary

<One-paragraph plain-English summary for GitHub Release description and/or blog post.>

### Features
- ...

### Bug Fixes
- ...

### Other
- ...

---

## Telegram Announcement

<Channel: https://t.me/s/smarkform>

---

🚀 **SmarkForm <version> is out!**

<Two to three sentence summary of what's new. Highlight the most impactful change.>

Key highlights:
- <Highlight 1>
- <Highlight 2>
- <Highlight 3 if applicable>

📦 npm: `npm install smarkform@<version>`
🔗 Docs: https://smarkform.bitifet.net
📝 Changelog: https://github.com/bitifet/SmarkForm/releases/tag/<version>

---

## Social Media Texts

> All variants below are fully written and ready to copy. Adjust emoji or tone to taste.

### Twitter / X

#### Public (general audience)

```
🚀 SmarkForm <version> released!

<One impactful sentence about the main change.>

<Second sentence about a secondary improvement or a brief overall pitch.>

#OpenSource #JavaScript #WebDev #Forms

📦 npm i smarkform@<version>
🔗 https://smarkform.bitifet.net
```

#### For <Community 1>

```
<Tailored tweet for this community — same info, different framing.>
```

#### For <Community 2>

```
<Tailored tweet for this community.>
```

---

### LinkedIn

#### Public (general audience)

```
🚀 SmarkForm <version> is now available!

<Three to five sentence description of what's new. More professional tone. Mention the project briefly for people who don't know it.>

What's new:
• <Feature or fix 1>
• <Feature or fix 2>
• <Feature or fix 3 if applicable>

If you build web forms and haven't tried SmarkForm yet, now is a great time to explore it:
🔗 https://smarkform.bitifet.net

#OpenSource #JavaScript #WebDev #Forms #FrontEnd
```

#### For <Community 1>

```
<Tailored LinkedIn post for this community — same structure, angle adapted.>
```

#### For <Community 2>

```
<Tailored LinkedIn post for this community.>
```

---

## Security Notes

<If `npm audit` found vulnerabilities that could not be fixed, describe them here with their CVE IDs and the reason they were not addressed.>

<If all vulnerabilities were resolved, write: "No open vulnerabilities after `npm audit fix`." >
````

---

## 9. Manual Steps (do NOT automate without explicit user request)

The following steps are intentionally left to the user. **Do not perform them automatically** unless the user explicitly asks:

- **Git tag**: `git tag <target-version> && git push origin <target-version>`
- **GitHub Release**: Create via the GitHub web UI using the release notes from §8.
- **npm publish**: `npm publish`
- **Stable branch rebase**: `git checkout stable && git rebase main && git push origin stable`

Remind the user of these steps at the end of the release prep session.

---

## 10. Final Checklist

Before closing the session, confirm all of the following are done:

- [ ] Target version confirmed with user
- [ ] Previous release tag identified
- [ ] Commit history reviewed; user-facing summary produced
- [ ] `npm audit` run; vulnerabilities addressed or documented
- [ ] `npm test` passes
- [ ] `package.json` version updated
- [ ] `npm install` run (updates `package-lock.json`)
- [ ] `docs/_data/package.json` matches root `package.json`
- [ ] `npm run build` succeeds
- [ ] `npm test` passes after build
- [ ] `CHANGELOG.md` updated
- [ ] `RELEASE_PREP.md` created with all required sections (not committed)
- [ ] User reminded of manual steps (tag, GitHub Release, npm publish, stable rebase)
