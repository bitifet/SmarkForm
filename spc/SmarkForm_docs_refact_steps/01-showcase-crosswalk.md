# Step 01 — Showcase Source Crosswalk

**Status:** initial audit only. `showcase2.md` is a candidate, not the final Showcase; no legacy content is approved for deletion. Historical analysis and restructure records must be reconciled against current source and canonical pages.

## Sources compared

- Legacy: `docs/_about/showcase.md` (current route `/about/showcase`).
- Candidate: `docs/_about/showcase2.md` (current route `/about/showcase2`).
- Historical inputs: `docs/showcase_analysis.md`; `AGENTS/Showcase-Restructure-Plan.md`.
- Verify destinations in current component/guides pages and source/spec/tests.

## Candidate Showcase examples

| Candidate example | formId and captured wiring | Feature combination proposed in SPC | Audit questions before accepting coverage |
|---|---|---|---|
| Just a Form | `just_form` (L164); HTML `just_form_example`, CSS `—`, JS `—`, JS head `—`, tests `false`, demo `—` | Field inference, singleton wrapper, labels, color/null, trigger context, playground import/export. | SPC §4 claims require source/test verification, not feature-summary prose alone. |
| Project Kanban Board | `kanban` (L348); HTML `kanban_html`, CSS `kanban_css`, JS `—`, JS head `kanban_js`, tests `false`, demo `—` | Mixins/slots, lists, sortable handles, cross-list movement, wildcard contexts/targets, hotkeys, confirmation, layout. | SPC §4 claims require source/test verification, not feature-summary prose alone. |
| Race Registration System | `race` (L603); HTML `race_html`, CSS `race_css`, JS `—`, JS head `—`, tests `false`, demo `—` | Nested form/list data, duplication, positions, native collapsibles/keyboard, scalar coercion, radio/select/color, empty rules. | SPC §4 claims require source/test verification, not feature-summary prose alone. |
| Product Configurator | `configurator` (L814); HTML `configurator_html`, CSS `configurator_css`, JS `—`, JS head `configurator_js`, tests `false`, demo `demoValue` | Reusable mixins, masking/unmasked values, sortable lists, cleanup triggers, keyboard hints, numeric/mobile input. | SPC §4 claims require source/test verification, not feature-summary prose alone. |

## Legacy Showcase sections → provisional disposition

