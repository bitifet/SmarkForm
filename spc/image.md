# Specification: `image` field type

> **Status:** Draft
> **Target:** SmarkForm `image` field type (core component type)
> **Related:** `file` (`spc/file.md`) — the `image` type **extends** the `file`
> type, inheriting its value contract, acquisition machinery, list integration
> and download action, adding image-specific display, validation and interaction.

---

## 1. Overview & goals

The `image` field type turns an `<img>` element into an image-upload field. It
inherits the entire `file` contract (spec `spc/file.md`) — same normalized
interior state, same inclusive import, same `format`/`encoding` axes, same
picker/drop/paste acquisition, same singleton pattern, same `download` action,
same list integration — and specializes it for images:

- **Display**: the loaded image is shown in place via `src` (built from the
  embedded value). When empty (`null`), a **placeholder image** is shown
  instead (a generated black-and-white chessboard by default, overridable with
  the `placeholder` option).
- **Validation**: on interactive acquisition, bytes must actually **decode as
  an image** — not just match an `image/*` MIME filter — and may optionally be
  resized and/or re-encoded to a target format (`image_resize` /
  `image_maxSize` / `image_format`), with failure behaviour governed by the
  `image_enforce` mode (§4).
- **Interaction**: click, `Space` / `Shift+Space` open the OS picker;
  `Delete`/`Backspace` clear; drag & drop and paste replace — mirroring and
  extending the `file` keyboard contract.
- **Value semantics unchanged**: the image is a *field value* — SmarkForm never
  modifies the stored bytes or metadata. Only the *presentation* (`src`) is
  managed; authored presentation attributes (`width`, `height`, `sizes`,
  `class`, `alt`, …) are preserved untouched.

### Goals

1. **Full `file` parity** — the `image` value IS a file value: same
   self-describing data-URL string / `json` object shapes, lossless round-trip,
   inclusive import.
2. **In-place display** — the authored `<img>` shows the current value (or the
   placeholder) with zero author JS.
3. **Safe acquisition** — decoded-image validation on pick/drop/paste.
4. **Keyboard-complete** — upload and clear without a mouse.
5. **Composition** — template pattern, singleton actions, and lists of images
   (galleries) work exactly like `file`.

---

## 2. Markup & binding model

### 2.1 The native field is an `<img>`

The `image` type binds to an **authored `<img>` element**:

```html
<img data-smark='{"type":"image","name":"photo"}'
     width="640" height="400" alt="Profile photo">
```

- `me.targetNode === me.targetFieldNode === <img>`.
- The `<img>` is the **display node** for the value (`src` is managed by the
  field) and the **focus anchor** for keyboard interaction (the field sets
  `tabindex="0"` unless the author supplied one).
- An `<img>` is **not** a native form field: it has no `.value`, no text
  editing, no `type` attribute. The value lives entirely in the component's
  internal state (exactly like `file`); the element only *displays* it.

> **Type inference IS extended.** `inferType()` (component.js §`inferType`)
> maps an authored `<img>` carrying `data-smark` — even a **bare** `data-smark`
> with no options — to the `image` type (`case "img": return "image"`).
> `data-smark` presence alone marks a SmarkForm field, and an `<img>` has no
> text value, no `type` attribute and no name/value pair, so no other type fits
> (`form`, the current default for a bare `data-smark` on an `<img>`, is
> meaningless there). The same inference applies inside list item templates, so
> a template `<img data-smark>` item yields an `of:"image"` list without
> declaring the type explicitly. Authors may still spell out
> `type: "image"` — it is redundant, not mandatory.

### 2.2 `isSingleton` detection is overridden

`input.render()` decides real-field vs singleton by tag name
(`INPUT`/`SELECT`/`TEXTAREA` → real field). The `image` type must override this:

| targetNode tag | Mode |
|---|---|
| `IMG` | **Real field.** Display node + picker + keyboard contract on the `<img>` itself. No inner children are expected. |
| anything else (e.g. `DIV`, `FIGURE`, `PICTURE`) | **Singleton container.** Exactly **one** inner `<img>` field (+ optional triggers). All `file` singleton behavior applies. |

### 2.3 Singleton pattern (wrappers, incl. `<picture>`)

