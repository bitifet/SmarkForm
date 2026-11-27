---
title: "Examples"
layout: chapter
description: "Explore complete, realistic SmarkForm applications in editable, playable examples."
permalink: "/showcase_examples/examples"
nav_order: 3
redirect_from:
  - "/resources/examples"
---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

The [Showcase]({{ "/showcase_examples/showcase" | relative_url }}) gives a
curated tour of SmarkForm features. This page continues that tour with fuller,
more realistic applications: examples can be larger and more detailed than the
small snippets used to teach one concept. Each sampletab lets you run the form,
edit its source, and inspect or change its JSON data.

## Project Kanban

This sprint board treats tasks as complete work records rather than title-only
cards. Expand a task to edit its description, priority, assignee, due date,
tags, checklist, activity history, and file attachments. The columns use
different status colors, and task numbers update when you reorder or move a
card.

{% raw %}<!-- examples_kanban_html {{{ -->{% endraw %}
{% capture examples_kanban_html -%}
<div id="myForm$$">
  <div class="project-app" data-smark='{"type":"form","name":"project"}'>
    <header class="project-header">
      <div>
        <p class="project-eyebrow">NORTHSTAR · PLATFORM TEAM</p>
        <h2>Release 1.0.0</h2>
        <p>November 24 – December 11 · A focused push to ship the first stable release.</p>
      </div>
      <div class="sprint-status"><span class="status-dot"></span> Sprint 14 · 9 days left</div>
    </header>

    <div class="kanban-board" role="region" aria-label="Release 1.0.0 task board" tabindex="0">
      <section class="kanban-column column-todo" aria-label="To do">
        <header class="column-heading">
          <div><span class="column-indicator"></span><h3>To do</h3></div>
          <p>Queued for the sprint</p>
        </header>
        <div data-smark='{"type":"#projectTaskColumn","name":"todo"}'></div>
      </section>

      <section class="kanban-column column-progress" aria-label="In progress">
        <header class="column-heading">
          <div><span class="column-indicator"></span><h3>In progress</h3></div>
          <p>Actively being worked</p>
        </header>
        <div data-smark='{"type":"#projectTaskColumn","name":"progress"}'></div>
      </section>

      <section class="kanban-column column-done" aria-label="Done">
        <header class="column-heading">
          <div><span class="column-indicator"></span><h3>Done</h3></div>
          <p>Completed this sprint</p>
        </header>
        <div data-smark='{"type":"#projectTaskColumn","name":"done"}'></div>
      </section>
    </div>

    <p class="board-footnote">Drag ⠿ to reorder · use arrows to move between columns · expand a card for its full record.</p>
  </div>
</div>

<template id="projectTaskColumn">
  <div class="task-list" data-smark='{"type":"list","role":"jump-boundary","of":"form","sortable":true,"moving_depth":1,"min_items":0,"max_items":12}'>
    <div class="task-list-toolbar" data-smark='{"role":"header"}'>
      <span><strong data-smark-action="count"></strong> tasks</span>
      <button type="button" data-smark='{"action":"addItem","hotkey":"+"}'>＋ Add task</button>
    </div>
    <article class="task-card" data-smark='{"type":"form","role":"item"}'>
      <details class="task-fold">
        <summary class="task-summary">
          <span class="task-position" data-smark-action="position"></span>
          <input data-smark name="title" type="text" placeholder="Untitled task" aria-label="Task title">
          <div class="card-actions">
            <button type="button" class="card-menu-trigger" data-smark-role="drag-handle" aria-expanded="false" aria-label="Task actions" title="Task actions">☰</button>
            <div class="card-menu" data-card-menu role="group" aria-label="Task actions">
              <button type="button" data-smark='{"action":"previous","depth":0,"hotkey":","}' title="Move task up"><span aria-hidden="true">↑</span> Move Up</button>
              <button type="button" data-smark='{"action":"next","depth":0,"hotkey":"."}' title="Move task down"><span aria-hidden="true">↓</span> Move Down</button>
              <button type="button" data-smark='{"action":"previous","depth":1,"hotkey":"["}' title="Move to previous column"><span aria-hidden="true">←</span> Previous Column</button>
              <button type="button" data-smark='{"action":"next","depth":1,"hotkey":"]"}' title="Move to next column"><span aria-hidden="true">→</span> Next Column</button>
              <button type="button" data-smark-action="removeItem" title="Remove task"><span aria-hidden="true">×</span> Remove Task</button>
            </div>
          </div>
        </summary>
        <div class="task-details">
          <label class="task-description">Description
            <textarea data-smark name="description" rows="2" placeholder="What needs to happen, and why?"></textarea>
          </label>

          <div class="task-fields">
            <label>Priority
              <select data-smark name="priority">
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
            <label>Assignee
              <select data-smark name="assignee">
                <option value="Maya Chen">Maya Chen</option>
                <option value="Nico Alvarez">Nico Alvarez</option>
                <option value="Sam Okafor">Sam Okafor</option>
                <option value="Iris Patel">Iris Patel</option>
              </select>
            </label>
            <label>Due date<input data-smark name="due_date" type="date"></label>
          </div>

          <section class="task-section">
            <div class="section-heading"><h4>Tags</h4><span class="section-hint">Keep related work discoverable</span></div>
            <ul class="tag-list" data-smark='{"type":"list","name":"tags","of":"input","min_items":0,"max_items":6}'>
              <li class="tag-item" data-smark-role="item">
                <input data-smark type="text" placeholder="tag">
                <button type="button" data-smark-action="removeItem" aria-label="Remove tag">✖️</button>
              </li>
              <li class="tags-empty" data-smark-role="empty_list">No tags</li>
            </ul>
            <div class="section-actions">
              <button type="button" data-smark='{"action":"addItem","context":"tags"}'>＋ Add tag</button>
            </div>
          </section>

          <section class="task-section">
            <div class="section-heading"><h4>Checklist</h4><span class="section-hint">Break the work into verifiable steps</span></div>
            <ul class="checklist" data-smark='{"type":"list","name":"checklist","of":"form","min_items":0,"max_items":8}'>
              <li class="checklist-item" data-smark='{"type":"form","role":"item"}'>
                <input data-smark name="done" type="checkbox" aria-label="Subtask complete">
                <input data-smark name="task" type="text" placeholder="Checklist item">
                <button type="button" data-smark-action="removeItem" aria-label="Remove checklist item">×</button>
              </li>
              <li class="checklist-empty" data-smark-role="empty_list">No checklist items yet</li>
            </ul>
            <div class="section-actions">
              <button type="button" data-smark='{"action":"addItem","context":"checklist"}'>＋ Checklist item</button>
            </div>
          </section>

          <section class="task-section">
            <div class="section-heading"><h4>Activity</h4><span class="section-hint">Recent comments and decisions</span></div>
            <div class="activity-scroll" role="region" aria-label="Task activity" tabindex="0">
              <div class="activity-list" data-smark='{"type":"list","name":"activity","of":"form","min_items":0,"max_items":20}'>
                <article class="activity-entry" data-smark='{"type":"form","role":"item"}'>
                  <div class="activity-meta">
                    <input data-smark name="author" type="text" readonly aria-label="Comment author">
                    <input data-smark name="date" type="date" readonly aria-label="Comment date">
                  </div>
                  <textarea data-smark name="message" rows="2" readonly aria-label="Activity comment"></textarea>
                </article>
                <div class="activity-empty" data-smark-role="empty_list">No activity yet</div>
              </div>
            </div>
            <div class="section-actions">
              <button type="button" data-smark='{"action":"addItem","context":"activity"}'>＋ Add update</button>
            </div>
          </section>

          <section class="task-section">
            <div class="section-heading"><h4>Attachments</h4><span class="section-hint">Specs, notes, and supporting files</span></div>
            <div class="attachments" data-smark='{"type":"list","name":"attachments","of":"file","accept":".txt,.md,.pdf","min_items":0,"max_items":4}'>
              <div class="attachment-item" data-smark='{"type":"file","role":"item"}'>
                <input data-smark type="file" accept=".txt,.md,.pdf" aria-label="Choose attachment">
              </div>
              <div class="attachments-empty" data-smark-role="empty_list">No files attached</div>
            </div>
            <div class="section-actions">
              <button type="button" data-smark='{"action":"addItem","context":"attachments"}'>＋ Attach files</button>
              <button type="button" data-smark='{"action":"removeItem","context":"attachments"}'>− Remove last</button>
            </div>
          </section>
        </div>
      </details>

    </article>
    <div class="task-list-empty" data-smark-role="empty_list">No tasks in this column. Add a card or move one here.</div>
  </div>
</template>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- examples_kanban_css {{{ -->{% endraw %}
{% capture examples_kanban_css -%}
{{""}}#myForm$$ {
{{""}}  --ink: #203044; --muted: #5c6d7d; --line: #d8e0e7; --card: #fff;
{{""}}  box-sizing: border-box; max-width: 90rem; margin: 0 auto; padding: 1rem;
{{""}}  color: var(--ink); font: 1rem/1.45 system-ui, sans-serif;
{{""}}}
{{""}}#myForm$$ *, #myForm$$ *::before, #myForm$$ *::after { box-sizing: inherit; }
{{""}}#myForm$$ .project-app { padding: clamp(.8rem, 2.5vw, 1.5rem); border: 1px solid var(--line); border-radius: 1rem; background: #f6f8fa; }
{{""}}#myForm$$ .project-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.2rem; }
{{""}}#myForm$$ .project-header h2 { margin: .15rem 0; font-size: clamp(1.3rem, 2vw, 1.8rem); }
{{""}}#myForm$$ .project-header p { margin: 0; color: var(--muted); }
{{""}}#myForm$$ .project-eyebrow { color: #56687b; font-size: .7rem; font-weight: 800; letter-spacing: .13em; }
{{""}}#myForm$$ .sprint-status { flex: 0 0 auto; padding: .5rem .8rem; border: 1px solid #ccd7df; border-radius: 99px; background: white; color: #3b5063; font-size: .8rem; font-weight: 700; }
{{""}}#myForm$$ .status-dot { display: inline-block; width: .55rem; height: .55rem; margin-right: .35rem; border-radius: 50%; background: #2f855a; }
{{""}}#myForm$$ .kanban-board { display: grid; grid-template-columns: repeat(3, minmax(15rem, 1fr)); gap: .65rem; align-items: start; max-height: 70vh; overflow: auto; overscroll-behavior: contain; padding: 1rem .5rem 10rem .5rem; }
{{""}}#myForm$$ .kanban-column { --accent: #43556a; --wash: #f4f6f8; min-width: 0; padding: .65rem; border: 1px solid var(--line); border-radius: .9rem; background: linear-gradient(155deg, var(--wash), white 72%); }
{{""}}#myForm$$ .column-todo { --accent: #8a2c2c; --wash: #fff0ee; border-color: #e5b7b2; }
{{""}}#myForm$$ .column-progress { --accent: #78540b; --wash: #fff7df; border-color: #e5d39a; }
{{""}}#myForm$$ .column-done { --accent: #216343; --wash: #eaf7ef; border-color: #b5d8c2; }
{{""}}#myForm$$ .column-heading { padding: .35rem .25rem .7rem; color: var(--accent); }
{{""}}#myForm$$ .column-heading > div { display: flex; align-items: center; gap: .5rem; }
{{""}}#myForm$$ .column-heading h3 { margin: 0; font-size: 1rem; }
{{""}}#myForm$$ .column-heading p { margin: .15rem 0 0 1.15rem; color: var(--muted); font-size: .75rem; }
{{""}}#myForm$$ .column-indicator { width: .65rem; height: .65rem; border-radius: .2rem; background: var(--accent); }
{{""}}#myForm$$ .task-list { display: grid; gap: .6rem; }
{{""}}#myForm$$ .task-list-toolbar { display: flex; align-items: center; justify-content: space-between; gap: .4rem; padding: .2rem .1rem .45rem; color: var(--muted); font-size: .8rem; }
{{""}}#myForm$$ .task-list-toolbar strong { color: var(--accent); }
{{""}}#myForm$$ button { font: inherit; }
{{""}}#myForm$$ .task-list-toolbar button, #myForm$$ .section-actions button { padding: .25rem .5rem; border: 1px solid #cbd5dc; border-radius: .45rem; background: white; color: var(--ink); font-size: .75rem; cursor: pointer; }
{{""}}#myForm$$ .task-card { min-width: 0; padding: .6rem; border: 1px solid #dbe2e8; border-left: .25rem solid var(--accent); border-radius: .7rem; background: var(--card); box-shadow: 0 .2rem .6rem #1f29370c; }
{{""}}#myForm$$ .task-summary { display: flex; align-items: center; gap: .35rem; min-width: 0; cursor: pointer; list-style: none; }
{{""}}#myForm$$ .task-summary::-webkit-details-marker { display: none; }
{{""}}#myForm$$ .task-summary::before { content: "▸"; flex: 0 0 auto; color: var(--accent); transition: transform .15s; }
{{""}}#myForm$$ details[open] > .task-summary::before { transform: rotate(90deg); }
{{""}}#myForm$$ .task-position { flex: 0 0 auto; color: var(--accent); font-size: .75rem; font-weight: 800; }
{{""}}#myForm$$ .task-summary input { flex: 1 1 auto; width: 4em; max-width: 12em; min-width: 0; padding: .2rem; border: 0; background: transparent; color: var(--ink); font: inherit; font-weight: 700; }
{{""}}#myForm$$ .task-details { padding: .55rem .1rem .1rem; }
{{""}}#myForm$$ .task-details label { display: grid; gap: .2rem; color: #44576a; font-size: .75rem; font-weight: 700; }
{{""}}#myForm$$ .task-details input:not([type="checkbox"]), #myForm$$ .task-details select, #myForm$$ .task-details textarea { width: 95%; min-width: 0; padding: .4rem .5rem; border: 1px solid #d4dde4; border-radius: .4rem; background: white; color: var(--ink); font: .82rem/1.4 system-ui, sans-serif; }
{{""}}#myForm$$ .task-description textarea { resize: vertical; }
{{""}}#myForm$$ .task-fields { display: grid; grid-template-columns: 1fr; gap: .4rem; margin-top: .5rem; }
{{""}}#myForm$$ .task-section { margin-top: .7rem; padding-top: .55rem; border-top: 1px solid #e8edf1; }
{{""}}#myForm$$ .section-heading { display: flex; align-items: baseline; justify-content: space-between; gap: .4rem; margin-bottom: .3rem; }
{{""}}#myForm$$ .section-heading h4 { margin: 0; color: var(--ink); font-size: .8rem; }
{{""}}#myForm$$ .section-hint { color: var(--muted); font-size: .65rem; text-align: right; }
{{""}}#myForm$$ .tag-list { display: flex; flex-wrap: wrap; gap: .3rem; min-height: 1.8rem; margin: 0; padding: 0; list-style: none; }
{{""}}#myForm$$ .tag-item { display: inline-flex; align-items: center; gap: .15rem; max-width: 100%; padding: .1rem .25rem .1rem .45rem; border-radius: 99px; background: #edf3f6; }
{{""}}#myForm$$ .tag-item input { flex: 0 1 7em; width: 7em; min-width: 3.5em; padding: .15rem 0 !important; border: 0 !important; background: transparent !important; font-size: .7rem !important; }
{{""}}#myForm$$ .tag-item button { padding: .1rem .15rem; border: 0; background: transparent; color: #5c6d7d; cursor: pointer; font-size: .7rem; }
{{""}}#myForm$$ .tag-item button:hover { color: #9b3731; }
{{""}}#myForm$$ .tags-empty, #myForm$$ .checklist-empty, #myForm$$ .activity-empty, #myForm$$ .attachments-empty { color: var(--muted); font-size: .75rem; font-style: italic; }
{{""}}#myForm$$ .section-actions { display: flex; flex-wrap: wrap; gap: .3rem; margin-top: .35rem; }
{{""}}#myForm$$ .checklist { display: grid; gap: .25rem; margin: 0; padding: 0; list-style: none; }
{{""}}#myForm$$ .checklist-item { display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: center; gap: .35rem; }
{{""}}#myForm$$ .checklist-item input[type="checkbox"] { accent-color: var(--accent); }
{{""}}#myForm$$ .checklist-item input[type="text"] { padding: .25rem .35rem; font-size: .75rem; }
{{""}}#myForm$$ .checklist-item button { border: 0; background: transparent; color: var(--muted); cursor: pointer; }
{{""}}#myForm$$ .activity-scroll { max-height: 9rem; overflow-y: auto; overscroll-behavior: contain; padding: .25rem .35rem; border: 1px solid #e0e7ec; border-radius: .45rem; background: #f8fafb; }
{{""}}#myForm$$ .activity-list { display: grid; gap: .4rem; }
{{""}}#myForm$$ .activity-entry { padding-bottom: .35rem; border-bottom: 1px solid #e5ebef; }
{{""}}#myForm$$ .activity-meta { display: flex; justify-content: space-between; gap: .4rem; }
{{""}}#myForm$$ .activity-meta input { width: auto; max-width: 55%; padding: .1rem !important; border: 0 !important; background: transparent !important; font-size: .7rem !important; font-weight: 700; }
{{""}}#myForm$$ .activity-entry textarea { min-height: 2.4rem; padding: .2rem !important; border: 0 !important; background: transparent !important; font-size: .72rem !important; resize: vertical; }
{{""}}#myForm$$ .attachments { display: grid; gap: .25rem; }
{{""}}#myForm$$ .attachment-item input { padding: .3rem !important; font-size: .7rem !important; }
{{""}}#myForm$$ .card-actions { position: relative; display: flex; flex: 0 0 auto; }
{{""}}#myForm$$ .card-menu-trigger { min-width: 1.8rem; min-height: 1.8rem; border: 1px solid #dbe2e8; border-radius: .4rem; background: white; color: var(--accent); cursor: grab; }
{{""}}#myForm$$ .card-menu { display: none; position: absolute; top: calc(100% + .2rem); right: 0; z-index: 10; min-width: 11.5rem; padding: .25rem; border: 1px solid #ccd6de; border-radius: .55rem; background: white; box-shadow: 0 .4rem 1rem #20304424; }
{{""}}#myForm$$ .card-actions.menu-open-up .card-menu { top: auto; bottom: calc(100% + .2rem); }
{{""}}#myForm$$ .card-actions.menu-open .card-menu,
{{""}}#myForm$$ .card-actions:has([data-hotkey]) .card-menu { display: block; }
{{""}}#myForm$$ .card-menu button { display: block; width: 100%; padding: .35rem .45rem; border: 0; border-radius: .3rem; background: transparent; color: var(--ink); text-align: left; cursor: pointer; font-size: .75rem; }
{{""}}#myForm$$ .card-menu button:hover { background: #edf2f5; }
{{""}}#myForm$$ .card-menu button:disabled { opacity: .45; }
{{""}}#myForm$$ .task-list-empty { padding: 1rem .5rem; border: 1px dashed #b8c2ca; border-radius: .6rem; color: var(--muted); font-size: .8rem; text-align: center; }
{{""}}#myForm$$ .board-footnote { margin: .8rem 0 0; color: #586a79; font-size: .75rem; }
{{""}}#myForm$$ [data-hotkey] { position: relative; }
{{""}}#myForm$$ [data-hotkey]::after { content: "Ctrl+" attr(data-hotkey); position: absolute; bottom: 100%; left: 0; padding: 1px 3px; border-radius: 3px; background: #243546; color: white; font-size: .55rem; white-space: nowrap; }
{{""}}#myForm$$ { padding: .4rem; font-size: .78rem; line-height: 1.3; }
{{""}}#myForm$$ .project-app { padding: .45rem; }
{{""}}#myForm$$ .project-header { margin-bottom: .45rem; }
{{""}}#myForm$$ .project-header h2 { font-size: 1.1rem; }
{{""}}#myForm$$ .kanban-board { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .3rem; }
{{""}}#myForm$$ .kanban-column { min-width: 0; padding: .3rem; }
{{""}}#myForm$$ .column-heading { padding: .2rem .1rem .35rem; }
{{""}}#myForm$$ .column-heading h3 { font-size: .85rem; }
{{""}}#myForm$$ .column-heading p { margin-left: .9rem; font-size: .65rem; }
{{""}}#myForm$$ .task-list { gap: .35rem; }
{{""}}#myForm$$ .task-list-toolbar { gap: .2rem; padding-bottom: .3rem; font-size: .68rem; }
{{""}}#myForm$$ .task-list-toolbar button,
{{""}}#myForm$$ .section-actions button { padding: .2rem .3rem; font-size: .68rem; }
{{""}}#myForm$$ .task-card { padding: .35rem; }
{{""}}#myForm$$ .task-summary { gap: .2rem; }
{{""}}#myForm$$ .task-position { font-size: .65rem; }
{{""}}#myForm$$ .task-summary input { max-width: none; padding: .1rem; font-size: .75rem; }
{{""}}#myForm$$ .card-menu-trigger { min-width: 1.55rem; min-height: 1.55rem; padding: .1rem; }
{{""}}#myForm$$ .task-details { padding-top: .3rem; }
{{""}}#myForm$$ .task-details label { font-size: .68rem; }
{{""}}#myForm$$ .task-details input:not([type="checkbox"], [type="file"]),
{{""}}#myForm$$ .task-details select,
{{""}}#myForm$$ .task-details textarea { width: 100%; padding: .3rem; font-size: .72rem; }
{{""}}#myForm$$ .task-section { margin-top: .45rem; padding-top: .35rem; }
{{""}}#myForm$$ .section-heading h4 { font-size: .72rem; }
{{""}}#myForm$$ .section-hint { font-size: .58rem; }
{{""}}#myForm$$ .section-actions { gap: .2rem; }
{{""}}#myForm$$ .activity-scroll { max-height: 7rem; }
{{""}}@media (max-width: 36rem) {
{{""}}  #myForm$$ .project-header { align-items: flex-start; flex-direction: column; }
{{""}}  #myForm$$ .kanban-column { padding: .3rem; }
{{""}}}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- examples_kanban_js {{{ -->{% endraw %}
{% capture examples_kanban_js -%}
/* SmarkForm owns the actions and hotkeys; this manages the task-action disclosure. */
{
    const root = myForm.targetNode;
    const positionMenus = () => {
        const board = root.querySelector('.kanban-board');
        if (! board) return;
        const boardRect = board.getBoundingClientRect();
        const clipTop = boardRect.top + board.clientTop;
        const clipBottom = clipTop + board.clientHeight;
        for (const actions of root.querySelectorAll('.card-actions')) {
            const menu = actions.querySelector('.card-menu');
            if (getComputedStyle(menu).display === 'none') {
                actions.classList.remove('menu-open-up');
                continue;
            };
            actions.classList.remove('menu-open-up');
            let menuRect = menu.getBoundingClientRect();
            let actionsRect = actions.getBoundingClientRect();
            let roomAbove = actionsRect.top - clipTop;
            if (menuRect.bottom > clipBottom && roomAbove < menuRect.height + 8) {
                const shift = menuRect.height + 8 - roomAbove;
                const roomBelow = clipBottom - actionsRect.bottom;
                if (shift <= roomBelow && board.scrollTop >= shift) {
                    board.scrollTop -= shift;
                    menuRect = menu.getBoundingClientRect();
                    actionsRect = actions.getBoundingClientRect();
                    roomAbove = actionsRect.top - clipTop;
                };
            };
            if (menuRect.bottom > clipBottom && roomAbove >= menuRect.height + 8) {
                actions.classList.add('menu-open-up');
            };
        };
    };
    const syncMenus = () => {
        for (const actions of root.querySelectorAll('.card-actions')) {
            const expanded = (
                actions.classList.contains('menu-open')
                || !! actions.querySelector('[data-hotkey]')
            );
            actions.querySelector('.card-menu-trigger')
                ?.setAttribute('aria-expanded', String(expanded));
            for (const action of actions.querySelectorAll('.card-menu button[data-smark]')) {
                action.tabIndex = expanded ? 0 : -1;
            };
        };
        positionMenus();
    };
    const closeMenus = () => {
        root.querySelectorAll('.card-actions.menu-open')
            .forEach(actions => actions.classList.remove('menu-open', 'menu-open-up'));
        syncMenus();
    };

    root.addEventListener('click', event => {
        const trigger = event.target.closest?.('.card-menu-trigger');
        if (trigger && root.contains(trigger)) {
            event.preventDefault();
            const actions = trigger.parentElement;
            const opening = actions.classList.toggle('menu-open');
            if (opening) {
                root.querySelectorAll('.card-actions.menu-open')
                    .forEach(other => {
                        if (other !== actions) other.classList.remove('menu-open', 'menu-open-up');
                    });
            } else {
                actions.classList.remove('menu-open-up');
            };
            syncMenus();
            return;
        };
        if (! event.target.closest?.('.card-actions.menu-open')) closeMenus();
    });

    for (const eventName of ['keydown', 'keyup', 'focusin', 'focusout']) {
        root.addEventListener(eventName, syncMenus);
    };
    root.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        const trigger = root.querySelector('.card-actions.menu-open .card-menu-trigger');
        if (! trigger) return;
        event.preventDefault();
        event.stopPropagation();
        closeMenus();
        trigger.focus();
    });
    document.addEventListener('pointerdown', event => {
        if (! root.contains(event.target)) closeMenus();
    });
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- examples_kanban_notes {{{ -->{% endraw %}
{% capture examples_kanban_notes -%}
**Try it:** Each compact card shows its position, editable title, and task-action
handle. Use the native disclosure arrow to expand the task record. Open the
handle's menu to reorder the card or move it to an adjacent column. In the
details, edit its fields, add a checklist step or tag, scroll the activity
history, and attach a text or PDF file. The position number follows the card.

The column task lists use <code>role:"jump-boundary"</code>, so
`Ctrl`+`Enter` / `Ctrl`+`Shift`+`Enter` move focus between columns, restoring the
last focused field. Textareas retain their field-navigation behavior. If there
is no available sibling boundary, navigation falls back to the current task list.

The status colors are deliberately pale behind white cards, with dark text and
stronger colored headings for contrast. Touch devices may need a drag-and-drop
polyfill such as [DragDropTouch]({{ "/showcase_examples/showcase#project-kanban-board" | relative_url }});
this Examples page does not load that polyfill globally.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- examples_kanban_demoValue {{{ -->{% endraw %}
{% capture examples_kanban_demoValue -%}
{
  "project": {
    "todo": [
      {
        "title": "Publish the 1.0 migration guide",
        "description": "Document the stable API surface, configuration changes, and upgrade path for existing projects.",
        "priority": "high",
        "assignee": "Maya Chen",
        "due_date": "2026-11-30",
        "tags": ["release", "docs"],
        "checklist": [
          {"done": true, "task": "Confirm the option migration table"},
          {"done": false, "task": "Add a tested upgrade example"},
          {"done": false, "task": "Review links and release wording"}
        ],
        "activity": [
          {"author": "Maya Chen", "date": "2026-11-21", "message": "Drafted the upgrade outline from the 0.26 migration notes."},
          {"author": "Nico Alvarez", "date": "2026-11-22", "message": "Please include a short section for custom component authors."},
          {"author": "Maya Chen", "date": "2026-11-23", "message": "Added the component-author checklist; API review is next."},
          {"author": "Iris Patel", "date": "2026-11-24", "message": "The examples read clearly. I will verify the links after the final edit."}
        ],
        "attachments": ["data:text/plain;name=release-scope.txt;size=4;lastModified=0;base64,UGxhbg=="]
      },
      {
        "title": "Audit keyboard and screen-reader flows",
        "description": "Walk through nested lists, disclosures, validation notices, and focus restoration with keyboard-only input.",
        "priority": "normal",
        "assignee": "Nico Alvarez",
        "due_date": "2026-12-02",
        "tags": ["accessibility", "qa"],
        "checklist": [
          {"done": false, "task": "Verify task movement announcements"},
          {"done": false, "task": "Check collapsed details navigation"}
        ],
        "activity": [
          {"author": "Nico Alvarez", "date": "2026-11-23", "message": "Started with the list movement examples; focus returns to the moved row."}
        ],
        "attachments": []
      }
    ],
    "progress": [
      {
        "title": "Rebuild the Examples page as live samples",
        "description": "Replace the selector-only showcase with realistic, editable sampletabs and keep the original downloads as a hidden archive.",
        "priority": "high",
        "assignee": "Iris Patel",
        "due_date": "2026-12-04",
        "tags": ["docs", "examples"],
        "checklist": [
          {"done": true, "task": "Keep the old example files reachable"},
          {"done": false, "task": "Add the project board sample"},
          {"done": false, "task": "Update build and asset synchronization"}
        ],
        "activity": [
          {"author": "Iris Patel", "date": "2026-11-24", "message": "The new page keeps the original route and adds a link to the legacy archive."},
          {"author": "Maya Chen", "date": "2026-11-24", "message": "The first sample is a complete release-planning board with nested task data."}
        ],
        "attachments": []
      },
      {
        "title": "Test file acquisition on mobile browsers",
        "description": "Verify multi-file selection, paste, and list-level drops on touch-capable browsers without changing ordinary page scrolling.",
        "priority": "normal",
        "assignee": "Sam Okafor",
        "due_date": "2026-12-05",
        "tags": ["media", "mobile"],
        "checklist": [
          {"done": true, "task": "Check Android picker behavior"},
          {"done": false, "task": "Verify iOS file-paste fallback"}
        ],
        "activity": [
          {"author": "Sam Okafor", "date": "2026-11-24", "message": "Desktop acquisition is covered; collecting mobile device results."}
        ],
        "attachments": []
      }
    ],
    "done": [
      {
        "title": "Ship keyboard list movement actions",
        "description": "Deliver bounded next/previous actions with rollback-safe cross-list transfer and live availability updates.",
        "priority": "normal",
        "assignee": "Maya Chen",
        "due_date": "2026-11-20",
        "tags": ["lists", "release"],
        "checklist": [
          {"done": true, "task": "Validate source and destination bounds"},
          {"done": true, "task": "Add keyboard and drag regression tests"}
        ],
        "activity": [
          {"author": "Maya Chen", "date": "2026-11-19", "message": "Movement actions passed Chromium, Firefox, and WebKit checks."},
          {"author": "Nico Alvarez", "date": "2026-11-20", "message": "Merged after the cross-list rollback review."}
        ],
        "attachments": []
      }
    ]
  }
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- examples_kanban_tests {{{ -->{% endraw %}
{% capture examples_kanban_tests -%}
export default async ({ expect, root, readField, writeField, page }) => {
    await expect(root).toBeVisible();

    const task = (title, overrides = {}) => ({
        title,
        description: 'A realistic task description for the sprint board.',
        priority: 'high',
        assignee: 'Maya Chen',
        due_date: '2026-12-02',
        tags: ['release', 'docs'],
        checklist: [
            {done: true, task: 'Confirm the approach'},
            {done: false, task: 'Complete the implementation'},
        ],
        activity: [
            {author: 'Maya Chen', date: '2026-11-23', message: 'The first review is complete.'},
            {author: 'Nico Alvarez', date: '2026-11-24', message: 'I added a follow-up and checked the acceptance notes.'},
            {author: 'Iris Patel', date: '2026-11-24', message: 'The final verification is queued for tomorrow morning.'},
            {author: 'Sam Okafor', date: '2026-11-24', message: 'Please keep the mobile upload path in the final regression run.'},
        ],
        attachments: ['data:text/plain;name=brief.txt;size=4;lastModified=0;base64,UGxhbg=='],
        ...overrides,
    });
    const todoTasks = [task('Publish the migration guide'), task('Audit keyboard flows')];
    const progressTasks = [task('Rebuild the Examples page')];
    const doneTasks = [task('Ship list movement actions')];
    await writeField('/project/todo', todoTasks);
    await writeField('/project/progress', progressTasks);
    await writeField('/project/done', doneTasks);

    expect(await readField('/project/todo/0/priority')).toBe('high');
    expect(await readField('/project/todo/0/checklist')).toHaveLength(2);
    expect(await readField('/project/todo/0/attachments')).toHaveLength(1);
    await expect(root.locator('.column-todo .task-position')).toHaveText(['1', '2']);
    await expect(root.locator('.column-progress .task-position')).toHaveText(['1']);
    const columnTops = await root.locator('.kanban-column').evaluateAll(columns =>
        columns.map(column => column.getBoundingClientRect().top)
    );
    expect(Math.max(...columnTops) - Math.min(...columnTops)).toBeLessThan(2);

    const firstCard = root.locator('.column-todo .task-card').first();
    const taskDetails = firstCard.locator('details');
    const menuTrigger = firstCard.getByRole('button', {name: 'Task actions'});
    const menu = firstCard.locator('[data-card-menu]');
    await expect(taskDetails).not.toHaveAttribute('open', '');
    await menuTrigger.click();
    await expect(menu).toBeVisible();
    await expect(taskDetails).not.toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(menu).not.toBeVisible();
    await expect(menuTrigger).toHaveAttribute('aria-expanded', 'false');

    await firstCard.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(taskDetails).toHaveAttribute('open', '');
    await expect(firstCard.locator('textarea[name="description"]')).toBeVisible();
    const boardScrollsVertically = await root.locator('.kanban-board').evaluate(board => {
        board.style.maxHeight = '12rem';
        return getComputedStyle(board).overflowY === 'auto'
            && board.scrollHeight > board.clientHeight;
    });
    expect(boardScrollsVertically).toBe(true);
    await expect(firstCard.locator('.activity-scroll')).toHaveCSS('overflow-y', 'auto');
    const activityScrolls = await firstCard.locator('.activity-scroll').evaluate(el =>
        el.scrollHeight > el.clientHeight
    );
    expect(activityScrolls).toBe(true);

    const board = root.locator('.kanban-board');
    await board.evaluate(node => { node.scrollTop = node.scrollHeight; });
    const bottomCard = root.locator('.column-todo .task-card').last();
    const bottomMenuTrigger = bottomCard.getByRole('button', {name: 'Task actions'});
    await bottomMenuTrigger.click();
    const bottomMenu = bottomCard.locator('.card-menu');
    const menuFitsBoard = await bottomMenu.evaluate(menu => {
        const board = menu.closest('.kanban-board');
        const menuRect = menu.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();
        const top = boardRect.top + board.clientTop;
        const bottom = top + board.clientHeight;
        return menuRect.top >= top - 1 && menuRect.bottom <= bottom + 1;
    });
    expect(menuFitsBoard).toBe(true);
    await page.keyboard.press('Escape');

    await firstCard.getByRole('button', {name: /Add tag/}).click();
    const tagInputs = firstCard.locator('.tag-item input');
    await expect(tagInputs).toHaveCount(3);
    await tagInputs.last().fill('audit');
    await expect.poll(() => readField('/project/todo/0/tags')).toEqual(['release', 'docs', 'audit']);
    await firstCard.locator('.tag-item').first().getByRole('button', {name: 'Remove tag'}).click();
    await expect.poll(() => readField('/project/todo/0/tags')).toEqual(['docs', 'audit']);
    await menuTrigger.click();
    await menu.getByRole('button', {name: /Next Column/}).click();
    await expect.poll(() => readField('/project/todo')).toHaveLength(1);
    await expect.poll(() => readField('/project/progress')).toHaveLength(2);
    await expect.poll(() => readField('/project/progress/1/title')).toBe('Publish the migration guide');
    await expect(root.locator('.column-progress .task-position')).toHaveText(['1', '2']);

    const measureBoardLayout = () => root.evaluate(form => {
        const board = form.querySelector('.kanban-board');
        const columns = [...board.querySelectorAll('.kanban-column')];
        return {
            boardWidth: board.clientWidth,
            boardScrollWidth: board.scrollWidth,
            columnWidths: columns.map(column => column.getBoundingClientRect().width),
            gridColumns: getComputedStyle(board).gridTemplateColumns,
        };
    });
    const assertBoardFits = layout => {
        expect(layout.columnWidths).toHaveLength(3);
        expect(layout.columnWidths.every(width => width > 0)).toBe(true);
        expect(layout.gridColumns.trim().split(/\s+/)).toHaveLength(3);
        expect(layout.boardScrollWidth).toBeLessThanOrEqual(layout.boardWidth + 1);
    };
    for (const width of [320, 390, 768]) {
        await page.setViewportSize({width, height: 844});
        await page.evaluate(() => document.body.classList.remove('smarkform-maximized'));
        assertBoardFits(await measureBoardLayout());
        await page.evaluate(() => document.body.classList.add('smarkform-maximized'));
        assertBoardFits(await measureBoardLayout());
    }

    await writeField('/project/todo', [
        {title:'Sketch task one'},
        {title:'Sketch task two'},
    ]);
    await writeField('/project/progress', [{title:'Review the release notes'}]);
    await writeField('/project/done', [{title:'Publish the build'}]);
    const todoTitles = root.locator('.column-todo .task-card input[name="title"]');
    const progressTitle = root.locator('.column-progress .task-card input[name="title"]').first();
    await todoTitles.first().focus();
    await page.waitForTimeout(25);
    await page.keyboard.press('Control+Enter');
    await expect(progressTitle).toBeFocused();
    await page.waitForTimeout(25);
    await page.keyboard.press('Control+Shift+Enter');
    await expect(todoTitles.first()).toBeFocused();
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="examples_project_kanban"
    title="Release planning with nested task records"
    htmlSource=examples_kanban_html
    cssSource=examples_kanban_css
    jsSource=examples_kanban_js
    notes=examples_kanban_notes
    demoValue=examples_kanban_demoValue
    tests=examples_kanban_tests
    showEditor=true
    selected="preview"
    minHeight=80
%}

{: .hint }
> The earlier standalone forms are preserved in the
> [Legacy Examples archive]({{ "/showcase_examples/legacy_examples" | relative_url }}).
> It is hidden from navigation and search and is no longer maintained.
