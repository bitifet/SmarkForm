# Specification: `audio` field type

> **Status:** Draft
> **Target:** SmarkForm `audio` field type (core component type)
> **Related:** `file` (`spc/file.md`) — the `audio` type **extends** the `file`
> type, inheriting its value contract, acquisition machinery, list integration
> and download action, adding audio-specific display, validation and
> interaction. `video` (`spc/video.md`) is the closest precedent: `audio`
> mirrors the same structure but uses the `<audio>` media element, omits visual
> layout concerns and has no first-frame/poster preview.

---

## 1. Overview & goals

The `audio` field type turns an `<audio>` element into an audio-upload field. It
inherits the entire `file` contract (spec `spc/file.md`) — same normalized
interior state, same inclusive import, same `format`/`encoding` axes, same
picker/drop/paste acquisition, same singleton pattern, same `download` action,
same list integration — and specializes it for audio:

- **Display**: the loaded clip is playable in place via `src`. When empty
  (`null`), the element is simply inactive — no poster/placeholder is required
  (there is no visual canvas). A small author-supplied placeholder content or
  an empty-state message may wrap the element in a singleton container.
- **Validation**: on interactive acquisition, bytes must actually **parse as a
  playable audio container** — a metadata-level probe on an off-DOM `<audio>`
  element (`smark_audio_validate`, default on). A cheap byte-size cap
  (`audio_maxSize`) can reject oversized clips before their bytes are read.
- **Interaction**: click / `Space` / `Shift+Space` open the OS picker when the
  field is in pick mode; when the author opts into playback (native `controls`
  or `smark_audio_click:"play"`), clicks and `Space` control playback instead.
  `Delete`/`Backspace` clear. Drag & drop and paste replace — mirroring and
  extending the `file` keyboard contract.
- **Value semantics unchanged**: the audio file is a *field value* — SmarkForm
  never alters or re-encodes the stored bytes. Only the *presentation* (`src`)
  and playback affordances are managed; authored presentation attributes
  (`controls`, `loop`, `class`, `style`, `preload`) are preserved untouched.

### Goals

1. **Full `file` parity** — the `audio` value IS a file value: same
   self-describing data-URL string / `json` object shapes, lossless round-trip,
   inclusive import.
2. **In-place playback** — the authored `<audio>` plays the current value with
   zero author JS.
3. **Safe acquisition** — container-level validation (metadata probe) on
   pick/drop/paste.
4. **Keyboard-complete** — upload, clear and (optionally) play/pause without a
   mouse.
5. **Composition** — template pattern, singleton actions, and lists of audio
   tracks work exactly like `file` and `video`.

### What `audio` deliberately does NOT do (like `video`, unlike `image`)

`image` rescales/re-encodes on acquisition because a canvas can synchronously
process a decoded bitmap. **Audio transcoding has no equivalent cheap,
synchronous path** — `MediaRecorder` is stream-capture only and WebCodecs does
not support audio encoders in a portable way. So the `audio` type has **no
resize, format-conversion or `enforce` policy options** in v1: validation is a
decodability *probe*, not a transform pipeline, and `audio_enforce` is
intentionally absent. Size control is a plain byte cap (`audio_maxSize`).

---

## 2. Markup & binding model

### 2.1 The native field is an `<audio>` element

The `audio` type binds to an **authored `<audio>` element**:

```html
<audio data-smark='{"type":"audio","name":"clip"}'
       controls preload="metadata">
</audio>
```

- `me.targetNode === me.targetFieldNode === <audio>`.
- The `<audio>` is the **display node** for the value (`src` is managed by the
  field) and the **focus anchor** for keyboard interaction (the field sets
  `tabindex="0"` unless the author supplied one).
- An `<audio>` is **not** a native form field: it has no `.value`, no text
  editing. The value lives entirely in the component's internal state (exactly
  like `file` and `video`); the element only *displays* it.
- **`<source>` children are not managed.** A `<audio>` element may contain
  candidate `<source>` children (as authored), but once the field sets `src`
  the `<source>` list is inert. The field never inspects, rewrites or removes
  them — the value is exactly one file with exactly one encoding (§4.2).

> **Type inference IS extended.** `inferType()` (component.js §`inferType`)
> maps an authored `<audio>` carrying `data-smark` — even a **bare**
> `data-smark` with no options — to the `audio` type (`case "audio": return "audio"`).
> `data-smark` presence alone marks a SmarkForm field, and an `<audio>` has no
> text value, no name/value pair, so no other type fits. The same inference
> applies inside list item templates, so a template `<audio data-smark>` item
> yields an `of:"audio"` list without declaring the type explicitly. Authors
> may still spell out `type: "audio"` — it is redundant, not mandatory.

