# Step 11 — Accessibility and End-User Path

## Session goal

Make accessibility guidance specific to verified behavior, group keyboard
material in the approved Accessibility section, add Accessible Labels and Names,
and place the User Guide on the separate end-user path.

## Dependencies

- Steps 01–03 and approved routes.
- Steps 09–10 where moved guide pages provide authoritative keyboard/event
  links.

## Work

1. Move Keyboard Navigation and Hotkeys to Accessibility and the User Guide to
   For End Users. Update nav and reader paths without confusing end users with
   the developer walkthrough.
2. Create **Accessible Labels and Names** from verified material on native
   `for`, generated IDs, non-native `aria-labelledby`, preservation of existing
   tokens, native semantics, and author responsibilities. Keep the Label type's
   full API in Component Reference.
3. Audit documentation statements against source and tests: keyboard focus and
   details behavior, event hooks, generated ARIA, list live-region attributes,
   media status notices, native media controls, and handling of image `alt`.
4. Correct the macOS `Cmd` claim to Ctrl-only unless implementation is changed
   separately. Do not implement behavior in this docs-only work.
5. Qualify broad “full keyboard support,” “accessible,” or conformance claims.
   Explain semantic HTML, focus style, contrast, alternatives/captions, and
   reduced-motion responsibilities where applicable.
6. Record uncertain screen-reader/live-announcement behavior and recommended
   follow-up in a separate bounded audit note for the maintainer. Do not claim
   tested AT outcomes without testing.

## Required references

- `spc/SmarkForm_docs_refact.md` §6 accessibility evidence/questions and Stage 1.
- `docs/_working_with_forms/keyboard_navigation.md`, `hotkeys.md`, label type
  page, `docs/_resources/user_guide.md`, and the approved target pages.
- `src/types/label.type.js`, keyboard/hotkey/focus/list/media source, and focused
  tests.

## Deliverables

- Accessibility collection pages and links as approved.
- New Accessible Labels and Names page.
- Corrected, evidence-based wording and a separate follow-up list for unverified
  assistive-technology questions.

## Verification / done when

- No conformance or screen-reader announcement claim exceeds available evidence.
- Platform modifier instructions match current implementation.
- Label roles/native associations and author-owned semantics are distinguished.
- Keyboard docs preserve exact implemented key behavior and relevant caveats.
- New/moved pages build, link, and meet front matter/TOC requirements.

## Delegation

This is a good candidate for a read-only, bounded accessibility fact-check by a
separate agent. The implementing agent must verify source/tests and label any
AT claim as unverified; do not delegate behavioral fixes or parallel edits under
this documentation-only plan.
