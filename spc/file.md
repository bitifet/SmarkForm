# Specification: `file` field type

> **Status:** Draft
> **Target:** SmarkForm `file` field type (core component type)
> **Related:** future `image`, `audio`, `video`, `drawing` types (deferred)
> The `file` field is the foundation for all media types since their data is,
> at its core, a file.

---

## 1. Overview & goals

SmarkForm always imports/exports data as JSON. A `<input type="file">` provides
a `File` object (name + type + size + lastModified + contents). Because `File`
contents cannot be serialized as JSON directly, the `file` field:

- **Exports** a file as a self-describing **data-URL string** by default
  (metadata + contents in one flat string) — or, with `{"encoding":"json"}`, as
  a structured object holding the metadata **plus its contents** as a payload.

- **Imports** either representation back — or, being "as inclusive as
  possible", also accepts *partial* objects or a *bare string*.
  Each import form is normalized into a complete, valid file object on export.

The field's UI is **not** a bare native file input. Following SmarkForm's
pattern for `form`/`list` types, the `file` type binds to a **custom container**
and renders its own drop-zone style markup, while internally owning a hidden
native `<input type="file">` only as the file-picker trigger.

### Goals

1. Lossless round-trip: `export()` of an imported value returns an equivalent
   file object.
2. Inclusive import: accept object / partial object / bare string.
3. Configurable representation (`encoding`: atomic vs object) and payload
   encoding (`dataEncoding`) with sane defaults and auto-detection.
4. Robust acquisition of files: click-to-browse, drag & drop, paste.
5. Never relies on programmatically populating a native file input's `value`
   (browser security forbids it).

---

## 2. The native `File` object (reference)

A `File` (extends `Blob`) — as obtained from `input.files[0]`, a `drop` event,
or `paste` — exposes:

| Property / Method | Type | Notes |
|---|---|---|
| `name` | `string` | Filename, including extension |
| `type` | `string` | MIME type (e.g. `"image/png"`); `""` if unknown |
| `size` | `number` | Size in bytes (read-only) |
| `lastModified` | `number` | Last-modified time, epoch milliseconds |
| `webkitRelativePath` | `string` | Only with `webkitdirectory` uploads |
| `arrayBuffer()` | method | Resolves to the file's `ArrayBuffer` |
| `text()` | method | Decoded text; rejects for binary content |
| `slice(start, end)` | method | Returns a sub-`Blob` |
| `stream()` | method | Returns a `ReadableStream` |

### Exported metadata subset (decision)

The exported structure includes the four core properties:

- `name` (string)
- `type` (string, MIME)
- `size` (number)
- `lastModified` (number)

`webkitRelativePath` is **omitted** — it is only meaningful for directory
uploads and is not part of the standard file contract.

> `size` is always **recomputed** from the payload on export, so a hand-written
> import object with a wrong `size` is normalized to the true byte length.

---

## 3. UI model: custom container + hidden input

The `file` type binds to a container element (`data-smark='{"type":"file", ...}'`)
and renders its own markup (a titled drop zone with "browse" affordance). A
hidden native `<input type="file">` is created internally **only** to trigger
the OS file picker.

### Why a hidden input is needed (and when it is not)

| Acquisition path | Requires native input? |
|---|---|
| Click to browse | Yes — `input.click()` opens the picker (within a user gesture) |
| Drag & drop from OS file manager | **No** — `drop.dataTransfer.files` provides `File[]` directly |
| Paste from clipboard | **No** — `paste.clipboardData.files` provides `File[]` directly |

So the native input is strictly a *pick trigger*; the actual `File` object is
captured from whatever source produced it and stored in the component's
**internal state**.

### Caveats

- Open the picker via `input.click()` **synchronously** inside the click
  handler (transient activation required).
- Style the hidden input as `position:absolute; width:0; height:0; opacity:0`
  — not `display:none` — for robust picker-opening across browsers.
- When the user picks a file through the dialog, consume `input.files[0]` then
  **reset** the input's value (`input.value = ""`) so re-selecting the same file
  re-fires `change`.

### The "can't populate the native input" problem — resolved

A native file input cannot have its `value` set, and assigning `files` is
fragile. **We never rely on it.** The field's value lives entirely in the
component's internal state; the native input is transient. Import does not need
to "put" the file into the input — it places the normalized object into state,
and the custom UI displays name/size and a "value set (imported)" indicator.

