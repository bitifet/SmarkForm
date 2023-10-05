---
title: Quick Start
layout: chapter
permalink: /getting_started/quick_start
nav_order: 1

---

# Quick Start

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>



Start with a simple snippet.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My First SmarkForm Form</title>
  </head>
  <body>
    <h1>My First SmarkForm Form</h1>
    <div id='myForm'>
      <p>Some form here...</p>
    </div>
  </body>
</html>
```

Add SmarkForm capabilities:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My First SmarkForm Form</title>
    <script defer src='https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@0.1.4/dist/SmarkForm.umd.js'></script>
  </head>
  <body>
    <h1>My First SmarkForm Form</h1>
    <div id='myForm'>
      <p>Some form here...</p>
    </div>
    <script>
      const myForm = new SmarkForm(
          document.querySelector("#myForm")
      );
    </script>
  </body>
</html>
```

Add a few form inputs:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My First SmarkForm Form</title>
    <script defer src='https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@0.1.4/dist/SmarkForm.umd.js'></script>
  </head>
  <body>
    <h1>My First SmarkForm Form</h1>
    <div id='myForm'>
      <p>Some form here...</p>
      <p>...TODO...</p>
      <p>...TODO...</p>
      <p>...TODO...</p>
      <p>...TODO...</p>
    </div>
    <script>
      const myForm = new SmarkForm(
          document.querySelector("#myForm")
      );
    </script>
  </body>
</html>
```

React to some basic events:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My First SmarkForm Form</title>
    <script defer src='https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@0.1.4/dist/SmarkForm.umd.js'></script>
  </head>
  <body>
    <h1>My First SmarkForm Form</h1>
    <div id='myForm'>
      <p>Some form here...</p>
      <p>...TODO...</p>
      <p>...TODO...</p>
      <p>...TODO...</p>
      <p>...TODO...</p>
    </div>
    <script>
      const myForm = new SmarkForm(
          document.querySelector("#myForm")
          , {
              onAfterAction_export({data}) {
                  console.log(data);
              },
              async onBeforeAction_empty({context, preventDefault}) {
                  if (
                      ! await context.isEmpty()
                      && ! confirm("Are you sure?")
                  ) preventDefault();
              },
          }
      );
    </script>
  </body>
</html>
```


Fine-tune headers and styles using your own stylesheets or SmarkForm provided
samples.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My First SmarkForm Form</title>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@0.1.4/examples/smarkform_layout_sample.css'>
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@0.1.4/examples/smarkform_styles_sample.css'>
    <script defer src='https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@0.1.4/dist/SmarkForm.umd.js'></script>
  </head>
  <body>
    <h1>My First SmarkForm Form</h1>
    <div id='myForm'>
      <p>Some form here...</p>
      <p>...TODO...</p>
      <p>...TODO...</p>
      <p>...TODO...</p>
      <p>...TODO...</p>
    </div>
    <script>
      const myForm = new SmarkForm(
          document.querySelector("#myForm")
          , {
              onAfterAction_export({data}) {
                  console.log(data);
              },
              async onBeforeAction_empty({context, preventDefault}) {
                  if (
                      ! await context.isEmpty()
                      && ! confirm("Are you sure?")
                  ) preventDefault();
              },
          }
      );
    </script>
  </body>
</html>
```



