# Step 01 — Internal Route and Fragment Inventory

**Scope:** explicit links found in the 57 reader-facing Markdown sources. This is a source inventory, not final link validation: Liquid/reference-style links, dynamically generated links, exact kramdown anchors, external URLs, and paths produced by includes require a rendered-site check. Link text inside captured examples is included because it can render in the docs.

## Summary

- Current public page sources: 57; explicit references to a current page/technical permalink: 316 unique source-line/target pairs (112 include a fragment).
- Local fragment-only references inventoried: 91 unique source-line/fragment pairs. Their final IDs must be checked against the rendered kramdown-GFM output after edits.
- Unresolved explicit route candidates: 3 (listed below); no links were changed during this baseline session.
- Asset/download and output-format links are recorded separately as non-page routes only where relevant; they require build/output validation, not collection-route matching.

## Unresolved route candidates

| Source locator | Current target | Initial diagnosis / follow-up |
|---|---|---|
| `_about/faq.md:1177` | `/about/changelog` | No current page/permalink found; decide whether to link GitHub release notes, add a page, or remove the route. |
| `_component_types/type_form.md:249` | `/advanced_concepts/data_import_and_export#setting-defaults-via-value` | Likely stale collection path; current page permalink is `/working_with_forms/data_import_and_export`. Verify and update in the owning page session. |
| `_component_types/type_list.md:341` | `/advanced_concepts/data_import_and_export#setting-defaults-via-value` | Likely stale collection path; current page permalink is `/working_with_forms/data_import_and_export`. Verify and update in the owning page session. |

## Explicit page-to-page route references

