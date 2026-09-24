---
title: "audio Component Type"
layout: chapter
permalink: /component_types/type_audio
nav_order: 29
---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary><strong>Table of Contents</strong></summary>

  {% include chaptertoc/type_audio.html depth=3 %}

</details>

## Overview

The `audio` type extends [`file`]({{ "component_types/type_file" | relative_url }})
and keeps its embedded file value contract, picker/drop/paste acquisition,
import/export, singleton, list, and download behavior.

```html
<audio data-smark='{"type":"audio","name":"clip"}'
       controls preload="metadata"></audio>
```

Bare `<audio data-smark>` elements infer `type: "audio"` automatically. Unlike
video, an empty audio element has no visual box, so add a singleton wrapper or
companion triggers when you want an empty-state upload affordance.

{: .warning}
> **Large export warning:** audio values are embedded as base64. Exporting a
> large clip into the playground textarea serializes the entire payload and can
> temporarily freeze the browser. This is a limitation of displaying a large
> JSON/data-URL value in a textarea, not a media playback requirement. Production
> applications should avoid rendering multi-megabyte exports in a textarea and
> should submit/store the value through an appropriate binary or server-side path.

## Try It

These examples use a small locally bundled audio track so they work without a
remote media host. You can replace it with your own audio in the preview. The
playground's **Import** button can also be used with an exported embedded value.

### Basic Real Audio Field

