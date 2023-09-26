---
title: Getting SmarkForm
layout: default
permalink: /getting_started/getting_smarkform
nav_order: 2

---

# Getting SmarkForm

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Using a CDN (Esiest approach)](#using-a-cdn-esiest-approach)
    * [ES module](#es-module)
    * [UMD Module](#umd-module)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


To incorporate **SmarkForm** to your project you have several alternatives:


### Using a CDN (Esiest approach)

#### ES module

👉 Import it as ES module:

```html
<script type="module">
  import SmarkForm from 'https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.esm.js';
  
  // Use SmarkForm in your code
</script>
```


#### UMD Module

👉 Include it your HTML file using a `<script>` tag:

```html
<script src="https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.umd.js"></script>
<script>
    // Now it is avalable as SmarkForm global variable.
</script>
```

👉 Import as CommonJS module:

```javascript
const SmarkForm = require("smarkform");
```

👉 Import as AMD (RequireJS) module:

```javascript
require(['https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.umd.js'], function(SmarkForm) {
  // Now it is avalable as SmarkForm local variable.
});
```


{: .warning}
> 📌 These examples will use the latest published version of SmarkForm from
> NPM. If you prefer to use a specific version, you can specify the version
> number in the CDN URLs. For example, if you want to use version 0.1.0, the
> CDN URLs would be:
>
> - **ESM:** `https://cdn.jsdelivr.net/npm/smarkform@0.1.0/dist/SmarkForm.esm.js`
> - **UMD:** `https://cdn.jsdelivr.net/npm/smarkform@0.1.0/dist/SmarkForm.umd.js`
>
> Make sure to replace `0.1.0` with the desired version number in the URLs.


