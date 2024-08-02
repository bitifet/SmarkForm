---
title: Home
layout: home
nav_order: 0
permalink: /

---


<style>
.SmarkForm-Hero {
    float:right;
    max-width: 30%;
    margin: 1rem;
    background: gainsboro;
    padding: .5rem;
    border-radius: 1rem;
}
.SmarkForm-Hero img {
    border-radius: .5rem;
}
.SmarkForm-Hero a, a:hover, a:visited, a:active {
    text-decoration: none;
    color: darkblue;
}
.SmarkForm-Hero:hover {
    transform: scale(1.1,1.1) translate(-2.5%, 2.5%);
}
</style>


# SmarkForm

<div class="SmarkForm-Hero">
<a
    href='{{ "resources/examples" | relative_url }}'
    title="Click to see Live Examples..."
>
<img
    src="assets/SmarkForm_hero.png"
    alt="SmarkForm Hero Image"
><br />
🔗 Live Examples
</a>
</div>


## Powerful while effortless Markup-driven and Extendable forms.

[![NPM Version][npm-image]][npm-url]
[![npm dependents][depends-image]][depends-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![License][license-image]][license-url]
<!-- Hilighting fix: []() -->


**SmarkForm** is a powerful library for creating markup-driven and extendable
forms in web applications.

SmarkForm empowers designers to enhance their form templates with advanced
capabilities, such as dynamic list manipulation and context-based interactions,
with no need to deal with complex JavaScript code. \[[More...]({{
    "about/about_smarkform" | relative_url }})\]


{: .hint}
>  Check out our [🔗 Complete Examples]({{ "resources/examples" | relative_url }})
> to see what SmarkForm is capable of in a glance!!


## Features

  * Markup-driven and Intuitive API.
  * Easy to use.
  * Advanced capabilities.
  * Can hold any data structure expressible in JSON.
  * Flexible and extendable.
  * Lightweight yet highly compatible.
  * [More...]({{ "about/features" | relative_url }})


## Sample Code:

```html
<ul data-smark='{
    type: "list",
    name: "phones",
    of: "input",
    maxItems: 3,
}'>
  <li>
    <input placeholder='Phone Number' type="tel" data-smark>
    <button data-smark='{"action":"removeItem"}'>❌</button>
  </li>
</ul>
<button data-smark='{"action":"addItem","context":"phones"}'>➕</button>
```


## Current Status

SmarkForm implementation is stable and fully functional, but not all initially
planned requirements are yet implemented. Hence, it's not yet in the 1.0.0
version. \[[🔗 More...]({{ "roadmap/status" | relative_url }})\]


## Where to Go Next?

To get started with SmarkForm you can:


| 👉 Follow our [🔗 Quick Start Guide]({{ "getting_started/quick_start" | relative_url }}) to rapidly dive in. |
| 👉 Check out our [🔗 Downloadable Examples]({{ "resources/examples" | relative_url }}) to see them in action and/or start tinkering. |
| 👉 ...or just try and modify any of the [🔗 Available CodePen Examples]({{ "resources/CodePen" | relative_url }}). |



## License

[🔗 MIT]({{ "community/license" | relative_url }})


## Contributing

We welcome any feedback, suggestions, or improvements as we continue to enhance
and expand the functionality of SmarkForm.


{: .info}
>   * See the [🔗 Contributing Section]({{ "community/contributing" | relative_url }})
>     for more details...


[npm-image]: https://img.shields.io/npm/v/smarkform.svg
[npm-url]: https://npmjs.org/package/smarkform
[depends-image]: https://badgen.net/npm/dependents/smarkform
[depends-url]: https://www.npmjs.com/package/smarkform?activeTab=dependents
[downloads-image]: https://img.shields.io/npm/dm/smarkform.svg
[downloads-url]: https://npmjs.org/package/smarkform
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg
[license-url]: https://opensource.org/licenses/MIT
