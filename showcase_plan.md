# SmarkForm Showcase — Restructuring Plan

> **Merged** from `old_showcase_examples_plan.md` (3-example, 71-feature draft)
> and the current 4-example implementation.

## Currently Implemented (all 4 examples pass smoke + demoValue round-trip)

### 1. Just a Form
| Covered | Feature |
|---------|---------|
| ✅ | `data-smark` auto-registration |
| ✅ | Null values (color picker → `null`) |
| ✅ | Trigger buttons: `import`, `export`, `clear` |
| ✅ | JSON playground editor integration |

### 2. Project Kanban Board
| Covered | Feature |
|---------|---------|
| ✅ | Mixin template (`#kanbanCol`) with scoped `<style>` and `data-for` slots |
| ✅ | Cross-list drag (`sortable:true` + `movingDepth:1`) with source-ID stamping |
| ✅ | `context:"*"` multi-dispatch (`🧹` clears empty tasks from all 3 columns) |
| ✅ | Event-driven confirmation: `BeforeAction_removeItem` + `ev.preventDefault()` |
| ✅ | Hotkeys (`+`/`-`) scoped per column via natural context resolution |
| ✅ | Empty-list placeholders (`min_items:0`, `role:"empty_list"`) |
| ✅ | Header template role inside mixin |
| ✅ | Sortable handles (`type:"label"` with `☰` drag indicator) |
| ✅ | Flexible columns: list root fills available height for easy drag target |

### 3. Race Registration System
| Covered | Feature |
|---------|---------|
| ✅ | List + nested form (`type:"list"` → `type:"form"` inside `<li>`) |
| ✅ | Duplication: `source:".-1"` copies previous member's data |
| ✅ | Collapsible sections: `<details>`/`<summary>` for Emergency Contact |
| ✅ | Value coercion: age as `number`, empty → `null` |
| ✅ | `position` action for auto-numbered bibs |
| ✅ | `preserve_non_empty:true` + `target:"*"` for bulk `🧹` clean-up |
| ✅ | Hotkeys: `+` add member, `-` remove, `*` duplicate, `Delete` clean empties |
| ✅ | `min_items:1` to ensure at least one member |
| ✅ | `exportEmpties:false` to skip empty entries |
| ✅ | Various input types: text, number, radio group, select, color picker, tel |

### 4. Product Configurator
| Covered | Feature |
|---------|---------|
| ✅ | Mixin template (`#carModel`) with embedded scoped `<style>` |
| ✅ | CDN-sourced Inputmask integration via `SmarkForm.registerMask("price", ...)` |
| ✅ | `unmaskedValue` getter/setter for clean JSON export |
| ✅ | `mask` property in `data-smark` |
| ✅ | `inputMode:"decimal"` for mobile keyboard hint |
| ✅ | Sortable list of car models |
| ✅ | `position` action for auto-numbering |
| ✅ | `preserve_non_empty:true` + `target:"*"` for bulk clean-up |
| ✅ | `exportEmpties:false` to skip empty entries |
| ✅ | Hotkeys: `+` add model, `-` remove |

---

## UNCOVERED FEATURES — Enriched from Old Plan

Each uncovered feature is assigned to the best-fit example.  Items marked with `*`
are ideas recovered from `old_showcase_examples_plan.md` that improve on the
current version.

### ⬜ Kanban Board

| Priority | Feature | From old plan? | Notes |
|----------|---------|:---:|-------|
| ⬜ HIGH | **Animations** — entry/exit transitions via `afterRender` / `beforeUnrender` lifecycle events; CSS `transition` with requestAnimationFrame trick; `onAll()` for global wiring; graceful degradation (animation classes via JS) | * | The old plan dedicated a full feature set to this. Kanban cards sliding in/out is visually compelling. |
| ⬜ HIGH | **`count` action** — show "{N} tasks" in each column header using a label component with dynamic text | * | Simple, high-visibility pattern. The old plan had count in both Ex1 and Ex2. |
| ⬜ HIGH | **`AfterAction_addItem` auto-focus** — when a new task is added, auto-focus its title input so the user can start typing immediately | * | Natural UX. The old plan listed `AfterAction_addItem` explicitly. |
| ⬜ MEDIUM | **Hidden actions** — CSS-hide per-item buttons while keeping hotkeys active (`visibility:hidden;width:0` preserves `::after`); show on hover/focus | * | Cleaner Kanban card UI. Old plan mentioned this explicitly. |
| ⬜ MEDIUM | **2nd-level hotkeys (Ctrl+Alt)** — Ctrl+Alt+- clears a column entirely; demonstrate nested hotkey hierarchy | * | Old plan had "2nd level hotkeys" and "hidden actions" in Kanban. |
| ⬜ LOW | **Label expressions** — use label component to display computed values (e.g., "3 of 5 slots used") | * | Demonstrates label's expression capability. |

### ⬜ Race Registration

