---
title: "video Component Type"
layout: chapter
permalink: /component_types/type_video
nav_order: 28
---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary><strong>Table of Contents</strong></summary>

  {% include chaptertoc/type_video.html depth=3 %}

</details>

## Overview

The `video` type extends [`file`]({{ "component_types/type_file" | relative_url }})
and keeps its embedded file value contract, picker/drop/paste acquisition,
import/export, singleton, list, and download behavior.

```html
<video data-smark='{"type":"video","name":"clip"}'
       width="640" height="360" controls preload="metadata"></video>
```

Bare `<video data-smark>` elements infer `type: "video"` automatically. Reserve
the media box with `width`/`height` attributes or CSS `aspect-ratio` to avoid
layout shift when a different clip is loaded.

## Try It

These examples start empty deliberately: no remote video host is required, and
you can upload a local clip in the preview. The playground's **Import** button
can also be used with an exported embedded value.

{% raw %}<!-- video_basic_html {{{ -->{% endraw %}
{% capture video_basic_html -%}
<div id="myForm$$">
    <label for="clip">Clip</label>
    <video id="clip" data-smark='{"name":"clip"}' width="320" height="180" controls preload="metadata"></video>
    <button data-smark='{"action":"pick","context":"clip"}'>Choose or replace video</button>
</div>{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- video_basic_notes {{{ -->{% endraw %}
{% capture video_basic_notes -%}
👉 **Try it!** Choose a local H.264/AAC MP4, WebM, or another format your
browser supports. Interactive uploads use a metadata probe and native controls.

👉 The empty state uses a generated poster. No third-party media host or license
is required, so this example also works offline.
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- video_basic_demoValue {{{ -->{% endraw %}
{% capture video_basic_demoValue -%}
{"clip": null}
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="video_basic"
    htmlSource=video_basic_html
    notes=video_basic_notes
    demoValue=video_basic_demoValue
    selected="preview"
    showEditor=true
    tests=false
%}

### Singleton With An Editable Name

{% raw %}<!-- video_singleton_html {{{ -->{% endraw %}
{% capture video_singleton_html -%}
<div id="myForm$$">
    <figure class="video-card" data-smark='{"type":"video","name":"clip"}'>
        <video data-smark width="320" height="180" controls></video>
        <figcaption contenteditable="true">edit filename</figcaption>
        <button data-smark='{"action":"pick"}'>Choose or replace video</button>
        <button data-smark='{"action":"download"}'>Download</button>
    </figure>
</div>{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- video_singleton_css {{{ -->{% endraw %}
{% capture video_singleton_css -%}
{{""}}#myForm$$ .video-card { max-width: 360px; padding: 1rem; border: 2px dashed #999; text-align: center; background: #fafafa; border-radius: .5rem; }
{{""}}#myForm$$ video { display: block; width: 100%; height: auto; }
{{""}}#myForm$$ figcaption { margin: .75rem 0; padding: .25rem; }
{{""}}#myForm$$ button { margin: .25rem; }
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- video_singleton_notes {{{ -->{% endraw %}
{% capture video_singleton_notes -%}
👉 The wrapper accepts drops and pastes, while the caption edits the exported
filename. Upload a clip, replace **edit filename**, then use **Download**.

👉 Native `controls` supplies playback. SmarkForm keeps the bytes unchanged and
does not generate a thumbnail or modal player.
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- video_singleton_demoValue {{{ -->{% endraw %}
{% capture video_singleton_demoValue -%}
{"clip": null}
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="video_singleton"
    htmlSource=video_singleton_html
    cssSource=video_singleton_css
    notes=video_singleton_notes
    demoValue=video_singleton_demoValue
    selected="preview"
    showEditor=true
    tests=false
%}

### Video List

{% raw %}<!-- video_list_html {{{ -->{% endraw %}
{% capture video_list_html -%}
<div id="myForm$$">
    <ul data-smark='{"type":"list","name":"clips","of":"video","min_items":0,"max_items":4}'>
        <li>
            <video data-smark width="240" height="135"></video>
            <button data-smark='{"action":"removeItem"}'>Remove</button>
        </li>
    </ul>
    <button data-smark='{"action":"addItem","context":"clips"}'>Add video</button>
</div>{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- video_list_notes {{{ -->{% endraw %}
{% capture video_list_notes -%}
👉 Add clips with the list picker or drop files onto the list. Video-capable
lists append OS drops instead of replacing an existing item.
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- video_list_demoValue {{{ -->{% endraw %}
{% capture video_list_demoValue -%}
{"clips": []}
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="video_list"
    htmlSource=video_list_html
    notes=video_list_notes
    demoValue=video_list_demoValue
    selected="preview"
    showEditor=true
    tests=false
%}

### Form Items With Related Metadata

For richer records, make each list item a form. The list supplies `of: "form"`,
so the item wrapper does not need to repeat its type. Each item can then contain
the video plus title, notes, or any other related fields.

{% raw %}<!-- video_form_list_html {{{ -->{% endraw %}
{% capture video_form_list_html -%}
<div id="myForm$$">
    <ul data-smark='{"type":"list","name":"clips","of":"form","min_items":0,"max_items":4}'>
        <li>
            <video data-smark='{"name":"video"}' width="240" height="135"></video>
            <input data-smark='{"name":"title"}' placeholder="Title">
            <textarea data-smark='{"name":"notes"}' rows="2" placeholder="Notes"></textarea>
            <button data-smark='{"action":"removeItem"}'>Remove clip</button>
        </li>
    </ul>
    <button data-smark='{"action":"addItem","context":"clips"}'>Add clip</button>
</div>{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- video_form_list_css {{{ -->{% endraw %}
{% capture video_form_list_css -%}
{{""}}#myForm$$ ul { display: grid; gap: .75rem; padding: 0; list-style: none; }
{{""}}#myForm$$ li { display: grid; gap: .4rem; padding: .75rem; border: 1px solid #ccc; border-radius: .5rem; }
{{""}}#myForm$$ video { width: 240px; max-width: 100%; height: auto; }
{{""}}#myForm$$ input, #myForm$$ textarea { box-sizing: border-box; width: 100%; padding: .4rem; }
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- video_form_list_notes {{{ -->{% endraw %}
{% capture video_form_list_notes -%}
👉 Each row is one form value: the clip travels with its title and notes.
Use **Add clip** to create a row and **Remove clip** to remove the current row.
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- video_form_list_demoValue {{{ -->{% endraw %}
{% capture video_form_list_demoValue -%}
{"clips": [{"video": null, "title": "", "notes": ""}]}
{%- endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="video_form_list"
    htmlSource=video_form_list_html
    cssSource=video_form_list_css
    notes=video_form_list_notes
    demoValue=video_form_list_demoValue
    selected="preview"
    showEditor=true
    tests=false
%}

## Empty State And Playback

An empty field shows an authored native `poster`, the `placeholder` option, or
the generated play-button poster. A value is displayed through an embedded
`data:` URL. The field never changes authored dimensions, classes, styles, or
playback attributes.

Use native `controls` when the field should be a player. Without controls,
`smark_video_click: "pick"` (the default when controls are absent) makes the
video surface an upload affordance. Use `smark_video_click: "play"` for a
programmatic player; `Space` toggles playback and `Shift+Space` still opens the
picker. The field never enables autoplay.

```html
<video data-smark='{"name":"clip","smark_video_click":"play"}'
       width="640" height="360"></video>
```

SmarkForm does not generate a random thumbnail or open a modal player by
default. Capturing a frame requires loading and seeking the media, may fail for
browser-incompatible codecs, and adds work before the form is usable. Authors
can use native controls or attach their own player/modal to the field's value
and `change` lifecycle; the stored value remains the original video bytes.

### Keyboard And Caption Navigation

The video itself is one SmarkForm field. **Enter** moves to the next field and
**Shift+Enter** moves to the previous field. When the video has focus:

- **Space** opens the picker in pick mode, or toggles playback in play mode.
- **Shift+Space** opens the picker even in play mode.
- **Delete** or **Backspace** clears the video when it has a value.

The editable filename caption and trigger buttons are normal browser controls,
so **Tab** and **Shift+Tab** reach them independently. Smooth Enter/Shift+Enter
navigation therefore treats the video as one field, while classic Tab
navigation can enter the caption, edit its filename, and then reach upload,
download, add, or remove buttons. Delete and Backspace edit the caption while
the caption has focus; they clear the video when the video field itself has
focus.

## Validation And Options

Interactive acquisition probes the bytes with an off-DOM video element and
rejects malformed media silently. Set `smark_video_validate: false` to disable
that probe. `video_maxSize` rejects oversized files before reading them and
dispatches cancellable `smark:videoNotice`.

Common options:

- `accept` defaults to `video/*` and filters picker, drop, and paste input.
- `placeholder` accepts a poster URL/data URL or `false`.
- `smark_video_open`, `smark_video_drop`, and `smark_video_paste` disable the
  corresponding interaction when set to `false`.
- `smark_video_clearOnDelete` controls `Delete`/`Backspace` clearing.
- `format` and `encoding` are inherited from `file`.

The type does not transcode, resize, or re-encode video. Imported values are
trusted and embedded; validation applies to interactive acquisition.

{: .warning}
> **Large export warning:** video values are embedded as base64. Exporting a
> large clip into the playground editor serializes the entire payload into a
> textarea and can temporarily freeze the browser. This is a limitation of
> displaying a large JSON/data-URL value in a text editor, not a media playback
> requirement. Production applications should avoid rendering multi-megabyte
> exports in a textarea and should submit/store the value through an appropriate
> binary or server-side path.

## Singletons And Lists

A wrapper containing exactly one inner `<video>` becomes a singleton. A
`figcaption[contenteditable]` can mirror and edit the stored filename:

```html
<figure data-smark='{"type":"video","name":"clip"}'>
  <video data-smark width="320" height="180" controls></video>
  <figcaption contenteditable></figcaption>
</figure>
```

Lists use `of: "video"` and inherit file-list acquisition and drop behavior:

```html
<ul data-smark='{"type":"list","name":"clips","of":"video"}'>
  <li data-smark='{"type":"video"}'>
    <video data-smark width="240" height="135"></video>
  </li>
</ul>
```

OS drops append video items in a video-capable list. Captions remain item-local.

## Browser Limits

The metadata probe confirms that the browser recognizes the media container;
it cannot guarantee every codec will play. H.264/AAC MP4 is the safest shared
format. Video values are embedded as base64, so use `video_maxSize` to keep
memory and data-URL costs appropriate for the application.
