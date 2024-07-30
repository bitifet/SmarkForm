---
title: Getting SmarkForm
layout: chapter
permalink: /getting_started/getting_smarkform
nav_order: 2

---

{% include links.md %}

# {{ page.title }}

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Using a CDN (Esiest approach)](#using-a-cdn-esiest-approach)
    * [ES module](#es-module)
    * [UMD Module](#umd-module)
* [Download minified](#download-minified)
* [Installing it from NPM](#installing-it-from-npm)
* [Clone from GitHub](#clone-from-github)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


To incorporate **SmarkForm** to your project you have several alternatives:


## Using a CDN (Esiest approach)

{: .hint}
> This is the quicker method for playground and testing apps.


### ES module

👉 Import it as ES module:

```html
<script type="module">
  import SmarkForm from '{{ smarkform_esm_cdn_latest }}';
  
  // Use SmarkForm in your code
</script>
```


### UMD Module

👉 Include it your HTML file using a `<script>` tag:

```html
<script src="{{ smarkform_umd_cdn_latest }}"></script>
<script>
    // Now it is avalable as SmarkForm global variable.
</script>
```

👉 Import as CommonJS module:

```javascript
const SmarkForm = require("{{ smarkform_umd_cdn_latest }}");
```

👉 Import as AMD (RequireJS) module:

```javascript
require(['{{ smarkform_umd_cdn_latest }}'], function(SmarkForm) {
  // Now it is avalable as SmarkForm local variable.
});
```


{: .warning}
> 📌 These examples will use the latest published version of SmarkForm from
> NPM (better for development / testing / training).
> 
> For production code is advised to rely on specific version CDN to keep it
> working despite any future changes.
> 
> See [CDN Resources section](
> {{ "/resources/CDN#specific-version" | relative_url }}) for more details...


## Download minified

Go to [Download section]({{ "/resources/download" | relative_url }}) to obtain a
minified versionof Smarkform you can then serve toghether with your app.


## Installing it from NPM

👉 Execute:

```sh
npm install smarkform
```

👉  Then you can use it with your favourite bundler or pick it in your preferred
format:

```
node_modules
└── smarkform
    └── dist
        ├── SmarkForm.esm.js
        └── SmarkForm.umd.js
```

{: .hint }
> *SmarkForm.umd.js* can be loaded through any [UMD compatibley module
> loader](https://github.com/umdjs/umd) such as RequireJS among others or just
> with regular ``<script>`` tag, in which case it will export ``SmarkForm``
> class as global variable.


## Clone from GitHub



👉 Execute:

```sh
git clone git@github.com:bitifet/SmarkForm.git
```

👉 Then, like with NPM package, you will find everything under the *dist*
directory:

```
dist
├── SmarkForm.esm.js
├── SmarkForm.esm.js.map
├── SmarkForm.umd.js
├── SmarkForm.umd.js.map
└── examples
    ├── smarkform_layout_sample.css
    └── smarkform_styles_sample.css
```

{: .hint}
> You can also install dev dependencies by running ``npm run dev`` to start
> developping or ``npm run bundle`` to just rebuild everything.
> 
> For more information, execute ``npm run`` alone:
> 
> ```sh
> $ npm run
> Lifecycle scripts included in smarkform@0.5.1:
>   pretest
>     npm run build
>   test
>     mocha
> available via `npm run-script`:
>   build
>     scripts/build_production_smarkform.sh
>   doc
>     scripts/build_documentation_site.sh
>   bundle
>     scripts/build_all.sh
>   watch
>     scripts/livebuild_dev_smarkform.sh
>   servedoc
>     scripts/liveserve_documentation_site.sh
>   dev
>     scripts/liveserve_documentation_site.sh
> ```








