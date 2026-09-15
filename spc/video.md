# Specification: `video` field type

> **Status:** Draft
> **Target:** SmarkForm `video` field type (core component type)
> **Related:** `file` (`spc/file.md`) — the `video` type **extends** the `file`
> type, inheriting its value contract, acquisition machinery, list integration
> and download action, adding video-specific display, validation and
> interaction. `image` (`spc/image.md`) is the closest precedent: `video`
> follows the same structure but deliberately **does not** inherit `image`'s
> decoding/enforcement pipeline (see §4.1).

---

## 1. Overview & goals

The `video` field type turns a `<video>` element into a video-upload field. It
inherits the entire `file` contract (spec `spc/file.md`) — same normalized
interior state, same inclusive import, same `format`/`encoding` axes, same
picker/drop/paste acquisition, same singleton pattern, same `download` action,
same list integration — and specializes it for video:

- **Display**: the loaded clip is shown in place via `src` (built from the
  embedded value). When empty (`null`), a **poster frame** is shown instead (a
  generated placeholder by default, overridable with the `placeholder` option,
  or the author's own native `poster` attribute). Videos do **not** autoplay:
  the field preloads metadata for first-frame preview and leaves playback to
  the user (see `smark_video_click`, §3.5).
- **Validation**: on interactive acquisition, bytes must actually **parse as a
  playable media container** — a metadata-level probe on an off-DOM `<video>`
  element (`smark_video_validate`, default on). A cheap byte-size cap
  (`video_maxSize`) can reject oversized clips before their bytes are read.
- **Interaction**: click / `Space` / `Shift+Space` open the OS picker when the
  field is in pick mode; when the author opts into playback (native `controls`
  or `smark_video_click:"play"`), clicks and `Space` control playback instead.
  `Delete`/`Backspace` clear. Drag & drop and paste replace — mirroring and
  extending the `file` keyboard contract.
- **Value semantics unchanged**: the video is a *field value* — SmarkForm never
  alters or re-encodes the stored bytes. Only the *presentation*
  (`src`/`poster`) and playback affordances are managed; authored presentation
  attributes (`width`, `height`, `controls`, `loop`, `class`, …) are preserved
  untouched.

### Goals

1. **Full `file` parity** — the `video` value IS a file value: same
   self-describing data-URL string / `json` object shapes, lossless round-trip,
   inclusive import.
2. **In-place display** — the authored `<video>` shows the current value (or a
   poster) with zero author JS.
3. **Safe acquisition** — container-level validation (metadata probe) on
   pick/drop/paste.
4. **Keyboard-complete** — upload, clear and (optionally) play/pause without a
   mouse.
5. **Composition** — template pattern, singleton actions, and lists of videos
   (clips gallery) work exactly like `file`.

### What `video` deliberately does NOT do (unlike `image`)

`image` rescales/re-encodes on acquisition because a canvas can synchronously
process a decoded bitmap. **Video transcoding has no equivalent cheap,
synchronous path** — `MediaRecorder` cannot re-encode an arbitrary source
without full playback, and WebCodecs is far too heavy for a form field. So the
`video` type has **no resize, format-conversion or `enforce` policy options** in
v1 (see §4.1): validation is a decodability *probe*, not a transform pipeline,
and `video_enforce` is intentionally absent (there is no "conversion failed"
outcome for it to govern). Size control is a plain byte cap (`video_maxSize`).

---

## 2. Markup & binding model

### 2.1 The native field is a `<video>`

The `video` type binds to an **authored `<video>` element**:

```html
<video data-smark='{"type":"video","name":"clip"}'
       width="640" height="360" controls preload="metadata">
</video>
```

- `me.targetNode === me.targetFieldNode === <video>`.
- The `<video>` is the **display node** for the value (`src`/`poster` are
  managed by the field) and the **focus anchor** for keyboard interaction (the
  field sets `tabindex="0"` unless the author supplied one).
- A `<video>` is **not** a native form field: it has no `.value`, no text
  editing. The value lives entirely in the component's internal state (exactly
  like `file`); the element only *displays* it.
- **`<source>` children are not managed.** A `<video>` element may contain
  candidate `<source>` children (as authored), but once the field sets `src`
  the `<source>` list is inert. The field never inspects, rewrites or removes
  them — the value is exactly one file with exactly one encoding (§4.2).

