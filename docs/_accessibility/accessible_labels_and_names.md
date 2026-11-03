---
title: "Accessible Labels and Names"
layout: chapter
description: "Understand how SmarkForm associates native labels and non-native labels with fields, and what authors must provide."
permalink: "/accessibility/accessible_labels_and_names"
nav_order: 3
---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

SmarkForm can connect a label to its field. It does not write meaningful label
text, choose appropriate group semantics, or make arbitrary form markup
accessible by itself. Use native HTML semantics where they fit, then check the
resulting accessibility tree and behavior in your target browsers.

<details class="chaptertoc">
<summary><strong>📖 Table of Contents</strong></summary>

  {% include chaptertoc/accessible_labels_and_names.html depth=2 %}

</details>

## Native labels and fields

Mark a native `<label>` and its field with `data-smark`:

```html
<label data-smark>Display name</label>
<input name="displayName" data-smark>
```

Without an explicit `target`, SmarkForm associates the label with the next
field in its component context. For a native input, it ensures the input has an
`id` (preserving an authored `id`) and sets the label's `for` attribute to that
value. This is the browser's native label mechanism: clicking the label focuses
the input, and the label text contributes to its accessible name.

Write a visible, meaningful label. A `placeholder` is not a replacement for a
label, and a generated `id` does not provide a name by itself. If application
code or CSS relies on a stable ID, author that ID explicitly.

## Non-native labels and `aria-labelledby`

Use a non-native element such as `<span>` when the label targets a SmarkForm
component without a native field node, such as a `form` or `list`:

```html
<p id="topics-help">Choose one or more topics.</p>
<span data-smark='{"type":"label","target":"topics"}'>Topics</span>
<ul data-smark='{"type":"list","name":"topics","of":"input","min_items":0}'
    aria-labelledby="topics-help">
  <li><input data-smark type="text"></li>
</ul>
```

For a non-native label, SmarkForm ensures the label has an `id` and appends that
ID to the target's `aria-labelledby` token list. Existing tokens are preserved
and not duplicated. In the example, the list keeps `topics-help` and gains the
SmarkForm label ID, so both the instruction and the visible “Topics” text
contribute to its name.

The `target` is a SmarkForm-relative path from the label's parent component.
When a native `<label>` wraps its target field, omit `target`; the two
association methods cannot be used together. See the
[Label component reference]({{ "/component_reference/label" | relative_url }})
for target resolution, `allow_select`, and the full label behavior.

## Try the associations

The example uses a native label for a text input and a non-native label for a
list. Inspect the preview DOM: the native label should have a matching `for`,
and the list's `aria-labelledby` should retain its help-text ID and include the
SmarkForm label ID.

{% raw %}<!-- accessible_labels_names_html {{{ -->{% endraw %}
{% capture accessible_labels_names_html -%}
<div id="myForm$$">
  <p>
    <label data-smark>Display name:</label>
    <input name="displayName" data-smark type="text">
  </p>
  <p id="topics-help">Choose one or more topics.</p>
  <span data-smark='{"type":"label","target":"topics"}'>Topics:</span>
  <ul data-smark='{"type":"list","name":"topics","of":"input","min_items":0}'
      aria-labelledby="topics-help">
    <li><input data-smark type="text"></li>
  </ul>
</div>{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- accessible_labels_names_js {{{ -->{% endraw %}
{% capture accessible_labels_names_js -%}
// SmarkForm adds native `for` and `aria-labelledby` associations after rendering.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- accessible_labels_names_notes {{{ -->{% endraw %}
{% capture accessible_labels_names_notes -%}
**Try it:** Inspect the preview DOM or accessibility tree for the generated
native `for`/`id` pair and the list's combined `aria-labelledby` tokens.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- accessible_labels_names_demoValue {{{ -->{% endraw %}
{% capture accessible_labels_names_demoValue -%}
{
  "displayName": "Ada Lovelace",
  "topics": ["mathematics", "computing"]
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="accessible_labels_names"
    htmlSource=accessible_labels_names_html
    jsSource=accessible_labels_names_js
    notes=accessible_labels_names_notes
    demoValue=accessible_labels_names_demoValue
    showEditor=true
    tests=false
    minHeight=40
%}

## Grouping, focus, and author responsibilities

- Use semantic grouping such as `<fieldset>` and `<legend>` when controls
  belong together. SmarkForm does not add generic landmark, group, or list roles
  to every component container.
- Provide visible focus styling, sufficient contrast, and meaningful names for
  icon-only controls. A `title` or CSS-generated hotkey hint is not a substitute
  for a clear control name.
- Give images appropriate `alt` text. SmarkForm leaves the authored `alt`
  attribute unchanged. Provide captions or transcripts for audio/video where
  the content requires them.
- Consider reduced-motion preferences when adding animations.
- Lists receive `aria-live="polite"` and `aria-atomic="true"`, and media notices
  use a `role="status"` live region. These attributes do not establish how a
  particular screen reader will announce changes; this project has not verified
  those announcements across assistive technologies.

SmarkForm rejects a native `<summary>` used directly as a label and a native
`<label>` placed inside `<summary>`, because the label click conflicts with the
browser's `<details>` toggle. See
[Error Codes]({{ "/advanced_topics/error_codes" | relative_url }}) for those
errors and the [Keyboard Navigation guide]({{ "/accessibility/keyboard_navigation" | relative_url }})
for the implemented `<details>` shortcuts.

{: .hint }
> These association helpers support accessible authoring; they do not certify
> a form or replace testing with its actual markup, browser, and assistive
> technology.
