---
title: CDN
layout: default
permalink: /resources/CDN
nav_order: 2

---

{% include links.md %}

# CDN

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [SmarkForm](#smarkform)
    * [Latest Version](#latest-version)
    * [Specific Version](#specific-version)
* [Other Resources](#other-resources)
    * [CSS](#css)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## SmarkForm

### Latest Version

To get latest available SmarkForm version through CDN you can use following links:

  * ESM: `{{ smarkform_esm_cdn_latest }}`
  * UMD: `{{ smarkform_umd_cdn_latest }}`

### Specific Version

If you prefer to rely in specific version (let's say
{{ site.data.package.version }}) (**recommended for production**) you can use
version-specific CDNs instaed:

  * ESM: `{{ smarkform_esm_cdn_current }}`
  * UMD: `{{ smarkform_umd_cdn_current }}`

{: .hint}
> See [Getting Started section]({{ "/getting_started/getting_smarkform#using-a-cdn-esiest-approach" | relative_url }}) for more details:


## Other Resources

### CSS

Bla bla bla...

```html
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@0.1.4/examples/smarkform_layout_sample.css'>
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@0.1.4/examples/smarkform_styles_sample.css'>
```

