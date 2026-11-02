# Step 01 — Sampletab, Capture, Demo, and Test Ledger

**Inventory method:** parsed current Markdown source directly (no Node collector run). This records identifiers and include wiring, not captured source bodies; those remain in the source files and must be mapped/reviewed before transfer. The Liquid scan is a locator aid; confirm unusual includes manually.

## Summary

- Reader-facing source pages inventoried: 57.
- Current `sampletabs_tpl.md` include calls parsed: 131.
- Capture declarations parsed: 376.
- Include test settings: 26 attach named custom test captures; 105 explicitly
  use `tests=false`; none omit a parseable setting in this source scan.
- Preserve HTML/CSS/JS/JS-head/notes/demo/tests/smarkformOptions associations as a unit; a capture ID alone is not proof that its purpose is retained.
- An explicit `tests=false` means no custom test argument on the include; generated round-trip smoke coverage and standalone tests need separate checks.

## Collector and test mapping

- `scripts/collect-docs-examples.js` collects source examples into
  `test/.cache/docs_examples.json`; `test/co_located_tests.tests.js` generates
  one general Playwright example test per manifest row and a `demoValue`
  round-trip test where configured. The source ID is the file path plus
  `formId`, not only the form ID.
- Custom test capture names are recorded per include below. Standalone classic
  component tests live in `test/*.tests.js` and are not enumerated by a docs
  sampletab capture. The nine downloadable Pug examples are built through
  `src/examples/index.js` and are not part of the co-located manifest; check
  their build/preview separately during the resource and final-validation steps.
- The cached manifest currently differs from the parsed source (five source
  IDs absent, one cache-only ID); do not interpret that cache as the live test
  inventory. Re-run the collector and update this comparison when Node/npm are
  available.

## Shared capture source

- `docs/_resources/examples.capture.md` defines `current_directory`,
  `html_sources`, and `js_sources`, and captures `full_html_content`,
  `html_content`, `js_content`, `html_origin`, and `js_origin` while iterating
  the CSV. It extracts `SmarkForm sample` and `controller sample` marker regions
  from built downloadable HTML. Preserve the extraction markers in
  `src/examples/include/layout.pug` and `sample_controller.pug`; changes to the
  standalone examples must keep this page's output intact.
- Shared interactive sampletab machinery is in
  `docs/_includes/components/sampletabs_tpl.md` and `sampletabs_ctrl.md`; those
  are site infrastructure, not candidate content-migration pages.
- The downloadable examples page is separate from the 131 sampletab includes:
  `docs/_data/examples.csv` indexes nine built `src/examples/*.pug` pages. The
  source ledger and exact CSV labels/URLs are in
  `01-baseline-content-ledger.md`. Their source bodies are wrapped by the shared
  `SmarkForm sample` marker in `layout.pug`; the controller excerpt is wrapped
  by `controller sample` in `sample_controller.pug`. The docs-example collector
  does not include these standalone Pug pages.

## `_about/faq.md`

- Include #1, L266, section **SmarkForm Essentials > What is the Singleton Pattern?**, `formId=faq_singleton_color`: `htmlSource`=faq_singleton_color_html; `tests`=false; `demoValue`={"bgcolor":"#6366f1"}.
- Include #2, L399, section **Lists > Why does my list render with no items?**, `formId=faq_empty_list`: `htmlSource`=faq_empty_list_html; `cssSource`=faq_empty_list_css; `tests`=false.
- Include #3, L477, section **Lists > How do I add animations to list items?**, `formId=faq_animations`: `htmlSource`=faq_animations_html; `cssSource`=faq_animations_css; `jsSource`=faq_animations_js; `tests`=false; `demoValue`={"items":[{"value":"First item"},{"value":"Second item"}]}.
- Include #4, L1248, section **Mixin Types > Can I implement my own component types?**, `formId=faq_mixin_labeled_input`: `htmlSource`=faq_mixin_labeled_input_html; `tests`=false; `demoValue`={"person":{"firstName":"Alice","lastName":"Smith"}}; `smarkformOptions`={"smark_mixin_allow_local_scripts":"allow"}.
- **Every capture declaration (line → exact identifier):**
  - L257 `faq_singleton_color_html`
  - L373 `faq_empty_list_html`
  - L394 `faq_empty_list_css`
  - L430 `faq_animations_html`
  - L443 `faq_animations_css`
  - L457 `faq_animations_js`
  - L1220 `faq_mixin_labeled_input_html`

## `_about/introduction.md`

- **Every capture declaration (line → exact identifier):**
  - L180 `sf_doc`
  - L302 `react_doc`
  - L579 `vue_doc`

## `_about/showcase.md`

