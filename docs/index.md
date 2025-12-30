---
title: Home
layout: home
nav_order: 0
permalink: /

---

{% include components/sampletabs_ctrl.md
   noShowHint=true
%}

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



🚀 **Powerful while effortless Markup-driven and Extendable form controller.**

[![NPM Version][npm-image]][npm-url]
[![npm dependencies][dependencies-image]][dependencies-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![jsDelivr Hits][cdnhits-image]][cdnhits-url]
[![License][license-image]][license-url]


*SmarkForm* is a lightweight library designed for front-end developers and
designers to enhance HTML forms with powerful features like **subforms** and
dynamic, variable-length **lists**, context driven **hotkeys** and more...

🔧 It seamlessly integrates with the DOM to provide a markup-agnostic solution,
freeing your form layout from rigid structure and styling constraints while
enabling **JSON form data import and export** and ensuring compatibility with
modern workflows.

♿ With a focus on accessibility (a11y), SmarkForm offers configurable hotkeys,
**smooth navigation**, and a **low-code experience**, making it an extendable
and versatile tool for building HTML form applications.

\[[More...]({{ "about/introduction" | relative_url }})\]


<div class="SmarkForm-Hero">
<a
    href='{{ "resources/examples" | relative_url }}'
    title="Click to see Live Examples..."
>
<picture>
    <source srcset="assets/SmarkForm_hero.webp" type="image/webp">
    <img src="assets/SmarkForm_hero.png" alt="">
</picture>
<br />
🔗 Live Examples
</a>
</div>

