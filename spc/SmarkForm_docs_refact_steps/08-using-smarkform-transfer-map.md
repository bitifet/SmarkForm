# Step 08 — Using SmarkForm Transfer Map

**Status:** The canonical practical guide is authored at
`docs/_guides/using_smarkform.md`. The original long Quick Start remains
unchanged at `docs/_old_getting_started/old_quick_start.md` until final staging
cleanup.

## Section destinations

| Legacy source locator | Final disposition |
|---|---|
| L33–138: setup, blank document, CDN include, unmarked form, initialization | Step 05 kept the short CDN/load/initialize first-success path; installation choices are in Getting SmarkForm/CDN/Download; Core Concepts explains marking. The long setup sequence is not duplicated. |
| L162–226: “Do the magic” | Rebuilt as the guide's workshop form, which has a nested organizer and attendee list. The old simple marked form remains staged rather than duplicated. |
| L227–295: Actions and Triggers | Clear organizer, add attendee, and remove attendee actions are demonstrated in the workshop sample; exact addressing semantics link to Core Concepts, Trigger, and Form Traversing. |
| L296–366: Exporting data | Adapted `AfterAction_export` as `using_workshop_js`; the old alert was replaced by a console log. The playground Export control shows the data, while backend submission details link to Events. |
| L367–422: Importing data | Replaced the prompt/modal sample with a short `myForm.import(data)` application function. Detailed import, default, and payload behavior links to Data Import and Export. |
| L423–531: Form traversing | Kept the useful `await myForm.rendered` timing rule and a relative `find("workshop/organizer/email")` example. The callback variant and full path grammar remain in Form Traversing. |
| L532–693: Context and Target | The guide distinguishes context and target and explains copy direction; exact path bases, natural targets, and wildcard rules link to Trigger and Form Traversing. Old target-copy examples are not copied wholesale. |
| L694–802: Go further / event handling | `AfterAction_export` appears in the sample. Both confirm-before-clear variants are consolidated into one static `BeforeAction_clear` / `isEmpty()` example; event lifecycle details link to Events. |
| L803–810: Hot Keys; Animated and sortable lists | Both legacy headings are empty. No prose/sample was dropped; next-topic links lead to Hotkeys, Animations, and List reference. |
| L811–948: Customize your form, phone list, schedule list | The workshop attendee list is the guide's practical list example. Telephone styling/hotkeys and the specialized schedule demo are outside this learning path; details remain in references/Showcase. |
| L949–1035: final notes, boilerplate, form-tag claim, installation variants, options object | Distribution and boilerplate link to Getting SmarkForm/Download; native submission and validation link to the FAQ; constructor callbacks link to Events/Constructor. The obsolete claim that SmarkForm should prevent native submission is not repeated. |

## Complete legacy sampletab inventory

All 14 original sampletab IDs are accounted for. Each legacy include used
`tests=false`; none had a custom test. The single old `demoValue` belonged to
`simplified`. The staged source and its capture wiring are unchanged.

| Legacy `formId` | Final disposition |
|---|---|
| `simple_legacy` | Not transferred: its unmarked HTML is redundant with Quick Start/Core Concepts; source remains staged. |
| `simple_initialized` | Not transferred: initialization is already visible in the Quick Start JavaScript tab; source remains staged. |
| `enhanced_simple_form` | Replaced by the fuller nested workshop sample. |
| `enhanced_simple_form_with_clears` | Clear-action idea adapted as the workshop's `Clear organizer` trigger. |
| `enhanced_withExport` | `AfterAction_export` behavior adapted in `using_workshop_js`; the alert-based sample is not copied. |
| `enhanced_withImport` | Prompt-based sample omitted; the programmatic load function and Data Import and Export reference cover the task. |
| `traversing_example_callback` | Callback sample omitted as redundant; the guide uses an awaited-render lookup and links to Form Traversing. |
| `traversing_example_async` | `await rendered` / lookup behavior adapted in `readOrganizerEmail(myForm)`. |
| `simple_list` | Add/remove behavior adapted to the attendee list. |
| `simplified` | Not transferred: flat fields/editor are covered by Quick Start/Core Concepts; the old demoValue stays staged. |
| `enhanced_confirmCancel` | Merged into the static `BeforeAction_clear` guard example. |
| `enhanced_confirmCancel_non_empty` | Its `isEmpty()` check is folded into that same guard example. |
| `telephone_list` | Not transferred: phone-specific styling and hotkeys belong in List/Hotkeys references. |
| `schedule_list` | Not transferred: specialized schedule layout stays staged for the Showcase/reference audit. |

## Capture inventory and disposition

All 22 legacy captures are accounted for. They remain in the staged legacy file;
the destinations below describe the canonical treatment, not a deletion from the
source.

| Legacy capture | Final disposition |
|---|---|
| `html_source_legacy` | Not transferred; the unmarked/initialized contrast is redundant with Quick Start/Core Concepts. |
| `html_source_enhanced` | Replaced by the workshop sample markup. |
| `html_source_enhanced_with_clears` | Clear-action behavior is adapted to `using_workshop_html`. |
| `form_export_example_js` | Adapted to `using_workshop_js`; alert replaced with console output. |
| `form_export_example_notes` | Useful export explanation is consolidated into the new sample notes. |
| `html_source_enhanced_withImport` | Prompt sample omitted; programmatic import is shown instead. |
| `form_export_example_withImport_js` | Not copied; modal prompt/parser details are not required for the guide path and import details link to the Data guide. |
| `traversing_form_example` | Replaced by the workshop tree and relative organizer lookup. |
| `traversing_form_example_callback_js` | Callback alternative omitted; full timing/traversal coverage remains in Form Traversing. |
| `traversing_form_example_async_js` | `await myForm.rendered` is adapted in the guide's lookup snippet. |
| `simple_list_example` | Replaced by the attendee list. |
| `simple_list_js` | Not needed; list actions remain declarative. |
| `simple_list_example_notes` | Add/remove concepts are adapted in the action explanation. |
| `html_source_simplified` | Not transferred; the flat data example duplicates Quick Start/Core Concepts. |
| `demoValue` | Old flat demo value not reused; the guide defines a realistic workshop value of its own. |
| `simple_confirm_cancel_example_js` | Merged into the static clear-guard code snippet. |
| `simple_confirm_cancel_example_hidden_js` | Not copied; it only combined legacy export/import handlers, which have separate treatments. |
| `confirm_cancel_example_with_confirm_js` | Its `isEmpty()` check is merged into the clear-guard snippet. |
| `html_phone_list` | Not transferred; List reference owns list markup details. |
| `advanced_sample_css` | Not transferred; hotkey/disabled-button styling is presentation-specific. |
| `phone_list_form_example_notes` | Not transferred; list limits, hotkeys, and export details link to their references. |
| `html_schedule_list` | Not transferred; specialized schedule markup remains staged for Showcase/reference disposition. |

## New guide sample and verification

The guide has one sampletab, `using_smarkform_workshop`, with
`using_workshop_html`, `using_workshop_js`, `using_workshop_notes`, and
`using_workshop_demoValue`. It sets `showEditor=true` and `tests=false`; its
demoValue enables the collector-generated round-trip smoke test. All captured
trigger contexts are relative for editor wrapping.

Jekyll built successfully and the rendered-site route/fragment check found no
broken non-legacy links. Node/npm and Playwright are unavailable here, so the
collector and generated sample/round-trip tests must be run when those tools are
available. The old Quick Start source was not modified.