### 2.2 `isSingleton` detection is overridden

`input.render()` decides real-field vs singleton by tag name
(`INPUT`/`SELECT`/`TEXTAREA` → real field). The `audio` type must override this:

| targetNode tag | Mode |
|---|---|
| `AUDIO` | **Real field.** Display node + picker + keyboard contract on the `<audio>` itself. No inner children are expected. |
| anything else (e.g. `DIV`, `FIGURE`) | **Singleton container.** Exactly **one** inner `<audio>` field (+ optional triggers). All `file` singleton behavior applies. |

### 2.3 Singleton pattern (wrappers)

Any container element can wrap the `<audio>` and gain the singleton behaviors
(from `file` §3): whole-container drop/paste detection, action triggers inside
the wrapper, delegation of export/import/navigation to the inner field.

```html
<figure data-smark='{"type":"audio","name":"clip"}'>
  <audio data-smark='{"type":"audio"}' controls preload="metadata"></audio>
  <figcaption>
    <button data-smark='{"action":"download","context":"/clip"}'>Download</button>
  </figcaption>
</figure>
```

- `<figure>`, `<div>` and similar wrappers are valid — the singleton rule
  ("exactly one inner field, others must be triggers") is tag-agnostic.
- In a wrapper, any descendant marked with
  `data-smark='{"action":"rename"}'` may serve as the **editable visible name**
  (§6.1). It is a trigger marker, not an additional singleton field; SmarkForm
  makes it contenteditable and synchronizes the filename. Legacy
  `contenteditable` captions remain supported.

### 2.4 Error conditions

- `AUDIO_MISSING_AUDIO`: singleton container has no inner `<audio>`-type field
  (or zero inner fields) → `renderError`, mirroring `VIDEO_MISSING_VIDEO`.
- `SINGLETON_TYPE_MISMATCH`: reused as-is — singleton `type` must match the
  inner field's `type`.
- `AUDIO_TYPE_ON_INPUT`: an *explicit* `{"type":"audio"}` on an `<input>`
  must raise a `renderError` (an `<input type="audio">` is not a valid HTML
  input type and has none of the `file` value contract). `inferType()` never
  returns `"audio"` for an `<input>`.

---

## 3. UI model

### 3.1 Display: value → `src`

The field builds the display URL directly from internal state. Because the
interior always stores `data` as **base64** (file spec §7), the src is a plain
data URL:

```
src = "data:" + type + ";base64," + data
```

- **Value set** → `audio.src = <built data URL>`; call `audio.load()` so the
  element re-evaluates the new source (media elements cache a loaded source and
  will not pick up a new `src` without `load()`).
- **Value `null`** → clear `src` and any author-managed source children; the
  element becomes inactive.
- An *imported* value a browser cannot play simply fails to render while
  **state is kept untouched** — export remains faithful. No event listener is
  required for this: it is native media-element behavior.

> **Data URLs as media `src`** are valid and playable in all engines. See §12
> for large-file considerations.

### 3.2 Empty state

When there is no value, the field presents an empty audio element. Because an
`<audio>` element has no visual poster/box by itself:

- The field leaves authored layout/presentation attributes untouched.
- The singleton wrapper is the recommended place for an empty-state label or
  upload affordance.
- Authors may style `[data-value="empty"]` (or similar) if they want a
  placeholder panel.
- No generated placeholder image or SVG is required or installed.

### 3.3 Picker & acquisition

Identical mechanics to `file` and `video` (file spec §3): a hidden transient
`<input type="file" accept="…">` is the sole picker trigger; it is never
populated and is reset after every pick. Drop and paste feed bytes straight into
state.

- **`accept` default is `"audio/*"`** (author-overridable, e.g.
  `accept="audio/mpeg,audio/ogg"`). Applied to the native picker **and** used
  to pre-filter drops/pastes (§4).
- The picker is attached to the target node (real field) or the container
  (singleton), exactly like `file`.
- **Name-less sources** (pastes/recorders that carry no file name) are given a
  default name on acquisition (`audio.<ext>` derived from the detected MIME,
  defaulting to `audio.mp3` when the MIME is unknowable — see §4).

### 3.4 Keyboard contract