- Include #1, L112, section **Basics > Just a Form**, `formId=just_form`: `htmlSource`=just_form_example; `notes`=notes_just_form; `tests`=just_form_tests; `demoValue`=just_form_demoValue; `showEditor`=true.
- Include #2, L446, section **Basics > Multiple-Level Nesting**, `formId=school_groups`: `htmlSource`=school_groups_example; `cssSource`=school_groups_css; `notes`=notes_school_groups; `tests`=school_groups_tests; `demoValue`=school_groups_demoValue; `showEditor`=true; `minHeight`=45.
- Include #3, L607, section **Basics > More on lists**, `formId=schedule_list`: `htmlSource`=schedule_list; `cssSource`=schedule_list_css; `notes`=include.notes; `tests`=false; `demoValue`=demoValue; `showEditor`=true; `minHeight`=10.
- Include #4, L895, section **Basics > Mixins**, `formId=schedule_table`: `htmlSource`=schedule_mixin_html; `cssSource`=schedule_table_css; `notes`=notes; `tests`=false; `demoValue`=demoValue; `showEditor`=true; `minHeight`=40.
- Include #5, L1151, section **Basics > Nested lists and forms**, `formId=nested_schedule_table`: `htmlSource`=nested_schedule_table; `cssSource`=schedule_table_css; `notes`=nested_schedule_notes; `tests`=nested_schedule_tests; `demoValue`=demoValue; `smarkformOptions`={"smark_mixin_allow_local_scripts":"allow"}; `showEditor`=true; `minHeight`=50.
- Include #6, L1378, section **Import and Export Data > Intercepting the *import* and *export* events**, `formId=nested_forms_with_load_save`: `htmlSource`=nested_forms_with_load_save; `jsSource`=form_export_example_import_export_js; `notes`=notes_nested_forms_with_load_save; `tests`=false; `demoValue`=demoValue_nested_forms_with_load_save; `showEditor`=false.
- Include #7, L1500, section **Import and Export Data > Submitting the form**, `formId=submit_form`: `htmlSource`=submit_form_example; `notes`=submit_form_example_notes; `tests`=false.
- Include #8, L1600, section **Import and Export Data > A note on context of the triggers**, `formId=context_comparsion`: `htmlSource`=context_comparsion_example; `notes`=notes; `tests`=false.
- Include #9, L1679, section **Advanced UX Improvements > Auto enabling or disabling of actions**, `formId=simple_list_autodisable`: `htmlSource`=simple_list_autodisable; `cssSource`=simple_list_autodisable_css; `tests`=false; `demoValue`=demoValue; `showEditor`=true; `minHeight`=30.
- Include #10, L1748, section **Advanced UX Improvements > Context-Driven Keyboard Shortcuts (Hot Keys)**, `formId=simple_list_hotkeys`: `htmlSource`=simple_list_hotkeys_html; `cssSource`=simple_list_hotkeys_css; `tests`=false; `demoValue`=demoValue; `showEditor`=true; `minHeight`=30.
- Include #11, L1826, section **Advanced UX Improvements > Hotkeys and context**, `formId=simple_list_hotkeys_with_context`: `htmlSource`=simple_list_hotkeys_with_context_html; `cssSource`=simple_list_hotkeys_css; `tests`=false; `demoValue`=demoValue; `showEditor`=true; `minHeight`=35.
- Include #12, L2355, section **Advanced UX Improvements > Collapsible sections**, `formId=collapsible_sections`: `htmlSource`=collapsible_sections; `cssSource`=collapsible_sections_css; `tests`=collapsible_sections_tests; `demoValue`=demoValue; `showEditor`=true; `minHeight`=40.
- Include #13, L2590, section **Advanced UX Improvements > 2nd level hotkeys**, `formId=2nd_level_hotkeys`: `htmlSource`=2nd_level_hotkeys_html; `cssSource`=simple_list_hotkeys_css; `tests`=2nd_level_hotkeys_tests; `showEditor`=true.
- Include #14, L2655, section **Advanced UX Improvements > Hidden actions**, `formId=hidden_actions`: `htmlSource`=2nd_level_hotkeys_html; `cssSource`=hidden_actions_css; `tests`=false.
- Include #15, L2766, section **Advanced UX Improvements > Animations**, `formId=animations`: `htmlSource`=2nd_level_hotkeys_html; `cssSource`=animations_css; `jsSource`=animations_js; `notes`=animations_notes; `tests`=false.
- Include #16, L2902, section **Advanced UX Improvements > Field Masking**, `formId=field_masking`: `htmlSource`=showcase_mask_html; `cssSource`=showcase_mask_css; `jsHead`=showcase_mask_js; `notes`=showcase_mask_notes; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #17, L2927, section **Advanced UX Improvements > Dynamic Dropdown Options**, `formId=dynamic_dropdown`: `htmlSource`=dynamic_dropdown; `tests`=false.
- Include #18, L3178, section **Random Examples > Simple Calculator**, `formId=calculator`: `htmlSource`=calculator; `cssSource`=calculator_css; `jsSource`=calculator_js; `notes`=notes; `tests`=false.
- Include #19, L3409, section **Random Examples > Calculator (UX improved)**, `formId=supercalculator`: `htmlSource`=supercalculator; `cssSource`=supercalculator_css; `jsSource`=supercalculator_js; `notes`=notes; `tests`=supercalculator_tests.
- Include #20, L3710, section **Random Examples > Team Event Planner**, `formId=event_planner_showcase`: `htmlSource`=event_planner_html; `cssSource`=event_planner_css; `jsSource`=event_planner_js; `notes`=notes; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L55 `notes_just_form`
  - L69 `just_form_example`
  - L84 `just_form_demoValue`
  - L90 `just_form_tests`
  - L147 `notes_school_groups`
  - L174 `school_groups_example`
  - L259 `school_groups_css`
  - L347 `school_groups_demoValue`
  - L374 `school_groups_tests`
  - L536 `hotkeys_reveal_css`
  - L551 `schedule_list`
  - L570 `notes`
  - L589 `demoValue`
  - L604 `schedule_list_css`
  - L655 `schedule_row_tpl`
  - L714 `schedule_row_form`
  - L730 `schedule_mixin_html`
  - L748 `schedule_table_css`
  - L836 `notes`
  - L852 `demoValue`
  - L928 `period_item_tpl`
  - L1021 `nested_schedule_table`
  - L1039 `nested_schedule_notes`
  - L1067 `demoValue`
  - L1113 `nested_schedule_tests`
  - L1256 `nested_forms_with_load_save`
  - L1318 `form_export_example_import_export_js`
  - L1349 `notes_nested_forms_with_load_save`
  - L1361 `demoValue_nested_forms_with_load_save`
  - L1432 `submit_form_example`
  - L1470 `submit_form_example_notes`
  - L1537 `notes`
  - L1553 `context_comparsion_example`
  - L1639 `simple_list_autodisable`
  - L1659 `simple_list_autodisable_css`
  - L1671 `demoValue`
  - L1708 `simple_list_hotkeys`
  - L1725 `simple_list_hotkeys_html`
  - L1733 `simple_list_hotkeys_css`
  - L1739 `demoValue`
  - L1795 `demoValue`
  - L1807 `simple_list_hotkeys_with_context`
  - L1819 `simple_list_hotkeys_with_context_html`
  - L1856 `collapsible_sections`
  - L1876 `collapsible_sections_css`
  - L1940 `demoValue`
  - L1951 `collapsible_sections_tests`
  - L2414 `2nd_level_hotkeys_html`
  - L2441 `2nd_level_hotkeys_tests`
  - L2640 `hidden_actions_css`
  - L2682 `animations_css`
  - L2705 `animations_js`
  - L2725 `animations_notes`
  - L2801 `showcase_mask_html`
  - L2815 `showcase_mask_js`
  - L2881 `showcase_mask_notes`
  - L2889 `demoValue`
  - L2894 `showcase_mask_css`
  - L2953 `calculator`
  - L3038 `calculatorStyles_css`
  - L3104 `calculator_css`
  - L3111 `calculator_js`
  - L3147 `notes`
  - L3217 `supercalculator`
  - L3302 `supercalculator_js`
  - L3353 `supercalculator_css`
  - L3362 `notes`
  - L3378 `supercalculator_tests`
  - L3468 `event_planner_html`
  - L3524 `event_planner_css`
  - L3644 `event_planner_js`
  - L3661 `notes`
  - L3693 `demoValue`

