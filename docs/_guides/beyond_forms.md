---
title: "Beyond Forms"
layout: chapter
description: "Apply SmarkForm's markup-driven component model beyond forms with a compact, interactive calculator."
permalink: "/guides/beyond_forms"
nav_order: 100
---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

SmarkForm is designed primarily for forms, but its component model can support
other interactive applications. It discovers marked components from HTML
attributes (and can infer types from native elements), then resolves trigger
contexts from their positions in the component tree. Those generic actions and
events can operate on any application state represented by components.

Forms remain the most convenient use: HTML controls naturally represent user
input, and their exported value is a useful application state. Hidden fields can
also hold internal state that does not need a visible control.

<details class="chaptertoc">
<summary><strong>📖 Table of Contents</strong></summary>
{% include chaptertoc/beyond_forms.html depth=2 %}
</details>

## Calculator

Here, the display value is the application's state. Buttons send `import`
actions to one field, and a small handler transforms each key using the previous
value. The first example uses only button imports; the second also handles
keyboard input.

Digits can also be typed directly into the display. Buttons with hotkeys show
their Ctrl shortcuts when you hold **Ctrl**; the other buttons remain clickable.
The JSON playground is disabled because its Import action would be interpreted
as a calculator key.

The handler replaces the initial zero, appends characters, deletes the last
character, clears the display, or evaluates the expression. For brevity, this
demo uses `eval` after removing characters outside the arithmetic set, so even
`2**10` works. Do not use that shortcut to evaluate general or untrusted input.

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

{% raw %}<!-- calculator_js {{{ -->{% endraw %}
{% capture calculator_js -%}
const invalidChars = /[^0-9+\-*\/().]+/g;

myForm.on("BeforeAction_import", async (ev)=>{
    const prevValue = await ev.context.export();
    const key = ev.data;
    switch (key) {
        case "C":
            ev.data = "0"; /* Clear display */
            break;
        case "Del":
            ev.data = prevValue.slice(0, -1) || "0"; /* Remove last character */
            break;
        case "=":
            try {
                /* Evaluate expression */
                const sanitized = prevValue.replace(invalidChars, '');
                ev.data = eval(sanitized);
            } catch (e) {
                alert("Invalid expression");
                ev.preventDefault(); /* Keep existing data */
            }
            break;
        default:
            if (prevValue.trim() === "0") {
                ev.data = key; /* Replace 0 with new input */
            } else {
                ev.data = prevValue + key; /* Append to existing value */
            };
    };
});
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- calculator_tests {{{ -->{% endraw %}
{% capture calculator_tests -%}
export default async ({ expect, root, readField }) => {
    const display = root.locator('input.display');
    await expect(display).toHaveValue('0');
    await display.fill('123');
    await root.getByRole('button', {name: '+'}).click();
    await expect.poll(() => readField('display')).toBe('123+');
    await display.pressSequentially('45');
    await root.getByRole('button', {name: '='}).click();
    await expect.poll(() => readField('display')).toBe('168');
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="calculator"
    htmlSource=calculator
    jsSource=calculator_js
    cssSource=calculator_css
    selected="preview"
    showEditor=false
    tests=calculator_tests
%}

> `myForm.on()` catches the display field’s import action through event bubbling.
> With only one field, the handler has no unrelated imports to intercept. See
> [Events]({{ "/guides/events" | relative_url }}) for more about event scope.

**A keyboard-friendly refinement.** The first version lets the browser type
digits into the display and uses Ctrl hotkeys for the other operations. This
version also handles keystrokes through SmarkForm’s `keydown` event: `Enter`
acts like `=`, `Delete` clears, and `Backspace` deletes the last character. It
prevents the input’s native editing and cursor movement, so the display behaves
more like a physical calculator.

The same `updateDisplay()` function handles both button imports and keyboard
input, keeping the calculator logic in one small place. The JSON playground is
disabled here for the same reason as in the first example.

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
var invalidChars = /[^0-9+\-*\/().]+/g;

function updateDisplay(prevValue, key) {
    switch (key.toLowerCase()) {
        case "c":
        case "delete":
            return "0"; /* Clear display */
            break;
        case "backspace":
            return prevValue.slice(0, -1) || "0"; /* Remove last character */
            break;
        case "=":
        case "enter": /* Keyboard enter key */
            try {
                /* Evaluate expression */
                const sanitized = prevValue.replaceAll(invalidChars, '');
                return eval(sanitized);
            } catch (e) {
                return "Error!";
            }
            break;
        default:
            if (!! key.match(invalidChars)) {
                return null; /* Let the browser handle unrelated keys. */
            };
            if (prevValue.replace(/[0\s]+/, "") === "") {
                return key; /* Replace 0 with new input */
            };
            return prevValue + key; /* Append to existing value */
    };
};

myForm.on("BeforeAction_import", async (ev)=>{
    const prevValue = await ev.context.export();
    const key = ev.data;
    ev.data = updateDisplay(prevValue, key);
});

myForm.on("keydown", async (ev)=>{
    const prevValue = await ev.context.export();
    const key = ev.originalEvent.key;
    const data = updateDisplay(prevValue, key);
    if (data === null) return;
    ev.preventDefault();
    await ev.context.import(data);
});
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- supercalculator_css {{{ -->{% endraw %}
{% capture supercalculator_css -%}
{{ calculator_css }}
{{""}}#myForm$$ .calculator input.display { caret-color: transparent; }
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- supercalculator_notes {{{ -->{% endraw %}
{% capture supercalculator_notes -%}
Type digits or operators directly, or use the buttons. The `keydown` handler
prevents the browser from moving the caret or editing the text; every key is
processed by `updateDisplay()`. Calculator keys are imported as a new display
value; other keys are left to the browser, so Tab continues to move focus.
`Enter` is an alias for `=`, `Delete` clears, and `Backspace` removes the last
character.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- supercalculator_tests {{{ -->{% endraw %}
{% capture supercalculator_tests -%}
export default async ({ page, expect, root, readField }) => {
    await expect(root).toBeVisible();
    const display = root.locator('input.display');
    await display.focus();
    await page.keyboard.press('Tab');
    await expect(root.getByRole('button', {name: 'C'})).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(display).toBeFocused();

    await root.getByRole('button', {name: '1'}).click();
    await page.keyboard.press('2');
    await root.getByRole('button', {name: '3'}).click();
    expect(await readField('display')).toBe('123');

    await root.getByRole('button', {name: '+'}).click();
    await page.keyboard.press('4');
    await root.getByRole('button', {name: '5'}).click();
    expect(await readField('display')).toBe('123+45');

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
    showEditor=false
    tests=supercalculator_tests
%}
