---
title: "Playground"
layout: chapter
permalink: /resources/playground
nav_order: 5

---

# {{ page.title }}

The interactive examples throughout this documentation are powered by the
**JSON playground editor** — a SmarkForm form that wraps every example.  Like
everything else in SmarkForm, the editor itself is built entirely with
SmarkForm components, with **no additional JavaScript**.

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

{% raw %} <!-- calculator {{{ --> {% endraw %}
{% capture calculator -%}
<div id="myForm$$">
    <div class="calculator" data-smark='{"type": "input", "name": "display"}'>
        <input data-smark type="text" class="display" value="0" pattern="[0-9+\-*\/\(\).]+">
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

{% raw %} <!-- calculator_js {{{ --> {% endraw %}
{% capture calculator_js -%}
const invalidChars = /[^0-9+\-*\/().]+/g;

myForm.on("BeforeAction_import", async (ev) => {
    const prevValue = await ev.context.export();
    const key = ev.data;
    switch (key) {
        case "C": ev.data = "0"; break;
        case "Del": ev.data = prevValue.slice(0, -1) || "0"; break;
        case "=":
            try {
                ev.data = eval(prevValue.replace(invalidChars, ''));
            } catch (e) { alert("Invalid expression"); ev.preventDefault(); }
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
> [Events]({{ "/advanced_concepts/events" | relative_url }}) for the
> `on()`/`onLocal()` scoping pattern used here.