## `_about/showcase2.md`

- Include #1, L164, section **Just a Form**, `formId=just_form`: `htmlSource`=just_form_example; `notes`=just_form_notes; `tests`=false; `showEditor`=true.
- Include #2, L348, section **Project Kanban Board**, `formId=kanban`: `htmlSource`=kanban_html; `cssSource`=kanban_css; `jsHead`=kanban_js; `notes`=kanban_notes; `tests`=false; `showEditor`=true.
- Include #3, L603, section **Race Registration System**, `formId=race`: `htmlSource`=race_html; `cssSource`=race_css; `notes`=race_notes; `tests`=false; `showEditor`=true.
- Include #4, L814, section **Product Configurator**, `formId=configurator`: `htmlSource`=configurator_html; `cssSource`=configurator_css; `jsHead`=configurator_js; `notes`=configurator_notes; `tests`=false; `demoValue`=demoValue; `smarkformOptions`={"smark_mixin_allowLocalScripts":"allow"}; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L120 `just_form_example`
  - L142 `just_form_notes`
  - L160 `demoValue`
  - L256 `kanban_html`
  - L306 `kanban_js`
  - L321 `kanban_css`
  - L333 `kanban_notes`
  - L344 `demoValue`
  - L490 `race_html`
  - L557 `race_css`
  - L581 `race_notes`
  - L599 `demoValue`
  - L715 `configurator_html`
  - L752 `configurator_js`
  - L788 `configurator_css`
  - L797 `configurator_notes`
  - L810 `demoValue`

## `_advanced_concepts/animations.md`

- Include #1, L96, section **Simple Example — Two-Class Symmetric Animation**, `formId=anim-simple`: `htmlSource`=anim_simple_html; `cssSource`=anim_simple_css; `jsSource`=anim_simple_js; `notes`=anim_simple_notes; `tests`=false.
- Include #2, L188, section **Advanced Example — Asymmetric Entry and Exit**, `formId=anim-adv`: `htmlSource`=anim_adv_html; `cssSource`=anim_adv_css; `jsSource`=anim_adv_js; `notes`=anim_adv_notes; `tests`=false.
- **Every capture declaration (line → exact identifier):**
  - L32 `anim_simple_html`
  - L45 `anim_simple_css`
  - L60 `anim_simple_js`
  - L80 `anim_simple_notes`
  - L118 `anim_adv_html`
  - L135 `anim_adv_css`
  - L156 `anim_adv_js`
  - L176 `anim_adv_notes`

## `_advanced_concepts/events.md`

- Include #1, L292, section **Common Patterns > Submitting form data to a backend**, `formId=events_submit_example`: `htmlSource`=events_submit_example_html; `jsSource`=events_submit_example_js; `tests`=false; `demoValue`={"firstName":"Alice","lastName":"Smith"}.
- **Every capture declaration (line → exact identifier):**
  - L268 `events_submit_example_html`
  - L278 `events_submit_example_js`

## `_advanced_concepts/mixin_types.md`

- Include #1, L816, section **Examples > Reusable contact block**, `formId=mixin_contact_block`: `htmlSource`=mixin_contact_block_html; `tests`=mixin_contact_block_tests; `demoValue`=demoValue; `showEditor`=true.
- Include #2, L885, section **Examples > Option override per usage site**, `formId=mixin_option_override`: `htmlSource`=mixin_option_override_html; `tests`=mixin_option_override_tests; `demoValue`={"labels":{"priority":[{"tag":"critical"},{"tag":"needs-review"},{"tag":"assigned"}],"optional":[{"tag":"nice-to-have"}]}}; `showEditor`=true.
- Include #3, L960, section **Examples > Snippet parameters: custom labels**, `formId=mixin_snippet_params`: `htmlSource`=mixin_snippet_params_html; `tests`=mixin_snippet_params_tests; `demoValue`={"people":{"author":{"name":"Alice Smith"},"reviewer":{"name":"Bob Jones"}}}; `showEditor`=true.
- Include #4, L1058, section **Examples > Labelled list of inputs: inputlist**, `formId=mixin_inputlist`: `htmlSource`=mixin_inputlist_html; `tests`=mixin_inputlist_tests; `demoValue`=demoValue; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L747 `mixin_contact_block_html`
  - L776 `mixin_contact_block_tests`
  - L799 `demoValue`
  - L839 `mixin_option_override_html`
  - L867 `mixin_option_override_tests`
  - L907 `mixin_snippet_params_html`
  - L932 `mixin_snippet_params_tests`
  - L988 `mixin_inputlist_html`
  - L1023 `mixin_inputlist_tests`
  - L1048 `demoValue`

## `_advanced_concepts/the_singleton_pattern.md`

- Include #1, L256, section **Color Reset Example (Singleton)**, `formId=singleton_color_reset`: `htmlSource`=singleton_pattern_color_html; `cssSource`=singleton_pattern_color_css; `notes`=singleton_pattern_color_notes; `tests`=singleton_pattern_color_tests; `demoValue`=singleton_pattern_color_demoValue; `showEditor`=true.
- Include #2, L351, section **Phone List Example (Singleton)**, `formId=singleton_phones`: `htmlSource`=singleton_pattern_phones_html; `cssSource`=singleton_pattern_phones_css; `notes`=singleton_pattern_phones_notes; `tests`=singleton_pattern_phones_tests; `demoValue`=singleton_pattern_phones_demoValue; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L202 `singleton_pattern_color_html`
  - L214 `singleton_pattern_color_css`
  - L224 `singleton_pattern_color_notes`
  - L235 `singleton_pattern_color_demoValue`
  - L243 `singleton_pattern_color_tests`
  - L278 `singleton_pattern_phones_html`
  - L292 `singleton_pattern_phones_css`
  - L307 `singleton_pattern_phones_notes`
  - L324 `singleton_pattern_phones_demoValue`
  - L335 `singleton_pattern_phones_tests`

## `_component_types/type_audio.md`

