# SmarkForm `dist/` and CDN Publishing — Proposal

> **Status:** proposal / design document — **not implemented**. No code or
> workflow changes are made by this document; it records the current situation,
> the options, and a recommendation so the decision can be made later with full
> context.

Related sources / consumers:

- `package.json` — `module`/`browser` point at `dist/SmarkForm.esm.js`; `files`
  ships only the `dist/SmarkForm.{esm,umd}.js` bundles and their maps.
- `rollup.config.js` — produces the bundles under `dist/`.
- `.github/workflows/pages.yml` — builds the library and the docs site on every
  push to the **`stable`** branch.
- `docs/` (`docs/_resources/dist/`, `docs/dist/`) — generated example pages that
  consume the library over jsDelivr.

---

## 1. The problem

The built library bundles are **committed to `main`**:

```
dist/SmarkForm.esm.js
dist/SmarkForm.esm.js.map
dist/SmarkForm.umd.js
dist/SmarkForm.umd.js.map
dist/examples/smarkform_layout_sample.css
dist/examples/smarkform_styles_sample.css
```

Everything here is *derived* from `src/`. Keeping derived files in the source
branch has the usual costs:

- **Noise**: every source change that alters behaviour requires a second,
  mechanical `dist/` commit, making diffs and history harder to read.
- **Conflicts**: `dist/` is a rebase/merge conflict magnet because two branches
  almost always both rebuild it.
- **Staleness risk**: because there is no `prepack`/`prepare` hook, `npm publish`
  ships whatever `dist/` was last built by hand and committed. Forgetting to
  rebuild publishes stale bytes under a fresh version number.
- **Larger repo**: minified bundles plus source maps grow the clone size
  unnecessarily.

The counter-argument is that `dist/` being present is what makes two CDN
surfaces work today:

1. **npm CDN** — `https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.umd.js`
   (used in `docs/_about/faq.md`). jsDelivr reads the *published npm tarball*, so
   this one only needs the bundles to exist **in the package**, not in the repo.
2. **GitHub CDN** — `https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@<ref>/dist/…`
   (used by the generated example pages, e.g. pinned to `@0.23.0`, and `@main`
   for the "Powered by" badge). jsDelivr reads the *GitHub repository*, so this
   one **does** require `dist/` to be present at the referenced ref.

Any change must therefore decide what happens to the GitHub-CDN URLs.

---

## 2. Current state (baseline)

| Aspect | Today |
|---|---|
| Tracked on `main` | `dist/SmarkForm.{esm,umd}.js(+.map)` and the two example CSS files |
| `package.json` | `module`/`browser` → `dist/SmarkForm.esm.js`; `files` ships only the two bundles + maps; **no** `prepack`/`prepare` |
| npm CDN usage | `…/npm/smarkform/dist/…` (version-less → npm `latest`) in FAQ examples |
| GitHub CDN usage | `…/gh/bitifet/SmarkForm@0.23.0/dist/…` in generated example pages; `@main` badge logo |
| Docs deploy | `.github/workflows/pages.yml` runs `npm run build` + Jekyll build on push to **`stable`** |
| Ignored paths | `dist/examples/*.html`, `docs/_resources/dist/`, `docs/dist/`, `docs/_site` |

The **`stable` branch is the project's marker for the last published version**:
documentation fixes can be pushed to `stable` as long as they don't depend on
library changes beyond that published version.

---

## 3. Options

### Option A — Stop tracking `dist/`; rely on the npm CDN

Remove `dist/` from git and add a build hook so packages are always fresh:

```jsonc
"scripts": {
  "prepack": "npm run build"   // or "prepare" so `npm install` from git also builds
}
```

Consumers use the npm CDN (`cdn.jsdelivr.net/npm/smarkform@<version>/…`).

- ✅ `main` is clean; no derived-file commits or conflicts; clone is smaller.
- ✅ `prepack` removes the staleness risk.
- ❌ `…/gh/bitifet/SmarkForm@<ref>/dist/…` URLs stop resolving (no `dist/` in the
  repo). The generated example pages would have to switch to the npm CDN path,
  and the `@main` badge/asset URLs must point at non-`dist/` assets (they already
  do: the badge is `docs/assets/logo/…`).
