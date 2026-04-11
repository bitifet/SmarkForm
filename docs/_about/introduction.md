---
title: Introduction
layout: chapter
permalink: /about/introduction
nav_order: 1

---

{% include links.md %}

{% include components/doctabs_ctrl.md %}


# {{ page.title }}


## What SmarkForm Is (and Isn't Yet)

**SmarkForm is:**
- ✅ A **markup-driven** form controller: configuration lives in `data-smark`
  attributes, keeping HTML and JavaScript cleanly separated.
- ✅ **Markup-agnostic**: it imposes no HTML structure or CSS on your design —
  designers keep full freedom, developers don't worry about layout changes.
- ✅ A tool for **JSON-based import/export** of complex, nested form data
  including subforms and variable-length lists.
- ✅ Ready for **context-driven hotkeys** and smooth keyboard navigation.
- ✅ Stable and in active use, but still pre-1.0 (API may evolve).

**Not yet implemented (planned for a future release):**
- ❌ Built-in validation (field-level error messages).
- ❌ The "API interface" for dynamic dropdown/select options from a server.

{: .warning :}
> SmarkForm is currently at **version 0.x**. The implemented features are
> stable, but breaking changes may still occur before 1.0.
> See the [Roadmap]({{ "/about/roadmap" | relative_url }}) for what's coming next.


## About SmarkForm

*SmarkForm* is a lightweight and *extendable* form controller that enhances
HTML forms to support **subforms** and variable-length **lists** without tying
the layout to any specific structure. This enables it to **import and export
data in JSON** format, while providing a smooth navigation with configurable
hotkeys and a low-code experience among other features.

In *SmarkForm*, *(sub)forms* and *lists* are just form fields that
import/export their data as JSON, number fields return numbers, checkboxes
return booleans, radio buttons sharing the same name are threated as single
field, color pickers can return null to distinguish when the color is unknown,
and so on...

Special components called *triggers* can be placed along the form to call
specified *actions* like adding or removing items from lists, importing or
exporting data, etc... **They automatically connect to the proper fields** just
by their *context* (i.e., their position in the form) which can be altered
through specific properties..

Forms and lists can be nested to any depth, lists can dynamically grow or
shrink. This allow to generate any possible JSON structure, from simple
form.

SmarkForm provides a smooth and intuitive user experience while addressing some
native HTML limitations; such as forcing `type="color"` fields to always hold a
valid color value, which makes it impossible to tell whether the user selected the
black color on purpose or if he just meant that the actual color is unknown.

Other features include context-driven keyboard shortcuts, smart
auto-enablement/disablement of controls depending on whether they are applicable
or not, among others...

All that in a 100% declarative approach providing a consistent UX across very
different forms.


👉 See the [Showcase]({{ "/about/showcase" | relative_url }}) for a quick
overview of what SmarkForm can do.


## Motivation

Three decades after the advent of web forms, their limitations persist.
Traditional HTML forms are limited in structure and lack flexibility. They only
support a single level of discrete key-value pairs, limited to text-only values
while modern applications often require complex JSON structures with nested
objects and arrays, which cannot be directly accommodated by legacy HTML forms.

Web component libraries and frameworks, in turn, address this issue by shifting
templating and design logic from the view to the controller layer. However,
this approach forces developers to manually implement custom behaviors by
connecting multiple form components together. Additionally, it places the
burden of dealing with templating and styling details on developers, while
designers lose control over the appearance of inner components. As a result,
this approach leads to non-reusable and bespoke (unless you are Ok with
sticking to the same appearance) implementations for each form.

Repeatedly reinventing components or adapting complex frameworks with every
design change, along with struggles in importing/exporting JSON, managing
dynamic subforms and lists, or enabling seamless usability and accessibility,
are common challenges.

SmarkForm was created to address these challenges while preserving flexibility
for designers and reducing maintenance overhead for developers. It provides a
powerful and flexible solution for building forms directly in the markup (view
layer) that seamlessly handles deep JSON structures while providing advanced
features like subforms and variable-length lists. Designers can create custom
templates using their existing HTML and CSS knowledge, while developers can
import and manipulate complex data in JSON format.



