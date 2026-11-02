---
title: "Quick Start"
layout: chapter
description: "Build a working SmarkForm in a few steps: annotate HTML with data-smark, initialize the library and export a structured object."
permalink: "/start_here/quick_start"
nav_order: 1
redirect_from:
  - "/getting_started/quick_start"
---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

This short path takes you from a few HTML fields to an exported JavaScript
object. The playground below is ready to try; on your own page, load SmarkForm
first and initialize it after the marked-up HTML exists.

<details class="chaptertoc">
<summary><strong>📖 Table of Contents</strong></summary>

  {% include chaptertoc/quick_start.html depth=2 %}

</details>

## Load SmarkForm

For a quick browser test, load the UMD build from the CDN:

```html
<script src="{{ smarkform_umd_cdn_current }}"></script>
```

The interactive example already loads SmarkForm. Its JavaScript tab shows the
initialization code used by the playground. For npm, ESM, or a downloaded local
copy, see [Getting SmarkForm]({{ "/start_here/getting_smarkform" | relative_url }}).

## Mark fields and export an object

Add `data-smark` to the fields SmarkForm should manage. Give each data field a
`name`; SmarkForm uses those names as keys in the exported object.

{% raw %}<!-- quick_start_html {{{ -->{% endraw %}
{% capture quick_start_html -%}
<div id="myForm$$">
  <p>
    <label data-smark>Name:</label>
    <input data-smark name="name" type="text">
  </p>
  <p>
    <label data-smark>Email:</label>
    <input data-smark name="email" type="email">
  </p>
</div>{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- quick_start_js {{{ -->{% endraw %}
{% capture quick_start_js -%}
// The playground's Export control uses the SmarkForm export action and shows
// the returned object in the editor. No custom JavaScript is needed here.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- quick_start_notes {{{ -->{% endraw %}
{% capture quick_start_notes -%}
**Try it:** Change either value in the Preview tab, then choose **Export** in the
playground controls. The editor shows an object like this:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com"
}
```

The playground initializes the example with this data; no custom JavaScript is
needed to display or export it.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- quick_start_demoValue {{{ -->{% endraw %}
{% capture quick_start_demoValue -%}
{
  "name": "Ada Lovelace",
  "email": "ada@example.com"
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="quick_start_first_success"
    htmlSource=quick_start_html
    jsSource=quick_start_js
    notes=quick_start_notes
    demoValue=quick_start_demoValue
    showEditor=true
    tests=false
%}

The root can be a `<div>` or another suitable element; SmarkForm builds its
component tree from that DOM. A native `<form>` is also supported when you want
browser submission. SmarkForm does **not** provide a validation rule engine:
native constraints such as `required` apply to browser form submission, while
other export or submit flows need application validation (for example, an event
hook before the action).

## Choose an installation

- [Getting SmarkForm]({{ "/start_here/getting_smarkform" | relative_url }}) — npm,
  ESM, UMD, and local copies.
- [CDN options]({{ "/start_here/cdn" | relative_url }}) — choose a CDN and version.
- [Download]({{ "/start_here/download" | relative_url }}) — get the browser builds
  and examples.

## Next steps

Read [Core Concepts]({{ "/start_here/core_concepts" | relative_url }}) for the
component-tree and HTML-to-data model. Then continue with the fuller
developer walkthrough:

{: .hint }
> **Next: [Using SmarkForm]({{ "/guides/using_smarkform" | relative_url }})** —
> build up a practical form, connect actions, exchange data, and follow the
> relevant reference pages as you go.
