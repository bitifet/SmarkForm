---
title: CDN
layout: chapter
description: "Use SmarkForm's version-pinned or latest ESM and UMD builds from public CDNs, plus example CSS resources."
permalink: "/start_here/cdn"
nav_order: 3
redirect_from:
  - "/resources/CDN"
---


{% include links.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/CDN.html depth=3 %}

</details>


## SmarkForm


The current release is **{{ site.data.package.version }}**. Use the versioned
URLs below for production so an upstream release cannot change your app
unexpectedly.


Use either ESM or UMD from jsDelivr:

  * ESM: `{{ smarkform_esm_cdn_current }}`
  * UMD: `{{ smarkform_umd_cdn_current }}`

{: .hint}
> See [Getting SmarkForm]({{ "/start_here/getting_smarkform" | relative_url }}) for help choosing a distribution format.

### Latest Version

For experiments, demos, and training, these unpinned URLs resolve to the latest
published package version. Avoid them in production:

  * ESM: `{{ smarkform_esm_cdn_latest }}`
  * UMD: `{{ smarkform_umd_cdn_latest }}`


## Other Resources

### CSS

The optional layout and style sheets archived with the
[Legacy Examples]({{ "showcase_examples/legacy_examples" | relative_url }})
are static files hosted by this documentation site; they are separate from the
SmarkForm JavaScript library.

Just insert the following lines in your `<head>` section.


```html
    <link rel='stylesheet' href='{{ css_layout_site_url }}'>
    <link rel='stylesheet' href='{{ css_styles_site_url }}'>
```
