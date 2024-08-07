---
title: Download
layout: chapter
permalink: /resources/download
nav_order: 1

---

# {{ page.title }}

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [SmarkForm](#smarkform)
    * [Latest version](#latest-version)
    * [Older versions](#older-versions)
* [Other Resources](#other-resources)
    * [CSS](#css)
    * [Boilerplate Template](#boilerplate-template)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

## SmarkForm

*SmarkForm* is available both as *ES Module* and *UMD* formats.

### Latest version

  * ESM: <a href="./dist/SmarkForm.esm.js" download="SmarkForm-{{ site.data.package.version }}.esm.js">⤵️ SmarkForm-{{ site.data.package.version }}.esm.js</a>
  * UMD: <a href="./dist/SmarkForm.umd.js" download="SmarkForm-{{ site.data.package.version }}.umd.js">⤵️ SmarkForm-{{ site.data.package.version }}.umd.js</a>

### Older versions

For older versions, switch to the appropriate tag from
[SmarkForm GitHub Repo](https://github.com/bitifet/SmarkForm) and then you can
find both, ESM and UMD modules under `/dist` directory.


## Other Resources

### CSS

*SmarkForm* is a layout-agnostic library, so you are free to design your layout
and styles to your liking.

But, in case you liked the layout and styles of our
[Examples Section]({{ "resources/examples" | relative_url }}) or just want some
boilerplate to start from, here you have its CSS files:

  * Layout: <a href="./dist/examples/smarkform_layout_sample.css" download="SmarkForm_layout-{{ site.data.package.version }}.css">⤵️ SmarkForm_layout-{{ site.data.package.version }}.css</a>
  * Styles: <a href="./dist/examples/smarkform_styles_sample.css" download="SmarkForm_styles-{{ site.data.package.version }}.css">⤵️ SmarkForm_styles-{{ site.data.package.version }}.css</a>


{: .hint}
> To learn how to take advantage of them, check our
> [examples]({{ "resources/examples" | relative_url }}) source code.


### Boilerplate Template

Alternatively, if you want an empty template to start from the scratch but
without worriying about HTML and CSS boilerplate, you can check out or *empty
template* as a base code to begin with:

  * Template: <a href="./dist/examples/template.html" download="SmarkForm_template-{{ site.data.package.version }}.html">SmarkForm_template-{{ site.data.package.version }}.html</a>


{: .info}
> This template includes SmarkForm (in UMD format) and our example CSS files
> from their respective CDN resources (Check
> [CDN Section]({{ "resources/CDN" | relative_url }}) for more information).
> 
> This mean that you don't need to worry about downloading them or adjusting
> any url.
> 
> {: .warning}
> > ...but, at the same time, if you don't want to rely on CDN resources you
> > will need to download them from this section and update the `<head>`
> > section of this template accordingly.

