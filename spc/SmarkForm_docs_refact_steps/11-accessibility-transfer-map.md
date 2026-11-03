# Step 11 — Accessibility and End-User Transfer Map

**Status:** Keyboard Navigation and Hotkeys remain in Accessibility; the User
Guide remains a separate end-user destination. The new Accessible Labels and
Names page covers verified generated associations. The staged legacy pages are
unchanged.

## Page review and dispositions

| Source / canonical destination | Material retained or added | Step 11 corrections |
|---|---|---|
| `_working_with_forms/keyboard_navigation.md` → `docs/_accessibility/keyboard_navigation.md` | All four sections and three sampletabs remain: Enter/Shift+Enter, hotkey list tab flow, Alt+Enter/details, and details used as list items. | Qualified field navigation and browser Tab order; documented Ctrl+Enter forward from textareas (including Ctrl+Alt+Enter for collapsed sections), Shift+Enter backward, and Alt+Shift+Enter. Limited Tab exclusion to hotkeyed list add/remove triggers and noted authored `tabindex` is preserved. Removed broad accessibility wording and avoided AT claims. |
| `_working_with_forms/hotkeys.md` → `docs/_accessibility/hotkeys.md` | All sections and five sampletabs remain, including context sensitivity, Ctrl reveal, conflict resolution, hidden convenience buttons, and second-level hotkeys. | Corrected to Ctrl/Ctrl+Alt only (no Cmd/Meta); states visual CSS hints are unverified for AT; warns against relying on visually hidden buttons as the only access to essential actions; requires visible, named, keyboard-reachable essential controls. |
| `_resources/user_guide.md` → `docs/_for_end_users/user_guide.md` | All user-facing keyboard, list, file/media, details, focus and existing illustration material remains. | Removed Cmd/Meta instructions; corrected the false claim that filling the last list item auto-adds another; qualified keyboard support and collapsible/textarea combinations; corrected media Space behavior for native controls; shortened accessibility notes for the end-user audience. |
| New `docs/_accessibility/accessible_labels_and_names.md` | Adds a runnable native-label/non-native-label example, generated `for`/`id`, preserved `aria-labelledby` tokens, semantic grouping, media alternatives, focus/contrast/reduced-motion responsibilities, and unverified AT caveat. | Deliberately makes no conformance or screen-reader outcome claim. Keeps the full label API in Component Reference. |
| `docs/_component_reference/label.md` | Full type-specific API remains canonical and receives its detailed review in Step 14. | Links to Accessible Labels and Names; clarifies native `<label>` versus non-native targeting and avoids screen-reader claims. Step 14 later wires DOM association smoke tests to both label examples. |
| `docs/_guides/using_smarkform.md`, FAQ, Showcase routes | Existing human-learning links retained. | Accessibility page is discoverable through the Accessibility navigation; User Guide remains under For End Users. No developer APIs are moved into the end-user guide. |

## Sampletab and capture inventory

All existing examples keep their original `formId`s, capture wiring and
`tests=false` values unless custom tests are noted. The user guide contains no
sampletabs and keeps its existing image assets.

| Page | Existing sampletabs | Captures | Tests |
|---|---|---:|---|
| Keyboard Navigation | `nav-enter`, `nav-tabflow`, `nav-details` | 6 | None; all sampletabs remain `tests=false`. |
| Hotkeys | `hk-define`, `hk-reveal`, `hotkeys_context_sensitivity`, `hk_hidden`, `hk-2ndlevel` | 11 | None; all sampletabs remain `tests=false`. |
| Label Component Reference | `basic_examples`, `advanced_examples` | 6 at Step 11 | At Step 11 both includes were `tests=false`; Step 14 later wires native association and non-native ARIA-token smoke tests. |
| User Guide | None | None | Not applicable. |
| Accessible Labels and Names | `accessible_labels_names` (new) | 4 | `tests=false`; `demoValue` enables the collector-generated round-trip smoke test. |

