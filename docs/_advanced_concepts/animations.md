---
title: "Animations"
layout: chapter
permalink: /advanced_concepts/animations
nav_order: 14

---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

SmarkForm is markup-agnostic and deliberately provides no built-in animation
engine — transitions are a design concern that belongs to your CSS.

The technique is straightforward: use SmarkForm's lifecycle events to add and
remove CSS classes on list items, and let CSS `transition` do the rest.

{% raw %}<!-- anim_example_html {{{ -->{% endraw %}
{% capture anim_example_html -%}
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

{% raw %}<!-- anim_example_css {{{ -->{% endraw %}
{% capture anim_example_css -%}
{{""}}#myForm$$ ul { list-style: none; padding: 0; }
{{""}}#myForm$$ li.anim-in {
  transform: translateX(-100%);
  opacity: 0;
  transition: transform 200ms ease, opacity 200ms ease;
}
{{""}}#myForm$$ li.anim-visible {
  transform: translateX(0);
  opacity: 1;
}
{{""}}#myForm$$ li.anim-out {
  transform: translateX(100%);
  opacity: 0;
  transition: transform 150ms ease, opacity 150ms ease;
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- anim_example_js {{{ -->{% endraw %}
{% capture anim_example_js -%}
const delay = ms => new Promise(r => setTimeout(r, ms));

myForm.onAll("afterRender", async (ev) => {
  if (ev.context.parent?.options.type !== "list") return;
  ev.context.targetNode.classList.add("anim-in");
  await delay(1);
  ev.context.targetNode.classList.add("anim-visible");
});

myForm.onAll("beforeUnrender", async (ev) => {
  if (ev.context.parent?.options.type !== "list") return;
  ev.context.targetNode.classList.add("anim-out");
  await delay(150);
});
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- anim_example_notes {{{ -->{% endraw %}
{% capture anim_example_notes -%}
Add or remove items to see the slide-in/slide-out animation. The `afterRender` handler adds the CSS class that triggers the entry transition; the `beforeUnrender` handler keeps the element visible while the exit animation plays.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="anim-example"
   htmlSource=anim_example_html
   cssSource=anim_example_css
   jsSource=anim_example_js
   notes=anim_example_notes
   selected="preview"
   tests=false
%}

## Lifecycle Events for Entry/Exit Animations

- **`afterRender`** — fires after a new item's DOM node has been inserted.
  Add an initial CSS class that hides or offsets the element, then — after a
  minimal delay to let the browser paint the initial state — add a second class
  that transitions it to its final visible position.

- **`beforeUnrender`** — fires before an item is removed from the DOM.
  Remove the "visible" class and return a `Promise` that resolves after the
  transition duration. SmarkForm awaits that promise, so the element stays in
  the document long enough for the exit animation to complete.

## Global vs. Per-List Application

`myForm.onAll()` listens on *all* components in the form. By adding a guard
that checks `ev.context.parent?.options.type !== "list"`, you can skip anything
that is not a direct child of a list — subforms, labels, buttons, etc.

The result is that **any list added anywhere in the form hierarchy** is
automatically animated without further wiring.

## Why Add the Class via JavaScript?

If the animation class were baked into the HTML template, every item would
start hidden even when JavaScript is unavailable. Adding it through the
`afterRender` handler ensures the animation only kicks in when JS is active,
so the form **degrades gracefully** without it.

## The 1ms Delay in `afterRender`

CSS transitions only fire when a property **changes** after the element is
already in the document. If both the hidden class and the visible class were
added in the same microtask, the browser would never observe the initial
hidden state and the transition would not play.

`await delay(1)` yields control for one event-loop tick, giving the rendering
engine a chance to paint the initial state before the visible class is applied.

## The `await` in `beforeUnrender`

SmarkForm awaits the return value of `beforeUnrender` handlers before detaching
the element from the DOM. By returning a promise that resolves after the CSS
`transition-duration`, you keep the element visible just long enough for the
exit animation to finish.

```css
.animated_item {
    transform: translateX(-100%);
    opacity: 0;
    transition: transform 200ms ease-out, opacity 200ms ease-out;
}

.animated_item.ongoing {
    transform: translateX(0);
    opacity: 1;
    transition: transform 200ms ease-in, opacity 200ms ease-in;
}
```

```javascript
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

myForm.onAll("afterRender", async function(ev) {
    if (ev.context.parent?.options.type !== "list") return;
    const item = ev.context.targetNode;
    item.classList.add("animated_item");
    await delay(1);
    item.classList.add("ongoing");
});

myForm.onAll("beforeUnrender", async function(ev) {
    if (ev.context.parent?.options.type !== "list") return;
    const item = ev.context.targetNode;
    item.classList.remove("ongoing");
    await delay(150);
});
```

> **See also:** [Events](events) for the full lifecycle event reference.