- Include #1, L81, section **Try It > Basic Real Audio Field**, `formId=audio_basic`: `htmlSource`=audio_basic_html; `notes`=audio_basic_notes; `tests`=false; `demoValue`=audio_basic_demoValue; `showEditor`=true.
- Include #2, L134, section **Try It > Singleton With An Editable Name**, `formId=audio_singleton`: `htmlSource`=audio_singleton_html; `cssSource`=audio_singleton_css; `notes`=audio_singleton_notes; `tests`=false; `demoValue`=audio_singleton_demoValue; `showEditor`=true.
- Include #3, L176, section **Try It > Audio List**, `formId=audio_list`: `htmlSource`=audio_list_html; `notes`=audio_list_notes; `tests`=false; `demoValue`=audio_list_demoValue; `showEditor`=true.
- Include #4, L231, section **Try It > Empty-State Upload Affordance**, `formId=audio_empty`: `htmlSource`=audio_empty_html; `cssSource`=audio_empty_css; `notes`=audio_empty_notes; `tests`=false; `demoValue`=audio_empty_demoValue; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L55 `audio_basic_html`
  - L64 `audio_basic_notes`
  - L76 `audio_basic_demoValue`
  - L94 `audio_singleton_html`
  - L106 `audio_singleton_css`
  - L115 `audio_singleton_notes`
  - L129 `audio_singleton_demoValue`
  - L148 `audio_list_html`
  - L161 `audio_list_notes`
  - L168 `audio_list_demoValue`
  - L192 `audio_empty_html`
  - L205 `audio_empty_css`
  - L214 `audio_empty_notes`
  - L226 `audio_empty_demoValue`

## `_component_types/type_color.md`

- Include #1, L75, section **Usage**, `formId=simple_color`: `htmlSource`=simple_color; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #2, L129, section **Usage**, `formId=singleton_color`: `htmlSource`=singleton_color; `notes`=notes; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #3, L165, section **Requirements**, `formId=singleton_color_error`: `htmlSource`=singleton_color_error; `tests`=false; `expectedConsoleErrors`=1; `expectedPageErrors`=0; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L62 `simple_color`
  - L69 `demoValue`
  - L96 `notes`
  - L113 `singleton_color`
  - L123 `demoValue`
  - L145 `singleton_color_error`

## `_component_types/type_date.md`

- Include #1, L91, section **Usage**, `formId=simple_date`: `htmlSource`=simple_date; `tests`=simple_date_tests; `demoValue`=demoValue; `showEditor`=true.
- Include #2, L147, section **Requirements**, `formId=date_error`: `htmlSource`=date_error; `tests`=date_error_tests; `expectedConsoleErrors`=1; `expectedPageErrors`=0; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L51 `simple_date`
  - L58 `demoValue`
  - L65 `simple_date_tests`
  - L121 `date_error`
  - L136 `date_error_tests`

## `_component_types/type_datetime-local.md`

- Include #1, L103, section **Usage**, `formId=simple_datetime_local`: `htmlSource`=simple_datetime_local; `tests`=simple_datetime_local_tests; `demoValue`=demoValue; `showEditor`=true.
- Include #2, L162, section **Requirements**, `formId=datetime_local_error`: `htmlSource`=datetime_local_error; `tests`=datetime_local_error_tests; `expectedConsoleErrors`=1; `expectedPageErrors`=0; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L51 `simple_datetime_local`
  - L58 `demoValue`
  - L65 `simple_datetime_local_tests`
  - L137 `datetime_local_error`
  - L152 `datetime_local_error_tests`

## `_component_types/type_file.md`

- Include #1, L212, section **Declaring a File Field > The Singleton Pattern**, `formId=file_singleton`: `htmlSource`=file_singleton_html; `cssSource`=file_singleton_css; `notes`=file_singleton_notes; `tests`=file_singleton_tests; `demoValue`=file_singleton_demoValue; `showEditor`=true.
- Include #2, L305, section **Importing and Exporting Data > Raw Format (data URL)**, `formId=file_basic_usage`: `htmlSource`=file_basic_usage_html; `cssSource`=file_basic_usage_css; `notes`=file_basic_usage_notes; `tests`=false; `demoValue`=file_basic_usage_demoValue; `showEditor`=true.
- Include #3, L533, section **Files in Lists (of: "file")**, `formId=file_list`: `htmlSource`=file_list_html; `cssSource`=file_list_css; `notes`=file_list_notes; `tests`=file_list_tests; `demoValue`=file_list_demoValue; `showEditor`=true.
- Include #4, L686, section **Downloading a File**, `formId=file_download`: `htmlSource`=file_download_html; `cssSource`=file_download_css; `notes`=file_download_notes; `tests`=file_download_tests; `demoValue`=file_download_demoValue; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L75 `file_singleton_html`
  - L85 `file_singleton_css`
  - L101 `file_singleton_notes`
  - L135 `file_singleton_demoValue`
  - L149 `file_singleton_tests`
  - L249 `file_basic_usage_html`
  - L261 `file_basic_usage_css`
  - L275 `file_basic_usage_notes`
  - L298 `file_basic_usage_demoValue`
  - L417 `file_list_html`
  - L430 `file_list_css`
  - L450 `file_list_notes`
  - L470 `file_list_demoValue`
  - L481 `file_list_tests`
  - L586 `file_download_html`
  - L599 `file_download_css`
  - L622 `file_download_notes`
  - L640 `file_download_demoValue`
  - L648 `file_download_tests`

## `_component_types/type_form.md`

- Include #1, L110, section **(before first H2)**, `formId=simple_form`: `htmlSource`=simple_form_example; `notes`=simple_form_example_notes; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #2, L215, section **(before first H2)**, `formId=clear_reset_form`: `htmlSource`=clear_reset_example; `jsSource`=clear_reset_example_js; `notes`=clear_reset_example_notes; `tests`=clear_reset_example_tests; `demoValue`=demoValue; `showEditor`=false.
- **Every capture declaration (line → exact identifier):**
  - L43 `simple_form_example`
  - L80 `simple_form_example_notes`
  - L95 `demoValue`
  - L125 `clear_reset_example`
  - L152 `clear_reset_example_js`
  - L162 `clear_reset_example_tests`
  - L180 `clear_reset_example_notes`
  - L200 `demoValue`

## `_component_types/type_image.md`

