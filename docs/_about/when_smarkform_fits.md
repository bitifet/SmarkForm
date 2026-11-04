---
title: "When SmarkForm Fits"
layout: chapter
description: "A neutral guide to when SmarkForm's markup-first, structured-value model fits, and when a UI framework or schema-rendered form library may be a better choice."
permalink: "/about/when_smarkform_fits"
nav_order: 2
---

{% include links.md %}

{% include components/doctabs_ctrl.md %}

# {{ page.title }}


<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/when_smarkform_fits.html %}

</details>


## Start with the fit, not the feature list

SmarkForm is not the right tool for every form, and it does not try to replace
a general-purpose UI framework. The useful question is where the form's
structure, markup, and state should live.

SmarkForm is a good fit when **you already own the HTML** and want a structured
value model plus form-level actions without handing rendering to a framework.
It is a poor fit when the form UI must be generated from a schema, or when the
form must participate fully in a virtual-DOM application's state model. Most
projects fall somewhere in between.

## Three ways to build a form

| Approach | Where the UI comes from | Where the data lives | Strengths | Trade-offs |
|---|---|---|---|---|
| **Markup-first form controller** (SmarkForm) | HTML and CSS you author and keep | A component tree over the authored DOM; exports objects and arrays | Structure stays visible in HTML; nested forms and lists are native; no renderer or schema | You manage markup, styles, labels, validation, and submission; not an official framework adapter |
| **General-purpose UI framework** (React, Vue, Svelte, Angular) | Components or templates rendered by the framework | Application state, usually wired manually or through a state library | Fits the rest of the application; huge ecosystems; flexible rendering | You wire form state, list operations, labels, and serialization; the form model is your application's model |
| **Schema-rendered form library** | Generated from a schema or field definitions | Schema plus form state | Consistent UI, centralized validation, good for large dynamic forms | Less control over exact HTML/CSS; schema becomes another layer to learn and maintain |

The rows describe defaults, not hard limits. A project can combine approaches,
but the combination adds integration work and should be a deliberate choice.

## Questions to ask

* **Do we already have the HTML and CSS?** If yes, SmarkForm can enhance it in
  place. If the form must be generated from a schema, a schema-rendered library
  is usually a better fit.
* **Is the form data naturally nested?** Objects, repeated rows, and lists that
  nest to a few levels are SmarkForm's core case.
* **Who owns validation?** SmarkForm does not provide a validation rule engine.
  Native constraints, event hooks, and application-level checks remain yours.
* **Is the rest of the page a React/Vue application?** A DOM-first library does
  not participate in a virtual DOM's reconciliation. Use it for static or
  server-rendered regions, or choose a framework-native form approach.
* **Do we need a build step?** SmarkForm can be loaded from a CDN or a local
  copy; a build step is optional.

## Common good-fit environments

SmarkForm is a DOM-first, markup-driven library — and that is a feature, not a
limitation. It is usually a strong fit anywhere you own the HTML and want
powerful form behaviour without pulling in a heavyweight framework.

### Server-rendered HTML stacks

If your backend renders HTML (Ruby on Rails, Django, Laravel, Symfony, plain
PHP, ASP.NET Razor, Go templates…), you already own every DOM node before the
page loads. SmarkForm slots in with a single `<script>` import and a
`new SmarkForm(el)` call — no build pipeline required.

```html
<!-- Drop this at the bottom of your server-rendered page -->
<script type="module">
  import SmarkForm from "https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.esm.js";
  const myForm = new SmarkForm(document.getElementById("myForm"));
  myForm.on("AfterAction_export", ({ data }) => {
    fetch("/submit", { method: "POST", body: JSON.stringify(data) });
  });
</script>
```

Your backend devs keep writing plain HTML templates; SmarkForm upgrades them
silently.

### Static-site generators and JAMstack

Hugo, Jekyll, Eleventy, Astro (static output), Zola… — all generate HTML at
build time. SmarkForm enhances those static pages with dynamic form behaviour
without changing the rendering pipeline. The docs site you're reading right now
is a Jekyll site that uses exactly this pattern.

### Progressive enhancement of existing pages

Got a legacy app or a CMS (WordPress, Drupal, TYPO3, Joomla) where you can
add `data-smark` attributes but can't change the server stack? Add a small
`<script type="module">` block or enqueue the UMD bundle, point it at an
existing `<form>` or `<div>`, and the page instantly gains subforms,
variable-length lists, and JSON export — all without touching server code.

### Alpine.js and 'HTML-over-the-wire' stacks