---

## A Picture is Worth a Thousand Words

Modern web development offers many solutions for building dynamic forms — from
dedicated libraries to general-purpose UI frameworks. For forms specifically,
the contrast can be striking. Below is the **exact same form** — a real-world
*Event Planner* with nested subforms and a dynamic attendees list — implemented
three ways.

- The first one is implemented with SmarkForm.
- The others are implemented with modern web frameworks trying to mimic the same behaviour and user experience as closely as possible while keeping the code as simple as possible.

The [metrics](#what-the-numbers-say) speak for themselves.

Judge for yourself.

{: .info :}
> *The three implementations below were written by the same AI assistant
> (GitHub Copilot) with the explicit goal of making each as idiomatic and
> feature-equivalent as possible. The intent is a fair comparison — not
> advocacy for any particular tool.*

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
  <script src="{{ smarkform_umd_cdn_latest }}"></script>
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
        <ul data-smark='{"type":"list","name":"attendees","sortable":true,"exportEmpties":false}'>
          <li>
            <details>
              <summary>
                <span data-smark='{"action":"position"}'>N</span>.
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
  </script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 1em; margin: 0; }
    button[data-smark] { padding: .3em .6em; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: #f8f9fa; }
    button[data-smark]:hover { background: #e9ecef; }
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
    .ep-list li summary { display: flex; align-items: center; gap: .4em; cursor: pointer; padding: .1em .2em; list-style: none; }
    .ep-list li summary::-webkit-details-marker { display: none; }
    .ep-attendee { display: flex; flex-wrap: wrap; gap: .4em; padding: .3em .4em .1em 1.4em; }
    .ep-attendee input { flex: 1; min-width: 110px; }
    .ep-hint { font-size: .8em; color: #888; margin: .1em 0 0; }
    /* Hotkey hints — SmarkForm sets data-hotkey on buttons when Ctrl is held */
    [data-hotkey] { position: relative; }
    [data-hotkey]::after {
      content: "Ctrl+" attr(data-hotkey);
      position: absolute; top: -1.6em; left: 0;
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
      // Space: stop propagation so <details> does not toggle.
      function onInputKeyDown(e) {
        if (e.key === ' ') { e.stopPropagation(); return; }
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
          // Capture phase: stop Space before <summary> can process it as a toggle.
          if (e.key === ' ' && e.target.tagName === 'INPUT') { e.stopImmediatePropagation(); return; }
          if (e.key === 'Control') document.body.classList.remove('show-hotkeys');
        }
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp, { capture: true });
        return () => {
          document.removeEventListener('keydown', onKeyDown);
          document.removeEventListener('keyup', onKeyUp, { capture: true });
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
    .ep-list li summary { display: flex; align-items: center; gap: .4em; cursor: pointer; padding: .1em .2em; list-style: none; }
    .ep-list li summary::-webkit-details-marker { display: none; }
    .ep-attendee { display: flex; flex-wrap: wrap; gap: .4em; padding: .3em .4em .1em 1.4em; }
    .ep-attendee input { flex: 1; min-width: 110px; }
    .ep-hint { font-size: .8em; color: #888; margin: .1em 0 0; }
    /* Hotkey hints — revealed when body has class show-hotkeys */
    [data-hotkey] { position: relative; }
    body.show-hotkeys [data-hotkey]::after {
      content: "Ctrl+" attr(data-hotkey);
      position: absolute; top: -1.6em; left: 0;
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
        // Space: stop propagation so <details> does not toggle.
        function onInputKeyDown(e) {
          if (e.key === ' ') { e.stopPropagation(); return; }
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
          // Capture phase: stop Space before <summary> can process it as a toggle.
          if (e.key === ' ' && e.target.tagName === 'INPUT') { e.stopImmediatePropagation(); return; }
          if (e.key === 'Control') document.body.classList.remove('show-hotkeys');
        }

        onMounted(() => {
          document.addEventListener('keydown', onKeyDown);
          document.addEventListener('keyup', onKeyUp, { capture: true });
        });
        onBeforeUnmount(() => {
          document.removeEventListener('keydown', onKeyDown);
          document.removeEventListener('keyup', onKeyUp, { capture: true });
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
    .ep-list li summary { display: flex; align-items: center; gap: .4em; cursor: pointer; padding: .1em .2em; list-style: none; }
    .ep-list li summary::-webkit-details-marker { display: none; }
    .ep-attendee { display: flex; flex-wrap: wrap; gap: .4em; padding: .3em .4em .1em 1.4em; }
    .ep-attendee input { flex: 1; min-width: 110px; }
    .ep-hint { font-size: .8em; color: #888; margin: .1em 0 0; }
    /* Hotkey hints — revealed when body has class show-hotkeys */
    [data-hotkey] { position: relative; }
    body.show-hotkeys [data-hotkey]::after {
      content: "Ctrl+" attr(data-hotkey);
      position: absolute; top: -1.6em; left: 0;
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

---

### What the numbers say

<div class="doctabs-metrics" style="overflow-x: auto;">
<table>
<thead>
<tr><th>Metric</th><th>SmarkForm</th><th>React</th><th>Vue</th></tr>
</thead>
<tbody>
<tr><td>Dependencies loaded</td><td>1 (SmarkForm UMD, ~19 kB gz)</td><td>2 (React + ReactDOM ≈44 kB gz)<a id="foothook_1" style="vertical-align: super" href="#footnote_1">(1)</a></td><td>1 (Vue global, ~33 kB gz)</td></tr>
<tr><td>JavaScript written</td><td><strong>1 line</strong></td><td>~95 lines</td><td>~65 lines</td></tr>
<tr><td>HTML / template markup lines</td><td>~50 lines</td><td>~44 lines (JSX)</td><td>~44 lines (template)</td></tr>
<tr><td>Explicit state management</td><td>Internal</td><td>✅ full</td><td>✅ full</td></tr>
<tr><td>Two-way binding</td><td>built-in</td><td>manual (value + onChange)</td><td>v-model</td></tr>
<tr><td>Add / remove items</td><td>declarative attribute</td><td>splice helpers</td><td>splice helpers</td></tr>
<tr><td>Fold / Unfold items</td><td>built-in</td><td>native <code>&lt;details&gt;</code></td><td>native <code>&lt;details&gt;</code></td></tr>
<tr><td>Position counter</td><td>declarative attribute</td><td>array index</td><td>array index</td></tr>
<tr><td>JSON import / export</td><td>built-in</td><td>manual serialisation</td><td>manual serialisation</td></tr>
<tr><td>Label ↔ field wiring</td><td>automatic</td><td>htmlFor + id</td><td>for + id (or wrapping)</td></tr>
<tr><td>Smooth field navigation (Enter / Shift+Enter)</td><td>built-in (zero JS)</td><td>manual (~15 lines)</td><td>manual (~12 lines)</td></tr>
<tr><td>Keyboard shortcuts (Ctrl+= / Ctrl+-)</td><td>built-in, context-aware<a id="foothook_2" style="vertical-align: super" href="#footnote_2">(2)</a></td><td>manual (~20 lines) <a href="#gotchas" title="With gotchas">‼️</a></td><td>manual (~18 lines) <a href="#gotchas" title="With gotchas">‼️</a></td></tr>
<tr><td>Copilot time (this demo)</td><td>~5 min</td><td>~2 h</td><td>~1.5 h</td></tr>
<tr><td>Reviewer time (this demo)</td><td>~20 min</td><td>~1 h</td><td>~1 h</td></tr>
<tr><td>Total dev effort (this demo)</td><td>~25 min</td><td>~3 h</td><td>~2.5 h</td></tr>
</tbody>
</table>
</div>

{: .hint }
> **The comparison is intentionally narrow.** React and Vue are general-purpose
> UI frameworks — they excel at component composition, routing, complex
> rendering, and vast ecosystems. SmarkForm is purpose-built for HTML forms.
> The take-away is not *"SmarkForm replaces React"*, but *"for forms,
> SmarkForm lets you stay in HTML"*.

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
