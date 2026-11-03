---
title: "Getting SmarkForm"
layout: chapter
description: "Choose a SmarkForm distribution for your project: a CDN, npm package, downloaded bundle, or source checkout."
permalink: "/start_here/getting_smarkform"
nav_order: 2
redirect_from:
  - "/getting_started/getting_smarkform"
---


<!-- BEGIN old PORTED TO docs/_start_here/getting_smarkform.md -->
{% include links.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/getting_smarkform.html depth=3 %}

</details>


## Choose a distribution

SmarkForm provides an ECMAScript module (ESM) and a UMD browser bundle.
Choose the delivery method that fits your project:

* **CDN:** quickest for a browser page, prototype, or small site. Use a
  version-pinned URL for production and an unpinned URL only for experiments.
  See the [CDN guide]({{ "/start_here/cdn" | relative_url }}) for ESM, UMD, and
  stylesheet URLs.
* **npm:** best for projects that already use a package manager and bundler.
  Install the `smarkform` package and import its ESM entry point:

  ```sh
  npm install smarkform
  ```

  ```js
  import SmarkForm from "smarkform";

  const myForm = new SmarkForm(document.getElementById("myForm"));
  await myForm.rendered;
  ```

* **Downloaded bundle:** use the ESM or UMD file when you want to serve the
  library from your own site. The [Download page]({{ "/start_here/download" | relative_url }})
  also provides the example CSS and an empty starter template.
* **Source checkout:** clone the
  [GitHub repository](https://github.com/bitifet/SmarkForm) if you want to
  develop SmarkForm itself, run its tests, or build the library and examples.

The UMD bundle exposes `SmarkForm` as a browser global. For ESM, use a module
script or your bundler. The examples in the next pages show complete forms and
the standard [Quick Start]({{ "/start_here/quick_start" | relative_url }})
walks through building one.
<!-- END old PORTED TO docs/_start_here/getting_smarkform.md -->