> **Type inference IS extended.** `inferType()` (component.js §`inferType`)
> maps an authored `<video>` carrying `data-smark` — even a **bare** `data-smark`
> with no options — to the `video` type (`case "video": return "video"`).
> `data-smark` presence alone marks a SmarkForm field, and a `<video>` has no
> text value, no name/value pair, so no other type fits. The same inference
> applies inside list item templates, so a template `<video data-smark>` item
> yields an `of:"video"` list without declaring the type explicitly. Authors
> may still spell out `type: "video"` — it is redundant, not mandatory.

### 2.2 `isSingleton` detection is overridden

`input.render()` decides real-field vs singleton by tag name
(`INPUT`/`SELECT`/`TEXTAREA` → real field). The `video` type must override this:

| targetNode tag | Mode |
|---|---|
| `VIDEO` | **Real field.** Display node + picker + keyboard contract on the `<video>` itself. No inner children are expected. |
| anything else (e.g. `DIV`, `FIGURE`) | **Singleton container.** Exactly **one** inner `<video>` field (+ optional triggers). All `file` singleton behavior applies. |

### 2.3 Singleton pattern (wrappers)

Any container element can wrap the `<video>` and gain the singleton behaviors
(from `file` §3): whole-container drop/paste detection, action triggers inside
the wrapper, delegation of export/import/navigation to the inner field.

```html
<figure data-smark='{"type":"video","name":"clip"}'>
  <video data-smark='{"type":"video"}'
         width="1600" height="900" controls preload="metadata"></video>
  <figcaption>
    <button data-smark='{"action":"download","context":"/clip"}'>Download</button>
  </figcaption>
</figure>
```