---

## 4. Internal state model

The component stores the current value as a **normalized file object**:

```javascript
{
  name: "photo.png",
  type: "image/png",
  size: 123456,
  lastModified: 1690000000000,
  data: "iVBORw0KGgo...==" // payload; byte-encoding per `dataEncoding` (§7-8)
}
```

- **Empty state** = `null` (no file).
- `defaultValue` and `emptyValue` follow the input-type conventions:
  `defaultValue = null`, `emptyValue = null` (so `clear` empties to `null`).

---

## 5. Export

`export()` returns the representation configured by the field's `encoding`
option (default `"dataURL"`):

**Default — atomic data URL string** (single, flat, JSON-serializable):

```json
"data:image/png;name=photo.png;size=123456;lastModified=1690000000000;base64,iVBORw0KGgo..."
```

Self-describing: the MIME type lives in the `data:` header, and the metadata
parameters keep the export **lossless** (`name` / `size` / `lastModified` are
URL-encoded values).

**With `{"encoding":"json"}` — complete object:**

```json
{
  "name": "photo.png",
  "type": "image/png",
  "size": 123456,
  "lastModified": 1690000000000,
  "data": "iVBORw0KGgo..."
}
```

- If empty, returns `null`.
- `size` is **always recomputed** from the decoded payload (integer byte
  length), never trusted from stored metadata.
- The byte payload is encoded according to the field's `dataEncoding` option
  (default `base64`, see §8).
- Both representations are flat and JSON-serializable (no `Blob`/`File` leaks).

---

## 6. Import

Being "as inclusive as possible", import accepts **both representations**
regardless of the field's `encoding` setting (the option only chooses the
*export* shape):

### 6.1 Full object

```json
{
  "name": "photo.png",
  "type": "image/png",
  "size": 123456,
  "lastModified": 1690000000000,
  "data": "iVBORw0KGgo..."
}
```

Normalized into internal state. `size` is recomputed on export regardless.

### 6.2 Partial object

Any subset of fields is accepted; missing fields are auto-completed:

| Present | Completion |
|---|---|
| `data` only | `name`, `type`, `lastModified`, `size` filled from best-effort encoding detection (see below); a default placeholder name may be used |
| `data` + `name` | `type`, `lastModified`, `size` completed |
| `data` + `type` | `name`, `lastModified`, `size` completed |
| no `data` | treated as empty (`null`) — a file with no content is not a file |

**Auto-completion rules:**

- `name`: use `name` if given; else derive from MIME type if possible
  (e.g. `image/png` → `image.png`); else `"file"`.
- `type`: use `type` if given.
- `lastModified`: default `Date.now()` (or `0`) when absent.
- `size`: derived from payload; always recomputed.

### 6.3 Bare string

```json
"data:image/png;name=photo.png;size=123456;lastModified=1690000000000;base64,IVBORw0KGgo..."
```

or

```json
"IVBORw0KGgo..."
```

Treated as the file payload. Auto-detection:

- String starts with `data:` → **data URL**: MIME + metadata params + payload
  are parsed out.
- String parses as JSON and is an **object** → handled per §6.1/6.2.
- Otherwise → **raw payload bytes**, decoded with the configured `dataEncoding`
  (default `base64`); the remaining metadata is auto-completed per §6.2.

### 6.4 `import(undefined)` / reset

`import(undefined)` clears to the default (`null`) per SmarkForm conventions.

---

## 7. Representation & payload encoding (two axes)

File import/export has two independent, orthogonal axes:

| Axis | Option | Values (default first) | What it selects |
|---|---|---|---|
| **Representation** (container) | `encoding` | `"dataURL"` \| `"json"` | Atomic string vs structured object |
| **Byte encoding** (payload) | `dataEncoding` | `"base64"` \| `"base64url"` \| `"hex"` | How `data` bytes are written |

**Why `encoding`?** This mirrors the existing field-level `encoding`
option on the `input` type exactly: *input* defaults to a raw string and opts
into a structured value with `{"encoding":"json"}`; *file* defaults to an
atomic data-URL string and opts into a structured object with
`{"encoding":"json"}`. Same muscle memory, same docs section, symmetric
behaviour — and a *list of files* exports a list of strings, just like a list
of inputs exports a list of strings.

