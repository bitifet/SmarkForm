# Step 05 — Proposed Using SmarkForm Outline and Source Map

**Status:** planning artifact for Step 08. This does not transfer the long
tutorial. The full original remains unchanged at
`docs/_old_getting_started/old_quick_start.md` (about 1,035 lines).

Step 08's completed destination/disposition map is recorded in
[`08-using-smarkform-transfer-map.md`](08-using-smarkform-transfer-map.md).

## Proposed guide sequence

| Guide section (Step 08) | Legacy source locators | Transfer decision / canonical references |
|---|---|---|
| 1. Start from a real form and mark its fields | `L33–226`: Basic setup, plain HTML, initialization, and “Do the magic”; captures `html_source_legacy`, `html_source_enhanced` | The compact Quick Start now owns the first-success sample. In the longer guide, retain a plain-vs-marked comparison only if it clarifies that SmarkForm manages marked nodes; Core Concepts already explains component discovery. Avoid repeating the setup boilerplate. |
| 2. Add actions and triggers | `L227–295`; capture `html_source_enhanced_with_clears` | Introduce one useful clear/export action and natural context. Use Core Concepts → Triggers, the Trigger reference, and Form Traversing for exact context/path semantics. |
| 3. Export useful data | `L296–366`; captures `form_export_example_js`, `form_export_example_notes` | Use `AfterAction_export` as a practical hand-off. Keep event lifecycle and submission details in Data Import and Export / Events; verify spelling and event data flow during Step 08. |
| 4. Import data | `L367–422`; captures `html_source_enhanced_withImport`, `form_export_example_withImport_js` | Curate the prompt/parse example only if it adds value beyond the import/export guide. Link to the canonical guide for import details and error handling. |
| 5. Find and update a component | `L423–531`; captures `traversing_form_example`, `traversing_form_example_callback_js`, `traversing_form_example_async_js` | Keep one clear example after render; the callback-vs-promise distinction and path syntax belong in Form Traversing. Retain the warning to wait for `myForm.rendered` before calling `find()`. |
| 6. Understand context, target, and lists | `L532–693`; captures `simple_list_example`, `simple_list_js`, `simple_list_example_notes`, `html_source_simplified`, `demoValue` | Teach the mental model with a small list example, not the entire old target-copy tutorial. Preserve the distinction between `context` and `target`; link to Core Concepts, Trigger, Form Traversing, and List reference. |
| 7. Add a guarded action | `L699–802`; captures `simple_confirm_cancel_example_js`, `simple_confirm_cancel_example_hidden_js`, `confirm_cancel_example_with_confirm_js` | Optionally keep one `BeforeAction_clear` example and explain `isEmpty()` only as needed. Full event-hook patterns belong in Events. |
| 8. Continue with lists and interactions | `L803–948`; headings `Hot Keys`, `Animated and sortable lists`, `Customize your form`; captures `html_phone_list`, `advanced_sample_css`, `phone_list_form_example_notes`, `html_schedule_list` | The old Hot Keys and Animated/sortable headings are empty. Do not invent missing sections. Link to List reference, Hotkeys, and Animations; decide whether either larger example advances the guide or belongs only in references/showcase. Automatic sorting is not implemented. |
| 9. Configure and continue | `L949–1035`; headings Boilerplate, form tag, local copy, alternative distributions, options object | Route setup and boilerplate details to Getting SmarkForm / CDN / Download. Correct the root/native-submit discussion using the FAQ and Form reference. Link constructor callbacks to Events; do not present options as field `data-smark` options. |

## Complete legacy sampletab and capture inventory

The Step 01 ledgers contain the exact source lines and include arguments. The
following records the full transfer boundary before the canonical page was
shortened:

