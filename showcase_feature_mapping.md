# Original Showcase → New Showcase Feature Mapping

Generated from `docs/showcase_backup.md` (the original 3500-line showcase).

## Coverage Scorecard

| New Example | Features Covered |
|-------------|-----------------|
| **Just a Form** | auto-registration, nulls, triggers (import/export/clear), bare `data-smark` on `<label>`, context by DOM position, textarea auto-registration, field-level vs form-level actions |
| **Kanban** | mixin templates, `data-for` slots, cross-list drag (`movingDepth`), sortable, `context:"*"`, hotkeys (Ctrl+key, 2nd-level Ctrl+Alt, reveal, context sensitivity, conflict resolution), template roles (`empty_list`, `separator`, `header`, `footer`), events (`afterRender`, `beforeUnrender`), `onAll()` global binding, CSS animations (1ms delay, await in `beforeUnrender`, graceful degradation), hidden buttons with hotkey hints, buttons excluded from Tab flow |
| **Race Registration** | nested forms/lists, collapsible `<details>` with full keyboard nav (Space/Shift+Space/Enter/Alt+Enter across open/closed items and list boundaries), `exportEmpties` + inheritance, `source:".-1"` duplication, `position` action, `count` action, `preserve_non_empty`, `target:"*"`, `failback:"clear"`, date/time coercion, `min_items`/`max_items` auto-disable, `AfterAction_addItem` event |
| **Product Configurator** | mixin templates, `data-for` slots, option overrides, `<style>` auto-deduplication, `registerMask()` API, declarative `mask` property, `unmaskedValue`, external library integration, sortable |
| **NOT COVERED** | 47 features — see full report below |

## NOT COVERED Features (47 items)

### Calculator patterns (entirely uncovered)
| # | Feature | Original section |
|---|---------|-----------------|
| 1 | Singleton pattern (single field; no per-button context) | Simple Calculator |
| 2 | `action:"import"` with `data` property | Simple Calculator |
| 3 | `BeforeAction_import` event interception | Simple Calculator |
| 4 | `ev.preventDefault()` to cancel import | Simple Calculator |
| 5 | `ev.context.export()` to read current value | Simple Calculator |
| 6 | `eval()` for expression evaluation | Simple Calculator |
| 7 | `pattern` attribute for input validation | Simple Calculator |
| 8 | `.on()` vs `.onLocal()` scoping | Simple Calculator |
| 9 | `onRendered()` callback | Simple Calculator |
| 10 | `find("/display")` path lookup | Simple Calculator |
| 11 | Focus returning to input after button import | Simple Calculator |
| 12 | `keydown` event handling on form level | Super Calculator |
| 13 | `ev.originalEvent.key` to read keyboard input | Super Calculator |
| 14 | `ev.preventDefault()` on keydown | Super Calculator |
| 15 | Programmatic import via `ev.context.import()` | Super Calculator |
| 16 | Caret hiding (`caret-color: transparent`) | Super Calculator |
| 17 | Non-hotkey keyboard input (direct keydown) | Super Calculator |
| 18 | Error-in-display pattern | Super Calculator |

### Form submission (entirely uncovered)
| # | Feature | Original section |
|---|---------|-----------------|
| 19 | `action:"submit"` | Intercepting import/export |
| 20 | `<form>` with `action="mailto:..."` | Intercepting import/export |
| 21 | `enctype="application/json"` for JSON API | Intercepting import/export |
| 22 | `BeforeAction_submit` / `AfterAction_submit` | Intercepting import/export |

### API patterns without examples
| # | Feature | Original section |
|---|---------|-----------------|
| 23 | JSON playground editor (textarea scaffold) | Just a Form |
| 24 | `data-smark='{"type":"color",...}'` span-wrapper | Just a Form |
| 25 | `value:[{}]` pre-populate list with empty item | Mixins |
| 26 | `<script>` hooks inside mixin templates | Mixins, Nested lists |
| 27 | Smart date prefill via `<script>` (`AfterAction_addItem`) | Nested lists |
| 28 | `parent.on('AfterAction_addItem', ...)` in template | Nested lists |
| 29 | `import()` with `{ setDefault: false }` | Nested lists |
| 30 | `target` property for data destination (`target:"/editor"`) | Context of triggers |
| 31 | `of:"input"` for list of raw non-form items | Auto enabling/disabling |
| 32 | RemoveItem button inside `<legend>` | 2nd level hotkeys |
| 33 | Dynamic `<select>` options | Dynamic Dropdown |
| 34 | `.on()` vs `.onLocal()` event scoping | Simple Calculator |

### Masking polish (not covered)
| # | Feature |
|---|---------|
| 35 | IMask lazy-to-fixed placeholder switching |
| 36 | `inputMode: "numeric"` for mobile keyboard |
| 37 | `setCustomValidity` on incomplete input |
| 38 | Orange blink feedback on rejected keystrokes |
| 39 | `<script src="...">` for loading external mask library |

### UI / layout details
| # | Feature | Original section |
|---|---------|-----------------|
| 40 | Card layout with CSS grid | Multiple-Level Nesting |
| 41 | Scrollable student list (max-height + overflow) | Multiple-Level Nesting |
| 42 | Refocus on summary after folding from body | Collapsible sections |
| 43 | Label components on non-`<label>` elements | Team Event Planner |
| 44 | Label as drag handle inside `<summary>` | Team Event Planner |
| 45 | In-form hint text (inline documentation) | Team Event Planner |
| 46 | `<select>` with `required` | Intercepting import/export |
| 47 | Styling disabled triggers (`:disabled { opacity }`) | Auto enabling/disabling |