- ❌ jsDelivr's npm CDN caches aggressively; a broken publish is harder to
  correct than a git ref.

### Option B — Publish `dist/` to a dedicated orphan branch

Keep `dist/` out of `main`; push the built files to an orphan `dist` (or
`gh-pages`-style) branch from CI on release. jsDelivr's GitHub endpoint can serve
that branch (`…/gh/bitifet/SmarkForm@dist/dist/…`), or a tag pointing at it.

- ✅ `main` is clean; the GitHub CDN keeps working.
- ✅ The dist branch is a pure artifact snapshot — no merges.
- ❌ One more branch/tag to keep in sync with every release; a tag alone no
  longer resolves the GitHub CDN unless the tag also contains `dist/`.
- ❌ Slightly more CI machinery.

### Option C — Commit `dist/` only at release time

Leave `dist/` untracked between releases; commit the freshly built `dist/` on
`main` (and/or on the release tag) as part of the release procedure.

- ✅ Minimal change; matches today's release/`stable` semantics (the released
  commit — and its tag — carries `dist/`, so `…@<tag>/dist/…` keeps working).
- ✅ Between releases `main` stays clean.
- ❌ Requires a release step (and it is easy to forget — hence `prepack` as a
  belt-and-braces guard).
- ❌ `@main` GitHub-CDN URLs to `dist/` would 404 between releases (the only
  current `@main` reference is the non-`dist/` badge, so the impact is limited).

---

## 4. Interaction with the `stable` branch

Whichever option is chosen, the invariant to preserve is:

> **Every published version's tag must resolve any `…/gh/…@<tag>/dist/…` URL
> that the docs examples reference.**

- `stable` marks the last published version and triggers the docs build. A
  documentation-only fix may still be pushed to `stable`; a fix that depends on
  library code beyond the published version may not.
- Under Option A the examples must stop using the `@tag` GitHub path (or pin to a
  tag that intentionally keeps a `dist/` snapshot).
- Under Options B and C the release step must guarantee that the tag (or its
  dist branch) contains `dist/` **before** docs that reference it are published.

---

## 5. Recommendation

**Short term — Option C + `prepack` guard.** Keep committing `dist/` at release
time (aligned with the existing `stable`/tag workflow, zero new moving parts) and
add `prepack: npm run build` so `npm publish` can never ship stale bytes. This
already removes the biggest risk (stale publishes) without touching the GitHub
CDN URLs.

**Long term — Option B.** If the project wants a clean `main` with no derived
files, move `dist/` to an orphan branch published by CI on release, and point the
example `…/gh/…` URLs at that branch (or a tag that contains `dist/`). This keeps
the GitHub CDN working while fully decoupling source from artifacts; Option A is
simpler but sacrifices the tag-pinned GitHub CDN the example pages rely on.

### Migration sketch (Options B/C)

1. `git rm -r --cached dist/` and add the still-needed `dist/` paths to
   `.gitignore` (the example `*.html` and `docs/_resources/dist/` are already
   ignored; the bundles and the two example CSS files would need entries, or be
   excluded from the ignore when committed at release).
2. Add `prepack`/`prepare: npm run build` to `package.json`.
3. Update the release checklist (`AGENTS/Release-Process.md`) to build and commit
   (C) or publish to the dist branch (B) — and to verify the tag's `dist/`
   resolves before deploying docs.
4. If pursuing Option B, extend `.github/workflows/pages.yml` (or add a sibling
   workflow) to push the built `dist/` to the orphan branch on `stable`/tags.

### Open questions

- Do we want to keep any tag-pinned GitHub-CDN reference in the docs at all, or
  standardise every example on the version-less npm CDN URL?
- Should `dist/examples/*.css` (currently tracked because the generated example
  pages link to them by tag) move to the npm package or to the docs assets?
- Is `prepare` desirable in addition to `prepack` (it also builds on
  `npm install` from a git URL, which is slower but always correct).