- Include #1, L172, section **Declaring an Image Field > Real Field — a Profile Form**, `formId=image_basic`: `htmlSource`=image_basic_html; `cssSource`=image_basic_css; `notes`=image_basic_notes; `tests`=false; `demoValue`=image_basic_demoValue; `showEditor`=true.
- Include #2, L268, section **Declaring an Image Field > The Singleton Pattern**, `formId=image_singleton`: `htmlSource`=image_singleton_html; `cssSource`=image_singleton_css; `notes`=image_singleton_notes; `tests`=false; `demoValue`=image_singleton_demoValue; `showEditor`=true.
- Include #3, L343, section **The Placeholder**, `formId=image_placeholder`: `htmlSource`=image_placeholder_html; `cssSource`=image_placeholder_css; `notes`=image_placeholder_notes; `tests`=false; `showEditor`=true.
- Include #4, L460, section **Resizing and Converting**, `formId=image_resize_format`: `htmlSource`=image_resize_format_html; `cssSource`=image_resize_format_css; `notes`=image_resize_format_notes; `tests`=false; `demoValue`=image_resize_format_demoValue; `showEditor`=true.
- Include #5, L613, section **Images in Lists (Galleries)**, `formId=image_list`: `htmlSource`=image_list_html; `cssSource`=image_list_css; `notes`=image_list_notes; `tests`=false; `demoValue`=image_list_demoValue; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L66 `image_basic_html`
  - L94 `image_basic_css`
  - L141 `image_basic_notes`
  - L162 `image_basic_demoValue`
  - L193 `image_singleton_html`
  - L207 `image_singleton_css`
  - L235 `image_singleton_notes`
  - L261 `image_singleton_demoValue`
  - L290 `image_placeholder_html`
  - L314 `image_placeholder_css`
  - L330 `image_placeholder_notes`
  - L407 `image_resize_format_html`
  - L422 `image_resize_format_css`
  - L434 `image_resize_format_notes`
  - L453 `image_resize_format_demoValue`
  - L537 `image_list_html`
  - L551 `image_list_css`
  - L581 `image_list_notes`
  - L603 `image_list_demoValue`

## `_component_types/type_input.md`

- Include #1, L45, section **Usage**, `formId=input_basic_usage`: `htmlSource`=input_basic_usage_html; `tests`=false; `demoValue`={"username":"alice"}.
- **Every capture declaration (line → exact identifier):**
  - L39 `input_basic_usage_html`

## `_component_types/type_label.md`

- Include #1, L75, section **Overview**, `formId=basic_examples`: `htmlSource`=basic_examples; `notes`=notes; `tests`=false; `showEditor`=false.
- Include #2, L272, section **Targetting non scalar fields**, `formId=advanced_examples`: `htmlSource`=advanced_examples; `cssSource`=advanced_examples_css; `notes`=notes; `tests`=false; `showEditor`=false.
- **Every capture declaration (line → exact identifier):**
  - L40 `basic_examples`
  - L64 `notes`
  - L84 `basic_tests`
  - L201 `advanced_examples`
  - L244 `advanced_examples_css`
  - L260 `notes`

## `_component_types/type_list.md`

- Include #1, L123, section **List items**, `formId=simple_list`: `htmlSource`=simple_list_example; `cssSource`=generic_sample_css; `notes`=simple_list_example_notes; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #2, L173, section **List items > Scalar item types**, `formId=scalar_list`: `htmlSource`=scalar_list_example; `cssSource`=generic_sample_css; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #3, L229, section **List items > Applying the singleton pattern**, `formId=singleton_list`: `htmlSource`=singleton_list_example; `cssSource`=generic_sample_css; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #4, L304, section **List items > Nesting lists**, `formId=nesting_list`: `htmlSource`=nesting_list_example; `cssSource`=generic_sample_css; `tests`=false; `demoValue`=demoValue; `showEditor`=true; `minHeight`=45.
- Include #5, L649, section **List items > Options > moving_depth (Cross-List Drag scope)**, `formId=cross_list_drag`: `htmlSource`=cross_list_drag_example; `cssSource`=cross_list_drag_css; `tests`=cross_list_drag_tests; `demoValue`=cross_list_drag_demoValue; `showEditor`=true; `minHeight`=60.
- **Every capture declaration (line → exact identifier):**
  - L13 `generic_sample_css`
  - L81 `simple_list_example`
  - L97 `simple_list_example_notes`
  - L106 `demoValue`
  - L153 `scalar_list_example`
  - L164 `demoValue`
  - L207 `singleton_list_example`
  - L220 `demoValue`
  - L260 `nesting_list_example`
  - L290 `demoValue`
  - L488 `cross_list_drag_example`
  - L522 `cross_list_drag_css`
  - L563 `cross_list_drag_demoValue`
  - L590 `cross_list_drag_tests`

## `_component_types/type_number.md`

- Include #1, L53, section **Usage**, `formId=simple_number`: `htmlSource`=simple_number; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #2, L87, section **Requirements**, `formId=number_error`: `htmlSource`=number_error; `tests`=false; `expectedConsoleErrors`=1; `expectedPageErrors`=0; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L40 `simple_number`
  - L47 `demoValue`
  - L73 `number_error`

## `_component_types/type_radio.md`

- Include #1, L55, section **Usage**, `formId=radio_group_example`: `htmlSource`=radio_group_example_html; `tests`=false; `demoValue`={"gender":"female"}.
- **Every capture declaration (line → exact identifier):**
  - L38 `radio_group_example_html`

## `_component_types/type_time.md`

- Include #1, L97, section **Usage**, `formId=simple_time`: `htmlSource`=simple_time; `tests`=simple_time_tests; `demoValue`=demoValue; `showEditor`=true.
- Include #2, L155, section **Requirements**, `formId=time_error`: `htmlSource`=time_error; `tests`=time_error_tests; `expectedConsoleErrors`=1; `expectedPageErrors`=0; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L51 `simple_time`
  - L58 `demoValue`
  - L65 `simple_time_tests`
  - L129 `time_error`
  - L144 `time_error_tests`

## `_component_types/type_video.md`

