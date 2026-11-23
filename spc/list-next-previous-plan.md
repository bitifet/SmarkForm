# List `next` / `previous` Actions and Keyboard-Accessible Examples — Plan

## Scope and decisions

This plan covers the keyboard-accessible `next` and `previous` list actions,
their tests and reference documentation, the Kanban sampletabs, and the other
authored documentation examples that use `moving_depth` for cross-list moves.

The following behavior is settled:

- The actions accept numeric `depth`, defaulting to `0`.
- Non-numeric depth values are not unlimited sentinels; invalid values do not
  make a movement action available.
- At depth `0`, they move the selected item by one position in the same list.
  They are disabled when `sortable` is false, and at the corresponding end of
  the list. There is no wrapping/cycling behavior.
- At positive depth, they move one item to the next eligible destination list
  in rendered/component order and append it there. Repeating the action steps
  the item through further candidate lists.
- A destination is eligible when its structural sibling distance is no greater
  than the action depth, both source and destination permit that distance under
  their `moving_depth` options, and the destination has capacity. The existing
  same-mixin compatibility rule remains part of that distance calculation.
- A positive action depth greater than the source list's `moving_depth` disables
  that trigger; it must not be silently clamped to a smaller depth.
- A cross-list move cannot take its source below `min_items`. The shared transfer
  operation rechecks both source minimum and destination capacity before
  removing the item, so stale trigger state cannot duplicate or lose data.
- If independent transfers race for the destination's last `max_items` slot, a
  transfer that cannot insert restores the source item instead of losing it.
- If destination item import fails after insertion, remove the partial destination
  row and restore the source before propagating the error.
- `focus:false` is respected by the shared move operation.
- Per-item menu removal uses the existing `removeItem` action. SmarkForm hotkeys
  require Ctrl; menu shortcuts should avoid Ctrl+Arrow so they do not collide
  with caret navigation. The examples will use `[` / `]` for cross-list
  previous/next and `,` / `.` for same-list previous/next, with `-` for removal.
- The example menu is an author-side disclosure, not a new library menu
  component. Use a native disclosure button with `aria-expanded` and
  `aria-controls`, ordinary action buttons (not `role="menu"`/`menuitem`),
  Ctrl-hint reveal using `:has([data-hotkey])`, and Escape/outside-pointer
  closing. This avoids promising the full ARIA menu keyboard interaction model
  while keeping the markup and behavior author-controlled.

## Existing branch state to preserve

At plan creation, the `next_and_prev` branch already contains these commits:

- `f2f63d6e test: specify list next/previous actions`
- `7f733795 feat(list): add next/previous move actions`

The working tree also has an uncommitted edit to
`docs/_showcase_examples/showcase.md` that starts the Kanban disclosure-menu
conversion. It will be treated as existing work and completed rather than
discarded. The plan does not rewrite or amend the existing commits.

## Implementation steps and commits

### 0. Commit this plan before further implementation

Commit only this plan file. Do not stage the pre-existing Showcase edit.

### 1. Isolate and correct list navigation actions

Refactor the existing implementation so the action behavior and candidate-list
discovery live in a dedicated list decorator rather than in the sortable drag
decorator or as substantial logic in the list type. Keep `list.type.js`
integration to the decorator application and any unavoidable minimal hooks.
Reuse the existing `move()` operation for actual item transfer and preserve
action lifecycle behavior. Keep disabled-state updates synchronized after
render, list edits, and both drag- and action-driven moves.

Correct the current branch implementation where it differs from the agreed
contract: reject/disable requested depths above the source's `moving_depth`
instead of clamping them; remove the undocumented `cycle` extension; preserve
depth-zero `sortable` gating; honor destination willingness/capacity; and keep
cross-list moves append-only. Add or refine focused Playwright tests for default
depth, depth overflow, source/destination limits, one-candidate-at-a-time
ordering, skipped full/incompatible destinations, append order, end boundaries,
sortable gating, source `min_items`, numeric depth validation, `focus:false`,
concurrent last-slot transfers, import-failure rollback, and refreshed disabled
states.

**Expected files:**

- `src/types/list.decorators/move_actions.deco.js` — new decorator containing
  `next`/`previous`, candidate discovery, movement eligibility, and action
  integration.
- `src/types/list.decorators/move_options.js` — shared numeric/depth parsing;
  ensure it does not clamp an invalidly large requested depth into an enabled
  action. Remove cycle normalization if it is no longer used.
- `src/types/list.decorators/sortable.deco.js` — leave drag-and-drop and the
  existing `move()` primitive here; remove keyboard-candidate navigation and
  action-specific logic from this decorator.
- `src/types/list.decorators/smartdisabling.deco.js` — keep add/remove
  disabling and coordinate `next`/`previous` disabled-state refreshes with the
  movement decorator, without duplicating its eligibility rules.
- `src/types/list.type.js` — apply the new decorator and remove the action
  implementation currently embedded in the list type, retaining only minimal
  integration that cannot live in a decorator.
- `test/type_list_next_previous.tests.js` — expand the existing focused tests
  and remove tests for behavior outside the agreed contract.
- `dist/SmarkForm.esm.js`, `dist/SmarkForm.esm.js.map`,
  `dist/SmarkForm.umd.js`, and `dist/SmarkForm.umd.js.map` — regenerate the
  tracked distribution after source changes.

Commit this step independently from documentation/example changes.

### 2. Document the list action contract