- `<figure>` and `<div>` are all valid wrappers — the singleton rule ("exactly
  one inner field, others must be triggers") is tag-agnostic.
- In a `<figure>` wrapper, a `<figcaption contenteditable>` may serve as the
  **editable visible name** (§6.1) — it is neither an inner field nor a trigger,
  only the lone editable text node the field re-hearses.
- Unlike `image`, there is **no `<picture>` analog to bless**: a `<video>`
  element gets its candidates through `<source>` children (not managed, above)
  or a single `src`; the wrapper is a plain container.

### 2.4 Error conditions

- `VIDEO_MISSING_VIDEO`: singleton container has no inner `<video>`-type field
  (or zero inner fields) → `renderError`, mirroring `NOT_A_SINGLETON`.
- `SINGLETON_TYPE_MISMATCH`: reused as-is — singleton `type` must match the
  inner field's `type`.
- `VIDEO_TYPE_ON_INPUT`: an *explicit* `{"type":"video"}` on an `<input>`
  must raise a `renderError` (an `<input type="video">` is not a valid HTML
  input type — browsers treat the attribute as `text` — and has none of the
  `file` value contract). `inferType()` never returns `"video"` for an
  `<input>`. Documented as invalid markup, mirroring `IMAGE_TYPE_ON_INPUT`.

---

## 3. UI model

### 3.1 Display: value → `src` (+ poster fallback)

The field builds the display URL directly from internal state. Because the
interior always stores `data` as **base64** (file spec §7), the src is a plain
data URL — no object URL lifecycle:

```
src = "data:" + type + ";base64," + data
```

- **Value set** → `video.src = <built data URL>`; call `video.load()` so the
  element re-evaluates the new source (unlike `<img>`, media elements cache a
  loaded source and will not pick up a new `src` without `load()`).
- **Value `null`** → clear `src` (so the poster shows) and set `poster` (see
  §3.2).
- **Poster as the graceful fallback.** A media element that cannot render its
  source simply keeps showing its poster / first decodable frame — there is no
  broken-content icon as with `<img>`. An *imported* value a browser cannot
  play therefore shows the poster and the UI stays coherent, while **state is
  kept untouched** — export remains faithful (exactly like `image`'s
  defensive `onerror` fallback, §3.1 of `spc/image.md`). No event listener is
  required for this: it is native media-element behavior.

> **Data URLs as media `src`** are valid and playable in all engines. See §12
> for the large-file considerations (memory footprint, per-browser limits) and
> the object-URL open question (§13).

### 3.2 Poster / empty state

When there is no value, the field displays a **poster frame**:

- **Author's native `poster` attribute wins** if present — the field never
  overrides an authored poster in the empty state.
- Otherwise the field installs its own placeholder, in priority order:
  1. the `placeholder` option (any URL / data-URL string, or `false` to leave
     `poster` empty);
  2. a **generated default poster** — a deterministic, module-level cached
     inline SVG data URL (dark slate, centered play triangle) so an empty video
     field is visibly an "upload a video" affordance without any network or
     asset fetch. Same technique as `image`'s chessboard (`spc/image.md` §3.2).
- **The initial `poster` value is captured at render time** so the field can
  tell "authored poster" from "placeholder the field installed". On a value set
  the field **restores the authored poster** (if any) or removes its own
  placeholder — otherwise the placeholder would keep sitting over the first
  frame until the user plays (§3.6).
- Author markup presentation attributes (`width`, `height`, `controls`, `loop`,
  `muted`, `playsinline`, `class`, `style`, `preload`, …) are **preserved**;
  the field only swaps `src`/`poster` and (in §3.6) fills unset playback hints.

### 3.3 Picker & acquisition

Identical mechanics to `file` (file spec §3): a hidden transient
`<input type="file" accept="…">` is the sole picker trigger; it is never
populated and is reset after every pick. Drop and paste feed bytes straight into
state.

- **`accept` default is `"video/*"`** (author-overridable, e.g.
  `accept="video/mp4,video/webm"`). Applied to the native picker **and** used
  to pre-filter drops/pastes (§4).
- The picker is attached to the target node (real field) or the container
  (singleton), exactly like `file`.
- **Name-less sources** (pastes/screens recorders that carry no file name) are
  given a default name on acquisition (`video.<ext>` derived from the detected
  MIME, defaulting to `video.mp4` when the MIME is unknowable — see §4).

### 3.4 Keyboard contract

The `file` contract (file spec §3) is inherited and extended. Unlike `image`,
`Space` is **not unconditionally free**: the field may double as a mini player.

| Key | Pick mode (no `controls`, `smark_video_click:"pick"`) | Play mode (`controls` present, or `smark_video_click:"play"`/`"auto"` resolving to play) |
|---|---|---|
| `Tab` | Natural tab order (the field sets `tabindex="0"`) | Same |
| `Enter` / `Shift+Enter` | Navigate to the next/previous field (inherited `input` hook) | Same |
| `Space` | **Open the file picker** — `preventDefault()` (also stops page scroll) | **Toggle play/pause** when a value is set — `preventDefault()` (no page scroll); empty value → open the picker |
| `Shift+Space` | **Open the file picker** — yields to the `<details>` folding convention first (same `defaultPrevented` rule as `file`) | **Open the file picker** — always (overrides play/pause; pickers stay reachable in play mode) |
| `Delete` / `Backspace` | **Clear the value** when set (`preventDefault()`); no-op when empty. Toggle: `smark_video_clearOnDelete` (default `true`) | Same — **never** triggers in-DOM playback shortcuts |

> In play mode, `Space` play/pause is implemented by the field's keydown hook
> (`play()`/`pause()` + `preventDefault`), so the contract is identical whether
> the author added native `controls` or not. When native `controls` are
> present the browser's own focused-media Space handling would do the same; the
> hook just makes behavior deterministic and keeps `Shift+Space` available for
> the picker. `Delete`/`Backspace` never collide with `controls` (media
> elements have no native delete shortcut).

### 3.5 Mouse & touch — the click conflict resolved

`<video>` is a *playable media element*, so "click = pick file" (the `image`
rule) collides head-on with "click = play". The field resolves this with an
explicit click-mode option:

| Mode | Value set | Value empty |
|---|---|---|
| `smark_video_click:"pick"` | Click **opens the picker** (swallows nothing — no playback handler installed) | Click opens the picker |
| `smark_video_click:"play"` | Click **toggles play/pause** (field handler `play()`/`pause()`); `Shift+Space`/a replace trigger still pick | Click opens the picker |
| `smark_video_click:"auto"` (default) | `controls` attribute present → behave as `"play"`; otherwise → `"pick"` | Click opens the picker |

- **`"auto"` is the default because it is the only mode that never surprises:**
  an author who wrote `controls` obviously wants a player, and the native
  control bar must keep working (the field never `preventDefault()`s clicks in
  play mode); an author who did *not* write `controls` gets the familiar
  pick-to-upload mouse behavior of `image`.
- **`drop`/`paste` replace work in every mode** — they are independent of the
  click mode (`smark_video_drop` / `smark_video_paste`, default `true`).
- **Native media drag is suppressed**: the field sets `draggable="false"` on
  the `<video>` (unless the author already set it), mirroring `image` §3.5 —
  prevents hijacking clicks and interfering with file drops. List reordering is
  unaffected (the list makes the **item root** draggable; `sortable.deco.js`,
  `image` §3.5).
- `dragover` `preventDefault()` is wired for both real-field and singleton
  paths, as in `file`.

### 3.6 Preview & playback attributes

The field manages only what it must to make a value *previewable* and playback
well-behaved, and **only when the author left the attribute unset**:

- `preload="metadata"` (if unset) — first-frame preview without downloading the
  whole clip.
- In **play mode** only (controls present or play click-mode), `muted` and
  `playsinline` are set if the author did not set them: with `controls` this is
  standard practice (starts silent, works inline on iOS); in programmatic play
  mode it prevents unexpected sound. **The field never sets `autoplay`** in any
  mode.
- `tabindex="0"` (if unset) — focus anchor; `title` set only if unset,
  describing action/state (e.g. `"No video — activate to upload"` /
  `"Video: <name> — activate to replace"`).

These are interaction aids, mirroring the `image` field's `tabindex` /
`draggable` / `title` management (§3.6 of `spc/image.md`). The field does not
touch `controls`, `loop`, `autoplay`, `muted`, `playsinline`, `volume`,
`playbackRate`, `currentTime` or `width`/`height` once the author has set them,
and does not read back playback state.

### 3.7 Accessibility

- `tabindex="0"` (preserving an author-set value) makes the `<video>`
  reachable by keyboard; all interaction is keyboard-complete (§3.4).
- The field **preserves authored semantics** and does **not** change
  `role`/`aria-label`/`aria-*` — keep native media semantics.
- From the browser's perspective a media element with `controls` is already
  fully operable; without `controls`, the field's own keydown handling (Space =
  pick or play, Shift+Space = pick) is the accessible path.
