# Step 15 — Media Types Transfer Map

**Status:** File, Image, Video, and Audio are finalized at their canonical
Component Reference routes. All four pages are indexable; migration flags and
staging comments have been removed. Legacy aliases redirect to the canonical
pages. Every original sampletab ID and capture name remains. Staged legacy pages
are unchanged.

## Page audit and dispositions

| Canonical page | Material retained | Step 15 source/spec corrections |
|---|---|---|
| `docs/_component_reference/file.md` | Four sampletabs (`file_singleton`, `file_basic_usage`, `file_list`, `file_download`), import/export examples, encoding table, list/drop/limits, download example and three custom tests. | Corrected the singleton picker description: drop/paste cover the wrapper, but the inner field opens the picker. Distinguished direct zero-byte acquisition/raw data URLs from object imports where `data:""` means empty, including the possible empty list row. Clarified that real fields pick one file while list batch pickers are multi-file by default. |
| `docs/_component_reference/image.md` | Five sampletabs covering real field, singleton, placeholders, processing, and gallery; URL import, download, enforcement, and layout guidance. | Confirmed acquisition-only decode/resize/format processing versus trusted imports; documented notice cancellation/toast behavior, caption/download name precedence, gallery append behavior, and author-owned layout space. Updated singleton/gallery markup to the `rename` action; legacy `contenteditable` captions remain supported. |
| `docs/_component_reference/video.md` | Four sampletabs with local clips, singleton rename/download, video list, and form-backed list; playback/poster, options, and browser-limit sections. | Confirmed click/play/pick mode, native controls and poster precedence, acquired-file probe/size cap versus trusted import, list append behavior, and that SmarkForm does not capture thumbnails or open a modal. Clarified that a cancellable size notice has a default toast while malformed-media probe failures stay silent. |
| `docs/_component_reference/audio.md` | Four sampletabs with local audio assets, singleton rename/download, audio list, and empty-state affordance; playback, validation, and format guidance. | Confirmed auto click mode from native `controls`, picker/play keyboard behavior, acquisition probe/size cap versus trusted import, list append behavior, and author-controlled native playback. Clarified the cancellable size-notice toast and retained the spec's MP3/MP4-AAC and lossless-format recommendations. |

## Samples, captures, and tests

| Page | Sampletabs | Capture declarations | Custom tests |
|---|---|---:|---|
| File | `file_singleton`, `file_basic_usage`, `file_list`, `file_download` | 19 | `file_singleton_tests`, `file_list_tests`, and `file_download_tests` remain wired; the basic usage sample remains `tests=false`. |
| Image | `image_basic`, `image_singleton`, `image_placeholder`, `image_resize_format`, `image_list` | 19 | All remain `tests=false`; four demoValue captures continue to enable collector-generated round-trip smoke tests. |
| Video | `video_basic`, `video_singleton`, `video_list`, `video_form_list` | 14 | All remain `tests=false`; each retains its demoValue for collector-generated round-trip smoke tests. |
| Audio | `audio_basic`, `audio_singleton`, `audio_list`, `audio_empty` | 14 | All remain `tests=false`; each retains its demoValue for collector-generated round-trip smoke tests. |

Total: **17 sampletab IDs and 66 capture names**, all matching the staged
legacy inventories. No sample ID, capture, demoValue, test capture, local media
asset, or attribution link was removed. The existing authored samples do not
need custom JavaScript captures; behavior is provided by SmarkForm and native
media controls.

## Source-verified behavior and caveats

* `file` stores acquired bytes as base64 internally. `format` selects raw
  data-URL or JSON export; `encoding` selects JSON payload and bare-string
  decoding. `size` is computed from decoded bytes. URL imports fetch and embed
  the data; cross-origin fetches need CORS, and failed fetches warn and resolve
  to the empty value.
* Zero-byte handling is not uniform across all routes. A raw data URL can encode
  an empty base64 payload, and the direct picker/drop/paste path on a real field
  stores a zero-byte `File`. An object with `data:""` normalizes to `null`, so a
  JSON zero-byte export does not round-trip through object import. Wrapper-level
  drops and list ingestion use the object path; list ingestion may create an
  empty item row. This is documented as current behavior, not changed here.
* `file` singleton click-to-pick is handled by the inner field. Its wrapper
  handles drops/pastes outside that field; a click elsewhere on the wrapper
  does not open the file picker. In file-capable lists, the batch picker uses
  `multiple:true` unless `addItem(..., {multiple:false})` is requested. OS drops
  append at the list level; list overflow uses `window.confirm`.
* `image` applies its decode gate and optional resize/max-size/format processing
  only to interactive acquisition. Imports, including URL imports, skip that
  pipeline. `image_enforce` notices are bubbling/cancellable and use an in-page
  toast unless prevented. The field manages `src`/`title`, not dimensions, alt,
  class, or style; authors reserve layout space.
* `video` and `audio` preserve the source bytes. Interactive acquisition checks
  the configured size cap and probes media metadata; malformed probes are
  silently rejected. Imports do not run those checks. Size-cap events are
  cancellable and show a default toast unless prevented. Native `controls` stay
  the playback interface; SmarkForm does not generate thumbnails, transcode, or
  open a modal player.
* `file`/`image`/`video`/`audio` lists append OS file drops rather than replacing
  an existing item. File-like list `addItem` uses its type-specific batch
  acquisition pipeline; paste remains item-scoped.
* Filename precedence is trigger `filename` option, then the edited visible
  name/caption when non-empty, then the stored name. The image singleton/gallery
  examples now demonstrate `action:"rename"`; legacy contenteditable captions
  remain accepted by the shared caption helper.

## Verification

* Reviewed `spc/{file,image,video,audio}.md`, the four field types, shared
  `file_value`, `file_caption`, `media_helpers`, the media spinner, `list.type.js`
  and its sortable decorator, and the associated inference/action code.
* Compared canonical and staged legacy inventories: all 17 sample IDs and 66
  capture names remain; the three File custom tests stay wired. Media assets and
  attribution files referenced by the examples exist.
* Jekyll build passes. Rendered public-link/fragment checks report zero broken
  public links/fragments; all four routes are in the sitemap, old routes are
  excluded, and all four legacy aliases redirect to their canonical pages.
* Node/npm and Playwright are unavailable in this environment, so the docs
  collector and media browser tests were not run. They remain for the user.
* Protected inputs (`docs/_old_*`, `docs/_community/contact.md`, and the
  pre-existing `docs/_data/package.json` change) were not edited by this step.
