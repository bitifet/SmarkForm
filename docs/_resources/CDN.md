---
title: CDN
layout: default
permalink: /resources/CDN
nav_order: 2

---

{% assign esm_link = "https://cdn.jsdelivr.net/npm/smarkform@" | append: site.data.package.version | append: "/dist/SmarkForm.esm.js" %}
{% assign umd_link = "https://cdn.jsdelivr.net/npm/smarkform@" | append: site.data.package.version | append: "/dist/SmarkForm.umd.js" %}

# CDN

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [SmarkForm](#smarkform)
    * [Latest Version](#latest-version)
* [Other Resources](#other-resources)
    * [CSS](#css)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## SmarkForm

### Latest Version

  * ESM: `{{ esm_link }}`
  * UMD: `{{ umd_link }}`

{: .hint}
> See [Getting Started section]({{ site.root }}/getting_started/getting_smarkform) for more details:


## Other Resources

### CSS

Bla bla bla...

```html
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@0.1.4/examples/smarkform_layout_sample.css'>
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@0.1.4/examples/smarkform_styles_sample.css'>
```