- Include #1, L75, section **Try It**, `formId=video_basic`: `htmlSource`=video_basic_html; `notes`=video_basic_notes; `tests`=false; `demoValue`=video_basic_demoValue; `showEditor`=true.
- Include #2, L134, section **Try It > Singleton With An Editable Name**, `formId=video_singleton`: `htmlSource`=video_singleton_html; `cssSource`=video_singleton_css; `notes`=video_singleton_notes; `tests`=false; `demoValue`=video_singleton_demoValue; `showEditor`=true.
- Include #3, L176, section **Try It > Video List**, `formId=video_list`: `htmlSource`=video_list_html; `notes`=video_list_notes; `tests`=false; `demoValue`=video_list_demoValue; `showEditor`=true.
- Include #4, L239, section **Try It > Form Items With Related Metadata**, `formId=video_form_list`: `htmlSource`=video_form_list_html; `cssSource`=video_form_list_css; `notes`=video_form_list_notes; `tests`=false; `demoValue`=video_form_list_demoValue; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L43 `video_basic_html`
  - L53 `video_basic_notes`
  - L70 `video_basic_demoValue`
  - L96 `video_singleton_html`
  - L108 `video_singleton_css`
  - L117 `video_singleton_notes`
  - L129 `video_singleton_demoValue`
  - L148 `video_list_html`
  - L161 `video_list_notes`
  - L168 `video_list_demoValue`
  - L193 `video_form_list_html`
  - L209 `video_form_list_css`
  - L225 `video_form_list_notes`
  - L234 `video_form_list_demoValue`

## `_getting_started/core_component_types.md`

- Include #1, L124, section **Scalar field types > type: input**, `formId=input_example`: `htmlSource`=input_example; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #2, L206, section **Scalar field types > type: input > The Singleton Pattern.**, `formId=no_singleton_example`: `htmlSource`=no_singleton_example; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #3, L241, section **Scalar field types > type: input > The Singleton Pattern.**, `formId=singleton_example`: `htmlSource`=singleton_color_example; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #4, L294, section **Scalar field types > type: number and type: date**, `formId=number_and_date_example`: `htmlSource`=number_and_date_example; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #5, L356, section **Scalar field types > type: color**, `formId=color_example`: `htmlSource`=color_example; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #6, L405, section **Scalar field types > type: color**, `formId=clear_others_example`: `htmlSource`=clear_others_example; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L72 `input_example`
  - L113 `demoValue`
  - L189 `no_singleton_example`
  - L200 `demoValue`
  - L222 `singleton_color_example`
  - L235 `demoValue`
  - L273 `number_and_date_example`
  - L287 `demoValue`
  - L337 `color_example`
  - L350 `demoValue`
  - L371 `clear_others_example`
  - L397 `demoValue`

## `_getting_started/core_concepts.md`

- Include #1, L73, section **Forms, Lists and (other) Fields**, `formId=simple_form`: `htmlSource`=simple_form_example; `notes`=simple_form_example_notes; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #2, L172, section **Forms, Lists and (other) Fields > Fields**, `formId=context_comparsion_simple`: `htmlSource`=context_comparsion_example_simple; `notes`=notes; `tests`=false.
- Include #3, L255, section **Forms, Lists and (other) Fields > Form nesting**, `formId=nested_forms`: `htmlSource`=nested_forms_example; `notes`=notes; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #4, L334, section **Forms, Lists and (other) Fields > Lists**, `formId=fixed_list`: `htmlSource`=fixed_list_example; `notes`=fixed_list_example_notes; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #5, L422, section **Forms, Lists and (other) Fields > Lists**, `formId=pets_list`: `htmlSource`=pets_list_example; `cssSource`=pets_list_example_css; `notes`=pets_list_example_notes; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #6, L535, section **Forms, Lists and (other) Fields > Triggers target**, `formId=core_remove_inside_item`: `htmlSource`=core_remove_inside_item_html; `tests`=false; `demoValue`={"pets":[{"species":"Cat","name":"Whiskers"},{"species":"Dog","name":"Rex"}]}.
- Include #7, L661, section **Forms, Lists and (other) Fields > Singletons**, `formId=core_singleton_phones`: `htmlSource`=core_singleton_phones_html; `tests`=false; `demoValue`={"personal_data":{"name":"Alice","surname":"Smith","phones":["555-1234","555-5678"]}}.
- Include #8, L978, section **Accessing Components**, `formId=components_paths`: `htmlSource`=null; `tests`=false; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L37 `simple_form_example`
  - L52 `simple_form_example_notes`
  - L66 `demoValue`
  - L106 `context_comparsion_example_simple`
  - L153 `notes`
  - L197 `nested_forms_example`
  - L231 `notes`
  - L241 `demoValue`
  - L279 `fixed_list_example`
  - L292 `fixed_list_example_notes`
  - L324 `demoValue`
  - L357 `pets_list_example`
  - L382 `pets_list_example_css`
  - L392 `pets_list_example_notes`
  - L407 `demoValue`
  - L522 `core_remove_inside_item_html`
  - L645 `core_singleton_phones_html`

## `_getting_started/quick_start.md`

- Include #1, L122, section **Basic setup > Create a simple HTML form**, `formId=simple_legacy`: `htmlSource`=html_source_legacy; `jsSource`=-; `tests`=false.
- Include #2, L143, section **Basic setup > Initialize the Form**, `formId=simple_initialized`: `htmlSource`=html_source_legacy; `tests`=false.
- Include #3, L194, section **Do the magic**, `formId=enhanced_simple_form`: `htmlSource`=html_source_enhanced; `tests`=false.
- Include #4, L273, section **Do the magic > Actions and Triggers**, `formId=enhanced_simple_form_with_clears`: `htmlSource`=html_source_enhanced_with_clears; `tests`=false.
- Include #5, L338, section **Do the magic > Exporting data**, `formId=enhanced_withExport`: `htmlSource`=html_source_enhanced; `jsSource`=form_export_example_js; `notes`=form_export_example_notes; `tests`=false.
- Include #6, L412, section **Do the magic > Importing data**, `formId=enhanced_withImport`: `htmlSource`=html_source_enhanced_withImport; `jsSource`=form_export_example_withImport_js; `tests`=false.
- Include #7, L502, section **Do the magic > Form traversing**, `formId=traversing_example_callback`: `htmlSource`=traversing_form_example; `jsSource`=traversing_form_example_callback_js; `tests`=false.
- Include #8, L523, section **Do the magic > Form traversing**, `formId=traversing_example_async`: `htmlSource`=traversing_form_example; `jsSource`=traversing_form_example_async_js; `tests`=false.
- Include #9, L614, section **Do the magic > Context and Target**, `formId=simple_list`: `htmlSource`=simple_list_example; `jsSource`=simple_list_js; `notes`=simple_list_example_notes; `tests`=false.
- Include #10, L672, section **Do the magic > Context and Target**, `formId=simplified`: `htmlSource`=html_source_simplified; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #11, L749, section **Go further... > Event handling**, `formId=enhanced_confirmCancel`: `htmlSource`=html_source_enhanced_withImport; `jsSource`=simple_confirm_cancel_example_js; `tests`=false.
- Include #12, L781, section **Go further... > Event handling**, `formId=enhanced_confirmCancel_non_empty`: `htmlSource`=html_source_enhanced_withImport; `jsSource`=confirm_cancel_example_with_confirm_js; `tests`=false.
- Include #13, L891, section **Customize your form**, `formId=telephone_list`: `htmlSource`=html_phone_list; `cssSource`=advanced_sample_css; `notes`=phone_list_form_example_notes; `tests`=false.
- Include #14, L930, section **Customize your form**, `formId=schedule_list`: `htmlSource`=html_schedule_list; `cssSource`=-; `tests`=false.
- **Every capture declaration (line → exact identifier):**
  - L104 `html_source_legacy`
  - L177 `html_source_enhanced`
  - L254 `html_source_enhanced_with_clears`
  - L322 `form_export_example_js`
  - L332 `form_export_example_notes`
  - L373 `html_source_enhanced_withImport`
  - L393 `form_export_example_withImport_js`
  - L445 `traversing_form_example`
  - L482 `traversing_form_example_callback_js`
  - L492 `traversing_form_example_async_js`
  - L575 `simple_list_example`
  - L592 `simple_list_js`
  - L606 `simple_list_example_notes`
  - L652 `html_source_simplified`
  - L665 `demoValue`
  - L729 `simple_confirm_cancel_example_js`
  - L744 `simple_confirm_cancel_example_hidden_js`
  - L765 `confirm_cancel_example_with_confirm_js`
  - L836 `html_phone_list`
  - L854 `advanced_sample_css`
  - L871 `phone_list_form_example_notes`
  - L904 `html_schedule_list`

