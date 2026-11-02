# Step 10 — Practical and Advanced Topics Transfer Map

**Status:** The four practical topic guides and three Advanced Concepts pages
are finalized at their approved routes. The API Interface remains an explicit
planned/not-implemented page. The Select component reference now labels its
proposed `src` example as non-runnable; its full component-page review remains
in Step 14.

## Page dispositions

| Source | Canonical page | Step 10 treatment |
|---|---|---|
| `_advanced_concepts/events.md` | `docs/_guides/events.md` | Preserved lifecycle, DOM field events, registration APIs, bubbling, patterns, and implementation notes. Corrected lifecycle scope: triggers use the `actions` dispatcher; direct prototype calls do not emit lifecycle events. Fixed decorator source attribution and the validation placeholder. |
| `_advanced_concepts/mixin_types.md` | `docs/_guides/mixin_types.md` | Preserved mixin resolution, constraints, merging, `data-for`, caching, preload, scripts/styles, security, examples, and errors. Corrected option example (`exportEmpty` → supported input `placeholder`), per-origin `same-origin` policy value, multiple top-level styles/scripts, event-context comment, and examples to use `myForm`. |
| `_advanced_concepts/the_singleton_pattern.md` | `docs/_guides/the_singleton_pattern.md` | Preserved singleton behavior, scalar-list, file wrapper, errors, and both examples. Clarified that labels/triggers may accompany the one field, the wrapper owns the name, and the inner field is unnamed; corrected malformed text and aligned natural context wording with Step 07. |
| `_advanced_concepts/animations.md` | `docs/_guides/animations.md` | Preserved both CSS/lifecycle examples. Corrected the asymmetric exit explanation: the code waits for the opacity transition; it does not perform a second 1 ms delay. |
| `_advanced_concepts/the_smarkform_constructor.md` | `docs/_advanced_topics/the_smarkform_constructor.md` | Retained as Advanced Concepts; Step 09 mask-option correction remains. Migration markers removed. |
| `_advanced_concepts/security_considerations.md` | `docs/_advanced_topics/security_considerations.md` | Retained as Advanced Concepts. Clarified eager preload is best-effort, documented per-origin external-fetch maps, and corrected JSON fetch credentials/CORS/CSRF wording against `form.type.js`. |
| `_advanced_concepts/error_codes.md` | `docs/_advanced_topics/error_codes.md` | Retained as Advanced Concepts. Added current mask, native input validation, media-field errors, label-summary errors, and media notice event codes. The native input section no longer mislabels type mismatch as browser value parsing. |
| `_working_with_forms/the_api_interface.md` | `docs/_guides/the_api_interface.md` | Replaced the migration stub with an indexable, nav-visible **The API Interface (Planned)** status page. It states that `src` bindings, automatic dependency fetching, and adapters are not implemented, and links to current Events and Import/Export workflows. |
| `_component_types/type_select.md` | `docs/_component_reference/select.md` | Added an explicit planned/not-implemented warning around the proposal-only `src` example; the broader Select reference review remains Step 14. Its migration marker and sitemap exclusion intentionally remain until then. |
| FAQ / Roadmap / Using SmarkForm | `docs/_about/faq.md`, `docs/_about/roadmap.md`, `docs/_guides/using_smarkform.md` | FAQ links directly to the planned page; the roadmap remains the proposal source; Using SmarkForm already links to Events and now includes Value Coercion as a next topic. |
| `test/mask_imask.tests.js` | same test file | Updated source-page comments to canonical Field Masking and Showcase paths only. Test logic and expected numeric `type:"number"` results are unchanged. |

## Section coverage

Every baseline section locator for Events, Mixin Types, Singleton Pattern,
Animations, Constructor, Security Considerations, and Error Codes remains in
its canonical destination. Section-level corrections above are noted in the
source-to-destination ledger. The API Interface had no substantive implemented
sections or samples in the baseline; its proposed behavior remains explicitly
non-implemented.

## Sampletabs, tests, and captures

| Guide | Existing sampletabs | Capture declarations | Test disposition |
|---|---|---:|---|
| Events | `events_submit_example` | 2 | `tests=false`; no custom test removed. |
| Mixin Types | `mixin_contact_block`, `mixin_option_override`, `mixin_snippet_params`, `mixin_inputlist` | 10 | Four custom test captures remain linked to their original examples. |
| The Singleton Pattern | `singleton_color_reset`, `singleton_phones` | 10 | Both custom test captures remain linked to their original examples. |
| Animations | `anim-simple`, `anim-adv` | 8 | `tests=false`; no custom test removed. |

Total: **9 existing sampletabs and 30 capture declarations**, with no lost IDs,
captures, demo values, or test wiring. No new playable examples were introduced.

## Verification

* Reviewed event behavior against `src/types/trigger.type.js` and
  `src/lib/events.js`; action lifecycle events belong to the trigger dispatcher,
  not raw prototype methods.
* Reviewed mixin constraints, source-document resolution, cache/preload,
  merging, and root security policies against `spc/mixins.md` and
  `src/lib/mixin.js`.
* Reviewed animation lifecycle behavior against component `afterRender` and
  `beforeUnrender` handling. No animation engine is implied.
* Reviewed singleton field discovery/naming against `src/lib/component.js` and
  `src/lib/field.js`.
* Compared the error-code reference against literal source `renderError` codes
  and emitted error/notice codes; current native-field, mask, label, media and
  mixin codes are represented with event notices distinguished from errors.
* Jekyll build and rendered public-link/fragment checks pass; canonical routes
  are in the sitemap and staging routes are excluded.
* Node/npm and Playwright are unavailable here, so sample collection and tests
  were not run. No test execution is claimed.

### Follow-up noted, not implemented here

`src/lib/mixin.js` permits multiple top-level `<style>` and `<script>` siblings,
so the guide was corrected to match. Separately, existing rendering behavior and
new warnings are recorded in the runtime source; this Step 10 changes no library
code.
