---
title: «file» Component Type
layout: chapter
permalink: /component_types/type_file
nav_order: 26

---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/type_file.html depth=3 %}

</details>

## Introduction

The `file` component type lets you acquire, display and round-trip *binary*
data (drafts, PDFs, images, …) as part of a SmarkForm form.

- **Imports and Exports:** a `String` (a self-describing data URL) by default,
  or an `Object` when `"format":"json"` is set.
- **Singleton Pattern:** supports the [Singleton
  Pattern](/getting_started/core_component_types#the-singleton-pattern) so a
  whole `<div>` drop-zone can act as the field.
- **Data Conversion:** binary payloads are always stored internally as base64;
  `encoding` only changes how the payload appears in JSON exports and bare
  string imports.

A file field never renders a native OS picker by default: the authored input
is repurposed as a visible, editable *name* field, and clicking it (or
pressing **Shift+Space**) opens a hidden native file input. That hidden
picker is **never populated programmatically** — files can only arrive from a
real user gesture (pick, drag & drop or paste), or from the `import()` action.

> **Note:** `inferType()` does *not* special-case native `<input type="file">`
> elements (`"file"` falls through to `"input"`). You must always declare the
> file type explicitly with `data-smark='{"type":"file",…}'`.

## Declaring a File Field

### Real Field

The most direct form leaves the field as a native `<input>`:

```html
<input
    type="file"
    data-smark='{"type":"file","name":"cv","accept":"application/pdf"}'
    placeholder="Click to pick a PDF, or drop it here…"
>
```

The `type` attribute may be omitted entirely — declaring `"type":"file"` in
`data-smark` is enough. The visible field becomes a normal text input that
shows the currently selected file name (which stays editable and wins on
export when non-empty). A full, playable example follows in the [Raw Format
(data URL)](#raw-format-data-url) section below.

### The Singleton Pattern

Wrapping the field in any other element turns the whole wrap area into the
field; it adopts the Singleton Pattern and applies **drop** and **paste**
handlers over the *entire container*:

{% raw %} <!-- file_singleton_html {{{ --> {% endraw %}
{% capture file_singleton_html -%}
<div id="myForm$$">
    <div class="drop-zone" data-smark='{"type":"file","name":"doc","format":"json","encoding":"hex"}'>
        <input type="file" data-smark placeholder="Click, paste or drop a file here…">
        <button data-smark='{"action":"download"}'>Download</button>
    </div>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- file_singleton_css {{{ --> {% endraw %}
{% capture file_singleton_css -%}
{{""}}#myForm$$ .drop-zone {
    border: 2px dashed #999;
    border-radius: .5rem;
    padding: 3rem 2rem;
    text-align: center;
}
{{""}}#myForm$$ .drop-zone button {
    margin-top: 1rem;
    text-align: center;
}
{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- file_singleton_notes {{{ --> {% endraw %}
{% capture file_singleton_notes -%}
👉 **Singleton container:** the whole dashed box *is* the field.

  * Click anywhere on it (or press **Shift+Space**) to open the OS picker.
  * Drop files from your file manager straight onto the box.
  * **Paste** an image/screenshot onto it.

👉 **Structured export:** because this example uses
   `"format":"json","encoding":"hex"`, the export is a plain object whose
   `data` is a hexadecimal string:

   ```json
   {
     "name": "payload.bin",
     "type": "application/octet-stream",
     "size": 3,
     "lastModified": 1700000000000,
     "data": "00ff0a"
   }
   ```

👉 **Partial imports are fine:** import just `{ "name": "x.bin",
   "type": "…", "data": "…" }` — `size` and `lastModified` are recomputed /
   auto-completed for you.

👉 **Download:** the **Download** button gets the stored bytes back as a real
   browser download — the singleton container delegates to its inner field.

**Try it!** Load the demo value, then import the same object with only
`{ "name": "renamed.bin", "data": "00ff0a" }`.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- file_singleton_demoValue {{{ --> {% endraw %}
{% capture file_singleton_demoValue -%}
{
    "doc": {
        "name": "payload.bin",
        "type": "application/octet-stream",
        "size": 3,
        "lastModified": 1700000000000,
        "data": "00ff0a"
    }
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- file_singleton_tests {{{ --> {% endraw %}
{% capture file_singleton_tests -%}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    // Raw data-URL string import (payload is always base64 on the wire);
    // export returns the structured object with hex-encoded data.
    await writeField('doc', 'data:text/plain;name=note.txt;size=2;lastModified=0;base64,YWI=');
    expect(await readField('doc')).toEqual({
        name: 'note.txt',
        type: 'text/plain',
        size: 2,
        lastModified: 0,
        data: '6162', // "ab" in hex
    });

    // Partial object import: accepted fields preserved, size is recomputed
    // from the payload and lastModified auto-completed.
    await writeField('doc', { name: 'notes.txt', type: 'text/plain', data: '6162' });
    const exported = await readField('doc');
    expect(exported).toMatchObject({
        name: 'notes.txt',
        type: 'text/plain',
        size: 2,
        data: '6162',
    });
    expect(typeof exported.lastModified).toBe('number');

    // Bare payload string import, decoded with the configured (hex) encoding.
    await writeField('doc', '414243'); // "ABC"
    expect(await readField('doc')).toMatchObject({ size: 3, data: '414243' });

    // Drag & drop of a real File over the whole singleton container.
    await page.evaluate((id) => {
        const dt = new DataTransfer();
        dt.items.add(new File(['Hi'], 'hi.txt', { type: 'text/plain' }));
        const zone = document.querySelector(`#myForm-${id} .drop-zone`);
        zone.dispatchEvent(new DragEvent('drop', {
            bubbles: true,
            cancelable: true,
            dataTransfer: dt,
        }));
    }, id);
    await expect.poll(
        () => page.evaluate(async () => (await myForm.find('/doc').export()).data),
        { timeout: 3000 }
    ).toBe('4869'); // "Hi" in hex

    // Download is delegated from the singleton container to its inner field:
    // the stored bytes arrive as a real browser download.
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.click(`#myForm-${id} .drop-zone button`),
    ]);
    expect(download.suggestedFilename()).toBe('hi.txt');
    const stream = await download.createReadStream();
    const chunks = [];
    for await (const c of stream) chunks.push(c);
    expect(Buffer.concat(chunks).toString('utf8')).toBe('Hi');
};

{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="file_singleton"
    htmlSource=file_singleton_html
    cssSource=file_singleton_css
    notes=file_singleton_notes
    selected="preview"
    showEditor=true
    demoValue=file_singleton_demoValue
    tests=file_singleton_tests
%}

> The Singleton Pattern requires the container to hold **exactly one** field;
> otherwise a `NOT_A_SINGLETON` error is raised at render time. Any
> `data-smark` options declared on the container (e.g. `accept`, `format`,
> `encoding`, `smark_file_*`) are inherited by the inner field.

## Importing and Exporting Data

The component's interior state always stores the payload as plain base64.
`encoding` only selects how the payload is *written* on JSON exports and how
*bare* string payloads are decoded on imports; `format` selects between the
data-URL string and the structured object. A `data:` URL is always base64,
regardless of `encoding`.

### Raw Format (data URL)

The default `"format":"raw"` exports a single, self-describing string:

```
data:text/plain;name=hello.txt;size=5;lastModified=1700000000000;base64,aGVsbG8=
```

The header carries the MIME type, the (URL-encoded) file name, the size in
bytes and the last-modified timestamp; `size` is always recomputed from the
payload on export.

{% raw %} <!-- file_basic_usage_html {{{ --> {% endraw %}
{% capture file_basic_usage_html -%}
<div id="myForm$$">
    <label data-smark="label">Resume (PDF):</label>
    <input
        type="file"
        data-smark='{"type":"file","name":"cv","accept":"application/pdf"}'
        placeholder="Click to pick a PDF, or drop it here…"
    >
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- file_basic_usage_css {{{ --> {% endraw %}
{% capture file_basic_usage_css -%}
{{""}}#myForm$$ input {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: .5em .75em;
    border: 1px dashed #aaa;
    border-radius: .5rem;
}
{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- file_basic_usage_notes {{{ --> {% endraw %}
{% capture file_basic_usage_notes -%}
👉 **Raw export:** pick a file (or drop it on the field) and press **⬇️
   Export** — you get a single data-URL string.

👉 **Import anything:** paste one of the following into the JSON editor and
   press **⬆️ Import**:

  * a data-URL string (`name`/`size`/`lastModified` come from the header),
  * a JSON object (or a JSON *string* of one) — partial objects are fine,
  * a bare base64 payload string,
  * `null` (clears the field).

👉 **`accept` filters the picker AND drop/paste**: try dropping a `.png` on
   this field — it is silently ignored (only `application/pdf` is accepted).

**Try it!** Load the demo `cv` value, then replace the imported `name` by
editing the visible text field and export again.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- file_basic_usage_demoValue {{{ --> {% endraw %}
{% capture file_basic_usage_demoValue -%}
{
    "cv": "data:application/pdf;name=resume.pdf;size=5;lastModified=0;base64,aGVsbG8="
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="file_basic_usage"
    htmlSource=file_basic_usage_html
    cssSource=file_basic_usage_css
    notes=file_basic_usage_notes
    selected="preview"
    showEditor=true
    demoValue=file_basic_usage_demoValue
    tests=false
%}

### Structured Format (format: "json")

Setting `"format":"json"` exports a structured object instead of the string:

```json
{
    "name": "payload.bin",
    "type": "application/octet-stream",
    "size": 3,
    "lastModified": 1700000000000,
    "data": "00ff0a"
}
```

`data` is the byte payload encoded per `encoding`. Imports accept the full
object, a *partial* object (`data` is required; everything else may be
omitted), a bare payload string, or a JSON string describing any of the above
— see the [Singleton Pattern](#the-singleton-pattern) example for each case.

### Encodings

`encoding` (default `"base64"`) controls two things:

| Encoding      | JSON export `data`      | Bare string import decoding |
|---------------|-------------------------|-----------------------------|
| `base64`      | Standard base64         | Base64                      |
| `base64url`   | URL-safe base64url      | Base64 / base64url          |
| `hex`         | Lowercase hex           | Hex (`0x`-free)             |

It never affects `data:` URLs, which are always base64.

### Empty Fields

An empty file field exports `null` (never a data URL with an empty payload).
Importing `null`, `undefined`, an empty string or an empty JSON payload
clears the field back to its empty state.

## Options

### accept

Comma-separated MIME types and/or extension suffixes (`.pdf`, `.jpg`). They
are applied to the hidden native picker **and** to every drop/paste, so files
that do not match are silently ignored.

### format and encoding

`"format"`: `"raw"` (default, data-URL string) or `"json"` (structured
object). `"encoding"`: `"base64"` (default), `"base64url"` or `"hex"`.

### Disabling acquisition

Each acquisition path can be turned off independently. All three default to
`true`; set any of them to `false` to disable that route (e.g.
`"smark_file_drop":false` on a container you want to use for dragging *other*
content):

* `smark_file_open` — click / **Shift+Space** opens the OS picker;
* `smark_file_drop` — drag & drop is accepted;
* `smark_file_paste` — clipboard paste is accepted.

## Files in Lists (of: "file")

Declaring a list whose item type is `"file"` gives you a collection of files:

```html
<ul data-smark='{"type":"list","name":"photos","of":"file","min_items":0,"max_items":5}'>
    <li data-smark='{"role":"empty_list"}'>(Drop files here…)</li>
    <li data-smark='{"type":"file"}'>
        <input type="file" data-smark placeholder="Click to pick a file…">
    </li>
</ul>
```

Notice the item template root itself carries `"type":"file"` — each item is a
file field directly, so the list imports/exports a **flat array of data URLs**
(or JSON objects) instead of per-item objects. The list is also what you must
use when you want to prevent SmarkForm from treating the file as the whole
drop-zone: drag-reordering (Sortable) never populates files.

{% raw %} <!-- file_list_html {{{ --> {% endraw %}
{% capture file_list_html -%}
<div id="myForm$$">
    <button data-smark='{"action":"addItem","context":"photos"}' title="Add files">➕ Add files</button>
    <ul data-smark='{"type":"list","name":"photos","of":"file","min_items":0,"max_items":5}'>
        <li data-smark='{"role":"empty_list"}'>(Drop files here…)</li>
        <li data-smark='{"type":"file"}'>
            <input type="file" data-smark placeholder="Click to pick a file…">
        </li>
    </ul>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- file_list_css {{{ --> {% endraw %}
{% capture file_list_css -%}
{{""}}#myForm$$ ul {
    list-style: none;
    padding-left: 0;
}
{{""}}#myForm$$ li {
    margin: .25rem 0;
}
{{""}}#myForm$$ li input {
    box-sizing: border-box;
    width: 100%;
    padding: .5em .75em;
    border: 1px dashed #aaa;
    border-radius: .5rem;
}
{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- file_list_notes {{{ --> {% endraw %}
{% capture file_list_notes -%}
👉 **Array export:** the list exports one entry per file — a flat array of
   data URLs (keep `"format":"json"` to get objects).

👉 **Multi-pick:** click **➕** — because the item type is file-capable, a
   single picker lets you select several files at once. A cancelled dialog
   leaves the list untouched.

👉 **Drop:** drag files from your OS straight onto the list; each is appended
   automatically as its own item.

👉 **Limit (5):** when more files are dropped/imported than `max_items`
   allows, you are asked to confirm adding only the first fitting files.

**Try it!** Load the demo value (two files) and then drop a third file onto
the list.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- file_list_demoValue {{{ --> {% endraw %}
{% capture file_list_demoValue -%}
{
    "photos": [
        "data:text/plain;name=a.txt;size=2;lastModified=0;base64,YWI=",
        "data:text/plain;name=b.txt;size=2;lastModified=0;base64,YmI="
    ]
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- file_list_tests {{{ --> {% endraw %}
{% capture file_list_tests -%}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    // Importing an array of data-URLs adds one item per file and exports
    // them back as a flat list of scalar data-URL strings.
    await writeField('photos', [
        'data:text/plain;name=a.txt;size=2;lastModified=0;base64,YWI=',
        'data:text/plain;name=b.txt;size=2;lastModified=0;base64,YmI=',
    ]);
    expect(await readField('photos')).toEqual([
        'data:text/plain;name=a.txt;size=2;lastModified=0;base64,YWI=',
        'data:text/plain;name=b.txt;size=2;lastModified=0;base64,YmI=',
    ]);

    // Programmatic single add with a structured object.  multiple:false
    // bypasses the batch OS picker (which requires a real user gesture).
    await page.evaluate(() => myForm.find('/photos').addItem(
        { name: 'c.txt', type: 'text/plain', data: 'Y2Nj' }, // "ccc"
        { multiple: false, silent: true }
    ));
    const three = await readField('photos');
    expect(three).toHaveLength(3);
    expect(three[2]).toMatch(
        /^data:text\/plain;name=c\.txt;size=3;lastModified=\d+;base64,Y2Nj$/
    );

    // OS-style drop over the whole list appends a new item automatically.
    await page.evaluate((id) => {
        const dt = new DataTransfer();
        dt.items.add(new File(['Hello'], 'hello.txt', { type: 'text/plain' }));
        const list = document.querySelector(`#myForm-${id} ul`);
        list.dispatchEvent(new DragEvent('drop', {
            bubbles: true,
            cancelable: true,
            dataTransfer: dt,
        }));
    }, id);
    await expect.poll(
        () => page.evaluate(async () => (await myForm.find('/photos').export()).length),
        { timeout: 3000 }
    ).toBe(4);
    const four = await readField('photos');
    expect(four).toHaveLength(4);
    expect(four[3]).toMatch(
        /^data:text\/plain;name=hello\.txt;size=5;lastModified=\d+;base64,SGVsbG8=$/
    );
};

{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="file_list"
    htmlSource=file_list_html
    cssSource=file_list_css
    notes=file_list_notes
    selected="preview"
    showEditor=true
    demoValue=file_list_demoValue
    tests=file_list_tests
%}

### Adding Files in Bulk

When the item type is file-capable, the list's `addItem` action opens **one**
multi-file picker before creating any item, so a cancelled dialog leaves the
list untouched. Each chosen file becomes a regular item. Pass
`multiple: false` to `addItem()` to force a single-file picker.

### Dropping Files onto a List

OS drops and pastes over the whole list are converted through the item type's
`toObjects()` helper and appended one by one. Set `"fileDrop":false` on the
list to disable this and keep drag & drop for reordering only.

### Limits and Confirmation

When more files arrive than the remaining `max_items` slots, you are asked to
confirm before adding only the first fitting files. On a full list an
`LIST_MAX_ITEMS_REACHED` error is emitted. The same confirm-guarded truncation
applies to bulk import through `list.import()` (`LIST_IMPORT_OVERFLOW`).

## Downloading a File

A file field's stored bytes can be handed back to the user as a **real
browser download** with the `download` action:

```html
<button data-smark='{"action":"download","context":"cv"}'>Download</button>
```

On an empty field the action is a no-op that returns `null`. The name used
for the downloaded file follows this precedence:

1. An explicit `filename` trigger option (any extra trigger `data-smark`
   property is passed through as an action option);
2. The current visible name of the field if it was manually edited;
3. The original stored file name.

Because the download needs a transient user gesture to be reliable, it is
normally wired to a trigger button; calling `download()` programmatically
takes effect as long as a user gesture is still active.

{% raw %} <!-- file_download_html {{{ --> {% endraw %}
{% capture file_download_html -%}
<div id="myForm$$">
    <div class="dl-row">
        <input data-smark='{"type":"file","name":"report"}' placeholder="Drop a file here or click to browse…">
        <button class="dl-btn" data-smark='{"action":"download","context":"report"}'>Download</button>
    </div>
    <p>
        <button class="dl-renamed" data-smark='{"action":"download","context":"report","filename":"report-copy.pdf"}'>Download as report-copy.pdf</button>
    </p>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- file_download_css {{{ --> {% endraw %}
{% capture file_download_css -%}
{{""}}#myForm$$ .dl-row {
    display: flex;
    gap: .75rem;
}
{{""}}#myForm$$ .dl-row input {
    flex: 1;
    padding: .5em .75em;
    border: 1px dashed #aaa;
    border-radius: .5rem;
}
{{""}}#myForm$$ .dl-row button {
    padding: .5em 1em;
    border-radius: .5rem;
}
{{""}}#myForm$$ .dl-renamed {
    margin-top: 1rem;
}
{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- file_download_notes {{{ --> {% endraw %}
{% capture file_download_notes -%}
👉 **Download:** click **Download** and your browser starts a real download
   of the stored bytes with the original name.

👉 **Empty field:** with no file set the action is a no-op — nothing happens.

👉 **Rename after the fact:** the **Download as report-copy.pdf** button
   passes `filename` as a trigger option, overriding the stored name. Edit the
   visible name field first and the *edited* name wins over the stored one
   too.

**Try it!** Load the demo value, then rename the field to `annual.pdf` and
click **Download** — the file arrives with that name. Then try the
report-copy button.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- file_download_demoValue {{{ --> {% endraw %}
{% capture file_download_demoValue -%}
{
    "report": "data:text/plain;name=report.txt;size=5;lastModified=0;base64,SGVsbG8="
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- file_download_tests {{{ --> {% endraw %}
{% capture file_download_tests -%}
export default async ({ page, expect, id, root }) => {
    await expect(root).toBeVisible();

    // An empty field triggers no download.
    const seen = [];
    page.on('download', (d) => seen.push(d));
    await page.click(`#myForm-${id} .dl-btn`);
    await page.waitForTimeout(250);
    expect(seen).toHaveLength(0);

    // Load the demo file, then downloading yields the stored bytes back.
    await page.evaluate(async () => {
        await myForm.find('/report').import(
            'data:text/plain;name=report.txt;size=5;lastModified=0;base64,SGVsbG8='
        );
    });
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.click(`#myForm-${id} .dl-btn`),
    ]);
    expect(download.suggestedFilename()).toBe('report.txt');
    const stream = await download.createReadStream();
    const chunks = [];
    for await (const c of stream) chunks.push(c);
    expect(Buffer.concat(chunks).toString('utf8')).toBe('Hello');

    // An explicit filename option overrides the stored name.
    const [renamed] = await Promise.all([
        page.waitForEvent('download'),
        page.click(`#myForm-${id} .dl-renamed`),
    ]);
    expect(renamed.suggestedFilename()).toBe('report-copy.pdf');
};

{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="file_download"
    htmlSource=file_download_html
    cssSource=file_download_css
    notes=file_download_notes
    selected="preview"
    showEditor=true
    demoValue=file_download_demoValue
    tests=file_download_tests
%}

## Limitations

- The native OS picker **cannot be opened programmatically**; file acquisition
  always requires a real user gesture (click / **Shift+Space**, drop, or
  paste). Consequently a cancelled picker is indistinguishable from "no
  selection".
- A zero-byte payload is only representable through a **data-URL string
  import** (it exports as a `size:0` object). The *object* form requires a
  non-empty `data` — an empty or missing `data` **clears** the field to the
  `null` empty state, so picking/dropping a genuinely empty (0-byte) file is
  indistinguishable from picking none.
- The picker itself is always multiple-capable; the list decides how many
  files are consumed (`multiple: false` on `addItem` limits the choice to a
  single file).
- `accept` filtering is best-effort on drop/paste: it matches MIME types and
  extension suffixes, and non-matching files are silently ignored.
