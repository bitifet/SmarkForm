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
3. Configurable representation (`format`: raw vs json) and payload encoding
   (`encoding`: base64/base64url/hex) with sane defaults and auto-detection.
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

## 3. UI model: a real, native, focusable field

The `file` type binds to an **actual `<input>` element** written by the author
(`type="file"`, `type="text"` or unspecified) — `me.targetNode === the input` —
and SmarkForm machinery (focus, tab order, Enter navigation, labels,
`required`, action hooks) works on it **for free**, exactly like any other
field type.

The field is **tuned in place** to the bare-minimum UX:

- **The authored input is repurposed as the visible value field.** Its native
  `type` is rewritten to `text` (same approach the mask system already uses:
  input.type.js rewrites non-`text` inputs before applying a mask). It shows
  the file **name** and holds keyboard focus. Its text is **editable**: the
  user can manually tweak the file name (see §4 — the edited `name` is what
  exports).
- A **hidden native `<input type="file">` is created internally** as the **only
  picker trigger**. It is never populated; it is transient and is reset
  (`input.value = ""`) after every pick so re-selecting the same file re-fires
  `change`. The `accept` filter from options is applied here.
- Nothing else in the markup is touched (see *Singleton pattern* below).

### Keyboard contract (consistent with the rest of SmarkForm)

Because the field is a real native input, the shared `input`-type behaviors
apply unchanged:

| Key | Behavior |
|---|---|
| `Tab` | Natural tab order (the field is a real input) |
| `Enter` | Navigate to the next field (`Shift+Enter` → previous) — inherited from `input.type.js` |
| `Space` | Type a literal space normally (the name field stays fully editable) |
| `Shift+Space` | **Open the file picker** — new keydown hook (à la `color.type.js`'s Delete hook), `preventDefault()` to stop the space, then soft-click the hidden picker **synchronously** (transient activation) |

This mirrors the existing `Shift+Space` / plain-`Space` convention already used
for `<details>` folding: the **modified** key carries the special action, the
plain key keeps its text-editing meaning. Both handlers share the same rule,
so a file field nested inside a `<details>` behaves consistently — the hook
honours `ev.defaultPrevented`, letting the existing folding logic win when it
fires first.

### Acquisition paths

| Path | Mechanism | Needs the picker input? |
|---|---|---|
| Click / `Shift+Space` | `picker.click()` (synchronous, in-gesture) | Yes |
| Drag & drop from OS | `drop.dataTransfer.files` — field, or whole container in singleton | **No** |
| Paste | `paste.clipboardData.files` | **No** |

In every case the resulting `File` goes **straight into internal state**; the
picker input itself never holds the value.

### Singleton pattern

When the type resolves to a **singleton** (the `data-smark` element is a
container, e.g. a list item wrapper `{ "type": "file" }` around the inner
field):

- The **same tuning/replacement is applied to the singleton's provided (inner)
  field**; the **rest of the container's markup is respected untouched** (only
  the inner field's `type` is rewritten, and the hidden picker is attached to
  the container).
- **Drop and paste are detected over the whole singleton container** — dropping
  anywhere inside it (not just on the field) acquires the file.
- `export`/`import`/navigation delegate through the singleton to the inner
  field, mirroring `color`/`date`/`input` singleton handling
  (`me.isSingleton → children[""]`).

### The "can't populate the native input" problem — resolved

A native file input cannot have its `value` set, and assigning `files` is
fragile. **We never rely on it.** The value lives entirely in the component's
internal state; the visible field merely *displays* the file name (and its text
is the editable `name` metadata). Import places the normalized object into
state; for an imported file the visible field shows the name plus a
"value set (imported)" affordance.

---

## 4. Internal state model

The component stores the current value as a **normalized file object**:

```javascript
{
  name: "photo.png",
  type: "image/png",
  size: 123456,
  lastModified: 1690000000000,
  data: "iVBORw0KGgo...==" // payload; byte-encoding per `encoding` (§7-8)
}
```

- **Empty state** = `null` (no file).
- `defaultValue` and `emptyValue` follow the input-type conventions:
  `defaultValue = null`, `emptyValue = null` (so `clear` empties to `null`).

---

## 5. Export

`export()` returns the representation configured by the field's `format`
option (default `"raw"`):

**Default — raw: metadata-carrying data-URL string** (single, flat,
JSON-serializable):

```json
"data:image/png;name=photo.png;size=123456;lastModified=1690000000000;base64,iVBORw0KGgo..."
```

Self-describing: the MIME type lives in the `data:` header, and the metadata
parameters keep the export **lossless** (`name` / `size` / `lastModified` are
URL-encoded values).

**With `{"format":"json"}` — complete object:**

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
- The byte payload is encoded according to the field's `encoding` option
  (default `base64`, see §8).
- Both representations are flat and JSON-serializable (no `Blob`/`File` leaks).

---

## 6. Import

Being "as inclusive as possible", import accepts **both representations**
regardless of the field's `format` setting (the option only chooses the
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
- Otherwise → **raw payload bytes**, decoded with the configured `encoding`
  (default `base64`); the remaining metadata is auto-completed per §6.2.

### 6.4 `import(undefined)` / reset

`import(undefined)` clears to the default (`null`) per SmarkForm conventions.

---

## 7. Representation & payload encoding (two axes)

