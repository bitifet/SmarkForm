---
title: Home
layout: home
nav_order: 0
permalink: /

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


🚀 **Powerful while effortless Markup-driven and Extendable forms.**

[![NPM Version][npm-image]][npm-url]
[![npm dependencies][dependencies-image]][dependencies-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![jsDelivr Hits][cdnhits-image]][cdnhits-url]
[![License][license-image]][license-url]

{: .info :}
> **SmarkForm** enhances HTML forms with advanced features like dynamic list
manipulation and context-based interactions, **without requiring specific
layout or complex JavaScript** code. \[[More...]({{ "about/introduction" |
relative_url }})\]


## Main Features

  * [Subforms]({{ "/about/showcase" | relative_url }}#nested-forms): Nested
    forms to any depth.
  * [Lists]({{ "/about/showcase" | relative_url }}#lists): Sortable and
    variable-length arrays either of scalars or subforms.
  * [Conigurable hot keys]({{ "/about/showcase" | relative_url
    }}#context-driven-keyboard-shortcuts): Context-driven keyboard shortcuts.
  * [Low code]({{ "about/showcase" |relative_url }}#basic-form): No manual
    wiring between controls and fields.
  * [JSON format]({{ "/about/showcase" | relative_url}}#import-and-export-data): Data
    is imported / exported as JSON.
  * [Lightweight]({{ "/resources/download" | relative_url }}): Only {{
    site.data.computed.bundleSizeKB }}KB minified.
  * Flexible, extendable and [more...]({{ "about/features" | relative_url }})


## Sample Code

The following code snippet shows *SmarkForm* simplicity.

👉 You will find similar examples working preview along this documentation.
**Don't miss the `📝 Notes` tab** to be aware of the nitty-gritty details.




{% capture generic_sample_css
%}button:disabled {
    opacity: .5;
}{%
endcapture %}

{% capture simple_list_example
%}<div id="myForm$$">
    <p>
        <label data-smark>Name:</label>
        <input data-smark='{"name":"name"}' placeholder='Full name' type="text">
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
</div>{%
endcapture %}


{% capture simple_list_example_notes %}
  👉 This is a simple form to show the power of *SmarkForm*.

  👉 Tinker with it, modifying data, adding or removing items from the
     *Phones* list, sorting its items by dragging them and then clicking the
     `Export` button to see resulting data.
  
  👉 Note that it enforces default behaviors, such as requiring a minimum of
     one item and excluding empty list items during export. But it can be easily
     changed, with properties like *min_items* and *exportEmpties*.

  👉 Check the *JS* tab to see the little JS just to initialize it as a
     *SmarkForm* and show you the data when exported.
{%  endcapture %}


{% include components/sampletabs_tpl.md
   formId="simple_list"
   htmlSource=simple_list_example
   cssSource=generic_sample_css
   notes=simple_list_example_notes
   selected="preview"
   showEditor=true
%}


{: .hint :}
> To minimize clutter, the `⬇️ Export`, `⬆️ Import` and `❌ Clear` buttons
> implementation have been omitted from the source code, as they are common to
> all examples and will be explained in detail in a
> [🔗 later section]({{"about/showcase#nested-forms" | relative_url }}).



## Current Status

SmarkForm implementation is stable and fully functional, but not all initially
planned requirements are yet implemented. Hence, it's not yet in the 1.0.0
version. \[[🔗 More...]({{ "about/roadmap" | relative_url }}#current-status)\]

**Last Updated:** {{ site.data.computed.lastUpdated }}.


## Where to Go Next?

To get started with SmarkForm you can:


| 👉 Take a look to our [🔗 Showcase]({{ "about/showcase" | relative_url }}) section to see its full potential at a glance. |
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
[dependencies-image]: https://img.shields.io/badge/dependencies-0-green
[dependencies-url]: https://www.npmjs.com/package/smarkform?activeTab=dependencies
[downloads-image]: https://img.shields.io/npm/dm/smarkform.svg
[downloads-url]: https://npmjs.org/package/smarkform
[cdnhits-image]: https://data.jsdelivr.com/v1/package/npm/smarkform/badge?style=rounded
[cdnhits-url]: https://www.jsdelivr.com/package/npm/smarkform
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg
[license-url]: https://opensource.org/licenses/MIT
