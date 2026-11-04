---
title: SmarkForm
layout: smarkform
description: "Keep your HTML and CSS. Annotate form elements with data-smark to build nested subforms and variable-length lists that import and export structured JSON."
image:
  path: /assets/hero/social-card.png
  width: 1280
  height: 640
  alt: "SmarkForm logo surrounded by form examples: markup-driven, JSON in and out, no framework or dependencies."
permalink: "/"
nav_order: 0
---


{% include components/sampletabs_ctrl.md %}

{% raw %} <!-- event_planner_html {{{ --> {% endraw %}
{% capture event_planner_html -%}
<div id="myForm$$">
  <div class="ep">
    <p>
      <label data-smark>📋 Event:</label>
      <input data-smark name="title" type="text" placeholder="e.g. Sprint Review">
    </p>
    <p>
      <label data-smark>📅 Date:</label>
      <input data-smark name="date" type="date">
    </p>
    <p>
      <label data-smark>⏰ Time:</label>
      <input data-smark name="time" type="time">
    </p>
    <fieldset data-smark='{"type":"form","name":"organizer"}'>
      <legend data-smark='label'>👤 Organizer</legend>
      <p>
        <label data-smark>Name:</label>
        <input data-smark name="name" type="text">
      </p>
      <p>
        <label data-smark>Email:</label>
        <input data-smark name="email" type="email">
      </p>
    </fieldset>
    <div class="ep-list">
      <button data-smark='{"action":"removeItem","context":"attendees","hotkey":"Delete","preserve_non_empty":true}' title='Remove empty slots'>🧹</button>
      <button data-smark='{"action":"addItem","context":"attendees","hotkey":"+"}' title='Add attendee'>➕</button>
      <strong data-smark='label'>👥 Attendees:</strong>
      <ul data-smark='{"type":"list","name":"attendees","sortable":true,"export_empties":false}'>
        <li>
          <details>
            <summary>
              <span data-smark-type="label" class="bullet">
                <span data-smark-action="position">N</span> ☰
              </span>
              <input data-smark type="text" name="name" placeholder="Name">
              <button data-smark='{"action":"removeItem","hotkey":"-"}' title='Remove'>➖</button>
              <button data-smark='{"action":"addItem","hotkey":"+"}' title='Insert here'>➕</button>
            </summary>
            <div class="ep-attendee-details">
              <input data-smark type="email" name="email" placeholder="Email">
              <input data-smark type="tel" name="phone" placeholder="Phone">
            </div>
          </details>
        </li>
      </ul>
    </div>
    <p class="ep-hint">💡 Hold <kbd>Ctrl</kbd> to reveal shortcuts</p>
  </div>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- event_planner_css {{{ --> {% endraw %}
{% capture event_planner_css -%}
{{""}}#myForm$$ .ep {
    display: flex;
    flex-direction: column;
    gap: 0.35em;
    max-width: 460px;
    font-size: 0.95em;
}
{{""}}#myForm$$ .ep p {
    display: flex;
    align-items: center;
    gap: 0.5em;
    margin: 0;
}
{{""}}#myForm$$ .ep label {
    font-weight: 500;
    white-space: nowrap;
}
{{""}}#myForm$$ .ep label:not(.bullet) {
    min-width: 4.5em;
}
{{""}}#myForm$$ .ep input {
    padding: 0.3em 0.5em;
    border: 1px solid #ccc !important;
    border-radius: 4px;
}
{{""}}#myForm$$ .ep input[type="text"],
{{""}}#myForm$$ .ep input[type="email"] { flex: 1; }
{{""}}#myForm$$ .ep fieldset {
    border: 1px solid #ddd !important;
    border-radius: 6px;
    padding: 0.4em 0.8em 0.6em;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3em;
}
{{""}}#myForm$$ .ep fieldset legend { font-weight: bold; padding: 0 0.3em; }
{{""}}#myForm$$ .ep-list ul {
    list-style: none !important;
    padding: 0 !important;
    margin: 0.2em 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
}
{{""}}#myForm$$ .ep-list ul li { display: flex; align-items: flex-start; gap: 0.3em; }
{{""}}#myForm$$ .ep-list ul li details {
    width: 100%;
    border: 1px solid transparent;
    border-radius: 4px;
    transition: border-color 0.15s;
}
{{""}}#myForm$$ .ep-list ul li details[open] {
    border-color: #ccc;
    padding-bottom: 4px;
}
{{""}}#myForm$$ .ep-list ul li summary {
    display: flex;
    align-items: center;
    gap: 0.4em;
    cursor: default;
    user-select: none;
    padding: 0.1em 0.2em;
    list-style: none;
}
{{""}}#myForm$$ .ep-attendee-details {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    padding: 0.35em 0.4em 0.1em 1.5em;
}
{{""}}#myForm$$ .ep-attendee-details input { flex: 1; min-width: 120px; }
{{""}}#myForm$$ .ep-hint {
    font-size: 0.82em;
    color: #888;
    margin: 0.15em 0 0;
}
{{""}}#myForm$$ .ep-hint kbd {
    background: #f4f4f4;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 1px 4px;
}
/* Hotkey hints revealed on Ctrl press */
{{""}}#myForm$$ [data-hotkey]{position:relative}
{{""}}#myForm$$ [data-hotkey]::after{
    content:"Ctrl+" attr(data-hotkey);
    position:absolute; top:-1.6em; left:0;
    font-size:0.7em;
    background:#333; color:#fff;
    padding:1px 4px; border-radius:3px;
    white-space:nowrap;
}
/* Attendee list item entry/exit animations */
{{""}}#myForm$$ .ep-list ul li.animated_item {
    transform: translateX(-100%);
    opacity: 0;
    transition: transform 200ms ease, opacity 200ms ease;
}
{{""}}#myForm$$ .ep-list ul li.animated_item.ongoing {
    transform: translateX(0);
    opacity: 1;
}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- event_planner_js {{{ --> {% endraw %}
{% capture event_planner_js %}const delay = ms=>new Promise(resolve=>setTimeout(resolve, ms));
{{""}}myForm.onAll("afterRender", async function(ev) {
    if (ev.context.parent?.options.type !== "list") return;
    const item = ev.context.targetNode;
    item.classList.add("animated_item");
    await delay(1);
    item.classList.add("ongoing");
});
{{""}}myForm.onAll("beforeUnrender", async function(ev) {
    if (ev.context.parent?.options.type !== "list") return;
    const item = ev.context.targetNode;
    item.classList.remove("ongoing");
    await delay(150);
});
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

<style>
.SmarkForm-Video {
    display: block;
    width: 100%;
    max-width: 960px;
    margin: 1.25rem auto 0;
    border-radius: .5rem;
    background: #000;
    aspect-ratio: 16 / 9;
}
.SmarkForm-Video-Caption {
    margin: .35em 0 0;
    text-align: center;
    font-size: .85em;
}
.SmarkForm-FieldModel {
    width: 100%;
    max-width: 720px;
    margin: 1.25rem auto;
    text-align: center;
}
.SmarkForm-FieldModel img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: .5rem;
}
.SmarkForm-FieldModel figcaption {
    margin-top: .35em;
    font-size: .9em;
}
</style>

<h1>SmarkForm</h1>

SmarkForm turns annotated HTML into a component tree whose fields, nested forms, and lists import and export structured JavaScript objects and arrays.

{% include components/badges.md %}

<video class="SmarkForm-Video" autoplay muted loop playsinline controls
       preload="metadata"
       poster="{{ '/assets/hero/poster.png' | relative_url }}"
       aria-label="SmarkForm demo: HTML annotated with data-smark attributes becomes a live form — fill in a profile with a picture, nest lists inside lists, drag a student to another group, duplicate a schedule period, export everything as a single JSON payload, then discover more features including media fields, hotkeys, masking, accessible controls, AI skills, and more">
  <source src="{{ '/assets/hero/SmarkForm_hero_web.mp4' | relative_url }}" type="video/mp4">
  Your browser cannot play embedded video —
  <a href="{{ '/assets/hero/SmarkForm_hero_web.mp4' | relative_url }}">watch the SmarkForm demo</a>.
</video>
<p class="SmarkForm-Video-Caption">
  🔇 Autoplays muted — unmute it (🔊 in the player controls) to hear the narration.
</p>

## How SmarkForm works

Keep your HTML and CSS. Add `data-smark` to the elements SmarkForm should manage, then initialize the root:

```html
<div id="profile">
  <input data-smark name="name" value="Ada">

  <fieldset data-smark='{"type":"form","name":"address"}'>
    <input data-smark name="city" value="Barcelona">
  </fieldset>

  <ul data-smark='{"type":"list","name":"phones"}'>
    <li><input data-smark name="number" value="+34 600 000 000"></li>
  </ul>
</div>

<script>
  new SmarkForm(document.getElementById("profile"));
</script>
```

That markup describes a component tree. Exporting the root returns ordinary structured data:

```json
{
  "name": "Ada",
  "address": { "city": "Barcelona" },
  "phones": [{ "number": "+34 600 000 000" }]
}
```

Named fields become object properties, each list item template becomes an array element, and forms and lists can nest to any depth. SmarkForm does not render a schema or take over your application: you still own the markup, styles, semantics, validation, and submission policy.

<figure class="SmarkForm-FieldModel">
  <img src="{{ '/assets/readme/field_model.svg' | relative_url }}"
       width="880" height="560" loading="lazy"
       alt="Animated diagram: every SmarkForm component is a field. Forms return objects, lists return arrays, and value fields return individual JSON values. Forms and lists can nest to any depth.">
  <figcaption>Forms and lists are fields too, so they compose into nested JSON.</figcaption>
</figure>

## Try the interactive demo

A nested subform, a sortable list, context-driven hotkeys, and date/time coercion — all driven by `data-smark` attributes. Switch between the HTML, CSS, JavaScript, and preview tabs, then export the result as JSON.

{% capture demoValue -%}
{
    "title": "Sprint Review",
    "date": "2025-03-15",
    "time": "10:00:00",
    "organizer": {
        "name": "Alice Johnson",
        "email": "alice@example.com"
    },
    "attendees": [
        {"name": "Bob Smith",    "email": "bob@example.com",   "phone": "+1 555 200 0001"},
        {"name": "Carol White",  "email": "carol@example.com", "phone": "+1 555 200 0002"},
        {"name": "Dave Brown",   "email": "dave@example.com",  "phone": "+1 555 200 0003"}
    ]
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="event_planner"
    htmlSource=event_planner_html
    cssSource=event_planner_css
    jsSource=event_planner_js
    selected="preview"
    demoValue=demoValue
    showEditor=true
    tests=false
%}

## What you get

**The core model**

* [Your HTML and CSS stay yours]({{ "/about/features" | relative_url }}#markup-agnostic):
  Mark elements; do not hand over the layout.
* [Nested forms]({{ "/about/features" | relative_url }}#nestable-forms):
  Forms are fields that export objects and can nest to any depth.
* [Variable-length lists]({{ "/about/features" | relative_url }}#variable-length-lists):
  Lists export arrays, grow and shrink at runtime, and support drag-and-drop sorting.
* [JSON import and export]({{ "/about/features" | relative_url }}#json-based):
  Move structured data in and out of the whole form or any single field.

**Developer experience**

* [Declarative actions and context]({{ "/about/features" | relative_url }}#easy-to-use-low-code):
  Triggers find their fields from their position in the form tree.
* [Context-driven hotkeys]({{ "/about/features" | relative_url }}#context-driven-hotkeys):
  Keyboard shortcuts are scoped to where the user is working.
* [Consistent keyboard navigation]({{ "/about/features" | relative_url }}#consistent-user-experience):
  Enter/Shift+Enter move between fields; controls stay reachable.
* [Path-based addressing]({{ "/about/features" | relative_url }}#directory-like-addressability):
  Address fields by form structure, not DOM position.

**Additional capabilities**

* [Lightweight and dependency-free]({{ "/about/features" | relative_url }}#lightweight-yet-highly-compatible):
  One library, no runtime dependencies, ESM and UMD builds.
* [Accessibility support]({{ "/about/features" | relative_url }}#a11y-friendly):
  Label wiring and keyboard behavior, with the remaining author responsibilities stated clearly.
* [Media fields]({{ "/about/features" | relative_url }}#media-fields):
  File, image, video, and audio fields share the same value model.
* [AI-agent resources]({{ "/about/features" | relative_url }}#ai-agent-ready):
  Optional agent guidance for generating forms from a description.

## Start where you are

**See it**

* [Showcase]({{ "/showcase_examples/showcase" | relative_url }}) — interactive examples at a glance.
* [Downloadable examples]({{ "/showcase_examples/examples" | relative_url }}) — run and edit them locally.
* [Playground]({{ "/showcase_examples/playground" | relative_url }}) — experiment in the browser.

**Use it now**

* [Quick Start]({{ "/start_here/quick_start" | relative_url }}) — make a form and export a useful value.
* [Getting SmarkForm]({{ "/start_here/getting_smarkform" | relative_url }}) — CDN, npm, and downloaded copies.
* [Core Concepts]({{ "/start_here/core_concepts" | relative_url }}) — the component tree and data model.
* [Using SmarkForm]({{ "/guides/using_smarkform" | relative_url }}) — the fuller developer walkthrough.

**Go deeper**

* [Guides]({{ "/guides/using_smarkform" | relative_url }}) — tasks such as import/export, traversing, events, and mixins.
* [Component Reference]({{ "/component_reference/overview" | relative_url }}) — type-specific options and edge cases.
* [Developer Cheatsheet]({{ "/component_reference/cheatsheet" | relative_url }}) — a compact implementation reference.

**Decide whether it fits**

* [Introduction]({{ "/about/introduction" | relative_url }}) — what SmarkForm is and is not.
* [When SmarkForm Fits]({{ "/about/when_smarkform_fits" | relative_url }}) — a neutral comparison of approaches.
* [FAQ]({{ "/about/faq" | relative_url }}) — common questions and edge cases.

## Current Status

SmarkForm is stable and in active use, but still pre-1.0: implemented behavior is covered by tests, while the public API may evolve before 1.0.0. Not every initially planned feature is implemented; see the [Roadmap]({{ "/about/roadmap" | relative_url }}#current-status) for what is planned and what is not.

**Last Updated:** {{ site.data.computed.lastUpdated }}.

## Community and Support

If you don't find a solution in the documentation, feel free to open a [discussion on our GitHub repository](https://github.com/bitifet/SmarkForm/discussions).

For further support, you can contact me through our [Contact Page]({{ "/community/contact" | relative_url }}) or reach out via email at [smarkform@bitifet.net](mailto:smarkform@bitifet.net).

If you want to stay updated with the latest news, releases, and announcements, or join the community chat, you can follow us on Telegram:

### 🚀 Stay tuned

<style>
  .qr--container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: stretch;
    gap: 1rem;
    margin: 0.5rem 1rem;
  }

  .qr--figure {
    flex: 0 1 9rem;
    flex-grow: 1;
    margin: 0;
    text-align: center;
    outline: solid aliceblue 1px;
  }

  .qr--figure img {
    display: block;
    width: 144px;
    max-width: 100%;
    height: auto;
    margin: .5rem auto 0;
  }

  .qr--figure figcaption {
    color: #75b0e1;
  }

</style>
<div class="qr--container">
  <figure class="qr--figure">
    <a href="https://t.me/smarkform">
      <img src="{{ '/assets/Telegram_Channel.png' | relative_url }}" alt="Scan to follow SmarkForm news and announcements on Telegram">
    </a>
    <figcaption><b>News and announcements</b></figcaption>
  </figure>
  <figure class="qr--figure">
    <a href="https://t.me/SmarkFormCommunity">
      <img src="{{ '/assets/Telegram_Community.png' | relative_url }}" alt="Scan to join the SmarkForm Telegram community chat">
    </a>
    <figcaption><b>Community chat</b></figcaption>
  </figure>
</div>

## Contributing

We welcome feedback, suggestions, and improvements as we continue to enhance and expand SmarkForm.

👉 See the [Contributing section]({{ "/community/contributing" | relative_url }}) for more details.

## License

[🔗 MIT]({{ "/community/license" | relative_url }})
