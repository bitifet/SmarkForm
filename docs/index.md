---
title: Home
layout: home
nav_order: 0
permalink: /

generic_sample_css: |
    button:disabled {
        opacity: .5;
    }

simple_list_example: |
    <div id="myForm">
        <p>
            <label data-smark>Name:</label>
            <input data-smark='{"name":"name"}' placeholder='Full name' type="tel">
        </p>
        <p>
            <button data-smark='{"action":"addItem","context":"phones"}' title='Add Phone'>➕ </button>
            <label data-smark>Phones:</label>
            <ul data-smark='{"name": "phones", "of": "input", "sortable":true, "max_items":5, "exportEmpties": true}'>
                <li>
                    <label data-smark>📞 </label>
                    <input placeholder='+34...' type="tel" data-smark>
                    <button data-smark='{"action":"removeItem"}' title='Remove Phone'>❌</button>
                </li>
            </ul>
        </p>
        <button data-smark='{"action":"export"}'>⬇️  Export</button>
    </div>

simple_list_example_js: |
    const myForm = new SmarkForm(document.getElementById("myForm"));
    myForm.on("AfterAction_export", ({data})=>{
        window.alert(JSON.stringify(data, null, 4));
    });

simple_list_example_notes: |
    👉 This is a simple form to show the power of *SmarkForm*.

    👉 Tinker with it modifying data, adding or removing items from the
       *Phones* list, sorting its items by dragging them and then clicking the
       `Export` button to see resulting data.
    
    👉 Notice it inforces some default behaviours like a convenient minimum of
       one item or not exporting empty items for lists. But it can be easily
       changed, with properties like *min_items* and *exportEmpties*.

    👉 Check the *JS* tab to see the little JS just to initialize it as a
       *SmarkForm* and show you the data when exported.

---

{% include components/sampletabs_ctrl.md %}

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
    alt=""
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


## Features

  * **Responsive and accessible UX** across devices.
  * **Imports/Exports JSON** supporting nested subforms (objects) and
    variable-length lists (arrays).
  * Configurable context-driven keyboard shortcuts (hotkeys)
  * Easy to use **Markup-driven** and Intuitive API.
  * No reliance on a specific HTML structure: **Designers have complete freedom**.
  * **No manual wiring** between controls and fields.
  * Lightweigh (**Only {{ site.data.computed.bundleSizeKB }}KB** minified), flexible and extendable.
  * [More...](https://smarkform.bitifet.net/about/features)


## Sample Code:

The following code snippet shows *SmarkForm* simplicity.

👉 You will find similar examples working preview along this documentation.
**Don't miss the `📝 Notes` tab** to be aware of the nitty-gritty details.

{% include components/sampletabs_tpl.md
   formId="simple_list"
   htmlSource=page.simple_list_example
   jsSource=page.simple_list_example_js
   cssSource=page.generic_sample_css
   notes=page.simple_list_example_notes
%}

{: .hint}
> Also check out our
> [🔗 Complete Examples]({{ "resources/examples" | relative_url }})
> to see what SmarkForm is capable of in a glance!!


## Current Status

SmarkForm implementation is stable and fully functional, but not all initially
planned requirements are yet implemented. Hence, it's not yet in the 1.0.0
version. \[[🔗 More...]({{ "about/about_smarkform" | relative_url }}#status)\]

**Last Updated:** {{ site.data.computed.lastUpdated }}.


## Where to Go Next?

To get started with SmarkForm you can:


| 👉 Follow our [🔗 Quick Start Guide]({{ "getting_started/quick_start" | relative_url }}) to rapidly dive in. |
| 👉 Check out our [🔗 Downloadable Examples]({{ "resources/examples" | relative_url }}) to see them in action and/or start tinkering. |



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