- **Docs guidance (strong):** authors must reserve layout space with
  `width`/`height` attributes matching the media aspect ratio (and/or CSS
  `aspect-ratio`) to avoid CLS, and should consider adding a text transcript /
  captions as content guidance (§8). The field never recomputes layout.

---

## 4. Acquisition validation: media-container probe

On **interactive acquisition** (picker change, drop, paste — real field and
singleton), after `readFileToObject()`, the candidate is additionally verified
to actually **parse as playable media**:

```javascript
const VIDEO_PROBE_TIMEOUT = 4000; // ms — memory-backed probe; see note below

function probeVideo(obj) { // obj: {type, data(base64)}
    return new Promise(resolve => {
        let bytes; // reused byte helpers (file spec §11)
        try { bytes = b64ToBytes(obj.data); }
        catch { return resolve(false); }
        const url = URL.createObjectURL(new Blob([bytes], { type: obj.type || "" }));
        const v = document.createElement("video");
        let done = false;
        const finish = ok => {
            if (done) return;
            done = true;
            clearTimeout(t);
            v.removeAttribute("src");
            try { v.load(); } catch {}
            URL.revokeObjectURL(url);
            resolve(ok);
        };
        const t = setTimeout(() => finish(false), VIDEO_PROBE_TIMEOUT);
        v.preload = "metadata";
        v.addEventListener("loadedmetadata", () => finish(true));
        v.addEventListener("error", () => finish(false));
        v.src = url;
    });
}
```

- **`loadedmetadata` is the guarantee.** It fires once the container and header
  metadata (duration, dimensions, first sample offsets) parse — i.e. the file
  is a *real media container*, not a renamed text file. Because the bytes come
  from an **object URL backed by in-memory bytes**, the parse resolves in
  milliseconds or errors immediately — there is no network stall.
- **Honest limit:** `loadedmetadata` is NOT a full frame-decode. A file whose
  *codec track* is undecodable in the current browser can still fire
  `loadedmetadata` and fail at actual playback (§4.2). This is the best the
  platform exposes without a full play-through; the probe deliberately does not
  attempt playback.
- **Cheap MIME pre-check:** `v.canPlayType(obj.type || "") !== ""` is consulted
  *before* the blob probe as a fast positive/negative discriminator (engines
  return `"probably"`/`"maybe"` for recognized types and `""` for unknown). It
  is advisory only — the `loadedmetadata` probe is authoritative. (This mirrors
  how `image`'s `accept` filter is advisory and the decode test is the real
  gate.)
