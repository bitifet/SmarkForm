# Step 16 — Showcase Audit and Destination Decisions Transfer Map

**Status:** This records the Step 16 audit and maintainer decisions. Step 17 has
landed the approved schedule-role and deep-nesting/composition examples in
canonical references and moved the tested second calculator to Playground; see
`17-final-showcase-transfer-map.md` for completion details. The 20-example
legacy Showcase remains staged and unchanged; no legacy page has been deleted.

## Maintainer decisions

| Material | Decision | Step 17 result |
|---|---|---|
| Legacy `schedule_list` (`separator` / `last_separator`) | Add as a runnable example to the canonical List reference, not as a fifth Showcase section. | Landed as `schedule_list` with explicit List/Form roles and `schedule_list_tests` for both separators and bounds. |
| `school_groups` and `nested_schedule_table` | Add smaller tested examples to canonical List/Mixin references. The candidate Race example is not equivalent; separate Form/List examples cover only part of this combined nesting/composition behavior. | Landed as `deep_school_groups` (nested Lists/Forms and tested cross-list moves) plus `mixin_nested_composition` (nested mixins/snippet slots and independent values). |
| Legacy `supercalculator` | Move to the canonical Playground page as a second calculator example. | Landed as a second Playground sample with the original keyboard test, a field-scoped keyboard handler, and an arithmetic parser instead of `eval`. |
| Legacy `dynamic_dropdown` | Reviewed not-retained. | The page is explicitly “under construction”; `htmlSource=dynamic_dropdown` refers to no capture and there is no runnable dropdown. The current Select page and API Interface page accurately mark dynamic options as planned, not implemented. Do not create a working claim from this stub. |

All other source material has an exact current destination below. The old source
and old candidate remain staged unchanged until the final cleanup step.

## Candidate claims: verified corrections