**Byte-encoding comparison** (the `dataEncoding` axis):

| Encoding | Size overhead | Notes |
|---|---|---|
| `base64` | +33% | Universal support (`FileReader.readAsDataURL`, `btoa`, IMask-friendly); the safest default |
| `base64url` | +33% | URL-safe variant; same size, `+`/`/`→`-`/`_` |
| `hex` | +100% | Only worthwhile for tiny payloads or where hex is the convention |

- A `data:` URL always carries `base64` bytes (per spec), regardless of
  `dataEncoding`.
- **String-import auto-detection:**
  - `data:` prefix → data URL (MIME + params + payload parsed out).
  - JSON-parsable object → object form (§6.1/6.2).
  - Otherwise → raw payload under `dataEncoding` (default `base64`).
  - Detection is **best-effort**; a configured option always takes precedence
    on import when ambiguous.

> **Open consideration:** `encoding` mirrors `input`'s naming but not its value
> set (`"dataURL"` vs `"json"`). If the cleaner crosstype name `format`
> (`"atomic"`/`"object"`) is preferred over inventing type-specific `encoding`
> values, it can be renamed before implementation — the semantics stay the same.

---

## 8. Options (in `data-smark`)

| Option | Type | Default | Purpose |
|---|---|---|---|---|
| `type` | string | — | `"file"` |
| `name` | string | — | Field name (JSON key) |
| `encoding` | `"dataURL"` \| `"json"` | `"dataURL"` | Export representation: atomic data-URL string vs complete object (§7). Import accepts both regardless |
| `dataEncoding` | `"base64"` \| `"base64url"` \| `"hex"` | `"base64"` | Byte encoding of the payload (`data`) for the object form, and of bare-string payload imports |
| `accept` | string | `""` | Native input `accept` filter (e.g. `"image/*"`), also used to filter drops/pastes |
| `smark_file_open` | boolean | `true` | Enable click-to-browse |
| `smark_file_drop` | boolean | `true` | Enable drag & drop |
| `smark_file_paste` | boolean | `true` | Enable paste |
| `smark_file_require_gesture` | boolean | `true` | Only accept files acquired from real user gestures (drop/paste/pick). When `false`, `import()` from JS may proceed without user interaction (see §11) |