| Legacy `formId` | Captures used | Test / demo data status | Step 08 destination |
|---|---|---|---|
| `simple_legacy` | `html_source_legacy` | `tests=false`; no demo value | Section 1 only if the unmarked contrast proves useful; otherwise leave in legacy source. |
| `simple_initialized` | `html_source_legacy` | `tests=false`; no demo value | Initialization is now visible in the compact sample's generated JS tab; no separate transfer planned. |
| `enhanced_simple_form` | `html_source_enhanced` | `tests=false`; no demo value | Section 1/2 only if it adds more than the compact Quick Start. |
| `enhanced_simple_form_with_clears` | `html_source_enhanced_with_clears` | `tests=false`; no demo value | Section 2. |
| `enhanced_withExport` | `html_source_enhanced`, `form_export_example_js`, `form_export_example_notes` | `tests=false`; no demo value | Section 3; review for event-guide duplication. |
| `enhanced_withImport` | `html_source_enhanced_withImport`, `form_export_example_js`, `form_export_example_withImport_js` | `tests=false`; no demo value | Section 4; review for data-guide duplication. |
| `traversing_example_callback` | `traversing_form_example`, `traversing_form_example_callback_js` | `tests=false`; no demo value | Section 5; compare with async version before choosing. |
| `traversing_example_async` | `traversing_form_example`, `traversing_form_example_async_js` | `tests=false`; no demo value | Section 5; choose one primary version and preserve the other only if it teaches a distinct timing point. |
| `simple_list` | `simple_list_example`, `simple_list_js`, `simple_list_example_notes` | `tests=false`; no demo value | Section 6; simplify or replace stale markup during Step 08. |
| `simplified` | `html_source_simplified`, `demoValue` | `tests=false`; realistic demo value; editor enabled | Source for a possible section 6 data/exchange illustration; do not duplicate the Quick Start demo verbatim. |
| `enhanced_confirmCancel` | `html_source_enhanced_withImport`, `simple_confirm_cancel_example_js`, `simple_confirm_cancel_example_hidden_js` | `tests=false`; no demo value | Section 7; preserve hidden export/import handlers if the example is transferred. |
| `enhanced_confirmCancel_non_empty` | `html_source_enhanced_withImport`, `simple_confirm_cancel_example_hidden_js`, `confirm_cancel_example_with_confirm_js` | `tests=false`; no demo value | Section 7; optional `isEmpty()` variant. |
| `telephone_list` | `html_phone_list`, `advanced_sample_css`, `phone_list_form_example_notes` | `tests=false`; no demo value | Section 8 only if it advances the tutorial; otherwise List/Hotkeys references. |
| `schedule_list` | `html_schedule_list` | `tests=false`; no demo value | Section 8 only if it advances the tutorial; otherwise reference/showcase. |

All 22 legacy capture declarations are accounted for above:
`html_source_legacy`, `html_source_enhanced`,
`html_source_enhanced_with_clears`, `form_export_example_js`,
`form_export_example_notes`, `html_source_enhanced_withImport`,
`form_export_example_withImport_js`, `traversing_form_example`,
`traversing_form_example_callback_js`, `traversing_form_example_async_js`,
`simple_list_example`, `simple_list_js`, `simple_list_example_notes`,
`html_source_simplified`, `demoValue`, `simple_confirm_cancel_example_js`,
`simple_confirm_cancel_example_hidden_js`,
`confirm_cancel_example_with_confirm_js`, `html_phone_list`,
`advanced_sample_css`, `phone_list_form_example_notes`, and
`html_schedule_list`. The old page and all these captures remain in the staged
legacy source; none was deleted by Step 05.

## New compact Quick Start example

`docs/_start_here/quick_start.md` now has one new sampletab:

| `formId` | Captures | Testability |
|---|---|---|
| `quick_start_first_success` | `quick_start_html`, `quick_start_js`, `quick_start_notes`, `quick_start_demoValue` | `tests=false`; `demoValue` is supplied so the collector can generate the standard round-trip smoke test. The playground's Export control shows the resulting object; the JS capture is an explanatory no-custom-JS comment. |

All sampletabs in the old long tutorial declared `tests=false`; the only old
`demoValue` belonged to `simplified`. The ignored example manifest was stale at
baseline, so regenerate it with `scripts/collect-docs-examples.js` when Node is
available. Do not treat the cached manifest as proof that the new example was
collected or tested.
