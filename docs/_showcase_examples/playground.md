---
title: "Playground"
layout: chapter
permalink: "/showcase_examples/playground"
nav_order: 3
redirect_from:
  - "/resources/playground"
---


# {{ page.title }}

The interactive examples throughout this documentation are powered by the
**JSON playground editor** — a SmarkForm form that wraps every example.  Like
everything else in SmarkForm, the editor itself is built entirely with
SmarkForm components, with **no additional JavaScript**.


<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Architecture](#architecture)
* [Exploring the Editor](#exploring-the-editor)
* [Random Examples](#random-examples)
    * [Simple Calculator](#simple-calculator)
    * [Keyboard Calculator](#keyboard-calculator)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


{% include components/sampletabs_ctrl.md %}



## Architecture

Every sampletabs example with `showEditor=true` is wrapped in an editor
scaffold that is **injected externally** by the documentation framework.  The
HTML you see in each example's HTML tab is **exactly** what you would write
yourself — the playground is not part of it.

The scaffold consists of:

- A **`demo` subform** wrapping the example HTML — all Export / Import
  operations target this subform, keeping the example's data isolated from
  the editor controls.

- A **JSON textarea** (`name:"editor"`) that acts as a scratchpad — export
  writes JSON here, import reads from it.

- **Trigger buttons** that operate on the demo subform:
  - `⬇️ Export` — exports the `demo` subform into the `editor` textarea
  - `⬆️ Import` — imports the `editor` textarea contents into the `demo` subform
  - `♻️ Reset` — resets the entire form to its `defaultValue` (restoring
    demo data and clearing the editor)
  - `❌ Clear` — clears all fields in the `demo` subform

## Exploring the Editor

Check the **✏️ Edit** checkbox on any example to see the full source code in
editable editors.  The **📋 Include playground editor** toggle shows or
hides the scaffold markup so you can compare the clean example with the
full playground implementation.

All examples in this documentation are SmarkForm forms — the playground
editor is just another demonstration of what SmarkForm can do.  The
Import / Export buttons are standard SmarkForm triggers with `context`
and `target` properties that pipe data between the `demo` subform and the
`editor` textarea.

## Random Examples

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
