# Step 17 — Final Showcase Transfer Map

**Status:** The four-example Showcase is corrected at `/showcase_examples/showcase`.
Approved supporting examples/tests have landed in List, Mixin Types, Keyboard
Navigation, Hotkeys, and Playground. The 20-example legacy Showcase and
four-example candidate stayed unchanged under `docs/_old_*` through Step 17;
Step 19 removed the temporary sources after final validation.

## Candidate examples and claim corrections

| Sample ID | Step 17 result | Demo/test status |
|---|---|---|
| `just_form` | Retained field inference, singleton Color wrapper, labels, clear trigger, Number and JSON editor. Replaced the blanket “empty values are null” claim with Color `null`, text empty-string, and Number-or-null distinctions. | All original capture names remain; demoValue is populated/passed. New `just_form_tests` checks text/Number/Color imports and Color clear. |
| `kanban` | Retained mixin slots, independent columns, sortable handles, `header`/`empty_list`, relative hotkeys, wildcard cleanup, and BeforeAction confirmation. Corrected `movingDepth` to `moving_depth`, limited the same-template compatibility claim, and removed the unsupported animation claim. Reframed CSS as globally injected class-prefixed styles, not encapsulation. | Demo values now match the Form item shape and are passed to the generated initializer. Confirmation is attached via `jsSource`. New `kanban_tests` exercises cross-list movement and `preserve_non_empty` cleanup. |
| `race` | Retained nested form/list structure, source-based duplication, position action, native details keyboard flow, hotkeys, and mixed controls. Removed the nonexistent age-versus-distance business validation; corrected `exportEmpties`, Select (generic Input) wording, and type-specific empty-value statements. | DemoValue now includes authored defaults and is passed to the include. New `race_tests` checks Number/Radio values, previous-item duplication, and automatic min-bound disabling. |
| `configurator` | Retained reusable car-card mixins, sortable list, cleanup, and price masking. Corrected the false vehicle-variant and scoped-CSS claims. Replaced the mismatched Inputmask-script/IMask-code pair with a pinned IMask 6.6.3 declarative mask; corrected display grouping and numeric unmasked export; removed the unnecessary obsolete mixin-script policy. | DemoValue prices are numbers and the standard initializer loads them. The mask factory falls back to an unformatted working number field if IMask fails. New `configurator_tests` checks formatting and Number export/import. |

The original four `formId`s and **17 source capture declarations** remain; six
JS/test captures were added (**23 declarations**). Each example now has an
intentional demoValue path or an inline HTML initial value.

## Approved canonical transfers landed

| Legacy material | Step 17 destination | Preserved behavior/test |
|---|---|---|
| `schedule_list` — empty/separator/last-separator roles and 0–3 bounds | `docs/_component_reference/list.md`, `formId="schedule_list"` | Reused the schedule UI/role/value captures; added notes, a JS explanation capture, and `schedule_list_tests` for both separator roles, empty state, and boundary disabling. |
| `school_groups` — school → groups → students → grade lists and sibling movement | `docs/_component_reference/list.md`, `formId="deep_school_groups"` | Added a compact three-level nested Form/List example and `deep_school_groups_tests`, which moves a student between lists and checks its score data. |
| `nested_schedule_table` — nested list/mixin composition and snippet slots | `docs/_guides/mixin_types.md`, `formId="mixin_nested_composition"` | Added a composed `#periodCard` → `#timeRange` example with independent `data-for` headings, nested values, demoValue, and a custom test. |
| `collapsible_sections` and its keyboard regression test | `docs/_accessibility/keyboard_navigation.md`, `formId="collapsible_sections"` | Moved the original contacts/details structure, CSS, demoValue, and full keyboard regression test (Space/Shift+Space, forward/backward navigation, Alt+Enter variants). Kept the existing `nav-details` sample. |
| `2nd_level_hotkeys_tests` | `docs/_accessibility/hotkeys.md`, existing `formId="hk-2ndlevel"` | Added `hk_2ndlevel_tests` to check that Ctrl reveals the nearest Add Phone action and Ctrl+Alt reveals the outer Add Entry action. |
| `supercalculator` and its keyboard test | `docs/_showcase_examples/playground.md`, `formId="supercalculator"` | Added a second Playground example, adapted the keyboard result test, scoped key handling to the display, and shared the arithmetic parser with the first calculator; neither example uses `eval`. |
| Legacy simple calculator | Existing Playground `formId="playground-calculator"` | The previous simple calculator remains the first Playground example. |
| `event_planner_showcase` | Existing homepage `docs/index.md`, `formId="event_planner"` | The home-page form has the same JS and equivalent organizer/attendee/date-time/hotkey/animation behavior with a larger demo value; no duplicate Showcase section is needed. |

The old `school_groups_tests` and `nested_schedule_tests` assertions are adapted
across `deep_school_groups_tests`, `mixin_nested_composition_tests`,
`schedule_list_tests` (empty role), and `race_tests` (previous-item duplication).
`collapsible_sections_tests` is retained in the canonical Keyboard Navigation
sample; `2nd_level_hotkeys_tests` is adapted to `hk-2ndlevel`; and
`supercalculator_tests` checks the keyboard expression/result in Playground.
The old `just_form_tests` is adapted to the expanded Just a Form sample. Dynamic
Dropdown remains reviewed not-retained because its source include referenced an
undefined HTML capture and the section was an under-construction stub.

The original **20 legacy sample IDs, 73 capture declarations, and six custom
test captures** were verified before cleanup; the four candidate sample IDs and
17 original capture names are retained in the canonical Showcase. The old
source files have been removed.

## Migration records and verification

* `03-source-destination-ledger.md` now records the final Showcase claim and
  destination decisions, every legacy include/capture, the approved additions,
  and the candidate correction status. Step 10, 11, 13, and 16 maps have Step 17
  addenda where their current example inventories changed.
* Paired `BEGIN old PORTED TO` / `END old PORTED TO` markers delimited the
  final candidate page and transferred List, Mixin, Accessibility, Hotkeys, and
  Playground material during review. Legacy sources remained untouched through
  Step 17; Step 19 removed the markers and source copies after final validation.
* Updated root `README.md` feature links to actual Showcase anchors or canonical
  destinations; redirected its school-data demo to the new List example and
  keyboard guidance to Accessibility. Updated the FAQ's animation/list examples
  to their canonical guides.
* At the Step 17 completion state, the Showcase kept
  `migration_in_progress: true` and `sitemap: false` and emitted
  `noindex, nofollow`. Step 19 removed those temporary controls; the final route
  is indexable, and approved legacy redirects remain.
* Jekyll build passes. Rendered public-link/fragment checks report zero broken
  public links/fragments. The generated List/Mixin/Showcase TOCs include the new
  headings; the Playground TOC includes Keyboard Calculator.
* Node/npm and Playwright are unavailable; collector and browser tests were not
  run. They remain for the user.
