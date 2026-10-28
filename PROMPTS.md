# PROMPTS.md

> This file is a Kind of "TODO" list for future features and improvements. But,
> instead of simple task headlines, each task is described in detail as a
> prompt draft for an AI language model.
> 
> This way it works trice as:
> 1. A detailed TODO list for future improvements.
> 2. A brainstorm blackboard to sort, refine and organize ideas.
> 3. A prompt storage where to grow and polish prompt drafts until they are ready
>    to be used.
>
> The best thing is that interdependences among tasks can be easily spotted
> before implementation and tweaks can be made before a single line of code is
> written.



### Private actions

> Status: Draft

Refactor `component.actions` to use a private Symbol so it is no longer
enumerable or directly accessible as a public property.

**Rationale:**

The `actions` object exists as an internal implementation artifact of the
`@action` decorator (`src/types/trigger.type.js`). The decorator needs
somewhere to stash the event-emitting wrapper function — `this.actions[name]`
is convenient — but it was never designed as a user-facing API.

The intended public contract is:

| Need | Mechanism |
|------|-----------|
| User-initiated action with events | HTML trigger (`data-smark='{"action":"..."}'`) |
| Programmatic action without events | `component.reset(data, opts)` (prototype method) |

Documenting `component.actions` creates confusion because there are now **two
ways** to call every action (`component.actions.reset()` vs `component.reset()`)
with subtle behavioural differences (events, focus defaulting, `silent` option
handling). The `actions` wrapper was also removed from the published docs in
PR #xx for this reason.

**Internal consumers that will need updating:**

1. `src/lib/component.js:104` — `me.actions = {}` initialisation.
2. `src/types/trigger.type.js:8` — decorator stores the wrapper.
3. `src/types/trigger.type.js:83` — `getTriggerArgs()` walks parents looking
   for `p.actions[action]`.
4. `src/types/trigger.type.js:114` — `onTriggerClick()` resolves
   `context?.actions[action]`.
5. `src/main.js:57` — `SmarkForm` constructor merges user-provided custom
   actions via `me.actions = { ...me.actions, ...customActions }`.

**Implementation sketch (Symbol approach):**

```javascript
// In component.js or a shared module:
const sym_actions = Symbol("actions");

// Initialisation (component.js):
me[sym_actions] = {};

// Decorator (trigger.type.js):
me[sym_actions][name] = async function (...) { ... };

// Access in trigger resolution (trigger.type.js):
const mtd = context?.[sym_actions][action];
const ctx = parents.find(p => typeof p[sym_actions][action] == "function");

// Merging custom actions (main.js):
me[sym_actions] = {
    ...me[sym_actions],
    ...Object.fromEntries(
        Object.entries(customActions).map(([n, c]) => [n, c.bind(me)])
    ),
};
```

Alternatively, if a public programmatic API for triggering actions with events
is ever needed, provide a focused helper like `component.runAction(name, data,
opts)` rather than exposing the entire map. Do not add this preemptively —
wait for a concrete use case.


### Disabled action

> Status: Draft

I want you to implement a new action called "disable" for the input component types and every other component type that does not inherit from input (form and list).

You also have to implement an internal "disabled" state for every component type which, for input based types, will just rely on the real "disabled" attribute of the targetFieldNode of the component.



### Null action

> Status: Draft

FIXME: Review this and contrast with the "dependent disabilitation" and  "multiforms" features. They may need to be merged or redefined in a more general way...

I want you to implement a new action called "null" for the form component type.

Unlike most actions that usually enhance buttons, the "null" action will enhance a checkbox and will work the following way:

If the checkbox is checked (default), every field in the form gets disabled.

### Batch file download: packing multiple files into an archive

> Status: Brainstorm (deferred to a later iteration — related to the single-file
> `download` action added for the `file` field type)

The single-file `download` action (see `spc/file.md` §Download) handles one
file. Open question raised by the maintainer: **what when a trigger targets
multiple file fields** (e.g. `context: "somelist/*"` inside a list of files, or
a list of objects each containing file fields) — pack them into a ZIP/TAR?

#### Goal

`data-smark='{"action":"download","context":"photos/*"}'` → download ONE archive
bundle of every file currently held by the resolved targets; single-target use
keeps the plain single-file behavior.

#### Design considerations (to refine next iteration)

1. **Resolution semantics.** Triggers today resolve `context` to exactly one
   component. Multi-target already exists for `removeItem` (`target:"*"`).
   Decide: `download` receives a *set* when the resolved path is a wildcard
   (`items/*`), and the number of targets decides single vs. archive behavior
   (1 → single file; >1 → archive; 0 → no-op returning `null`).

2. **What goes in the archive.** Not just the resolved component — the *file*
   descendants. For `of:"file"` lists that is the items themselves; for a list
   of objects it is a tree walk collecting every file-typed field (skip
   non-file fields, mirrors how `export_empties`/`isEmpty` filter). Consider an
   include/exclude pattern option.

3. **Format — and the zero-dependency constraint.** SmarkForm has **no runtime
   dependencies** (dependabot only tracks devDeps). Doctrine:
   - **`SmarkForm.registerPacker(name, factory)`** registration API mirroring
     `registerMask` — core ships single-file `download` only; packing is an
     opt-in plugin. Factories may be `async`; SmarkForm awaits them.
   - Built-in minimal ZIP writer (method `stored`, no compression) is ~100
     lines and dependency-free; **DEFLATE ZIP** and **TAR** are heavier
     (JSZip / `node-tar`-style libs) and belong behind the packer registry.
   - Declarative: `<script type="smark-packer" data-name="zip">` plus a
     `packer` option on the download trigger, mirroring `smark-mask`.

4. **Naming & collisions.** Filenames clash across items (`photo.png` twice).
   Options: per-item subfolder (`photos/0/photo.png`) or dedup suffix.
   Archive name from a `filename`/`archiveName` option, else derived from the
   context path (`photos.zip`).

5. **Robustness.** Async encodes + progress events for large collections;
   cancel/abort; error event per failed read; blob URL lifecycle; empty set →
   no-op; `download` on a single empty file → no-op.

6. **Simpler alternative (nice UX regardless).** Per-item
   `{"action":"download","context":"."}` buttons inside file lists cover the
   common "download this one" case with zero new machinery; the archive action
   is the "download all" convenience.

7. **Pitfall to avoid.** Do not serialize bytes through `TextEncoder`/strings
   (UTF-8 corruption on arbitrary binary) — operate on the internal base64 via
   the existing byte helpers, or on `Blob` parts with `{type}`.

#### Prompt draft (next iteration, refine before use)

> Implement a `downloadAll` / multi-target packing capability for the `file`
> download action: when the resolved download target is a set of multiple
> components, collect all held files (a tree-walk of file descendants, honoring
> an optional pattern), encode them into a single archive via a plugin packer
> ("zip" stored as builtin; external DEFLATE/tar registered through
> `SmarkForm.registerPacker`), dedupe/namespace filenames, and trigger the
> download with the derived archive name. Single-target (`1`) keeps the current
> single-file `download`. Empty/zero-target is a silent no-op. Preserve the
> zero-runtime-dependency invariant.
