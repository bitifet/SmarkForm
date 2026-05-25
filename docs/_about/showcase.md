---
title: Showcase
layout: chapter
permalink: /about/showcase
nav_order: 2

---

# {{ page.title }}


This section provides a series of working examples to demonstrate the
capabilities of *SmarkForm* without diving into code details.

It highlights key features through examples, using short and readable code that
prioritizes clarity over UX/semantics. The examples use minimal or no CSS (if
any you'll find it at the CSS tab) to show layout independence.

They go step by step from the most basic form to more advanced and fully
featured ones.

👉 If you are eager to to see the full power of *SmarkForm* in action, you can
   check the 🔗 [Examples]({{ "resources/examples" | relative_url }}) section
   first.

👉 Nonetheless, if you are impatient to get your hands dirty, the
   🔗 [Quick Start]({{ "getting_started/quick_start" | relative_url }}) is
   there for you.



<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Basics](#basics)
    * [Just a Form](#just-a-form)
    * [Three-Level Nesting](#three-level-nesting)
    * [Deeply nested forms](#deeply-nested-forms)
    * [More on lists](#more-on-lists)
    * [Mixins](#mixins)
    * [Nested lists and forms](#nested-lists-and-forms)
    * [Item duplication and closure state](#item-duplication-and-closure-state)
    * [A note on empty values](#a-note-on-empty-values)
    * [Nesting Mixins](#nesting-mixins)
* [Import and Export Data](#import-and-export-data)
    * [Intercepting the *import* and *export* events](#intercepting-the-import-and-export-events)
    * [A note on context of the triggers](#a-note-on-context-of-the-triggers)
* [Advanced UX Improvements](#advanced-ux-improvements)
    * [Auto enabling or disabling of actions](#auto-enabling-or-disabling-of-actions)
    * [Context-Driven Keyboard Shortcuts (Hot Keys)](#context-driven-keyboard-shortcuts-hot-keys)
    * [Reveal of hot keys](#reveal-of-hot-keys)
    * [Hotkeys and context](#hotkeys-and-context)
    * [Collapsible sections](#collapsible-sections)
    * [Smooth navigation](#smooth-navigation)
    * [2nd level hotkeys](#2nd-level-hotkeys)
    * [Hidden actions](#hidden-actions)
    * [Animations](#animations)
    * [Smart value coercion](#smart-value-coercion)
        * [Scalar-to-array list coercion](#scalar-to-array-list-coercion)
        * [Type coercion for scalar fields](#type-coercion-for-scalar-fields)
    * [Dynamic Dropdown Options](#dynamic-dropdown-options)
* [Random Examples](#random-examples)
    * [Simple Calculator](#simple-calculator)
    * [Calculator (UX improved)](#calculator-ux-improved)
    * [Team Event Planner](#team-event-planner)
* [Conclusion](#conclusion)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


{% include components/sampletabs_ctrl.md %}


## Basics

### Just a Form

Fields auto-register from HTML attributes — no JavaScript beyond
initialization. Try editing values in the preview or clicking the `⬇️ Export`
button to edit the JSON in the playground editor at the bottom.

{% raw %} <!-- notes_just_form {{{ --> {% endraw %}
{% capture notes_just_form -%}
👉 **Null values.** SmarkForm fields can be `null` to mean "unknown". Unlike
native HTML, even `<input type="color">` can be null — just press `Delete` or
use the ✕ trigger.

👉 **Triggers.** Elements with `data-smark='{"action":"..."}'` call actions on
SmarkForm fields.  Common actions: `import`, `export`, `clear`, `addItem`,
`removeItem`.

👉 **JSON editor.** The Editor tab shows the form data as JSON.  Edit and click
outside to import your changes back.
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- just_form_example {{{ --> {% endraw %}
{% capture just_form_example -%}
<div id="myForm$$">
  <p><label data-smark>Name:</label><input name="name" type="text" data-smark></p>
  <p><label data-smark>Age:</label><input name="age" type="number" data-smark></p>
  <p>
    <label data-smark>Favorite Color:</label>
    <span data-smark='{"type":"color","name":"color"}'>
      <input data-smark><button data-smark='{"action":"clear"}' title="Clear">✕</button>
    </span>
  </p>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- just_form_demoValue {{{ --> {% endraw %}
{% capture just_form_demoValue -%}
{"name":"Alice","age":28,"color":"#6366f1"}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- just_form_tests {{{ --> {% endraw %}
{% capture just_form_tests -%}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    // Fill in fields
    await page.getByLabel('Name:').fill('Alice');
    expect(await readField('name')).toBe('Alice');

    await page.getByLabel('Age:').fill('28');
    expect(await readField('age')).toBe(28);

    // Clear color verify null
    await page.getByTitle('Clear').click();
    expect(await readField('color')).toBeNull();

    // Export all
    const data = await page.evaluate(async () => myForm.export());
    expect(data).toEqual({ name: 'Alice', age: 28, color: null });
};
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="just_form"
    htmlSource=just_form_example
    notes=notes_just_form
    selected="preview"
    showEditor=true
    demoValue=just_form_demoValue
    tests=just_form_tests
%}


### Three-Level Nesting

This single HTML example packs a surprising range of SmarkForm features:
three-level nesting of forms and lists, sortable groups, cross-list
drag-and-drop for students, nested collapsible sections, auto-disabling
triggers that respect `min_items`/`max_items` boundaries, per-subject grade
lists that grow on demand, empty-list placeholders, and automatic position
numbering — all from the declarative HTML you see in the source tab with
no custom JavaScript.  Each capability is introduced step by step in the
pages that follow.

{% raw %} <!-- notes_school_groups {{{ --> {% endraw %}
{% capture notes_school_groups -%}
👉 **Nested hierarchy.** Three levels of nesting: groups → students → grades
produce deeply structured JSON automatically.

👉 **Card layout.** Each group is a card with a scrollable student list
(max-height, `overflow-y: auto`) — keeps the page tidy even with many students.

👉 **Cross-list drag.** `movingDepth: 2` on the students list lets users drag
students between groups (sibling distance = 2: student → group → sibling's
students).

👉 **Collapsible sections.** Both groups and students use `<details>`/`<summary>`
to keep the view compact.  A group shows its name in the summary; opening it
reveals the tutor and student list.  Likewise for each student.

👉 **Nested `<details>`.** SmarkForm handles keyboard navigation correctly even
with nested collapsible sections — Shift+Space toggles, Enter navigates, and
auto-open works as expected.

👉 **Auto-disable.** Triggers disable themselves at their list's
`min_items`/`max_items` boundary — no code needed.

👉 **`position` action.** Span with `data-smark='{"action":"position"}'`
auto-numbers each group.
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- school_groups_example {{{ --> {% endraw %}
{% capture school_groups_example -%}
<div id="myForm$$">
  <div class="sg">
    <div class="sg-header">
      <input name="name" placeholder="School name" type="text" data-smark>
      <input name="level" placeholder="Level (e.g. Primary)" type="text" data-smark>
      <input name="year" placeholder="Academic year" type="text" data-smark>
    </div>

    <ul data-smark='{"type":"list","name":"groups","sortable":true,"min_items":0}'>
      <li data-smark='{"role":"empty_list"}' class="sg-empty">No groups yet</li>
      <li>
        <div class="sg-card">
          <details>
            <summary>
              <span data-smark='{"type":"label"}' class="sg-handle">⠿</span>
              <span data-smark='{"action":"position"}'>#</span>
              <input name="name" placeholder="Group name" type="text" data-smark>
              <button data-smark='{"action":"removeItem","hotkey":"-"}' title="Remove group">➖</button>
            </summary>
            <div class="sg-body">
              <label class="sg-tutor">Tutor: <input name="tutor" placeholder="Tutor name" type="text" data-smark></label>
              <div class="sg-students">
                <strong>Students</strong>
                <ul data-smark='{"type":"list","name":"students","sortable":true,"movingDepth":2,"min_items":0}'>
                  <li data-smark='{"role":"empty_list"}' class="sg-empty">No students yet</li>
                  <li>
                    <details>
                      <summary>
                        <span data-smark='label' title="Drag to reorder or move between groups" class="sg-handle">⠿</span>
                        <input name="name" placeholder="Student name" type="text" data-smark>
                        <button data-smark='{"action":"removeItem","hotkey":"-"}' title="Remove student">➖</button>
                      </summary>
                      <div data-smark='{"type":"form","name":"grades"}' class="sg-grades">
                        <div class="sg-grade-col">
                          <div class="sg-grade-label">Math</div>
                          <div data-smark='{"type":"list","name":"math","min_items":0}'>
                            <div data-smark='{"role":"empty_list"}' class="sg-empty">∅</div>
                            <input type="number" step="0.1" min="0" max="10" data-smark>
                          </div>
                          <div class="sg-grade-btns">
                            <button data-smark='{"action":"addItem","hotkey":"+","context":"math"}' title="Add grade">➕</button>
                            <button data-smark='{"action":"removeItem","hotkey":"-","context":"math"}' title="Remove grade">➖</button>
                          </div>
                        </div>
                        <div class="sg-grade-col">
                          <div class="sg-grade-label">Literature</div>
                          <div data-smark='{"type":"list","name":"literature","min_items":0}'>
                            <div data-smark='{"role":"empty_list"}' class="sg-empty">∅</div>
                            <input type="number" step="0.1" min="0" max="10" data-smark>
                          </div>
                          <div class="sg-grade-btns">
                            <button data-smark='{"action":"addItem","hotkey":"+","context":"literature"}' title="Add grade">➕</button>
                            <button data-smark='{"action":"removeItem","hotkey":"-","context":"literature"}' title="Remove grade">➖</button>
                          </div>
                        </div>
                        <div class="sg-grade-col">
                          <div class="sg-grade-label">Science</div>
                          <div data-smark='{"type":"list","name":"science","min_items":0}'>
                            <div data-smark='{"role":"empty_list"}' class="sg-empty">∅</div>
                            <input type="number" step="0.1" min="0" max="10" data-smark>
                          </div>
                          <div class="sg-grade-btns">
                            <button data-smark='{"action":"addItem","hotkey":"+","context":"science"}' title="Add grade">➕</button>
                            <button data-smark='{"action":"removeItem","hotkey":"-","context":"science"}' title="Remove grade">➖</button>
                          </div>
                        </div>
                      </div>
                    </details>
                  </li>
                </ul>
                <button data-smark='{"action":"addItem","hotkey":"+","context":"students"}' title="Add student">➕ Add Student</button>
              </div>
            </div>
          </details>
        </div>
      </li>
    </ul>
    <button data-smark='{"action":"addItem","hotkey":"+","context":"groups"}' title="Add group">➕ Add Group</button>
  </div>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- school_groups_css {{{ --> {% endraw %}
{% capture school_groups_css -%}
{{""}}#myForm$$ .sg { max-width: 520px; font-size: 0.95em; font-family: sans-serif; }
{{""}}#myForm$$ .sg ul { list-style: none; padding: 0; margin: 0; }
{{""}}#myForm$$ .sg-header {
    display: flex; gap: 0.5em; margin-bottom: 0.6em; flex-wrap: wrap;
}
{{""}}#myForm$$ .sg-header input {
    flex: 1; min-width: 120px; padding: 0.35em 0.5em;
    border: 1px solid #ccc; border-radius: 4px;
}
{{""}}#myForm$$ .sg-card {
    border: 1px solid #ddd; border-radius: 8px;
    margin: 0.4em 0; background: rgba(165, 165, 165, .25);
    overflow: hidden;
}
{{""}}#myForm$$ .sg-card details[open] { padding-bottom: 0.4em; }
{{""}}#myForm$$ .sg-card summary {
    display: flex; align-items: center; gap: 0.4em;
    padding: 0.35em 0.5em; user-select: none;
    background: rgba(168, 168, 168, .25); border-radius: 8px;
}
{{""}}#myForm$$ .sg-card details[open] summary { border-radius: 8px 8px 0 0; border-bottom: 1px solid #eee; }
{{""}}#myForm$$ .sg-handle { cursor: grab; color: #aaa; user-select: none; }
{{""}}#myForm$$ .sg-card summary input[type="text"] {
    flex: 1; padding: 0.25em 0.4em;
    border: 1px solid #ccc; border-radius: 4px;
}
{{""}}#myForm$$ .sg-body { padding: 0.4em 0.5em 0.2em 1.8em; }
{{""}}#myForm$$ .sg-tutor { display: flex; align-items: center; gap: 0.4em; margin-bottom: 0.3em; font-size: 0.9em; }
{{""}}#myForm$$ .sg-tutor input { flex: 1; padding: 0.2em 0.4em; border: 1px solid #ccc; border-radius: 4px; }
{{""}}#myForm$$ .sg-students { margin-top: 0.3em; }
{{""}}#myForm$$ .sg-students > strong { font-size: 0.85em; color: #555; display: block; margin-bottom: 0.2em; }
{{""}}#myForm$$ .sg-students ul {
    max-height: 240px; overflow-y: auto;
    border: 1px solid #eee; border-radius: 4px; padding: 0.2em 0.3em;
    background: rgba(168, 168, 168, .25);
}
{{""}}#myForm$$ .sg-students ul li { margin: 0.15em 0; }
{{""}}#myForm$$ .sg-students ul details summary {
    display: flex; align-items: center; gap: 0.3em; padding: 0.2em 0.3em;
    border-radius: 4px; background: rgba(165, 165, 165, .25); border: 1px solid #eee;
}
{{""}}#myForm$$ .sg-students ul details[open] summary { border-radius: 4px 4px 0 0; border-bottom: 0; }
{{""}}#myForm$$ .sg-students ul details[open] { background: rgba(165, 165, 165, .25); }
{{""}}#myForm$$ .sg-students ul li input[type="text"] {
    flex: 1; padding: 0.2em 0.4em;
    border: 1px solid #ccc; border-radius: 4px; font-size: 0.9em;
}
{{""}}#myForm$$ .sg-grades {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;
    padding: 0.3em 0.3em 0.2em 0.3em;
}
{{""}}#myForm$$ .sg-grade-col {
    display: flex; flex-direction: column; gap: 2px;
}
{{""}}#myForm$$ .sg-grade-label {
    font-weight: bold; text-align: center; font-size: 0.85em;
    padding: 0.15em 0; border-bottom: 1px solid #ddd;
}
{{""}}#myForm$$ .sg-grade-col input[type="number"] {
    width: 100%; box-sizing: border-box;
    padding: 0.15em 0.3em;
    border: 1px solid #ccc; border-radius: 4px;
}
{{""}}#myForm$$ .sg-grade-btns {
    display: flex; gap: 2px; justify-content: center; margin-top: 2px;
}
{{""}}#myForm$$ .sg-grade-btns button {
    padding: 0.1em 0.4em; border: 1px solid #ccc; border-radius: 4px;
    background: rgba(168, 168, 168, .25); cursor: pointer; font-size: 0.85em; line-height: 1.4;
}
{{""}}#myForm$$ .sg-empty { font-style: italic; color: #aaa; padding: 0.5em; font-size: 0.9em; }
{{""}}#myForm$$ .sg button {
    padding: 0.2em 0.6em; border: 1px solid #ccc; border-radius: 4px;
    background: rgba(168, 168, 168, .25); cursor: pointer; line-height: 1.5;
}
{{""}}#myForm$$ .sg button:disabled { opacity: 0.4; }
{{""}}#myForm$$ .sg [data-hotkey] { position: relative; }
{{""}}#myForm$$ .sg [data-hotkey]::after {
    content: "Ctrl+" attr(data-hotkey);
    position: absolute; top: -1.6em; left: 0;
    font-size: 0.7em; background: #333; color: #fff;
    padding: 1px 4px; border-radius: 3px; white-space: nowrap;
}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- school_groups_demoValue {{{ --> {% endraw %}
{% capture school_groups_demoValue -%}
{
    "name": "Springfield Elementary",
    "level": "Primary",
    "year": "2025/2026",
    "groups": [
        {
            "name": "Class A",
            "tutor": "Mr. Smith",
            "students": [
                {"name": "Lisa Simpson",  "grades": {"math": [9.5, 8.0], "literature": [7.3], "science": [8.8]}},
                {"name": "Bart Simpson",  "grades": {"math": [4.0], "literature": [5.5], "science": [3.0]}}
            ]
        },
        {
            "name": "Class B",
            "tutor": "Ms. Johnson",
            "students": [
                {"name": "Milhouse Van Houten", "grades": {"math": [6.0], "literature": [7.0], "science": [6.5]}}
            ]
        }
    ]
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- school_groups_tests {{{ --> {% endraw %}
{% capture school_groups_tests -%}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    // Import demo data for a known starting state
    await page.evaluate(async () => {
        await myForm.import({
            name: "Springfield Elementary",
            level: "Primary",
            year: "2025/2026",
            groups: [
                {
                    name: "Class A",
                    tutor: "Mr. Smith",
                    students: [
                        {name: "Lisa Simpson", grades: {math: [9.5, 8.0], literature: [7.3], science: [8.8]}},
                        {name: "Bart Simpson", grades: {math: [4.0], literature: [5.5], science: [3.0]}},
                    ],
                },
                {
                    name: "Class B",
                    tutor: "Ms. Johnson",
                    students: [
                        {name: "Milhouse Van Houten", grades: {math: [6.0], literature: [7.0], science: [6.5]}},
                    ],
                },
            ],
        });
    });

    // Verify initial structure
    let data = await readField('/');
    expect(data.name).toBe('Springfield Elementary');
    expect(data.level).toBe('Primary');
    expect(data.groups.length).toBe(2);
    expect(data.groups[0].name).toBe('Class A');
    expect(data.groups[0].tutor).toBe('Mr. Smith');
    expect(data.groups[0].students.length).toBe(2);
    expect(data.groups[0].students[0].name).toBe('Lisa Simpson');
    expect(data.groups[0].students[0].grades.math[0]).toBe(9.5);
    expect(data.groups[0].students[0].grades.math[1]).toBe(8.0);
    expect(data.groups[0].students[0].grades.literature[0]).toBe(7.3);
    expect(data.groups[0].students[0].grades.science[0]).toBe(8.8);
    expect(data.groups[0].students[1].name).toBe('Bart Simpson');
    expect(data.groups[0].students[1].grades.science[0]).toBe(3.0);
    expect(data.groups[1].students[0].name).toBe('Milhouse Van Houten');

    // Cross-list move: drag Bart Simpson from Class A to Class B
    await page.evaluate(async () => {
        const classAStudents = myForm.find('/groups/0/students');
        const classBStudents = myForm.find('/groups/1/students');
        await classAStudents.move({
            from: classAStudents.children[1],  // Bart Simpson
            targetList: classBStudents,
            position: 'after',
        });
    });

    data = await readField('/');
    expect(data.groups[0].students.length).toBe(1,
        'Class A should have 1 student after moving Bart out');
    expect(data.groups[0].students[0].name).toBe('Lisa Simpson');
    expect(data.groups[1].students.length).toBe(2,
        'Class B should have 2 students after receiving Bart');
    expect(data.groups[1].students[1].name).toBe('Bart Simpson',
        'Bart should be at the end of Class B');
    expect(data.groups[1].students[1].grades.math[0]).toBe(4.0,
        'Bart\'s grades should travel with him');
};
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="school_groups"
    htmlSource=school_groups_example
    height=45
    cssSource=school_groups_css
    notes=notes_school_groups
    demoValue=school_groups_demoValue
    selected="preview"
    showEditor=true
    tests=school_groups_tests
%}



### Deeply nested forms

Despite of usability concerns, there is no limit in form nesting depth.

In fact, all examples in this chapter are entirely built with SmarkForm itself
**with no additional JS code**.

🚀 Including the *JSON playground editor* and the `⬇️ Export`, `⬆️ Import`, `♻️
Reset` and `❌ Clear` buttons are just *SmarkForm* trigger components that work
out of the box.

🤔 ...it's just that part is omitted in the shown HTML source to keep the
examples simple and focused on the subject they are intended to illustrate.

The editor scaffold (Export / Import / Reset / Clear buttons + the JSON
textarea) is injected externally by the documentation framework. It is **not**
part of the example HTML — so what you see in the HTML tab is exactly the code
you would write yourself.

🕵️ If you go to any of the interactive examples in this page (or in the rest of
the documentation) and check the `📝 Edit` checkbox, you'll be editing the real
example source code. Check the `📋 Include playground editor` checkbox to also
show the editor scaffold in the preview (it is injected externally and is not
part of the example HTML).


  * If you look close to the HTML source, you will see that `⬆️ Import` and
    `⬇️ Export` buttons import/export the whole form or individual fields
     from/to a *textarea* field called *editor*.

  * ...And if you look at its *JS* tab you'll see that in most of them **there
    is no JavaScript code except for the SmarkForm instantiation** itself.

{: .info :}
> 👉 **The whole *SmarkForm* form is a field of the type *form***
> that imports/exports JSON and 🚀  **they can be nested up to any depth**.
>
>   * The `⬇️ Export`, `⬆️ Import` and `❌ Clear` buttons are *trigger* components that perform
>     specialized actions (look at the *HTML* tab to see how...). 🚀 **No
>     JavaScript wiring is needed**.



{: .hint :}
> In the [Import and Export Data](#import-and-export-data) section we'll go
> deeper into the *import* and *export* actions and how to get the most of
> them.




### More on lists

*SmarkForm*'s lists are incredibly powerful and flexible. They can be used to
create complex data structures, such as schedules, inventories, or any other
repeating data structure.

To begin with, another interesting use case for lists is to create a schedule
list like the following example:

{: .hint :}
> The `➖` and `➕` buttons in the examples below use *hotkeys*. Press and hold
> the `Ctrl` key to see which ones are available. Check the *CSS* tab to see
> the reveal setup, or jump to [Context-Driven Keyboard
> Shortcuts](#context-driven-keyboard-shortcuts-hot-keys) to learn more.

{% raw %} <!-- hotkeys_reveal_css {{{ --> {% endraw %}
{% capture hotkeys_reveal_css -%}
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
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- schedule_list {{{ --> {% endraw %}
{% capture schedule_list -%}
<div id="myForm$$">
    <p>
        <button data-smark='{"action":"removeItem","hotkey":"-","context":"schedule"}' title='Less intervals'>➖</button>
        <button data-smark='{"action":"addItem","hotkey":"+","context":"schedule"}' title='More intrevals'>➕</button>
        <strong data-smark="label">Schedule:</strong>
        <span data-smark='{"type":"list","name":"schedule","min_items":0,"max_items":3,"exportEmpties":true}'>
            <span>
                <input class='small' data-smark type='time' name='start'> to <input class='small' data-smark type='time' name='end'>
            </span>
            <span data-smark='{"role":"empty_list"}'>(Closed)</span>
            <span data-smark='{"role":"separator"}'>, </span>
            <span data-smark='{"role":"last_separator"}'> and </span>
        </span>
    </p>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes -%}
👉 Here we opted for a different layout.
  * Usually lists are laid out with single HTML node inside which plays the
    role of a template for every item in the list.
  * But lists also support other templates with different roles.
  * For this example we introduced the *empty_list*, *separator* and *last_separator* roles.
    <li data-bullet="🚀">The <em>empty_list</em> role allows us to give some feedback when the list is empty.</li>
    <li data-bullet="🚀">The <em>separator</em> role allows us to separate items in the list.</li>
    <li data-bullet="🚀">The <em>last_separator</em> role allows us to specify a different separator for the last item in the list.</li>

👉 **Try it:** Remove all intervals using the `➖` button to see the *empty_list*
   message `(Closed)` appear. This prepares you for the same pattern in the
   nested example below, where removing all periods shows `🔒 Out of Service`.

👉 Limiting the number of intervals in the list let set reasonable limits.
  * A maximum of 3 intervals looks reasonable for a schedule (but it can be set
    to any number).
  * In case of not being enough, we can just increase *max_items* when needed.{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "schedule": [
        {
            "start": "09:00:00",
            "end": "13:00:00"
        },
        {
            "start": "14:00:00",
            "end": "18:00:00"
        }
    ]
}
{%- endcapture %}

{% capture schedule_list_css %}{{ hotkeys_reveal_css }}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="schedule_list"
    htmlSource=schedule_list
    height=10
    cssSource=schedule_list_css
    notes=include.notes
    selected="preview"
    demoValue=demoValue
    showEditor=true
    tests=false
%}


...This is fine for a simple case, and leaves the door open for easily
increasing the number of intervals allowed in the schedule.

But it could look kind of messy if you need to introduce several schedules that may have different number of intervals.

Let's imagine a hotel wanting to manage the scheduling of all the services it offers...

👉 We'll see how this gets implemented in the [Mixins section](#mixins) below,
where the `#scheduleRow` template makes the pattern clean and reusable.


### Mixins

The hotel scheduling example below uses a single **mixin template**
(`#scheduleRow`) instead of repeating the same `.schedule-row` markup
**four times**. With **Mixin Types**, you define
that pattern **once** inside a `<template>` element and reference it from as
many usage sites as you need.

{: .info }
> Each usage site keeps its own identity:
> * **`name`** is supplied by the placeholder, not the template — every row gets
>   its own field name and data path.
> * **`data-for` slots** — e.g. `<span data-for="label">` replaces the
>   `<span id="label">` inside the template.
> * **Option overrides** — any `data-smark` in the placeholder overrides the
>   template default (e.g. `"max_items":5` on a specific row).

The `<template>` tag also accepts optional siblings:

* **`<style>`** — injected into `<head>` exactly once, no matter how many
  times the mixin is used.
* **`<script>`** — a per-instance hook (discussed later).

{% raw %} <!-- schedule_row_tpl {{{ --> {% endraw %}
{% capture schedule_row_tpl -%}
<template id="scheduleRow">
  <div class="schedule-row"
       data-smark='{"type":"list","min_items":0,"max_items":3,"exportEmpties":false,"value":[{}]}'>
    <strong data-smark='{"role":"header"}'><span id="label">Schedule</span></strong>
    <span class='time_slot' data-smark='{"role":"empty_list"}'>(Closed)</span>
    <span class='time_slot'>
      <span class='time_from'>From <input class='small' data-smark type='time' name='start'></span>
      <span class='time_to'>to <input class='small' data-smark type='time' name='end'></span>
    </span>
    <span data-smark='{"role":"footer"}'>
      <button data-smark='{"action":"removeItem","hotkey":"-"}' title="Less intervals">➖</button>
      <button data-smark='{"action":"addItem","hotkey":"+"}' title="More intervals">➕</button>
    </span>
  </div>
  <style>
    .schtbl {
      display: flex; flex-direction: column; gap: 0.1em;
    }
    .schedule-row {
      display: grid;
      grid-template-columns: 10em 1fr auto;
      align-items: start;
      gap: 0.25em 0.5em;
      padding: 0.2em 0.4em;
      border-radius: 0.3em;
    }
    .schedule-row:nth-child(even) {
      background-color: rgba(128, 128, 128, 0.08);
    }
    .schedule-row > [data-role="header"] {
      grid-column: 1; grid-row: 1;
      padding-top: 0.3em;
    }
    .schedule-row > .time_slot    { grid-column: 2; }
    .schedule-row > [data-role="empty_list"] { padding-right: 5em; }
    .schedule-row > [data-role="footer"] {
      grid-column: 3; grid-row: 1 / -1; align-self: center; white-space: nowrap;
    }
    .time_slot {
      display: flex; flex-wrap: wrap; gap: .15em .4em; align-items: center;
      justify-content: flex-end;
    }
    .time_slot input.small { max-width: 5.5em; }
    .time_from, .time_to { display: flex; align-items: center; gap: .2em; white-space: nowrap; }
    @media (max-width: 30em) {
      .schedule-row { grid-template-columns: 1fr auto; }
      .schedule-row > .time_slot,
      .schedule-row > [data-role="empty_list"] {
        grid-column: 1; padding-left: 0.5em; text-align: right;
      }
      .schedule-row > [data-role="footer"] { grid-column: 2; grid-row: 2 / -1; }
    }
  </style>
</template>
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- schedule_row_form {{{ --> {% endraw %}
{% capture schedule_row_form -%}
█<div class="schtbl" data-smark='{"type":"form","name":"schedules"}'>
█  <div data-smark='{"type":"#scheduleRow","name":"rcpt_schedule"}'>
█    <span data-for="label">🛎️ Reception:</span></div>
█  <div data-smark='{"type":"#scheduleRow","name":"bar_schedule"}'>
█    <span data-for="label">🍸 Bar:</span></div>
█  <div data-smark='{"type":"#scheduleRow","name":"restaurant_schedule"}'>
█    <span data-for="label">🍽️ Restaurant:</span></div>
█  <div data-smark='{"type":"#scheduleRow","name":"pool_schedule"}'>
█    <span data-for="label">🏊 Pool:</span></div>
█</div>
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- schedule_mixin_html {{{ --> {% endraw %}
{% capture schedule_mixin_html -%}
<div id="myForm$$">
  <div class="schtbl" data-smark='{"type":"form","name":"schedules"}'>
    <div data-smark='{"type":"#scheduleRow","name":"rcpt_schedule"}'>
      <span data-for="label">🛎️ Reception:</span></div>
    <div data-smark='{"type":"#scheduleRow","name":"bar_schedule"}'>
      <span data-for="label">🍸 Bar:</span></div>
    <div data-smark='{"type":"#scheduleRow","name":"restaurant_schedule"}'>
      <span data-for="label">🍽️ Restaurant:</span></div>
    <div data-smark='{"type":"#scheduleRow","name":"pool_schedule"}'>
      <span data-for="label">🏊 Pool:</span></div>
  </div>
</div>
{{ schedule_row_tpl }}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- schedule_table_css {{{ --> {% endraw %}
{% capture schedule_table_css -%}

{{""}}#myForm$$ .schtbl {
    display: flex;
    flex-direction: column;
    gap: 0.1em;
}
{{""}}#myForm$$ .schedule-row {
    display: grid;
    grid-template-columns: 10em 1fr auto;
    align-items: start;
    gap: 0.25em 0.5em;
    padding: 0.2em 0.4em;
    border-radius: 0.3em;
}
{{""}}#myForm$$ .schedule-row:nth-child(even) {
    background-color: rgba(128, 128, 128, 0.08);
}
{{""}}#myForm$$ .schedule-row > [data-role="header"] {
    grid-column: 1;
    grid-row: 1;
    padding-top: 0.3em;
}
{{""}}#myForm$$ .schedule-row > .time_slot {
    grid-column: 2;
}
{{""}}#myForm$$ .schedule-row > [data-role="empty_list"] {
    padding-right: 5em;
}
{{""}}#myForm$$ .schedule-row > [data-role="footer"] {
    grid-column: 3;
    grid-row: 1 / -1;
    align-self: center;
    white-space: nowrap;
}
{{""}}#myForm$$ .time_slot {
    display: flex;
    flex-wrap: wrap;
    gap: 0.15em 0.4em;
    align-items: center;
    justify-content: flex-end;
}
{{""}}#myForm$$ .time_slot input.small{
    max-width: 5.5em;
}
{{""}}#myForm$$ .time_from,
{{""}}#myForm$$ .time_to {
    display: flex;
    align-items: center;
    gap: 0.2em;
    white-space: nowrap;
}
{{""}}#myForm$$ .period-dates {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25em 1.5em;
    align-items: baseline;
    margin: 0.3em 0;
    justify-content: flex-end;
}
{{""}}#myForm$$ .period-date {
    white-space: nowrap;
}
{{""}}@media (max-width: 30em) {
{{""}}  #myForm$$ .schedule-row {
{{""}}      grid-template-columns: 1fr auto;
{{""}}  }
{{""}}  #myForm$$ .schedule-row > [data-role="header"] {
{{""}}      grid-column: 1;
{{""}}      grid-row: 1;
{{""}}      padding-top: 0;
{{""}}  }
{{""}}  #myForm$$ .schedule-row > .time_slot,
{{""}}  #myForm$$ .schedule-row > [data-role="empty_list"] {
{{""}}      grid-column: 1;
{{""}}      padding-left: 0.5em;
{{""}}      text-align: right;
{{""}}  }
{{""}}  #myForm$$ .schedule-row > [data-role="footer"] {
{{""}}      grid-column: 2;
{{""}}      grid-row: 2 / -1;
{{""}}  }
{{""}}}
{{ hotkeys_reveal_css }}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes -%}
👉 Here we replaced the original `<table>` layout with CSS grid to prevent
  horizontal scrollbars when multiple intervals are added:
  * Each schedule list (`.schedule-row`) is a CSS grid with three columns:
    `10em label | 1fr slots | auto controls`.
  * Additional intervals stack **vertically** in the middle column instead of
    widening the row.
  * The footer role holds the ➖/➕ buttons, which span all slot rows via
    `grid-row: 1 / -1` so they stay right-aligned regardless of item count.

👉 The `header`, `footer` and `empty_list` *template roles* are still used, but
the `placeholder` had been removed since the grid handles column sizing without
needing DOM filler elements.

{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "schedules": {
        "rcpt_schedule": [
            {
                "start": "00:00:00",
                "end": "23:59:00"
            }
        ],
        "bar_schedule": [
            {
                "start": "11:00:00",
                "end": "23:00:00"
            }
        ],
        "restaurant_schedule": [
            {
                "start": "07:30:00",
                "end": "10:30:00"
            },
            {
                "start": "13:00:00",
                "end": "15:30:00"
            },
            {
                "start": "19:00:00",
                "end": "22:00:00"
            }
        ],
        "pool_schedule": [
            {
                "start": "09:00:00",
                "end": "20:00:00"
            }
        ]
    }
}
{%- endcapture %}

{: .hint }
> Press and hold `Ctrl` to reveal the available hotkeys on the corresponding ➖
> / ➕ buttons depending on where the focus is.

{% include components/sampletabs_tpl.md
    formId="schedule_table"
    htmlSource=schedule_mixin_html
    height=40
    cssSource=schedule_table_css
    notes=notes
    selected="preview"
    demoValue=demoValue
    showEditor=true
    tests=false
%}

{: .info }
> **Want to learn more about mixins?** See the full reference in
> [Mixin Types]({{ "/advanced_concepts/mixin_types" | relative_url }}).


### Nested lists and forms


Great! Now we have all the scheduling information of or hotel services.

...or maybe not:

Some services may have different schedules for different days of the week or
depending on the season (think in the swimming pool in winter...).

Since we can make lists of forms, we can also nest more forms and lists inside
every list item and so forth to any depth.

👉 Let's focus on the seasons by now:

{% raw %} <!-- period_item_tpl {{{ --> {% endraw %}
{% capture period_item_tpl -%}
<template id="periodItem">
  <fieldset data-smark='{"type":"form","exportEmpties":true}' style='margin-top: 1em'>
    <legend>Period
      <span data-smark='{"action":"position"}'>N</span>
      of
      <span data-smark='{"action":"count"}'>M</span>
    </legend>
    <button
      data-smark='{"action":"addItem","source":".-1","hotkey":"d"}'
      title='Duplicate this period'
      style="float: right"
    >✨</button>
    <button
      data-smark='{"action":"removeItem","hotkey":"-"}'
      title='Remove this period'
      style="float: right"
    >➖</button>
    <p class='period-dates'>
      <span class='period-date'><label data-smark>Start Date:</label>&nbsp;<input data-smark type='date' name='start_date'></span>
      <span class='period-date'><label data-smark>End Date:</label>&nbsp;<input data-smark type='date' name='end_date'></span>
    </p>
    <div class="schtbl" data-smark='{"type":"form","name":"schedules"}'>
      <div data-smark='{"type":"#scheduleRow","name":"rcpt_schedule"}'>
        <span data-for="label">🛎️ Reception:</span></div>
      <div data-smark='{"type":"#scheduleRow","name":"bar_schedule"}'>
        <span data-for="label">🍸 Bar:</span></div>
      <div data-smark='{"type":"#scheduleRow","name":"restaurant_schedule"}'>
        <span data-for="label">🍽️ Restaurant:</span></div>
      <div data-smark='{"type":"#scheduleRow","name":"pool_schedule"}'>
        <span data-for="label">🏊 Pool:</span></div>
    </div>
  </fieldset>
  <script>
    const item = this;
    item.parent.on('AfterAction_addItem', async function(ev) {
      if (!ev.data || ev.data.getPath() !== item.getPath()) return;
      const idx   = parseInt(item.getPath().split('/').pop());
      const items = await item.parent.export({ exportEmpties: true });
      const prev  = idx > 0               ? items[idx - 1] : null;
      const next  = idx < items.length - 1 ? items[idx + 1] : null;
      const fmtDate = d =>
        d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
      let startDate = null;
      if (prev?.end_date) {
        const d = new Date(prev.end_date + 'T00:00:00');
        d.setDate(d.getDate() + 1);
        startDate = fmtDate(d);
      } else if (!prev) {
        startDate = fmtDate(new Date());
      }
      let endDate = null;
      if (startDate && !next) {
        if (prev?.start_date && prev?.end_date) {
          const pStart = new Date(prev.start_date + 'T00:00:00');
          const pEnd   = new Date(prev.end_date   + 'T00:00:00');
          const nStart = new Date(startDate + 'T00:00:00');
          const pStartsFirst = pStart.getDate() === 1;
          const pEndsLast = pEnd.getDate() ===
            new Date(pEnd.getFullYear(), pEnd.getMonth() + 1, 0).getDate();
          if (pStartsFirst && pEndsLast) {
            const months = (pEnd.getFullYear() - pStart.getFullYear()) * 12 +
              (pEnd.getMonth() - pStart.getMonth()) + 1;
            endDate = fmtDate(
              new Date(nStart.getFullYear(), nStart.getMonth() + months, 0));
          } else {
            const days = Math.round((pEnd - pStart) / 86400000);
            const d = new Date(nStart);
            d.setDate(d.getDate() + days);
            endDate = fmtDate(d);
          }
        }
      } else if (startDate && next?.start_date) {
        if (next.start_date > startDate) {
          const d = new Date(next.start_date + 'T00:00:00');
          d.setDate(d.getDate() - 1);
          endDate = fmtDate(d);
        }
      }
      if (endDate && startDate && endDate < startDate) endDate = null;
      const startField = item.find('start_date');
      const endField   = item.find('end_date');
      if (startField) await startField.import(startDate, { setDefault: false });
      if (endField)   await endField.import(endDate,   { setDefault: false });
    });
  </script>
</template>
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- nested_schedule_table {{{ --> {% endraw %}
{% capture nested_schedule_table -%}
<div id="myForm$$">
  <h2>🗓️ Periods:</h2>
  <div data-smark='{"type":"list","name":"periods","sortable":true,"exportEmpties":true,"min_items":0,"value":[{}]}'>
    <fieldset data-smark='{"role":"empty_list"}' style='text-align: center'>🔒 Out of Service</fieldset>
    <div data-smark='{"type":"#periodItem"}'></div>
  </div>
  <button
    data-smark='{"action":"addItem","context":"periods","hotkey":"+"}'
    style="float: right; margin-top: 1em"
  >➕ Add Period</button>
</div>
{{ period_item_tpl }}
{{ schedule_row_tpl }}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- nested_schedule_notes {{{ --> {% endraw %}
{% capture nested_schedule_notes -%}

👉 **Two templates, one example:**
  * `#scheduleRow` (inner) — the time-interval list template.
  * `#periodItem` (outer) — wraps the whole period fieldset and uses
    `#scheduleRow` inside it, demonstrating mixin composition.

👉 **Smart date prefill (the `<script>` in `#periodItem`):**
  * Registers an `AfterAction_addItem` listener that fires **after** the
    `source:".-1"` import, so it always operates on the final data.
  * Computes `start_date` and `end_date` based on siblings:

| Situation | `start_date` | `end_date` |
|---|---|---|
| No previous period | today | blank |
| Has previous (no end_date) | blank | blank |
| Has previous, no next | prev.end + 1 day | start + same duration as prev |
| Inserted — gap exists | prev.end + 1 day | next.start − 1 day |
| Inserted — contiguous | prev.end + 1 day | blank (user decides) |

  * `end_date` is cleared whenever it would predate `start_date`.

👉 **Empty-list message.** Remove all periods to see `🔒 Out of Service`.

👉 **Sortable periods.** Drag and drop to reorder.

{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "periods": [
        {
            "start_date": "2025-01-01",
            "end_date": "2025-06-30",
            "schedules": {
                "rcpt_schedule": [
                    {"start": "00:00:00", "end": "23:59:00"}
                ],
                "bar_schedule": [
                    {"start": "10:00:00", "end": "23:30:00"}
                ],
                "restaurant_schedule": [
                    {"start": "07:30:00", "end": "10:30:00"},
                    {"start": "13:00:00", "end": "15:30:00"},
                    {"start": "19:00:00", "end": "22:00:00"}
                ],
                "pool_schedule": []
            }
        },
        {
            "start_date": "2025-07-01",
            "end_date": "2025-12-31",
            "schedules": {
                "rcpt_schedule": [
                    {"start": "00:00:00", "end": "23:59:00"}
                ],
                "bar_schedule": [
                    {"start": "10:00:00", "end": "23:30:00"}
                ],
                "restaurant_schedule": [
                    {"start": "07:30:00", "end": "10:30:00"},
                    {"start": "13:00:00", "end": "15:30:00"},
                    {"start": "19:00:00", "end": "22:00:00"}
                ],
                "pool_schedule": [
                    {"start": "09:30:00", "end": "19:30:00"}
                ]
            }
        }
    ]
}
{%- endcapture %}

{% raw %} <!-- nested_schedule_tests {{{ --> {% endraw %}
{% capture nested_schedule_tests -%}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    const countPeriods = async () => (await readField('/periods')).length;
    const removePeriodBtn = page.getByTitle('Remove this period').nth(0);
    const duplicatePeriodBtn = page.getByRole('button', { name: '✨' }).nth(0);

    // Import known state
    await page.evaluate(async () => {
        await myForm.import({
            periods: [
                { start_date: "2025-04-01", end_date: "2025-09-30",
                  schedules: {
                    rcpt_schedule: [{start:"07:00:00",end:"23:00:00"}],
                    bar_schedule: [{start:"10:00:00",end:"23:00:00"}],
                    restaurant_schedule: [{start:"07:00:00",end:"10:30:00"},{start:"13:00:00",end:"15:30:00"},{start:"19:00:00",end:"22:00:00"}],
                    pool_schedule: [{start:"09:00:00",end:"20:00:00"}],
                  } },
            ],
        });
    });

    expect(await countPeriods()).toBe(1);

    // Duplicate the period
    await duplicatePeriodBtn.click();
    await page.waitForTimeout(500);
    expect(await countPeriods()).toBe(2);

    // Remove all periods to show empty-list message
    await removePeriodBtn.click();
    await removePeriodBtn.click();
    await expect(root).toHaveText(/Out of Service/);
};
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="nested_schedule_table"
    htmlSource=nested_schedule_table
    height=50
    cssSource=schedule_table_css
    notes=nested_schedule_notes
    selected="preview"
    demoValue=demoValue
    showEditor=true
    smarkformOptions='{"allowLocalMixinScripts":"allow"}'
    tests=nested_schedule_tests
%}

⚡ There is no theoretical limit to the depth of nesting beyond the logical
usability concerns.

{: .hint }
> `<script>` hooks inside mixin templates are a powerful way to add
> component-specific behavior.
> 
> Within them, `this` refers to the individual mixin instance, allowing you to listen to
> events and manipulate data at the item level, without affecting other instances of the same mixin.
> 
> The former example uses this feature to implement smart date prefill logic
> that considers the position of the new period and its siblings to suggest
> appropriate start and end dates, streamlining the user experience when adding
> new periods.
> 
> 🚀 **Let's try it!**



### Item duplication and closure state

Adding similar items to a list of complex and configurable subforms —like the
periods list in our example— can be tedious if users have to re-enter all
fields each time.

The previous example already includes a **duplicate** (`✨`) button that uses
`source:".-1"` to prefill a new item with data copied from the previous one.
It also sets `min_items:0` with `value:[{}]` so the list starts with one empty
item (good UX) yet can be emptied entirely, at which point the `🔒 Out of Service`
message (the `empty_list` role) is shown.

These techniques work together:

  * **`source:".-1"`** on an `addItem` trigger — the new item receives the
    previous item's data immediately after render.
  * **`min_items:0`** — allows the list to be fully emptied.
  * **`value:[{}]`** — ensures one empty item appears by default even with
    `min_items:0`, so users are never greeted with a blank list.
  * **`empty_list` role** — provides feedback when the list has no items.


### A note on empty values

Take a look to the HTML source of the previous example and pay attention to
where and how the *exportEntries* property is used in the lists:

  * **For the *periods* list** we set *exportEmpties* to true, overidding its
    default value (false).
    - This way, if a period is added (intentional), it gets exported even if
      not filled.
    - This is because the user may be saving his work to continue later or just
      mean there is a period but we don't know its data yet.

  * **For the schedules lists** we set *exportEmpties* to false (necessary to
    prevent inheriting the true value we just set). This way:
    - When a period is added, all schedules are layed out with their default
      value (one empty time interval ready to be filled).
    - If the user leaves any unfilled (because of being inappropriate) and
      neglects removing it, it will be just swallowed when exporting the form
      data.
    - This way, when importing the exported data (or if item is duplicated with
      the `✨` button), the unfilled intervals are correctly shown as
      "(Closed)".


### Nesting Mixins

The [nested periods example](#nested-lists-and-forms) already combines **two
mixins**: `#periodItem` (the outer one, wrapping the period fieldset)
references `#scheduleRow` (the inner one, providing the time-interval grid).
The `<style>` from `#scheduleRow` is injected **once** into `<head>`
regardless of how many times either mixin is used — mixin styles are shared,
not duplicated.

Looking at that example's HTML source you can see both templates defined side
by side: `#scheduleRow` is the inner list template; `#periodItem` is the outer
component that uses it. Extract any repeated piece of UI into a similar
template and reference it with `type: "#yourTemplateName"`.

## Import and Export Data

Exporting and importing data in SmarkForm cannot be easier.

The `⬇️ Export`, `⬆️ Import` and `❌ Clear` buttons used in all examples in
this documentation are just *triggers* that call the *export* and *import*
actions on the whole form **(their *context*)**:

  * `⬇️ Export` exports the whole form to the "editor" textarea **(its target)**.
  * `⬆️ Import` imports the JSON data from the "editor" textarea into the form **(its target)**.
  * `❌ Clear` clears the whole form **(its context)**.

{: .hint :}
> The editor scaffold (Export/Import/Reset/Clear buttons + textarea) is
> injected externally by the documentation framework — it is **not** part of
> the example HTML source. You can see this by checking `📝 Edit` on any
> example; the source tabs show only the real example code.


### Intercepting the *import* and *export* events

Below these lines you can see **the exact same form** with additional `💾 Save`
and `📂 Load` buttons.

They are *export* and *import* triggers, but placed outside of any subform so
that their natural context is the whole form.

In the *JS* tab there is a simple JavaScript code that:

  * Intercepts the *onAfterAction_export* and *onBeforeAction_import* events.
  * Shows the JSON of the whole form in a `window.alert(...)` window in the
    case of *export* (💾) action.
  * Prompts with a `window.prompt(...)` dialog for JSON data to import into the
    whole form.

{% raw %} <!-- nested_forms_with_load_save {{{ --> {% endraw %}
{% capture nested_forms_with_load_save -%}
<div id="myForm$$">
{{ nested_forms }}
    <div style="display: flex; justify-content: space-evenly; margin-top: 0.5em">
        <button
            data-smark='{"action":"export"}'
            title="Export the whole form as JSON (see JS tab)"
            >💾 Save</button>
        <button
            data-smark='{"action":"import"}'
            title="Import the whole form as JSON (see JS tab)"
            >📂 Load</button>
    </div>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- submit_form_example {{{ --> {% endraw %}
{% capture submit_form_example -%}
<form id="myForm$$"
  action="mailto:you@example.com?subject=Contact%20Form%20Submission"
  method="post"
  enctype="text/plain"
>
  <p>
    <label data-smark>Abstract</label>
    <input data-smark type="text"
      name="name"
      placeholder="Brief summary or description"
    />
  </p>
  <p>
    <label data-smark>Reason for contacting us:</label>
    <select data-smark name="reason" required>
      <option value="" disabled selected>— Choose —</option>
      <option value="question">Question</option>
      <option value="support">Support / Technical help</option>
      <option value="feedback">Suggestion or feedback</option>
      <option value="complaint">Complaint</option>
      <option value="praise">Praise / Thank you</option>
      <option value="business">Business / Sales inquiry</option>
      <option value="other">Something else</option>
    </select>
  </p>
  <p>
    <label data-smark>Message:</label>
    <textarea data-smark name="message"></textarea>
  </p>
  <p>
    <button data-smark='{"action":"submit"}'>📧 Send Email</button>
  </p>
</form>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- submit_form_example_notes {{{ --> {% endraw %}
{% capture submit_form_example_notes -%}
👉 Clicking **📧 Send Email** opens the user's email client with:

  * **To:** `test@example.com`
  * **Subject:** `Contact Form Submission`
  * **Body:** the Text-encoded form fields.

✏️ **To use a real address:**
  * Head to the `🗒️ HTML` tab and check the 📝 checkbox.
  * Edit the email in the `action` attribute of the `<form>` element.
  * Click the `▶️ Run` button to reload the `👁️ Preview` tab with the updated code.
  * Fill the form and click the **📧 Send Email** button.

🌐 **To submit to an HTTP endpoint** instead, point `action` at your server URL
and propperly adjust the `method` attribute.

📦 **For JSON APIs**, additionally set `enctype="application/json"` — SmarkForm
will send the data as a JSON payload via `fetch()`.

{: .warning :}
> `enctype="application/json"` is **not** compatible with `mailto:` actions.
> Use the default (URL-encoded) encoding for `mailto:`.

{: .info :}
> You can also intercept or extend the submission via *SmarkForm* events:
> `BeforeAction_submit` (fired before sending — you can `preventDefault()` to
> cancel) and `AfterAction_submit` (fired after the data has been sent).
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="submit_form"
    htmlSource=submit_form_example
    notes=submit_form_example_notes
    selected="preview"
    tests=false
%}

### A note on context of the triggers

As we have seen in the previous examples:

   * We can use the *export* and *import* actions to export/import data from/to
     any *context*: The whole form, any of its subforms or even a single field.

   * That *context* is, by default, determined by the place where the
     *trigger* is placed in the DOM tree, but it can be explicitly set by the
     *context* property of the *trigger* component.

   * We can use the *target* property to set the destination/source of that
     data or intercept the *afterAction_export* and *beforeAction_import* events
     to programatically handle the data.


{: .info :}
> For the sake of simplicity, from now on, we'll stick to the layout of the
> very first example (`⬇️ Export`, `⬆️ Import` and `❌ Clear` buttons
> targetting the "editor" textarea) that doesn't need any additional JS code.
> 
> That part of the layout will also be omitted in the HTML source since we've
> already know how it works.


👌 If you want a clearer example on how the context affect the triggers, take a
look to the following example:

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes -%}
👉 Notice that **all *Import* and *Export* buttons (triggers) are handled
by the same event handlers** (for "BeforeAction_import" and
"AfterAction_export", respectively).

👉 **All *Import* and *Export* buttons (triggers) belong to different
*SmarkForm* fields** determined by **(1)** where they are placed in the DOM and
**(2)** the relative path from that place pointed by the *context* property.

ℹ️  Different field types may import/export different data types (*forms*
import/export JSON while regular *inputs* import/export text --or number--).

{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- capture context_comparsion_example {{{ --> {% endraw %}
{% capture context_comparsion_example -%}
<div id="myForm$$">
    <div data-smark='{"name":"demo"}'>
        <p>
            <label data-smark>Name:</label>
            <input name='name' data-smark>
        </p>
        <p>
            <label data-smark>Surname:</label>
            <input name='surname' data-smark>
        </p>
        <table>
            <tr style="text-align:center">
                <th>Name field:</th>
                <th>Surname field:</th>
                <th>Whole Form:</th>
            </tr>
            <tr style="text-align:center">
                <td><button data-smark='{"action":"import","context":"name","target":"/editor"}'>⬆️  Import</button></td>
                <td><button data-smark='{"action":"import","context":"surname","target":"/editor"}'>⬆️  Import</button></td>
                <td><button data-smark='{"action":"import","target":"/editor"}'>⬆️  Import</button></td>
            </tr>
            <tr style="text-align:center">
                <td><button data-smark='{"action":"export","context":"name","target":"/editor"}'>⬇️  Export</button></td>
                <td><button data-smark='{"action":"export","context":"surname","target":"/editor"}'>⬇️  Export</button></td>
                <td><button data-smark='{"action":"export","target":"/editor"}'>⬇️  Export</button></td>
            </tr>
            <tr style="text-align:center">
                <td><button data-smark='{"action":"clear","context":"name"}'>❌ Clear</button></td>
                <td><button data-smark='{"action":"clear","context":"surname"}'>❌ Clear</button></td>
                <td><button data-smark='{"action":"clear"}'>❌ Clear</button></td>
            </tr>
        </table>
    </div>
    <div style="display: flex; flex-direction:column; align-items:left; gap: 1em; width: 100%">
        <textarea
            cols="20"
            placeholder="JSON playground editor"
            data-smark='{"name":"editor","type":"input"}'
            style="resize: vertical; align-self: stretch; min-height: 8em; flex-grow: 1;"
        ></textarea>
    </div>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="context_comparsion"
    htmlSource=context_comparsion_example
    notes=notes
    selected="preview"
    tests=false
%}


🚀 As you can see, the same actions can be applied to different parts of the
form just by placing the triggers in the right place or explicitly setting the
right path to the desired *context*.

👉 You can *import*, *export* or *clear* either the whole form or any of its
fields. Try exporting / exporting / clearing the whole form or individual
fields with the help of the "JSON data viewer / editor".


## Advanced UX Improvements

Finally, we'll showcase some advanced user experience improvements that SmarkForm offers, such as smart auto-enabling/disabling of controls and non-breaking unobtrusive keyboard navigation among others.

### Auto enabling or disabling of actions

As you may have already noticed, SmarkForm automatically enables or disables
actions based on the current state of the form. For example, if a list has
reached its maximum number of items specified by the *max_items* option, the
"Add Item" button will be disabled until an item is removed.

The same happen with the "Remove Item" button when the list has reached its
minimum number of items specified by *min_items*.

Let's recall our [Singleton List Example](#singleton_list_example) with just
slight modifications:

  1. Keep the *min_items* to its default value of 1, so that the list cannot be empty.
  2. Add a little CSS to make the disabled buttons more evident.

{% raw %} <!-- simple_list_autodisable {{{ --> {% endraw %}
{% capture simple_list_autodisable -%}
<div id="myForm$$">
  <button data-smark='{"action":"removeItem", "context":"phones", "target":"*", "preserve_non_empty":true}' title='Remove unused fields'>🧹</button>
  <button data-smark='{"action":"removeItem", "context":"phones", "preserve_non_empty":true}' title='Remove phone number'>➖</button>
  <button data-smark='{"action":"addItem","context":"phones"}' title='Add phone number'>➕ </button>
  <strong data-smark="label">Phones:</strong>
  <ul data-smark='{"name": "phones", "of": "input", "sortable":true, "max_items":5}'>
    <li class="row">
      <label data-smark>📞 Telephone
      <span data-smark='{"action":"position"}'>N</span>
      </label>
      <button data-smark='{"action":"removeItem"}' title='Remove this phone number'>➖</button>
      <input type="tel" data-smark>
      <button data-smark='{"action":"addItem"}' title='Insert phone number'>➕ </button>
    </li>
  </ul>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_autodisable_css {{{ --> {% endraw %}
{% capture simple_list_autodisable_css -%}
/* Hide list bullets */
{{""}}#myForm$$ ul li {
    list-style-type: none !important;
}
/* Make disabled buttons more evident: */
{{""}}#myForm$$ :disabled {
    opacity: 0.4;
}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "phones": [
        "+1 555 867 5309",
        "+1 555 234 5678"
    ]
}{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="simple_list_autodisable"
    htmlSource=simple_list_autodisable
    height=30
    cssSource=simple_list_autodisable_css
    selected="preview"
    demoValue=demoValue
    showEditor=true
    tests=false
%}

👉 Notice that the `🧹` and `➖` buttons get disabled then the list has only
one item (at the beginning or after removing enough items to reach *min_items*'
value) and the same happens with the `➕` button when the list reaches its
*max_items* limit.


### Context-Driven Keyboard Shortcuts (Hot Keys)

All *SmarkForm* triggers can be assigned a *hotkey* property to
make them accessible via keyboard shortcuts.

To trigger an action using a keyboard shortcut the user only needs to press the
*Ctrl* key and the key defined in the *hotkey* property of the trigger.

In the following example you can use the `Ctrl`+`+` and `Ctrl`+`-` combinations
to add or remove phone numbers from the list, respectively.

{% raw %} <!-- simple_list_hotkeys {{{ --> {% endraw %}
{% capture simple_list_hotkeys -%}
█<button data-smark='{"action":"removeItem", "context":"phones", "target":"*", "hotkey":"Delete", "preserve_non_empty":true}' title='Remove unused fields'>🧹</button>
█<button data-smark='{"action":"removeItem", "context":"phones", "hotkey":"-", "preserve_non_empty":true}' title='Remove phone number'>➖</button>
█<button data-smark='{"action":"addItem","context":"phones", "hotkey":"+"}' title='Add phone number'>➕ </button>
█<strong data-smark="label">Phones:</strong>
█<ul data-smark='{"name": "phones", "of": "input", "sortable":true, "max_items":5}'>
█    <li class="row">
█        <label data-smark>📞 Telephone
█        <span data-smark='{"action":"position"}'>N</span>
█        </label>
█        <button data-smark='{"action":"removeItem", "hotkey":"-"}' title='Remove this phone number'>➖</button>
█        <input type="tel" data-smark>
█        <button data-smark='{"action":"addItem", "hotkey":"+"}' title='Insert phone number'>➕ </button>
█    </li>
█</ul>{%
endcapture %}

{% capture simple_list_hotkeys_html -%}
<div id="myForm$$">
{{ simple_list_hotkeys }}
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_hotkeys_css {{{ --> {% endraw %}
{% capture simple_list_hotkeys_css -%}
{{ hotkeys_reveal_css }}
{{ simple_list_autodisable_css }}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "phones": [
        "+1 555 867 5309",
        "+1 555 234 5678"
    ]
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="simple_list_hotkeys"
    htmlSource=simple_list_hotkeys_html
    height=30
    cssSource=simple_list_hotkeys_css
    selected="preview"
    demoValue=demoValue
    showEditor=true
    tests=false
%}

### Reveal of hot keys

If you tinkered a bit with the previous example, you may have noticed that as
soon as you press the `Ctrl` key, the related hot keys are revealed beside
corresponding buttons.

🚀 This means that **the user does not need to know every hotkeys in advance**,
but can discover them on the fly by pressing the `Ctrl` key.

For instance I bet you already discovered that you can use the `Ctrl`+`Delete`
combination to activate the `🧹` button and remove all unused phone number
fields in the list.

{: .warning :}
> For this to work, **a little CSS setup is needed** to define how the hint
> will look like.
> 
> {: .info :}
> > Hotkey hints are dynamically revealed/unrevealied by setting/removing the
> > `data-hotkey` attribute in the trigger's DOM node.
>
> {: .hint :}
> > Check the *CSS* tab of the example above to see an example of how to style
> > the hot keys hints.



### Hotkeys and context

In *SmarkForm*, hotkeys are context-aware, meaning that the same hotkey can
trigger different actions depending on the context in which the focus is.

If you dug a bit into the HTML source of the previous example, you may have
noticed that the outer `➕` and `➖` buttons have the *hotkey* property set as
well but, unlike the `🧹` button, they are not announced when pressing the
`Ctrl` key.

The reason behind this is that the value of their *hotkey* property is the same
of their inner counterparts and hotkeys are discovered from the inner focused
field to the outside, **giving preference to the innermost ones in case of
conflict**.

Let's see the same example with a few additional fields outside the list:

If you focus one of them and press the `Ctrl` key, you'll see that nothing
happens. But if you navigate to any phone number in the list (for instance by
repeatedly pressing the `Tab` key) and press the `Ctrl` key, you'll see that
now the hotkeys we defined are available again.

{% raw %} <!-- simple_list_hotkeys_with_context {{{ --> {% endraw %}
{% capture simple_list_hotkeys_with_context -%}
█<p>
█    <label data-smark='{"type": "label"}'>Name:</label>
█    <input name='name' data-smark='{"type": "input"}' />
█</p>
█<p>
█    <label data-smark='{"type": "label"}'>Surname:</label>
█    <input name='surname' data-smark='{"type": "input"}' />
█</p>
{{ simple_list_hotkeys }}{%
endcapture %}

{% capture simple_list_hotkeys_with_context_html -%}
<div id="myForm$$">
{{ simple_list_hotkeys_with_context | replace: "█", "    " }}
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% capture demoValue -%}
{
    "name": "John",
    "surname": "Doe",
    "phones": [
        "+1 555 867 5309",
        "+1 555 234 5678"
    ]
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="simple_list_hotkeys_with_context"
    htmlSource=simple_list_hotkeys_with_context_html
    height=50
    cssSource=simple_list_hotkeys_css
    selected="preview"
    demoValue=demoValue
    showEditor=true
    tests=false
%}


### Collapsible sections

HTML's native `<details>` and `<summary>` elements provide a simple, accessible
way to create collapsible content — no JavaScript or special SmarkForm
properties needed. SmarkForm fields placed inside a `<details>` element work
exactly as they would anywhere else; the browser handles the show/hide toggle
natively.

A particularly useful pattern is to use `<details>` elements as **list items**,
placing an identifying field inside the `<summary>`. This way, even when an item
is collapsed, its key information remains visible so the user can quickly scan
the list.

The following example shows a contact list where each item is a `<details>`
element. The `<summary>` contains the contact's name so it is always visible,
while the full details (email and phone) are revealed on expansion:

{% raw %} <!-- collapsible_sections {{{ --> {% endraw %}
{% capture collapsible_sections -%}
<div id="myForm$$">
  <div data-smark='{"name":"contacts","type":"list","min_items":1,"exportEmpties":false}'>
    <details>
      <summary>
        <input data-smark type="text" name="fullname" placeholder="Full name">
      </summary>
      <div class="contact-details">
        <input data-smark type="email" name="email" placeholder="Email">
        <input data-smark type="tel" name="phone" placeholder="Phone">
        <button data-smark='{"action":"removeItem","failback":"clear","hotkey":"Delete"}' title="Remove">🗑</button>
      </div>
    </details>
  </div>
  <button data-smark='{"action":"addItem","context":"contacts","hotkey":"+"}'>➕ Add contact</button>
  <textarea data-smark name="notes" placeholder="Notes about this contact list"></textarea>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- collapsible_sections_css {{{ --> {% endraw %}
{% capture collapsible_sections_css -%}
{{""}}#myForm$$ {
  font-family: sans-serif;
}
{{""}}#myForm$$ details {
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 6px;
  padding: 4px 8px;
}
{{""}}#myForm$$ summary {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  list-style: none;
  user-select: none;
}
{{""}}#myForm$$ summary::before {
  content: "▶";
  font-size: .75em;
  transition: transform .15s;
  flex-shrink: 0;
}
{{""}}#myForm$$ details[open] > summary::before {
  transform: rotate(90deg);
}
{{""}}#myForm$$ summary input {
  flex: 1;
  min-width: 0;
  font-weight: bold;
  border: none;
  background: transparent;
  outline: none;
}
{{""}}#myForm$$ .contact-details {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px 0 2px 1.2em;
}
{{""}}#myForm$$ .contact-details input {
  flex: 1;
  min-width: 120px;
}
{{""}}#myForm$$ .contact-details button {
  margin-left: auto;
}
{{""}}#myForm$$ textarea[name="notes"] {
  display: block;
  width: 100%;
  min-height: 60px;
  margin-top: 8px;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
  box-sizing: border-box;
  resize: vertical;
}
{{ hotkeys_reveal_css }}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
  "contacts": [
    {"fullname":"Alice Smith","email":"alice@example.com","phone":"+1 555 100 0001"},
    {"fullname":"Bob Jones","email":"bob@example.com","phone":"+1 555 100 0002"},
    {"fullname":"Carol White","email":"carol@example.com","phone":"+1 555 100 0003"}
  ],
  "notes": ""
}{%- endcapture %}

{% raw %} <!-- collapsible_sections_tests {{{ --> {% endraw %}
{% capture collapsible_sections_tests -%}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    const formSel = `#myForm-${id}`;
    const addBtn = root.getByRole('button', { name: '➕ Add contact' });

    // Set up: ensure we have 3 contacts for navigation tests.
    // The form starts with 1 contact (min_items=1); add 2 more.
    await addBtn.click();
    await page.waitForTimeout(50);
    await addBtn.click();
    await page.waitForTimeout(50);

    // ── Issue 1: Space key in <summary> input must NOT toggle <details> ──────
    {
        // Open the first contact's <details>
        await page.evaluate(s => {
            document.querySelector(`${s} details`).open = true;
        }, formSel);

        const firstSummaryInput = root.locator('details').nth(0).locator('summary input[name="fullname"]');
        await firstSummaryInput.focus();
        await page.waitForTimeout(30); // > IME_FOCUS_AGE_MS

        // Press Space — must type a space, NOT close the <details>
        await page.keyboard.press(' ');

        const stillOpen = await page.evaluate(
            s => document.querySelector(`${s} details`).open, formSel
        );
        expect(stillOpen, 'Space key in summary input must not toggle <details>').toBe(true);
    }

    // ── Shift+Space: toggle <details> but prevent space character from being typed
    {
        // Open the first contact's <details>
        await page.evaluate(s => {
            document.querySelector(`${s} details`).open = true;
        }, formSel);

        const firstSummaryInput = root.locator('details').nth(0).locator('summary input[name="fullname"]');
        const valueBefore = await firstSummaryInput.inputValue();
        await firstSummaryInput.focus();
        await page.waitForTimeout(30);

        // Shift+Space — must toggle the <details> but NOT type a space
        await page.keyboard.press('Shift+ ');

        const nowClosed = await page.evaluate(
            s => !document.querySelector(`${s} details`).open, formSel
        );
        expect(nowClosed, 'Shift+Space must toggle (close) the <details>').toBe(true);

        const valueAfter = await firstSummaryInput.inputValue();
        expect(valueAfter, 'Shift+Space must not type a space into the input').toBe(valueBefore);
    }

    // ── Shift+Space from body field: fold + refocus to summary ───────────────
    {
        // Open the first contact's <details>
        await page.evaluate(s => {
            document.querySelector(`${s} details`).open = true;
        }, formSel);

        // Focus a field that is inside the body (not <summary>)
        const firstBodyInput = root.locator('details').nth(0).locator('input[name="email"]');
        await firstBodyInput.focus();
        await page.waitForTimeout(30);

        // Shift+Space from the body — must fold (close) the <details>
        await page.keyboard.press('Shift+ ');

        const nowClosed = await page.evaluate(
            s => !document.querySelector(`${s} details`).open, formSel
        );
        expect(nowClosed, 'Shift+Space from body must fold (close) the <details>').toBe(true);

        // Focus must have moved to a field inside <summary> (not lost)
        const focusInSummary = await page.evaluate(s => {
            const active = document.activeElement;
            if (!active) return false;
            return !!active.closest('summary');
        }, formSel);
        expect(focusInSummary, 'Shift+Space from body must refocus a field in <summary>').toBe(true);
    }

    // ── Issue 2: Enter in closed <summary> input → navigate to next item ─────
    {
        // Close all contacts
        await page.evaluate(s => {
            for (const d of document.querySelectorAll(`${s} details`)) d.open = false;
        }, formSel);

        const firstFullname = root.locator('details').nth(0).locator('summary input[name="fullname"]');
        await firstFullname.focus();
        await page.waitForTimeout(30);

        // Enter must skip the hidden email/phone of contact[0] and go to
        // the fullname (summary input) of contact[1]
        await page.keyboard.press('Enter');

        const focusedInSecond = await page.evaluate(s => {
            const active = document.activeElement;
            if (!active) return false;
            if (!active.closest('summary')) return false;
            const details = active.closest('details');
            const allDetails = [...document.querySelectorAll(`${s} details`)];
            return allDetails.indexOf(details) === 1;
        }, formSel);

        expect(
            focusedInSecond,
            'Enter in closed summary input must skip hidden fields and go to next item\'s summary field'
        ).toBe(true);
    }

    // ── Alt+Enter: unfold closed <details> and navigate into hidden fields ────
    {
        // Close all contacts
        await page.evaluate(s => {
            for (const d of document.querySelectorAll(`${s} details`)) d.open = false;
        }, formSel);

        const firstFullname = root.locator('details').nth(0).locator('summary input[name="fullname"]');
        await firstFullname.focus();
        await page.waitForTimeout(30);

        // Alt+Enter must open the first contact's <details> and navigate
        // to the first hidden field (email) inside it
        await page.keyboard.press('Alt+Enter');

        const focusedOnEmail = await page.evaluate(s => {
            const active = document.activeElement;
            if (!active) return false;
            return active.name === 'email'
                && active.closest('details') === document.querySelector(`${s} details`);
        }, formSel);

        expect(
            focusedOnEmail,
            'Alt+Enter in closed summary must unfold the details and navigate to the first hidden field'
        ).toBe(true);

        const firstDetailOpen = await page.evaluate(
            s => document.querySelector(`${s} details`).open, formSel
        );
        expect(firstDetailOpen, 'Alt+Enter must open the closed <details>').toBe(true);
    }

    // ── Issue 3: Enter from last field of last form-type list item ────────────
    {
        // Open all contacts so the phone fields are reachable
        await page.evaluate(s => {
            for (const d of document.querySelectorAll(`${s} details`)) d.open = true;
        }, formSel);

        const lastPhone = root.locator('details').last().locator('input[name="phone"]');
        await lastPhone.focus();
        await page.waitForTimeout(30);

        // Enter must cross the list boundary and land on the notes textarea
        await page.keyboard.press('Enter');

        const focusedOnNotes = await page.evaluate(
            s => document.activeElement === document.querySelector(`${s} [name="notes"]`),
            formSel
        );

        expect(
            focusedOnNotes,
            'Enter from last field of last form-type list item must navigate to field after the list'
        ).toBe(true);
    }

    // ── Backward navigation: Shift+Enter from a field after a list/form ──────
    // All contacts are still open from the previous test.
    {
        const notesFld = root.locator('[name="notes"]');
        await notesFld.focus();
        await page.waitForTimeout(30);

        // Shift+Enter from the textarea (no Ctrl needed for backward navigation)
        await page.keyboard.press('Shift+Enter');

        // Should land on 'phone' of the last contact (last field of last item),
        // NOT on 'fullname' (which would happen if focus always dives to first child).
        const focusedOnLastPhone = await page.evaluate(s => {
            const active = document.activeElement;
            if (!active) return false;
            const details = document.querySelectorAll(`${s} details`);
            const lastDetail = details[details.length - 1];
            const phone = lastDetail?.querySelector('input[name="phone"]');
            return active === phone;
        }, formSel);

        expect(
            focusedOnLastPhone,
            'Shift+Enter from field after list must land on last field (phone) of last list item'
        ).toBe(true);
    }

    // ── Backward navigation: Shift+Enter from first field of a list item ─────
    {
        // Start on 'fullname' of contact[2] (last contact, first field)
        const lastFullname = root.locator('details').last().locator('summary input[name="fullname"]');
        await lastFullname.focus();
        await page.waitForTimeout(30);

        // Shift+Enter should cross the list item boundary and land on 'phone'
        // of the previous item (contact[1]) — the last field of that item.
        await page.keyboard.press('Shift+Enter');

        const focusedOnPrevPhone = await page.evaluate(s => {
            const active = document.activeElement;
            if (!active) return false;
            const details = document.querySelectorAll(`${s} details`);
            const secondDetail = details[1]; // contact[1]
            const phone = secondDetail?.querySelector('input[name="phone"]');
            return active === phone;
        }, formSel);

        expect(
            focusedOnPrevPhone,
            'Shift+Enter from first field of a list item must land on last field of previous item'
        ).toBe(true);
    }

    // ── Backward navigation into CLOSED (folded) items ───────────────────────
    // Shift+Enter must SKIP closed items (symmetric with forward navigation).
    // Alt+Shift+Enter must open a closed item and land on its last field.

    // Close all contacts first.
    await page.evaluate(s => {
        document.querySelectorAll(`${s} details`).forEach(d => d.open = false);
    }, formSel);
    await page.waitForTimeout(30);

    {
        // Plain Shift+Enter from notes must SKIP hidden fields and land on
        // the last visible field of the last contact (fullname, in <summary>).
        const notesFld = root.locator('[name="notes"]');
        await notesFld.focus();
        await page.waitForTimeout(30);

        await page.keyboard.press('Shift+Enter');
        await page.waitForTimeout(50);

        const result = await page.evaluate(s => {
            const active = document.activeElement;
            const details = document.querySelectorAll(`${s} details`);
            const lastDetail = details[details.length - 1];
            return {
                isOpen: lastDetail?.open,
                focusedFullname: active === lastDetail?.querySelector('summary input[name="fullname"]'),
                focusedPhone: active === lastDetail?.querySelector('input[name="phone"]'),
            };
        }, formSel);

        expect(
            result.isOpen,
            'Plain Shift+Enter must NOT open a closed <details>'
        ).toBe(false);
        expect(
            result.focusedFullname,
            'Plain Shift+Enter into a closed item must land on its last VISIBLE field (fullname in summary)'
        ).toBe(true);
        expect(
            result.focusedPhone,
            'Plain Shift+Enter into a closed item must NOT land on the hidden phone field'
        ).toBe(false);
    }

    // Close all again, then test Alt+Shift+Enter (should open and enter).
    await page.evaluate(s => {
        document.querySelectorAll(`${s} details`).forEach(d => d.open = false);
    }, formSel);
    await page.waitForTimeout(30);

    {
        // Alt+Shift+Enter from notes must OPEN the last contact and land on its
        // last field (phone).
        const notesFld = root.locator('[name="notes"]');
        await notesFld.focus();
        await page.waitForTimeout(30);

        await page.keyboard.press('Alt+Shift+Enter');
        await page.waitForTimeout(50);

        const result = await page.evaluate(s => {
            const active = document.activeElement;
            const details = document.querySelectorAll(`${s} details`);
            const lastDetail = details[details.length - 1];
            return {
                isOpen: lastDetail?.open,
                focusedPhone: active === lastDetail?.querySelector('input[name="phone"]'),
            };
        }, formSel);

        expect(
            result.isOpen,
            'Alt+Shift+Enter into a closed item must open its <details>'
        ).toBe(true);
        expect(
            result.focusedPhone,
            'Alt+Shift+Enter into a closed item must land on its last field (phone)'
        ).toBe(true);
    }

    // Close all again, then test crossing item boundary with plain Shift+Enter.
    await page.evaluate(s => {
        document.querySelectorAll(`${s} details`).forEach(d => d.open = false);
    }, formSel);
    await page.waitForTimeout(30);

    {
        // Open last contact just enough to focus its fullname (in <summary>).
        // Plain Shift+Enter must cross the item boundary and land on the last
        // VISIBLE field of the middle contact (fullname in <summary>), NOT open it.
        const lastDetails = root.locator('details').last();
        await page.evaluate(s => {
            const details = document.querySelectorAll(`${s} details`);
            details[details.length - 1].open = true;
        }, formSel);
        await page.waitForTimeout(30);

        const lastFullname = lastDetails.locator('summary input[name="fullname"]');
        await lastFullname.focus();
        await page.waitForTimeout(30);

        await page.keyboard.press('Shift+Enter');
        await page.waitForTimeout(50);

        const result = await page.evaluate(s => {
            const active = document.activeElement;
            const details = document.querySelectorAll(`${s} details`);
            const middleDetail = details[1]; // contact[1]
            return {
                isOpen: middleDetail?.open,
                focusedFullname: active === middleDetail?.querySelector('summary input[name="fullname"]'),
                focusedPhone: active === middleDetail?.querySelector('input[name="phone"]'),
            };
        }, formSel);

        expect(
            result.isOpen,
            'Plain Shift+Enter crossing to a closed previous item must NOT open it'
        ).toBe(false);
        expect(
            result.focusedFullname,
            'Plain Shift+Enter crossing to a closed previous item must land on its last visible field (fullname)'
        ).toBe(true);
        expect(
            result.focusedPhone,
            'Plain Shift+Enter crossing to a closed previous item must NOT focus hidden phone'
        ).toBe(false);
    }

    // Close all again, then test crossing boundary with Alt+Shift+Enter.
    await page.evaluate(s => {
        document.querySelectorAll(`${s} details`).forEach(d => d.open = false);
    }, formSel);
    await page.waitForTimeout(30);

    {
        // Open last contact, focus fullname.  Alt+Shift+Enter must open the
        // middle contact and land on its last field (phone).
        const lastDetails = root.locator('details').last();
        await page.evaluate(s => {
            const details = document.querySelectorAll(`${s} details`);
            details[details.length - 1].open = true;
        }, formSel);
        await page.waitForTimeout(30);

        const lastFullname = lastDetails.locator('summary input[name="fullname"]');
        await lastFullname.focus();
        await page.waitForTimeout(30);

        await page.keyboard.press('Alt+Shift+Enter');
        await page.waitForTimeout(50);

        const result = await page.evaluate(s => {
            const active = document.activeElement;
            const details = document.querySelectorAll(`${s} details`);
            const middleDetail = details[1]; // contact[1]
            return {
                isOpen: middleDetail?.open,
                focusedPhone: active === middleDetail?.querySelector('input[name="phone"]'),
            };
        }, formSel);

        expect(
            result.isOpen,
            'Alt+Shift+Enter crossing to a closed previous item must open it'
        ).toBe(true);
        expect(
            result.focusedPhone,
            'Alt+Shift+Enter crossing to a closed previous item must land on its last field (phone)'
        ).toBe(true);
    }
};
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="collapsible_sections"
    htmlSource=collapsible_sections
    height=65
    cssSource=collapsible_sections_css
    selected="preview"
    demoValue=demoValue
    showEditor=true
    tests=collapsible_sections_tests
%}

👉 Notice that clicking a contact's name row (or the arrow at the left)
toggles it. The name input inside `<summary>` is always visible and editable
regardless of the collapsed/expanded state.

{: .info :}
> The same technique works for any form section, not just list items. Wrap a
> `<div data-smark>` or `<fieldset data-smark>` in a `<details>` element and
> add a `<summary>` heading — no SmarkForm-specific options needed. The
> `open` attribute on `<details>` controls the initial state: include it to
> start expanded (the default), or omit it to start collapsed.


### Smooth navigation

As you may have already noticed in the preceding examples, *SmarkForm* provides
an intuitive interface to facilitate users effortlessly discover how to
fluently fill all the data in the form without bothering with the interface.

👉 Notice you can navigate smoothly between form fields by typing `Enter`
(forward) and `Shift`+`Enter` (backward).

So, when you finish filling a field, you can just press `Enter` to
move to the next one.

This is not only more convenient than `Tab` and `Shift`+`Tab`. More than that:
**it skips controls providing a more fluid experience** when you are just
filling data in.

{: .info :}
> In case of a textarea, use `Ctrl`+`Enter` instead, since `Enter` alone is
> used to insert a new line in the text.

Take a look to the `📝 Notes` tab of the previous example for more interesting
insights and tips.

👉 Last but not least, if you still prefer using `Tab` and `Shift`+`Tab`, in the
previous example you may have noticed that you can navigate through the outer
`🧹`, `➕` and `➖` buttons using the `Tab` key, but you cannot navigate to the
inner `➖` and `➕` buttons in every list item.

This is automatically handled by *SmarkForm* to improve User Experience:

  * Passing through all `➖` and `➕` buttons in every list item would
    have made it hard to navigate through the list.

  * *SmarkForm* detects that they have a *hotkey* defined and take them out of
    the navigation flow since the user only needs to press the `Ctrl` key to
    discover a handy alternative to activate them from the keyboard.

  * The outer ones, by contrast, are always kept in the navigation flow since
    they are outside of their actual context and their functionality may be
    required before having chance to bring the focus inside their context.
    - Put in other words: otherwise, with *min_items* set to 0, it would be
      impossible to create the first item without resorting to the mouse.


### 2nd level hotkeys

Let's recall the previous example with few personal data and a list of phones
and wrap it in a list to build a simple phonebook.

As we've learned, we can use "+" and "-" hotkeys to add or remove entries in
our phonebook without causing any conflict. When the user presses the `Ctrl`
key the proper hotkeys are revealed depending on the context of the current
focus.

🤔 But now let's say you filled in the last phone number in the current entry
and you want to add a new contact to the phonebook without turning to the
mouse. **You cannot reach the outer `➕` button to add a new contact because
its hotkey is the same as the inner `➕` button to add a new phone number.**

🚀 For this kind of situations, *SmarkForm* provides a *2nd level hotkey
access*:

👉 Just combine the `Alt` key with the `Ctrl` key and the hotkeys in
their nearest level will be automatically inhibited allowing those in the next
higher level to reveal.

Try it in the following example:

{% raw %} <!-- 2nd_level_hotkeys_html {{{ --> {% endraw %}
{% capture 2nd_level_hotkeys_html -%}
<div id="myForm$$">
█<div data-smark='{"type": "list", "name": "phonelist", "sortable": true}'>
█    <fieldset>
█        <legend>
█            <span data-smark='{"action":"removeItem", "hotkey":"-"}' title='Delete this phonebook entry' style='cursor:pointer'>[➖]</span>
█            <strong>
█                Contact
█                <span data-smark='{"action":"position"}'>N</span>
█            </strong>
█        </legend>{{
         simple_list_hotkeys_with_context | replace: "█", "█        "
}}█    </fieldset>
█</div>
█<p style="text-align: right; margin-top: 1em">
█    <b>Total entries:</b>
█    <span data-smark='{"action":"count", "context": "phonelist"}'>M</span>
█</p>
█<button
█    data-smark='{"action":"addItem","context":"phonelist","hotkey":"+"}'
█    style="float: right; margin-top: 1em"
█>➕ Add Contact</button>

</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- 2nd_level_hotkeys_tests {{{ --> {% endraw %}
{% capture 2nd_level_hotkeys_tests -%}
export default async ({ page, expect, id, root }) => {
    await expect(root).toBeVisible();
    
    // Check that both inputs exist
    const nameFld = page.locator('input[name="name"]');
    const surnameFld = page.locator('input[name="surname"]');
    const addPhoneBtn = page.locator('button[title="Add phone number"]');
    const editorFld = page.locator('textarea[data-smark]');
    
    await expect(nameFld).toBeVisible();
    
    // Fill name and surname fields:
    await nameFld.fill('John');
    await surnameFld.fill('Doe');

    // Add a phone field to the list (it will get ghe focus)
    await addPhoneBtn.click();

    // Fill in
    await page.keyboard.type('1234567890');

    // Use Shift+Enter to navigate back to the first phone filed
    await page.keyboard.down('Shift'); 
    await page.keyboard.press('Enter');
    await page.keyboard.up('Shift'); 

    // Fill in the first phone field
    await page.keyboard.type('0987654321');


    // Check the propper hotkey hints got revealed
    // -------------------------------------------

    // Get locators:
    const removeEmptyBtn = page.getByRole('button', { name: '🧹' }).nth(0);
    const removeLastBtn = page.getByRole('button', { name: '➖' }).nth(0);
    const appendItemBtn = page.getByRole('button', { name: '➕' }).nth(0);
    const removeItemBtn1 = page.getByRole('button', { name: '➖' }).nth(1);
    const addItemBtn1 = page.getByRole('button', { name: '➕' }).nth(1);
    const removeItemBtn2 = page.getByRole('button', { name: '➖' }).nth(2);
    const addItemBtn2 = page.getByRole('button', { name: '➕' }).nth(2);
    const addContactBtn = page.getByRole('button', { name: '➕ Add Contact' })

    // Function to read the hotkey hint content (if displayed)
    async function readHotkeyHint(locator) {
        const box = await locator.boundingBox();
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        return await page.evaluate(({x, y}) => {
            const element = document.elementFromPoint(x, y);
            const beforeStyle = window.getComputedStyle(element, '::before');
            if (beforeStyle.display === 'none' || beforeStyle.content === '') return null;
            return element.getAttribute('data-hotkey') || null;
        }, {x, y}); 
    }

    // Reveal 1st level hotkey hints by pressing and holding Control
    await page.keyboard.down('Control');

    // Check 1st level hotkey hints
    expect(await readHotkeyHint(removeEmptyBtn)).toBe('Delete');
    expect(await readHotkeyHint(removeLastBtn)).toBe(null);
    expect(await readHotkeyHint(appendItemBtn)).toBe(null);
    expect(await readHotkeyHint(addItemBtn1)).toBe('+');
    expect(await readHotkeyHint(addItemBtn2)).toBe(null);
    expect(await readHotkeyHint(removeItemBtn1)).toBe('-');
    expect(await readHotkeyHint(removeItemBtn2)).toBe(null);
    expect(await readHotkeyHint(addContactBtn)).toBe(null);

    // Reveal 2nd level hotkey hints by also pressing Alt
    await page.keyboard.down('Alt');

    expect(await readHotkeyHint(removeEmptyBtn)).toBe(null);
    expect(await readHotkeyHint(removeLastBtn)).toBe(null);
    expect(await readHotkeyHint(appendItemBtn)).toBe(null);
    expect(await readHotkeyHint(addItemBtn1)).toBe(null);
    expect(await readHotkeyHint(addItemBtn2)).toBe(null);
    expect(await readHotkeyHint(removeItemBtn1)).toBe(null);
    expect(await readHotkeyHint(removeItemBtn2)).toBe(null);
    expect(await readHotkeyHint(addContactBtn)).toBe('+');

    // Return to 1st level hotkeys by releasing Alt
    await page.keyboard.up('Alt');

    // Check hotkey hints reverted to 1st level
    expect(await readHotkeyHint(removeEmptyBtn)).toBe('Delete');
    expect(await readHotkeyHint(removeLastBtn)).toBe(null);
    expect(await readHotkeyHint(appendItemBtn)).toBe(null);
    expect(await readHotkeyHint(addItemBtn1)).toBe('+');
    expect(await readHotkeyHint(addItemBtn2)).toBe(null);
    expect(await readHotkeyHint(removeItemBtn1)).toBe('-');
    expect(await readHotkeyHint(removeItemBtn2)).toBe(null);
    expect(await readHotkeyHint(addContactBtn)).toBe(null);

    // (Here Control key is sitll hold)
   
    // Use 'Control' + '+' to add another phone field in between
    await page.keyboard.press('+');

    // Release 'Control' key (end hotkeys functionality)
    await page.keyboard.up('Control');

    // Check all hotkey revealing are gone
    expect(await readHotkeyHint(removeEmptyBtn)).toBe(null);
    expect(await readHotkeyHint(removeLastBtn)).toBe(null);
    expect(await readHotkeyHint(appendItemBtn)).toBe(null);
    expect(await readHotkeyHint(addItemBtn1)).toBe(null);
    expect(await readHotkeyHint(addItemBtn2)).toBe(null);
    expect(await readHotkeyHint(removeItemBtn1)).toBe(null);
    expect(await readHotkeyHint(removeItemBtn2)).toBe(null);
    expect(await readHotkeyHint(addContactBtn)).toBe(null);

    // Fill in the phone number
    await page.keyboard.type('1122334455');
   
    // Add another phone field to the end of the list (it will get ghe focus)
    await addPhoneBtn.click();

    // Fil in
    await page.keyboard.type('6677889900');
   
    // Export the data
    const data = await page.evaluate(async() => {
        return await myForm.export();
    });

    // Verify the exported data
    const expectedData = {
        phonelist: [
            {
                name: 'John',
                surname: 'Doe',
                phones: [
                    '0987654321',
                    '1122334455',
                    '1234567890',
                    '6677889900'
                ]
            }
        ]
    };
    expect(data).toEqual(expectedData);

};
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="2nd_level_hotkeys"
    htmlSource=2nd_level_hotkeys_html
    cssSource=simple_list_hotkeys_css
    selected="preview"
    showEditor=true
    tests=2nd_level_hotkeys_tests
%}


### Hidden actions


As we already learned, *SmarkForm* hotkeys are defined over trigger components
so, to define a hotkey to perform some action, we need to place a trigger
component that calls that action somewhere in the form.

{: .info :}
> This aligns well with the *SmarkForm* philosophy of providing a consistent
> functionality no matter the device or input method used. For instance, if you
> use a touch device, you will hardly use the keyboard, let alone a hotkey. But
> you will always be able to tap the button to perform the action.

Nevertheless there are exceptions where hotkeys can be convenient but flooding
the form with triggers for, maybe non essential, actions would make the form
cluttered more than needed.

👉 This is the case of the `➖` and `➕` buttons surrounding every phone number
field in the previous examples which allowed to cherry pick the position where
to remove or add a new phone: For small devices would be enough with the
general  `➖` and `➕` buttons that removes or adds a phone number from/to the
end of the list.

💡 In this scenario **we can use CSS to hide the triggers** while keeping them
accessible through their hotkeys.

{: .warning :}
> Keep in mind that if, [like in our examples](#reveal-of-hot-keys), you use a
> `::before` (or `::after`) pseudo-element to show the hotkey hint, you
> shouldn't use a property that completely removes it from the DOM, like
> `display: none;`, since it will also prevent the `::before` or `::after`
> pseudo-element from appearing too.
> 
> {: .hint :}
> > Better use `visibility: hidden;` or `opacity: 0;` to hide the button
> > and `width: 0px;` and/or `height: 0px;` as needed to prevent them from
> > taking space in the layout.


{% raw %} <!-- hidden_actions_css {{{ --> {% endraw %}
{% capture hidden_actions_css -%}

{{""}}#myForm$$ li.row button[data-smark] {
    visibility: hidden;
    width: 0px;
    pointer-events: none;
}
{{""}}#myForm$$ li.row button[data-smark]::before {
    visibility: visible;
}
{{ simple_list_hotkeys_css }}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="hidden_actions"
    htmlSource=2nd_level_hotkeys_html
    cssSource=hidden_actions_css
    selected="preview"
    tests=false
%}

This is just a simple trick and not any new *SmarkForm* feature, but it is
worth to mention it here since it helps to build smoother and cleaner forms.

If you try to fill the former example you'll notice that, when hitting the
`Ctrl` key, the "+" and "-" hotkey hints are shown beside the position of the,
now hidden, `➕` and `➖` buttons.

...And, at the same time, the ones still visible in the outer context will
allow touch device users to add or remove phone numbers even only to/from the
end of the list.


### Animations

*SmarkForm* is markup-agnostic and deliberately provides no built-in animation
engine — transitions are a design concern that belongs to your CSS.

The technique is straightforward: use SmarkForm's lifecycle events to add and
remove CSS classes on list items, and let CSS `transition` do the rest.

* **`afterRender`** fires after a new item's DOM node has been inserted.
  Add an initial CSS class that hides or offsets the element, then — after a
  minimal delay to let the browser paint the initial state — add a second class
  that transitions it to its final visible position.

* **`beforeUnrender`** fires before an item is removed from the DOM.
  Remove the "visible" class and return a `Promise` that resolves after the
  transition duration. *SmarkForm* awaits that promise, so the element stays in
  the document long enough for the exit animation to complete.

🚀 Because both handlers filter by `ev.context.parent?.options.type`, a single
pair of listeners covers every list in the form — including nested ones — with
no per-list wiring required.

{% raw %} <!-- capture animations_css {{{ --> {% endraw %}
{% capture animations_css -%}
.animated_item {
    transform: translateX(-100%); /* Start off-screen to the left */
    opacity: 0; /* Optional: Start invisible for smoother effect */
    /* Transition for removal effect */
    transition: 
        transform 200ms ease-out,
        opacity 200ms ease-out;
}

.animated_item.ongoing {
    transform: translateX(0); /* End at original position */
    opacity: 1; /* Optional: Fully visible */
    transition: 
        transform 200ms ease-in,
        opacity 200ms ease-in;
}

{{ hidden_actions_css }}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture animations_js {{{ --> {% endraw %}
{% capture animations_js -%}
const delay = ms=>new Promise(resolve=>setTimeout(resolve, ms));
{{""}}myForm.onAll("afterRender", async function(ev) {
    if (ev.context.parent?.options.type !== "list") return; /* Only for list items */
    const item = ev.context.targetNode;
    item.classList.add("animated_item");
    await delay(1); /* Important: Allow DOM to update */
    item.classList.add("ongoing");
});
{{""}}myForm.onAll("beforeUnrender", async function(ev) {
    if (ev.context.parent?.options.type !== "list") return; /* Only for list items */
    const item = ev.context.targetNode;
    item.classList.remove("ongoing");
    /* Await for transition to be finished before item removal: */
    await delay(150);
});
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- animations_notes {{{ --> {% endraw %}
{% capture animations_notes -%}
**Why add `animated_item` via JavaScript instead of directly in the HTML?**

If the class were baked into the template, every item would start hidden even
when JavaScript is unavailable. Adding it through the `afterRender` handler
ensures the animation only kicks in when JS is active, so the form degrades
gracefully without it.

---

**Why the 1 ms delay in `afterRender`?**

CSS transitions only fire when a property *changes* after the element is already
in the document. If both `animated_item` and `ongoing` were added in the same
task, the browser would never observe the initial hidden state and the transition
would not play. The `await delay(1)` yields control for one event-loop tick,
giving the rendering engine a chance to paint the initial state before `ongoing`
is applied.

---

**Why `await delay(150)` in `beforeUnrender`?**

*SmarkForm* awaits the return value of `beforeUnrender` handlers before
detaching the element from the DOM. By returning a promise that resolves after
150 ms (matching the CSS `transition-duration`), we keep the element visible
just long enough for the exit animation to finish.

---

**Applying this globally vs. per-list**

`myForm.onAll()` listens on *all* components in the form. The guard
`ev.context.parent?.options.type !== "list"` skips anything that is not a
direct child of a list — subforms, labels, buttons, etc. The result is that any
list added anywhere in the form hierarchy is automatically animated without
further wiring.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="animations"
    htmlSource=2nd_level_hotkeys_html
    cssSource=animations_css
    jsSource=animations_js
    selected="preview"
    notes=animations_notes
    tests=false
%}

The `afterRender` handler adds `animated_item` via JavaScript rather than
embedding it directly in the HTML template. This ensures the animation class is
only present when JavaScript is active, so the form degrades gracefully if JS is
disabled.

The `beforeUnrender` handler does the reverse: it removes `ongoing` and returns
a `Promise` delayed by 150 ms — matching the CSS transition duration — so
*SmarkForm* holds the element in the DOM while the exit animation plays out.


### Smart value coercion

*SmarkForm* automatically normalises imported values to match the expected type
and shape of each field. This keeps your forms resilient to data-model changes
and ensures that what you save is always clean and well-typed.

#### Scalar-to-array list coercion

When a *list* field receives a non-array value — a plain string, a number, or
an object — it automatically wraps it in a single-item array. This is
particularly useful for **model migrations**: if a field that used to hold a
single `email` string is upgraded to accept a list of `emails`, old saved data
continues to work without any transformation step.

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes -%}
👉 **Scalar-to-array coercion**: If you import a plain string instead of an
array, *SmarkForm* automatically places it in a single-item list.

  * Click **⬇️ Export**, change `["alice@example.com"]` to just
    `"alice@example.com"` in the JSON playground editor below, then click
    **⬆️ Import** — the single email is placed in the list automatically.
  * This mirrors the upgrade from a single-value field (e.g. `"email"`) to a
    list field (e.g. `"emails": [...] `).

👉 **Empty items are not exported** by default (controlled by `exportEmpties`).

  * Click **➕** to add a blank item, then **⬇️ Export** — the blank row will
    be absent from the output, keeping saved data clean.
  * Set `"exportEmpties": true` on the list to keep blank slots in the data
    (useful in draft-save workflows where you want to preserve the user's
    position in the list).

{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- smart_value_coercion {{{ --> {% endraw %}
{% capture smart_value_coercion -%}
<div id="myForm$$">
█<button data-smark='{"action":"removeItem","context":"email","preserve_non_empty":true}' title="Remove email">➖</button>
█<button data-smark='{"action":"addItem","context":"email"}' title="Add email">➕</button>
█<strong data-smark="label">Emails:</strong>
█<ul data-smark='{"type":"list","name":"email","of":"input","min_items":0}'>
█    <li data-smark='{"role":"empty_list"}'>(No emails on record)</li>
█    <li><input type="email" data-smark placeholder="name@example.com"></li>
█</ul>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- smart_value_coercion_css {{{ --> {% endraw %}
{% capture smart_value_coercion_css -%}
{{""}}#myForm$$ ul {
    list-style: none;
    padding-left: 0;
}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- smart_value_coercion_tests {{{ --> {% endraw %}
{% capture smart_value_coercion_tests -%}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    // Scalar-to-array coercion
    await writeField('email', 'bob@example.com');
    expect(
        await readField('email'),
        'Scalar string is coerced to a single-item array'
    ).toEqual(['bob@example.com']);

    // Array import works as expected
    await writeField('email', ['carol@example.com', 'dave@example.com']);
    expect(
        await readField('email'),
        'Array import works normally'
    ).toEqual(['carol@example.com', 'dave@example.com']);

    // exportEmpties = false: blank items are not exported
    await page.evaluate(() => myForm.find('/email').addItem());
    expect(
        await readField('email'),
        'Blank item is not exported (exportEmpties defaults to false)'
    ).toEqual(['carol@example.com', 'dave@example.com']);

    // Filling the new blank item makes it appear in the export
    const inputs = page.locator(`#myForm-${id} input[type=email]`);
    await inputs.last().fill('eve@example.com');
    expect(
        await readField('email'),
        'Filled item IS exported'
    ).toEqual(['carol@example.com', 'dave@example.com', 'eve@example.com']);
};

{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "email": "alice@example.com" // Old data saved before upgrading to an array
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="smart_value_coercion"
    htmlSource=smart_value_coercion
    cssSource=smart_value_coercion_css
    notes=notes
    selected="preview"
    showEditor=true
    demoValue=demoValue
    tests=smart_value_coercion_tests
%}


#### Type coercion for scalar fields

Fields with a specific HTML type automatically coerce values on both import and
export:

  * `<input type="number">` exports a JavaScript **number** (not a string),
    and accepts string representations on import (e.g. `"28"` → `28`).
  * `<input type="date">` exports an ISO 8601 string (`YYYY-MM-DD`), and
    accepts compact strings (`YYYYMMDD`) and `Date` objects on import.
  * `<input type="time">` exports `HH:MM:SS` and accepts `HH:MM` on import.
  * Any field exports **`null`** when empty, to explicitly signal "unknown or
    indifferent" rather than an empty string.

Adding `{"encoding":"json"}` to any `<input>` or `<textarea>` enables JSON
round-trips: the field stores the value internally as a JSON string but
*exports* it as a parsed JavaScript value (object, array, number, or `null`).

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes -%}
👉 **Number coercion**: The *Age* field is `<input type="number">`.

  * *SmarkForm* always exports its value as a JavaScript **number**, not a
    string.
  * It also accepts string representations on import — try clicking **⬇️
    Export**, changing `"age": 28` to `"age": "28"` (quoted) in the JSON
    playground editor, and clicking **⬆️ Import**: the exported result will be
    `"age": 28` (unquoted) again.

👉 **Date normalization**: The *Date of Birth* field is `<input type="date">`.

  * *SmarkForm* always exports an ISO 8601 string (`YYYY-MM-DD`).
  * It accepts compact strings (`YYYYMMDD`) and `Date` objects on import.
    Try clicking **⬇️ Export**, changing `"dob": "1996-03-15"` to
    `"dob": "19960315"` in the JSON playground editor, and clicking **⬆️
    Import** — it will be normalised to `"1996-03-15"` on the next export.

👉 **JSON encoding**: The *Metadata* textarea has `{"encoding":"json"}`.

  * On import, an object or array is serialised to JSON text (pretty-printed
    in textareas for readability).
  * On export, the textarea content is parsed back into a JavaScript value —
    your saved data contains a **real object**, not a raw JSON string.
  * Works with any valid JSON: objects, arrays, numbers, booleans, and `null`.

{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- type_coercion {{{ --> {% endraw %}
{% capture type_coercion -%}
<div id="myForm$$">
█<p>
█    <label data-smark>Name:</label>
█    <input type="text" name="name" data-smark>
█</p>
█<p>
█    <label data-smark>Age:</label>
█    <input type="number" name="age" min="0" max="150" data-smark>
█</p>
█<p>
█    <label data-smark>Date of Birth:</label>
█    <input type="date" name="dob" data-smark>
█</p>
█<p>
█    <label data-smark>Metadata (JSON):</label>
█    <textarea name="metadata" data-smark='{"encoding":"json"}'></textarea>
█</p>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- type_coercion_tests {{{ --> {% endraw %}
{% capture type_coercion_tests -%}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    // Number coercion: string input → number output
    await writeField('age', '35');
    expect(
        await readField('age'),
        'Number field coerces string to number on export'
    ).toStrictEqual(35);

    // Empty number field exports null
    await writeField('age', null);
    expect(
        await readField('age'),
        'Number field exports null when empty'
    ).toStrictEqual(null);

    // Date normalization: compact string → ISO format
    await writeField('dob', '20000101');
    expect(
        await readField('dob'),
        'Date field normalizes compact strings to ISO format'
    ).toStrictEqual('2000-01-01');

    // Empty date field exports null
    await writeField('dob', null);
    expect(
        await readField('dob'),
        'Date field exports null when empty'
    ).toStrictEqual(null);

    // JSON encoding: object round-trips through textarea
    const metaObj = { subscribed: true, tier: 'premium' };
    await writeField('metadata', metaObj);
    expect(
        await readField('metadata'),
        'JSON-encoded textarea round-trips objects correctly'
    ).toEqual(metaObj);

    // JSON encoding: null clears the textarea
    await writeField('metadata', null);
    expect(
        await readField('metadata'),
        'JSON-encoded textarea exports null when cleared'
    ).toStrictEqual(null);
};

{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "name": "Alice",
    "age": "28",  // String instead of number, will be coerced to a number
    "dob": "19960315", // Correctly parsed as date.
    "metadata": { // Will be exported/imported as JSON
                  // If invalid exports null (catch that from validation)
        "subscribed": true,
        "tier": "premium"
    }
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="type_coercion"
    htmlSource=type_coercion
    notes=notes
    selected="preview"
    showEditor=true
    demoValue=demoValue
    tests=type_coercion_tests
%}



### Dynamic Dropdown Options

{: .warning :}
> Section still under construction...

In this example, we'll illustrate how to create dropdown menus with dynamic options. This is particularly useful for forms that need to load options based on user input or external data sources.


{% include components/sampletabs_tpl.md
    formId="dynamic_dropdown"
    htmlSource=dynamic_dropdown
    selected="preview"
    tests=false
%}




## Random Examples

Here are some random examples to showcase the flexibility of SmarkForm and how
it can be used to create various types of forms or even more complex interfaces
with different functionalities.

### Simple Calculator

The following example implements a simple calculator with just single input
field and several buttons triggering the *import* action over that field with
the *data* property accordingly set.

It leverages the *singleton* pattern to avoid specifying the context for every
button. Then a very simple JavaScript code makes the rest...

{% raw %} <!-- calculator {{{ --> {% endraw %}
{% capture calculator -%}
<div id="myForm$$">
    <div class="calculator" data-smark='{"type": "input", "name": "display"}'>
        <!-- Using singleton pattern here allows us to avoid specifying the context for every button -->
        <input
            data-smark
            type="text"
            class="display"
            value="0"
            pattern="[0-9+\-*\/\(\).]+"
        >
        <div class="buttons">
            <button
                data-smark='{"action": "import", "data": "C", "hotkey": "c"}'
                class="clear"
            >C</button>
            <button
                data-smark='{"action": "import", "data": "("}'
            >(</button>
            <button
                data-smark='{"action": "import", "data": ")"}'
            >)</button>
            <button
                data-smark='{"action": "import", "data": "/", "hotkey": "/"}'
                class="operator"
            >÷</button>
            <button
                data-smark='{"action": "import", "data": "7"}'
            >7</button>
            <button
                data-smark='{"action": "import", "data": "8"}'
            >8</button>
            <button
                data-smark='{"action": "import", "data": "9"}'
            >9</button>
            <button
                data-smark='{"action": "import", "data": "*", "hotkey": "*"}'
                class="operator"
            >×</button>
            <button
                data-smark='{"action": "import", "data": "4"}'
            >4</button>
            <button
                data-smark='{"action": "import", "data": "5"}'
            >5</button>
            <button
                data-smark='{"action": "import", "data": "6"}'
            >6</button>
            <button
                data-smark='{"action": "import", "data": "-", "hotkey": "-"}'
                class="operator"
            >-</button>
            <button
                data-smark='{"action": "import", "data": "1"}'
            >1</button>
            <button
                data-smark='{"action": "import", "data": "2"}'
            >2</button>
            <button
                data-smark='{"action": "import", "data": "3"}'
            >3</button>
            <button
                data-smark='{"action": "import", "data": "+", "hotkey": "+"}'
                class="operator"
            >+</button>
            <button
                data-smark='{"action": "import", "data": "0"}'
            >0</button>
            <button
                data-smark='{"action": "import", "data": "."}'
            >.</button>
            <button
                data-smark='{"action": "import", "data": "Del"}'
            >←</button>
            <button
                data-smark='{"action": "import", "data": "=", "hotkey": "Enter"}'
                class="equals"
            >=</button>
        </div>
    </div>

</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- calculatorStyles_css {{{ --> {% endraw %}
{% capture calculatorStyles_css -%}
{{""}}#myForm$$ .calculator {
    background-color: #333;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    width: 300px;
}
{{""}}#myForm$$ .display {
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    font-size: 24px;
    text-align: right;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
{{""}}#myForm$$ .display:invalid {
    background-color: #fcc;
}
{{""}}#myForm$$ .buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
}
{{""}}#myForm$$ button {
    padding: 15px;
    font-size: 18px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #555;
    color: white;
    transition: background-color 0.2s;
}
{{""}}#myForm$$ button:hover {
    background-color: #777;
}
{{""}}#myForm$$ .operator {
    background-color: #f9a825;
}
{{""}}#myForm$$ .operator:hover {
    background-color: #ffb300;
}
{{""}}#myForm$$ .equals {
    background-color: #4caf50;
}
{{""}}#myForm$$ .equals:hover {
    background-color: #66bb6a;
}
{{""}}#myForm$$ .clear {
    background-color: #d32f2f;
}
{{""}}#myForm$$ .clear:hover {
    background-color: #ef5350;
}
{{ hotkeys_reveal_css }}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- calculator_css {{{ --> {% endraw %}
{% capture calculator_css -%}
{{ calculatorStyles_css }}
{{ hotkeys_reveal_css }}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- calculator_js {{{ --> {% endraw %}
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
});{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes -%}
👉 The code in this example is listening to all *import* actions in the whole
form.

This isn't an issue for this simple example. But if we had other fields in
the form (unless they were intended to be additional calculators) would be
affected too.

In that case, we could have attached the listener directly to the *display*
field like this:

```javascript
myForm.onRendered(()=>{
    /* Now display field is rendered */
    const display = myForm.find("/display");
    display.onLocal("BeforeAction_import", async (ev)=>{
        /* ... */
    });
});
```

👉 Using `.on()`or `.onLocal()` here is indifferent since inputs have no
children.

...But in case of forms (or lists of forms) using `.on()` would have lead to
intercept every "BeforeAcction_import" event in it **or its children** while
.onLocal() will only intercept those triggered by the form itself.  Not from
any of its descendants.

{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="calculator"
    htmlSource=calculator
    jsSource=calculator_js
    cssSource=calculator_css
    notes=notes
    selected="preview"
    tests=false
%}

{: .hint :}
> Notice that this calculator has *the power superpower* for free:
> 
> Expressions like `2**10` are valid, so you can calculate any power.

👉 A single event handler over the *onAfterAction_import* does all the magic by
intercepting the new value and appending it to the current one except for the
few special cases like `C`, `Del` and `=` where the value is handled
accordingly.

Check the *JS* tab to see the little JavaScript code that does the job.

Don't miss the *Notes* tab too for some additional insights.


👌 The best thing is that you can either use the calculator buttons or directly
type in the input field: Every time you use a button, the *import* action will
bring the focus back to the input field so you can continue typing.


### Calculator (UX improved)

The UX feeling of the previous example isn't perfect since it was intended to
be a very simple implementation.

Let's handle the keydown event too and notice the so little effort is needed to
reach a perfect UX.

{% raw %} <!-- supercalculator {{{ --> {% endraw %}
{% capture supercalculator -%}
<div id="myForm$$">
    <div class="calculator" data-smark='{"type": "input", "name": "display"}'>
        <!-- Using singleton pattern here allows us to avoid specifying the context for every button -->
        <input
            data-smark
            type="text"
            class="display"
            value="0"
            pattern="[0-9+\-*\/\(\).]+"
        >
        <div class="buttons">
            <button
                data-smark='{"action": "import", "data": "C"}'
                class="clear"
            >C</button>
            <button
                data-smark='{"action": "import", "data": "("}'
            >(</button>
            <button
                data-smark='{"action": "import", "data": ")"}'
            >)</button>
            <button
                data-smark='{"action": "import", "data": "/"}'
                class="operator"
            >÷</button>
            <button
                data-smark='{"action": "import", "data": "7"}'
            >7</button>
            <button
                data-smark='{"action": "import", "data": "8"}'
            >8</button>
            <button
                data-smark='{"action": "import", "data": "9"}'
            >9</button>
            <button
                data-smark='{"action": "import", "data": "*"}'
                class="operator"
            >×</button>
            <button
                data-smark='{"action": "import", "data": "4"}'
            >4</button>
            <button
                data-smark='{"action": "import", "data": "5"}'
            >5</button>
            <button
                data-smark='{"action": "import", "data": "6"}'
            >6</button>
            <button
                data-smark='{"action": "import", "data": "-"}'
                class="operator"
            >-</button>
            <button
                data-smark='{"action": "import", "data": "1"}'
            >1</button>
            <button
                data-smark='{"action": "import", "data": "2"}'
            >2</button>
            <button
                data-smark='{"action": "import", "data": "3"}'
            >3</button>
            <button
                data-smark='{"action": "import", "data": "+"}'
                class="operator"
            >+</button>
            <button
                data-smark='{"action": "import", "data": "0"}'
            >0</button>
            <button
                data-smark='{"action": "import", "data": "."}'
            >.</button>
            <button
                data-smark='{"action": "import", "data": "Backspace"}'
            >←</button>
            <button
                data-smark='{"action": "import", "data": "="}'
                class="equals"
            >=</button>
        </div>
    </div>

</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- supercalculator_js {{{ --> {% endraw %}
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
                return prevValue; /* Keep existing data */
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
    ev.preventDefault();
    const prevValue = await ev.context.export();
    const key = ev.originalEvent.key;
    const data = updateDisplay(prevValue, key);
    await ev.context.import(data);
});{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- supercalculator_css {{{ --> {% endraw %}
{% capture supercalculator_css -%}
{{""}}#myForm$$ .calculator input.display  {
    caret-color: transparent; /* Hide caret */
}
{{ calculatorStyles_css }}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes -%}

🕵️ It's off-topic but worth to mention the trick of doing `!!
key.match(invalidChars))` instead of `invalidChars.test(key)` is not arbitrary
since *invalidChars* is a regex with the global flag set, which makes it
suitable for 'String.replaceAll()'.

With `test()`, the internal *lastIndex* property won't be reset making it to
fail after first usage.

The `!!` bit is just stylistic to note we want to evaluate the result of
`.match()` as a boolean.

{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- supercalculator_tests {{{ --> {% endraw %}
{% capture supercalculator_tests -%}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    // Enter first number "123": click button "1", press "2" (bare key, no
    // modifier), then click "3"
    await root.getByRole('button', { name: '1' }).click();
    await page.keyboard.press('2');
    await root.getByRole('button', { name: '3' }).click();
    expect(await readField('display')).toBe('123');

    // Enter the operator: click the + button
    await root.getByRole('button', { name: '+' }).click();
    expect(await readField('display')).toBe('123+');

    // Enter second number "45": press "4" (bare key, no modifier), then click "5"
    await page.keyboard.press('4');
    await root.getByRole('button', { name: '5' }).click();
    expect(await readField('display')).toBe('123+45');

    // Evaluate by pressing Enter (keyboard without any modifier)
    await page.keyboard.press('Enter');

    // Export the form and verify the result in the display field
    const data = await page.evaluate(async () => {
        return await myForm.export();
    });
    expect(String(data.display)).toBe('168');
};
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="supercalculator"
    htmlSource=supercalculator
    jsSource=supercalculator_js
    cssSource=supercalculator_css
    notes=notes
    selected="preview"
    tests=supercalculator_tests
%}

In this example we no longer need to define hotkeys since we are directly
listening to all keydown events.

If you check the *JS* tab you'll see that we extracted the key processing logic
to a function called `updateDisplay()` that receives thwo arguments
(*prevValue* and *key*) to calculate the new value of the display.

It returns null for invalid keystrokes and can report the "Error!" condition
directly to the display (like a real calculator) since it will be cleared with
the next keystroke (no matter which event it comes from).

Then the *BeforeAction_import* event handler just calls that function and sets
the *ev.data* property with its result.

The *keydown* event handler does call the `updateDisplay()` function but:

  * It takes the key from the original keydown event.
  * Calls the `.preventDefault()` method to avoid the keystroke effectively
    reaching the display.
  * Programmatically triggers the *import* action over the display with the
    new value calculated.

{: .hint :}
> Since now all keyboard strokes are processed by to `updateDisplay()`
> function, this allows us to define handy aliases which will feel more natural
> in a PC keyboard for some keys like:
>
>   * `Enter` as an alias for `=`
>   * `Delete` as an alias for `C`
> 
>  In the case of the formerly named `Del` key, we just renamed it to
>  `Backspace` to match the real key since `Del` was just a random name to void
>  using en Emojii (←) as a key name.

We also added a little CSS rule to hide the caret in the input field since the
display will no longer be directly editable.


### Team Event Planner

This is the same demo shown on the [🔗 landing page]({{ "/" | relative_url }}) — a
compact form that showcases several SmarkForm features at once: a nested
subform, a sortable variable-length list, context-driven hotkeys, and date/time
coercion.

Use the JSON editor below to inspect the exported data as you interact with the
form, or import your own JSON to pre-populate it.

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
      <ul data-smark='{"type":"list","name":"attendees","sortable":true,"exportEmpties":false}'>
        <li>
          <details>
            <summary>
              <span data-smark='{"type":"label"}' class="bullet">
                <span data-smark='{"action":"position"}'>N</span> ☰
              </span>
              <input data-smark type="text" name="name" placeholder="Name">
              <button data-smark='{"action":"removeItem","hotkey":"-"}' title='Remove'>➖</button>
              <button data-smark='{"action":"addItem","hotkey":"+"}' title='Insert here'>➕</button>
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
{{""}}#myForm$$ .ep input[type="email"] {
    flex: 1;
}
{{""}}#myForm$$ .ep fieldset {
    border: 1px solid #ddd !important;
    border-radius: 6px;
    padding: 0.4em 0.8em 0.6em;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3em;
}
{{""}}#myForm$$ .ep fieldset legend {
    font-weight: bold;
    padding: 0 0.3em;
}
{{""}}#myForm$$ .ep-list ul {
    list-style: none !important;
    padding: 0 !important;
    margin: 0.2em 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
}
{{""}}#myForm$$ .ep-list ul li {
    display: flex;
    align-items: flex-start;
    gap: 0.3em;
}
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
{{""}}#myForm$$ .ep-attendee {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    padding: 0.3em 0.4em 0.1em 1.5em;
}
{{""}}#myForm$$ .ep-attendee input {
    flex: 1;
    min-width: 120px;
}
{{""}}#myForm$$ .ep-hint {
    font-size: 0.82em;
    color: #888;
    margin: 0.15em 0 0;
}
{{""}}#myForm$$ .ep-hint kbd {
    background: rgba(165, 165, 165, .25);
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
});{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes -%}
👉 This demo highlights several SmarkForm features at once:

  * **Foldable rows**: Each attendee row uses a native `<details>`/`<summary>`
    element. Click the ▶ triangle (or anywhere on the row header outside the
    name field and action buttons) to expand or collapse the extra fields. A
    `<span data-smark='{"type":"label"}'>` inside the `<summary>` acts as the
    SmarkForm label, making it the drag handle for reordering (shown as `☰`).
    Because the `<summary>` itself is not the label, the native disclosure
    triangle and fold/unfold on click are preserved without extra CSS
    workarounds.
  * **Nested subform**: The `organizer` fieldset is a subform — its fields are
    grouped and exported as a nested object.
  * **Sortable list**: Attendees can be dragged to reorder them. The list uses
    `exportEmpties: false` so empty slots are not exported.
  * **Context-driven hotkeys**: The `➕`/`➖` buttons inside each list item
    carry `-`/`+` hotkeys, active only when focus is within that item. The `🧹`
    button uses `Delete` as a context-wide hotkey.
  * **Date & time coercion**: The `date` and `time` inputs use SmarkForm's
    built-in type coercion — values are normalised to ISO date/time format on
    import/export.
  * **Label components**: `data-smark='label'` on non-`<label>` elements and
    bare `data-smark` on `<label>` elements wire labels to their fields
    automatically.
  * **In-form hint**: The `💡 Hold Ctrl to reveal shortcuts` text lives inside
    the form itself rather than as external documentation.
  * **Attendee animations**: Items slide in and out via `afterRender` /
    `beforeUnrender` event handlers that toggle CSS classes — no animation
    library required.

{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

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
        {"name": "Bob Smith",   "email": "bob@example.com",   "phone": "+1 555 200 0001"},
        {"name": "Carol White", "email": "carol@example.com", "phone": "+1 555 200 0002"},
        {"name": "Dave Brown",  "email": "dave@example.com",  "phone": "+1 555 200 0003"}
    ]
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="event_planner_showcase"
    htmlSource=event_planner_html
    cssSource=event_planner_css
    jsSource=event_planner_js
    notes=notes
    selected="preview"
    demoValue=demoValue
    showEditor=true
    tests=false
%}


## Conclusion

{: .warning :}
> Section still under construction...

We hope these examples have given you a good overview of what SmarkForm can do. By leveraging the power of markup-driven forms, SmarkForm simplifies the creation of interactive and intuitive forms, allowing you to focus on your application's business logic. Feel free to experiment with these examples and adapt them to suit your specific needs.

For more detailed information and documentation, please refer to the other sections of this manual. If you have any questions or need further assistance, don't hesitate to reach out to the SmarkForm community.

Happy form building!