## `_resources/examples.md`

- **Every capture declaration (line → exact identifier):**
  - L39 `void`

## `_resources/playground.md`

- Include #1, L160, section **Random Examples > Simple Calculator**, `formId=playground-calculator`: `htmlSource`=calculator; `cssSource`=calculator_css; `jsSource`=calculator_js; `tests`=false.
- **Every capture declaration (line → exact identifier):**
  - L90 `calculator`
  - L121 `calculator_css`
  - L138 `calculator_js`

## `_working_with_forms/data_import_and_export.md`

- Include #1, L111, section **The `export` Action > Return value structure**, `formId=export_structure`: `htmlSource`=export_structure_html; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #2, L229, section **The `import` Action > Accepted data formats**, `formId=import_example`: `htmlSource`=import_example_html; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- Include #3, L372, section **Default Values, `clear`, and `reset` > Comparing `clear` and `reset`**, `formId=clear_vs_reset`: `htmlSource`=clear_vs_reset_html; `notes`=clearResetNotes; `tests`=false; `showEditor`=true.
- Include #4, L511, section **Piping Data Between Components > Chaining export and import**, `formId=pipe_example`: `htmlSource`=pipe_example_html; `notes`=pipe_example_notes; `tests`=false; `demoValue`=demoValue; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L67 `export_structure_html`
  - L92 `demoValue`
  - L203 `import_example_html`
  - L221 `demoValue`
  - L344 `clear_vs_reset_html`
  - L364 `clearResetNotes`
  - L448 `pipe_example_html`
  - L491 `pipe_example_notes`
  - L496 `demoValue`

## `_working_with_forms/field_masking.md`

- Include #1, L86, section **Applying a Mask to a Field**, `formId=apply-mask`: `htmlSource`=apply_mask_form; `jsHead`=apply_mask_async_js; `notes`=apply_mask_notes; `tests`=false; `showEditor`=true.
- Include #2, L142, section **Registering a Mask > Via JavaScript**, `formId=via-js`: `htmlSource`=apply_mask_cdn_html; `jsHead`=apply_mask_js; `notes`=via_js_notes; `tests`=false; `showEditor`=true.
- Include #3, L180, section **Registering a Mask > Via Declarative HTML**, `formId=via-script`: `htmlSource`=via_script_html; `notes`=via_script_notes; `tests`=false; `showEditor`=true.
- Include #4, L304, section **Credit Card Example (IMask)**, `formId=mask-cc`: `htmlSource`=mask_cc_html; `cssSource`=mask_cc_css; `jsHead`=mask_cc_js; `notes`=mask_cc_notes; `tests`=false; `showEditor`=true.
- Include #5, L390, section **Custom Mask Example (No Library + Singleton + List)**, `formId=mask-custom`: `htmlSource`=mask_custom_html; `jsHead`=mask_custom_js; `notes`=mask_custom_notes; `tests`=mask_custom_tests; `showEditor`=true; `minHeight`=45.
- Include #6, L443, section **Mixin-Scoped Masks**, `formId=mixin-mask`: `htmlSource`=mixin_mask_html; `notes`=mixin_mask_notes; `tests`=false; `smarkformOptions`={"smark_mixin_allow_local_scripts":"allow"}; `showEditor`=true.
- Include #7, L537, section **Using Other Masking Libraries (Maska)**, `formId=maska-price`: `htmlSource`=maska_html; `jsHead`=maska_js; `notes`=maska_notes; `tests`=false; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L60 `apply_mask_form`
  - L72 `apply_mask_async_js`
  - L82 `apply_mask_notes`
  - L123 `apply_mask_cdn_html`
  - L129 `apply_mask_js`
  - L138 `via_js_notes`
  - L160 `via_script_mask`
  - L169 `via_script_html`
  - L176 `via_script_notes`
  - L207 `mask_cc_html`
  - L220 `mask_cc_js`
  - L292 `mask_cc_notes`
  - L297 `mask_cc_css`
  - L328 `mask_custom_html`
  - L348 `mask_custom_js`
  - L376 `mask_custom_notes`
  - L381 `mask_custom_tests`
  - L415 `mixin_mask_html`
  - L439 `mixin_mask_notes`
  - L468 `maska_html`
  - L479 `maska_js`
  - L522 `maska_notes`

## `_working_with_forms/form_traversing.md`

