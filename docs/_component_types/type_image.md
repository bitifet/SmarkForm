---
title: «image» Component Type
layout: chapter
permalink: /component_types/type_image
nav_order: 27

---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/type_image.html depth=3 %}

</details>

## Introduction

The `image` component type extends the [`file`
type]({{ "component_types/type_file" | relative_url }}) to render the field
**in place on a native `<img>` element** — the picture itself *is* the field. It
inherits the `file` value contract (a self-describing data-URL string by
default, or a structured object with `"format":"json"`), its acquisition
machinery (picker, drag & drop, paste), its list integration and its `download`
action, and adds:

- **On-screen display:** the stored bytes are shown directly as the image;
  while empty a placeholder is displayed.
- **Decoded-image validation:** acquired files are actually *decoded*, so a
  broken or non-image file is rejected silently, like an unaccepted file.
- **Best-effort processing:** optional `image_resize` / `image_maxSize` /
  `image_format` conversion on acquisition, with configurable `image_enforce`
  behaviour when a requirement cannot be met or verified.
- **Editable file name:** on `<figure>` wrappers and in galleries, a
  `figcaption contenteditable` mirrors and edits the stored `name`.

Images are **embedded-only**, exactly like `file`: the value always holds the
bytes (as base64 internally), never an external URL.

> **Inference:** bare `<img data-smark>` elements are automatically inferred as
> `image` by `inferType()` — no `"type"` declaration is needed. An explicit
> `{"type":"image"}` on an `<input type="image">` is an error
> (`IMAGE_TYPE_ON_INPUT`): that tag is a form submit-piece, not an image field.
> Use an `<img>` or a singleton container instead.

## Declaring an Image Field

### Real Field

The simplest, most direct form turns any `<img>` element into the field:

```html
<img
    data-smark='{"name":"photo"}'
    width="320" height="200"
    alt="Profile photo"
>
```

**Specify the size.** The field only manages `src` (and the `title` tooltip);
it never touches `width`, `height`, `class` or `style`. Reserve the layout
space in the markup (`width`/`height` attributes shown above, `sizes`, or CSS
sizing like `max-width:100%; height:auto`) so the page does not shift when a
different-sized image is picked or imported.

