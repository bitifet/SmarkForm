# Showcase Examples — Redesign Plan

## Example 1 — Conference Registration System

**Real-world problem:** Registering attendees for a multi-track conference. Collect
personal details, let them pick workshops (with capacity limits), capture billing
info, and submit.

**Features demonstrated (41 features):**

🟢 auto-registration
🟢 null values
🟢 labels (both native `<label data-smark>` and drag-handle `<span data-smark='label'>`)
🟢 triggers (add/remove/export/import/reset/clear/submit)
🟢 form nesting (`person` → `billing` subform)
🟢 list types (workshops list)
🟢 sortable / drag-and-drop (reorder workshops)
🟢 empty_list template role ("No workshops selected")
🟢 separator / last_separator (comma between workshops)
🟢 position action (numbered workshops)
🟢 count action ("{N} workshops selected")
🟢 min_items / max_items (`min_items:0, max_items:5` on workshops)
🟢 auto-disable triggers (➕ disables at max, ➖ disables at min)
🟢 exportEmpties (omits empty workshop slots)
🟢 collapsible sections (`<details>` for billing address, dietary restrictions)
🟢 Enter / Shift+Enter navigation
🟢 Space / Shift+Space in `<details>` inputs
🟢 Alt+Enter into collapsed sections
🟢 Tab-flow exclusion (hotkey-equipped ➕/➖ inside workshops list)
🟢 hotkeys (➕/➖ for workshops, submit, reset)
🟢 hotkey reveal (Ctrl)
🟢 `preserve_non_empty` (🧹 clears only empty workshops)
🟢 `target:"*"` (🧹 clears all empty)
🟢 `context` property on triggers
🟢 `target` property (export → editor textarea)
🟢 `import` / `export` / `clear` / `reset` / `submit` actions
🟢 `BeforeAction_import` interception (validate fields before import)
🟢 `.on()` event listener
🟢 `mailto:` support (submit → email)
🟢 Number coercion (age field)
🟢 Date coercion (registration date)
🟢 Time coercion (arrival time preference)
🟢 Null for empty fields
🟢 Scalar-to-array coercion (single workshop → array on import)
🟢 `<details>` as list items (workshop details expandable)
🟢 Playground editor scaffold (demo subform + editor)
🟢 demoValue pre-population
🟢 CSS grid/flex layout
🟢 in-form hints ("Hold Ctrl for shortcuts")
🟢 input types (text, number, email, tel, date, time, select, textarea)

---

## Example 2 — Project Kanban Board

**Real-world problem:** A task management board with columns (To Do / In Progress /
Done). Tasks can be added, reordered, dragged between columns, and completed with
keyboard shortcuts. Entry/exit animations when moving tasks.

**Features demonstrated (20 features, 5 already covered by Example 1):**

🟢 triggers
🟢 list types
🟢 sortable
🟢 empty_list
🟢 min_items / max_items
🟢 auto-disable
🟢 position
🟢 count
🟢 labels
🟢 input types

🟡 cross-list drag-and-drop (move tasks between To Do / In Progress / Done columns — `movingDepth:1`)
🟡 context sensitivity (Ctrl+- removes task from current column, context-aware per column)
🟡 2nd level hotkeys (Ctrl+- removes task, Ctrl+Alt+- clears column)
🟡 hidden actions (per-task "Promote" button hidden, activated via Ctrl+P)
🟡 `.onAll()` for animations
🟡 `.onLocal()` in notes
🟡 `afterRender` event (tasks slide in)
🟡 `beforeUnrender` event (tasks slide out)
🟡 1ms delay technique
🟡 graceful degradation (animation classes via JS)
🟡 CSS transitions
🟡 `keydown` interception (global keyboard shortcuts like `n` for new task)
🟡 `AfterAction_addItem` (auto-focus new task title)
🟡 `BeforeAction_export` (export filter)
🟡 `failback` (can't remove last "To Do" — clears instead)
🟡 Keyboard Enter crosses list boundary
🟡 Keyboard Shift+Enter backward across list boundary

🟡 features not yet covered: cross-list DnD, context sensitivity, 2nd level hotkeys, hidden actions,
  animations lifecycle, keydown interception, failback

---

## Example 3 — Product Configurator with Mixin Templates

**Real-world problem:** A car customization tool. Select a model (mixin template
for each car class), choose options (color, wheels, interior — each a mixin
template), see the price update automatically (masked input with Inputmask).

**Features demonstrated (16 features, 4 already covered by Examples 1-2):**

🟢 triggers, labels, list types, input types

🟡 mixin types (`<template id="carModel">`, `type:"#carModel"`)
🟡 data-for slots (inject option labels into car option templates)
🟡 mixin composition (car model template includes option templates)
🟡 mixin `<style>` (per-car-model styling, deduplicated)
🟡 mixin `<script>` (per-option price calculator)
🟡 option overrides (each car usage overrides template defaults)
🟡 singleton pattern (price field with buttons inside)
🟡 field masking (Inputmask for price — space grouping, decimal formatting)
🟡 `unmaskedValue` (export clean price)
🟡 `registerMask` (Inputmask wrapped in SmarkForm mask factory)
🟡 `inputMode:"decimal"` (mobile keyboard)
🟡 `of:"input"` shortcut (list of simple color name inputs)
🟡 JSON encoding (`{"encoding":"json"}` on metadata textarea)
🟡 `customActions` / `registerCustomAction` ("calculateTotal" action)
🟡 in-form hints

🟡 features not yet covered: mixins (all sub-features), singleton, field masking,
  Inputmask, registerMask, unmaskedValue, of shortcut, JSON encoding, customActions

---

## Summary: All 71 Features Covered in 3 Examples

| Category | Features | Covered in Example |
|----------|----------|-------------------|
| Architecture | auto-registration, nulls, playground scaffold | 1 |
| Component Types | labels, triggers, form nesting, list types, of shortcut, singleton, input types | 1, 3 |
| List Mechanics | min/max_items, auto-disable, template roles, empty_list, separator, sortable, cross-list DnD, exportEmpties, position, count, source, preserve_non_empty, target:*, failback | 1, 2 |
| Actions | import, export, clear, reset, submit, addItem/removeItem, customActions | 1, 3 |
| Events | context, target, BeforeAction interception, AfterAction, .on/.onLocal/.onAll, keydown interception | 1, 2 |
| Keyboard | Enter/Shift+Enter, Ctrl+Enter, Tab-flow exclusion, Space/Shift+Space, Alt+Enter, Enter across list boundaries | 1, 2 |
| Hotkeys | hotkey definition, reveal, context sensitivity, 2nd level, hidden actions | 2 |
| Mixins | mixin types, data-for, composition, style dedup, scripts, option overrides | 3 |
| Field Masking | mask property, unmaskedValue, registerMask, Inputmask | 3 |
| Animations | afterRender, beforeUnrender, 1ms delay | 2 |
| Type Coercion | number, date, time, JSON encoding, scalar-to-array | 1, 3 |
| Collapsible | `<details>` as list items, keyboard interaction with details | 1 |
| Other | mailto, in-form hints, CSS layout, demoValue, graceful degradation | 1, 2, 3 |