| Source locator | Target permalink | Target source | Fragment |
|---|---|---|---|
| `_about/faq.md:48` | `/about/introduction` | `_about/introduction.md` | `—` |
| `_about/faq.md:49` | `/about/showcase` | `_about/showcase.md` | `—` |
| `_about/faq.md:104` | `/getting_started/getting_smarkform` | `_getting_started/getting_smarkform.md` | `—` |
| `_about/faq.md:131` | `/getting_started/core_concepts` | `_getting_started/core_concepts.md` | `the-data-smark-attribute` |
| `_about/faq.md:180` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_about/faq.md:205` | `/getting_started/quick_start` | `_getting_started/quick_start.md` | `actions-and-triggers` |
| `_about/faq.md:234` | `/getting_started/quick_start` | `_getting_started/quick_start.md` | `actions-and-triggers` |
| `_about/faq.md:235` | `/working_with_forms/form_traversing` | `_working_with_forms/form_traversing.md` | `—` |
| `_about/faq.md:285` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `the-singleton-pattern` |
| `_about/faq.md:487` | `/about/showcase` | `_about/showcase.md` | `animations` |
| `_about/faq.md:541` | `/about/faq` | `_about/faq.md` | `—` |
| `_about/faq.md:545` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_about/faq.md:556` | `/about/showcase` | `_about/showcase.md` | `a-note-on-empty-values` |
| `_about/faq.md:647` | `/component_types/type_form` | `_component_types/type_form.md` | `async-submit-action` |
| `_about/faq.md:669` | `/advanced_concepts/events` | `_advanced_concepts/events.md` | `submitting-form-data-to-a-backend` |
| `_about/faq.md:697` | `/component_types/type_form` | `_component_types/type_form.md` | `async-submit-action` |
| `_about/faq.md:869` | `/advanced_concepts/events` | `_advanced_concepts/events.md` | `—` |
| `_about/faq.md:892` | `/advanced_concepts/the_smarkform_constructor` | `_advanced_concepts/the_smarkform_constructor.md` | `—` |
| `_about/faq.md:943` | `/working_with_forms/hotkeys` | `_working_with_forms/hotkeys.md` | `—` |
| `_about/faq.md:954` | `/resources/user_guide` | `_resources/user_guide.md` | `second-level-hotkeys-reaching-outer-contexts` |
| `_about/faq.md:957` | `/community/branding` | `_community/branding.md` | `—` |
| `_about/faq.md:985` | `/working_with_forms/form_traversing` | `_working_with_forms/form_traversing.md` | `—` |
| `_about/faq.md:1090` | `/working_with_forms/field_masking` | `_working_with_forms/field_masking.md` | `focus-and-mask-factories` |
| `_about/faq.md:1109` | `/advanced_concepts/the_singleton_pattern` | `_advanced_concepts/the_singleton_pattern.md` | `restrictions-and-errors` |
| `_about/faq.md:1162` | `/about/roadmap` | `_about/roadmap.md` | `the-api-interface` |
| `_about/faq.md:1262` | `/advanced_concepts/mixin_types` | `_advanced_concepts/mixin_types.md` | `—` |
| `_about/faq.md:1341` | `/advanced_concepts/mixin_types` | `_advanced_concepts/mixin_types.md` | `mixin-security-options` |
| `_about/features.md:46` | `/getting_started/quick_start` | `_getting_started/quick_start.md` | `—` |
| `_about/features.md:71` | `/about/showcase` | `_about/showcase.md` | `nested-forms` |
| `_about/features.md:90` | `/about/showcase` | `_about/showcase.md` | `nested-forms` |
| `_about/features.md:108` | `/about/showcase` | `_about/showcase.md` | `lists` |
| `_about/features.md:123` | `/about/showcase` | `_about/showcase.md` | `context-driven-keyboard-shortcuts-hot-keys` |
| `_about/features.md:131` | `/about/showcase` | `_about/showcase.md` | `context-driven-keyboard-shortcuts-hot-keys` |
| `_about/features.md:150` | `/about/showcase` | `_about/showcase.md` | `smooth-navigation` |
| `_about/features.md:179` | `/about/showcase` | `_about/showcase.md` | `a-note-on-context-of-the-triggers` |
| `_about/features.md:192` | `/getting_started/getting_smarkform` | `_getting_started/getting_smarkform.md` | `—` |
| `_about/features.md:202` | `/advanced_concepts/mixin_types` | `_advanced_concepts/mixin_types.md` | `—` |
| `_about/features.md:221` | `/working_with_forms/form_traversing` | `_working_with_forms/form_traversing.md` | `—` |
| `_about/features.md:240` | `/about/showcase` | `_about/showcase.md` | `basics` |
| `_about/features.md:261` | `/resources/ai-agents` | `_resources/ai-agents.md` | `—` |
| `_about/introduction.md:48` | `/about/roadmap` | `_about/roadmap.md` | `—` |
| `_about/introduction.md:88` | `/about/showcase` | `_about/showcase.md` | `—` |
| `_about/showcase.md:24` | `/resources/examples` | `_resources/examples.md` | `—` |
| `_about/showcase.md:28` | `/getting_started/quick_start` | `_getting_started/quick_start.md` | `—` |
| `_about/showcase.md:126` | `/component_types/type_form` | `_component_types/type_form.md` | `—` |
| `_about/showcase.md:128` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_about/showcase.md:130` | `/working_with_forms/keyboard_navigation` | `_working_with_forms/keyboard_navigation.md` | `—` |
| `_about/showcase.md:131` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_about/showcase.md:134` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_about/showcase.md:136` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_about/showcase.md:469` | `/component_types/type_form` | `_component_types/type_form.md` | `—` |
| `_about/showcase.md:909` | `/advanced_concepts/mixin_types` | `_advanced_concepts/mixin_types.md` | `—` |
| `_about/showcase.md:1189` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_about/showcase.md:1196` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_about/showcase.md:1208` | `/advanced_concepts/mixin_types` | `_advanced_concepts/mixin_types.md` | `—` |
| `_about/showcase.md:1220` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `—` |
| `_about/showcase.md:1408` | `/getting_started/quick_start` | `_getting_started/quick_start.md` | `—` |
| `_about/showcase.md:1793` | `/working_with_forms/hotkeys` | `_working_with_forms/hotkeys.md` | `—` |
| `_about/showcase.md:2384` | `/working_with_forms/keyboard_navigation` | `_working_with_forms/keyboard_navigation.md` | `—` |
| `_about/showcase.md:2776` | `/advanced_concepts/animations` | `_advanced_concepts/animations.md` | `—` |
| `_about/showcase.md:2786` | `/working_with_forms/value_coercion` | `_working_with_forms/value_coercion.md` | `—` |
| `_about/showcase.md:2885` | `/working_with_forms/field_masking` | `_working_with_forms/field_masking.md` | `—` |
| `_about/showcase.md:2915` | `/working_with_forms/field_masking` | `_working_with_forms/field_masking.md` | `—` |
| `_about/showcase.md:3459` | `/` | `index.md` | `—` |
| `_about/showcase2.md:155` | `/getting_started/quick_start` | `_getting_started/quick_start.md` | `—` |
| `_about/showcase2.md:184` | `/getting_started/core_concepts` | `_getting_started/core_concepts.md` | `—` |
| `_about/showcase2.md:196` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `the-singleton-pattern` |
| `_about/showcase2.md:207` | `/component_types/type_label` | `_component_types/type_label.md` | `—` |
| `_about/showcase2.md:218` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `—` |
| `_about/showcase2.md:230` | `/component_types/type_trigger` | `_component_types/type_trigger.md` | `—` |
| `_about/showcase2.md:231` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `—` |
| `_about/showcase2.md:241` | `/resources/playground` | `_resources/playground.md` | `—` |
| `_about/showcase2.md:340` | `/working_with_forms/hotkeys` | `_working_with_forms/hotkeys.md` | `—` |
| `_about/showcase2.md:341` | `/working_with_forms/keyboard_navigation` | `_working_with_forms/keyboard_navigation.md` | `—` |
| `_about/showcase2.md:373` | `/advanced_concepts/mixin_types` | `_advanced_concepts/mixin_types.md` | `—` |
| `_about/showcase2.md:384` | `/component_types/type_list` | `_component_types/type_list.md` | `sortable` |
| `_about/showcase2.md:396` | `/working_with_forms/form_traversing` | `_working_with_forms/form_traversing.md` | `wildcard-context-multi-dispatch` |
| `_about/showcase2.md:408` | `/advanced_concepts/events` | `_advanced_concepts/events.md` | `beforeaction-events` |
| `_about/showcase2.md:419` | `/working_with_forms/hotkeys` | `_working_with_forms/hotkeys.md` | `—` |
| `_about/showcase2.md:430` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_about/showcase2.md:440` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_about/showcase2.md:450` | `/component_types/type_label` | `_component_types/type_label.md` | `—` |
| `_about/showcase2.md:461` | `/advanced_concepts/mixin_types` | `_advanced_concepts/mixin_types.md` | `—` |
| `_about/showcase2.md:472` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_about/showcase2.md:594` | `/component_types/type_form` | `_component_types/type_form.md` | `—` |
| `_about/showcase2.md:595` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_about/showcase2.md:596` | `/working_with_forms/value_coercion` | `_working_with_forms/value_coercion.md` | `—` |
| `_about/showcase2.md:624` | `/component_types/type_form` | `_component_types/type_form.md` | `—` |
| `_about/showcase2.md:625` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_about/showcase2.md:636` | `/component_types/type_list` | `_component_types/type_list.md` | `async-additem-action` |
| `_about/showcase2.md:637` | `/working_with_forms/form_traversing` | `_working_with_forms/form_traversing.md` | `path-syntax-overview` |
| `_about/showcase2.md:648` | `/working_with_forms/keyboard_navigation` | `_working_with_forms/keyboard_navigation.md` | `—` |
| `_about/showcase2.md:659` | `/working_with_forms/value_coercion` | `_working_with_forms/value_coercion.md` | `—` |
| `_about/showcase2.md:669` | `/component_types/type_list` | `_component_types/type_list.md` | `position-action` |
| `_about/showcase2.md:680` | `/component_types/type_list` | `_component_types/type_list.md` | `async-removeitem-action` |
| `_about/showcase2.md:690` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_about/showcase2.md:700` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_about/showcase2.md:806` | `/advanced_concepts/mixin_types` | `_advanced_concepts/mixin_types.md` | `—` |
| `_about/showcase2.md:807` | `/working_with_forms/field_masking` | `_working_with_forms/field_masking.md` | `—` |
| `_about/showcase2.md:838` | `/advanced_concepts/mixin_types` | `_advanced_concepts/mixin_types.md` | `—` |
| `_about/showcase2.md:849` | `/working_with_forms/field_masking` | `_working_with_forms/field_masking.md` | `—` |
| `_about/showcase2.md:860` | `/working_with_forms/field_masking` | `_working_with_forms/field_masking.md` | `masks-and-external-libraries` |
| `_about/showcase2.md:871` | `/component_types/type_list` | `_component_types/type_list.md` | `sortable` |
| `_about/showcase2.md:881` | `/component_types/type_input` | `_component_types/type_input.md` | `—` |
| `_about/showcase2.md:892` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_advanced_concepts/error_codes.md:297` | `/advanced_concepts/mixin_types` | `_advanced_concepts/mixin_types.md` | `—` |
| `_advanced_concepts/error_codes.md:318` | `/advanced_concepts/security_considerations` | `_advanced_concepts/security_considerations.md` | `mixin-external-template-loading--allowexternalmixins` |
| `_advanced_concepts/error_codes.md:392` | `/advanced_concepts/security_considerations` | `_advanced_concepts/security_considerations.md` | `mixin-script-execution--allowlocalmixinscripts-allowsameoriginmixinscripts-allowcrossoriginmixinscripts` |
| `_advanced_concepts/events.md:34` | `/component_types/type_trigger` | `_component_types/type_trigger.md` | `—` |
| `_advanced_concepts/events.md:188` | `/about/showcase` | `_about/showcase.md` | `simple-calculator` |
| `_advanced_concepts/events.md:331` | `/about/showcase` | `_about/showcase.md` | `item-duplication-and-closure-state` |
| `_advanced_concepts/mixin_types.md:1074` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_advanced_concepts/security_considerations.md:226` | `/component_types/type_form` | `_component_types/type_form.md` | `submit` |
| `_advanced_concepts/security_considerations.md:241` | `/advanced_concepts/error_codes` | `_advanced_concepts/error_codes.md` | `—` |
| `_advanced_concepts/the_singleton_pattern.md:29` | `/component_types/type_input` | `_component_types/type_input.md` | `—` |
| `_advanced_concepts/the_singleton_pattern.md:30` | `/component_types/type_number` | `_component_types/type_number.md` | `—` |
| `_advanced_concepts/the_singleton_pattern.md:31` | `/component_types/type_input` | `_component_types/type_input.md` | `—` |
| `_advanced_concepts/the_singleton_pattern.md:32` | `/component_types/type_color` | `_component_types/type_color.md` | `—` |
| `_advanced_concepts/the_singleton_pattern.md:33` | `/component_types/type_file` | `_component_types/type_file.md` | `—` |
| `_advanced_concepts/the_singleton_pattern.md:146` | `/component_types/type_file` | `_component_types/type_file.md` | `—` |
| `_advanced_concepts/the_singleton_pattern.md:152` | `/component_types/type_file` | `_component_types/type_file.md` | `—` |
| `_advanced_concepts/the_singleton_pattern.md:160` | `/component_types/type_file` | `_component_types/type_file.md` | `—` |
| `_advanced_concepts/the_singleton_pattern.md:165` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_advanced_concepts/the_smarkform_constructor.md:53` | `/component_types/type_form` | `_component_types/type_form.md` | `value` |
| `_advanced_concepts/the_smarkform_constructor.md:53` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `setting-defaults-via-value` |
| `_advanced_concepts/the_smarkform_constructor.md:54` | `/component_types/type_list` | `_component_types/type_list.md` | `exportempties` |
| `_advanced_concepts/the_smarkform_constructor.md:54` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `the-exportempties-option` |
| `_advanced_concepts/the_smarkform_constructor.md:55` | `/advanced_concepts/events` | `_advanced_concepts/events.md` | `via-options-declarative` |
| `_advanced_concepts/the_smarkform_constructor.md:56` | `/component_types/type_form` | `_component_types/type_form.md` | `focus_on_click` |
| `_advanced_concepts/the_smarkform_constructor.md:57` | `/component_types/type_form` | `_component_types/type_form.md` | `autoid` |
| `_advanced_concepts/the_smarkform_constructor.md:58` | `/component_types/type_form` | `_component_types/type_form.md` | `encoding-and-transport` |
| `_advanced_concepts/the_smarkform_constructor.md:59` | `/component_types/type_form` | `_component_types/type_form.md` | `data-flattening-options` |
| `_advanced_concepts/the_smarkform_constructor.md:101` | `/working_with_forms/field_masking` | `_working_with_forms/field_masking.md` | `error-handling` |
| `_advanced_concepts/the_smarkform_constructor.md:112` | `/advanced_concepts/mixin_types` | `_advanced_concepts/mixin_types.md` | `mixin-security-options` |
| `_advanced_concepts/the_smarkform_constructor.md:131` | `/working_with_forms/field_masking` | `_working_with_forms/field_masking.md` | `—` |
| `_advanced_concepts/the_smarkform_constructor.md:199` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `—` |
| `_advanced_concepts/the_smarkform_constructor.md:199` | `/working_with_forms/form_traversing` | `_working_with_forms/form_traversing.md` | `—` |
| `_community/branding.md:24` | `/resources/user_guide` | `_resources/user_guide.md` | `—` |
| `_community/branding.md:341` | `/resources/examples` | `_resources/examples.md` | `—` |
| `_community/build-in-public.md:59` | `/presentations/SmarkForm_es.impress.html` | `presentations/SmarkForm_es.impress.md` | `—` |
| `_community/build-in-public.md:68` | `/presentations/SmarkForm_es.impress.20241212.html` | `presentations/SmarkForm_es.impress.20241212.md` | `—` |
| `_community/contact.md:33` | `/community/contributing` | `_community/contributing.md` | `—` |
| `_community/support.md:25` | `/about/faq` | `_about/faq.md` | `—` |
| `_component_types/type_audio.md:23` | `/component_types/type_file` | `_component_types/type_file.md` | `—` |
| `_component_types/type_color.md:25` | `/component_types/type_input` | `_component_types/type_input.md` | `—` |
| `_component_types/type_color.md:42` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_component_types/type_color.md:91` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_component_types/type_color.md:98` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_component_types/type_date.md:25` | `/component_types/type_input` | `_component_types/type_input.md` | `—` |
| `_component_types/type_date.md:30` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_component_types/type_datetime-local.md:25` | `/component_types/type_input` | `_component_types/type_input.md` | `—` |
| `_component_types/type_datetime-local.md:30` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_component_types/type_file.md:32` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_component_types/type_file.md:371` | `/component_types/type_image` | `_component_types/type_image.md` | `—` |
| `_component_types/type_file.md:714` | `/component_types/type_image` | `_component_types/type_image.md` | `—` |
| `_component_types/type_image.md:27` | `/component_types/type_file` | `_component_types/type_file.md` | `—` |
| `_component_types/type_image.md:187` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_component_types/type_image.md:640` | `/component_types/type_file` | `_component_types/type_file.md` | `importing-and-exporting-data` |
| `_component_types/type_image.md:703` | `/component_types/type_file` | `_component_types/type_file.md` | `—` |
| `_component_types/type_image.md:705` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_component_types/type_image.md:706` | `/component_types/type_file` | `_component_types/type_file.md` | `files-in-lists-of-file` |
| `_component_types/type_input.md:28` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_component_types/type_input.md:81` | `/working_with_forms/value_coercion` | `_working_with_forms/value_coercion.md` | `json-format` |
| `_component_types/type_label.md:32` | `/working_with_forms/form_traversing` | `_working_with_forms/form_traversing.md` | `—` |
| `_component_types/type_label.md:163` | `/working_with_forms/form_traversing` | `_working_with_forms/form_traversing.md` | `—` |
| `_component_types/type_list.md:55` | `/component_types/type_form` | `_component_types/type_form.md` | `—` |
| `_component_types/type_list.md:140` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_component_types/type_list.md:200` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_component_types/type_list.md:319` | `/advanced_concepts/mixin_types` | `_advanced_concepts/mixin_types.md` | `labelled-list-of-inputs--inputlist` |
| `_component_types/type_number.md:25` | `/component_types/type_input` | `_component_types/type_input.md` | `—` |
| `_component_types/type_number.md:28` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_component_types/type_radio.md:25` | `/component_types/type_input` | `_component_types/type_input.md` | `—` |
| `_component_types/type_select.md:33` | `/working_with_forms/the_api_interface` | `_working_with_forms/the_api_interface.md` | `—` |
| `_component_types/type_time.md:25` | `/component_types/type_input` | `_component_types/type_input.md` | `—` |
| `_component_types/type_time.md:30` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_component_types/type_trigger.md:73` | `/working_with_forms/hotkeys` | `_working_with_forms/hotkeys.md` | `—` |
| `_component_types/type_video.md:23` | `/component_types/type_file` | `_component_types/type_file.md` | `—` |
| `_getting_started/core_component_types.md:30` | `/component_types/type_form` | `_component_types/type_form.md` | `—` |
| `_getting_started/core_component_types.md:31` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_getting_started/core_component_types.md:57` | `/component_types/type_input` | `_component_types/type_input.md` | `—` |
| `_getting_started/core_component_types.md:149` | `/component_types/type_label` | `_component_types/type_label.md` | `—` |
| `_getting_started/core_component_types.md:150` | `/component_types/type_trigger` | `_component_types/type_trigger.md` | `—` |
| `_getting_started/core_component_types.md:152` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_getting_started/core_component_types.md:170` | `/component_types/type_list` | `_component_types/type_list.md` | `applying-the-singleton-pattern` |
| `_getting_started/core_component_types.md:253` | `/component_types/type_number` | `_component_types/type_number.md` | `—` |
| `_getting_started/core_component_types.md:254` | `/component_types/type_date` | `_component_types/type_date.md` | `—` |
| `_getting_started/core_component_types.md:255` | `/component_types/type_input` | `_component_types/type_input.md` | `—` |
| `_getting_started/core_component_types.md:307` | `/component_types/type_color` | `_component_types/type_color.md` | `—` |
| `_getting_started/core_component_types.md:308` | `/component_types/type_input` | `_component_types/type_input.md` | `—` |
| `_getting_started/core_component_types.md:418` | `/component_types/type_select` | `_component_types/type_select.md` | `—` |
| `_getting_started/core_component_types.md:437` | `/component_types/type_trigger` | `_component_types/type_trigger.md` | `—` |
| `_getting_started/core_component_types.md:450` | `/component_types/type_label` | `_component_types/type_label.md` | `—` |
| `_getting_started/core_concepts.md:449` | `/component_types/type_label` | `_component_types/type_label.md` | `—` |
| `_getting_started/core_concepts.md:728` | `/resources/examples` | `_resources/examples.md` | `—` |
| `_getting_started/core_concepts.md:912` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_getting_started/core_concepts.md:958` | `/component_types/type_trigger` | `_component_types/type_trigger.md` | `—` |
| `_getting_started/core_concepts.md:969` | `/component_types/type_trigger` | `_component_types/type_trigger.md` | `—` |
| `_getting_started/getting_smarkform.md:97` | `/resources/CDN` | `_resources/CDN.md` | `—` |
| `_getting_started/getting_smarkform.md:102` | `/resources/download` | `_resources/download.md` | `—` |
| `_getting_started/quick_start.md:19` | `/resources/examples` | `_resources/examples.md` | `—` |
| `_getting_started/quick_start.md:166` | `/getting_started/core_concepts` | `_getting_started/core_concepts.md` | `the-data-smark-attribute` |
| `_getting_started/quick_start.md:215` | `/getting_started/core_concepts` | `_getting_started/core_concepts.md` | `—` |
| `_getting_started/quick_start.md:217` | `/getting_started/core_concepts` | `_getting_started/core_concepts.md` | `—` |
| `_getting_started/quick_start.md:220` | `/getting_started/core_concepts` | `_getting_started/core_concepts.md` | `—` |
| `_getting_started/quick_start.md:282` | `/getting_started/core_concepts` | `_getting_started/core_concepts.md` | `—` |
| `_getting_started/quick_start.md:625` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `_getting_started/quick_start.md:823` | `/getting_started/core_concepts` | `_getting_started/core_concepts.md` | `—` |
| `_getting_started/quick_start.md:940` | `/about/showcase` | `_about/showcase.md` | `—` |
| `_getting_started/quick_start.md:943` | `/resources/examples` | `_resources/examples.md` | `—` |
| `_getting_started/quick_start.md:962` | `/resources/examples` | `_resources/examples.md` | `—` |
| `_getting_started/quick_start.md:967` | `/resources/download` | `_resources/download.md` | `boilerplate-template` |
| `_getting_started/quick_start.md:1005` | `/getting_started/getting_smarkform` | `_getting_started/getting_smarkform.md` | `—` |
| `_resources/AGENTS/SmarkForm-Forms.md:18` | `/resources/AGENTS/SmarkForm-Usage` | `_resources/AGENTS/SmarkForm-Usage.md` | `—` |
| `_resources/AGENTS/SmarkForm-Forms.md:66` | `/resources/CDN` | `_resources/CDN.md` | `—` |
| `_resources/AGENTS/SmarkForm-Forms.md:89` | `/resources/download` | `_resources/download.md` | `—` |
| `_resources/AGENTS/SmarkForm-Forms.md:223` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `the-singleton-pattern` |
| `_resources/AGENTS/SmarkForm-Forms.md:537` | `/resources/AGENTS/SmarkForm-Usage` | `_resources/AGENTS/SmarkForm-Usage.md` | `—` |
| `_resources/CDN.md:36` | `/getting_started/getting_smarkform` | `_getting_started/getting_smarkform.md` | `—` |
| `_resources/CDN.md:52` | `/resources/download` | `_resources/download.md` | `—` |
| `_resources/CDN.md:54` | `/resources/examples` | `_resources/examples.md` | `—` |
| `_resources/ai-agents.md:24` | `/resources/AGENTS/SmarkForm-Forms` | `_resources/AGENTS/SmarkForm-Forms.md` | `—` |
| `_resources/ai-agents.md:25` | `/resources/AGENTS/SmarkForm-Usage` | `_resources/AGENTS/SmarkForm-Usage.md` | `—` |
| `_resources/ai-agents.md:136` | `/resources/AGENTS/SmarkForm-Forms` | `_resources/AGENTS/SmarkForm-Forms.md` | `—` |
| `_resources/cheatsheet.md:31` | `/advanced_concepts/the_smarkform_constructor` | `_advanced_concepts/the_smarkform_constructor.md` | `the-rendered-promise` |
| `_resources/cheatsheet.md:32` | `/advanced_concepts/the_smarkform_constructor` | `_advanced_concepts/the_smarkform_constructor.md` | `how-constructor-options-work` |
| `_resources/cheatsheet.md:36` | `/component_types/type_form` | `_component_types/type_form.md` | `value` |
| `_resources/cheatsheet.md:37` | `/component_types/type_form` | `_component_types/type_form.md` | `autoid` |
| `_resources/cheatsheet.md:38` | `/advanced_concepts/mixin_types` | `_advanced_concepts/mixin_types.md` | `mixin-security-options` |
| `_resources/cheatsheet.md:39` | `/advanced_concepts/mixin_types` | `_advanced_concepts/mixin_types.md` | `mixin-security-options` |
| `_resources/cheatsheet.md:40` | `/advanced_concepts/mixin_types` | `_advanced_concepts/mixin_types.md` | `mixin-security-options` |
| `_resources/cheatsheet.md:41` | `/advanced_concepts/mixin_types` | `_advanced_concepts/mixin_types.md` | `mixin-security-options` |
| `_resources/cheatsheet.md:42` | `/component_types/type_form` | `_component_types/type_form.md` | `encoding-and-transport` |
| `_resources/cheatsheet.md:43` | `/component_types/type_list` | `_component_types/type_list.md` | `exportempties` |
| `_resources/cheatsheet.md:44` | `/component_types/type_form` | `_component_types/type_form.md` | `data-flattening-options` |
| `_resources/cheatsheet.md:45` | `/component_types/type_form` | `_component_types/type_form.md` | `data-flattening-options` |
| `_resources/cheatsheet.md:46` | `/component_types/type_form` | `_component_types/type_form.md` | `focus_on_click` |
| `_resources/cheatsheet.md:47` | `/advanced_concepts/the_smarkform_constructor` | `_advanced_concepts/the_smarkform_constructor.md` | `on-event-handlers` |
| `_resources/cheatsheet.md:49` | `/advanced_concepts/the_smarkform_constructor` | `_advanced_concepts/the_smarkform_constructor.md` | `—` |
| `_resources/cheatsheet.md:64` | `/getting_started/core_concepts` | `_getting_started/core_concepts.md` | `shorthand-syntaxes` |
| `_resources/cheatsheet.md:64` | `/getting_started/core_concepts` | `_getting_started/core_concepts.md` | `the-data-smark-attribute` |
| `_resources/cheatsheet.md:95` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `—` |
| `_resources/cheatsheet.md:95` | `/getting_started/core_component_types` | `_getting_started/core_component_types.md` | `the-singleton-pattern` |
| `_resources/cheatsheet.md:113` | `/component_types/type_list` | `_component_types/type_list.md` | `introduction` |
| `_resources/cheatsheet.md:121` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `the-export-action` |
| `_resources/cheatsheet.md:122` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `the-import-action` |
| `_resources/cheatsheet.md:123` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `default-values-clear-and-reset` |
| `_resources/cheatsheet.md:124` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `default-values-clear-and-reset` |
| `_resources/cheatsheet.md:125` | `/component_types/type_list` | `_component_types/type_list.md` | `async-additem-action` |
| `_resources/cheatsheet.md:126` | `/component_types/type_list` | `_component_types/type_list.md` | `async-removeitem-action` |
| `_resources/cheatsheet.md:127` | `/component_types/type_form` | `_component_types/type_form.md` | `async-submit-action` |
| `_resources/cheatsheet.md:128` | `/component_types/type_list` | `_component_types/type_list.md` | `count-action` |
| `_resources/cheatsheet.md:129` | `/component_types/type_list` | `_component_types/type_list.md` | `position-action` |
| `_resources/cheatsheet.md:130` | `/component_types/type_list` | `_component_types/type_list.md` | `sortable` |
| `_resources/cheatsheet.md:131` | `/advanced_concepts/the_smarkform_constructor` | `_advanced_concepts/the_smarkform_constructor.md` | `—` |
| `_resources/cheatsheet.md:148` | `/working_with_forms/form_traversing` | `_working_with_forms/form_traversing.md` | `context-and-target-in-actions` |
| `_resources/cheatsheet.md:148` | `/working_with_forms/form_traversing` | `_working_with_forms/form_traversing.md` | `path-syntax-overview` |
| `_resources/cheatsheet.md:186` | `/advanced_concepts/events` | `_advanced_concepts/events.md` | `action-lifecycle-events` |
| `_resources/cheatsheet.md:186` | `/advanced_concepts/events` | `_advanced_concepts/events.md` | `overview` |
| `_resources/cheatsheet.md:186` | `/advanced_concepts/events` | `_advanced_concepts/events.md` | `via-options-declarative` |
| `_resources/cheatsheet.md:218` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `overview` |
| `_resources/cheatsheet.md:245` | `/working_with_forms/value_coercion` | `_working_with_forms/value_coercion.md` | `json-format` |
| `_resources/cheatsheet.md:279` | `/component_types/type_file` | `_component_types/type_file.md` | `introduction` |
| `_resources/cheatsheet.md:311` | `/component_types/type_image` | `_component_types/type_image.md` | `introduction` |
| `_resources/cheatsheet.md:319` | `/advanced_concepts/events` | `_advanced_concepts/events.md` | `—` |
| `_resources/cheatsheet.md:319` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `overview` |
| `_resources/cheatsheet.md:319` | `/working_with_forms/form_traversing` | `_working_with_forms/form_traversing.md` | `—` |
| `_resources/cheatsheet.md:325` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `—` |
| `_resources/cheatsheet.md:326` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `—` |
| `_resources/cheatsheet.md:327` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `default-values-clear-and-reset` |
| `_resources/cheatsheet.md:328` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `default-values-clear-and-reset` |
| `_resources/cheatsheet.md:335` | `/working_with_forms/form_traversing` | `_working_with_forms/form_traversing.md` | `—` |
| `_resources/cheatsheet.md:341` | `/advanced_concepts/events` | `_advanced_concepts/events.md` | `local-vs-all-handlers` |
| `_resources/cheatsheet.md:342` | `/advanced_concepts/events` | `_advanced_concepts/events.md` | `local-vs-all-handlers` |
| `_resources/cheatsheet.md:363` | `/working_with_forms/hotkeys` | `_working_with_forms/hotkeys.md` | `—` |
| `_resources/cheatsheet.md:369` | `/component_types/type_form` | `_component_types/type_form.md` | `async-submit-action` |
| `_resources/cheatsheet.md:369` | `/component_types/type_form` | `_component_types/type_form.md` | `encoding-and-transport` |
| `_resources/download.md:48` | `/resources/examples` | `_resources/examples.md` | `—` |
| `_resources/download.md:57` | `/resources/examples` | `_resources/examples.md` | `—` |
| `_resources/download.md:72` | `/resources/CDN` | `_resources/CDN.md` | `—` |
| `_resources/playground.md:170` | `/advanced_concepts/events` | `_advanced_concepts/events.md` | `—` |
| `_resources/user_guide.md:362` | `/community/support` | `_community/support.md` | `—` |
| `_resources/user_guide.md:387` | `/resources/examples` | `_resources/examples.md` | `—` |
| `_resources/user_guide.md:390` | `/about/showcase` | `_about/showcase.md` | `—` |
| `_resources/user_guide.md:390` | `/community/branding` | `_community/branding.md` | `—` |
| `_resources/user_guide.md:396` | `/community/support` | `_community/support.md` | `—` |
| `_working_with_forms/data_import_and_export.md:525` | `/working_with_forms/form_traversing` | `_working_with_forms/form_traversing.md` | `—` |
| `_working_with_forms/data_import_and_export.md:576` | `/advanced_concepts/events` | `_advanced_concepts/events.md` | `—` |
| `_working_with_forms/data_import_and_export.md:630` | `/advanced_concepts/events` | `_advanced_concepts/events.md` | `—` |
| `_working_with_forms/field_masking.md:611` | `/about/faq` | `_about/faq.md` | `my-masked-field-gets-focused-unexpectedly-after-form-construction` |
| `_working_with_forms/form_traversing.md:35` | `/getting_started/quick_start` | `_getting_started/quick_start.md` | `—` |
| `_working_with_forms/form_traversing.md:585` | `/working_with_forms/hotkeys` | `_working_with_forms/hotkeys.md` | `—` |
| `_working_with_forms/hotkeys.md:361` | `/about/showcase` | `_about/showcase.md` | `—` |
| `_working_with_forms/value_coercion.md:285` | `/working_with_forms/data_import_and_export` | `_working_with_forms/data_import_and_export.md` | `—` |
| `_working_with_forms/value_coercion.md:286` | `/component_types/type_form` | `_component_types/type_form.md` | `—` |
| `_working_with_forms/value_coercion.md:287` | `/component_types/type_list` | `_component_types/type_list.md` | `—` |
| `index.md:298` | `/about/introduction` | `_about/introduction.md` | `—` |
| `index.md:300` | `/about/showcase` | `_about/showcase.md` | `—` |
| `index.md:304` | `/resources/examples` | `_resources/examples.md` | `—` |
| `index.md:311` | `/about/features` | `_about/features.md` | `markup-agnostic` |
| `index.md:313` | `/about/features` | `_about/features.md` | `easy-to-use-low-code` |
| `index.md:315` | `/about/features` | `_about/features.md` | `nestable-forms` |
| `index.md:317` | `/about/features` | `_about/features.md` | `variable-length-lists` |
| `index.md:319` | `/about/features` | `_about/features.md` | `context-driven-hotkeys` |
| `index.md:321` | `/about/features` | `_about/features.md` | `consistent-user-experience` |
| `index.md:323` | `/about/features` | `_about/features.md` | `json-based` |
| `index.md:325` | `/about/features` | `_about/features.md` | `lightweight-yet-highly-compatible` |
| `index.md:327` | `/about/features` | `_about/features.md` | `a11y-friendly` |
| `index.md:331` | `/about/features` | `_about/features.md` | `ai-agent-ready` |
| `index.md:333` | `/about/features` | `_about/features.md` | `—` |
| `index.md:340` | `/about/roadmap` | `_about/roadmap.md` | `current-status` |
| `index.md:350` | `/about/showcase` | `_about/showcase.md` | `—` |
| `index.md:351` | `/getting_started/quick_start` | `_getting_started/quick_start.md` | `—` |
| `index.md:352` | `/resources/examples` | `_resources/examples.md` | `—` |
| `index.md:353` | `/about/faq` | `_about/faq.md` | `—` |
| `index.md:422` | `/community/contributing` | `_community/contributing.md` | `—` |
| `index.md:427` | `/community/license` | `_community/license.md` | `—` |