- Include #1, L362, section **List Item Sibling Navigation > Examples > Copy Data Between Adjacent List Items**, `formId=form_trav_copy_adjacent`: `htmlSource`=form_trav_copy_adjacent_html; `cssSource`=form_trav_copy_adjacent_css; `tests`=false; `demoValue`={"plan":[{"day":"Monday","main":"Lasagna","side":"Garlic bread"},{"day":"Tuesday","main":"Tacos","side":"Guacamole"},{"day":"Wednesday","main":"Pizza","side":"Caesar salad"}]}.
- Include #2, L422, section **List Item Sibling Navigation > Examples > Dynamic List Navigation UI**, `formId=form_trav_navigation_ui`: `htmlSource`=form_trav_navigation_ui_html; `cssSource`=form_trav_navigation_ui_css; `tests`=false; `demoValue`={"itinerary":[{"day":"Friday","activity":"Arrival and hotel check-in"},{"day":"Saturday","activity":"Old town walking tour"},{"day":"Sunday","activity":"Museum day"}]}.
- Include #3, L589, section **Advanced Path Features > Wildcard `context` Multi-Dispatch**, `formId=form_trav_kanban`: `htmlSource`=form_trav_kanban_html; `cssSource`=form_trav_kanban_css; `jsSource`=form_trav_kanban_js; `notes`=form_trav_kanban_notes; `tests`=false; `demoValue`=form_trav_kanban_demoValue; `showEditor`=true.
- Include #4, L651, section **Practical Examples > Data Copying Between List Items**, `formId=form_trav_practical_copy`: `htmlSource`=form_trav_practical_copy_html; `tests`=false; `demoValue`={"contacts":[{"name":"Alice","email":"alice@example.com","phone":"555-1234"},{"name":"Bob","email":"bob@example.com","phone":"555-5678"}]}.
- **Every capture declaration (line → exact identifier):**
  - L337 `form_trav_copy_adjacent_html`
  - L354 `form_trav_copy_adjacent_css`
  - L398 `form_trav_navigation_ui_html`
  - L416 `form_trav_navigation_ui_css`
  - L483 `form_trav_kanban_html`
  - L533 `form_trav_kanban_css`
  - L545 `form_trav_kanban_js`
  - L557 `form_trav_kanban_demoValue`
  - L572 `form_trav_kanban_notes`
  - L623 `form_trav_practical_copy_html`

## `_working_with_forms/hotkeys.md`

- Include #1, L63, section **Defining a Hotkey**, `formId=hk-define`: `htmlSource`=hk_define_html; `notes`=hk_define_notes; `tests`=false.
- Include #2, L108, section **Hotkey Reveal (Ctrl Discovery)**, `formId=hk-reveal`: `htmlSource`=hk_define_html; `cssSource`=hk_reveal_css; `notes`=hk_reveal_notes; `tests`=false.
- Include #3, L171, section **Context Sensitivity**, `formId=hotkeys_context_sensitivity`: `htmlSource`=hotkeys_context_sensitivity_html; `cssSource`=hotkeys_context_sensitivity_css; `tests`=false; `demoValue`={"users":[{"name":"Alice","phones":[{"phone":"555-1234"}]},{"name":"Bob","phones":[{"phone":"555-5678"}]}]}.
- Include #4, L287, section **Hiding Trigger Buttons (While Keeping Hotkeys)**, `formId=hk_hidden`: `htmlSource`=hk_hidden_html; `cssSource`=hk_hidden_css; `notes`=hk_hidden_notes; `tests`=false; `demoValue`={"phones":["+1 555 0100","+1 555 0101"]}; `showEditor`=true; `minHeight`=45.
- Include #5, L353, section **Further Examples**, `formId=hk-2ndlevel`: `htmlSource`=hk_2ndlevel_html; `notes`=hk_2ndlevel_notes; `tests`=false.
- **Every capture declaration (line → exact identifier):**
  - L46 `hk_define_html`
  - L59 `hk_define_notes`
  - L89 `hk_reveal_css`
  - L104 `hk_reveal_notes`
  - L135 `hotkeys_context_sensitivity_html`
  - L157 `hotkeys_context_sensitivity_css`
  - L239 `hk_hidden_html`
  - L258 `hk_hidden_css`
  - L281 `hk_hidden_notes`
  - L327 `hk_2ndlevel_html`
  - L349 `hk_2ndlevel_notes`

## `_working_with_forms/keyboard_navigation.md`

- Include #1, L52, section **Enter / Shift+Enter Navigation**, `formId=nav-enter`: `htmlSource`=nav_enter_html; `notes`=nav_enter_notes; `tests`=false.
- Include #2, L96, section **Tab-Flow Exclusion for Hotkey-Equipped Buttons**, `formId=nav-tabflow`: `htmlSource`=nav_tabflow_html; `notes`=nav_tabflow_notes; `tests`=false.
- Include #3, L152, section **Alt+Enter for Collapsed Sections**, `formId=nav-details`: `htmlSource`=nav_details_html; `notes`=nav_details_notes; `tests`=false.
- **Every capture declaration (line → exact identifier):**
  - L26 `nav_enter_html`
  - L48 `nav_enter_notes`
  - L77 `nav_tabflow_html`
  - L92 `nav_tabflow_notes`
  - L119 `nav_details_html`
  - L148 `nav_details_notes`

## `_working_with_forms/value_coercion.md`

- Include #1, L123, section **Scalar-to-Array List Coercion > Exporting Empty Items**, `formId=smart_value_coercion`: `htmlSource`=smart_value_coercion; `cssSource`=smart_value_coercion_css; `notes`=notes; `tests`=smart_value_coercion_tests; `demoValue`=demoValue; `showEditor`=true.
- Include #2, L274, section **Number, Date, Time, and JSON Coercion > JSON format**, `formId=type_coercion`: `htmlSource`=type_coercion; `notes`=notes; `tests`=type_coercion_tests; `demoValue`=demoValue; `showEditor`=true.
- **Every capture declaration (line → exact identifier):**
  - L37 `notes`
  - L58 `smart_value_coercion`
  - L71 `smart_value_coercion_css`
  - L80 `smart_value_coercion_tests`
  - L117 `demoValue`
  - L159 `notes`
  - L188 `type_coercion`
  - L210 `type_coercion_tests`
  - L261 `demoValue`

## `index.md`

- Include #1, L272, section **Interactive Demo**, `formId=event_planner`: `htmlSource`=event_planner_html; `cssSource`=event_planner_css; `jsSource`=event_planner_js; `tests`=false; `demoValue`=demoValue; `showEditor`=false.
- **Every capture declaration (line → exact identifier):**
  - L18 `event_planner_html`
  - L74 `event_planner_css`
  - L182 `event_planner_js`
  - L255 `demoValue`
