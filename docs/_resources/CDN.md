---
title: CDN
layout: chapter
permalink: /resources/CDN
nav_order: 3

---

{% include links.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [SmarkForm](#smarkform)
    * [Latest Version](#latest-version)
* [Other Resources](#other-resources)
    * [CSS](#css)
    * [Latest sample CSS:](#latest-sample-css)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## SmarkForm


Latest SmarkForm version is currently ({{ site.data.package.version }}).


You can link this version **(recommended)** it as CDN with following links:

  * ESM: `{{ smarkform_esm_cdn_current }}`
  * UMD: `{{ smarkform_umd_cdn_current }}`

{: .hint}
> See [Getting Started section]({{ "/getting_started/getting_smarkform#using-a-cdn-esiest-approach" | relative_url }}) for more details:

### Latest Version

If your'd rather get always latest available SmarkForm version (not recommended
for production code) through CDN, use the following links instead:

  * ESM: `{{ smarkform_esm_cdn_latest }}`
  * UMD: `{{ smarkform_umd_cdn_latest }}`


## Other Resources

### CSS

As discussed in the
[Download Section]({{ "resources/download" | relative_url }}), you can also
find the CSS used in our
[Examples Section]({{ "resources/examples" | relative_url }}) as CDN resources.

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

