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

As discussed in the
[Download Section]({{ "start_here/download" | relative_url }}), you can also
find the CSS used in our
[Examples Section]({{ "showcase_examples/examples" | relative_url }}) as CDN resources.

Just insert the following lines in your `<head>` section.


```html
    <link rel='stylesheet' href='{{ css_layout_cdn_current }}'>
    <link rel='stylesheet' href='{{ css_styles_cdn_current }}'>
```


### Latest sample CSS:

As for SmarkForm modules, if you want to always get the latest available
example CSS files, you can use the following links instead:

```html
    <link rel='stylesheet' href='{{ css_layout_cdn_latest }}'>
    <link rel='stylesheet' href='{{ css_styles_cdn_latest }}'>
```