File import/export has two independent, orthogonal axes:

| Axis | Option | Values (default first) | What it selects |
|---|---|---|---|
| **Representation** (shape) | `format` | `"raw"` \| `"json"` | Data-URL string vs structured object |
| **Byte encoding** (payload) | `encoding` | `"base64"` \| `"base64url"` \| `"hex"` | How the `data` bytes are written |

**Why `format` and `raw`?** `format` names the *representation shape*; `raw`
vs `json` is the same pairing the `input` type already documents —
`{"encoding":"json"}` turns a raw-string field into a structured-value field.
Croewise, the file field ships `"raw"` (a self-describing data-URL string) as
its default and opts into the `"json"` object. A *list of files* exports a list
of strings, just like a list of inputs exports a list of strings.

> **Cross-type consistency (input/textarea/select):** the existing
> `encoding:"json"` option means *exactly* "structured instead of raw". For one
> shared vocabulary, migrate these types to `format:"json"` with
> `encoding:"json"` kept as a silent alias for one release. File keeps `encoding`
> for its natural job — byte encoding.

**Byte-encoding comparison** (the `encoding` axis):

| Encoding | Size overhead | Notes |
|---|---|---|
| `base64` | +33% | Universal support (`FileReader.readAsDataURL`, `btoa`, IMask-friendly); the safest default |
| `base64url` | +33% | URL-safe variant; same size, `+`/`/`→`-`/`_` |
| `hex` | +100% | Only worthwhile for tiny payloads or where hex is the convention |

- A `data:` URL always carries `base64` bytes (per spec), regardless of
  `encoding`.
- **String-import auto-detection:**
  - `data:` prefix → data URL (MIME + params + payload parsed out).
  - JSON-parsable object → object form (§6.1/6.2).
  - Otherwise → raw payload under `encoding` (default `base64`).
  - Detection is **best-effort**; a configured option always takes precedence
    on import when ambiguous.

---

## 8. Options (in `data-smark`)

| Option | Type | Default | Purpose |
|---|---|---|---|---|
| `type` | string | — | `"file"` |
| `name` | string | — | Field name (JSON key) |
| `format` | `"raw"` \| `"json"` | `"raw"` | Export representation: raw data-URL string vs complete object (§7). Import accepts both regardless |
| `encoding` | `"base64"` \| `"base64url"` \| `"hex"` | `"base64"` | Byte encoding of the payload (`data`) for the object form, and of bare-string payload imports |
| `accept` | string | `""` | Native input `accept` filter (e.g. `"image/*"`), also used to filter drops/pastes |
| `smark_file_open` | boolean | `true` | Enable click-to-browse |
| `smark_file_drop` | boolean | `true` | Enable drag & drop |
| `smark_file_paste` | boolean | `true` | Enable paste |

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
  the visible field is an `input`, so it is excluded from the
  `INTERACTIVE_FIELDS_SELECTOR` dragstart guard (drag-initiation from the
  field itself is disabled, exactly like any other text-like field).

Auto-wired by default (no config required when the list is file-capable), with
a list-level **`fileDrop`** option (default `true`) as the escape hatch to
route external file drops back to the browser default.

---

## 11. Security & user-gesture considerations

- **JS `import()` never needs a user gesture.** The payload lands in internal
  state as a plain JSON object — bytes are already strings in memory, no
  FileSystem read is involved. There is nothing to "guard": a script may import
  a file value exactly like any other field value.
- **Opening the OS picker always requires a real user gesture** (transient
  activation). This is browser-imposed and **cannot be lifted by any option** —
  a script-level `picker.click()` outside a gesture simply does nothing.
- Therefore **no `require_gesture`-style option exists** (an earlier draft's
  `smark_file_require_gesture` was removed as vestigial). The only requirement
  is to soft-click the hidden picker **synchronously inside** the triggering
  gesture handler (click or `Shift+Space` keydown — confirmed sufficient for
  `.click()`).
- **Drop and paste are intrinsic gestures** — `dataTransfer.files` /
  `clipboardData.files` need no extra permission.

---

## 12. Open questions / future decisions

- **`multiple` — RESOLVED** (see §10): list-level `addItem.multiple` + static
  `acquire()`; no `multiple` option on the `file` type itself.
- **`format` naming — RESOLVED** (§7): `format: "raw" | "json"` adopted for the
  file type; `encoding` stays for byte encoding. Open follow-up: migrate
  `input`/`textarea`/`select`'s `encoding:"json"` → `format:"json"` with an
  internal alias for a release (cross-type vocabulary consistency).
- **Space keys — RESOLVED** (§3): plain `Space` types normally; `Shift+Space`
  opens the picker, mirroring the `<details>` folding convention. No further
  keys reserved.
- Directory upload (`webkitdirectory`): out of scope initially.
- `image`/`audio`/`video` types will extend this base: they display the media
  (preview/player) and allow replacing in place. `drawing` is more speculative
  (canvas + ink capture); deferred.
- Future developer hook replacing `window.confirm()` for `max_items` overflow
  (announced; pick a confirm/custom-callback API when implementing).

---

## 13. Relation to PROMPTS.md

This spec should eventually be mirrored into `PROMPTS.md` as a prompt draft so
future implementation tasks reference it. Keeping `spc/` as the working
specification directory until the design stabilizes.