- A file that passes the `accept` filter but fails the probe (wrong MIME, stale
  extension, corrupted bytes) is **rejected exactly like an un-accepted file**:
  the previous value stays, no `change` event fires.
- **`video_maxSize` (byte cap)** is checked *before* any bytes are read (it
  uses `file.size`) — see §4.4.
- Option: `smark_video_validate` (default `true`); set `false` to rely on
  `accept`/MIME filtering alone. Interactive acquisition only — `import()`
  always trusts data (file spec §12; an undecodable import simply fails to
  render and §3.1's poster keeps the UI coherent).

> **Lists:** batch acquisition must stay safe, so the `video` type **overrides
> the inherited static `acquire()`/`toObjects()`** to probe (and byte-cap) each
> result and drop failures from the batch (see §7).

### 4.1 No conversion pipeline (deliberate)

`image` (§4.1 of `spc/image.md`) resizes/re-encodes because a decoded bitmap
can be drawn and encoded synchronously. **Video re-encoding cannot.** The two
plausible engines are both rejected for v1:

- `MediaRecorder` — captures from a *played* stream only; cannot ingest a raw
  file and mandates a fixed (container/codec) output; re-encoding a source to
  a different codec is not scriptable through it.
- `WebCodecs` (`VideoDecoder`/`VideoEncoder`) — capable but heavy: requires
  full demuxing, frame pumps, muxing and per-codec encoder configuration;
  disproportionate for a form field and with inconsistent engine support.

Consequences, stated as API realities:

- **No `video_resize`, `video_format`, or `video_enforce`.** Uploaded bytes are
  stored and exported verbatim (`image`-style "conversion is best-effort, the
  mode decides on failure" has nothing to govern here, so the whole
  `image_enforce` B/C outcome matrix is **absent on purpose**).
- "Downsizing" a clip means telling the *user* to produce a smaller file — the
  byte cap `video_maxSize` (§4.4) is the pragmatic v1 control.
- If transcoding ever arrives it would be an opt-in pipeline with its own
  `video_format` option and enforcement modes (§13).

### 4.2 Decodability matrix (the honest limits)

"Plays everywhere" is not true of any format. The field accepts what the
**browser** can probe (§4); authors who need portability should pick from this
reality:

| Container / codec combo | Chromium | Firefox | WebKit/Safari |
|---|---|---|---|
| MP4 (H.264 + AAC) | ✓ | ✓ | ✓ (universally supported) |
| WebM (VP8/VP9 + Opus/Vorbis) | ✓ | ✓ | Safari 14.1+ (VP9); older Safari: no |
| Ogg / Theora | ✓ | ✓ | ✗ (never supported) |
| HEVC (H.265) / AV1 / DV | engine- and hardware-dependent | | |
| MKV / FLV / etc. | ✗ (not in the file picker's sane default) | | |

- The browser's **`canPlayType`** usually over-approximates: a `"maybe"` for a
  codec can still fail at playback. This is precisely why the probe (§4) is
  metadata-authoritative and why the spec documents "decodability" rather than
  "playability".
- **Recommendation for docs:** target **H.264+AAC MP4** (everything plays it)
  as the primary upload format; accept WebM as a secondary.

### 4.3 Notification: toast + cancellable event

When `video_maxSize` (or any future requirement) raises a rejection the field:

1. **Dispatches a DOM event** on its `targetNode` — `smark:videoNotice`,
   `bubbles: true`, `detail: {kind, code, message, mode, name, requirement}`
   (e.g. `kind: "rejection"`, `code: "VIDEO_TOO_LARGE"`,
   `requirement: {maxBytes: 52428800}`);
2. **Unless a handler called `preventDefault()`**, shows an **in-page toast** —
   the same transient `role="status"` / `aria-live="polite"` notice channel as
   `image` §4.3, with the reason ("Video is 80 MB but `video_maxSize` is
   50 MB").

`window.alert()`/`window.confirm()` stay avoided (blocked in sandboxed
iframes), exactly as documented in `spc/image.md` §4.3. **Validation-probe
failures stay silent** (§4) — they are *rejections of unaccepted files*, not
requirement notices, matching `image`'s silent decode gate.

### 4.4 `video_maxSize` (byte cap)

| Option | Type | Default | Effect |
|---|---|---|---|
| `video_maxSize` | number (bytes) | — | Reject acquisition when `file.size` exceeds the cap — checked **before reading bytes** (cheap, synchronous on `File.size`) |

- Rejection follows §4.3 (`smark:videoNotice` + toast, kind `rejection`),
  previous value stays, no `change` event.
- The cap is *input-only* (acquisition): `import()` trusts data and can import
  larger values (consistent with `image` — pipeline applies to interactive
  acquisition only). Serves as the v1 "don't let users pick a 2 GB clip"
  control in lieu of transcoding (§4.1).

---

## 5. Internal state model

Identical to `file` (file spec §4) — the value is a normalized file object, and
**no video-specific fields are added**:

```javascript
{
    name: "clip.mp4",
    type: "video/mp4",
    size: 1234567,
    lastModified: 1690000000000,
    data: "AAAAIGZ0eXBpc29tAAA..." // interior always base64
}
```

- Empty state = `null` (displays the poster, §3.2).
- `defaultValue = null`, `emptyValue = null` — inherited from `file`.
- **No `duration`, `width`/`height`, `fps` or bitrate metadata.** The video is
  a field value; SmarkForm does not derive, store or export media metadata
  (same decision as `image`'s "no `width`/`height`" rule, `spc/image.md` §5).
  Layout sizing is the author's via `width`/`height`/`aspect-ratio` (§8); a
  future optional metadata axis is an open question (§13).

---

## 6. Export / import

The `video` type exports/imports **exactly the `file` contract**
(file spec §5–§6); only the **name** resolution differs — identical to `image`
§6.1 (a media element has no text `value`):

### 6.1 Export

- Returns `null` when empty.
- **Default (raw):** self-describing data-URL string —
  `"data:video/mp4;name=clip.mp4;size=1234567;lastModified=1690000000000;base64,…"`.
  (`size` always recomputed from decoded bytes.)
- **`{"format":"json"}`:** complete `{name, type, size, lastModified, data}`
  object with `data` per the `encoding` option.
- **Name resolution:** a `<video>` has no text *field*, so the `file`
  implementation's "edited-name-wins" `.value` rule must **not** reach
  `String(undefined)` on a media element — the override omits it. The **editable
  caption** is the editable file name instead: when a `<figure>` singleton (or
  gallery item, §7) has a `<figcaption contenteditable>`, its trimmed text
  becomes the export `name` with the same precedence as `file`
  (`edited caption` > `stored name`). The caption **always mirrors the current
  name** — set on acquisition/import, emptied on `Delete`/`clear`, re-hearsed
  on `input`/`blur` (export restaging, `image` §6.1). **No extra metadata is
  added to the value.**

### 6.2 Import

Identical to `file`, fully inclusive:

- a data-URL string,
- a full or partial object,
- a bare payload string (decoded per `encoding`),
- a JSON string of any of the above.

Imported values are normalized into state and **displayed immediately** via the
§3.1 `src` build. `import()` does **not** probe or byte-cap (§4) and never
touches playback state.

---

## 7. Lists of videos

A list whose item template is the `video` type:

```html
<ul data-smark='{"type":"list","name":"clips","of":"video","accept":"video/*"}'>
  <li><video data-smark='{"type":"video"}'
             width="240" height="135"></video></li>
</ul>
```

- **Preview**: each item's `<video>` displays the file's poster/first frame —
  a gallery of clip pickers (author controls sizing/presentation and whether
  each item is a player by writing/omitting the `controls` attribute in the
  item template markup).
- **Batch add**: `addItem` uses the inherited static `acquire()` (multi-file
  picker) — overridden to **probe-validate and byte-cap** each selection (§4);
  `max_items` overflow confirmed via `window.confirm` as in `file` §10.
- **OS drop append**: works through the list's drop handling — already
  **capability-based** (`list.type.js` / `sortable.deco.js` check
  `isFileLike`, landed with `image`), so `of:"video"` needs **no list changes**.
- **Singleton-drop suppression inside the list**: item-singletons suppress
  their own container drop inside a video-capable list (drops on an existing
  item append instead of replacing it) via the same `isFileLike` capability —
  inherited automatically from `file` (no `video`-specific code; this is the
  generalized refactor `spc/image.md` §7 already landed).
- **Paste stays item-scoped** (there is no list-level paste handler).
- **Per-item captions:** a gallery item template may include its own
  `<figcaption contenteditable>`, giving each clip the editable file name
  exactly like a `<figure>` singleton (§6.1).

---

## 8. Layout & author guidance (CLS)

The field manages **only the embedded value presentation** (`src`/`poster` +
unset playback hints, §3.6). It never changes `width`, `height`, `class`,
`style` or other layout-affecting attributes.

**Documentation must strongly highlight:**

- **Reserve the media box.** A video has an intrinsic aspect ratio, so the
  canonical snippet is `width`/`height` attributes matching the clip's ratio
  (and/or CSS `aspect-ratio: 16/9; max-width: 100%;`), preventing layout shift
  when a different-sized clip is later picked/imported.
- **`controls` is a playback affordance.** Authors who write `controls` get a
  player (`smark_video_click:"auto"` §3.5); authors who leave it out get a
  pick-to-upload thumbnail with `Space`/`Shift+Space`/click-to-pick.
- **Format guidance** (§4.2): prefer H.264+AAC MP4.
- **Content guidance**: a text transcript or captions alongside the field is
  the author's responsibility — SmarkForm stores the raw file only.

---

## 9. Options (in `data-smark`)

| Option | Type | Default | Purpose |
|---|---|---|---|
| `type` | string | — | `"video"` |
| `name` | string | — | Field name (JSON key) |
| `format` | `"raw"` \| `"json"` | `"raw"` | Export representation (inherited from `file`) |
| `encoding` | `"base64"` \| `"base64url"` \| `"hex"` | `"base64"` | Payload byte encoding (inherited from `file`) |
| `accept` | string | `"video/*"` | Native picker filter, also applied to drops/pastes |
| `placeholder` | URL/data-URL string \| `false` | generated poster | Empty-state poster; `false` = leave `poster` empty; an authored `poster` attribute always wins (§3.2) |
| `smark_video_open` | boolean | `true` | Click / `Space` / `Shift+Space` open the picker (pick mode) |
| `smark_video_drop` | boolean | `true` | Drag & drop replaces the value |
| `smark_video_paste` | boolean | `true` | Paste replaces the value |
| `smark_video_validate` | boolean | `true` | Media-container probe on acquisition (§4) |
| `smark_video_clearOnDelete` | boolean | `true` | `Delete`/`Backspace` clear the value |
| `smark_video_click` | `"auto"` \| `"pick"` \| `"play"` | `"auto"` | Resolves the click/`Space` conflict (§3.4–§3.5) |
| `video_maxSize` | number (bytes) | — | Reject acquisition above the byte cap, with notice (§4.4) |

> **Naming:** `video_`-prefixed options (`video_maxSize`) follow the `image_`
> convention (`spc/image.md` §9). `smark_video_*` toggle names mirror
> `smark_image_*`/`smark_file_*`; the default of `true` is documented for each
> so `smark_file_*` fallbacks are **not** offered (`smark_video_*` are the
> canonical names and the only ones honored — unlike `image`, there is no
> `accept`-name collision that justified the fallback aliases).

> **Not present (by design):** `video_resize`, `video_format`, `video_enforce`
> (§4.1) — no transcoding pipeline; `poster` as an option name (the native
> attribute + `placeholder` cover it, §3.2).

---

## 10. Events & lifecycle

- **`change`** — fires once (`bubbles: true`) whenever the value is set,
  replaced or cleared through pick/drop/paste/`Delete` (mirrors `file` §9).
- **`smark:videoNotice`** — dispatched on the field's `targetNode` (bubbles)
  whenever a requirement (`video_maxSize`, future requirements) raises a
  rejection; `preventDefault()` suppresses the default toast (§4.3). **No event
  is emitted for silent probe rejections** (§4) — those are plain
  unaccepted-file rejections, exactly like `image`'s decode gate.
- `BeforeAction_*` / `AfterAction_*` apply to `export`/`import`/`clear`/`reset`
  as usual.
- **Download action** — inherited from `file` §11 unchanged, with the name
  precedence adjusted: `options.filename` || (editable caption when present,
  §6.1) || stored `name`. Trigger usage identical:
  `<button data-smark='{"action":"download","context":"/clip"}'>Download</button>`.

---

## 11. Security & user-gesture considerations

All of `file` §12 applies unchanged:

- `import()` needs no user gesture (bytes already in memory; there is nothing
  to guard).
- Opening the OS picker always requires a real user gesture; the hidden picker
  is soft-clicked **synchronously inside** the click/keydown handler.
- Drop and paste are intrinsic gestures.
- No `require_gesture`-style option exists.

Additional, video-specific:

- **Large-payload awareness** — a video value is a big base64 string in
  memory, in state and in `export()`. Import/export are inherently heavier than
  `image`; documented (not restricted). See §12.
- **No remote loading.** The value is embedded; the field only ever loads
  `data:`/(in-memory object URLs for the probe) sources or the author's own
  poster URL — it never dereferences URLs found inside the media data.

---

## 12. Performance & large-file considerations

- `readFileToObject()` reads the **whole file** into memory on acquisition and
  encodes it as base64 — unavoidable for an embedded value, but a 50 MB clip
  costs ~67 MB of string. This is the same model as `file`/`image`; it is
  called out here because video payloads are routinely orders of magnitude
  larger than images.
- `video_maxSize` (§4.4) is the v1 guard: it rejects before any byte is read,
  so a user who drags a 1.5 GB camera roll onto the field is told "too large"
  without paying the read/encode cost.
- The **value probe** (§4) reads bytes into a Blob + object URL *in addition*
  to `readFileToObject`'s base64 copy; the two coexist (the probe reuses the
  already-decoded bytes where possible). The probe itself is memory-backed and
  fast; revoking the object URL is mandatory (§4 code).
- **Display path**: `src` is a `data:` URL (consistent with `image`, no object
  lifecycle). For very large values this duplicates bytes in the DOM's string
  table; a future object URL display path for `video` is an open question (§13).
  In practice browsers play `data:` media URLs, but authors are advised to keep
  clips reasonably sized.
- Per-browser `data:` URL size ceilings exist (historically ~512 MB in some
  engines) — another reason to keep clips below `video_maxSize` and to revisit
  object URLs if large uploads become a real requirement.

---

## 13. Open questions / future decisions

- **Full play-through validation** — `loadedmetadata` (§4) does not prove the
  *codec track* decodes. A heavier "probe + seek + first-frame" check is not
  exposed by the platform without actual playback; decide later whether a
  silent `SeekToNextFrame`-style attempt (or WebCodecs pre-flight where
  available) is worth the cost.
- **Transcoding pipeline** — `video_resize`/`video_format`/`video_enforce`
  (WebCodecs-based, frame-accurate re-encode) is the eventual extension and
  would slot in exactly where `image`'s canvas pipeline sits, with the same
  B/C outcome matrix. Explicitly deferred (§4.1).
- **Poster/first-frame capture** — exporting a *derived* preview
  (`poster`/thumbnail separate from the value) via WebCodecs `VideoFrame` /
  canvas frame-grab. Out of scope for v1 (like `image`'s exported dimensions);
  would not touch the value contract if added as an extra field.
- **Media metadata in the value** — `duration`, `videoWidth`/`videoHeight`,
  fps/bitrate as optional exported fields (e.g. `{"format":"json"}`+metadata).
  Currently deliberately absent (§5).
- **Object URL display path** — replace the `data:`-URL `src` with a managed
  object URL for large values (revoked on replace/clear). Better memory
  behavior; costs a lifecycle (§12). Decide once large uploads matter.
- **Click-mode fine-tuning** — `smark_video_click:"auto"` keys off the
  `controls` attribute today (§3.5); a long-press/`Shift+click` replace gesture
  or a per-state override (`"pick-when-empty"`) are possible refinements.
- **`audio` field type** — the sibling media type; will mirror this spec minus
  playback-preview complexity (an `<audio>` element is not a visual value).
- **Streaming/hosted values** — `.m3u8` and other URL-based streams are *not
  file values* and stay out of scope (embedded-only, like `file`/`image`).

---

## 14. Relation to PROMPTS.md & `spc/` convention

This spec is the working design for the `video` field type and follows the
`spc/` convention established by `spc/file.md` (§14) and `spc/image.md` (§14):
keep specifications in `spc/` until the design stabilizes, then mirror them
into `PROMPTS.md` as prompt drafts for implementation. The `video` type builds
on the same `file` foundation and is the nearest sibling of `image` (same
value contract, acquisition, singleton, lists and download action; different
validation model — probe instead of decode — and no conversion pipeline); the
two specs reference each other where they diverge.