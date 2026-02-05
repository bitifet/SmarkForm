---
title: Download
layout: chapter
permalink: /resources/download
nav_order: 2

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
    * [Latest version](#latest-version)
    * [Older versions](#older-versions)
* [Other Resources](#other-resources)
    * [CSS](#css)
    * [Boilerplate Template](#boilerplate-template)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

## SmarkForm

*SmarkForm* is available both as *ES Module* and *UMD* formats. Only {{
site.data.computed.bundleSizeKB }}KB each.

### Latest version

  * ESM: <a href="{{ smarkform_esm_dld_link }}" download="{{ smarkform_esm_dld_name }}">⤵️ {{ smarkform_esm_dld_name }}</a>
  * UMD: <a href="{{ smarkform_umd_dld_link }}" download="{{ smarkform_umd_dld_name }}">⤵️ {{ smarkform_umd_dld_name }}</a>

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

  * Layout: <a href="{{ smarkform_css_layout_dld_link }}" download="{{ smarkform_css_layout_dld_name }}">⤵️ {{ smarkform_css_layout_dld_name }}</a>
  * Styles: <a href="{{ smarkform_css_styles_dld_link }}" download="{{ smarkform_css_styles_dld_name }}">⤵️ {{ smarkform_css_styles_dld_name }}</a>


{: .hint}
> To learn how to take advantage of them, check our
> [examples]({{ "resources/examples" | relative_url }}) source code.


### Boilerplate Template

Alternatively, if you want an empty template to start from the scratch but
without worriying about HTML and CSS boilerplate, you can check out or *empty
template* as a base code to begin with:

  * Boilerplate template: <a href="{{ smarkform_boilerplate_dld_link }}" download="{{ smarkform_boilerplate_dld_name }}">⤵️ {{ smarkform_boilerplate_dld_name }}</a>


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