There is **no `multiple` option on the `file` type itself**: a standalone file
field always represents exactly one file (its register models a single value).
Multiple files are handled by the **list type** ([§10](#10-multiple-files--the-additem-hook)).

---

## 9. Events & lifecycle

- **`change`** — whenever a file is set or replaced through pick/drop/paste
  (fires once, `bubbles: true`, carries no native payload).
- **Multi-file acquisition (list context)** — the list's `addItem` fires its
  normal add cycle once **per** acquired file (§10); on batch overflow the
  list emits `LIST_MAX_ITEMS_REACHED` as usual.
- **`BeforeAction_*` / `AfterAction_*`** — SmarkForm action cycle applies to
  `export`/`import`/`clear`/`reset` as usual.

### UI hooks

The rendered custom markup receives the file object. A typical default UI
(customizable by the author's own markup inside the container):

- empty state: a dashed drop zone with a "Browse…" button and a drop hint;
- filled state: file name + size + a "Replace" / "Remove" affordance.

---

## 10. Multiple files & the `addItem` hook

A standalone `file` field is **always single** (one file or `null`). To handle
several files, wrap it in a **list** whose item template is the file type:

```html
<ul data-smark='{"type":"list","name":"photos","of":"file","accept":"image/*"}'>
  <li><div data-smark='{"type":"file","name":"photo"}'>…</div></li>
</ul>
```

The list's `addItem` (action or API) gains an optional `multiple` option;
when the item template resolves to a **file-capable** type, `multiple`
**defaults to `true`** — the picker accepts several files at once. Set
`multiple: false` to force single-file adds.

### Static `acquire()` — batch acquisition before item creation

To keep the picker on-screen for exactly one gesture, the list calls a new
optional static method on the item's effective component type class **before**
creating any item (`_data` — currently unused in `addItem` — finally gets
wired for per-file initialization):

```javascript
// Proposed shape, on file.type.js
static async acquire({ accept, multiple, currentCount, maxItems }) {
  // Returns Promise<Array<normalizedFileObject>>, or [] when cancelled.
  // Uses one hidden multi-file input (cached per list/document).
}
```

The list's `addItem`:

1. Resolves the item template's effective component type.
2. If it implements `acquire` and `multiple !== false` → call it with
   `currentCount`/`maxItems` to cap the selection *inside* the dialog where
   possible, then enforce the cap *after* acquisition.
3. For each returned file object → `addItem(data, { position, target,
   autoscroll })`, importing the file into its freshly created item.
4. `failback` semantics (existing list options) apply per add as usual.

### `max_items` enforcement

Overflow is handled **before** any item is created so a cancelled dialog
leaves the list untouched:

- `slots = max_items - currentCount`; if `acquire()` returns more than `slots`
  files:
  - Default: synchronous `window.confirm()` — "Only N of M files fit; add the
    first N?" → **OK** = add first `N`, **Cancel** = add none.
  - Future hook: a developer-supplied confirmation/callback (same pattern as
    the `confirmRemove` precedent) instead of `window.confirm`.
- Native inputs offer **no way to cap the selectable count** — only `accept`;
  the cap is always enforced post-selection.

### Drag & drop: file drops vs list reordering

OS file drops never collide with SmarkForm's internal drag handling, because
`sortable.deco.js` gates its reorder/move logic on the internal `dragSource`
(singleton set only by locked-on-internal `dragstart`, nulled in the drop
handler). External drops arrive with `dragSource === null` **and**
`dataTransfer.files.length > 0` — an unambiguous, intrinsic discriminator:

```
drop:
  if internal drag in progress (dragSource) ─────────► existing sort/move path
  else if dataTransfer.files.length > 0 ──────────────► file-add path (this spec)
  else ────────────────────────────────────────────────► default (ignore)
```

- Drop target: dropping on the list container or on an existing item both
  **append** the new file item(s) at the end (position resolution identical to
  the existing non-item-drop "always append" branch); dropping *between* items
  is out of scope for v1.
- `dragover` already calls `preventDefault()` for both paths — required for
  OS file drops to be accepted.
- Dragging an existing **file item** (by its container root) still reorders —
  the picker/drop-zone surface stays out of the `INTERACTIVE_FIELDS_SELECTOR`
  dragstart guard's way.

Auto-wired by default (no config required when the list is file-capable), with
a list-level **`fileDrop`** option (default `true`) as the escape hatch to
route external file drops back to the browser default.

---

## 11. Security & user-gesture considerations

- Reading a file's bytes requires either a user gesture or a stored handle
  (drops, pastes, and picker selections are all user-gesture sources).
- `import()` from script is **not** a gesture. Because we normalize the payload
  into a plain JSON object (not into a live `File`), it can be imported without
  a gesture — the bytes are already strings in memory. There is no FileSystem
  read involved. This is the shipped behavior for the base object model.
- The `smark_file_require_gesture` option (default `true`) guards the **native
  picker** path only (open/close), and is irrelevant to JSON import.

---

## 12. Open questions / future decisions

- **`multiple` — RESOLVED** (see §10): list-level `addItem.multiple` + static
  `acquire()`; no `multiple` option on the `file` type itself.
- Directory upload (`webkitdirectory`): out of scope initially.
- Whether the custom UI markup is author-provided (decorated children à la
  `form`) or auto-generated by the type. **Decision:** author-provided children
  inside the container, styled by CSS, following the `list`/`form` pattern.
- `image`/`audio`/`video` types will extend this base: they display the media
  (preview/player) and allow replacing in place. `drawing` is more speculative
  (canvas + ink capture); deferred.
- Future developer hook replacing `window.confirm()` for `max_items` overflow
  (announced; pick a confirm/custom-callback API when implementing).
- Naming check before implementation: `encoding:"dataURL"` mirrors `input`'s
  option but with type-specific values; if crosstype `format`
  (`"atomic"`/`"object"`) reads better, rename then (see §7).

---

## 13. Relation to PROMPTS.md

This spec should eventually be mirrored into `PROMPTS.md` as a prompt draft so
future implementation tasks reference it. Keeping `spc/` as the working
specification directory until the design stabilizes.