The `file` contract (file spec §3) is inherited and extended. Like `video`,
`Space` is **not unconditionally free** because the field may double as a mini
player.

| Key | Pick mode (no `controls`, `smark_audio_click:"pick"`) | Play mode (`controls` present, or `smark_audio_click:"play"`) |
|---|---|---|
| `Tab` | Natural tab order (the field sets `tabindex="0"`) | Same |
| `Enter` / `Shift+Enter` | Navigate to the next/previous field (inherited `input` hook) | Same |
| `Space` | **Open the file picker** — `preventDefault()` | **Toggle play/pause** when a value is set — `preventDefault()`; empty value → open the picker |
| `Shift+Space` | **Open the file picker** — yields to `<details>` folding convention first | **Open the file picker** — always |
| `Delete` / `Backspace` | **Clear the value** when set (`preventDefault()`); no-op when empty. Toggle: `smark_audio_clearOnDelete` (default `true`) | Same |

> In play mode, `Space` play/pause is implemented by the field's keydown hook
> (`play()`/`pause()` + `preventDefault`), so the contract is identical whether
> the author added native `controls` or not. When native `controls` are
> present the browser's own focused-media Space handling would do the same; the
> hook just makes behavior deterministic and keeps `Shift+Space` available for
> the picker. `Delete`/`Backspace` never collide with `controls`.

### 3.5 Mouse & touch — the click conflict resolved

`<audio>` with `controls` is itself a playable control strip, so "click = pick
file" collides with "click = play". The field resolves this with an explicit
click-mode option:

| Mode | Value set | Value empty |
|---|---|---|
| `smark_audio_click:"pick"` | Click **opens the picker** | Click opens the picker |
| `smark_audio_click:"play"` | Click **toggles play/pause**; `Shift+Space`/a trigger still pick | Click opens the picker |
| `smark_audio_click:"auto"` (default) | `controls` attribute present → behave as `"play"`; otherwise → `"pick"` | Click opens the picker |

- **`"auto"` is the default.** An author who wrote `controls` gets a player;
  an author who omitted `controls` gets pick-to-upload behavior.
- **`drop`/`paste` replace work in every mode** (`smark_audio_drop` /
  `smark_audio_paste`, default `true`).
- `dragover` `preventDefault()` is wired for both real-field and singleton
  paths, as in `file`.

### 3.6 Preview & playback attributes

The field manages only what it must to make a value *playable* and leaves
author attributes untouched:

- `preload="metadata"` (if unset) — metadata-only load, cheap preview.
- In **play mode** only, `muted` may be set if the author did not set it, to
  prevent unexpected sound on programmatic play. The field **never sets
  `autoplay`** in any mode.
- `tabindex="0"` (if unset) — focus anchor; `title` set only if unset,
  describing action/state.

### 3.7 Accessibility

- `tabindex="0"` (preserving an author-set value) makes the `<audio>` reachable
  by keyboard; all interaction is keyboard-complete (§3.4).
- The field **preserves authored semantics** and does **not** change
  `role`/`aria-label`/`aria-*` — keep native media semantics.
- With `controls`, the browser media element is already operable; without
  `controls`, the field's keydown handling is the accessible path.

---

## 4. Acquisition validation: media-container probe

On **interactive acquisition** (picker change, drop, paste — real field and
singleton), after `readFileToObject()`, the candidate is additionally verified
to actually **parse as playable audio**:

```javascript
const AUDIO_PROBE_TIMEOUT = 4000; // ms — memory-backed probe

function probeAudio(obj) { // obj: {type, data(base64)}
    return new Promise(resolve => {
        let bytes;
        try { bytes = b64ToBytes(obj.data); }
        catch { return resolve(false); }
        const url = URL.createObjectURL(new Blob([bytes], { type: obj.type || "" }));
        const a = document.createElement("audio");
        let done = false;
        const finish = ok => {
            if (done) return;
            done = true;
            clearTimeout(t);
            a.removeAttribute("src");
            try { a.load(); } catch {}
            URL.revokeObjectURL(url);
            resolve(ok);
        };
        const t = setTimeout(() => finish(false), AUDIO_PROBE_TIMEOUT);
        a.preload = "metadata";
        a.addEventListener("loadedmetadata", () => finish(true));
        a.addEventListener("error", () => finish(false));
        a.src = url;
    });
}
```

- **`loadedmetadata` is the guarantee.** It fires once the container and header
  metadata parse — i.e. the file is a *real audio container*. Because the bytes
  come from an object URL backed by in-memory bytes, the parse resolves quickly
  or errors immediately.