## Local fragment references

| Source locator | Fragment as authored |
|---|---|
| `_about/faq.md:71` | `#can-i-use-a-classic-html-form-submission-instead-of-json-export` |
| `_about/faq.md:72` | `#how-do-i-submit-form-data-to-a-backend` |
| `_about/faq.md:177` | `#can-i-implement-my-own-component-types` |
| `_about/faq.md:202` | `#how-do-i-add-custom-actions` |
| `_about/faq.md:223` | `#what-is-the-singleton-pattern` |
| `_about/introduction.md:146` | `#what-the-numbers-say` |
| `_about/introduction.md:804` | `#react` |
| `_about/introduction.md:804` | `#vue` |
| `_about/introduction.md:828` | `#footnote_1` |
| `_about/introduction.md:839` | `#footnote_2` |
| `_about/introduction.md:839` | `#gotchas` |
| `_about/introduction.md:840` | `#gotchas` |
| `_about/introduction.md:880` | `#foothook_1` |
| `_about/introduction.md:886` | `#foothook_2` |
| `_about/roadmap.md:56` | `#the-api-interface` |
| `_about/roadmap.md:87` | `#the-api-interface` |
| `_about/showcase.md:513` | `#import-and-export-data` |
| `_about/showcase.md:533` | `#context-driven-keyboard-shortcuts-hot-keys` |
| `_about/showcase.md:627` | `#mixins` |
| `_about/showcase.md:1632` | `#singleton_list_example` |
| `_about/showcase.md:2627` | `#reveal-of-hot-keys` |
| `_about/showcase2.md:22` | `#just-a-form` |
| `_about/showcase2.md:23` | `#features-demonstrated` |
| `_about/showcase2.md:24` | `#project-kanban-board` |
| `_about/showcase2.md:25` | `#features-demonstrated-1` |
| `_about/showcase2.md:26` | `#race-registration-system` |
| `_about/showcase2.md:27` | `#features-demonstrated-2` |
| `_about/showcase2.md:28` | `#product-configurator` |
| `_about/showcase2.md:29` | `#features-demonstrated-3` |
| `_advanced_concepts/mixin_types.md:63` | `#examples` |
| `_advanced_concepts/mixin_types.md:86` | `#list-placement-warning` |
| `_advanced_concepts/mixin_types.md:162` | `#error-codes` |
| `_advanced_concepts/mixin_types.md:391` | `#scripts` |
| `_advanced_concepts/the_singleton_pattern.md:61` | `#restrictions-and-errors` |
| `_advanced_concepts/the_singleton_pattern.md:76` | `#avoiding-absolute-context-paths` |
| `_advanced_concepts/the_singleton_pattern.md:87` | `#scalar-lists` |
| `_advanced_concepts/the_singleton_pattern.md:104` | `#color-reset-example-singleton` |
| `_advanced_concepts/the_singleton_pattern.md:141` | `#phone-list-example-singleton` |
| `_advanced_concepts/the_smarkform_constructor.md:186` | `#the-rendered-promise` |
| `_component_types/type_file.md:66` | `#raw-format-data-url` |
| `_component_types/type_file.md:286` | `#urls-as-input-values-sugar` |
| `_component_types/type_file.md:333` | `#the-singleton-pattern` |
| `_component_types/type_form.md:270` | `#api-reference` |
| `_component_types/type_image.md:49` | `#importing-and-exporting-data` |
| `_component_types/type_image.md:150` | `#importing-and-exporting-data` |
| `_component_types/type_list.md:56` | `#example-simple_list` |
| `_component_types/type_list.md:66` | `#example-simple_list` |
| `_component_types/type_list.md:76` | `#example-simple_list` |
| `_component_types/type_list.md:137` | `#example-scalar_list` |
| `_component_types/type_list.md:146` | `#example-scalar_list` |
| `_component_types/type_list.md:185` | `#example-scalar_list` |
| `_component_types/type_list.md:192` | `#applying-the-singleton-pattern` |
| `_component_types/type_list.md:326` | `#api-reference` |
| `_component_types/type_list.md:374` | `#movingdepth-cross-list-drag-scope` |
| `_getting_started/core_component_types.md:264` | `#the-singleton-pattern` |
| `_getting_started/core_component_types.md:306` | `#type-number-and-type-date` |
| `_getting_started/core_component_types.md:316` | `#the-singleton-pattern` |
| `_getting_started/core_component_types.md:319` | `#type-number-and-type-date` |
| `_getting_started/core_concepts.md:85` | `#labels` |
| `_getting_started/core_concepts.md:86` | `#triggers` |
| `_getting_started/core_concepts.md:97` | `#actions` |
| `_getting_started/core_concepts.md:437` | `#labels` |
| `_getting_started/core_concepts.md:437` | `#triggers` |
| `_getting_started/core_concepts.md:550` | `#constraining-lists` |
| `_getting_started/quick_start.md:51` | `#boilerplate-file` |
| `_getting_started/quick_start.md:52` | `#3-include-smarkform-library` |
| `_getting_started/quick_start.md:53` | `#4-initialize-the-form` |
| `_getting_started/quick_start.md:54` | `#2-create-an-html-form` |
| `_getting_started/quick_start.md:54` | `#5-do-the-magic` |
| `_getting_started/quick_start.md:68` | `#using-your-own-copy-of-smarkform-library` |
| `_getting_started/quick_start.md:72` | `#alternative-forms-to-getinclude-smarkform` |
| `_getting_started/quick_start.md:135` | `#you-dont-need-a-form-tag` |
| `_getting_started/quick_start.md:158` | `#the-options-object` |
| `_getting_started/quick_start.md:207` | `#actions-and-triggers` |
| `_getting_started/quick_start.md:303` | `#event-handling` |
| `_getting_started/quick_start.md:309` | `#context-and-target` |
| `_getting_started/quick_start.md:334` | `#the-options-object` |
| `_getting_started/quick_start.md:534` | `#actions-and-triggers` |
| `_resources/playground.md:25` | `#architecture` |
| `_resources/playground.md:26` | `#exploring-the-editor` |
| `_resources/playground.md:27` | `#random-examples` |
| `_resources/playground.md:28` | `#simple-calculator` |
| `_resources/user_guide.md:341` | `#discovering-and-using-hotkeys` |
| `_resources/user_guide.md:354` | `#common-hotkey-patterns` |
| `_working_with_forms/data_import_and_export.md:42` | `#default-values-clear-and-reset` |
| `_working_with_forms/field_masking.md:116` | `#focus-and-mask-factories` |
| `_working_with_forms/field_masking.md:190` | `#mixin-scoped-masks` |
| `_working_with_forms/field_masking.md:624` | `#using-other-masking-libraries-maska` |
| `_working_with_forms/field_masking.md:625` | `#custom-mask-example-no-library` |
| `_working_with_forms/hotkeys.md:38` | `#hotkey-reveal-ctrl-discovery` |
| `_working_with_forms/hotkeys.md:228` | `#hotkey-reveal-ctrl-discovery` |

