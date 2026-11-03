---
title: Download
layout: chapter
description: "Download SmarkForm ESM and UMD builds, example stylesheets and a ready-to-use starter template."
permalink: "/start_here/download"
nav_order: 4
redirect_from:
  - "/resources/download"
---


{% include links.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/download.html depth=3 %}

</details>

## SmarkForm

SmarkForm is distributed as an ES module and a UMD bundle. The minified builds
are approximately {{ site.data.computed.bundleSizeKB }} KB.

### Latest version

  * ESM: <a href="{{ smarkform_esm_dld_link }}" download="{{ smarkform_esm_dld_name }}">⤵️ {{ smarkform_esm_dld_name }}</a>
  * UMD: <a href="{{ smarkform_umd_dld_link }}" download="{{ smarkform_umd_dld_name }}">⤵️ {{ smarkform_umd_dld_name }}</a>

### Older versions

For older releases, select the matching version or tag in the
[GitHub repository](https://github.com/bitifet/SmarkForm), then download the ESM
or UMD file from its `dist/` directory.


## Other Resources

### CSS

*SmarkForm* is a layout-agnostic library, so you are free to design your layout
and styles to your liking.

If you want to reuse the layout and styles from our
[Downloadable Examples]({{ "/showcase_examples/examples" | relative_url }}),
download these CSS files:

  * Layout: <a href="{{ smarkform_css_layout_dld_link }}" download="{{ smarkform_css_layout_dld_name }}">⤵️ {{ smarkform_css_layout_dld_name }}</a>
  * Styles: <a href="{{ smarkform_css_styles_dld_link }}" download="{{ smarkform_css_styles_dld_name }}">⤵️ {{ smarkform_css_styles_dld_name }}</a>


{: .hint}
> To learn how to use these styles, inspect the
> [Downloadable Examples]({{ "/showcase_examples/examples" | relative_url }}) source.


### Boilerplate Template

Alternatively, start with the empty boilerplate template:

  * Boilerplate template: <a href="{{ smarkform_boilerplate_dld_link }}" download="{{ smarkform_boilerplate_dld_name }}">⤵️ {{ smarkform_boilerplate_dld_name }}</a>


{: .info}
> The template loads SmarkForm (UMD) and the example CSS from their CDN URLs.
> See the [CDN guide]({{ "/start_here/cdn" | relative_url }}) for versioned and latest links.
> 
> This mean that you don't need to worry about downloading them or adjusting
> any url.
> 
> {: .warning}
> > ...but, at the same time, if you don't want to rely on CDN resources you
> > will need to download the assets from this page and update the `<head>`
> > section of this template accordingly.