- **Honest limit:** `loadedmetadata` is NOT a full decode guarantee. A file
  whose codec track is undecodable in the current browser can still fire
  `loadedmetadata` and fail at actual playback. This is the best the platform
  exposes without a full play-through.
- **Cheap MIME pre-check:** `a.canPlayType(obj.type || "") !== ""` is consulted
  *before* the blob probe as a fast positive/negative discriminator. It is
  advisory only — the `loadedmetadata` probe is authoritative.
- A file that passes the `accept` filter but fails the probe is **rejected**
  exactly like an un-accepted file: the previous value stays, no `change` event
  fires.
- **`audio_maxSize` (byte cap)** is checked *before* any bytes are read.
- Option: `smark_audio_validate` (default `true`); set `false` to rely on
  `accept`/MIME filtering alone. Interactive acquisition only — `import()`
  always trusts data and never probes.

> **Lists:** batch acquisition must stay safe, so the `audio` type **overrides
> the inherited static `acquire()`/`toObjects()`** to probe (and byte-cap) each
> result and drop failures from the batch.

### 4.1 No conversion pipeline (deliberate)

`image` resizes/re-encodes via canvas; **audio re-encoding cannot.** Viable
engines are rejected for v1:

- `MediaRecorder` — captures from a *played* stream only; cannot ingest a raw
  audio file and mandate a fixed output.
- WebCodecs `AudioDecoder` exists but `AudioEncoder` is not broadly supported,
  and encoding requires demuxing, frame pumps, muxing and codec configuration.

Consequences:

- **No `audio_resize`, `audio_format`, or `audio_enforce`.**
- "Downsizing" a clip means telling the *user* to produce a smaller file — the
  byte cap `audio_maxSize` is the pragmatic v1 control.

### 4.2 Decodability matrix

| Container / codec combo | Chromium | Firefox | WebKit/Safari |
|---|---|---|---|
| MP3 | ✓ | ✓ | ✓ |
| MP4 / AAC | ✓ | ✓ | ✓ |
| Ogg / Vorbis | ✓ | ✓ | ✗ |
| Ogg / Opus | ✓ | ✓ | ✗ |
| FLAC | ✓ | ✓ | ✓ |
| WebM / Opus | ✓ | ✓ | partial |
| WAV | ✓ | ✓ | ✓ |

- Browsers' `canPlayType` over-approximates; the probe is metadata-authoritative
  but still not a full decode proof.
- **Recommendation for docs:** target **MP3** or **MP4/AAC** for universal
  playback; accept WAV/FLAC where lossless fidelity is needed.

### 4.3 Notification: toast + cancellable event

When `audio_maxSize` raises a rejection the field:

1. Dispatches `smark:audioNotice`, `bubbles: true`,
   `detail: {kind, code, message, mode, name, requirement}` (e.g.
   `kind: "rejection"`, `code: "AUDIO_TOO_LARGE"`).
2. Unless a handler called `preventDefault()`, shows an in-page toast.

Validation-probe failures stay silent — they are rejections of unaccepted
files, matching `image`'s decode gate and `video`'s probe gate.

### 4.4 `audio_maxSize` (byte cap)

| Option | Type | Default | Effect |
|---|---|---|---|
| `audio_maxSize` | number (bytes) | — | Reject acquisition when `file.size` exceeds the cap — checked **before reading bytes** |

- Rejection follows §4.3 (`smark:audioNotice` + toast), previous value stays,
  no `change` event.

---

## 5. Internal state model

Identical to `file` and `video` — the value is a normalized file object, and
**no audio-specific fields are added**:

```javascript
{
    name: "clip.mp3",
    type: "audio/mpeg",
    size: 1234567,
    lastModified: 1690000000000,
    data: "AAAAIGZ0eXBpc29tAAA..." // interior always base64
}
```

- Empty state = `null`.
- `defaultValue = null`, `emptyValue = null`.
- **No `duration`, `sampleRate`, `bitrate` or channel metadata.** A future
  optional metadata axis is an open question (§13.3).

---

## 6. Export / import

The `audio` type exports/imports **exactly the `file` contract**; only the
**name** resolution differs — identical to `image`/`video` §6.1.

### 6.1 Export

- Returns `null` when empty.
- **Default (raw):** self-describing data-URL string.
- **`{"format":"json"}`:** complete `{name, type, size, lastModified, data}`
  object with `data` per the `encoding` option.