## Non-page output and asset paths

| Source locator | Authored route | Follow-up |
|---|---|---|
| `_about/showcase2.md:898` | `/assets/js/showcase-features.js` | asset/download |
| `_component_types/type_video.md:64` | `/assets/video-demo-attribution.md` | asset/download |
| `_resources/user_guide.md:45` | `/assets/images/user-guide/01-navigation-enter-key.png` | asset/download |
| `_resources/user_guide.md:83` | `/assets/images/user-guide/02-hotkeys-discovery.png` | asset/download |
| `_resources/user_guide.md:102` | `/assets/images/user-guide/03-hotkeys-context-aware.png` | asset/download |
| `_resources/user_guide.md:123` | `/assets/images/user-guide/04-hotkeys-second-level.png` | asset/download |
| `_resources/user_guide.md:154` | `/assets/images/user-guide/05-lists-add-remove.png` | asset/download |
| `_resources/user_guide.md:187` | `/assets/images/user-guide/06-lists-reorder.png` | asset/download |
| `_resources/user_guide.md:205` | `/assets/images/user-guide/07-lists-disabled-button.png` | asset/download |
| `_resources/user_guide.md:226` | `/assets/images/user-guide/09-file-field.png` | asset/download |
| `_resources/user_guide.md:240` | `/assets/images/user-guide/10-image-field.png` | asset/download |
| `_resources/user_guide.md:266` | `/assets/images/user-guide/11-video-field.png` | asset/download |
| `_resources/user_guide.md:290` | `/assets/images/user-guide/12-audio-field.png` | asset/download |
| `_resources/user_guide.md:324` | `/assets/images/user-guide/08-collapsible-sections.png` | asset/download |
| `index.md:240` | `/assets/hero/poster.png` | asset/download |
| `index.md:242` | `/assets/hero/SmarkForm_hero_web.mp4` | asset/download |
| `index.md:244` | `/assets/hero/SmarkForm_hero_web.mp4` | asset/download |
| `index.md:292` | `/assets/readme/field_model.svg` | asset/download |
| `index.md:404` | `/assets/Telegram_Channel.png` | asset/download |
| `index.md:410` | `/assets/Telegram_Community.png` | asset/download |

## Limitations and next check

- The parser recognizes explicit `relative_url`, Markdown route links, `href`, and fragment-only links; it does not resolve Markdown reference definitions, shortcodes, link variables supplied by `docs/_includes/links.md`, links assembled by Liquid, paths in generated Pug HTML, or external link status.
- Several links occur within sampletab captures and count as rendered documentation links; preserve and test those examples as well as prose links.
- Do not change `/about/changelog` or old collection routes in this inventory step. The approved route/compatibility decision belongs to Step 02; corrections belong to the owning content step.
- Final acceptance requires rebuilding the whole site and verifying all final routes/fragments against `_site`, including redirects and sitemap, as specified in Step 19.