| Exact source locator | Legacy formId(s) associated with section | Candidate destination / decision to verify |
|---|---|---|
| L46 `Basics` | `just_form`, `school_groups`, `schedule_list`, `schedule_table`, `nested_schedule_table` | See Step 01 page ledger; exact destination must be confirmed before retirement. |
| L48 `Basics > Just a Form` | `just_form` | Candidate: Just a Form; verify behavior and keep full null semantics in canonical references. |
| L123 `Basics > Multiple-Level Nesting` | `school_groups` | Candidate: Race Registration may cover nested lists/forms; prove exact coverage or route unique details to Form/List references. |
| L460 `Basics > Deeply nested forms` | — (prose or part of enclosing demo) | Component Reference: Form; verify the nesting example and its value shape. |
| L520 `Basics > More on lists` | `schedule_list` | Component Reference: List and Using SmarkForm; candidate Showcase only if a complementary demo adds value. |
| L631 `Basics > Mixins` | `schedule_table` | Guides: Mixin Types; candidate Showcase claims only where represented. |
| L912 `Basics > Nested lists and forms` | `nested_schedule_table` | Component Reference: List/Form and Form Traversing; compare with Race Registration. |
| L1183 `Basics > Item duplication and closure state` | — (prose or part of enclosing demo) | Component Reference: List; compare with Race Registration and verify closure-state detail. |
| L1192 `Basics > A note on empty values` | — (prose or part of enclosing demo) | List reference / Data Import and Export / Value Coercion; preserve distinctions among empty string, null, and missing values. |
| L1200 `Basics > Nesting Mixins` | — (prose or part of enclosing demo) | Guides: Mixin Types; preserve composition/style de-duplication detail if unique. |
| L1217 `Import and Export Data` | `nested_forms_with_load_save`, `submit_form`, `context_comparsion` | Guides: Data Import and Export; verify submit/interception detail. |
| L1239 `Import and Export Data > Intercepting the *import* and *export* events` | `nested_forms_with_load_save` | Guides: Events and Data Import and Export; preserve lifecycle distinctions. |
| L1411 `Import and Export Data > Submitting the form` | `submit_form` | Form reference and Data Import and Export; verify native submission behavior. |
| L1508 `Import and Export Data > A note on context of the triggers` | `context_comparsion` | Step 07 action/context/target guide; preserve path bases and trigger-parent semantics. |
| L1618 `Advanced UX Improvements` | `simple_list_autodisable`, `simple_list_hotkeys`, `simple_list_hotkeys_with_context`, `collapsible_sections`, `2nd_level_hotkeys`, `hidden_actions`, `animations`, `field_masking`, `dynamic_dropdown` | See Step 01 page ledger; exact destination must be confirmed before retirement. |
| L1622 `Advanced UX Improvements > Auto enabling or disabling of actions` | `simple_list_autodisable` | List/Trigger references; preserve if current unique behavior remains undocumented. |
| L1696 `Advanced UX Improvements > Context-Driven Keyboard Shortcuts (Hot Keys)` | `simple_list_hotkeys` | Accessibility: Hotkeys; verify modifiers and context behavior. |
| L1759 `Advanced UX Improvements > Reveal of hot keys` | — (prose or part of enclosing demo) | Accessibility: Hotkeys; verify CSS/assistive-tech discoverability. |
| L1786 `Advanced UX Improvements > Hotkeys and context` | `simple_list_hotkeys_with_context` | Accessibility: Hotkeys and Step 07; audit Kanban coverage. |
| L1838 `Advanced UX Improvements > Collapsible sections` | `collapsible_sections` | Accessibility: Keyboard Navigation and Form/List references; verify native details behavior. |
| L2378 `Advanced UX Improvements > Smooth navigation` | — (prose or part of enclosing demo) | Accessibility: Keyboard Navigation; correct platform shortcut claims. |
| L2387 `Advanced UX Improvements > 2nd level hotkeys` | `2nd_level_hotkeys` | Accessibility: Hotkeys; verify candidate coverage. |
| L2600 `Advanced UX Improvements > Hidden actions` | `hidden_actions` | Accessibility: Hotkeys / Trigger; verify operability and discoverability. |
| L2675 `Advanced UX Improvements > Animations` | `animations` | Guides: Animations; candidate Kanban only if behavior is confirmed. |
| L2779 `Advanced UX Improvements > Smart value coercion` | — (prose or part of enclosing demo) | Guides: Value Coercion and List reference; preserve scalar-to-array distinction. |
| L2789 `Advanced UX Improvements > Field Masking` | `field_masking` | Guides: Field Masking; preserve clean/unmasked export behavior. |
| L2919 `Advanced UX Improvements > Dynamic Dropdown Options` | `dynamic_dropdown` | Select/List reference and Using SmarkForm; verify current implementation. |
| L2937 `Random Examples` | `calculator`, `supercalculator`, `event_planner_showcase` | See Step 01 page ledger; exact destination must be confirmed before retirement. |
| L2943 `Random Examples > Simple Calculator` | `calculator` | No direct candidate equivalent identified; assess downloadable examples/other route or approved not-retained decision. |
| L3208 `Random Examples > Calculator (UX improved)` | `supercalculator` | No direct candidate equivalent identified; assess downloadable examples/other route or approved not-retained decision. |
| L3457 `Random Examples > Team Event Planner` | `event_planner_showcase` | Compare with homepage Event Planner and Race Registration; preserve unique purpose without accidental duplicate. |
| L3723 `Conclusion` | — (prose or part of enclosing demo) | Retain a useful transition/link or record a reviewed not-retained decision. |

## Exact legacy sampletab inventory