Add the actions and `depth` semantics to the List reference, including
trigger-target selection, automatic disabled conditions, destination
eligibility, one-step movement, append behavior, and the distinction between
`sortable` and `moving_depth`. Correct the existing statement that says
cross-list drag needs `moving_depth` on “at least one” list; the implementation
requires both lists to permit the move.

**Expected file:** `docs/_component_reference/list.md` (API prose only in this
step; the two runnable examples in this file are reserved for their own commits
below).

Commit this documentation step separately.

### 3. Finish the Showcase Kanban example

Complete the existing uncommitted edit in `docs/_showcase_examples/showcase.md`:

- Replace the drag-only handle with a native disclosure control and menu.
- Include Go Next / Go Previous (`depth:1`), Move Up / Move Down (`depth:0`),
  and Remove (`removeItem`), with visible descriptions and conflict-avoiding
  Ctrl hotkeys.
- Remove the standalone per-card remove button and the input-only removal
  restriction so removal remains available from the card menu.
- Add the `.menu-open` and `:has([data-hotkey])` reveal behavior, synchronized
  disclosure state, Escape/outside-pointer closing, and focus behavior.
- Update the sample text/notes and co-located test to cover the menu and
  keyboard movement, destination append, removal, and accessible disclosure
  behavior while retaining the existing confirmation and bulk-clear behavior.

Commit the Showcase Kanban example independently.

### 4. Update the Form Traversing Kanban example

Apply the same accessible per-card action menu and trigger/hotkey semantics to
the duplicated Kanban sampletab in `docs/_guides/form_traversing.md`. Keep its
wildcard clear behavior and removal confirmation intact, and revise its notes
so the keyboard and drag paths are both explained.

**Expected file:** `docs/_guides/form_traversing.md`.

Commit this Kanban copy independently.

### 5. Update the deep school-groups example

In the `deep_school_groups` sampletab in `docs/_component_reference/list.md`,
make list reordering and student cross-list movement available through an
accessible action disclosure in addition to drag. The sortable groups list
gets depth-zero controls; the nested students lists get depth-zero controls and
depth-two cross-list controls. Move student removal into the menu while keeping
the unrelated grade and group controls intact. Extend the co-located test to
verify one-step keyboard cross-list movement and the existing nested-data
preservation.

Commit this example as its own commit, separate from the other List-page
example.

### 6. Update the cross-list departments/employees example

In the `cross_list_drag` sampletab in `docs/_component_reference/list.md`, add
depth-zero controls for sortable departments and depth-zero plus depth-two
controls for employees. Include `removeItem` in each relevant item menu, retain
the add controls, and extend the co-located tests to exercise the keyboard
actions and append behavior as well as the existing programmatic move checks.

Commit this example independently from the deep school-groups example.

### 7. Update agent knowledge, track docs edits, and validate

Update `AGENTS.md` with the new action behavior, implementation/test locations,
and documentation-example conventions learned during the work. Record each
changed documentation page in the gitignored `UPDATED_DOCS.md`, grouped by page.
Regenerate, but do not commit, collector/TOC-generated files. Run focused
Playwright tests, the full project test matrix, and the documentation build as
available. Review the final diff and commit any remaining AGENTS/tracking update
without combining or rewriting the independently committed examples.

**Expected files:** `AGENTS.md` and the gitignored `UPDATED_DOCS.md`; generated
`test/.cache/docs_examples.json`, `docs/_includes/showcase_examples.md`, and
`docs/_includes/chaptertoc/*` are verification outputs only and must not be
committed.

## Documentation examples audit

The authored runnable examples found at plan time that configure
`moving_depth` for cross-list movement are:

| Example | Authored file | Planned handling |
|---|---|---|
| Showcase Kanban (`kanban`) | `docs/_showcase_examples/showcase.md` | Step 3 |
| Form Traversing Kanban (`form_trav_kanban`) | `docs/_guides/form_traversing.md` | Step 4 |
| Deep school groups (`deep_school_groups`) | `docs/_component_reference/list.md` | Step 5 |
| Departments and employees (`cross_list_drag`) | `docs/_component_reference/list.md` | Step 6 |

The generated Showcase include is not an authoring source. Historical/spec
references, standalone regression fixtures, prose-only mentions, and generated
media extracts are not additional runnable documentation examples and will not
be edited as examples.

## Commit and publication policy

Keep the action implementation, API documentation, each Kanban copy, and each
other moving-depth example in their own commits as described above. Do not push;
leave publication to the user.

## Follow-up: dual-purpose menu/drag handle

After touch testing, the Kanban disclosure button is also the visible drag
affordance. The sortable drag guard must therefore allow an interactive element
when that exact element is explicitly marked as a handle, while continuing to
reject interactive descendants inside a handle. SmarkForm labels remain the
default handles; `data-smark-role="drag-handle"` marks another exact handle
(for example, the native menu button) without turning it into a field label.

**Additional files:** `src/types/list.decorators/sortable.deco.js` (handle
recognition/guard), `test/type_list.tests.js` (interactive handle regression),
`docs/_component_reference/list.md` (marker contract), `AGENTS.md`, and the
four authored movement examples in the documentation. The Kanban touch test
must start from the marked control and exercise the touch polyfill. Keep the
example edits in the same independently scoped commits required above.
Handle discovery and cursor styling also include the item root itself, not only
marked descendants; tests distinguish the exact interactive handle from
interactive controls nested inside a handle wrapper.
