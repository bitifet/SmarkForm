# Step 13 — Form, List, and Input Transfer Map

**Status:** Form, List, and Input are finalized at their approved Component
Reference routes. Their detailed APIs, sample IDs, captures, and custom test
wiring remain. Source discrepancies discovered during review are documented for
follow-up; this documentation step changes no runtime code. Staged legacy pages
remain unchanged.

## Page audit and dispositions

| Canonical page | Material retained | Step 13 source/test corrections |
|---|---|---|
| `docs/_component_reference/form.md` | Nested-object introduction and sample; Clear vs Reset sample and its custom test; `value`, `focus_on_click`, `auto_id`; export/import/clear/reset/submit actions; native and JSON submission semantics; submitter overrides; form-encoding options; planned `null` action note. | Added object export/import shape and missing/extra-key rules. Clarified parent-vs-child `set_default`, form-level versus child-local defaults on `clear`, and native submit-button/Enter behavior. Fixed two `placeholder` typos. Replaced the example's `alert()` with inline export output without changing its ID or custom-test wiring. |
| `docs/_component_reference/list.md` | All five sampletabs and 14 capture declarations; item/role rules, scalar/singleton/nested examples, defaults, min/max, sorting/cross-list movement, programmatic `move`, actions and file-like behavior. | Corrected `minItems` to `min_items` and `max_items` minimum to `min_items`; fixed the scalar-list explanation; linked shared context/target semantics to Trigger/Form Traversing; documented media-list drop-to-append; clarified that retained minimum rows reset to their own defaults on clear/reset. |
| `docs/_component_reference/input.md` | Generic input example, JSON format section, and action reference. The sample ID/capture and demoValue remain. | Distinguished native string values and checkbox booleans from specialized types; documented native `placeholder`/`value` precedence, `VALUE_CONFLICT`, `import(undefined)`, mask cross-link, falsey JSON behavior, and checkbox `isEmpty()` behavior. |
| `docs/_guides/data_import_and_export.md` | Existing import/export/default prose and `clear_vs_reset` sample remain. | Clarified the actual child-default and list-minimum effects of the type-level `clear` import. |
| FAQ and AI/agent references | Existing FAQ and Forms/Usage agent material remains. | Updated FAQ and agent action summaries to distinguish empty values from child defaults and list constraints. Updated both Advanced Internals skill formats with the checkbox/list emptiness behavior. |

## Sampletabs, captures, and custom tests

| Page | Existing sampletabs | Capture declarations | Custom tests |
|---|---|---:|---|
| Form | `simple_form`, `clear_reset_form` | 8 | `clear_reset_example_tests` remains wired to `clear_reset_form`; it smoke-tests button actions but not child-local defaults. Its export result now renders inline. |
| List | `simple_list`, `scalar_list`, `singleton_list`, `nesting_list`, `cross_list_drag` | 14 | `cross_list_drag_tests` remains wired to `cross_list_drag`. |
| Input | `input_basic_usage` | 1 | `tests=false`; demoValue remains for the collector-generated round-trip test. |

Total: **8 original sampletab IDs and 23 original capture names** remain. No
sample ID, capture, custom-test capture, or wiring was removed. Node/npm are
unavailable here, so the docs collector and browser tests were not run.

## Source-verified behavior and follow-up

* `form.export()` returns an object keyed by child names. `form.import()` accepts
  a plain object or a JSON string containing one; matching child names import
  recursively, missing names pass `undefined` to the child, and unmatched keys
  are ignored. The child decides how `undefined` is handled: generic input,
  number, and color use it as a reset signal; date/time/datetime-local normalize
  it to `null`, and radio groups deselect. A parent import updates only the
  originating component's default; descendants receive `set_default:false`.
* `form.clear()` imports `{}`. It ignores the Form's saved default, but does not
  recursively call each child's `clear()`: omitted child keys receive
  `undefined`, with the resulting state determined by each child type's import
  override. The Form sample has only a parent-level demoValue and generic text
  children, so its values become empty.
* `list.min_items` defaults to `1`; `max_items` defaults to `Infinity` and is
  clamped to at least `min_items`. `addItem`/`removeItem` enforce those bounds.
  List export delegates emptiness to each item type; when `export_empties:false`,
  it still retains enough empty entries to meet `min_items`.
* `list.clear()` imports `[]`; list import removes rows only above `min_items`
  and resets retained minimum rows to their own defaults. `reset()` uses the
  same path for rows beyond a shorter stored default.
* **Follow-up:** generic checkbox inputs export booleans, but
  `input.isEmpty()` currently treats every checkbox as empty, even when checked.
  A checkbox-only list row may be omitted with `export_empties:false`. No focused
  test covers this case; decide whether checked state is meaningful for emptiness.
* `sortable` enables same-list drag movement; `moving_depth` allows bounded
  cross-list movement. `move(options)` is a list method, not an action.
  Automatic sorting by field value is not implemented. File-like list drops
  append items unless list-level `file_drop:false` is set.
* Native `<form>` submission is captured when a submit button was clicked,
  retains `event.submitter`, and honors per-button overrides. Enter from a
  non-submit field navigates rather than submits; Enter on a focused submit
  button still activates it. JSON submission requires root opt-in and does not
  add submitter name/value to the JSON body.

## Verification

* Compared the staged and canonical example inventories; all Form/List/Input
  sample IDs, captures, demoValues, and custom-test wiring remain.
* Reviewed `src/types/form.type.js`, `list.type.js`, and `input.type.js`,
  `src/lib/field.js`, list decorators, and `test/type_form_submit.tests.js`,
  `test/type_list.tests.js`, and `test/clear_reset.tests.js`. The clear/reset
  suite does not cover a Form child with a date/time/datetime-local/radio local
  default; type overrides currently differ in their `undefined` handling.
* Jekyll build and rendered public-link/fragment checks pass.
* Node/npm and Playwright are unavailable; no browser test pass is claimed.