{% raw %}<!-- audio_basic_html {{{ -->{% endraw %}
{% capture audio_basic_html -%}
<div id="myForm$$">
    <strong>Clip</strong>
    <audio data-smark='{"name":"clip"}' controls preload="metadata"></audio>
    <button data-smark='{"action":"pick","context":"clip"}'>Choose or replace audio</button>
</div>{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- audio_basic_notes {{{ -->{% endraw %}
{% capture audio_basic_notes -%}
👉 **Try it!** The `<audio>` element is the field itself. Because it has native
`controls`, clicking it controls playback; use the button to upload or replace
the clip.

👉 Choose an MP3, MP4/AAC, Ogg, WAV or another format your browser supports.
The example starts with a small locally bundled track loaded by `demoValue`.
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- audio_basic_demoValue {{{ -->{% endraw %}
{% capture audio_basic_demoValue -%}
{"clip": "/assets/audio_test.mp3"}
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="audio_basic"
    htmlSource=audio_basic_html
    notes=audio_basic_notes
    demoValue=audio_basic_demoValue
    selected="preview"
    showEditor=true
    tests=false
%}

### Singleton With An Editable Name

{% raw %}<!-- audio_singleton_html {{{ -->{% endraw %}
{% capture audio_singleton_html -%}
<div id="myForm$$">
    <figure class="audio-card" data-smark='{"type":"audio","name":"clip"}'>
        <audio data-smark controls preload="metadata"></audio>
        <figcaption data-smark='{"action":"rename"}'>edit filename</figcaption>
        <button data-smark='{"action":"pick"}'>Choose or replace audio</button>
        <button data-smark='{"action":"download"}'>Download</button>
    </figure>
</div>{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- audio_singleton_css {{{ -->{% endraw %}
{% capture audio_singleton_css -%}
{{""}}#myForm$$ .audio-card { max-width: 360px; padding: 1rem; border: 2px dashed #999; text-align: center; background: #fafafa; border-radius: .5rem; }
{{""}}#myForm$$ audio { display: block; width: 100%; }
{{""}}#myForm$$ figcaption { margin: .75rem 0; padding: .25rem; }
{{""}}#myForm$$ button { margin: .25rem; }
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- audio_singleton_notes {{{ -->{% endraw %}
{% capture audio_singleton_notes -%}
👉 The wrapper accepts drops and pastes, while the caption edits the exported
filename. Upload a clip, replace **edit filename**, then use **Download**.

👉 Native `controls` supplies playback; the explicit **Choose or replace audio**
button opens the picker. SmarkForm keeps the bytes unchanged and does not
transcode the audio.
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- audio_singleton_demoValue {{{ -->{% endraw %}
{% capture audio_singleton_demoValue -%}
{"clip": "/assets/audio_test.mp3"}
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="audio_singleton"
    htmlSource=audio_singleton_html
    cssSource=audio_singleton_css
    notes=audio_singleton_notes
    demoValue=audio_singleton_demoValue
    selected="preview"
    showEditor=true
    tests=false
%}

### Audio List

{% raw %}<!-- audio_list_html {{{ -->{% endraw %}
{% capture audio_list_html -%}
<div id="myForm$$">
    <ul data-smark='{"type":"list","name":"tracks","of":"audio","min_items":0,"max_items":4}'>
        <li>
            <audio data-smark controls preload="metadata"></audio>
            <button data-smark='{"action":"removeItem"}'>Remove</button>
        </li>
    </ul>
    <button data-smark='{"action":"addItem","context":"tracks"}'>Add track</button>
</div>{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- audio_list_notes {{{ -->{% endraw %}
{% capture audio_list_notes -%}
👉 Add tracks with the list picker or drop files onto the list. Audio-capable
lists append OS drops instead of replacing an existing item.
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- audio_list_demoValue {{{ -->{% endraw %}
{% capture audio_list_demoValue -%}
{"tracks": [
    "/assets/audio_test.mp3",
    "/assets/audio_test.mp4"
]}
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="audio_list"
    htmlSource=audio_list_html
    notes=audio_list_notes
    demoValue=audio_list_demoValue
    selected="preview"
    showEditor=true
    tests=false
%}

### Empty-State Upload Affordance

Without native `controls`, the `<audio>` element has no visible surface. Wrap it
in a singleton container to provide an empty-state label and upload affordance.

{% raw %}<!-- audio_empty_html {{{ -->{% endraw %}
{% capture audio_empty_html -%}
<div id="myForm$$">
    <div class="audio-upload" data-smark='{"type":"audio","name":"clip"}'>
        <audio data-smark preload="metadata"></audio>
        <p class="audio-hint">Drop an audio file or click to upload</p>
        <button data-smark='{"action":"pick"}'>Choose audio</button>
        <span data-smark='{"action":"rename"}'>edit filename</span>
    </div>
</div>{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- audio_empty_css {{{ -->{% endraw %}
{% capture audio_empty_css -%}
{{""}}#myForm$$ .audio-upload { max-width: 360px; padding: 1.5rem; border: 2px dashed #999; text-align: center; background: #fafafa; border-radius: .5rem; }
{{""}}#myForm$$ .audio-hint { margin: 0 0 .75rem; }
{{""}}#myForm$$ button { margin: .25rem; }
{{""}}#myForm$$ [data-smark] { margin-right: .25rem; }
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- audio_empty_notes {{{ -->{% endraw %}
{% capture audio_empty_notes -%}
👉 Because the inner `<audio>` has no `controls`, the whole wrapper is the drop
surface and the button opens the picker. Once a clip is loaded, the audio element
plays through its own `src`; add `controls` if you want a visible player strip.
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- audio_empty_demoValue {{{ -->{% endraw %}
{% capture audio_empty_demoValue -%}
{"clip": "/assets/audio_test.mp3"}
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="audio_empty"
    htmlSource=audio_empty_html
    cssSource=audio_empty_css
    notes=audio_empty_notes
    demoValue=audio_empty_demoValue
    selected="preview"
    showEditor=true
    tests=false
%}

## Empty State And Playback

An empty field shows an inactive `<audio>` element. Because an `<audio>` has no
visual box by itself, authors who want an empty-state affordance should wrap the
element in a singleton container or add companion triggers.

Use native `controls` when the field should be a player. Without controls,
`smark_audio_click: "pick"` (the default when controls are absent) makes the
audio surface an upload affordance. Use `smark_audio_click: "play"` for a
programmatic player; `Space` toggles playback and `Shift+Space` still opens the
picker.

```html
<audio data-smark='{"name":"clip","smark_audio_click":"play"}'
       preload="metadata"></audio>
```

SmarkForm does not transcode or re-encode audio. The stored value remains the
original bytes; presentation is handled through the element's `src`.

### Keyboard And Caption Navigation

The audio itself is one SmarkForm field. **Enter** moves to the next field and
**Shift+Enter** moves to the previous field. When the audio has focus:

- **Space** opens the picker in pick mode, or toggles playback in play mode.
- **Shift+Space** opens the picker even in play mode.
- **Delete** or **Backspace** clears the audio when it has a value.

The editable filename caption and trigger buttons are normal browser controls,
so **Tab** and **Shift+Tab** reach them independently. Delete and Backspace edit
the caption while the caption has focus; they clear the audio when the audio
field itself has focus.

## Validation And Options

Interactive acquisition probes the bytes with an off-DOM `<audio>` element and
rejects malformed media silently. Set `smark_audio_validate: false` to disable
that probe. `audio_maxSize` rejects oversized files before reading them and
dispatches cancellable `smark:audioNotice`.

Common options:

- `accept` defaults to `audio/*` and filters picker, drop, and paste input.
- `smark_audio_open`, `smark_audio_drop`, and `smark_audio_paste` disable the
  corresponding interaction when set to `false`.
- `smark_audio_clearOnDelete` controls `Delete`/`Backspace` clearing.
- `smark_audio_click` (`"auto"` | `"pick"` | `"play"`) resolves the click/`Space`
  conflict. `"auto"` defaults to play when `controls` is present, otherwise pick.
- `smark_audio_autoPick` opens the picker after rendering when `true` (subject
  to the browser's user-gesture policy).
- `audio_maxSize` byte cap rejects acquisition above the limit.
- `format` and `encoding` are inherited from `file`.

The type does not transcode or re-encode audio. Imported values are trusted and
embedded; validation applies to interactive acquisition.

## Format Recommendations

For universal playback, prefer **MP3** or **MP4/AAC**. WAV and FLAC work in all
major browsers if lossless fidelity is needed. Ogg Vorbis/Opus and WebM/Opus are
fine on Chromium and Firefox but may fail on Safari.

## Singletons And Lists

A wrapper containing exactly one inner `<audio>` becomes a singleton. Mark an
editable filename with the `rename` trigger action; SmarkForm sets
`contenteditable` and synchronizes the stored filename automatically:

```html
<figure data-smark='{"type":"audio","name":"clip"}'>
  <audio data-smark controls preload="metadata"></audio>
  <figcaption data-smark='{"action":"rename"}'></figcaption>
</figure>
```

Lists use `of: "audio"` and inherit file-list acquisition and drop behavior:

```html
<ul data-smark='{"type":"list","name":"tracks","of":"audio"}'>
  <li data-smark='{"type":"audio"}'>
    <audio data-smark controls preload="metadata"></audio>
  </li>
</ul>
```

OS drops append audio items in an audio-capable list. Captions remain item-local.

When a list item is an audio field, `addItem` can open the picker immediately as
part of the user's add action. For a form-backed list item containing several
fields, use `smark_audio_autoPick: true` on the particular audio field when an
automatic picker is desired. This is opt-in and browser-dependent: a picker
opened after an asynchronous render may be blocked when no user gesture is
active, so an explicit `pick` trigger remains the reliable fallback.