| Candidate locator (`old_showcase2.md`) | Source finding | Step 17 correction |
|---|---|---|
| L155–221, Just a Form: “Empty inputs produce `null`” | This is only true for nullable component types such as the Color field in this example. Generic text and native select values export strings (including `""`); Number exports a number or `null`. See Input, Number, Color, Form and Import/Export references. | Say that the Color field exports `null` when undefined; do not generalize to all empty inputs. Preserve the color-clear demonstration and explain the editor separately. |
| L255–256, Kanban intro: entry/exit animations | The Kanban markup/CSS has no animation lifecycle classes or handlers. The separate Animations guide and the homepage Event Planner are the current demonstrations. | Remove the animation claim from Kanban, or add a real animation only if deliberately wanted and tested. |
| L293, Kanban: `movingDepth` | The option is `moving_depth`; camelCase is not an alias (`CHANGELOG.md` migration table; `src/lib/options.js`). The cross-list decorator checks the option on both lists and computes sibling distance. Lists with the same mixin template receive distance zero; that is a compatibility exception, not general unrestricted movement (`src/types/list.decorators/sortable.deco.js`, `_siblingDistance`). | Use `moving_depth`. Explain that the three same-template columns may exchange items because their mixin identity makes them compatible; do not imply arbitrary cross-list reach. |
| L383–385, Kanban feature summary: “unrestricted movement” / “same mixin template” | Same-template lists are recognized, but cross-list permission still uses both list settings and the sibling-distance rule. The feature summary omits that contract. | Scope the claim to the three instances of this mixin and explain the current same-template rule. |
| L287–292, 458–464, Kanban CSS claims | Mixin `<style>` blocks are extracted into the document `<head>` and are global. Class-qualified selectors can limit where they match; they do not provide encapsulation. See `docs/_guides/mixin_types.md#styles`. | Rename the feature to class-prefixed/global mixin styles; state that the `.kanban-mixin` selector limits these particular rules but is not CSS scoping. |
| L489–490, 593–594, 656–660, Race: age/distance and empty values | The sample contains an Age input with native `min`/`max`, but no race distance field and no business-rule validator. It does not auto-validate age against distance. Empty values are type-specific: text/select can be `""`, Number and Radio can be `null`, and this markup gives Color a non-empty default. `exportEmpties` is also obsolete; the current option is `export_empties`. | Remove the age-vs-distance claim; describe the browser constraints only if retained. Correct empty-state language by field type and all option spellings. |
| L688–701, Race: `exportEmpties` / mixed types | `exportEmpties` is a pre-0.25 spelling, not an alias. The current default also omits empty list rows, so the observed effect can look correct even though that authored key is ignored. `<select>` is a native control handled by generic `input`, not a registered SmarkForm `select` component; its value remains a string. | Use `export_empties` and qualify the select as native/generic input behavior. |
| L713–715, 835–841, Product Configurator variants and “scoped CSS” | The card template has model/color/price fields but no Sedan/SUV/Sports selection or variant-specific options. Mixin styles are global. | Describe reusable car cards rather than vehicle variants; qualify class-based CSS naming as global styles. |
| L719, 754–785, 848–863, Product Configurator mask | The HTML loads `inputmask@5.0.9`, but the JavaScript calls the `IMask` global and uses IMask APIs (`masked`, `updateOptions`, `_selection`). The globals/APIs do not match. `_selection` is a private, version-sensitive IMask property. The existing `test/mask_imask.tests.js` covers a different card mask, not this currency mask. | Use a pinned IMask build matching the factory (or use Inputmask's actual API), correct the displayed grouping (`34 900.00`, not `3 4900.00`), verify numeric export/import and incomplete input, and avoid claiming cross-version robustness for private internals. |
| L747, 823–827, Product Configurator mask/options/demo | The sample passes an obsolete `smark_mixin_allowLocalScripts` spelling, and no script is nested in a mixin template so that policy is not needed. Its custom `jsHead` constructs the form itself; the `demoValue` include argument is therefore not automatically used by that preview. | Remove the unnecessary script-policy option; make the custom initializer actually seed the preview and retain a collector round-trip test. |
| All four candidate sampletab includes | All have `tests=false`. Only Product Configurator passes a `demoValue`; Just a Form, Kanban and Race define captures but do not pass them to their include. Custom `jsHead` also overrides the generated initializer. | Step 17 must wire useful demo data and ensure the final examples receive collector smoke tests; add focused custom tests for the corrected distinctive behaviors. |

## Legacy sections and prose → verified destinations

The line numbers below are the original Showcase source locators recorded by the
baseline inventory; the source remains at `docs/_old_about/old_showcase.md`.

| Legacy locator / sample | Current destination or approved decision | Coverage audit |
|---|---|---|
| L46–120, Basics > Just a Form (`just_form`) | Candidate Showcase `just_form`; Component Reference Input/Number/Color; Core Concepts. | Candidate retains auto-registration, singleton Color, label, clear and JSON editor. Its broad null claim and missing demo/test wiring are corrected in Step 17. |
| L123–459, Multiple-Level Nesting (`school_groups`) | Approved addition to Component Reference List; related Form, Mixin and Keyboard Navigation references. | Race is only a list of member forms, not the school → groups → students → grades hierarchy. The existing List `cross_list_drag` sample/test covers cross-list movement but not the whole nested value shape. The new approved sample must close that gap. |
| L460–519, Deeply nested forms | Component Reference Form and the approved deep List sample. | Form documents nested objects; the new sample provides the corresponding runnable nested form/list structure. |
| L520–630, More on lists (`schedule_list`) | Approved addition to Component Reference List. | Existing role prose and Kanban's `header`/`empty_list` example do not demonstrate `separator` plus `last_separator`; the new sample is required. |
| L631–911, Mixins / hotel schedule (`schedule_table`) | Candidate Showcase Kanban; Mixin Types guide (`mixin_snippet_params`, `mixin_inputlist`). | Reusable templates and `data-for` slots have runnable canonical/candidate examples. The hotel-specific schedule presentation is not retained as a separate showcase sample. |
| L912–1182, Nested lists and forms (`nested_schedule_table`) | Approved additions to Component Reference List and the Mixin Types guide; existing List cross-list test and Mixin nested-expansion tests. | The current references cover the component mechanisms separately; a tested canonical composition example is approved to preserve the deep hierarchy and nested mixin lesson. |
| L1183–1216, Item duplication, empty values and nesting mixins | List `addItem` `source`, `export_empties`, and template-role sections; Form/Input/type references; Mixin Types composition/styles. | The prose claims are current after the component/type-specific reset corrections in Steps 13–15. `source: ".-1"` remains in Race. Nested composition gets the approved runnable example above. |
| L1217–1410, Import/Export Data and intercepting events (`nested_forms_with_load_save`) | Data Import and Export guide; Events guide and its `events_submit_example`; Playground scaffold. | Current pages cover import/export triggers, `BeforeAction`/`AfterAction`, and submission. Do not port this old `window.alert`/`window.prompt` implementation; its event ideas are represented by current examples/snippets. |
| L1411–1507, Submitting the form (`submit_form`) | Component Reference Form (`submit` action) and Data Import and Export guide (native `mailto:` / JSON submission and backend export). | Both destinations provide source-checked behavior and runnable markup/examples; the old standalone sample is redundant. |
| L1508–1617, Trigger context (`context_comparsion`) | Component Reference Trigger, `trigger_context_target`; Form Traversing. | Step 07's sample distinguishes `context` and `target`, with relative paths safe for the editor. |
| L1618–1695, Auto-enabling/disabling (`simple_list_autodisable`) | Component Reference List bounds/actions; approved `schedule_list` example; candidate Race. | List documents automatic disabling at both bounds. The schedule sample will make min/max behavior visible and tested. |
| L1696–1785, Hotkeys and reveal (`simple_list_hotkeys`) | Accessibility Hotkeys (`hk-define`, `hk-reveal`); candidate Kanban/Race. | Ctrl-based definitions and reveal behavior have canonical examples; preserve the Ctrl-only rule and avoid AT claims. |
| L1786–1837, Hotkeys and context (`simple_list_hotkeys_with_context`) | Accessibility Hotkeys context-sensitivity sample; candidate Kanban. | The canonical page and Kanban's same-column actions show context sensitivity; the old phone-list instance is redundant. |
| L1838–2377, Collapsible sections (`collapsible_sections`) | Accessibility Keyboard Navigation (`nav-details`); candidate Race. | `details`/`summary` behavior is covered, but the legacy custom keyboard regression test is not currently wired in the canonical page. Step 17 must adapt it to `nav-details` before the old test capture is retired. |
| L2378–2386, Smooth navigation | Accessibility Keyboard Navigation. | Enter/Shift+Enter, textarea behavior, details, and focus rules are source-checked in Step 11. |
| L2387–2599, Second-level hotkeys (`2nd_level_hotkeys`) | Accessibility Hotkeys (`hk-2ndlevel`). | The feature is retained; adapt the legacy `2nd_level_hotkeys_tests` capture to the canonical example in Step 17. |
| L2600–2674, Hidden actions (`hidden_actions`) | Accessibility Hotkeys (`hk_hidden`) and Trigger. | Hidden convenience controls are documented with discoverability/accessibility cautions; the old duplicate HTML source is not needed. |
| L2675–2778, Animations (`animations`) | Animations guide (`anim-simple`, `anim-adv`); homepage Event Planner. | The guide holds the full entry/exit and lifecycle detail. Kanban itself does not animate, so remove that candidate claim. |
| L2779–2788, Smart value coercion | Value Coercion guide and List reference. | Scalar/list coercion and current import behavior have source-checked prose/examples. |
| L2789–2918, Field Masking (`field_masking`) | Field Masking guide and its tested IMask card example; candidate Product Configurator. | Core masking API/test coverage exists. Candidate currency mask is a separate untested integration and must be fixed/tested, not treated as covered by the card test. |
| L2919–2936, Dynamic Dropdown Options (`dynamic_dropdown`) | Reviewed not-retained; API Interface and Select (Planned). | The capture is undefined and the section explicitly says under construction; no runtime behavior or executable example is claimed. |
| L2937–3207, Simple Calculator (`calculator`) | Playground page (`playground-calculator`). | The basic calculator has already moved to the Playground. The legacy capture's `eval` implementation is not the recommended pattern. |
| L3208–3456, Calculator (UX improved) (`supercalculator`) | Approved addition to the Playground page. | Keep its keyboard-focused use case and custom test, but audit/restrict its global keydown handling and `eval` before publication. |
| L3457–3722, Team Event Planner (`event_planner_showcase`) | Homepage `docs/index.md`, `event_planner`. | The current home-page form keeps the same nested organizer, attendee list, date/time, hotkeys and animation lifecycle. It has the same JS capture and more extensive demo data; the legacy showcase copy is not needed. |
| L3723–end, Conclusion | Final Showcase closing callout. | Generic conclusion copy is not a separate feature or example; Step 17 can end with a concise link to canonical references. |

## Sampletabs, captures, and explicit tests

| Legacy `formId` / capture inventory | Disposition | Custom-test decision |
|---|---|---|
| `just_form` — `notes_just_form`, `just_form_example`, `just_form_demoValue`, `just_form_tests` | Reuse the candidate sample, preserving the source's number/color/label demonstration where useful; adapt `demoValue` and notes. | Adapt and wire `just_form_tests` to the final candidate (number export and Color `null`). |
| `school_groups` — `notes_school_groups`, `school_groups_example`, `school_groups_css`, `school_groups_demoValue`, `school_groups_tests` | Approved compact deep List example; preserve the school/groups/students/grades object/array shape and relevant notes. | Adapt and wire the cross-list/value assertions to the new canonical example. |
| `schedule_list` — `hotkeys_reveal_css`, `schedule_list`, `notes`, `demoValue`, `schedule_list_css` | Approved canonical List roles example; retain its useful interval data, empty state, separators and limits. | Add a focused test for role rendering and min/max trigger state. |
| `schedule_table` — `schedule_row_tpl`, `schedule_row_form`, `schedule_mixin_html`, `schedule_table_css`, `notes`, `demoValue` | Mechanism covered by the candidate Kanban and Mixin guide; do not retain the hotel-specific duplicate. | No explicit custom test in the legacy include. |
| `nested_schedule_table` — `period_item_tpl`, `nested_schedule_table`, `nested_schedule_notes`, `demoValue`, `nested_schedule_tests` | Approved canonical deep nesting/composition destination; individual captures may be adapted into the deep List/Mixin examples. | Adapt the test to assert the resulting nested value and composed behavior. |
| `nested_forms_with_load_save` — `nested_forms_with_load_save`, `form_export_example_import_export_js`, `notes_nested_forms_with_load_save`, `demoValue_nested_forms_with_load_save` | Data Import/Events destinations; do not port modal prompt/alert behavior. | `tests=false`; no custom test to move. |
| `submit_form` — `submit_form_example`, `submit_form_example_notes` | Form and Data Import submission examples. | `tests=false`; no custom test to move. |
| `context_comparsion` — `notes`, `context_comparsion_example` | Trigger reference `trigger_context_target`. | `tests=false`; Step 07's sample remains the maintained example. |
| `simple_list_autodisable` — `simple_list_autodisable`, `simple_list_autodisable_css`, `demoValue` | List bounds plus approved `schedule_list` example. | `tests=false`; the new role sample adds the focused boundary test. |
| `simple_list_hotkeys` — `simple_list_hotkeys`, `simple_list_hotkeys_html`, `simple_list_hotkeys_css`, `demoValue` | Accessibility Hotkeys and Kanban. | `tests=false`; canonical source/behavior reviewed in Step 11. |
| `simple_list_hotkeys_with_context` — `demoValue`, `simple_list_hotkeys_with_context`, `simple_list_hotkeys_with_context_html`, `simple_list_hotkeys_css` | Accessibility Hotkeys context sensitivity and Kanban. | `tests=false`. |
| `collapsible_sections` — `collapsible_sections`, `collapsible_sections_css`, `demoValue`, `collapsible_sections_tests` | Accessibility Keyboard Navigation `nav-details` and Race. | Adapt the test to `nav-details`; it currently has no custom test wired. |
| `2nd_level_hotkeys` — `2nd_level_hotkeys_html`, `2nd_level_hotkeys_tests` | Accessibility Hotkeys `hk-2ndlevel`. | Adapt and wire `2nd_level_hotkeys_tests` to the canonical example. |
| `hidden_actions` — reused `2nd_level_hotkeys_html`, `hidden_actions_css` | Accessibility Hotkeys `hk_hidden`. | `tests=false`; duplicate HTML source. |
| `animations` — reused `2nd_level_hotkeys_html`, `animations_css`, `animations_js`, `animations_notes` | Animations guide examples and homepage Event Planner. | `tests=false`; lifecycle behavior is source-documented. |
| `field_masking` — `showcase_mask_html`, `showcase_mask_js`, `showcase_mask_notes`, `demoValue`, `showcase_mask_css` | Field Masking guide's tested IMask card example; Product Configurator is a distinct candidate integration. | `tests=false`; keep the existing standalone `test/mask_imask.tests.js` aligned to the guide, not the currency mask. |
| `dynamic_dropdown` — no HTML capture; include points at undefined `dynamic_dropdown` | Reviewed not-retained; no executable material. | `tests=false`; none. |
| `calculator` — `calculator`, `calculatorStyles_css`, `calculator_css`, `calculator_js`, `notes` | Playground's existing `playground-calculator`. | `tests=false`; no custom test. |
| `supercalculator` — `supercalculator`, `supercalculator_js`, `supercalculator_css`, `notes`, `supercalculator_tests` | Approved move as a second Playground example. | Preserve/adapt and wire `supercalculator_tests`. |
| `event_planner_showcase` — `event_planner_html`, `event_planner_css`, `event_planner_js`, `notes`, `demoValue` | Homepage `event_planner`; current source has the same JS and equivalent form features with expanded seed data. | `tests=false`; homepage demoValue round-trip covers its current form value. |

Total legacy inventory: **20 sampletab IDs, 73 capture declarations, and six
custom test captures**. The candidate has **four sampletab IDs and 17 capture
declarations**, all retained for Step 17 correction. No staged source is edited.

## Canonical coverage matrix for Showcase-specific features

| Feature required by the migration plan | Verified destination(s) | Coverage status / Step 17 note |
|---|---|---|
| Masking and unmasked export | Field Masking guide, `mask_cc`/IMask test; Product Configurator candidate | Core card mask is source/test covered. Product money mask is not; correct the library/API mismatch and add a specific test. |
| Prefixed `data-smark-*` options | Core Concepts, “Shorthand syntax and prefixed options”; Developer Cheatsheet | Canonical explanation and markup example exist; candidate need not duplicate this syntax. |
| Wildcard action/context | Trigger reference, Form Traversing; Kanban/Race candidate | Canonical path semantics exist. Verify candidate wildcard calls after correcting `moving_depth` and `export_empties`. |
| Cross-list movement | List reference `cross_list_drag` with tests; candidate Kanban | Exact sibling-distance rule is documented and tested. Same-template exception and current snake_case option must be stated accurately. |
| Nested forms/lists | Form and List references; approved deep List sample; Race candidate | Current examples are distributed; approved deep sample closes the combined hierarchy gap. |
| Hotkeys/context/reveal | Accessibility Hotkeys; candidate Kanban/Race | Canonical coverage exists. Rewire legacy second-level test and adapt collapsible keyboard test. |
| Event behavior | Events guide and `events_submit_example`; Data Import guide | Trigger lifecycle, cancellation, and raw method distinction are documented. The old prompt/alert example is not copied. |
| Mixins, `data-for`, template roles | Mixin Types guide and tests; List reference; candidate Kanban | Basics are covered. Approved nested-composition sample closes the missing runnable composition destination. List `separator`/`last_separator` roles get the approved List example. |
| File/media behavior | File, Image, Video, and Audio component references (Steps 13–15) | Each has runnable examples at canonical routes; no Showcase-specific media sample is required. |

## Source verification and cleanup constraints

* Candidate option migration is confirmed by `CHANGELOG.md` and
  `src/lib/options.js`: `movingDepth` → `moving_depth`,
  `exportEmpties` → `export_empties`, and
  `smark_mixin_allowLocalScripts` → `smark_mixin_allow_local_scripts`; old
  spellings are not aliases.
* Nullable/empty output is type-specific in `input.type.js`, `number.type.js`,
  `color.type.js`, and the Date/Time/Radio types. Race's age field has only
  native `min`/`max`; its markup has no distance field or business validator.
* Cross-list movement is guarded in `list.decorators/sortable.deco.js` by both
  lists' `moving_depth`; same-template lists are specially treated as compatible.
  Mixin `<style>` blocks enter `<head>` globally; selector classes are not
  encapsulation (`docs/_guides/mixin_types.md#styles`).
* The Product Configurator loads Inputmask but calls `IMask`, and accesses
  `imask._selection`; the verified card integration instead pins IMask and is
  covered by `test/mask_imask.tests.js`. This test does not certify the money
  mask.
* The final candidate preview currently uses an initializer that overrides
  generated `demoValue` initialization; three demo captures are not passed to
  the include. Step 17 must make the preview data and collector-generated
  round-trip tests intentional.
* `docs/showcase_analysis.md`, `AGENTS/Showcase-Restructure-Plan.md`, and the
  Step 01 crosswalk are historical planning records. They are explicitly marked
  as superseded/current-status references in Step 16; this transfer map is the
  current authoritative source-to-destination decision record.
* No staged legacy page has been deleted or altered. The calculators, old
  Showcase, and old candidate remain under `docs/_old_*` until final cleanup.

## Verification status

* Reviewed the legacy/candidate sample inventories and every section/capture/test
  locator in `01-showcase-crosswalk.md`, `01-baseline-sampletab-ledger.md`, and
  `03-source-destination-ledger.md`; the maps retain their exact source IDs.
* Checked actual canonical destinations, not planned links, including Steps
  07–15's transfer maps and the component/guide sample inventories.
* Reviewed candidate claims against current source/spec/tests including
  `src/lib/options.js`, `src/types/{input,number,color}.type.js`,
  `src/types/list.decorators/sortable.deco.js`, `src/lib/mixin.js`,
  `src/types/trigger.type.js`, `test/mixin_types.tests.js`, and
  `test/mask_imask.tests.js`.
* Jekyll build passes at the Step 16 audit state. Rendered public-link/fragment
  checks report zero broken links/fragments; the candidate canonical page is
  built but remains intentionally sitemap-excluded/in-progress, and the old
  Showcase is built only at its `/old/` staging route. Re-run these checks after
  Step 17 edits.
* Node/npm and Playwright are unavailable; collector and browser tests were not
  run and remain for the user.
