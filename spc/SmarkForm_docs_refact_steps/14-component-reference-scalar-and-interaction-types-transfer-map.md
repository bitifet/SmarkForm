# Step 14 — Scalar and Interaction Type Transfer Map

**Status:** Number, Date, Time, DateTime-Local, Color, Radio, Select, Trigger, and
Label are finalized at their approved Component Reference routes. Every legacy
sample ID and capture is retained; the Label samples now use the existing stale
test capture (rewritten) plus one new ARIA-token capture. Source discrepancies
found during review are recorded as current-behavior caveats for follow-up; this
documentation step changes no runtime code. Staged legacy pages remain unchanged.

## Page audit and dispositions

| Canonical page | Material retained | Step 14 source/test corrections |
|---|---|---|
| `docs/_component_reference/number.md` | Introduction/usage, `simple_number` demo, `number_error` sample and tests, requirements, full action reference. | Documented native `type="number"` requirement and inference, Number-or-`null` export, `0` as a valid non-empty value, numeric-string import, and `undefined` as a reset signal. Removed duplicated requirements text and staging markers. |
| `docs/_component_reference/date.md` | `simple_date` (demoValue + tests), `date_error` (+ tests), format list, requirements, actions. | Corrected date-only versus instant semantics: `Date`/epoch export uses the UTC calendar date while date-only strings keep their written date. Documented currently accepted formats, `null` for unparseable input, and the field-level reset caveat. |
| `docs/_component_reference/time.md` | `simple_time` (demoValue + tests), `time_error` (+ tests), format list, requirements, actions. | Clarified local-time extraction for `Date`/epoch, timezone-free `HH:mm:ss` export, rejected locale formats, and the field-level reset caveat. |
| `docs/_component_reference/datetime-local.md` | `simple_datetime_local` (demoValue + tests), `datetime_local_error` (+ tests), format list, requirements, actions. | Clarified local `YYYY-MM-DDTHH:mm:ss` normalization, timezone-bearing/epoch conversion to runtime-local time, timezone-free export, and the field-level reset caveat. |
| `docs/_component_reference/color.md` | `simple_color`, `singleton_color`, `singleton_color_error`, demoValue and notes captures, requirements, actions. | Documented native type inference/validation, `isDefined`/disabled empty state, lowercase export, 3-digit expansion, `null`/invalid import behavior, and `undefined` as reset-to-default. |
| `docs/_component_reference/radio.md` | `radio_group_example` with its HTML/demoValue capture, grouping/requirements/actions. | Documented group-by-SmarkForm-name management, generated shared DOM name, selected-value/`null` export, empty-string masking, missing-`value` fallback, click/Delete deselection, and the per-field default reset caveat. |
| `docs/_component_reference/select.md` | Planned API/proposal sketch and adapter note. | Retitled **Select (Planned)**, replaced the work-in-progress stub with an explicit `## Status` section, stated that `<select>` currently uses the generic `input` type, and fixed the proposal URL. No runnable-select claim is made. |
| `docs/_component_reference/trigger.md` | Canonical Step 07 context/target guide and `trigger_context_target` sample. | Clarified that a direct method call such as `myForm.export()` runs the raw method with no trigger origin and no `BeforeAction_*`/`AfterAction_*` events; trigger dispatch uses the event-emitting wrapper. |
| `docs/_component_reference/label.md` | `basic_examples` and `advanced_examples` (with CSS and notes captures), options, association reference. | Corrected implicit association to the next field in component-tree order; separated native `for`/`id` from non-native `aria-labelledby` token preservation; documented `LABEL_FOR_NONFIELD`, enhanced-fieldset legend behavior, unenhanced forward search, and HTML's restriction on interactive descendants. Renamed the heading to “Targeting non-scalar fields” while preserving the legacy fragment via `{#targetting-non-scalar-fields}`. Replaced the stale `basic_tests` body and added `advanced_tests`. |

## Cross-page references

| Current source / destination | Step 14 update |
|---|---|
| Form reference | `import()`/`clear` now state that omitted children receive `undefined` and that its meaning is type-specific; date/time/datetime-local normalize to `null` and radio deselects. |
| Data Import and Export guide | Same child-type qualification, with links to the type references. |
| FAQ | `clear` answer distinguishes types that honor a local default from those that become `null` or deselect. |
| Developer Cheatsheet | `import(undefined)` and `clear` rows point to the type-specific reset notes. |
| SmarkForm Forms/Usage agent pages and both Advanced Internals skill formats | Added the date/time/datetime-local/radio override caveat and the Form-level-value workaround, keeping both skill formats in sync. |
| Root `AGENTS.md` and `AGENTS/SmarkForm-Usage.md` | Synchronized the Form/List clear summary and the generic-import caveat. |

## Sampletabs, captures, and custom tests

