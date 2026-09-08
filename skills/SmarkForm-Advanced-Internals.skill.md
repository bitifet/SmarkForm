---
name: smarkform-advanced-internals
description: Optional advanced skill for SmarkForm internals-heavy work — action semantics, list/context edge cases, and security-sensitive patterns.
---

# SmarkForm Advanced Internals — Optional Skill Spec

## Goal

Handle advanced SmarkForm internals safely: complex list semantics, action
method signatures, context/target path edge-cases, data-flattening pitfalls,
and security-sensitive option interactions.

## Scope

Use this optional skill for tasks involving any of the following:

- Nested list/template edge cases (lists inside list items, shared sub-templates)
- Action method signatures and direct programmatic invocation
- Action method argument semantics (data vs options)
- Complex `context` / `target` path resolution (cross-list, parent-relative)
- Mixin/security-option-sensitive implementations
- Data export flattening (`keyStyle`, `arrayStyle`, `exportEmpties`) edge cases

For standard form implementation, load the core skill first:
- `skills/SmarkForm-Form-Builder.skill.md`

## Source Priority

Use the exact source-priority order defined in
`skills/SmarkForm-Form-Builder.skill.md`.  Additionally, for internals-first
tasks, start by reading:

- https://smarkform.bitifet.net/resources/AGENTS/SmarkForm-Usage

## Non-negotiable Internals Rules

### Action Method Signatures

All action methods follow the same pattern:

- **First argument:** the data payload (e.g., data to import, or `null` /
  `undefined` for data-less actions like `export`).  Ignored by actions that
  derive their input from the form state.
- **Second argument:** an optional options object.  When the action is invoked
  through a trigger (e.g., a button click), `options.origin` holds the trigger
  element and other options are populated by `getTriggerArgs()`.

There are no positional arguments beyond `(data, options)`.

To invoke an action programmatically, call the method directly by name on the
component instance:

```js
const data = await form.export();
await form.import({ name: "John", email: "john@example.com" });
await list.addItem();
await list.removeItem(list.children[0]);
```

Each method documents which arguments it accepts in the source or the
type-specific doc pages.  When called via a trigger, the trigger system
merges `data-smark` options and resolves context/target automatically.

### Action Context and Target Resolution

- `context` resolves relative to the **trigger element's** component in the
  SmarkForm tree.
- `target` resolves relative to the **context result**, then walks up/down
  the component tree by name.
- Inside a list item, `context: ".."` refers to the list component itself;
  `context: "../.."` refers to the list's parent.
- When targeting a sibling list from inside a cloned item template, use
  `target: ".."` + the sibling list name (e.g.
  `data-smark='{"action":"addItem","target":"..parentList"}'` is wrong — use
  the correct path documented in SmarkForm Usage).
- Cross-list targets in sortable lists resolve relative to the **source**
  trigger's context, not the drop target.

### List Template Rendering

- `header` renders once before any items.
- `footer` renders once after all items.
- `empty_list` renders when the list has zero items (hidden otherwise).
- `placeholder` renders in empty slots when `max_items` is finite and the
  list is not full.  Placeholders carry no data.
- `separator` renders between consecutive items.
- `last_separator` renders between the second-last and last item (falls back
  to `separator` if not defined).
- Template roles are assigned at registration time (via `data-role` or the
  `role` property in `data-smark`).  Changing them afterwards has no effect.

### Mixin Security Options

- `allowExternalMixins`, `allowLocalMixinScripts`,
  `allowSameOriginMixinScripts`, and `allowCrossOriginMixinScripts` are
  **root-level only** — they cannot be overridden per-component via
  `data-smark`.
- Each option is independent: `allowExternalMixins` controls fetching the
  external template, and the script policy options control script execution
  after a successful fetch.  Setting one does not implicitly permit another.
- Default is `"block"` for all.  Only opt-in when a specific mixin source
  is required and its provenance is verified.

### Data Flattening (`exportEmpties`, `keyStyle`, `arrayStyle`)

- `exportEmpties: true` includes entries for empty lists, empty strings, and
  `null` values in the exported JSON.  Without it, empty slots are omitted
  entirely, which can shift array indices on round-trip import.
- `keyStyle: "dot"` flattens nested keys into dotted paths
  (`"address.city"`) instead of bracket notation (`"address[city]"`).
  Use `"bracket"` (default) for standard form encoding compatibility.
- `arrayStyle: "index"` produces `"items[0]"`, `"items[1]"` keys; `"repeat"`
  (default) produces repeated `"items[]"` keys.  Index style preserves
  position but breaks if items are removed mid-list.

### File Field Internals

- The `file` type stores its interior state as `data` in **base64** always;
  `encoding` (`"base64"`/`"base64url"`/`"hex"`) only selects how bytes are
  written for the object export form and decoded for bare-string imports.  A
  `data:` URL always carries base64 regardless of `encoding`.
- The object form `export()` produces must be what `import()` receives: with
  `encoding:"hex"` the object payload is hex, and handing it base64 would be
  misdecoded as hex.  Acquisition (pick/drop/paste and the list
  `acquire`/`toObjects` helpers) re-encodes to the field `encoding` via
  `readFileToObject(file, {encoding})` before import — keep that threading when
  changing acquisition code.
- `size` is always recomputed from the decoded payload; an imported `size` is
  never trusted.
- On a **real field** the authored input is rewritten to `type="text"` (editable
  file name — a non-empty edited name wins on export) and a hidden native picker
  is attached; `Shift+Space` opens the OS picker (it yields to the `<details>`
  folding convention when that fires first), plain `Space` types normally.
- **Singleton** file fields delegate export/import/download to the inner
  (`children[""]`) field; drop/paste are detected over the whole container,
  except drops originating inside the inner field.
- Inside a **file-capable list** (`of:"file"`), the item singleton's container
  drop is suppressed (`underFileList` check in `file.type.js`) so an OS drop on
  an existing item **appends** a new item rather than replacing that item's
  file; paste stays item-scoped; list-level `fileDrop:false` disables drop-add.
- The `download` action triggers a real browser download from the field's
  current file (empty → no-op returning `null`); it is only meaningful with a
  real user gesture, and works from a trigger via `context` pointing at the
  file field.
- Field-level `{"encoding":"json"}` on `input`/`textarea`/`select` is a legacy
  alias of `{"format":"json"}` (`isJsonFormatted` accepts either) — prefer
  `format`.

## Output Requirement

After delivering advanced-internals code, provide a short "advanced compliance
check" confirming:

- source pages consulted
- internals rules applied
- unresolved ambiguity (if any)

## Distribution Notes

- This file is the canonical advanced skill artifact in-repo.  The YAML front
  matter uses opencode-compatible fields; other tools may need minor format
  adaptation.
- If behavioral rules change, update this file and `ai-agents.md` in the same
  PR.