| Priority | Feature | From old plan? | Notes |
|----------|---------|:---:|-------|
| ⬜ HIGH | **`submit` action + `BeforeAction_submit`** — "Submit Registration" button; intercept for validation or `fetch()` API posting with JSON | — | Core form action not yet in any example. |
| ⬜ HIGH | **`registerCustomAction()`** — register a global "validateAge" action; trigger it from a button or the Age field's `BeforeAction_import` handler; show `ev.preventDefault()` on validation failure | — | Custom actions are documented but have no example. |
| ⬜ HIGH | **Date/time coercion** — add `type:"date"` and `type:"time"` fields; demonstrate ISO string export and coercion from JSON import | * | Old plan had "Date coercion" and "Time coercion" explicitly in Ex1 (Conference). Current Race notes mention it but has no date/time inputs. |
| ⬜ MEDIUM | **`BeforeAction_import` for validation** — intercept import to validate fields (e.g., ensure email format, required fields filled) | * | Old plan listed this as a key feature in Ex1. Differs from Kanban's `BeforeAction_removeItem`. |
| ⬜ MEDIUM | **`failback:"clear"`** on removeItem — when `min_items:1` is reached, clear the last member's fields instead of refusing | — | The old schedule/dietary examples showed this. |
| ⬜ MEDIUM | **`target` property on triggers** — add a JSON textarea below the form; use `export` button with explicit `target` to dump registration data into it, and `import` button with `target` to load | * | Old plan: "target property (export → editor textarea)". Demonstrates explicit target resolution distinct from context. |
| ⬜ MEDIUM | **Dynamic dropdowns** — T-shirt color options filtered by selected size (dependent selects) | — | The old showcase had a "Dynamic Dropdown Options" stub. |

### ⬜ Product Configurator

| Priority | Feature | From old plan? | Notes |
|----------|---------|:---:|-------|
| ⬜ HIGH | **Mixin composition** — nest a `#carOptions` mixin inside `#carModel` to demonstrate hierarchical mixin reuse (model → option set) | * | Old plan: "mixin composition (car model template includes option templates)". Key architectural feature. |
| ⬜ MEDIUM | **Mixin `<script>` per-instance hook** — use `this` context in a `<script>` inside the mixin template to compute derived values (auto-calculate tax from price); requires `smark_mixin_allowLocalScripts:"allow"` | * | Old plan: "mixin `<script>` (per-option price calculator)". |
| ⬜ MEDIUM | **Option overrides in placeholders** — each car usage overrides template defaults (e.g., a specific model has `sortable:false` even though the template set `sortable:true`) | * | Old plan: "option overrides (each car usage overrides template defaults)". |
| ⬜ MEDIUM | **Deeper field masking** — lazy-to-strict switching, incomplete mask → `null`, `<script type="smark-mask">` declarative registration, `smark_mask_throwOnMissing` | — | Field masking page documents all these; Configurator only shows basic registerMask. |
| ⬜ LOW | **`of:"input"` shortcut** — replace a list's full item template with just an `<input>` for simple cases (e.g., a quick list of car color names) | * | Old plan listed this as a Configurator feature. Simple but powerful syntactic sugar. |
| ⬜ LOW | **JSON encoding** — add a metadata textarea with `{"encoding":"json"}` to demonstrate JSON-encoded field round-tripping | * | Old plan: "JSON encoding on metadata textarea". |
| ⬜ LOW | **`value:[{}]` default** — start with one blank car model when `min_items:0` | — | Old plan showed this pattern for pre-populating lists. |

### ⬜ Just a Form (no changes planned)
This example intentionally stays minimal — the simplest possible SmarkForm.

---

## Features NOT Planned for Any Example

| Feature | Reason deferred |
|---------|----------------|
| Calculator pattern | Very specific UX; needs its own example |
| `mailto:` support | Too domain-specific |
| `separator` / `last_separator` template roles | Niche inline formatting |
| Keyboard navigation deep-dive (Enter/Shift+Enter, Tab-flow) | Already works; not visually distinct |
| Singleton field pattern | Specialized; could be in a field masking deep-dive |
| `customActions` (per-instance) vs `registerCustomAction` (global) | Globally registered version covers both |

---

## Implementation Order (Recommended)

| # | Example | Feature | Priority |
|---|---------|---------|----------|
| 1 | Kanban | `count` action per column header | HIGH |
| 2 | Kanban | `AfterAction_addItem` auto-focus | HIGH |
| 3 | Kanban | Animations (afterRender/beforeUnrender) | HIGH |
| 4 | Race | `submit` action + `BeforeAction_submit` | HIGH |
| 5 | Race | `registerCustomAction()` | HIGH |
| 6 | Race | Date/time coercion fields | HIGH |
| 7 | Configurator | Mixin composition | HIGH |
| 8 | Kanban | Hidden actions | MEDIUM |
| 9 | Kanban | 2nd-level hotkeys (Ctrl+Alt) | MEDIUM |
| 10 | Race | `BeforeAction_import` for validation | MEDIUM |
| 11 | Race | `target` property (export → textarea) | MEDIUM |
| 12 | Race | `failback:"clear"` | MEDIUM |
| 13 | Race | Dynamic dropdowns | MEDIUM |
| 14 | Configurator | Mixin `<script>` hook | MEDIUM |
| 15 | Configurator | Option overrides | MEDIUM |
| 16 | Configurator | Deeper field masking features | MEDIUM |
| 17 | Kanban | Label expressions | LOW |
| 18 | Configurator | `of:"input"` shortcut | LOW |
| 19 | Configurator | JSON encoding | LOW |
| 20 | Configurator | `value:[{}]` default | LOW |

Each feature implemented as a single commit with updated notes capture and
cross-references in the sampletabs documentation.
