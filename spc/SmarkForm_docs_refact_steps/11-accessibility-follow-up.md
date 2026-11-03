# Accessibility Follow-Up — Assistive-Technology Audit

**Scope:** These are implementation and authoring questions for a separate
browser/accessibility audit. They are not claims that the current behavior is
inaccessible, and none was tested as part of the documentation refactor.

## Announcements and dynamic content

1. Test whether list changes are announced usefully with the current
   `aria-live="polite"` and `aria-atomic="true"` attributes. Cover add, remove,
   reorder, empty-list transitions, nested lists, and rapid changes. Determine
   whether announcing the entire list is too verbose and whether settings
   should be configurable.
2. Test media `role="status"` toasts and notice updates across screen readers.
   Verify when the live region is inserted, whether repeated notices announce,
   and how cancelling a notice with `preventDefault()` changes the experience.
3. Verify when `aria-busy` on the root is exposed and cleared in the browser
   accessibility tree, especially for forms with asynchronous mixin/media
   rendering.

## Names, roles, and dynamic focus

4. Inspect native `<label for>` and generated field IDs in the accessibility
   tree. Cover authored IDs, multiple labels, label-wrapped fields, nested
   forms, singleton fields, and radio groups.
5. Inspect non-native label `aria-labelledby` output, including preservation of
   existing tokens, multiple SmarkForm labels for one target, list targets,
   generated label IDs, and dynamic insertion/removal.
6. Verify Enter/Shift+Enter, Ctrl+Enter in textareas, Alt+Enter through closed
   `<details>`, list focus retention at `min_items:0`, and focus after list
   insertion/removal with representative screen readers and keyboard-only use.
7. Check the accessibility-tree and keyboard behavior of hotkeyed list actions
   whose triggers receive `tabindex="-1"`, especially when CSS generates the
   `Ctrl+…` hint with `::after`. Essential actions should remain available via
   visible, named, keyboard-reachable controls regardless of hint exposure.

## Media and visual presentation

8. Test image alternatives and title behavior, native video/audio controls,
   captions, transcripts, and media notices. SmarkForm preserves authored `alt`
   and does not supply captions or transcripts.
9. Review focus indicators, contrast, zoom/reflow, touch targets, and reduced
   motion in representative authored forms and themes. These are application
   styling responsibilities, not guarantees from SmarkForm.

## Suggested test record

Record browser and OS versions, assistive technology/version, exact markup,
keyboard sequence, observed announcement/focus result, and expected result for
each case. Include NVDA with Firefox/Chrome, VoiceOver with Safari, and TalkBack
with Chrome where available; do not infer support for an untested combination.
