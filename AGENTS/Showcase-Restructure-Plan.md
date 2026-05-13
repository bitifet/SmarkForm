# Showcase Page Restructure Plan

## Final State

The 7-example plan was superseded by a conservative consolidation
(25 → 20 examples).  The showcase retains all non-redundant examples
and converts removed ones to prose sections.

**Completed restructuring:**

| Change | Commit |
|--------|--------|
| Example 1 "Just a Form" replaces `basic_form` | `379f79f` |
| Example 2 "Smart Contacts" replaces `nested_forms` + `simple_list` + `simple_list_singleton` | `06cc45f` |
| Example 2 "Three-Level Nesting" (was "School Groups") replaces "Smart Contacts" | *(current release)* |
| `schedule_mixin` removed; notes redistributed to Mixins section body | uncommitted |
| `nested_schedule_table_duplicable` removed; features folded into `nested_schedule_table` | uncommitted |
| `period_mixin_duplicable` removed → recovered as `nested_schedule_table` (with `#periodItem` mixin) | uncommitted |
| `schedule_table` moved from "More on lists" to "Mixins", refactored to use mixins | uncommitted |

## Current Flow

1. **More on lists** — `schedule_list` (separator/empty_list roles). Ends with:
   > Let's imagine a hotel... We'll see how this gets implemented in the
   > [Mixins section](#mixins) below.

2. **Mixins** — `schedule_table` refactored to use `#scheduleRow` template
   (the hotel scheduling example).  Introduces `<template>` mixin concept.

3. **Nested lists and forms** — `nested_schedule_table` (uses `#periodItem` + `#scheduleRow`).
   Mixins are already known from the previous section.

## What Was NOT Done

- **`singleton: true` list option**: does not exist in SmarkForm source.
  The old `simple_list_singleton` example was about the Singleton Pattern
  (`of:"input"`), which is already documented in `type_list.md` under
  *Applying the singleton pattern*.
- `mixin_types.md` is comprehensive (1005 lines) — no additions needed.
- Niche examples (`hidden_actions`, `2nd_level_hotkeys`, `animations`, etc.)
  remain in the showcase for now.

## Remaining Gaps (Future Work)

| Gap | Where | What's needed |
|-----|-------|---------------|
| Form JSON encoding, submit interception | `type_form.md` | 1 sampletab example |
| DOM field events, `focusenter`/`focusleave` | `events.md` | 1 sampletab example |
| `autoscroll` / `failback` options | `type_list.md` | Snippets |
| Programmatic export/import API | `data_import_and_export.md` | JS snippet |
| Loading initial data from server | `data_import_and_export.md` | Practical example |
