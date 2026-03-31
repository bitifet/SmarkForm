---
title: Validation
layout: chapter
permalink: /advanced_concepts/validation
nav_order: 7

---

{% include links.md %}

{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Overview](#overview)
* [Quick Start](#quick-start)
* [Validation Providers](#validation-providers)
    * [Provider signature](#provider-signature)
    * [Issue shape](#issue-shape)
    * [Async providers](#async-providers)
* [API Reference](#api-reference)
    * [createValidation(root, options)](#createvalidationroot-options)
    * [validation.validate(reason?)](#validationvalidatereason)
    * [validation.getState()](#validationgetstate)
    * [validation.destroy()](#validationdestroy)
* [Events](#events)
    * [ValidationStateChanged](#validationstatechanged)
    * [ValidationIssuesChanged](#validationissueschanged)
    * [BeforeValidationA11yApply](#beforevalidationa11yapply)
* [ARIA Side Effects](#aria-side-effects)
* [Blocking Export on Errors](#blocking-export-on-errors)
* [Cross-Field Validation Example](#cross-field-validation-example)
* [Custom Issue IDs](#custom-issue-ids)
* [Complete Interactive Example](#complete-interactive-example)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## Overview

SmarkForm ships with an optional, **event-driven validation plugin** that
can be attached to any `SmarkForm` root instance.  It is intentionally kept
separate from the core component types so that validation logic never
leaks into field rendering, and developers stay in full control of how
and when validation feedback is displayed to users.

Key design points:

- Listens to bubbling `change` events on the root (debounced).
- Accepts one or more **provider** functions (sync or async).
- Computes a diff between successive validation runs
  (`newIssues` / `solvedIssues` / `persistingIssues`).
- Emits `ValidationStateChanged` and `ValidationIssuesChanged` events
  through SmarkForm's own `.emit()` mechanism so they bubble normally.
- Applies `aria-invalid` ARIA attributes by default, in a **preventable** way.
- Can block `export` when errors are present.


## Quick Start

```html
<script src="SmarkForm.umd.js"></script>
<script>
  const myForm = new SmarkForm(document.getElementById("myForm"));

  const validation = SmarkForm.createValidation(myForm, {
    providers: [myProvider],
  });

  myForm.on("ValidationStateChanged", (ev) => {
    console.log("Errors?", ev.hasErrors, "Issues:", ev.issues);
  });
</script>
```


## Validation Providers

### Provider signature

A provider is any function — sync or async — with this signature:

```javascript
async function myProvider({ root, data, reason, signal }) {
  // `root`   – the SmarkForm root instance
  // `data`   – current exported form data (plain JSON object)
  // `reason` – why validation was triggered ('change', 'export', 'manual', …)
  // `signal` – AbortSignal; abort if a newer validation run starts

  return {
    issues: [
      // ... zero or more issue objects
    ],
  };
}
```

Providers are called in order and their results are merged.  A provider
that throws is silently skipped (with a console warning).

### Issue shape

| Property | Type | Required | Description |
|---|---|---|---|
| `level`   | `"error"` \| `"warning"` | ✓ | Severity |
| `paths`   | `string[]` | ✓ | SmarkForm paths (from `getPath()`) of the affected fields |
| `code`    | `string`   | ✓ | Machine-readable error code |
| `message` | `string`   | ✓ | Human-readable message |
| `source`  | `string`   | ✓ | Name of the provider/system |
| `id`      | `string`   |   | Stable ID (auto-generated if omitted) |
| `details` | `any`      |   | Optional extra data |

The default `id` is generated as `${source}:${code}:${paths.join('|')}`.
Issues with the **same `id` across two consecutive runs** are considered
*persisting* (not new or solved).

### Async providers

Providers can be fully asynchronous — for example, to validate against a
backend API:

```javascript
async function serverProvider({ data, signal }) {
  const response = await fetch("/api/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal, // cancel if a newer run starts
  });
  const result = await response.json();
  return { issues: result.issues };
}
```


## API Reference

### `createValidation(root, options)`

Creates and attaches a validation controller to a SmarkForm root instance.

```javascript
const validation = SmarkForm.createValidation(root, options);
```

**Options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `providers` | `Function[]` | `[]` | Validation provider functions |
| `debounce`  | `number`     | `300` | Delay (ms) before running validation after a `change` event |
| `blockExportOnErrors` | `boolean` | `true` | Call `preventDefault()` on `BeforeAction_export` when errors exist |
| `applyA11y` | `boolean`    | `true` | Apply `aria-invalid` ARIA attributes automatically |

### `validation.validate(reason?)`

Force an immediate validation run, bypassing the debounce timer.

```javascript
const state = await validation.validate("manual");
```

Returns a Promise that resolves to the current validation state object:

```javascript
{
  issues:           Issue[],   // all current issues
  hasErrors:        boolean,
  hasWarnings:      boolean,
  newIssues:        Issue[],   // appeared since last run
  solvedIssues:     Issue[],   // gone since last run
  persistingIssues: Issue[],   // present in both runs
}
```

### `validation.getState()`

Synchronously returns the latest known validation state snapshot (no new
provider calls are made).

```javascript
const { issues, hasErrors, hasWarnings } = validation.getState();
```

### `validation.destroy()`

Detaches all internal listeners and cancels any pending work.  The
`validation` object should not be used after this call.

```javascript
validation.destroy();
```


## Events

All validation events are emitted through SmarkForm's `.emit()` mechanism
on the root instance and can be registered with `.on()`, `.onLocal()`, or
`.onAll()`.

### `ValidationStateChanged`

Fired **after every** validation run (even when issues do not change).

```javascript
myForm.on("ValidationStateChanged", (ev) => {
  console.log("Validation complete:", ev.hasErrors, ev.issues);
});
```

**Event properties:**

| Property | Description |
|---|---|
| `issues`           | All current issues |
| `hasErrors`        | `true` if any error-level issue is active |
| `hasWarnings`      | `true` if any warning-level issue is active |
| `newIssues`        | Issues that appeared since the last run |
| `solvedIssues`     | Issues that disappeared since the last run |
| `persistingIssues` | Issues present in both the previous and current run |
| `reason`           | Why validation was triggered |

### `ValidationIssuesChanged`

Fired **only when the set of issues actually changes** (i.e. `newIssues`
or `solvedIssues` is non-empty).  Use this event to update issue lists in
your UI without reacting to every no-change validation run.

```javascript
myForm.on("ValidationIssuesChanged", (ev) => {
  renderIssueList(ev.issues);
});
```

Has the same properties as `ValidationStateChanged`.

### `BeforeValidationA11yApply`

Fired **before** the plugin applies (or removes) an `aria-invalid` attribute
on a field.  Call `ev.preventDefault()` to suppress the default ARIA change.

```javascript
myForm.on("BeforeValidationA11yApply", (ev) => {
  // ev.path   – the SmarkForm path of the field
  // ev.issue  – the issue object
  // ev.action – 'set' or 'remove'
  if (ev.path === "internalField") {
    ev.preventDefault(); // never apply aria-invalid on this field
  }
});
```


## ARIA Side Effects

By default, when an **error-level** issue targets a field path, the plugin
sets `aria-invalid="true"` on the field's underlying `<input>` (or container
element if no dedicated field node exists).  When all errors for a path are
solved, `aria-invalid` is removed.

**Warnings never set `aria-invalid`.**

To disable ARIA side effects globally, pass `applyA11y: false`:

```javascript
const validation = SmarkForm.createValidation(myForm, {
  providers: [myProvider],
  applyA11y: false,
});
```

To suppress ARIA changes for specific fields, use the
`BeforeValidationA11yApply` event (see above).


## Blocking Export on Errors

By default, if any **error-level** issues exist at the time `export` is
triggered, the plugin calls `ev.preventDefault()` on `BeforeAction_export`,
preventing the export from completing.

```javascript
// The default — export is blocked when errors are present:
const validation = SmarkForm.createValidation(myForm, {
  providers: [myProvider],
  blockExportOnErrors: true,
});

// Allow export even with errors (e.g. "save draft" flows):
const validation = SmarkForm.createValidation(myForm, {
  providers: [myProvider],
  blockExportOnErrors: false,
});
```

{: .hint }
> When `blockExportOnErrors` is `true`, the plugin runs a fresh, non-debounced
> validation immediately inside `BeforeAction_export` before deciding whether
> to block.  This ensures the decision is always based on up-to-date data even
> if the user triggers export before the debounce timer fires.


## Cross-Field Validation Example

The following provider validates that `endDate` is not earlier than
`startDate`, but only when both fields are filled:

```javascript
function dateRangeProvider({ data }) {
  const { startDate, endDate } = data;

  // Gate: only validate when both are filled
  if (!startDate || !endDate) return { issues: [] };

  if (new Date(endDate) < new Date(startDate)) {
    return {
      issues: [{
        level: "error",
        paths: ["startDate", "endDate"],
        code: "date_range_invalid",
        message: "End date must not be earlier than start date.",
        source: "dateRangeProvider",
      }],
    };
  }

  return { issues: [] };
}

const validation = SmarkForm.createValidation(myForm, {
  providers: [dateRangeProvider],
});

myForm.on("ValidationIssuesChanged", (ev) => {
  // Re-render your error messages whenever the issue set changes
  displayErrors(ev.issues);
});
```

This pattern makes it easy to wire in schema-based validators (e.g. Zod)
alongside custom cross-field rules:

```javascript
import { z } from "zod";

const schema = z.object({
  name:  z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

function zodProvider({ data }) {
  const result = schema.safeParse(data);
  if (result.success) return { issues: [] };

  return {
    issues: result.error.issues.map(issue => ({
      level:   "error",
      paths:   [issue.path.join("/") || "/"],
      code:    issue.code,
      message: issue.message,
      source:  "zod",
    })),
  };
}
```


## Custom Issue IDs

By default the plugin generates a stable `id` from
`${source}:${code}:${paths.join('|')}`.  Two issues with the same `id` in
consecutive runs are treated as the **same issue** (persisting), so the diff
correctly reports only genuinely new or solved issues.

If your provider can produce multiple issues with the same `source`, `code`,
and `paths` (unlikely but possible), supply an explicit `id`:

```javascript
return {
  issues: [
    { id: "my-unique-id-1", level: "error", ... },
    { id: "my-unique-id-2", level: "error", ... },
  ],
};
```


## Complete Interactive Example

The playground below manages a list of **date periods** — the kind of entry you
might use to model opening seasons, billing cycles, or availability windows.
Two validation rules are enforced on every change:

1. **Date order** — end date must not precede start date.
2. **No overlaps** — after sorting by start date, consecutive periods must not overlap.

**Things to try:**

- Set an **end date earlier than its start date** — the error appears immediately.
- Add a third period with dates that **overlap** an existing period.
- Fix all errors, then click **▶ Export** — the export is blocked while any error is active.
- Open the **JS tab** to see how the two providers and event handlers are wired together.

{% raw %} <!-- validation_periods {{{ --> {% endraw %}
{% capture validation_periods_html -%}
<div id="myForm$$">
  <ul class="periods-list" data-smark='{"type":"list","name":"periods","min_items":1}'>
    <li class="period-row">
      From <input data-smark type="date" name="start_date">
      &mdash; <input data-smark type="date" name="end_date">
      <button data-smark='{"action":"removeItem"}' title="Remove period">➖</button>
    </li>
  </ul>
  <div class="sf-controls">
    <button data-smark='{"action":"addItem","context":"periods"}'>➕ Add Period</button>
    <button data-smark='{"action":"export"}'>▶ Export</button>
  </div>
  <ul class="sf-msgs" id="msgs"></ul>
  <pre class="sf-out" id="out"></pre>
</div>{%- endcapture %}

{% capture validation_periods_css -%}
.periods-list { list-style: none; padding: 0; margin: 0; }
.period-row { display: flex; align-items: center; gap: .5em; padding: .35em 0; flex-wrap: wrap; }
{{""}}#myForm$$ input[aria-invalid="true"] { border: 2px solid #c33; background: #fff0f0; border-radius: 3px; outline: none; }
.sf-controls { display: flex; gap: .5em; margin-top: .5em; }
.sf-msgs { list-style: none; padding: 0; margin: .8em 0 0; }
.sf-msgs:empty { display: none; }
.sf-issue { padding: .3em .6em; margin-bottom: .25em; border-radius: 4px; font-size: .9em; }
.sf-issue.error { background: #fde8e8; border-left: 3px solid #c33; color: #700; }
.sf-issue.warning { background: #fef3e2; border-left: 3px solid #c80; color: #640; }
.sf-out { background: #f4f4f4; padding: .5em; margin-top: .6em; font-size: .8em; border-radius: 4px; white-space: pre-wrap; }
.sf-out:empty { display: none; }{%- endcapture %}

{% capture validation_periods_js -%}
// Provider 1: end_date must not precede start_date
function checkDateOrder({ data }) {
  const issues = [];
  (data.periods || []).forEach((p, i) => {
    if (p.start_date && p.end_date && p.end_date < p.start_date) {
      issues.push({
        level: 'error',
        paths: ['periods/' + i + '/start_date', 'periods/' + i + '/end_date'],
        code: 'end_before_start',
        message: 'Period ' + (i + 1) + ': end date is before start date.',
        source: 'periods',
      });
    }
  });
  return { issues };
}

// Provider 2: consecutive periods (sorted by start date) must not overlap
function checkNoOverlap({ data }) {
  const issues = [];
  const complete = (data.periods || [])
    .map((p, i) => ({ i, s: p.start_date, e: p.end_date }))
    .filter(p => p.s && p.e && p.s <= p.e)
    .sort((a, b) => (a.s > b.s ? 1 : -1));
  for (let j = 1; j < complete.length; j++) {
    const prev = complete[j - 1], curr = complete[j];
    if (curr.s <= prev.e) {
      issues.push({
        level: 'error',
        paths: ['periods/' + prev.i + '/end_date', 'periods/' + curr.i + '/start_date'],
        code: 'overlap',
        message: 'Periods ' + (prev.i + 1) + ' and ' + (curr.i + 1) + ' overlap.',
        source: 'periods',
      });
    }
  }
  return { issues };
}

const validation = SmarkForm.createValidation(myForm, {
  providers: [checkDateOrder, checkNoOverlap],
  debounce: 300,
});

// Keep the message list in sync with the current validation state
const msgsEl = document.getElementById('msgs');
const outEl = document.getElementById('out');
myForm.on('ValidationStateChanged', (ev) => {
  msgsEl.innerHTML = ev.issues
    .map(iss => '<li class="sf-issue ' + iss.level + '">' + iss.message + '</li>')
    .join('');
});

// Show exported JSON only when the export succeeds (i.e. no errors)
myForm.on('AfterAction_export', (ev) => {
  if (ev.data) outEl.textContent = JSON.stringify(ev.data, null, 2);
});
{%- endcapture %}

{% capture validation_periods_demoValue -%}
{
  "periods": [
    { "start_date": "2025-01-01", "end_date": "2025-06-30" },
    { "start_date": "2025-07-01", "end_date": "2025-12-31" }
  ]
}{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="validation_periods"
    htmlSource=validation_periods_html
    cssSource=validation_periods_css
    jsSource=validation_periods_js
    demoValue=validation_periods_demoValue
    selected="preview"
    showEditor=true
    height=55
    tests=false
%}

{: .hint }
> The JS tab uses `ValidationStateChanged` to re-render the full message list on
> every validation run.  In production you may prefer `ValidationIssuesChanged`,
> which fires only when the set of issues actually changes, so DOM updates happen
> only when necessary.