Any container element can wrap the `<img>` and gain the singleton behaviors
(from `file` §3): whole-container drop/paste detection, action triggers inside
the wrapper, delegation of export/import/navigation to the inner field.

```html
<figure data-smark='{"type":"image","name":"photo"}'>
  <img data-smark='{"type":"image"}'
       width="1600" height="900" alt="Featured image">
  <figcaption>
    <button data-smark='{"action":"download","context":"/photo"}'>Download</button>
  </figcaption>
</figure>
```

- `<picture>`, `<figure>` and `<div>` are all valid wrappers — the singleton
  rule ("exactly one inner field, others must be triggers") is tag-agnostic.
- In a `<figure>` wrapper, a `<figcaption contenteditable>` may serve as the
  **editable visible name** (§6.1) — it is neither an inner field nor a trigger,
  only the lone editable text node the field re-hearses.
- `<picture>`/`<source>`/`srcset` **responsive semantics are out of scope** for
  the *value* (one file = one value). A `<picture>` wrapper is supported purely
  as a generic container; multiple candidate `<source>`s are not managed (the
  field only sets the inner `<img>`'s `src`).

### 2.4 Error conditions

- `IMAGE_MISSING_IMG`: singleton container has no inner `<img>`-type field (or
  zero inner fields) → `renderError`, mirroring `NOT_A_SINGLETON`.
- `SINGLETON_TYPE_MISMATCH`: reused as-is — singleton `type` must match the
  inner field's `type`.
- `<input type="image">` is **never inferred or accepted**: it is an HTML image
  *submit button*, not a file/image field (it has none of the `file` value
  contract). `inferType()` leaves it as `"input"`, and an *explicit*
  `{"type":"image"}` on an `<input>` must raise `IMAGE_TYPE_ON_INPUT` (a
  `renderError`) rather than silently produce a text-like field. Documented as
  invalid markup.

---

## 3. UI model

### 3.1 Display: value → `src`

The field builds the display URL directly from internal state. Because the
interior always stores `data` as **base64** (file spec §7), the src is a plain
data URL — no object URL lifecycle:

```
src = "data:" + type + ";base64," + data
```

- **Value set** → `img.src = <built data URL>`.
- **Value `null`** → `img.src = <placeholder>` (see §3.2).
- `img.onerror` defensive hook: if the current `src` fails to decode in the
  browser, fall back to the placeholder (UI stays coherent) but **keep the
  state untouched** — export remains faithful (an imported value that a browser
  cannot render is still exported as-is). Emit `console.warn` once.

### 3.2 Placeholder (empty state)

When there is no value, the field displays a **placeholder image**:

- **Default**: a generated black-and-white chessboard, produced as an inline
  SVG data URL (deterministic, lazily built once and cached at module level —
  no network fetch, no external asset, works offline):

  ```javascript
  const CHESSBOARD = (() => {
      const sq = 8, size = 64, cells = [];
      for (let y = 0; y < size; y += sq) {
          for (let x = 0; x < size; x += sq) {
              if (((x + y) / sq) % 2) {
                  cells.push(`<rect x="${x}" y="${y}" width="${sq}" height="${sq}" fill="#000"/>`);
              };
          };
      };
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">`
          + `<rect width="${size}" height="${size}" fill="#fff"/>` + cells.join("") + "</svg>";
      return "data:image/svg+xml;base64," + btoa(svg);
  })();
  ```

- **`placeholder` option**: the author may override with any URL or data URL
  string, or `false` to leave `src` empty (no placeholder).
- Author markup presentation attributes (`width`, `height`, `sizes`, `alt`,
  `class`, `style`, `loading`, `decoding`, …) are **preserved**; the field only
  swaps `src`.

### 3.3 Picker & acquisition

Identical mechanics to `file` (file spec §3): a hidden transient
`<input type="file" accept="…">` is the sole picker trigger; it is never
populated and is reset after every pick. Drop and paste feed bytes straight into
state.

- **`accept` default is `"image/*"`** (author-overridable, e.g.
  `accept="image/png,image/jpeg"`). Applied to the native picker **and** used
  to pre-filter drops/pastes (§4).
- The picker is attached to the target node (real field) or the container
  (singleton), exactly like `file`.
- **Name-less sources** (pastes/screenshots that carry no file name) are given
  a default name on acquisition — see §4.1 (the extension follows the final,
  post-conversion format).

### 3.4 Keyboard contract

The `file` contract (file spec §3) is inherited and extended — the image has no
text value, so **plain `Space` is free**:

| Key | Behavior |
|---|---|
| `Tab` | Natural tab order (the field sets `tabindex="0"` on the `<img>`) |
| `Enter` / `Shift+Enter` | Navigate to the next/previous field (inherited `input` hook) |
| `Space` | **Open the file picker** — `preventDefault()` (also stops page scroll) |
| `Shift+Space` | **Open the file picker** — yields to the `<details>` folding convention first (same `defaultPrevented` rule as `file`) |
| `Delete` / `Backspace` | **Clear the value** when set (`preventDefault()`); no-op when empty. Toggle: `smark_image_clearOnDelete` (default `true`) |

> `Enter` does **not** open the picker (unlike a native button): SmarkForm
> navigation semantics win, matching every other field type. `Del`/`Backspace`
> never collide with navigation — SmarkForm does not use them — and follow the
> precedent of `color.type.js`'s Delete hook.

### 3.5 Mouse & touch

| Path | Mechanism |
|---|---|
| Click on the `<img>` (or anywhere in a singleton wrapper) | **Open the picker** — `smark_image_open` (default `true`) |
| Drag & drop from OS onto the field / wrapper | Replace the value — `smark_image_drop` (default `true`) |
| Paste into the focused field / wrapper | Replace the value — `smark_image_paste` (default `true`) |

- **Native image drag is suppressed**: the field sets `draggable="false"` on
  the `<img>` (unless the author already set it), so OS image-dragging neither
  hijacks clicks on the field nor interferes with file drops (a draggable
  `<img>` is in nobody's interest inside a form field).
- **This never breaks list reordering.** The sortable decorator makes the
  **item root** (the `<li>`) the draggable element — `sortable.deco.js` sets
  `draggable="true"` on `templates.item`, not on the thumbnail, and its
  `dragstart` guard excludes interactive descendants. An `img draggable="false"`
  therefore leaves the item box and its handles fully draggable for sortable /
  `movingDepth` drops. The image-capable list tests must assert that dragging an
  item (or its handle) still reorders a list whose thumbnails are
  `draggable="false"`.
- `dragover` `preventDefault()` is wired for both real-field and singleton
  paths (required for the browser to accept OS drops), as in `file`.

### 3.6 Accessibility

- `tabindex="0"` (preserving an author-set value) makes the `<img>` reachable
  by keyboard; all interaction is keyboard-complete (§3.4).
- The field **preserves `alt`** and does **not** auto-change `role`/`aria-label`
  — keep native image semantics so screen readers treat it as an image.
- The field sets `title` only if the author left it unset, describing the
  action and state (e.g. `"No image — activate to upload"`);
  `"Image: <name> — activate to replace"`).
- **Docs guidance (strong):** authors should always provide meaningful `alt`
  text and specify the image's presentation size with the HTML `width` /
  `height` attributes (and/or `sizes`) so reserve layout space and avoid CLS
  when the value is swapped. The field never recomputes layout (see §8).

---

## 4. Acquisition validation: decoded-image test

On **interactive acquisition** (picker change, drop, paste — real field and
singleton), after `readFileToObject()` the candidate is additionally verified to
actually **decode as an image**:

```javascript
function decodeImage(obj) { // obj: {type, data(base64)}
    return new Promise(resolve => {
        const img = new Image();
        img.src = "data:" + (obj.type || "") + ";base64," + obj.data;
        if (typeof img.decode === "function") {
            img.decode().then(() => resolve(true), () => resolve(false));
        } else {
            img.addEventListener("load", () => resolve(true));
            img.addEventListener("error", () => resolve(false));
        };
    });
}
```

- **`Image.decode()` is preferred** (all evergreen engines since Jan 2020 — it
  awaits *and* decodes the bytes closer to the browser's real render path, off
  the main thread where possible, and settles faster than `load`/`error`). The
  `load`/`error` pair is the conservative fallback for older engines (Safari
  < 11.1 and similar).
- A file that passes the `accept` filter but fails to decode (wrong MIME, stale
  extension, corrupted bytes) is **rejected exactly like an un-accepted file**:
  the previous value stays, no `change` event fires.
- Option: `smark_image_validate` (default `true`); set `false` to rely on
  `accept`/MIME filtering alone (e.g. for very large images where the decode
  cost matters). Interactive acquisition only — `import()` always trusts data
  (file spec §12: script imports need no gesture and no decoding; an
  undecodable import simply fails to render and triggers the §3.1 fallback).

> **Lists:** batch acquisition must stay safe, so the `image` type **overrides
> the inherited static `acquire()`/`toObjects()`** to decode-filter each result
> and drop failures from the batch (see §7).

### 4.1 Size & format options (resize / convert)

On interactive acquisition the accepted candidate may additionally be **resized
and/or converted** before it becomes state:

| Option | Type | Default | Effect |
|---|---|---|---|
| `image_resize` | `[w,h]` \| `{width,height}` \| number (= square) | — | Rescale the image to the target dimensions |
| `image_maxSize` | same shape as `image_resize` | — | *Downscale-only* cap: act only when the source exceeds the given dimensions; never upscale |
| `image_format` | `"jpeg"` \| `"png"` \| `"webp"` \| `"avif"` | — | Convert the encoded format on acquisition |
| `image_enforce` | `"strict"` \| `"hard"` \| `"warn"` \| `"ignore"` | `"warn"` | How "cannot meet" / "cannot verify" outcomes are handled (§4.1.1) |

- **Non-conformant sources are converted, not rejected** — e.g.
  `image_format:"jpeg"` with a PNG source re-encodes to JPEG; conversion is
  normally always possible for the encodable formats (§4.2). Conversion and
  resizing are always attempted **best-effort**, whatever the mode; the mode
  only decides what happens on the *failure* outcomes (§4.1.1).
- **Aspect & box semantics:** `{width,height}` (or `[w,h]`) stretches to the exact
  box; a bare number means a square. Use `createImageBitmap`'s
  `resizeWidth`/`resizeHeight`/`resizeQuality` when available (GPU path,
  preferred for large downscales) and fall back to draw-to-canvas +
  `toBlob`/`OffscreenCanvas.convertToBlob()`.
- **The stored bytes change with the conversion:** `data`/`type` reflect the new
  encoding while `name` keeps its stem (`photo.png` → `photo.jpg`). A source
  **without a name** (e.g. a pasted screenshot, which may carry no file name)
  gets a default: `image.<ext>`, where `<ext>` maps from the **final**
  (post-conversion) MIME (`jpeg`→`jpg`, `png`, `webp`, `avif`), so the
  uploaded/downloaded file always has a sensible name (§3.3, §6.1). The value
  stays embedded-only — conversion is a byte transformation, not a URL
  reference. Interior state keeps the base64 invariant (file spec §7).

#### 4.1.1 Enforcement modes (`image_enforce`)

Each requirement (`image_resize` / `image_maxSize` / `image_format`) is
**verified** and, when missing, **converted**. Both operations are *best-effort*
(§4.2: browsers can always *verify dimensions* once the image decodes and can
always *resize*; format verification and `image_format` encoding are only
partially available). After the attempt the candidate lands in exactly one
outcome:

- **A — conforms** (already met, or converted/resized to a conforming result);
- **B — known non-conforming, conversion unavailable** (e.g.
  `image_format:"webp"` on Safari, where WebP cannot be encoded);
- **C — cannot be verified** (the true encoded format is unknowable — MIME
  empty or misreported after a paste, or dimensions unavailable because the
  bytes do not decode and `smark_image_validate` is off).

`image_enforce` then decides what to do with B and C:

| Mode | Accept A | Accept B | Accept C | Notify on (§4.3) |
|---|---|---|---|---|
| `"strict"` | ✓ | **reject** | **reject** | rejections (B, C) |
| `"hard"` | ✓ | **reject** | ✓ | rejections (B) |
| `"warn"` | ✓ | ✓ | ✓ | warnings (B) |
| `"ignore"` | ✓ | ✓ | ✓ | never |

- **`"strict"`** — the image *must* end up conforming: reject anything that is
  not verifiably conforming (not converted, not convertible, or unverifiable).
- **`"hard"`** — reject only what is *known* to fail: a non-conforming image
  the browser cannot convert is rejected, but a merely *unverifiable* one is
  accepted.
- **`"warn"`** — never reject on size/format grounds: accept a known
  non-conforming image that could not be converted, but tell the user (toast /
  event, §4.3).
- **`"ignore"`** — never reject **and** never notify; requirement failures are
  silent (conversion/resize still best-effort).

Notifications (rejections and warnings) go through the toast + event channel
(§4.3). **Decode failures are not governed here** — they are covered by
`smark_image_validate` (§4) and stay silent, matching `file`'s unaccepted-file
behaviour.

### 4.2 Encodability matrix (the honest limits)

`canvas.toBlob` / `OffscreenCanvas.convertToBlob()` can **encode** only:

| Format | Encode support |
|---|---|
| PNG | all engines |
| JPEG | all engines |
| WebP | all but Safari |
| AVIF | Chromium only |
| GIF / others | not encodable |

- **"Decoding is universal" ≠ verification or encoding.** Any browser that can
  *render* a format can also report its **dimensions** (`naturalWidth` /
  `naturalHeight`) — so size requirements are always verifiable once the image
  decodes. But the **actual encoded format** is only as knowable as the MIME
  metadata (`File.type`), which pastes/screenshots often leave empty and the
  browser may misreport. That is precisely why `image_enforce` has a
  "cannot verify" outcome (C, §4.1.1): it is real for `image_format` and keeps
  the mode option from collapsing into a plain verify-or-convert gate.
- **Animated images are not preserved** through conversion: resize/convert
  handles the first frame only. Full-frame animation (WebCodecs `ImageDecoder`,
  Chrome/Edge 94+, Firefox 130+ desktop, Safari 26+) is out of scope.

### 4.3 Notification: toast + cancellable event

When `image_enforce` raises a rejection or a warning (§4.1.1) the field:

1. **Dispatches a DOM event** on its `targetNode` — `smark:imageNotice`,
   `bubbles: true`, `detail: {kind, code, message, mode, name, requirement}`
   (e.g. `kind: "warning"|"rejection"`, `code: "IMAGE_FORMAT_UNSUPPORTED"`,
   `code: "IMAGE_DIMENSIONS_UNKNOWN"`);
2. **Unless a handler called `preventDefault()`**, shows an **in-page toast** —
   a small transient notification appended to `document.body` (`role="status"`
   / `aria-live="polite"`, auto-dismissed) with the reason ("Image is `40×40`
   but `image_resize` needs `80×80`", "PNG cannot be encoded as WebP in this
   browser").

The toast is the default channel because `window.alert()` / `window.confirm()`
are **silently blocked in sandboxed / non-`allow-modals` iframes** — a browser
restriction on the embed, not something SmarkForm imposes — and embedding a
form in an iframe is a legitimate production scenario, not just the docs
site's editor. `preventDefault()` lets integrators replace the toast with their
own UX; the event fires either way so listeners never miss a notification.

> Implementations may reuse a single module-level toast singleton — one
> transient notice at a time (latest wins), never stacked. The `max_items`
> over-capacity `window.confirm` in `list.type.js` stays as-is: it is a
> *choice* dialog, not a notice, and unrelated to this channel.

---

## 5. Internal state model

Identical to `file` (file spec §4) — the value is a normalized file object, and
**no image-specific fields are added**:

```javascript
{
    name: "photo.png",
    type: "image/png",
    size: 123456,
    lastModified: 1690000000000,
    data: "iVBORw0KGgo...==" // interior always base64
}
```

- Empty state = `null` (displays the placeholder, §3.2).
- `defaultValue = null`, `emptyValue = null` — inherited from `file`.
- **No `width`/`height` metadata.** The image is a field value; SmarkForm does
  not derive, store or export image dimensions. Layout sizing is the author's
  via `width`/`height`/`sizes` attributes or CSS (§3.6, §8).

---

## 6. Export / import

The `image` type exports/imports **exactly the `file` contract**
(file spec §5–§6); only the **name** resolution differs:

### 6.1 Export

- Returns `null` when empty.
- **Default (raw):** self-describing data-URL string —
  `"data:image/png;name=photo.png;size=123456;lastModified=1690000000000;base64,…"`.
  (`size` always recomputed from decoded bytes.)
- **`{"format":"json"}`:** complete `{name, type, size, lastModified, data}`
  object with `data` per the `encoding` option.
- **Name precedence differs from `file`:** an `<img>` has no text *field*, so —
  without a caption — the exported `name` is the **stored name** from the last
  acquisition/import. This matters in the implementation: the `file`
  implementation reads `me.targetFieldNode.value` for the "edited-name-wins"
  rule — on an `IMG`, `.value` is `undefined` and must **not** reach
  `String(undefined)`. The `image` override must simply omit that rule (and use
  the optional caption instead, next bullet).
- **Editable caption (`<figure>` wrappers) = the editable file name.** It *is*
  the value's `name`, made visible and editable: when a `<figure>` singleton has
  a `<figcaption contenteditable>`, its trimmed text becomes the export `name`
  with the same precedence as `file` (`edited caption` > `stored name`). The
  caption **always mirrors the current name** — it is set on acquisition/import
  and emptied on `Delete`/`clear` — and is re-hearsed (input/blur) exactly as
  `file` re-hearses its text value, so typed names update exports live without
  committing to state. **No extra metadata is added to the value**: the caption
  writes the same `name` field that is imported/exported and used by the
  `download` action.

### 6.2 Import

Identical to `file`, fully inclusive:

- a data-URL string,
- a full or partial object,
- a bare payload string (decoded per `encoding`),
- a JSON string of any of the above.

Imported values are normalized into state and **displayed immediately** via the
§3.1 `src` build. `import()` does **not** decode-validate (§4).

---

## 7. Lists of images (galleries)

A list whose item template is the `image` type:

```html
<ul data-smark='{"type":"list","name":"gallery","of":"image","accept":"image/*"}'>
  <li><img data-smark='{"type":"image"}'
           width="240" height="240" alt="Gallery image"></li>
