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
    transform: scale(2,2) translate(-25%, 25%);
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

[![npm dependents](https://badgen.net/npm/dependents/smarkform)](https://www.npmjs.com/package/smarkform?activeTab=dependents)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)


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

<details>
<summary>✔️  <b>Markup-driven and Intuitive API</b></summary>
<ul>
  <li>👉 Create powerful interactive forms with just plain htmL.</li>
  <li>👉 ...or (<a href="#summ_recommendations">advised</a>) use your preferred template engine.</li>
  <li>👉 Just add <code>data-smark</code> attribute to relevant tags and see the magic.</li>
  <li>👉 Intuitive option names.<ul>
    <li>
      <b>Ex.:</b>
      <code>&lt;button data-smark='{action: "addItem", for: "myList"&gt;</code>
    </li>
  </ul></li>
  <li>👉 Addressable elements by easy-to-read path-style relative or absolute addresses.</li>
  <li>👉 Complete separation between View and Controller logic.</li>
</ul>
</details>

<details>
<summary>✔️  <b>Easy to use and advanced capabilities</b></summary>
<ul>
  <li>👉 Leverage your existing HTML and CSS knowledge to create powerful forms.</li>
  <li>👉 No need for extensive JavaScript coding.</li>
  <li>👉 Add or remove items from lists with optional lower and upper limits.</li>
  <li>👉 Context-based actions (no need to hard-wire context and/or target).</li>
  <li>🚧 Dynamic and reactive options loading for dropdowns (comming soon).</li>
</ul>
</details>

<details>
<summary>✔️  <b>Flexible and extendable</b></summary>
<ul>
  <li>👉 Import and export complex forms in JSON format.</li>
  <li>👉 You can even import/export any subform instead of the whole one</li>
  <li>👉 Develop your own component types to suit your specific needs.</li>
</ul>
</details>

<details>
<summary>✔️  <b>Lightweight yet highly compatible</b></summary>
<ul>
  <li>👉 Bundled all three as ES Module, UMD and plain javascript file.</li>
  <li>👉 All of them less than 20KB each!</li>
  <li>👉 &gt; 0.25%, browser coverage through Babel</li>
</ul>
</details>


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