Across these four pages, **10 existing sampletabs and 23 existing captures**
remain; the new guide adds one sampletab and four captures.
The new sample uses relative label targets and an editor-safe `myForm$$` root.
No existing test source was altered or removed. The test runner was not
available in this session; see verification below.

## Verified accessibility behavior

* For a native `<label>` associated with a native field, `label.type.js` ensures
  the field has an ID (preserving an existing ID) and sets the label's `for`.
* For a non-native SmarkForm label (for example, a `<span>`), SmarkForm ensures
  a label ID and appends it to the target's existing `aria-labelledby` tokens
  without duplicating the token. Native `<label>` cannot target a non-native
  component. A label wrapping its field must not also specify `target`.
* SmarkForm does not add generic group/list/landmark roles to every component.
  Authors choose semantic HTML, visible label text, `fieldset`/`legend` groups,
  and appropriate ARIA for their interface.
* The root temporarily receives `aria-busy` during rendering. Lists receive
  `aria-live="polite"` and `aria-atomic="true"`. Media loading notices use a
  `role="status"` toast. These attributes are source-verified; their actual
  announcement behavior with assistive technology has **not** been tested.
* Image fields do not set or alter `alt`; authors provide meaningful image
  alternatives. Native audio/video controls remain author-selected. Captions,
  transcripts, focus styles, contrast, and reduced-motion behavior remain
  author responsibilities.
* `src/lib/hotkeys.js` checks `ctrlKey`/`Control` and `Alt`; it does not use
  `metaKey`/`Meta`. Keyboard instructions therefore use Ctrl, including on
  macOS.
* `src/types/input.type.js` handles field Enter navigation: forward navigation
  from a textarea requires Ctrl, Shift+Enter moves backward, and Alt opens
  closed `<details>` on the destination path. `src/lib/events.js` handles the
  synchronous Space/Shift+Space behavior around `<summary>` and closed sections.
  `src/types/list.type.js` adds `tabindex="-1"` to hotkeyed list add/remove
  triggers only when no `tabindex` was authored.
* `src/types/audio.type.js` and `video.type.js` distinguish play/pick mode and
  native controls for Space; Shift+Space requests the picker where enabled.
  Image fields do not set or alter `alt` text.
* At Step 11, no focused test asserted generated `for`/`id` or
  `aria-labelledby` token behavior, and the legacy `basic_tests` capture was
  unwired. Step 14 replaces that stale test body, wires it to the native-label
  sample, and adds an ARIA-token preservation test to the non-native sample.
  These are DOM assertions only; they do not verify assistive-technology output.

## Separate assistive-technology follow-up

The bounded unverified questions are listed in
[`11-accessibility-follow-up.md`](11-accessibility-follow-up.md). This
documentation-only step does not claim WCAG conformance or tested NVDA, JAWS,
VoiceOver, or TalkBack outcomes.

## Verification

* Compared old and canonical page captures/sampletab IDs; all existing
  `nav-*`, `hk-*`, `hotkeys_context_sensitivity`, and second-level examples
  remain, and all prior User Guide media illustrations remain referenced.
* Jekyll build and rendered public-route/fragment checks pass; canonical
  Accessibility and For End Users routes are indexable and in the sitemap.
* Node/npm and Playwright are unavailable here; the docs collector and sample
  round-trip tests were not run. The new demoValue-backed sample is wired for
  the collector-generated test.

## Step 17 Showcase transfer addendum

Step 17 adds the legacy contacts/details example as `collapsible_sections` in
Keyboard Navigation, retaining its full keyboard-navigation regression test;
this is separate from the existing `nav-details` sample. Keyboard Navigation
now has four sampletabs and 12 captures, with one custom test capture wired.
The existing `hk-2ndlevel` Hotkeys sample now has an `hk_2ndlevel_tests` capture
that checks nearest-context and Ctrl+Alt second-level hint exposure. Hotkeys
now has 12 captures and one custom test. The earlier Step 11 inventories above
remain the baseline, with Step 14 Label updates recorded separately.