- **Name resolution:** an `<audio>` has no text *field*, so the **editable
  caption/rename trigger** (when present) supplies the export name with
  precedence `edited caption` > `stored name` > `"file"`. The caption mirrors
  the current name, set on acquisition/import and emptied on clear.

### 6.2 Import

Identical to `file`, fully inclusive:

- data-URL string,
- full or partial object,
- bare payload string (decoded per `encoding`),
- JSON string of any of the above.

Imported values are normalized into state and displayed immediately. `import()`
does **not** probe or byte-cap.

---

## 7. Lists of audio tracks

```html
<ul data-smark='{"type":"list","name":"clips","of":"audio","accept":"audio/*"}'>
  <li><audio data-smark='{"type":"audio"}' controls></audio></li>
</ul>
```

- **Batch add**: `addItem` uses inherited static `acquire()` — overridden to
  probe-validate and byte-cap each selection; `max_items` overflow confirmed
  via `window.confirm` as in `file`.
- **OS drop append**: works through the list's existing capability-based
  (`isFileLike`) drop handling — no `audio`-specific list changes.
- **Singleton-drop suppression inside the list**: item-singletons suppress
  their own container drop inside an audio-capable list, exactly as `file`/`image`/`video`.
- **Paste stays item-scoped.**
- **Editable names:** a gallery or singleton template uses
  `data-smark='{"action":"rename"}'`.

---

## 8. Layout & author guidance

The field manages **only the embedded value presentation** (`src` + unset
playback hints, §3.6). It never changes `width`, `height`, `class`, `style` or
other layout-affecting attributes.

**Documentation must highlight:**

- Native `<audio controls>` provides its own control strip; without `controls`
  the field provides keyboard access but **no visible buttons** — authors who
  want a visible upload affordance should wrap the element in a singleton
  container or add companion triggers.
- Format guidance (§4.2): prefer MP3 or MP4/AAC for universal playback.

---

## 9. Options (in `data-smark`)

| Option | Type | Default | Purpose |
|---|---|---|---|
| `type` | string | — | `"audio"` |
| `name` | string | — | Field name |
| `format` | `"raw"` \| `"json"` | `"raw"` | Export representation (inherited) |
| `encoding` | `"base64"` \| `"base64url"` \| `"hex"` | `"base64"` | Payload byte encoding (inherited) |
| `accept` | string | `"audio/*"` | Native picker filter, also applied to drops/pastes |
| `smark_audio_open` | boolean | `true` | Click / `Space` / `Shift+Space` open picker (pick mode) |
| `smark_audio_drop` | boolean | `true` | Drag & drop replaces value |
| `smark_audio_paste` | boolean | `true` | Paste replaces value |
| `smark_audio_validate` | boolean | `true` | Media-container probe on acquisition |
| `smark_audio_clearOnDelete` | boolean | `true` | `Delete`/`Backspace` clear value |
| `smark_audio_autoPick` | boolean | `false` | Best-effort picker open after render |
| `smark_audio_click` | `"auto"` \| `"pick"` \| `"play"` | `"auto"` | Resolves click/`Space` conflict |
| `audio_maxSize` | number (bytes) | — | Reject acquisition above byte cap, with notice |

> **Naming:** `audio_`-prefixed options follow the `image_`/`video_`
> convention. `smark_audio_*` toggle names mirror `smark_image_*`/
> `smark_video_*`.

---

## 10. Events & lifecycle

- **`change`** — fires once (`bubbles: true`) whenever value is set, replaced
  or cleared.
- **`smark:audioNotice`** — dispatched on `targetNode` for requirement rejections
  (`audio_maxSize`); `preventDefault()` suppresses default toast.
- `BeforeAction_*` / `AfterAction_*` apply to `export`/`import`/`clear`/`reset`.
- **Download action** — inherited from `file`, name precedence:
  `options.filename` \| editable caption \| stored `name`.

---

## 11. Security & user-gesture considerations

All of `file` §11 applies unchanged:

- `import()` needs no user gesture.
- Opening the OS picker requires a real user gesture.
- Drop and paste are intrinsic gestures.

Additional, audio-specific:

- **Large-payload awareness** — embedded audio values are base64 strings in
  memory, state and `export()`; choose `audio_maxSize` accordingly.
- **No remote loading.** The value is embedded; the field only loads `data:`
  URLs / in-memory object URLs for the probe / the author's own external
  resources.

---

## 12. Performance & large-file considerations