| formId | source line / section | HTML | CSS | JS source | JS head | explicit tests | demoValue |
|---|---|---|---|---|---|---|---|
| `just_form` | L112 Basics > Just a Form | `just_form_example` | `—` | `—` | `—` | `just_form_tests` | `just_form_demoValue` |
| `school_groups` | L446 Basics > Multiple-Level Nesting | `school_groups_example` | `school_groups_css` | `—` | `—` | `school_groups_tests` | `school_groups_demoValue` |
| `schedule_list` | L607 Basics > More on lists | `schedule_list` | `schedule_list_css` | `—` | `—` | `false` | `demoValue` |
| `schedule_table` | L895 Basics > Mixins | `schedule_mixin_html` | `schedule_table_css` | `—` | `—` | `false` | `demoValue` |
| `nested_schedule_table` | L1151 Basics > Nested lists and forms | `nested_schedule_table` | `schedule_table_css` | `—` | `—` | `nested_schedule_tests` | `demoValue` |
| `nested_forms_with_load_save` | L1378 Import and Export Data > Intercepting the *import* and *export* events | `nested_forms_with_load_save` | `—` | `form_export_example_import_export_js` | `—` | `false` | `demoValue_nested_forms_with_load_save` |
| `submit_form` | L1500 Import and Export Data > Submitting the form | `submit_form_example` | `—` | `—` | `—` | `false` | `—` |
| `context_comparsion` | L1600 Import and Export Data > A note on context of the triggers | `context_comparsion_example` | `—` | `—` | `—` | `false` | `—` |
| `simple_list_autodisable` | L1679 Advanced UX Improvements > Auto enabling or disabling of actions | `simple_list_autodisable` | `simple_list_autodisable_css` | `—` | `—` | `false` | `demoValue` |
| `simple_list_hotkeys` | L1748 Advanced UX Improvements > Context-Driven Keyboard Shortcuts (Hot Keys) | `simple_list_hotkeys_html` | `simple_list_hotkeys_css` | `—` | `—` | `false` | `demoValue` |
| `simple_list_hotkeys_with_context` | L1826 Advanced UX Improvements > Hotkeys and context | `simple_list_hotkeys_with_context_html` | `simple_list_hotkeys_css` | `—` | `—` | `false` | `demoValue` |
| `collapsible_sections` | L2355 Advanced UX Improvements > Collapsible sections | `collapsible_sections` | `collapsible_sections_css` | `—` | `—` | `collapsible_sections_tests` | `demoValue` |
| `2nd_level_hotkeys` | L2590 Advanced UX Improvements > 2nd level hotkeys | `2nd_level_hotkeys_html` | `simple_list_hotkeys_css` | `—` | `—` | `2nd_level_hotkeys_tests` | `—` |
| `hidden_actions` | L2655 Advanced UX Improvements > Hidden actions | `2nd_level_hotkeys_html` | `hidden_actions_css` | `—` | `—` | `false` | `—` |
| `animations` | L2766 Advanced UX Improvements > Animations | `2nd_level_hotkeys_html` | `animations_css` | `animations_js` | `—` | `false` | `—` |
| `field_masking` | L2902 Advanced UX Improvements > Field Masking | `showcase_mask_html` | `showcase_mask_css` | `—` | `showcase_mask_js` | `false` | `demoValue` |
| `dynamic_dropdown` | L2927 Advanced UX Improvements > Dynamic Dropdown Options | `dynamic_dropdown` | `—` | `—` | `—` | `false` | `—` |
| `calculator` | L3178 Random Examples > Simple Calculator | `calculator` | `calculator_css` | `calculator_js` | `—` | `false` | `—` |
| `supercalculator` | L3409 Random Examples > Calculator (UX improved) | `supercalculator` | `supercalculator_css` | `supercalculator_js` | `—` | `supercalculator_tests` | `—` |
| `event_planner_showcase` | L3710 Random Examples > Team Event Planner | `event_planner_html` | `event_planner_css` | `event_planner_js` | `—` | `false` | `demoValue` |

## Coverage cautions

- Candidate has four examples, legacy has twenty. Matching broad feature labels does not establish equivalent instructional coverage.
- `school_groups` is a three-level nesting demo and is only a candidate source for Race Registration; compare field structure, movement, demo values, notes, and tests.
- Legacy hotel schedule/list/mixin examples are not automatically covered by Kanban. The older restructure plan marks some transfers uncommitted; inspect the actual current page.
- The three old calculator/event examples have no obvious one-to-one candidate; choose keep, redistribute, or not-retain with a precise destination/rationale.
- SPC §4 claims to verify: Race Registration “auto-validates age vs distance”; “empty inputs become null”; mixin CSS “scoping”; actual `moving_depth` relationship; Product Configurator mask/export output and use of Inputmask internals.
- The candidate currently uses pre-0.25 option spellings (`movingDepth`, `exportEmpties`, `smark_mixin_allowLocalScripts`) in markup, prose, and `smarkformOptions`. Replace only after checking each use against current source/tests; `CHANGELOG.md` contains the migration map. The SPC and older Showcase planning notes also use historical spellings—do not copy them as current API syntax.
- Every removed source capture/test needs an exact destination capture/test or an approved disposition. The transfer ledger is authoritative; inline comments are supporting markers only.