| Page | Existing sampletabs | Capture declarations | Custom tests |
|---|---|---:|---|
| Number | `simple_number`, `number_error` | 3 | `number_error` remains `tests=false`; `simple_number` keeps `demoValue` for the collector round-trip test. |
| Date | `simple_date`, `date_error` | 5 | `simple_date_tests` and `date_error_tests` remain wired. |
| Time | `simple_time`, `time_error` | 5 | `simple_time_tests` and `time_error_tests` remain wired. |
| DateTime-Local | `simple_datetime_local`, `datetime_local_error` | 5 | `simple_datetime_local_tests` and `datetime_local_error_tests` remain wired. |
| Color | `simple_color`, `singleton_color`, `singleton_color_error` | 6 | All remain `tests=false`; the two demoValue captures remain. |
| Radio | `radio_group_example` | 1 | `tests=false`; the `{"gender":"female"}` demoValue remains. |
| Select | None | 0 | None. |
| Trigger | `trigger_context_target` | 4 | Remains `tests=false`; the collector round-trip test is generated from its `demoValue`. |
| Label | `basic_examples`, `advanced_examples` | 7 (was 6) | `basic_tests` is now wired and asserts the three native `for`/`id` pairs. New `advanced_tests` asserts that all four labels own an association and that the list's pre-existing `aria-labelledby` token survives. |

Total: **15 original sampletab IDs and 35 original capture names** remain, plus
one new `advanced_tests` capture. No sample ID, legacy capture, demoValue, CSS
capture, or pre-existing test wiring was removed. The old `basic_tests` capture
body was unused (`tests=false`) and is replaced.

## Source-verified behavior and follow-up

* `number.export()` returns a JavaScript `Number` for non-empty numeric input and
  `null` otherwise. `0` survives because emptiness is decided by the string
  length and `isNaN`, not truthiness. `number.import(undefined)` restores
  `defaultValue`; explicit `null`/invalid strings become the empty state.
* `date.export()` returns `toISOString().slice(0, 10)`; a `Date` or epoch import
  is an instant, so its UTC date can differ from the local calendar date near a
  timezone boundary. `YYYYMMDD` and `YYYY-MM-DD` strings parse as UTC midnight and
  export the same written date. Non-padded/locale strings export `null`.
* `time` and `datetime-local` use local getters for `Date`/epoch imports and
  export timezone-free strings. Date-only/time-only parsing rejects locale
  forms rather than guessing.
* **Current implementation caveat:** `date`, `time`, and `datetime-local` declare
  `import(data = null, …)`, so the reset signal `undefined` becomes `null` before
  delegating to the generic input import. A direct field `reset()` therefore
  clears the value and can replace a field-local `value` default with `null`
  (the initialization reset does this for `value` attributes/options). Radio
  similarly defaults `import(data = null, …)`, so it deselects and keeps no
  per-field default. An enclosing Form import/reset that supplies an explicit
  value still restores the field. No focused regression test covers field-local
  defaults for these four types; decide whether the overrides should honor
  `defaultValue` like `number`/`color`.
* `color` keeps an `isDefined` flag: with no initial `value` the native input is
  shown disabled and exports `null`; interaction marks it defined. Export is
  lowercase six-digit hex; 3-digit input expands. `undefined` imports
  `defaultValue` (initially `null`), while `null`/invalid values reset the
  undefined state.
* `radio` groups by SmarkForm field name; the first input becomes the master and
  receives a generated shared DOM `name` reused by later inputs. Export returns
  the checked input's `.value` or `null`; an empty-string value is therefore
  indistinguishable from no selection, and a radio without a `value` attribute
  falls back to the browser's `"on"`. Click toggles the current selection off;
  `Delete` clears it. Import requires an exact `.value` match, else all inputs
  are deselected.
* `select` is **not** a registered runtime type. `inferType()` maps `<select>`
  and `<textarea>` to `input`; the `src`/adapter material remains a proposal.
* `label` resolves an explicit `target` from `context` (or the label's parent);
  without one, it searches forward in component-tree order, skipping unenhanced
  intermediate nodes. Native `<label>` writes `for` and generates an `id` only
  when the control lacks one; non-native elements gain an `id` appended to the
  target's existing `aria-labelledby` tokens. A `<legend>` inside an enhanced
  fieldset targets the fieldset's first child; inside an unenhanced fieldset it
  continues the forward search. `LABEL_FOR_NONFIELD`, `EXTRA_FIELD_IN_LABEL`,
  `LABEL_EXPLICIT_TARGET`, `SUMMARY_AS_LABEL`, and `LABEL_INSIDE_SUMMARY` are
  enforced by `label.type.js`.
* **Follow-up:** the new label tests assert DOM relationships only. They do not
  claim screen-reader output or conformance; that remains the separate Step 11
  assistive-technology follow-up.

## Verification

* Regenerated the chapter TOCs for the changed heading sets (new
  “Field defaults and reset” sections; Label's renamed heading with its preserved
  anchor; Select's `Status` section) and confirmed their links match the source.
* Compared canonical and staged legacy inventories: all 35 pre-existing Label,
  scalar, and Trigger capture names plus every sampletab ID remain; only the new
  Label test capture was added.
* Reviewed `src/types/{number,date,time,datetime-local,color,radio,label}.type.js`,
  `src/lib/component.js` (`inferType`), `src/lib/field.js` (reset/clear),
  `src/lib/helpers.js` (`validateInputType`), and `src/types/input.type.js`.
* Jekyll build and rendered public-link/fragment/route checks pass; TOC includes
  are regenerated and unstaged.
* Protected/staged inputs (`docs/_old_*`, `docs/_community/contact.md`,
  `docs/_data/package.json`) were not edited by this step.
* Node/npm and Playwright are unavailable here, so the docs collector and browser
  tests were not run; no test pass is claimed.
