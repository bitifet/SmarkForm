# Showcase Page — Documentation Migration Analysis

## Sections that are pure documentation (no demo at all)

| # | Section | Lines | Move content to |
|---|---------|-------|-----------------|
| 1 | Deeply nested forms | 485–533 | `type_form.md` ("Arbitrary nesting depth") + playground scaffold note to `core_concepts.md` |
| 2 | Item duplication + closure state | 1199–1218 | `type_list.md` ("Duplicating previous item", "`min_items:0`") |
| 3 | A note on empty values | 1221–1242 | `type_list.md` ("`exportEmpties` inheritance") |
| 4 | Import/Export Data (intro) | 1259–1276 | `data_import_and_export.md` (already covered there) |
| 5 | Reveal of hot keys | 1640–1664 | `hotkeys.md` ("Hotkey Reveal" section, expand CSS) |
| 6 | Smooth navigation | 2273–2315 | **New page: `keyboard_navigation.md`** |

## Mixed sections heavy on documentation

| # | Section | Lines | Move content to |
|---|---------|-------|-----------------|
| 7 | Animations | 2603–2728 | **New page: `animations.md`** |
| 8 | Collapsible sections | 1733–2271 | `type_form.md`/`type_list.md` subsections |
| 9 | Smart value coercion (scalar→array) | 2736–2840 | `type_list.md` ("Value coercion on import") |
| 10 | Type coercion (number/date/time) | 2843–2984 | **New: `value_coercion.md`** or distribute to per-type pages |
| 11 | Hidden actions | 2528–2600 | `hotkeys.md` ("Hiding triggers while preserving hotkeys") |
| 12 | Hotkeys and context | 1667–1730 | `hotkeys.md` ("Context Sensitivity" + "Conflict Resolution") |
| 13 | 2nd level hotkeys | 2317–2525 | `hotkeys.md` ("2nd Level Hotkeys") |
| 14 | Nesting Mixins | 1245–1257 | `mixin_types.md` ("Mixins composition", "Style de-duplication") |
| 15 | Intercepting import/export | 1278–1387 | `data_import_and_export.md` ("Form submission" subsection) |
| 16 | Context of triggers | 1389–1497 | `data_import_and_export.md` ("Trigger context and target") |

## Recommended new pages under `docs/_advanced_concepts/`

1. **`keyboard_navigation.md`** — Enter/Shift+Enter navigation, Ctrl+Enter for textareas, Tab-flow exclusion rules. Receives "Smooth navigation" content.

2. **`animations.md`** — Entry/exit patterns with `afterRender`/`beforeUnrender`, CSS transition technique, 1ms delay rationale, global vs per-list wiring. Receives "Animations" content.

3. **`value_coercion.md`** — Scalar-to-array, number, date, time, JSON encoding coercion rules. Receives "Smart value coercion" content.

## Sections that are fine as-is (keep)

Just a Form, Auto enabling/disabling, Field Masking, Simple Calculator, Calculator (UX improved), Team Event Planner, Three-Level Nesting (trim intro), Mixins (trim intro, already links to docs), Hot Keys (trim intro, add link), Dynamic Dropdown (stub), Conclusion (stub).

## What stays in the showcase after migration

For every section where docs are moved out, keep:
- The working demo (sampletabs example)
- 1–2 sentence description of what is being demonstrated
- A `See [Page]({{ ... | relative_url }})` link to the new doc location

This preserves the showcase as a visual catalogue while making the docs the canonical source of truth.
