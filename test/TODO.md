## Remaining Test Follow-up

The former checklist referenced pre-refactor documentation paths and behaviors
that already have coverage. In particular, the List `count` action is tested in
`test/type_list.tests.js`, Number coercion/export/singleton behavior is covered
in `test/type_number.tests.js`, and Date coercion has a co-located test in
`docs/_component_reference/date.md`.

### List hotkey-trigger tab order

`src/types/list.type.js` assigns `tabindex="-1"` to hotkey-equipped `addItem` /
`removeItem` triggers placed inside list context. The commented test in
`test/type_list.tests.js` does not currently verify this: it only checks the
tabindex when the author already supplied the attribute. Replace it with a
rendered fixture that asserts the generated `tabindex`, confirms ordinary
triggers retain their normal tab order, and verifies authored tabindex values
are preserved.