{% raw %} <!-- image_basic_html {{{ --> {% endraw %}
{% capture image_basic_html -%}
<div id="myForm$$">
    <p>
        <label data-smark="label">Profile photo:</label>
    </p>
    <img
        data-smark='{"name":"photo"}'
        width="320" height="200"
        class="photo"
        alt="Profile photo"
    >
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- image_basic_css {{{ --> {% endraw %}
{% capture image_basic_css -%}
{{""}}#myForm$$ .photo {
    display: block;
    max-width: 100%;
    border: 1px dashed #aaa;
    border-radius: .5rem;
    object-fit: cover;
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- image_basic_notes {{{ --> {% endraw %}
{% capture image_basic_notes -%}
👉 **Inferred type:** the field is a bare `<img data-smark>` — the `image`
   type is inferred from the tag name, no explicit `"type"` needed.

👉 **Click to pick:** click the image (or press **Space** / **Shift+Space**)
   to open the OS file picker. **Delete** / **Backspace** clears the value.

👉 **Drag & paste:** drop an image file onto the field or paste a screenshot —
   both set the value.

👉 **Placeholder:** while empty, the field shows a generated chessboard
   placeholder. Set `"placeholder":"…"` to a URL/data-URL of your own, or
   `"placeholder":false` to leave `src` empty.

👉 **Broken images never land:** an acquired file that cannot be decoded is
   rejected silently — the value stays as it was.

**Try it!** Load the demo value, then click the image and pick a different
file from your disk.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- image_basic_jsHead {{{ --> {% endraw %}
{% capture image_basic_jsHead -%}
// Fetch the SmarkForm logo from the docs site and return it as an embedded
// data URL: image fields store bytes only, never external URLs. The asset
// lives at /assets/logo/ on the built site (docs/assets/logo/ in the repo,
// served there by the co-located test harness).
async function loadSmarkFormLogo(asset, name) {
    const res = await fetch("/assets/logo/" + asset);
    if (!res.ok) throw new Error('SmarkForm logo not found: "/assets/logo/' + asset + '"');
    const bytes = new Uint8Array(await res.arrayBuffer());
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return "data:image/svg+xml;name=" + encodeURIComponent(name || asset) + ";base64," + btoa(binary);
}

var myForm;
(async () => {
    const photo = await loadSmarkFormLogo(
        "smarkform_compact.svg", "SmarkForm Compact.svg");
    myForm = window.myForm = new SmarkForm(document.getElementById("myForm$$"), {
        value: {
            // The playground editor wraps the example fields in a "demo"
            // subform, so the initial value must be nested accordingly:
            demo: { photo },
        },
    });
})().catch(function(err) {
    console.error("Loading the SmarkForm logo failed:", err);
});
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="image_basic"
    htmlSource=image_basic_html
    cssSource=image_basic_css
    notes=image_basic_notes
    jsHead=image_basic_jsHead
    selected="preview"
    showEditor=true
    tests=false
%}

### The Singleton Pattern

Wrapping the field in another element turns the whole wrap area into the field
— the [Singleton
Pattern](/getting_started/core_component_types#the-singleton-pattern) — and
applies **drop**, **paste** and **click** handlers over the *entire container*.
A `<figure>` wrapper additionally turns a `figcaption contenteditable` into the
editable file **name**:

{% raw %} <!-- image_singleton_html {{{ --> {% endraw %}
{% capture image_singleton_html -%}
<div id="myForm$$">
    <figure
        class="drop-zone"
        data-smark='{"type":"image","name":"photo","image_maxSize":[300,300]}'
    >
        <img data-smark width="300" height="200" alt="Photo">
        <figcaption class="caption" contenteditable>(edit file name)</figcaption>
        <button data-smark='{"action":"download"}'>Download</button>
    </figure>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- image_singleton_css {{{ --> {% endraw %}
{% capture image_singleton_css -%}
{{""}}#myForm$$ .drop-zone {
    border: 2px dashed #999;
    border-radius: .5rem;
    padding: 1rem;
    max-width: 420px;
    text-align: center;
}
{{""}}#myForm$$ .drop-zone img {
    display: block;
    max-width: 100%;
    margin: 0 auto;
    border-radius: .25rem;
}
{{""}}#myForm$$ .drop-zone figcaption {
    font-size: .85em;
    font-style: italic;
    color: #666;
    margin: .5rem 0;
    padding: .25em;
}
{{""}}#myForm$$ .drop-zone figcaption:focus {
    outline: 1px dashed #999;
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- image_singleton_notes {{{ --> {% endraw %}
{% capture image_singleton_notes -%}
👉 **The whole dashed box *is* the field.** Click anywhere on it (or press
   **Shift+Space**) to open the picker; drop or paste images onto the box.

👉 **Editable name:** the caption mirrors the stored file name and edits it —
   a non-empty edited caption wins on export and download, exactly like the
   visible name field on a `file`. Typing here never triggers the picker.

👉 **`image_maxSize [300,300]`:** images picked or dropped are **downscaled to
   fit within** 300×300, preserving the aspect ratio (picked images only —
   imports pass through untouched).

👉 **Download:** the **Download** button gets the stored bytes back as a real
   browser download of the current bytes/name.

👉 **Singleton rules:** the container must hold **exactly one** inner field
   (`NOT_A_SINGLETON` otherwise), and it must be an `<img>`
   (`IMAGE_MISSING_IMG` otherwise). Options declared on the container
   (e.g. `image_maxSize`, `accept`, `format`) are inherited by the inner field.

**Try it!** Load the demo value, then edit the caption and download — the file
arrives with the caption's name.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- image_singleton_jsHead {{{ --> {% endraw %}
{% capture image_singleton_jsHead -%}
// Same logo-fetching helper as the previous example: fetch the SmarkForm
// logo, embed it as a data URL and pass it as the initial value.
async function loadSmarkFormLogo(asset, name) {
    const res = await fetch("/assets/logo/" + asset);
    if (!res.ok) throw new Error('SmarkForm logo not found: "/assets/logo/' + asset + '"');
    const bytes = new Uint8Array(await res.arrayBuffer());
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return "data:image/svg+xml;name=" + encodeURIComponent(name || asset) + ";base64," + btoa(binary);
}

var myForm;
(async () => {
    const photo = await loadSmarkFormLogo(
        "smarkform_dark.svg", "SmarkForm Dark.svg");
    myForm = window.myForm = new SmarkForm(document.getElementById("myForm$$"), {
        value: {
            // The playground editor wraps the example fields in a "demo"
            // subform, so the initial value must be nested accordingly:
            demo: { photo },
        },
    });
})().catch(function(err) {
    console.error("Loading the SmarkForm logo failed:", err);
});
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="image_singleton"
    htmlSource=image_singleton_html
    cssSource=image_singleton_css
    notes=image_singleton_notes
    jsHead=image_singleton_jsHead
    selected="preview"
    showEditor=true
    tests=false
%}

## The Placeholder

While the field is empty its `src` shows the default placeholder: a generated
neutral gray-and-white **chessboard** (an inline SVG data URL — deterministic
and offline, no network or asset needed).

* `"placeholder":"…"` — any URL or data URL replaces the chessboard.
* `"placeholder":false` — leave `src` empty (the browser shows its own broken/
  empty-image glyph).

The field never touches the authored `alt` text; keep it for accessibility.
If the browser later fails to render a *loaded* value (e.g. an exotic format),
the field falls back to the placeholder while keeping the value intact for
export, and logs a single `console.warn`.

## Acquiring Images

* **Click / `Space` / `Shift+Space`** open the OS picker (a real user gesture
  is always required; the hidden picker is soft-clicked inside the handler).
  `Shift+Space` yields to the `<details>` folding convention when that wins.
* **Drop** and **paste** replace the value; both are filtered by `accept`
  (default `"image/*"`).
* **`Delete` / `Backspace`** clear the value (`smark_image_clearOnDelete`, on
  by default) — but never while the focus is inside an editable caption, where
  those keys edit text.

Each of the three acquisition paths can be disabled independently with
`smark_image_open` / `smark_image_drop` / `smark_image_paste` (all default to
`true`; the `smark_file_*` names are honored as fallbacks).

Whatever the route, an acquired file must **decode as an image**
(`smark_image_validate`, on by default); a candidate that does not is rejected
silently. Only after that gate are `image_resize`/`image_maxSize`/
`image_format` processed and `image_enforce` consulted below. One `change`
event fires whenever the value is set, replaced or cleared.

## Resizing and Converting

The three processing options act on **decoded, newly acquired** candidates.
Imports (and re-imports of an already-acquired value) pass through untouched.

| Option | Shape | Effect |
|--------|-------|--------|
| `image_resize` | `[w,h]`, `{width,height}` or a bare number (= square) | Resize to an **exact target box** (stretches) |
| `image_maxSize` | same as `image_resize` | **Downscale-only cap**: fit *within* the box preserving aspect ratio |
| `image_format` | `"jpeg"`·`"jpg"`·`"png"`·`"webp"`·`"avif"` (canonical) | Convert the encoded format on acquisition |

Conversion runs through a canvas at ~92% JPEG quality. When the format changes
the file name is re-extended (`photo.png` → `photo.jpg`); when a source has no
name it defaults to `image.<ext>`. `image_format` and `image_jpg` map to the
same MIME type; `jpeg` is canonical. Unverifiable and unsupported outcomes are
reported through `image_enforce` below.

{% raw %} <!-- image_resize_format_html {{{ --> {% endraw %}
{% capture image_resize_format_html -%}
<div id="myForm$$">
    <p>
        <label data-smark="label">Square avatar (auto-resized & converted):</label>
    </p>
    <img
        data-smark='{"name":"avatar","image_resize":[200,200],"image_format":"webp"}'
        width="200" height="200"
        class="avatar"
        alt="Square avatar"
    >
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- image_resize_format_css {{{ --> {% endraw %}
{% capture image_resize_format_css -%}
{{""}}#myForm$$ .avatar {
    display: block;
    max-width: 100%;
    border: 1px dashed #aaa;
    border-radius: .5rem;
    object-fit: cover;
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- image_resize_format_notes {{{ --> {% endraw %}
{% capture image_resize_format_notes -%}
👉 **Pick a photo** and it is stretched into a 200×200 square and, where the
   browser can encode it, converted to **WebP**.

👉 **Not every engine can encode every format.** When the requested conversion
   is unavailable (e.g. WebP on older engines), the original bytes are kept and
   — because `image_enforce` defaults to `"warn"` — an in-page **toast** and a
   bubbling `smark:imageNotice` event explain why.

👉 **Imports are untouched:** demo values and `import()`ed data are displayed
   as-is; the resize/format pipeline only applies to newly picked/dropped/
   pasted files.

**Try it!** Load the demo value, then pick a photo from your disk and watch it
become a 200×200 square.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- image_resize_format_jsHead {{{ --> {% endraw %}
{% capture image_resize_format_jsHead -%}
// Same logo-fetching helper as the previous examples: fetch the SmarkForm
// logo, embed it as a data URL and pass it as the initial value.
async function loadSmarkFormLogo(asset, name) {
    const res = await fetch("/assets/logo/" + asset);
    if (!res.ok) throw new Error('SmarkForm logo not found: "/assets/logo/' + asset + '"');
    const bytes = new Uint8Array(await res.arrayBuffer());
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return "data:image/svg+xml;name=" + encodeURIComponent(name || asset) + ";base64," + btoa(binary);
}

var myForm;
(async () => {
    const avatar = await loadSmarkFormLogo(
        "smarkform_compact.svg", "SmarkForm Compact.svg");
    myForm = window.myForm = new SmarkForm(document.getElementById("myForm$$"), {
        value: {
            // The playground editor wraps the example fields in a "demo"
            // subform, so the initial value must be nested accordingly:
            demo: { avatar },
        },
    });
})().catch(function(err) {
    console.error("Loading the SmarkForm logo failed:", err);
});
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="image_resize_format"
    htmlSource=image_resize_format_html
    cssSource=image_resize_format_css
    notes=image_resize_format_notes
    jsHead=image_resize_format_jsHead
    selected="preview"
    showEditor=true
    tests=false
%}

## Validation and image_enforce

When a requirement (`image_resize`, `image_maxSize` or `image_format`) cannot
be *met* (outcome **B** — known non-conforming conversion unavailable) or
*cannot be verified* (outcome **C** — e.g. decode was skipped, so dimensions or
the real encoded format are unknown), the field reports through
`image_enforce` (`"strict"` | `"hard"` | `"warn"` | `"ignore"`, default
`"warn"`):

| Outcome | `strict` | `hard` | `warn` (default) | `ignore` |
|---------|:--------:|:------:|:----------------:|:--------:|
| **B** — unmet, conversion unavailable | reject | reject | warn | accept silently |
| **C** — cannot be verified | reject | accept | accept | accept |

When the policy emits a notice, the field:
1. dispatches a bubbling **`smark:imageNotice`** `CustomEvent` on its
   `targetNode` with `detail: {kind, code, message, mode, name, requirement}`
   (`kind: "warning"|"rejection"`, codes like `IMAGE_FORMAT_UNSUPPORTED`,
   `IMAGE_DIMENSIONS_UNKNOWN`); and
2. unless a handler called `preventDefault()`, shows an in-page **toast**
   (`role="status"`, auto-dismissed) with the reason.

`window.alert()`/`confirm()` are deliberately avoided: they are silently
blocked inside sandboxed iframes. The event fires either way, so listeners
never miss a notification. A rejection leaves the field value unchanged.

```js
// Replace the toast with your own UX:
field.targetNode.addEventListener('smark:imageNotice', (ev) => {
    ev.preventDefault(); // suppress the default toast
    myCustomNotice(ev.detail.message, ev.detail.kind);
});
```

## Images in Lists (Galleries)

Declaring a list whose item type is `"image"` renders each item as a thumbnail
— the list becomes a gallery:

```html
<ul data-smark='{"type":"list","name":"gallery","of":"image","min_items":0,"max_items":5}'>
    <li data-smark='{"role":"empty_list"}'>(Drop images here…)</li>
    <li data-smark='{"type":"image"}'>
        <img data-smark width="120" height="120" alt="Gallery item">
        <figcaption contenteditable></figcaption>
    </li>
</ul>
```

* **Preview:** each item's `<img>` shows the file's data URL (author controls
  sizing/presentation; reserve space with `width`/`height` to avoid CLS).
* **Batch add:** `addItem` uses the inherited multi-file `acquire()` picker,
  extended to decode-filter and size/format-process **every** selection (§
  `image_*` options on the list apply to the whole batch).
* **OS drop:** dropping files anywhere on the list **appends** items (a drop on
  an existing item appends rather than replaces it — the item's own drop is
  suppressed inside an `of:"image"` list). Paste stays item-scoped.
* **Per-item caption:** the optional `figcaption contenteditable` is each
  thumbnail's editable file name, exactly like the `<figure>` singleton.
* **Limits:** `max_items` overflow is confirmed via `window.confirm`, as for
  `file`.

The list imports/exports a **flat array of data URLs** (or JSON objects with
`"format":"json"`), one entry per image.

{% raw %} <!-- image_list_html {{{ --> {% endraw %}
{% capture image_list_html -%}
<div id="myForm$$">
    <button data-smark='{"action":"addItem","context":"gallery"}' title="Add images">➕ Add images</button>
    <ul data-smark='{"type":"list","name":"gallery","of":"image","min_items":0,"max_items":5}'>
        <li data-smark='{"role":"empty_list"}'>(Drop images here…)</li>
        <li data-smark='{"type":"image"}'>
            <img data-smark width="120" height="120" alt="Gallery item">
            <figcaption contenteditable></figcaption>
        </li>
    </ul>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- image_list_css {{{ --> {% endraw %}
{% capture image_list_css -%}
{{""}}#myForm$$ ul {
    list-style: none;
    padding-left: 0;
    display: flex;
    flex-wrap: wrap;
    gap: .75rem;
}
{{""}}#myForm$$ li {
    margin: 0;
}
{{""}}#myForm$$ li img {
    display: block;
    border: 1px dashed #aaa;
    border-radius: .5rem;
    object-fit: cover;
}
{{""}}#myForm$$ li figcaption {
    font-size: .8em;
    text-align: center;
    color: #666;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- image_list_notes {{{ --> {% endraw %}
{% capture image_list_notes -%}
👉 **Array export:** each image becomes one entry of a flat array of data
   URLs.

👉 **Multi-pick:** click **➕ Add images** — one picker lets you select several
   files at once; a cancelled dialog leaves the list untouched.

👉 **Drop:** drag images from your OS onto the list; each is appended as its
   own thumbnail. Dropping on an existing thumbnail appends too.

👉 **Captions:** each thumbnail's caption mirrors its file name and is
   editable — a non-empty edited caption wins on that item's export.

👉 **Limit (5):** when more images arrive than `max_items` allows you are asked
   to confirm before adding only the first fitting files.

**Try it!** Load the demo value (two images) and then drop another onto any of
them.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- image_list_jsHead {{{ --> {% endraw %}
{% capture image_list_jsHead -%}
// Same logo-fetching helper as the previous examples: fetch the SmarkForm
// logos, embed them as data URLs and pass them as the initial gallery.
async function loadSmarkFormLogo(asset, name) {
    const res = await fetch("/assets/logo/" + asset);
    if (!res.ok) throw new Error('SmarkForm logo not found: "/assets/logo/' + asset + '"');
    const bytes = new Uint8Array(await res.arrayBuffer());
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return "data:image/svg+xml;name=" + encodeURIComponent(name || asset) + ";base64," + btoa(binary);
}

var myForm;
(async () => {
    const [compact, dark] = await Promise.all([
        loadSmarkFormLogo("smarkform_compact.svg", "SmarkForm Compact.svg"),
        loadSmarkFormLogo("smarkform_dark.svg", "SmarkForm Dark.svg"),
    ]);
    myForm = window.myForm = new SmarkForm(document.getElementById("myForm$$"), {
        value: {
            // The playground editor wraps the example fields in a "demo"
            // subform, so the initial value must be nested accordingly:
            demo: { gallery: [compact, dark] },
        },
    });
})().catch(function(err) {
    console.error("Loading the SmarkForm logo failed:", err);
});
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="image_list"
    htmlSource=image_list_html
    cssSource=image_list_css
    notes=image_list_notes
    jsHead=image_list_jsHead
    selected="preview"
    showEditor=true
    tests=false
%}

## Downloading an Image

The `download` action works exactly as for `file` — a **real browser
download** of the stored bytes:

```html
<button data-smark='{"action":"download","context":"photo"}'>Download</button>
```

On an empty field it is a no-op returning `null`. Name precedence:
`filename` trigger option > edited caption (when present) > stored name.
Because a transient user gesture is needed for reliability, wire it to a
trigger button as shown (and seen in the Singleton example above).

## Importing and Exporting Data

The value contract is identical to [`file`]({{ "component_types/type_file"
| relative_url }}#importing-and-exporting-data):

* Empty state → `null` (and the placeholder shows).
* Default **raw** format → self-describing data-URL string:
  `data:image/png;name=photo.png;size=123456;lastModified=1690000000000;base64,…`.
* `"format":"json"` → `{name, type, size, lastModified, data}` object with the
  payload per `encoding` (`"base64"` / `"base64url"` / `"hex"`).
* **Import** accepts a data-URL string, a (partial) object, a bare payload
  string or a JSON string of any of those; `size` is always recomputed.
* Imported values are normalized and **displayed immediately**; `import()` does
  *not* decode-validate (that stays on the acquisition path).
* **No `width`/`height` metadata** is stored or exported — the image is a
  field value; layout sizing is the author's.

The interior state is a normalized file object (`{name, type, size,
lastModified, data}` with `data` always base64) and carries **no
image-specific fields**.

## Limitations

- The **OS picker cannot be opened programmatically** — acquisition always
  requires a real user gesture (click / Space / drop / paste).
- Resize/format conversion handles only the **first frame** of animated images;
  full-frame animation is out of scope.
- `<picture>` wrappers act only as a generic singleton container; responsive
  `srcset`/`sizes` multi-source values are a different feature, not managed.
- MIME metadata is best-effort (past screenshots often lack it): an unknown
  format is the "cannot verify" outcome (C) of `image_enforce`, not a
  rejection.

> **See also:** [`file`]({{ "component_types/type_file" | relative_url }}) —
> the underlying type and value contract; the [Singleton
> Pattern](/getting_started/core_component_types#the-singleton-pattern) and
> [Files in Lists]({{ "component_types/type_file" | relative_url }}#files-in-lists-of-file)).