## Main Features

  * `<>` [Markup agnostic]({{ "/about/features" | relative_url }}#markup-agnostic):
    Maximum decoupling between design and development teams.
  * `🧩` [Low code]({{ "about/features" |relative_url }}#easy-to-use-low-code): No manual
    wiring between controls and fields.
  * `🗂` [Subforms]({{ "/about/features" | relative_url }}#nestable-forms): Nested
    forms to any depth.
  * `📑` [Lists]({{ "/about/features" | relative_url }}#variable-length-lists):
    Sortable and variable-length lists (arrays) either of scalars or subforms.
  * `🫳` [Configurable hot keys]({{ "/about/features" | relative_url }}#context-driven-hotkeys):
    Context-driven and discoverable keyboard shortcuts.
  * `🫶` [Consistent UX]({{ "/about/features" | relative_url }}#consistent-user-experience):
    Smooth navigation and consistent behaviour across all forms.
  * `{}` [JSON format]({{ "/about/features" | relative_url }}#json-based):
    Data is imported / exported as JSON.
  * `🪶` [Lightweight]({{ "/about/features" | relative_url }}#lightweight-yet-highly-compatible):
    Only {{ site.data.computed.bundleSizeKB }}KB minified.
  * `♿` [Accessibility]({{ "about/features" | relative_url }}#a11y-friendly):
    Focus on UX and accessibility (a11y).
  * `🆓` [Dependency-free](https://www.npmjs.com/package/smarkform?activeTab=dependencies):
    No external dependencies required.
  * `💪` Flexible, extendable and [more...]({{ "about/features" | relative_url }})


## Sample Code

The following code snippet shows *SmarkForm* simplicity.

✅ Click everywhere in the form to focus it.

✅ Hit the `Ctrl` key to see the available hotkeys revealed. Notice they may change depending on the focused context.

✅ Check the `JS` tab to see that **there is no JS code** other than the library instantiation.

✅ Check the `HTML` tab to see that how **straightforward and simple** it is.

{% capture notes %}
👉 This is a simple form to show the power of *SmarkForm*.

  * Tinker with it in the **Preview** tab, modifying data, etc...
    - Add or remove items from the *Phones* list.
    - Sort the list by dragging them with the mouse.
    - Use the `⬇️` to export the data as JSON.
    - Use the `❌` to clear the form.
    - Use the `⬆️` to import the JSON back to the form. **You can modify the
      JSON before importing it back**.

  * Notice you can navigate forward and backward using the keyboard:
    - Using the `Enter` and `Shift`+`Enter` from field to field **bypassing
      control buttons**.
    - Using the `Tab` and `Shift`+`Tab` as usual, to reach **both fields and
      control buttons**.
    - Don't miss the hotkeys! Move the focus to a telephone field and hit the
      `Ctrl` key to see the avaliable ones (depending on focused context)
      revealed.

👉 Its behavior is driven by the *data-smark* attributes, which are declarative
and intuitive with straightforward defaults to match most common use cases.

  * ...for instance, *min_items* is set to 1 by default, so you cannot
     remove the last item from the *Phones* list. But you can change it by
     setting *min_items* to 0, allowing an empty list.

  * Another interesting case is the *exportEmpties* property, which is set to
     `false` by default, so empty items are not usually exported. In this
     example, it is set to `true` since, for a first contact, it might seem
     counterintuitive.

👉 Check the *JS* tab to see the little JS just to initialize it as a
*SmarkForm* and show you the data when exported.

👉 In the *CSS* tab you will find some non-essential CSS primarily to
materialize hotkeys' revealing feature when pressing the `Ctrl` key.
{%  endcapture %}


{% raw %} <!-- simple_list_hotkeys {{{ --> {% endraw %}
{% capture simple_list_hotkeys
%}█<button data-smark='{"action":"removeItem", "context":"phones", "target":"*", "hotkey":"Delete", "preserve_non_empty":true}' title='Remove unused fields'>🧹</button>
█<button data-smark='{"action":"removeItem", "context":"phones", "hotkey":"-", "preserve_non_empty":true}' title='Remove phone number'>➖</button>
█<button data-smark='{"action":"addItem","context":"phones", "hotkey":"+"}' title='Add phone number'>➕ </button>
█<strong data-smark='label'>Phones:</strong>
█<ul data-smark='{"name": "phones", "of": "input", "sortable":true, "max_items":5, "exportEmpties": true}'>
█    <li class="row">
█        <label data-smark>📞 Telephone
█        <span data-smark='{"action":"position"}'>N</span>
█        </label>
█        <button data-smark='{"action":"removeItem", "hotkey":"-"}' title='Remove this phone number'>➖</button>
█        <input type="tel" data-smark>
█        <button data-smark='{"action":"addItem", "hotkey":"+"}' title='Insert phone number'>➕ </button>
█    </li>
█</ul>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_hotkeys_with_context {{{ --> {% endraw %}
{% capture simple_list_hotkeys_with_context
%}█<p>
█    <label data-smark='{"type": "label"}'>Name:</label>
█    <input name='name' data-smark='{"type": "input"}' />
█</p>
█<p>
█    <label data-smark='{"type": "label"}'>Surname:</label>
█    <input name='surname' data-smark='{"type": "input"}' />
█</p>
{{ simple_list_hotkeys }}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_autodisable_css {{{ --> {% endraw %}
{% capture simple_list_autodisable_css
%}/* Hide list bullets */
{{""}}#myForm$$ ul li {
    list-style-type: none !important;
}
/* Make disabled buttons more evident: */
{{""}}#myForm$$ :disabled {
    opacity: 0.4;
}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_hotkeys_css {{{ --> {% endraw %}
{% capture simple_list_hotkeys_css
%}/* *******************************************************************
✔ The only `CSS` code is almost just to materialize the hotkeys hints
when pressing the `Ctrl` key (Remember SmarkForm is HTML agnostic).
******************************************************************* */

/* Materialize hotkey hints from data-hotkey attribute */
{{""}}#myForm$$ [data-hotkey] {
  position: relative;
  overflow-x: display;
}
{{""}}#myForm$$ [data-hotkey]::before {
  content: attr(data-hotkey);
  display: inline-block;
  position: absolute;
  top: 2px;
  left: 2px;
  z-index: 10;
  pointer-events: none;
  background-color: #ffd;
  outline: 1px solid lightyellow;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-family: sans-serif;
  font-size: 0.8em;
  white-space: nowrap;
  transform: scale(1.8) translate(0.1em, 0.1em);
}
{{ simple_list_autodisable_css }}
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_hotkeys_with_context_tests {{{ --> {% endraw %}
{% capture simple_list_hotkeys_with_context_tests %}
export default async ({ page, expect, id, root }) => {
    await expect(root).toBeVisible();
    
    // Check that both inputs exist
    const nameFld = page.locator('input[name="name"]');
    const surnameFld = page.locator('input[name="surname"]');
    const addPhoneBtn = page.locator('button[title="Add phone number"]');
    // const phoneFields = page.locator('input[type="tel"]');
    const editorFld = page.locator('textarea[data-smark]');
    
    await expect(nameFld).toBeVisible();
    
    // Fill name and surname fields:
    await nameFld.fill('John');
    await surnameFld.fill('Doe');

    // Add a phone field to the list (it will get ghe focus)
    await addPhoneBtn.click();

    // Fill in
    await page.keyboard.type('1234567890');

    // Use Shift+Enter to navigate back to the first phone filed
    await page.keyboard.down('Shift'); 
    await page.keyboard.press('Enter');
    await page.keyboard.up('Shift'); 

    // Fill in the first phone field
    await page.keyboard.type('0987654321');

    // Reveal available hotkeys by pressing and holding Control
    await page.keyboard.down('Control');

    // // 👀 Uncomment to see the hotkey hint revealed in --heded mode
    // //    - Hit Ctrl key to release it and check the test to fail.
    await page.pause();
   


    // Function to read the hotkey hint content (if displayed)
    async function readHotkeyHint(locator) {
        const box = await locator.boundingBox();
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        return await page.evaluate(({x, y}) => {
            const element = document.elementFromPoint(x, y);
            const beforeStyle = window.getComputedStyle(element, '::before');
            if (beforeStyle.display === 'none' || beforeStyle.content === '') return null;
            return element.getAttribute('data-hotkey') || null;
        }, {x, y}); 
    }




    // Check the hotkey hint is visible for the "Add phone number" button

    const removeEmptyBtn = page.getByRole('button', { name: '🧹' }).nth(0);
    const removeLastBtn = page.getByRole('button', { name: '➖' }).nth(0);
    const appendItemBtn = page.getByRole('button', { name: '➕' }).nth(0);

    const removeItemBtn1 = page.getByRole('button', { name: '➖' }).nth(1);
    const addItemBtn1 = page.getByRole('button', { name: '➕' }).nth(1);
    const removeItemBtn2 = page.getByRole('button', { name: '➖' }).nth(2);
    const addItemBtn2 = page.getByRole('button', { name: '➕' }).nth(2);


    expect(await readHotkeyHint(removeEmptyBtn)).toBe('Delete');
    expect(await readHotkeyHint(removeLastBtn)).toBe(null);
    expect(await readHotkeyHint(appendItemBtn)).toBe(null);


    expect(await readHotkeyHint(addItemBtn1)).toBe('+');
    expect(await readHotkeyHint(addItemBtn2)).toBe(null);
    expect(await readHotkeyHint(removeItemBtn1)).toBe('-');
    expect(await readHotkeyHint(removeItemBtn2)).toBe(null);


    // 2nd level hotkeys
    await page.keyboard.down('Shift');
     // TODO: Check...

    await page.pause();

    await page.keyboard.up('Shift');



   
    // Use 'Control' + '+' to add another phone field in between
    await page.keyboard.press('+');
    await page.keyboard.up('Control');
    await page.keyboard.type('1122334455');
   
    // Add another phone field to the end of the list (it will get ghe focus)
    await addPhoneBtn.click();

    // Fil in
    await page.keyboard.type('6677889900');
   
    // Export the data
    const data = await page.evaluate(async() => {
        return await myForm.export();
    });

    // Verify the exported data
    const expectedData = {
        name: 'John',
        surname: 'Doe',
        phones: [
            '0987654321',
            '1122334455',
            '1234567890',
            '6677889900'
        ]
    };
    expect(data).toEqual(expectedData);


    await page.evaluate(() => {
        myForm.import("");
    });
    await expect(nameFld
        , "Importing invalid data should not trigger a render error."
    ).toBeVisible();

};
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="simple_list_hotkeys_with_context"
    htmlSource=simple_list_hotkeys_with_context
    cssSource=simple_list_hotkeys_css
    notes=notes
    selected="preview"
    showEditor=true
    tests=simple_list_hotkeys_with_context_tests
%}

👉 You will find similar examples working preview along this documentation.
**Don't miss the `📝 Notes` tab** to be aware of the nitty-gritty details.



{: .hint :}
> To minimize clutter, the `⬇️ Export`, `⬆️ Import` and `❌ Clear` buttons
> implementation have been omitted from the source code, as they are common to
> all examples and will be explained in detail in a
> [🔗 later section]({{"about/showcase#deeply-nested-forms" | relative_url }}).



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


## Community and Support

If you don't find a solution there, feel free to open a [discussion on our
GitHub repository](https://github.com/bitifet/SmarkForm/discussions).

For further support, you can contact me through our [Contact
Page](https://smarkform.bitifet.net/community/contact) or reach out via email at [smarkform@bitifet.net](mailto:smarkform@bitifet.net).

If you want to stay updated with the latest news, releases, and announcements,
or join the community chat, you can follow us on Telegram:

### 🚀 Stay tuned

<style>
  .qr--container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
  }

  .qr--image-box {
    flex: 1;
    max-width: 40%;
    min-width: 250px; /* Ensures a minimum width for readability */
    text-align: center;
  }

  /* Media query for smaller screens */
  @media (max-width: 768px) {
    .qr--image-box {
      max-width: 100%; /* Full width on smaller screens */
    }
  }
</style>
<div class="qr--container">
  <div class="qr--image-box">
    <b>News and announcements:</b>
    <a href="https://t.me/smarkform" rel="noopener noreferrer">
    <img src="/assets/Telegram_Channel.png" alt="SmarkForm Telegram Channel" style="width: 100%; height: auto;">
    </a>
  </div>
  <div class="qr--image-box">
    <b>Community Chat:</b>
    <a href="https://t.me/SmarkFormCommunity" rel="noopener noreferrer">
    <img src="/assets/Telegram_Community.png" alt="SmarkForm Telegram Community" style="width: 100%; height: auto;">
    </a>
  </div>
</div>


## Contributing

We welcome any feedback, suggestions, or improvements as we continue to enhance
and expand the functionality of SmarkForm.

👉 See the [🔗 Contributing Section]({{ "community/contributing" | relative_url }}) for more details.


## License

[🔗 MIT]({{ "community/license" | relative_url }})



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
