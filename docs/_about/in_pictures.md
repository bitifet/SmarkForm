---
title: "A Picture is Worth a Thousand Words"
layout: chapter
permalink: /about/in_pictures
nav_order: 7

---

{% include links.md %}

{% include components/doctabs_ctrl.md %}


# {{ page.title }}


Modern web development offers many solutions for building dynamic forms — from
dedicated libraries to general-purpose UI frameworks. But which approach gives
you the most power for the least code?

The answer is often context-dependent, but for forms specifically, the contrast
can be striking. Below is the **exact same form** — a real-world *Event
Planner* with nested subforms and a dynamic attendees list — implemented three
ways.

Judge for yourself.

---

## The Example: Event Planner

A moderately complex, real-world form:

- Basic fields: **title**, **date**, **time**
- A nested ***Organizer*** subform (name + email)
- A dynamic ***Attendees*** list where each row expands to reveal extra details
- Buttons to **add**, **insert**, **remove**, and **prune** (clean up empty
  rows) attendees
- A **position indicator** that reflects each item's current position in the
  list


---

## SmarkForm


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
</body>
</html>
{%- endcapture %}

{% include components/doctabs_tpl.md tabId="sf-event-planner" docSource=sf_doc height=65 %}


---

## React


The same form using [React](https://react.dev/) (v18 from CDN) and
[Babel Standalone](https://babeljs.io/docs/babel-standalone) for JSX support.
All form state and behaviour must be wired up explicitly.

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
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;

    function EventPlanner() {
      const [title, setTitle] = useState('');
      const [date,  setDate]  = useState('');
      const [time,  setTime]  = useState('');
      const [organizer, setOrganizer] = useState({ name: '', email: '' });
      const [attendees, setAttendees] = useState([
        { name: '', email: '', phone: '' }
      ]);

      const setOrg = (field) => (e) =>
        setOrganizer(o => ({ ...o, [field]: e.target.value }));

      const setAtt = (i, field) => (e) =>
        setAttendees(a =>
          a.map((item, j) => j === i ? { ...item, [field]: e.target.value } : item)
        );

      const addAfter = (i) =>
        setAttendees(a => [
          ...a.slice(0, i + 1),
          { name: '', email: '', phone: '' },
          ...a.slice(i + 1)
        ]);

      const removeAt = (i) =>
        setAttendees(a => a.filter((_, j) => j !== i));

      const pruneEmpty = () =>
        setAttendees(a => {
          const filled = a.filter(x => x.name || x.email || x.phone);
          return filled.length ? filled : [{ name: '', email: '', phone: '' }];
        });

      // Mutable ref so the stable useEffect closure always reads the latest
      // state and functions without re-mounting the listeners on every render.
      const $ = useRef({});
      $.current = { attendees, addAfter, removeAt };

      // Enter-key navigation (Enter = next field, Shift+Enter = previous).
      // Also stops Space from toggling <details> when typed in a summary input.
      function onInputKeyDown(e) {
        if (e.key === ' ') { e.stopPropagation(); return; }
        if (e.key === 'Enter') {
          e.preventDefault();
          const inputs = Array.from(document.querySelectorAll('input'));
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
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        return () => {
          document.removeEventListener('keydown', onKeyDown);
          document.removeEventListener('keyup', onKeyUp);
        };
      }, []);

      return (
        <div className="ep">
          <p>
            <label>📋 Event:</label>
            <input type="text" value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="e.g. Sprint Review" />
          </p>
          <p>
            <label>📅 Date:</label>
            <input type="date" value={date}
              onChange={e => setDate(e.target.value)}
              onKeyDown={onInputKeyDown} />
          </p>
          <p>
            <label>⏰ Time:</label>
            <input type="time" value={time}
              onChange={e => setTime(e.target.value)}
              onKeyDown={onInputKeyDown} />
          </p>
          <fieldset>
            <legend>👤 Organizer</legend>
            <p>
              <label>Name:</label>
              <input type="text" value={organizer.name}
                onChange={setOrg('name')}
                onKeyDown={onInputKeyDown} />
            </p>
            <p>
              <label>Email:</label>
              <input type="email" value={organizer.email}
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
                <li key={i} data-ai={i}>
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
</body>
</html>
{%- endcapture %}

{% include components/doctabs_tpl.md tabId="react-event-planner" docSource=react_doc height=65 %}


---

## Vue


The same form using [Vue 3](https://vuejs.org/) (from CDN).
Vue's `v-model` reduces boilerplate compared to React, but the component state
and methods still need to be declared explicitly.

{% comment %} ── Vue example document ── {% endcomment %}

{% capture vue_doc -%}
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Planner – Vue</title>
  <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
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
</head>
<body>
  <div id="app"></div>
  <script>
    const { createApp, ref, reactive, onMounted, onBeforeUnmount } = Vue;

    createApp({
      setup() {
        const title     = ref('');
        const date      = ref('');
        const time      = ref('');
        const organizer = reactive({ name: '', email: '' });
        const attendees = ref([{ name: '', email: '', phone: '' }]);

        function addAfter(i) {
          attendees.value.splice(i + 1, 0, { name: '', email: '', phone: '' });
        }
        function removeAt(i) {
          attendees.value.splice(i, 1);
        }
        function pruneEmpty() {
          const filled = attendees.value.filter(a => a.name || a.email || a.phone);
          attendees.value = filled.length
            ? filled
            : [{ name: '', email: '', phone: '' }];
        }

        // Enter-key navigation (Enter = next field, Shift+Enter = previous).
        // Also stops Space from toggling <details> when typed in a summary input.
        function onInputKeyDown(e) {
          if (e.key === ' ') { e.stopPropagation(); return; }
          if (e.key === 'Enter') {
            e.preventDefault();
            const inputs = Array.from(document.querySelectorAll('input'));
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

        onMounted(() => {
          document.addEventListener('keydown', onKeyDown);
          document.addEventListener('keyup', onKeyUp);
        });
        onBeforeUnmount(() => {
          document.removeEventListener('keydown', onKeyDown);
          document.removeEventListener('keyup', onKeyUp);
        });

        return { title, date, time, organizer, attendees, addAfter, removeAt, pruneEmpty, onInputKeyDown };
      },
      template: `
        <div class="ep">
          <p>
            <label>📋 Event:</label>
            <input v-model="title" type="text" placeholder="e.g. Sprint Review"
              @keydown="onInputKeyDown">
          </p>
          <p>
            <label>📅 Date:</label>
            <input v-model="date" type="date" @keydown="onInputKeyDown">
          </p>
          <p>
            <label>⏰ Time:</label>
            <input v-model="time" type="time" @keydown="onInputKeyDown">
          </p>
          <fieldset>
            <legend>👤 Organizer</legend>
            <p>
              <label>Name:</label>
              <input v-model="organizer.name" type="text" @keydown="onInputKeyDown">
            </p>
            <p>
              <label>Email:</label>
              <input v-model="organizer.email" type="email" @keydown="onInputKeyDown">
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
              <li v-for="(att, i) in attendees" :key="i" :data-ai="i">
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
</body>
</html>
{%- endcapture %}

{% include components/doctabs_tpl.md tabId="vue-event-planner" docSource=vue_doc height=65 %}


---

## What the numbers say

<div class="doctabs-metrics" style="overflow-x: auto;">
<table>
<thead>
<tr><th>Metric</th><th>SmarkForm</th><th>React</th><th>Vue</th></tr>
</thead>
<tbody>
<tr><td>Dependencies loaded</td><td>1 (SmarkForm UMD, ~19 kB gz)</td><td>3 (React + ReactDOM ≈44 kB gz + Babel standalone ≈300 kB gz†)</td><td>1 (Vue global, ~33 kB gz)</td></tr>
<tr><td>JavaScript written</td><td><strong>1 line</strong></td><td>~100 lines</td><td>~65 lines</td></tr>
<tr><td>Explicit state management</td><td>❌ none</td><td>✅ full</td><td>✅ full</td></tr>
<tr><td>Two-way binding</td><td>built-in</td><td>manual (value + onChange)</td><td>v-model</td></tr>
<tr><td>Add / remove items</td><td>declarative attribute</td><td>splice helpers</td><td>splice helpers</td></tr>
<tr><td>Position counter</td><td>declarative attribute</td><td>array index</td><td>array index</td></tr>
<tr><td>JSON import / export</td><td>built-in</td><td>manual serialisation</td><td>manual serialisation</td></tr>
<tr><td>Label ↔ field wiring</td><td>automatic</td><td>htmlFor + id</td><td>for + id (or wrapping)</td></tr>
<tr><td>Smooth field navigation (Enter / Shift+Enter)</td><td>built-in (zero JS)</td><td>manual (~15 lines)</td><td>manual (~12 lines)</td></tr>
<tr><td>Keyboard shortcuts (Ctrl+= / Ctrl+-)</td><td>built-in, context-aware‡</td><td>manual (~20 lines)</td><td>manual (~18 lines)</td></tr>
</tbody>
</table>
</div>

{: .hint }
> **The comparison is intentionally narrow.** React and Vue are general-purpose
> UI frameworks — they excel at component composition, routing, complex
> rendering, and vast ecosystems. SmarkForm is purpose-built for HTML forms.
> The take-away is not *"SmarkForm replaces React"*, but *"for forms,
> SmarkForm lets you stay in HTML"*.

† The React demo uses Babel Standalone for in-browser JSX compilation
(no build step needed). In a real-world React project you would use a bundler
(Webpack, Vite, …), which eliminates Babel Standalone from the runtime bundle.
The demo weight is therefore not representative of production React — but the
*amount of code you must write* is.

‡ SmarkForm's hotkey reveal is context-aware: it computes which buttons are
reachable from the currently focused field and displays only their shortcuts.
The React and Vue implementations show all `data-hotkey` badges simultaneously
whenever Ctrl is held — a simpler but visually broader reveal.