- `readFileToObject()` reads the whole file into memory and encodes it as
  base64 — unavoidable for an embedded value.
- `audio_maxSize` rejects before any byte is read.
- The probe (§4) creates a Blob + object URL in addition to the base64 copy;
  revoking the object URL is mandatory.
- Display uses a `data:` URL `src`. Per-browser `data:` URL ceilings exist, so
  keep clips bounded.

---

## 13. Implementation plan

### 13.1 Files to create or modify

| File | Change |
|---|---|
| `src/types/audio.type.js` | New class extending `file`. Implements render, `_setTargetFieldValue`, keyboard/click handling, probe, notifications, static `acquire`/`toObjects`, and caption support. |
| `src/lib/component.js` | Add `case "audio": return "audio"` in `inferType()`. |
| `src/main.js` | Register `audio` in the type map. |
| `src/lib/file_caption.js` | No change unless a shared audio caption helper is needed; reuse existing caption/rename behavior. |
| `src/lib/media_helpers.js` | No change; existing `isFileLike`, `processFileSource` and batch helpers apply. |
| `src/decorators/media_spinner.deco.js` | Optional: show a spinner during probe/loading for network-sized files; audio loads are fast, so this is lower priority than for images/videos. |
| `test/type_audio.tests.js` | New focused Playwright suite mirroring `type_video.tests.js`. |
| `docs/_component_types/type_audio.md` | New documentation page with playable sampletabs. |
| `spc/audio.md` | This specification. |

### 13.2 Step-by-step implementation order

1. **Core class skeleton** — `src/types/audio.type.js` extending `file`,
   overriding `isSingleton` (`targetNode.tagName !== "AUDIO"`) and implementing
   `_setTargetFieldValue` to set/clear `audio.src` + `load()`.
2. **Inference + registration** — wire `case "audio"` in `component.js` and add
   to the type map in `main.js`.
3. **Acquisition plumbing** — wire hidden picker, drop, paste, and keyboard
   handlers; default `accept="audio/*"`.
4. **Probe validation** — implement `probeAudio()` (off-DOM `<audio>` + object
   URL) with `loadedmetadata`/`error` and timeout; integrate in `_acceptFiles()`
   and static batch `acquire()`; emit `smark:audioNotice` for `audio_maxSize`
   rejections.
5. **Click/keyboard playback modes** — implement `smark_audio_click`
   (`auto`/`pick`/`play`) and `Space` handling in play mode.
6. **Caption/rename support** — reuse `file_caption.js` so
   `data-smark='{"action":"rename"}'` and legacy contenteditable captions work
   for export/download naming.
7. **Tests** — add `test/type_audio.tests.js` covering:
   - real-field render/audio tag inference,
   - singleton wrapper + missing-audio error,
   - pick/drop/paste acquisition and probe validation,
   - `audio_maxSize` rejection + `smark:audioNotice`,
   - keyboard contract (`Space`, `Shift+Space`, `Delete`),
   - click mode (`auto`/`pick`/`play`),
   - `format:"json"` round-trip,
   - list `of:"audio"` batch append,
   - download + rename trigger.
8. **Documentation + sampletabs** — `docs/_component_types/type_audio.md` with
   playable examples using small same-origin audio assets; add file to
   `docs/_resources/user_guide.md` if relevant.
9. **Build + dist refresh** — `npm run build` and commit updated bundles.

### 13.3 Open questions / future decisions

- **Full decode validation** — `loadedmetadata` does not prove codec track
  decodes. A play-through pre-flight is heavier; defer unless required.
- **Transcoding pipeline** — `audio_format`/`audio_enforce`/bitrate cap via
  WebCodecs `AudioEncoder` where available. Explicitly deferred for v1.
- **Metadata in value** — `duration`, `sampleRate`, `bitrate`, `channels` as
  optional exported fields. Currently absent.
- **Waveform/visualizer preview** — visual representation of the audio value is
  out of scope; a future optional decorator or extension could render a canvas
  waveform without changing the value contract.
- **Object URL display path** — same trade-off as `video` §12.

---

## 14. Relation to PROMPTS.md & `spc/` convention

This spec follows the `spc/` convention established by `spc/file.md`,
`spc/image.md` and `spc/video.md`: keep specifications in `spc/` until the
design stabilizes, then mirror them into `PROMPTS.md` as prompt drafts. The
`audio` type builds on the same `file` foundation, mirrors `video`'s
probe/click-mode model, and differs mainly in using the `<audio>` element and
omitting visual preview/layout concerns.
