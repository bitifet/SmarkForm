---
title: "Animations"
layout: chapter
permalink: /advanced_concepts/animations
nav_order: 3

---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

SmarkForm is markup-agnostic and deliberately provides no built-in animation
engine — transitions are a design concern that belongs to your CSS.

The technique is straightforward: use SmarkForm's lifecycle events to add and
remove CSS classes on list items, and let CSS `transition` do the rest.

## Simple Example — Two-Class Symmetric Animation

The simplest approach uses two CSS classes: a **base class** that defines the
off-screen position and the `transition`, and a **visible class** that overrides
the position to the final on-screen state.

Entry animation: add the base class → wait 1 ms for the browser to paint →
add the visible class.  Exit animation: remove the visible class → the base
class takes over → the `transition` plays in reverse.

{% raw %}<!-- anim_simple_html {{{ -->{% endraw %}
{% capture anim_simple_html -%}
<div id="myForm$$">
  <button data-smark='{"action":"addItem","context":"items"}' title="Add">➕ Add</button>
  <button data-smark='{"action":"removeItem","context":"items"}' title="Remove">➖ Remove</button>
  <ul data-smark='{"type":"list","name":"items","min_items":0}'>
    <li>
      <input data-smark type="text" placeholder="Type something...">
    </li>
  </ul>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- anim_simple_css {{{ -->{% endraw %}
{% capture anim_simple_css -%}
{{""}}#myForm$$ ul { list-style: none; padding: 0; }
{{""}}#myForm$$ li.anim-base {
  transform: translateX(-100%);
  opacity: 0;
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}
{{""}}#myForm$$ li.anim-base.anim-visible {
  transform: translateX(0);
  opacity: 1;
  transition: transform 200ms ease-in, opacity 200ms ease-in;
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- anim_simple_js {{{ -->{% endraw %}
{% capture anim_simple_js -%}
const delay = ms => new Promise(r => setTimeout(r, ms));

myForm.onAll("afterRender", async (ev) => {
  if (ev.context.parent?.options.type !== "list") return;
  const item = ev.context.targetNode;
  item.classList.add("anim-base");
  await delay(1); // Important: let the browser paint the initial state
  item.classList.add("anim-visible");
});

myForm.onAll("beforeUnrender", async (ev) => {
  if (ev.context.parent?.options.type !== "list") return;
  const item = ev.context.targetNode;
  item.classList.remove("anim-visible");
  await delay(200);
});
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- anim_simple_notes {{{ -->{% endraw %}
{% capture anim_simple_notes -%}
Add items to see them slide in from the left; remove items to see them slide back out.

**Why the 1 ms delay in `afterRender`?**

CSS transitions only fire when a property *changes* after the element is already in the document. If both `anim-base` and `anim-visible` were added in the same microtask, the browser would never observe the initial hidden state and the transition would not play. The `await delay(1)` yields control for one event-loop tick, giving the rendering engine a chance to paint the initial state before the visible class is applied.

**Why add `anim-base` via JavaScript instead of in the HTML?**

If the class were baked into the template, every item would start hidden even when JavaScript is unavailable. Adding it through `afterRender` ensures the animation only kicks in when JS is active, so the form **degrades gracefully** without it.

**Why `await` in `beforeUnrender`?**

SmarkForm awaits the return value of `beforeUnrender` handlers before detaching the element from the DOM. By resolving the promise after the CSS `transition-duration`, we keep the element visible just long enough for the exit animation to finish.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="anim-simple"
   htmlSource=anim_simple_html
   cssSource=anim_simple_css
   jsSource=anim_simple_js
   notes=anim_simple_notes
   selected="preview"
   tests=false
%}

## Advanced Example — Asymmetric Entry and Exit

The two-class approach always plays the same transition in reverse for exit.
Sometimes you want **different** entry and exit effects — for example, sliding
in from the left but fading out on removal.

This needs a third class for the exit state.  The technique is the same:
`afterRender` handles entry, `beforeUnrender` handles exit.  Both use a 1 ms
delay before applying the final state so the browser has time to register the
starting position.

{% raw %}<!-- anim_adv_html {{{ -->{% endraw %}
{% capture anim_adv_html -%}
<div id="myForm$$">
  <button data-smark='{"action":"addItem","context":"tasks","hotkey":"+"}' title="Add task">➕ Add task</button>
  <button data-smark='{"action":"removeItem","context":"tasks","hotkey":"Delete","preserve_non_empty":true}' title="Remove empty">🧹</button>
  <ul data-smark='{"type":"list","name":"tasks","min_items":1}'>
    <li>
      <label data-smark>
        <span data-smark='{"action":"position"}'>N</span>
        <input data-smark type="text" name="title" placeholder="Task description...">
      </label>
      <button data-smark='{"action":"removeItem","hotkey":"-"}' title="Remove">➖</button>
    </li>
  </ul>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- anim_adv_css {{{ -->{% endraw %}
{% capture anim_adv_css -%}
{{""}}#myForm$$ ul { list-style: none; padding: 0; }
{{""}}#myForm$$ li {
  display: flex; align-items: center; gap: 0.4em;
  margin: 0.2em 0;
}
{{""}}#myForm$$ li label { flex: 1; }
{{""}}#myForm$$ li.adv-in {
  transform: translateX(-100%);
  transition: transform 300ms ease-out;
}
{{""}}#myForm$$ li.adv-visible {
  transform: translateX(0);
}
{{""}}#myForm$$ li.adv-out {
  opacity: 0;
  transition: opacity 250ms ease-in;
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- anim_adv_js {{{ -->{% endraw %}
{% capture anim_adv_js -%}
const delay = ms => new Promise(r => setTimeout(r, ms));

myForm.onAll("afterRender", async (ev) => {
  if (ev.context.parent?.options.type !== "list") return;
  const item = ev.context.targetNode;
  item.classList.add("adv-in");
  await delay(1);
  item.classList.add("adv-visible");
});

myForm.onAll("beforeUnrender", async (ev) => {
  if (ev.context.parent?.options.type !== "list") return;
  const item = ev.context.targetNode;
  item.classList.add("adv-out");
  await delay(250);
});
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- anim_adv_notes {{{ -->{% endraw %}
{% capture anim_adv_notes -%}
Entry slides in from the left (`translateX` only, 300 ms). Exit fades out (`opacity` only, 250 ms) — the two effects are independent.

**Why separate effects instead of symmetric?**

A symmetric effect (slide right for exit) puts the slowest part of the `ease-in` curve near the off-screen position, where the element is already nearly invisible. An `opacity`-only exit is simpler and looks cleaner. You can also compose both (`transform` + `opacity`) for a combined effect — the key is that the three-class approach lets you pick any combination.

**Why the 1 ms delay in exit too?**

When adding `adv-out`, the element already has `adv-visible` overriding it to `translateX(0)`. The `adv-out` class changes `opacity` from 1 to 0. Adding the class and `await` in the same tick would batch the style change — the 1 ms delay lets the browser register the new `opacity` before we start waiting for the animation to finish.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="anim-adv"
   htmlSource=anim_adv_html
   cssSource=anim_adv_css
   jsSource=anim_adv_js
   notes=anim_adv_notes
   selected="preview"
   tests=false
%}

## Lifecycle Events for Entry/Exit Animations

- **`afterRender`** — fires after a new item's DOM node has been inserted.
  Add an initial CSS class that hides or offsets the element, then — after a
  minimal delay to let the browser paint the initial state — add a second class
  that transitions it to its final visible position.

- **`beforeUnrender`** — fires before an item is removed from the DOM.
  Remove the "visible" class (or add an exit class) and return a `Promise` that
  resolves after the transition duration. SmarkForm awaits that promise, so the
  element stays in the document long enough for the exit animation to complete.

## Global vs. Per-List Application

`myForm.onAll()` listens on *all* components in the form. By adding a guard
that checks `ev.context.parent?.options.type !== "list"`, you can skip anything
that is not a direct child of a list — subforms, labels, buttons, etc.

The result is that **any list added anywhere in the form hierarchy** is
automatically animated without further wiring.

> **See also:** [Events](events) for the full lifecycle event reference.