[Alpine.js](https://alpinejs.dev/), [HTMX](https://htmx.org/),
[Hotwire/Turbo](https://hotwired.dev/), and similar tools share SmarkForm's
philosophy of keeping behaviour close to the markup. They pair naturally:

- **HTMX / Turbo** replace page fragments with server-rendered HTML; SmarkForm
  re-initialises on the new fragment via the `DOMContentLoaded` equivalent or a
  simple mutation observer.
- **Alpine.js** can call `myForm.export()` / `myForm.import()` from its event
  handlers, letting Alpine manage UI state while SmarkForm owns form data.

### Vanilla JavaScript projects and micro-frontends

When you don't want any framework at all — a standalone widget, an embeddable
form component, a micro-frontend — SmarkForm gives you complex form logic
(nested subforms, dynamic lists, hotkeys) in a single minified bundle with
zero runtime dependencies. See [Features]({{ "/about/features" | relative_url }}#lightweight-yet-highly-compatible)
for the measured artifact and its scope.

### Back-office tools and internal dashboards

Internal tooling rarely needs a polished React stack. A lightweight HTML page
plus SmarkForm can handle configuration editors, data-entry screens, and admin
panels with far less boilerplate than a full SPA framework, and with no Node.js
build step if you use the CDN.

### In short

| Environment | Why SmarkForm fits well |
|-------------|------------------------|
| Rails / Django / Laravel / PHP | You own the HTML; one `<script>` tag is all you need |
| Jekyll / Hugo / Eleventy | Static HTML at build time + dynamic forms at runtime |
| WordPress / Drupal / CMS | Add `data-smark` attributes; no server changes required |
| HTMX / Turbo / Alpine.js | Shared "HTML is the source of truth" philosophy |
| Vanilla JS widgets | Zero deps, tiny bundle, pure DOM API |
| Internal dashboards | No build pipeline needed; rapid iteration |

## A Picture is Worth a Thousand Words

Modern web development offers many solutions for building dynamic forms — from
dedicated libraries to general-purpose UI frameworks. For forms specifically,
the contrast can be striking. Below is the **exact same form** — a real-world
*Event Planner* with nested subforms and a dynamic attendees list — implemented
three ways.

- The first one is implemented with SmarkForm.
- The others are implemented with modern web frameworks trying to mimic the same behaviour and user experience as closely as possible while keeping the code as simple as possible.

{: .info :}
>All implementations were written by the same AI assistant (GitHub Copilot)
>with the explicit goal of making each as idiomatic and feature-equivalent as
>possible. **The intent is a fair comparison — not advocacy for any particular
>tool**.

The tables below summarise the implementations. They are **illustrative, not a
benchmark**: the example was designed around SmarkForm's capabilities, the
code-line and timing counts were not measured reproducibly, and no performance
or accessibility audit was run. Treat them as a way to inspect the shape of
each approach, not as a universal ranking.

---

### The Example: Event Planner

A moderately complex, real-world form:

- Basic fields: **title**, **date**, **time**
- A nested ***Organizer*** subform (name + email)
- A dynamic ***Attendees*** list where each row expands to reveal extra details
- Buttons to **add**, **insert**, **remove**, and **prune** (clean up empty
  rows) attendees
- A **position indicator** that reflects each item's current position in the
  list
- Drag-and-drop to **reorder** attendees (with a dedicated drag handle so text
  selection still works inside inputs)


---

### SmarkForm


All form behaviour is expressed through `data-smark` attributes directly in
the HTML. The JavaScript is a single line. Import/export, list management,
label associations and position counters are all built in.

{% comment %} ── SmarkForm example document ── {% endcomment %}

{% capture sf_doc -%}
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Planner – SmarkForm</title>
  <script src="{{ smarkform_umd_cdn_current }}"></script>
</head>
<body>
  <div id="myForm">
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
        <div>
          <button data-smark='{"action":"removeItem","context":"attendees","preserve_non_empty":true}' title="Remove empty rows">🧹</button>
          <button data-smark='{"action":"addItem","context":"attendees","hotkey":"+"}' title="Add attendee">➕</button>
          <strong data-smark='label'>👥 Attendees:</strong>
        </div>
        <ul data-smark='{"type":"list","name":"attendees","sortable":true,"export_empties":false}'>
          <li>
            <details>
              <summary>
                <span data-smark='{"type":"label"}' class="bullet">
                  <span data-smark='{"action":"position"}'>N</span> ☰
                </span>
                <input data-smark type="text" name="name" placeholder="Name">
                <button data-smark='{"action":"removeItem","hotkey":"-"}' title="Remove">➖</button>
                <button data-smark='{"action":"addItem","hotkey":"+"}' title="Insert here">➕</button>
              </summary>
              <div class="ep-attendee">
                <input data-smark type="email" name="email" placeholder="Email">
                <input data-smark type="tel" name="phone" placeholder="Phone">
              </div>
            </details>
          </li>
        </ul>
      </div>
      <p class="ep-hint">💡 Hold <kbd>Ctrl</kbd> to reveal shortcuts</p>
    </div>
  </div>
  <script>
    const myForm = new SmarkForm(document.getElementById('myForm'));
    // CDN drag-ghost workaround: use the compact <summary> row as the ghost
    // so folded and unfolded items produce a consistently-sized ghost image.
    document.getElementById('myForm').addEventListener('dragstart', function(e) {
      var li = e.target.closest && e.target.closest('li[draggable="true"]');
      if (!li) return;
      var ghost = li.querySelector('summary') || li;
      e.dataTransfer.setDragImage(ghost, 16, Math.round(ghost.offsetHeight / 2));
    }, true);
  </script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 1em; margin: 0; }
    button[data-smark] { padding: .3em .6em; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: #f8f9fa; }
    button[data-smark]:hover { background: #e9ecef; }
    .ep { display: flex; flex-direction: column; gap: .4em; max-width: 460px; font-size: .95em; }
    .ep p { display: flex; align-items: center; gap: .5em; margin: 0; }
    .ep label { font-weight: 500; white-space: nowrap; min-width: 5em; }
    .ep input { padding: .3em .5em; border: 1px solid #ccc; border-radius: 4px; flex: 1; }
    .ep fieldset { border: 1px solid #ddd; border-radius: 6px; padding: .4em .8em .6em; margin: 0; display: flex; flex-direction: column; gap: .3em; }
    .ep fieldset legend { font-weight: bold; padding: 0 .3em; }
    .ep-list > div { display: flex; align-items: center; gap: .4em; margin-bottom: .2em; }
    .ep-list ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .25em; }
    .ep-list li details { border: 1px solid transparent; border-radius: 4px; }
    .ep-list li details[open] { border-color: #ccc; padding-bottom: 4px; }
    .ep-list li summary { display: flex; align-items: center; gap: .4em; cursor: default; padding: .1em .2em; list-style: none; user-select: none; }
    .ep-list li summary::before { content: "▶"; font-size: .75em; transition: transform .15s; flex-shrink: 0; cursor: pointer; }
    .ep-list li details[open] > summary::before { transform: rotate(90deg); }
    .ep-attendee { display: flex; flex-wrap: wrap; gap: .4em; padding: .3em .4em .1em 1.4em; }
    .ep-attendee input { flex: 1; min-width: 110px; }
    .ep-hint { font-size: .8em; color: #888; margin: .1em 0 0; }
    /* Hotkey hints — SmarkForm sets data-hotkey on buttons when Ctrl is held */
    [data-hotkey] { position: relative; }
    [data-hotkey]::after {
      content: "Ctrl+" attr(data-hotkey);
      position: absolute; top: 0.75em; left: 0;
      font-size: .7em; background: #333; color: #fff;
      padding: 1px 4px; border-radius: 3px;
      white-space: nowrap; pointer-events: none;
    }
  </style>
</body>
</html>
{%- endcapture %}

{% include components/doctabs_tpl.md tabId="sf-event-planner" docSource=sf_doc height=65 %}


---

### React


The same form using [React](https://react.dev/) (v18 from CDN) and
[Babel Standalone](https://babeljs.io/docs/babel-standalone) for in-browser JSX compilation.
All form state and behaviour is wired up explicitly in JavaScript.

{% comment %} ── React example document ── {% endcomment %}

{% capture react_doc -%}
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Planner – React</title>
  <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;

    // Returns only inputs not inside a closed <details> element.
    // Enter/Shift+Enter navigation skips inputs hidden in collapsed rows.
    function getVisibleInputs() {
      return Array.from(document.querySelectorAll('input')).filter(inp => {
        let n = inp.parentElement;
        while (n) {
          if (n.tagName === 'SUMMARY') return true; // inside <summary>: always visible
          if (n.tagName === 'DETAILS' && !n.open) return false;
          n = n.parentElement;
        }
        return true;
      });
    }

    function EventPlanner() {
      const [title, setTitle] = useState('');
      const [date,  setDate]  = useState('');
      const [time,  setTime]  = useState('');
      const [organizer, setOrganizer] = useState({ name: '', email: '' });
      const [attendees, setAttendees] = useState([
        { id: 1, name: '', email: '', phone: '' }
      ]);

      // Queue a focus-by-index to be processed after the next render.
      const pendingFocusIdx = useRef(null);

      // Stable id counter — prevents fold/unfold state from shifting on add/remove.
      const nextId = useRef(2);
      const mkItem = () => ({ id: nextId.current++, name: '', email: '', phone: '' });

      const setOrg = (field) => (e) =>
        setOrganizer(o => ({ ...o, [field]: e.target.value }));

      const setAtt = (i, field) => (e) =>
        setAttendees(a =>
          a.map((item, j) => j === i ? { ...item, [field]: e.target.value } : item)
        );

      const addAfter = (i) => {
        pendingFocusIdx.current = i + 1;
        setAttendees(a => [
          ...a.slice(0, i + 1),
          mkItem(),
          ...a.slice(i + 1)
        ]);
      };

      const removeAt = (i) =>
        setAttendees(a => {
          const next = a.filter((_, j) => j !== i);
          pendingFocusIdx.current = Math.min(i, next.length - 1);
          return next;
        });

      const pruneEmpty = () =>
        setAttendees(a => {
          const filled = a.filter(x => x.name || x.email || x.phone);
          return filled.length ? filled : [mkItem()];
        });

      // After each render, focus the name input of any queued attendee row.
      useEffect(() => {
        if (pendingFocusIdx.current === null) return;
        const idx = pendingFocusIdx.current;
        pendingFocusIdx.current = null;
        const li = document.querySelector(`[data-ai="${idx}"]`);
        if (li) (li.querySelector('summary input') || li.querySelector('input'))?.focus();
      });

      // Mutable ref so the stable useEffect closure always reads the latest
      // state and functions without re-mounting the listeners on every render.
      const $ = useRef({});
      $.current = { attendees, addAfter, removeAt };

      // Enter/Shift+Enter: navigate between VISIBLE inputs only.
      // Space: type normally (fold/unfold blocked via onSummaryClick).
      // Shift+Space: toggle fold/unfold of the closest <details> row.
      function onInputKeyDown(e) {
        if (e.key === ' ') {
          if (e.shiftKey) {
            const details = e.target.closest('details');
            if (details) { e.preventDefault(); details.open = !details.open; }
          } else { e.stopPropagation(); }
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          const inputs = getVisibleInputs();
          const idx = inputs.indexOf(e.target);
          if (idx < 0) return;
          const next = e.shiftKey ? inputs[idx - 1] : inputs[idx + 1];
          if (next) next.focus();
        }
      }

      // Global keyboard: Ctrl-hold reveals hotkey badges;
      // Ctrl+= adds after focused row (or at end); Ctrl+- removes focused row.
      useEffect(() => {
        function onKeyDown(e) {
          if (e.key === 'Control') document.body.classList.add('show-hotkeys');
          if (!e.ctrlKey) return;
          const { attendees: atts, addAfter: add, removeAt: rem } = $.current;
          const li = document.activeElement && document.activeElement.closest('[data-ai]');
          const idx = li ? +li.dataset.ai : -1;
          if (e.key === '+' || e.key === '=') {
            e.preventDefault();
            add(idx >= 0 ? idx : atts.length - 1);
          } else if (e.key === '-' && idx >= 0) {
            e.preventDefault();
            rem(idx);
          }
        }
        function onKeyUp(e) {
          if (e.key === 'Control') document.body.classList.remove('show-hotkeys');
        }
        // Block keyboard-synthesised click (e.detail===0) on <summary> when an
        // input inside it has focus, so Space types in the input without toggling.
        function onSummaryClick(e) {
          if (e.detail) return;
          const s = e.target.closest && e.target.closest('summary');
          if (s && s.contains(document.activeElement) && document.activeElement.tagName === 'INPUT')
            { e.preventDefault(); e.stopImmediatePropagation(); }
        }
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('click', onSummaryClick, { capture: true });
        return () => {
          document.removeEventListener('keydown', onKeyDown);
          document.removeEventListener('keyup', onKeyUp);
          document.removeEventListener('click', onSummaryClick, { capture: true });
        };
      }, []);

      return (
        <div className="ep">
          <p>
            <label htmlFor="ep-title">📋 Event:</label>
            <input id="ep-title" type="text" value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="e.g. Sprint Review" />
          </p>
          <p>
            <label htmlFor="ep-date">📅 Date:</label>
            <input id="ep-date" type="date" value={date}
              onChange={e => setDate(e.target.value)}
              onKeyDown={onInputKeyDown} />
          </p>
          <p>
            <label htmlFor="ep-time">⏰ Time:</label>
            <input id="ep-time" type="time" value={time}
              onChange={e => setTime(e.target.value)}
              onKeyDown={onInputKeyDown} />
          </p>
          <fieldset>
            <legend>👤 Organizer</legend>
            <p>
              <label htmlFor="ep-org-name">Name:</label>
              <input id="ep-org-name" type="text" value={organizer.name}
                onChange={setOrg('name')}
                onKeyDown={onInputKeyDown} />
            </p>
            <p>
              <label htmlFor="ep-org-email">Email:</label>
              <input id="ep-org-email" type="email" value={organizer.email}
                onChange={setOrg('email')}
                onKeyDown={onInputKeyDown} />
            </p>
          </fieldset>
          <div className="ep-list">
            <div>
              <button onClick={pruneEmpty} title="Remove empty rows">🧹</button>
              <button onClick={() => addAfter(attendees.length - 1)}
                data-hotkey="+" title="Add attendee">➕</button>
              <strong>👥 Attendees:</strong>
            </div>
            <ul>
              {attendees.map((att, i) => (
                <li key={att.id} data-ai={i}>
                  <details>
                    <summary>
                      <span>{i + 1}.</span>
                      <input type="text" value={att.name}
                        onChange={setAtt(i, 'name')}
                        onKeyDown={onInputKeyDown}
                        placeholder="Name" />
                      <button onClick={() => removeAt(i)}
                        data-hotkey="-" title="Remove">➖</button>
                      <button onClick={() => addAfter(i)}
                        data-hotkey="+" title="Insert here">➕</button>
                    </summary>
                    <div className="ep-attendee">
                      <input type="email" value={att.email}
                        onChange={setAtt(i, 'email')}
                        onKeyDown={onInputKeyDown}
                        placeholder="Email" />
                      <input type="tel" value={att.phone}
                        onChange={setAtt(i, 'phone')}
                        onKeyDown={onInputKeyDown}
                        placeholder="Phone" />
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </div>
          <p className="ep-hint">💡 Hold <kbd>Ctrl</kbd> to reveal shortcuts</p>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<EventPlanner />);
  </script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 1em; margin: 0; }
    button { padding: .3em .6em; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: #f8f9fa; }
    button:hover { background: #e9ecef; }
    .ep { display: flex; flex-direction: column; gap: .4em; max-width: 460px; font-size: .95em; }
    .ep p { display: flex; align-items: center; gap: .5em; margin: 0; }
    .ep label { min-width: 5em; font-weight: 500; white-space: nowrap; }
    .ep input { padding: .3em .5em; border: 1px solid #ccc; border-radius: 4px; flex: 1; }
    .ep fieldset { border: 1px solid #ddd; border-radius: 6px; padding: .4em .8em .6em; margin: 0; display: flex; flex-direction: column; gap: .3em; }
    .ep fieldset legend { font-weight: bold; padding: 0 .3em; }
    .ep-list > div { display: flex; align-items: center; gap: .4em; margin-bottom: .2em; }
    .ep-list ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .25em; }
    .ep-list li details { border: 1px solid transparent; border-radius: 4px; }
    .ep-list li details[open] { border-color: #ccc; padding-bottom: 4px; }
    .ep-list li summary { display: flex; align-items: center; gap: .4em; cursor: pointer; padding: .1em .2em; list-style: none; user-select: none; }
    .ep-list li summary::before { content: "▶"; font-size: .75em; transition: transform .15s; flex-shrink: 0; }
    .ep-list li details[open] > summary::before { transform: rotate(90deg); }
    .ep-attendee { display: flex; flex-wrap: wrap; gap: .4em; padding: .3em .4em .1em 1.4em; }
    .ep-attendee input { flex: 1; min-width: 110px; }
    .ep-hint { font-size: .8em; color: #888; margin: .1em 0 0; }
    /* Hotkey hints — revealed when body has class show-hotkeys */
    [data-hotkey] { position: relative; }
    body.show-hotkeys [data-hotkey]::after {
      content: "Ctrl+" attr(data-hotkey);
      position: absolute; top: 0.75em; left: 0;
      font-size: .7em; background: #333; color: #fff;
      padding: 1px 4px; border-radius: 3px;
      white-space: nowrap; pointer-events: none;
    }
  </style>
</body>
</html>
{%- endcapture %}

{% include components/doctabs_tpl.md tabId="react-event-planner" docSource=react_doc height=65 %}

---

### Vue


The same form using [Vue 3](https://vuejs.org/) (from CDN).
`v-model` reduces binding boilerplate compared to React, but state and methods
still need to be declared explicitly in JavaScript.

{% comment %} ── Vue example document ── {% endcomment %}

{% capture vue_doc -%}
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Planner – Vue</title>
  <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
</head>
<body>
  <div id="app"></div>
  <script>
    const { createApp, ref, reactive, onMounted, onBeforeUnmount, nextTick } = Vue;

    // Returns only inputs not inside a closed <details> element.
    // Inputs inside <summary> are always treated as visible even when the row is collapsed.
    function getVisibleInputs() {
      return Array.from(document.querySelectorAll('input')).filter(inp => {
        let n = inp.parentElement;
        while (n) {
          if (n.tagName === 'SUMMARY') return true; // inside <summary>: always visible
          if (n.tagName === 'DETAILS' && !n.open) return false;
          n = n.parentElement;
        }
        return true;
      });
    }

    createApp({
      setup() {
        const title     = ref('');
        const date      = ref('');
        const time      = ref('');
        const organizer = reactive({ name: '', email: '' });
        const attendees = ref([{ id: 1, name: '', email: '', phone: '' }]);

        // Stable id counter — prevents fold/unfold state from shifting on add/remove.
        let nextId = 2;
        const mkItem = () => ({ id: nextId++, name: '', email: '', phone: '' });

        // Focus the name input of attendee row idx after the next DOM update.
        function focusAt(idx) {
          nextTick(() => {
            const li = document.querySelector(`[data-ai="${idx}"]`);
            if (li) (li.querySelector('summary input') || li.querySelector('input'))?.focus();
          });
        }

        function addAfter(i) {
          attendees.value.splice(i + 1, 0, mkItem());
          focusAt(i + 1);
        }
        function removeAt(i) {
          const newLen = attendees.value.length - 1;
          attendees.value.splice(i, 1);
          if (newLen > 0) focusAt(Math.min(i, newLen - 1));
        }
        function pruneEmpty() {
          const filled = attendees.value.filter(a => a.name || a.email || a.phone);
          attendees.value = filled.length
            ? filled
            : [mkItem()];
        }

        // Enter/Shift+Enter: navigate between VISIBLE inputs only.
        // Space: type normally (fold/unfold blocked via onSummaryClick).
        // Shift+Space: toggle fold/unfold of the closest <details> row.
        function onInputKeyDown(e) {
          if (e.key === ' ') {
            if (e.shiftKey) {
              const details = e.target.closest('details');
              if (details) { e.preventDefault(); details.open = !details.open; }
            } else { e.stopPropagation(); }
            return;
          }
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            const inputs = getVisibleInputs();
            const idx = inputs.indexOf(e.target);
            if (idx < 0) return;
            const next = e.shiftKey ? inputs[idx - 1] : inputs[idx + 1];
            if (next) next.focus();
          }
        }

        // Global Ctrl key: reveal hotkeys + Ctrl+= / Ctrl+- shortcuts.
        function onKeyDown(e) {
          if (e.key === 'Control') document.body.classList.add('show-hotkeys');
          if (!e.ctrlKey) return;
          const li = document.activeElement && document.activeElement.closest('[data-ai]');
          const idx = li ? +li.dataset.ai : -1;
          if (e.key === '+' || e.key === '=') {
            e.preventDefault();
            addAfter(idx >= 0 ? idx : attendees.value.length - 1);
          } else if (e.key === '-' && idx >= 0) {
            e.preventDefault();
            removeAt(idx);
          }
        }
        function onKeyUp(e) {
          if (e.key === 'Control') document.body.classList.remove('show-hotkeys');
        }
        // Block keyboard-synthesised click (e.detail===0) on <summary> when an
        // input inside it has focus, so Space types in the input without toggling.
        function onSummaryClick(e) {
          if (e.detail) return;
          const s = e.target.closest && e.target.closest('summary');
          if (s && s.contains(document.activeElement) && document.activeElement.tagName === 'INPUT')
            { e.preventDefault(); e.stopImmediatePropagation(); }
        }

        onMounted(() => {
          document.addEventListener('keydown', onKeyDown);
          document.addEventListener('keyup', onKeyUp);
          document.addEventListener('click', onSummaryClick, { capture: true });
        });
        onBeforeUnmount(() => {
          document.removeEventListener('keydown', onKeyDown);
          document.removeEventListener('keyup', onKeyUp);
          document.removeEventListener('click', onSummaryClick, { capture: true });
        });

        return { title, date, time, organizer, attendees, addAfter, removeAt, pruneEmpty, onInputKeyDown };
      },
      template: `
        <div class="ep">
          <p>
            <label for="ep-title">📋 Event:</label>
            <input id="ep-title" v-model="title" type="text" placeholder="e.g. Sprint Review"
              @keydown="onInputKeyDown">
          </p>
          <p>
            <label for="ep-date">📅 Date:</label>
            <input id="ep-date" v-model="date" type="date" @keydown="onInputKeyDown">
          </p>
          <p>
            <label for="ep-time">⏰ Time:</label>
            <input id="ep-time" v-model="time" type="time" @keydown="onInputKeyDown">
          </p>
          <fieldset>
            <legend>👤 Organizer</legend>
            <p>
              <label for="ep-org-name">Name:</label>
              <input id="ep-org-name" v-model="organizer.name" type="text" @keydown="onInputKeyDown">
            </p>
            <p>
              <label for="ep-org-email">Email:</label>
              <input id="ep-org-email" v-model="organizer.email" type="email" @keydown="onInputKeyDown">
            </p>
          </fieldset>
          <div class="ep-list">
            <div>
              <button @click="pruneEmpty" title="Remove empty rows">🧹</button>
              <button @click="addAfter(attendees.length - 1)"
                data-hotkey="+" title="Add attendee">➕</button>
              <strong>👥 Attendees:</strong>
            </div>
            <ul>
              <li v-for="(att, i) in attendees" :key="att.id" :data-ai="i">
                <details>
                  <summary>
                    <span v-text="(i + 1) + '.'"></span>
                    <input v-model="att.name" type="text" placeholder="Name"
                      @keydown="onInputKeyDown">
                    <button @click="removeAt(i)"
                      data-hotkey="-" title="Remove">➖</button>
                    <button @click="addAfter(i)"
                      data-hotkey="+" title="Insert here">➕</button>
                  </summary>
                  <div class="ep-attendee">
                    <input v-model="att.email" type="email" placeholder="Email"
                      @keydown="onInputKeyDown">
                    <input v-model="att.phone" type="tel" placeholder="Phone"
                      @keydown="onInputKeyDown">
                  </div>
                </details>
              </li>
            </ul>
          </div>
          <p class="ep-hint">💡 Hold <kbd>Ctrl</kbd> to reveal shortcuts</p>
        </div>
      `
    }).mount('#app');
  </script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 1em; margin: 0; }
    button { padding: .3em .6em; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: #f8f9fa; }
    button:hover { background: #e9ecef; }
    .ep { display: flex; flex-direction: column; gap: .4em; max-width: 460px; font-size: .95em; }
    .ep p { display: flex; align-items: center; gap: .5em; margin: 0; }
    .ep label { min-width: 5em; font-weight: 500; white-space: nowrap; }
    .ep input { padding: .3em .5em; border: 1px solid #ccc; border-radius: 4px; flex: 1; }
    .ep fieldset { border: 1px solid #ddd; border-radius: 6px; padding: .4em .8em .6em; margin: 0; display: flex; flex-direction: column; gap: .3em; }
    .ep fieldset legend { font-weight: bold; padding: 0 .3em; }
    .ep-list > div { display: flex; align-items: center; gap: .4em; margin-bottom: .2em; }
    .ep-list ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .25em; }
    .ep-list li details { border: 1px solid transparent; border-radius: 4px; }
    .ep-list li details[open] { border-color: #ccc; padding-bottom: 4px; }
    .ep-list li summary { display: flex; align-items: center; gap: .4em; cursor: pointer; padding: .1em .2em; list-style: none; user-select: none; }
    .ep-list li summary::before { content: "▶"; font-size: .75em; transition: transform .15s; flex-shrink: 0; }
    .ep-list li details[open] > summary::before { transform: rotate(90deg); }
    .ep-attendee { display: flex; flex-wrap: wrap; gap: .4em; padding: .3em .4em .1em 1.4em; }
    .ep-attendee input { flex: 1; min-width: 110px; }
    .ep-hint { font-size: .8em; color: #888; margin: .1em 0 0; }
    /* Hotkey hints — revealed when body has class show-hotkeys */
    [data-hotkey] { position: relative; }
    body.show-hotkeys [data-hotkey]::after {
      content: "Ctrl+" attr(data-hotkey);
      position: absolute; top: 0.75em; left: 0;
      font-size: .7em; background: #333; color: #fff;
      padding: 1px 4px; border-radius: 3px;
      white-space: nowrap; pointer-events: none;
    }
  </style>
</body>
</html>
{%- endcapture %}

{% include components/doctabs_tpl.md tabId="vue-event-planner" docSource=vue_doc height=65 %}

---

### Gotchas

- Both [React](#react) and [Vue](#vue) implementations:
  - **Hotkeys** implementation is limited: hints are shown for all visible
    hotkey buttons simultaneously (not context-aware), and multiple `➕` / `➖`
    hints may appear at once even though only one applies. Fixing this properly
    would require SmarkForm-level integration.
  - **Drag to reorder** is not implemented. Adding it properly — including a
    dedicated drag handle so that mouse gestures inside inputs still select text
    rather than starting a drag — would require custom drag-event handlers and
    state-reorder logic (~30–40 additional lines of JavaScript per
    implementation). SmarkForm handles this automatically when `sortable: true`
    is set and SmarkForm label components are present in the list item template.

---

### What the numbers say

#### Metrics

<div class="doctabs-metrics" style="overflow-x: auto;">
<table>
<thead>
<tr><th>Metric</th><th>SmarkForm</th><th>React</th><th>Vue</th></tr>
</thead>
<tbody>
<tr><td>Dependencies loaded</td><td>1 (SmarkForm UMD)</td><td>2 (React + ReactDOM)<a id="foothook_1" style="vertical-align: super" href="#footnote_1">(1)</a></td><td>1 (Vue global build)</td></tr>
<tr><td>JavaScript written</td><td><strong>1 line</strong></td><td>~100 lines</td><td>~70 lines</td></tr>
<tr><td>HTML / template markup lines</td><td>~50 lines</td><td>~44 lines (JSX)</td><td>~44 lines (template)</td></tr>
<tr><td>State management</td><td>Internal</td><td>Manually handled</td><td>Manually handled</td></tr>
<tr><td>Two-way binding</td><td>built-in</td><td>manual (value + onChange)</td><td>v-model</td></tr>
<tr><td>Add / remove items</td><td>declarative attribute</td><td>splice helpers</td><td>splice helpers</td></tr>
<tr><td>Fold / Unfold items</td><td>built-in</td><td>native <code>&lt;details&gt;</code></td><td>native <code>&lt;details&gt;</code></td></tr>
<tr><td>Position counter</td><td>declarative attribute</td><td>array index</td><td>array index</td></tr>
<tr><td>JSON import / export</td><td>built-in</td><td>manual serialisation</td><td>manual serialisation</td></tr>
<tr><td>Label ↔ field wiring</td><td>automatic</td><td>htmlFor + id</td><td>for + id (or wrapping)</td></tr>
<tr><td>Smooth field navigation (Enter / Shift+Enter)</td><td>built-in (zero JS)</td><td>manual (~15 lines)</td><td>manual (~12 lines)</td></tr>
<tr><td>Keyboard shortcuts (Ctrl+= / Ctrl+-)</td><td>built-in, context-aware<a id="foothook_2" style="vertical-align: super" href="#footnote_2">(2)</a></td><td>manual (~20 lines) <a href="#gotchas" title="With gotchas">‼️</a></td><td>manual (~18 lines) <a href="#gotchas" title="With gotchas">‼️</a></td></tr>
<tr><td>Drag to reorder</td><td>built-in (label drag handle, zero JS)</td><td>not implemented <a href="#gotchas" title="With gotchas">‼️</a></td><td>not implemented <a href="#gotchas" title="With gotchas">‼️</a></td></tr>
</tbody>
</table>
</div>

**Artifact note:** the SmarkForm artifact used for this comparison is version
0.25.0's `dist/SmarkForm.umd.js`: about 109 KB minified and roughly 30 KB gzip
with the build used for this page. React and Vue bundle sizes depend on version,
build, and what is included, so they are not compared numerically here. See
[Lightweight and dependency-free]({{ "/about/features" | relative_url }}#lightweight-yet-highly-compatible)
for the measurement method and caveats.

{: .hint }
> **The comparison is intentionally narrow.** React and Vue are general-purpose
> UI frameworks — they excel at component composition, routing, complex
> rendering, and vast ecosystems. SmarkForm is purpose-built for HTML forms.
> The take-away is not *"SmarkForm replaces React"*, but *"for forms,
> SmarkForm lets you stay in HTML"*.
>
> **On "State management":** in Virtual DOM frameworks, explicitly declaring
> and syncing every piece of form state is an *obligation imposed by the
> architecture*, not a feature. SmarkForm manages state internally and exposes
> it through `export()` / `import()` — so it is always inspectable, but never
> a burden to maintain.


#### Implementation time

The following figures are rough retrospective estimates made by Copilot after
the demo, with no recorded timing method and no human adjustment. They describe
this demo only and should not be extrapolated to other teams, forms, or
codebases.

<div class="doctabs-metrics" style="overflow-x: auto;">
<table>
<thead>
<tr><th>Metric</th><th>SmarkForm</th><th>React</th><th>Vue</th></tr>
</thead>
<tbody>
<tr><td>Copilot time (this demo)</td><td>~5 min</td><td>~2.5 h</td><td>~2 h</td></tr>
<tr><td>Reviewer time (this demo)</td><td>~20 min</td><td>~1.25 h</td><td>~1.25 h</td></tr>
<tr><td>Total dev effort (this demo)</td><td>~25 min ⚡</td><td>~3.75 h 🕒</td><td>~3.25 h 🕒</td></tr>
</tbody>
</table>
</div>



------------

<strong><a id="footnote_1" href="#foothook_1">(1)</a>:</strong> The React demo
also loads Babel Standalone for in-browser JSX compilation (no build step
needed). It is excluded from the CDN dependency count because a real-world
React project would use a bundler (Webpack, Vite, …) and Babel Standalone
would not be part of the runtime bundle.

<strong><a id="footnote_2" href="#foothook_2">(2)</a>:</strong> SmarkForm's
hotkey reveal is context-aware: it computes which buttons are reachable from
the currently focused field and displays only their shortcuts. The React and
Vue implementations show all `data-hotkey` badges simultaneously whenever Ctrl
is held — a simpler but visually broader reveal.

## What this comparison does not measure

The comparison is deliberately narrow. It does **not** measure:

* runtime performance, rendering cost, or memory use;
* transferred bundle size after tree-shaking, code splitting, or server
  compression for each approach;
* accessibility conformance or the quality of the authored labels and
  semantics;
* application complexity outside the demo form, such as routing, data fetching,
  authentication, or state shared with other views;
* team familiarity, hiring, maintenance cost, ecosystem maturity, or long-term
  support;
* security of the submission path, including server-side validation and trust
  boundaries.

Those factors often matter more than the lines of code in a single demo. Use the
comparison to understand the shape of each approach, then evaluate your own
constraints.

## What you still own

Whichever approach you choose, SmarkForm leaves these responsibilities with the
application:

* **Markup, styles, and visual design** — SmarkForm does not impose a layout or
  CSS reset.
* **Labels, grouping, and semantic structure** — use real `<label>` elements,
  fieldsets, legends, and headings. See [Accessible Labels and
  Names]({{ "/accessibility/accessible_labels_and_names" | relative_url }}).
* **Keyboard and focus behavior** — SmarkForm provides navigation and hotkey
  conveniences, but you still design focus order, focus visibility, and
  keyboard-only flows.
* **Validation and error messages** — use native HTML constraint validation,
  event hooks, or an application-level validation layer.
* **Submission and server-side trust** — validate and authorize every
  submission on the server. Client-side state is not a security boundary.
* **Media alternatives and contrast** — provide meaningful `alt` text, captions,
  transcripts, and sufficient contrast for your content.

If those responsibilities are acceptable, SmarkForm's model can remove a large
amount of structural JavaScript while leaving the form readable as HTML.

## Learn more

* [Introduction]({{ "/about/introduction" | relative_url }}) — the short version
  of what SmarkForm is and is not.
* [Features]({{ "/about/features" | relative_url }}) — what is implemented, with
  honest limits.
* [Quick Start]({{ "/start_here/quick_start" | relative_url }}) — try the model
  on a small form.
* [Showcase]({{ "/showcase_examples/showcase" | relative_url }}) — see the
  approach applied to larger examples.
* [FAQ]({{ "/about/faq" | relative_url }}) — common questions, including
  framework integration.