</ul>
```

- **Preview**: each item's `<img>` displays the file's data URL — the list
  renders as a gallery of thumbnails (author controls sizing/presentation).
- **Batch add**: `addItem` uses the inherited static `acquire()` (multi-file
  picker) — overridden to decode-filter **and size/format-process** each
  selection (§4); `max_items` overflow confirmed via `window.confirm` as in
  `file` §10.
- **OS drop append**: works through the list's drop handling — both are already
  **capability-based** (`list.type.js` / `sortable.deco.js` check
  `typeof tplController.acquire / toObjects === "function"`), so `of:"image"`
  needs no list changes.
- **Singleton-drop suppression inside the list**: the `file` real-field
  singleton suppression (file.type.js `underFileList`) currently hard-codes
  `parentList.tplType === "file"`. That check **must become a capability test**
  so an item-singleton inside an `of:"image"` list also suppresses its own
  container drop (drops on that item append to the list instead of replacing
  the item). Proposed refactor: expose a capability flag on the controller —
  e.g. `static isFileLike = true` on `file` (inherited by `image`) — and test
  the resolved `tplType` controller for it.
- **Paste stays item-scoped** (there is no list-level paste handler), so pasting
  onto an item image still replaces that item.
- **Per-item captions:** a gallery item template may include its own
  `<figcaption contenteditable>`, giving each thumbnail the editable file name
  exactly like a `<figure>` singleton (§6.1): the "edited caption wins" rule
  applies per item as in `file` lists, and each caption mirrors its item's
  stored `name` (set on acquisition, emptied when the item's value is
  cleared/removed).

---

## 8. Layout & author guidance (CLS)

The field manages **only the embedded value presentation** (`src` + the
placeholder fallback). It never changes `width`, `height`, `sizes`, `class`,
`style` or other layout-affecting attributes.

**Documentation must strongly highlight** that authors should specify the
image's size in the markup to reserve layout space:

- prefer the HTML `width`/`height` attributes on the authored `<img>` (aspect
  ratio is then reserved before the image loads, preventing layout shift when
  a different-sized value is later picked/imported);
- and/or the `sizes` attribute (with CSS-driven responsive layout) — note that
  authored `srcset` is left untouched but is **not** managed for the value;
- and/or CSS sizing (`max-width: 100%; height: auto;`) as the responsive idiom.

The documentation for the `image` type should include the canonical
"specify width/height" snippet in every example.

---

## 9. Options (in `data-smark`)

| Option | Type | Default | Purpose |
|---|---|---|---|
| `type` | string | — | `"image"` |
| `name` | string | — | Field name (JSON key) |
| `format` | `"raw"` \| `"json"` | `"raw"` | Export representation (inherited from `file`) |
| `encoding` | `"base64"` \| `"base64url"` \| `"hex"` | `"base64"` | Payload byte encoding (inherited from `file`) |
| `accept` | string | `"image/*"` | Native picker filter, also applied to drops/pastes |
| `placeholder` | URL/data-URL string \| `false` | generated chessboard | Empty-state image; `false` = leave `src` empty |
| `smark_image_open` | boolean | `true` | Click / `Space` / `Shift+Space` open the picker |
| `smark_image_drop` | boolean | `true` | Drag & drop replaces the value |
| `smark_image_paste` | boolean | `true` | Paste replaces the value |
| `smark_image_validate` | boolean | `true` | Decode-test acquired files (§4) |
| `smark_image_clearOnDelete` | boolean | `true` | `Delete`/`Backspace` clear the value |
| `image_resize` | `[w,h]` \| `{width,height}` \| number | — | Resize acquired images to target dimensions (§4.1) |
| `image_maxSize` | same as `image_resize` | — | Downscale-only cap (§4.1) |
| `image_format` | `"jpeg"` \| `"png"` \| `"webp"` \| `"avif"` | — | Convert-on-acquire format (§4.1) |
| `image_enforce` | `"strict"` \| `"hard"` \| `"warn"` \| `"ignore"` | `"warn"` | How "cannot meet" / "cannot verify" candidates are handled (§4.1.1) |

> **Naming:** project-specific options use the `image_` prefix
> (`image_resize`/`image_maxSize`/`image_format`/`image_enforce`) to avoid
> colliding with the inherited `file` vocabulary (`format` = export
> representation, `size` = byte length in the value object) while staying
> unprefixed short keys like `accept`/`placeholder`.

> **Option-name compatibility:** `smark_image_open/drop/paste` are the
> canonical image names; the inherited `smark_file_open/drop/paste` are honored
> as fallbacks (`smark_image_*` wins). Documented so authors sharing file-type
> habits don't trip.

---

## 10. Events & lifecycle

- **`change`** — fires once (`bubbles: true`) whenever the value is set,
  replaced or cleared through pick/drop/paste/`Delete` (mirrors `file` §9).
- **`smark:imageNotice`** — dispatched on the field's `targetNode` (bubbles)
  whenever `image_enforce` raises a rejection or warning; `preventDefault()`
  suppresses the default toast (§4.3).
- `BeforeAction_*` / `AfterAction_*` apply to `export`/`import`/`clear`/`reset`
  as usual.
- **Download action** — inherited from `file` §11 unchanged, with the name
  precedence adjusted: `options.filename` || (editable caption when present,
  §6.1) || stored `name`. Trigger usage identical:
  `<button data-smark='{"action":"download","context":"/photo"}'>Download</button>`.

---

## 11. Security & user-gesture considerations

All of `file` §12 applies unchanged:

- `import()` needs no user gesture (bytes already in memory; there is nothing
  to guard).
- Opening the OS picker always requires a real user gesture; the hidden picker
  is soft-clicked **synchronously inside** the click/keydown handler.
- Drop and paste are intrinsic gestures.
- No `require_gesture`-style option exists.

---

## 12. Implementation notes

New file `src/types/image.type.js`, registered in `src/main.js` (`image` added
to the `createType` map). Class sketch (extends `file`):

- **Signature & inference wiring** — `inferType()` gains
  `case "img": return "image"` (component.js); an explicit `{"type":"image"}`
  on an `<input type="image">` raises `IMAGE_TYPE_ON_INPUT` (§2.4).
- **`render()`** — custom, *not* the inherited singleton logic verbatim:
  - `me.isSingleton = me.targetNode.tagName !== "IMG"`;
  - real-field (`IMG`): set `tabindex` (if unset), `draggable=false` (if
    unset), build hidden picker (`accept` default `"image/*"`), wire
    click/keydown (`Space`, `Shift+Space`) / drop / paste / `Delete`/
    `Backspace`, set `src` to placeholder, attach `onerror` fallback;
  - singleton: reuse the `file` container flow but validate the inner field is
    the `image` type (`IMAGE_MISSING_IMG` / `SINGLETON_TYPE_MISMATCH`), and
    generalize the `underFileList` suppression to the capability test (§7);
  - do **not** call `input.render()`'s real-field branch (it assumes a text
    value), and do **not** run the `enterkeyhint` IME block (no text input).
- **`_setTargetFieldValue(fileObj)`** — set `img.src` (`data:` URL from state,
  or placeholder when `null`); override `file`'s (which writes `.value`).
- **`_openPicker()` / `_acceptFiles()` (acceptance pipeline)** — inherit
  `file`'s, then per candidate: ① `decodeImage()` gate (§4); ② size/format
  processing (§4.1: `createImageBitmap` resize or canvas conversion); ③
  `image_enforce` verdict (§4.1.1) + toast / `smark:imageNotice` notification
  (§4.3); ④ default `name` for nameless sources (§4.1); store the final bytes;
  default `accept` = `"image/*"`.
- **Notification helper** — module-level toast singleton + `smark:imageNotice`
  dispatch with `preventDefault()` handling (§4.3).
- **Caption re-hearsal** — when a contenteditable `<figcaption>` exists, wire
  `input`/`blur` listeners that restage the export (the `file` visible-name
  pattern, §6.1); the caption re-syncs to the stored `name` on acquisition/
  import and empties on `Delete`/`clear`.
- **`export()`** — override the "edited visible name wins" rule: the editable
  source is the `<figcaption>` text (when a contenteditable caption exists)
  instead of `targetFieldNode.value` — an IMG has none, so `.value` must never
  reach `String(undefined)`; otherwise inherit the `computeExport` logic (reuse
  `file`'s helper directly).
- **`import()`** — inherit `file`'s (it already routes through
  `_setTargetFieldValue` and needs no name-editing).
- **`download()`** — override `.filename` fallback to `options.filename ||
  (caption text when present) || storedName || "file"`.
- **static `acquire()` / `toObjects()`** — override `file`'s to run each
  acquired object through the §4 pipeline (decode → size/format →
  `image_enforce` verdict), dropping rejected results from the batch and
  keeping acquisition safe (§4, §7); nameless sources get the default
  `image.<ext>` name (§4.1).
- **`isEmpty()`** — inherited from `file` unchanged.

Also required: the **small refactor** in `file.type.js` replacing
`parentList.tplType === "file"` with the `isFileLike` capability test (§7), so
the singleton-drop suppression generalizes to derived file-like types without
duplicating logic.

---

## 13. Open questions / future decisions

- **`<picture>` responsive values** — multi-source (`srcset`/`sizes`) with one
  candidate per source = "multiple files per value"; a different feature, out of
  scope (a `<picture>` wrapper is supported only as a generic singleton
  container, §2.3).
- **External URL references** — storing/exporting a plain http(s)/path URL
  without embedding bytes is deliberately **not** supported (decision:
  "embedded only, like `file`"). Revisit only if a hosted-asset workflow
  demands it.
- **Click semantics** — v1 click = pick. A future long-press/modifier or zoom
  preview would need a `smark_image_click` mode (`"pick"` | `"preview"` | …).
- **Export name control** — the editable name now lives in the
  `<figcaption contenteditable>` route (§6.1) on `<figure>` wrappers and
  per-item in gallery lists (§7). A future `smark_image_exportName` (fixed
  name for exports) is still possible; without any, the stored name (or
  `download`'s `filename` option) governs.
- **Alt / role management** — currently the field never touches `alt`/`role`
  (§3.6); a future button-like a11y mode (explicit `role="button"` + dynamic
  `aria-label`) could be opt-in.
- **Decode-validation on `import()`** — deferred (perf + "script imports are
  trusted" stance); the §3.1 `onerror` fallback already keeps the UI coherent.

---

## 14. Relation to PROMPTS.md & `spc/` convention

This spec is the working design for the `image` field type and follows the
`spc/` convention established by `spc/file.md` (§14): keep specifications in
`spc/` until the design stabilizes, then mirror them into `PROMPTS.md` as
prompt drafts for implementation. Related future types (`audio`, `video`,
`drawing`) build on the same `file` foundation and should reference this spec
where they extend it.