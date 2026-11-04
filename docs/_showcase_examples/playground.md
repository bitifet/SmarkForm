---
title: "Playground"
layout: chapter
description: "Try a complete SmarkForm example, inspect and edit its source, and use the JSON playground to import, export, reset, and clear form data."
permalink: "/showcase_examples/playground"
nav_order: 3
redirect_from:
  - "/resources/playground"
---


# {{ page.title }}

Use this page to try a complete form, change its data, and explore how the
interactive examples elsewhere in the documentation work. Start with the form
below, then follow the short workflow to export, edit, and re-import its JSON.

<details class="chaptertoc">
<summary><strong>📖 Table of Contents</strong></summary>
{% include chaptertoc/playground.html depth=3 %}
</details>

{% include components/sampletabs_ctrl.md %}

## Try a complete form

This event plan includes basic fields and a guest list. Each guest is a nested
form with a name, email address, and meal choice. The initial values are sample
data; change them freely.

{% raw %}<!-- guided_form_html {{{ -->{% endraw %}
{% capture guided_form_html -%}
<div id="myForm$$">
  <div class="event-plan">
    <h3>Community Picnic</h3>
    <div class="event-fields">
      <label>Event name <input data-smark type="text" name="title"></label>
      <label>Date <input data-smark type="date" name="date"></label>
      <label>Location <input data-smark type="text" name="location"></label>
    </div>
    <fieldset>
      <legend>Guests</legend>
      <ul data-smark='{"type":"list","name":"guests","of":"form","min_items":1,"max_items":6}'>
        <li>
          <div class="guest-card">
            <label>Name <input data-smark type="text" name="name" placeholder="Guest name"></label>
            <label>Email <input data-smark type="email" name="email" placeholder="name@example.com"></label>
            <label>Meal
              <select data-smark name="meal">
                <option value="Standard">Standard</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </label>
            <button data-smark='{"action":"removeItem"}' type="button" title="Remove guest">Remove</button>
          </div>
        </li>
      </ul>
      <button data-smark='{"action":"addItem","context":"guests"}' type="button">➕ Add guest</button>
    </fieldset>
  </div>
</div>{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- guided_form_css {{{ -->{% endraw %}
{% capture guided_form_css -%}
{{""}}#myForm$$ .event-plan { max-width: 42rem; margin-inline: auto; }
{{""}}#myForm$$ .event-fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); gap: .75rem; }
{{""}}#myForm$$ label { display: grid; gap: .25rem; }
{{""}}#myForm$$ input, #myForm$$ select { box-sizing: border-box; width: 100%; }
{{""}}#myForm$$ ul { list-style: none; padding: 0; }
{{""}}#myForm$$ .guest-card { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); align-items: end; gap: .75rem; margin-block: .5rem; padding: .75rem; border: 1px solid #ccc; border-radius: .5rem; }
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- guided_form_js {{{ -->{% endraw %}
{% capture guided_form_js -%}
// The fields and guest list are handled declaratively; this example needs no custom JavaScript.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- guided_form_notes {{{ -->{% endraw %}
{% capture guided_form_notes -%}
1. In **Preview**, change a field or add and remove guests.
2. Choose **⬇️ Export** to put the current form data in the JSON editor. Edit
   that JSON and choose **⬆️ Import** to load it back into the form.
3. **❌ Clear** empties the example form. **♻️ Reset** restores the picnic data
   and clears the editor.
4. Use **HTML**, **CSS**, and **JS** to inspect each source, and **Notes** for
   example-specific guidance. **❓ Help** explains the available controls.
5. Choose **✏️ Edit** to try source changes. Select **▶️ Run** to preview them;
   your edits affect only this preview. In edit mode, **📋 Include playground
   editor** adds or removes the JSON controls from the generated example so you
   can compare both versions.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- guided_form_demoValue {{{ -->{% endraw %}
{% capture guided_form_demoValue -%}
{
  "title": "Community Picnic",
  "date": "2026-06-20",
  "location": "Riverside Park",
  "guests": [
    {"name": "Alex Rivera", "email": "alex@example.com", "meal": "Vegetarian"},
    {"name": "Sam Chen", "email": "sam@example.com", "meal": "Standard"}
  ]
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- guided_form_tests {{{ -->{% endraw %}
{% capture guided_form_tests -%}
export default async ({ expect, root, readField, writeField }) => {
    await expect(root).toBeVisible();
    await writeField('/', {
        title: 'Community Picnic',
        date: '2026-06-20',
        location: 'Riverside Park',
        guests: [
            {name: 'Alex Rivera', email: 'alex@example.com', meal: 'Vegetarian'},
            {name: 'Sam Chen', email: 'sam@example.com', meal: 'Standard'},
        ],
    });
    expect(await readField('/guests/0/name')).toBe('Alex Rivera');
    await root.getByRole('button', {name: '➕ Add guest'}).click();
    await root.locator('input[name="name"]').nth(2).fill('Jordan Lee');
    expect(await readField('/guests/2/name')).toBe('Jordan Lee');
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="playground-guided-form"
    htmlSource=guided_form_html
    cssSource=guided_form_css
    jsSource=guided_form_js
    notes=guided_form_notes
    demoValue=guided_form_demoValue
    showEditor=true
    selected="preview"
    tests=guided_form_tests
%}

## Explore more examples

These examples show other useful combinations of SmarkForm features:

- [Nested forms and lists]({{ "/start_here/core_concepts" | relative_url }}#example-nested_forms) — build a structured value from nested fields and lists.
- [Deep lists and cross-list moves]({{ "/component_reference/list" | relative_url }}#example-deep_school_groups) — move nested student forms, including their grades, between lists.
- [Nested mixin composition]({{ "/guides/mixin_types" | relative_url }}#example-mixin_nested_composition) — compose reusable templates and fill their named slots.
- [Copy data between adjacent items]({{ "/guides/form_traversing" | relative_url }}#example-form_trav_copy_adjacent) — use relative paths to copy values between list rows.
- [Context-sensitive hotkeys]({{ "/accessibility/hotkeys" | relative_url }}#example-hotkeys_context_sensitivity) — let the same shortcut act on the nearest relevant list.
- [Animated task list]({{ "/guides/events" | relative_url }}#example-events-animated-tasks) — coordinate CSS transitions with list lifecycle events.
- [Image resizing and format conversion]({{ "/component_reference/image" | relative_url }}#example-image_resize_format) — validate and transform an uploaded image.

## Appendix A: Standalone examples

The following focused experiments illustrate individual patterns. The guided
form above and the linked examples are better starting points for building a
complete application form.

### Simple Calculator

This example leverages the **singleton pattern** to avoid specifying the
context for every button. A single import handler intercepts each button
press and updates the display field.

A single event handler on `BeforeAction_import` does all the work: it reads
the current value, appends or evaluates the new input, and updates the
display.  You can use the calculator buttons or type directly — every button
click brings focus back to the input field.

Evaluation uses a small arithmetic parser limited to numbers, parentheses,
and the four basic operators; invalid expressions display `Error`.
Hold `Ctrl` to reveal the keyboard shortcuts on the calculator buttons.

{% raw %} <!-- calculator {{{ --> {% endraw %}
{% capture calculator -%}
<div id="myForm$$">
    <div class="calculator" data-smark='{"type": "input", "name": "display"}'>
        <input data-smark type="text" class="display" value="0" pattern="[0-9+\*\/\(\)\.\-]+">
        <div class="buttons">
            <button data-smark='{"action": "import", "data": "C", "hotkey": "c"}' class="clear">C</button>
            <button data-smark='{"action": "import", "data": "("}'>(</button>
            <button data-smark='{"action": "import", "data": ")"}'>)</button>
            <button data-smark='{"action": "import", "data": "/", "hotkey": "/"}' class="operator">÷</button>
            <button data-smark='{"action": "import", "data": "7"}'>7</button>
            <button data-smark='{"action": "import", "data": "8"}'>8</button>
            <button data-smark='{"action": "import", "data": "9"}'>9</button>
            <button data-smark='{"action": "import", "data": "*", "hotkey": "*"}' class="operator">×</button>
            <button data-smark='{"action": "import", "data": "4"}'>4</button>
            <button data-smark='{"action": "import", "data": "5"}'>5</button>
            <button data-smark='{"action": "import", "data": "6"}'>6</button>
            <button data-smark='{"action": "import", "data": "-", "hotkey": "-"}' class="operator">-</button>
            <button data-smark='{"action": "import", "data": "1"}'>1</button>
            <button data-smark='{"action": "import", "data": "2"}'>2</button>
            <button data-smark='{"action": "import", "data": "3"}'>3</button>
            <button data-smark='{"action": "import", "data": "+", "hotkey": "+"}' class="operator">+</button>
            <button data-smark='{"action": "import", "data": "0"}'>0</button>
            <button data-smark='{"action": "import", "data": "."}'>.</button>
            <button data-smark='{"action": "import", "data": "Del"}'>←</button>
            <button data-smark='{"action": "import", "data": "=", "hotkey": "Enter"}' class="equals">=</button>
        </div>
    </div>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- calculator_css {{{ --> {% endraw %}
{% capture calculator_css -%}
{{""}}#myForm$$ .calculator { background-color: #333; border-radius: 10px; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); width: 300px; }
{{""}}#myForm$$ .display { width: 100%; box-sizing: border-box; background: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 10px; margin-bottom: 10px; font-size: 24px; text-align: right; }
{{""}}#myForm$$ .display:invalid { background-color: #fcc; }
{{""}}#myForm$$ .buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
{{""}}#myForm$$ button { padding: 15px; font-size: 18px; border: none; border-radius: 5px; cursor: pointer; background-color: #555; color: white; }
{{""}}#myForm$$ button:hover { background-color: #777; }
{{""}}#myForm$$ .operator { background-color: #f9a825; }
{{""}}#myForm$$ .operator:hover { background-color: #ffb300; }
{{""}}#myForm$$ .equals { background-color: #4caf50; }
{{""}}#myForm$$ .equals:hover { background-color: #66bb6a; }
{{""}}#myForm$$ .clear { background-color: #d32f2f; }
{{""}}#myForm$$ .clear:hover { background-color: #ef5350; }
{{""}}#myForm$$ button { position: relative; }
{{""}}#myForm$$ [data-hotkey]::after {
    content: "Ctrl+" attr(data-hotkey);
    position: absolute; top: 0.75em; left: 0;
    font-size: 0.7em; background: #333; color: #fff;
    padding: 1px 4px; border-radius: 3px; white-space: nowrap;
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %}<!-- arithmetic_parser_js {{{ -->{% endraw %}
{% capture arithmetic_parser_js -%}
function evaluateArithmetic(source) {
    const expression = String(source).trim();
    const tokenPattern = /\s*([0-9]+(?:\.[0-9]*)?|\.[0-9]+|[()+\-*\/])/y;
    const tokens = [];
    let cursor = 0;
    while (cursor < expression.length) {
        tokenPattern.lastIndex = cursor;
        const match = tokenPattern.exec(expression);
        if (!match) throw new Error('Invalid expression');
        tokens.push(match[1]);
        cursor = tokenPattern.lastIndex;
    }

    let index = 0;
    const primary = () => {
        const token = tokens[index++];
        if (token === '+') return primary();
        if (token === '-') return -primary();
        if (token === '(') {
            const value = additive();
            if (tokens[index++] !== ')') throw new Error('Missing )');
            return value;
        }
        if (token == null || Number.isNaN(Number(token))) throw new Error('Expected a number');
        return Number(token);
    };
    const multiplicative = () => {
        let value = primary();
        while (tokens[index] === '*' || tokens[index] === '/') {
            const operator = tokens[index++];
            const next = primary();
            value = operator === '*' ? value * next : value / next;
        }
        return value;
    };
    const additive = () => {
        let value = multiplicative();
        while (tokens[index] === '+' || tokens[index] === '-') {
            const operator = tokens[index++];
            const next = multiplicative();
            value = operator === '+' ? value + next : value - next;
        }
        return value;
    };

    const result = additive();
    if (index !== tokens.length || !Number.isFinite(result)) {
        throw new Error('Invalid expression');
    }
    return String(result);
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- calculator_js {{{ -->{% endraw %}
{% capture calculator_js -%}
{{ arithmetic_parser_js }}

myForm.on("BeforeAction_import", async (ev) => {
    const prevValue = await ev.context.export();
    const key = ev.data;
    switch (key) {
        case "C": ev.data = "0"; break;
        case "Del": ev.data = prevValue.slice(0, -1) || "0"; break;
        case "=":
            try { ev.data = evaluateArithmetic(prevValue); }
            catch { ev.data = "Error"; }
            break;
        default:
            if (prevValue.trim() === "0") ev.data = key;
            else ev.data = prevValue + key;
    }
});
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="playground-calculator"
    htmlSource=calculator
    jsSource=calculator_js
    cssSource=calculator_css
    selected="preview"
    tests=false
%}

> This calculator was previously in the Showcase section. See
> [Events]({{ "/guides/events" | relative_url }}) for the
> `on()`/`onLocal()` scoping pattern used here.

### Keyboard Calculator

This variation accepts keyboard input as well as button clicks. Its arithmetic
parser is limited to numbers, parentheses, and `+`, `-`, `*`, `/`; it does not
evaluate arbitrary JavaScript or intercept keys outside the display field.

{% raw %}<!-- supercalculator_html {{{ -->{% endraw %}
{% capture supercalculator -%}
<div id="myForm$$">
  <div class="calculator" data-smark='{"type":"input","name":"display"}'>
    <input data-smark type="text" class="display" value="0" pattern="[0-9+\*\/\(\)\.\-]+">
    <div class="buttons">
      <button data-smark='{"action":"import","data":"C"}' class="clear">C</button>
      <button data-smark='{"action":"import","data":"("}'>(</button>
      <button data-smark='{"action":"import","data":")"}'>)</button>
      <button data-smark='{"action":"import","data":"/"}' class="operator">÷</button>
      <button data-smark='{"action":"import","data":"7"}'>7</button>
      <button data-smark='{"action":"import","data":"8"}'>8</button>
      <button data-smark='{"action":"import","data":"9"}'>9</button>
      <button data-smark='{"action":"import","data":"*"}' class="operator">×</button>
      <button data-smark='{"action":"import","data":"4"}'>4</button>
      <button data-smark='{"action":"import","data":"5"}'>5</button>
      <button data-smark='{"action":"import","data":"6"}'>6</button>
      <button data-smark='{"action":"import","data":"-"}' class="operator">−</button>
      <button data-smark='{"action":"import","data":"1"}'>1</button>
      <button data-smark='{"action":"import","data":"2"}'>2</button>
      <button data-smark='{"action":"import","data":"3"}'>3</button>
      <button data-smark='{"action":"import","data":"+"}' class="operator">+</button>
      <button data-smark='{"action":"import","data":"0"}'>0</button>
      <button data-smark='{"action":"import","data":"."}'>.</button>
      <button data-smark='{"action":"import","data":"Backspace"}'>←</button>
      <button data-smark='{"action":"import","data":"="}' class="equals">=</button>
    </div>
  </div>
</div>{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- supercalculator_js {{{ -->{% endraw %}
{% capture supercalculator_js -%}
{{ arithmetic_parser_js }}

function updateDisplay(previous, key) {
    if (key === 'C' || key === 'Delete') return '0';
    if (key === 'Backspace') return previous.slice(0, -1) || '0';
    if (key === '=' || key === 'Enter') {
        try { return evaluateArithmetic(previous); }
        catch { return 'Error'; }
    }
    if (!/^[0-9.+\-*\/()]$/.test(key)) return previous;
    if (previous === 'Error') previous = '0';
    if (previous === '0' && /^[0-9]$/.test(key)) return key;
    return previous + key;
}

myForm.on('BeforeAction_import', async (event) => {
    event.data = updateDisplay(await event.context.export(), event.data);
});

myForm.rendered.then(() => {
    const displayNode = myForm.targetNode.querySelector('input.display');
    const field = myForm.getComponent(displayNode);
    let keyQueue = Promise.resolve();
    // Window capture runs before SmarkForm's document-level Enter navigation
    // listener, so the calculator can consume Enter instead of being preempted.
    window.addEventListener('keydown', (event) => {
        if (event.target !== field.targetFieldNode) return;
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
        const key = event.key;
        if (
            key !== 'Enter' && key !== 'Backspace' && key !== 'Delete'
            && !/^[0-9.+\-*\/()]$/.test(key)
        ) return;
        event.preventDefault();
        keyQueue = keyQueue.then(async () => {
            await field.import(
                updateDisplay(await field.export(), key),
                {set_default: false}
            );
        }).catch((error) => console.error('Calculator key handling failed:', error));
    }, true);
});
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- supercalculator_css {{{ -->{% endraw %}
{% capture supercalculator_css -%}
{{ calculator_css }}
{{""}}#myForm$$ .calculator input.display { caret-color: transparent; }
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- supercalculator_notes {{{ -->{% endraw %}
{% capture supercalculator_notes -%}
👉 Use the buttons or type directly in the display. Keyboard handling is limited
to the display and arithmetic keys; unrelated keys keep their normal behavior.

👉 The parser evaluates only arithmetic tokens and parentheses. It does not use
`eval` or execute arbitrary input.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- supercalculator_tests {{{ -->{% endraw %}
{% capture supercalculator_tests -%}
export default async ({ page, expect, root, readField }) => {
    await expect(root).toBeVisible();
    const display = root.locator('input.display');
    await display.focus();
    await page.keyboard.type('123+45');
    await expect.poll(() => readField('display')).toBe('123+45');
    await page.keyboard.press('Enter');
    await expect.poll(() => readField('display')).toBe('168');
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="supercalculator"
    htmlSource=supercalculator
    jsSource=supercalculator_js
    cssSource=supercalculator_css
    notes=supercalculator_notes
    selected="preview"
    tests=supercalculator_tests
%}

## Appendix B: How the editor is built

The interactive controls surround the form shown in the **HTML** tab; they are
not part of that example's source. This keeps the example focused on the form
itself while still providing a reusable way to inspect and change its data.

When enabled, the editor places the example inside a `demo` subform and adds a
JSON textarea beside it. **Export** and **Import** target only the demo form, so
the editor controls stay outside the data being edited. **Clear** clears the
demo form; **Reset** restores the root form's initial value and empties the JSON
textarea. The controls are ordinary SmarkForm components and triggers.

The Edit toolbar can include or omit this generated editor in the preview source.
This lets authors compare the compact form markup with the complete runnable
version without changing the documented form itself.
