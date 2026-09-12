# Documentation Change Tracking — Agent Knowledge

This document describes the `UPDATED_DOCS.md` tracker file and how agents should maintain it whenever they create or modify documentation.

## Purpose

SmarkForm's documentation is split across the `docs/` tree (and potentially duplicated or forked into other repositories). The `UPDATED_DOCS.md` file is a lightweight, human-readable log that records every documentation change an agent makes, making it easy for reviewers and fork-maintainers to see what changed and why.

## Rules

1. **Update `UPDATED_DOCS.md` every time you create, modify, rename, or delete a documentation file** under `docs/`. Add one entry per file affected.

2. **The file is gitignored** — it lives at the repository root but is never committed. Its purpose is for agent–human communication, not version control.

3. **Keep entries brief.** Each entry should contain the date, the affected file path, and a one-line description of the change. Example:
   ```
   2026-09-12 docs/_advanced_concepts/the_singleton_pattern.md — New singleton chapter (initial draft).
   ```

4. **Multiple changes to the same file** can be combined in a single entry, or listed as separate entries on different dates. Use your judgement.

5. **If you find a stale entry** (the change has already been committed and merged), you may remove it. The file is a scratchpad, not a changelog.

## When to Skip

- **Purely structural changes** (e.g. fixing a broken Liquid tag that doesn't change rendered content) can optionally be skipped — the trader log is primarily for *content* changes.
- **Co-located test changes** that don't modify visible documentation prose can be skipped.

## File Location

```
<repository-root>/UPDATED_DOCS.md
```

The `.gitignore` file includes `UPDATED_DOCS.md` so the file is never accidentally committed.
