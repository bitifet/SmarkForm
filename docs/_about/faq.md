---
title: FAQ
layout: chapter
nav_order: 6
permalink: /about/faq

---

# SmarkForm {{ page.title }}


Below are answers to common questions about SmarkForm’s behavior, especially
around edge cases or features that might catch you off guard at first.


{: .warning :}
> 🚧 **Work in Progress** 🚧
>
> This FAQ is still under constructon. All **the following text is just a
> draft!!**
> 
> If it helps you, great! But don't trust it as the final word just yet...


<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Why can’t I remove items from my list sometimes?](#why-cant-i-remove-items-from-my-list-sometimes)
* [Why does my «add» button stop working?](#why-does-my-add-button-stop-working)
* [My exported JSON is missing some fields—what’s up?](#my-exported-json-is-missing-some-fieldswhats-up)
* [Why does my form focus the first field automatically?](#why-does-my-form-focus-the-first-field-automatically)
* [Can I configure SmarkForm without JavaScript?](#can-i-configure-smarkform-without-javascript)
* [Why are my nested form fields named weirdly in the JSON?](#why-are-my-nested-form-fields-named-weirdly-in-the-json)
* [I added an event listener, but it’s not firing—why?](#i-added-an-event-listener-but-its-not-firingwhy)
* [My list won’t let me add items until I fill the current ones—is that intended?](#my-list-wont-let-me-add-items-until-i-fill-the-current-onesis-that-intended)
* [Where’s the error message when something goes wrong?](#wheres-the-error-message-when-something-goes-wrong)
* [What’s this “API interface” I keep hearing about?](#whats-this-api-interface-i-keep-hearing-about)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>



## Why can’t I remove items from my list sometimes?

SmarkForm enforces a min_items limit (default is 1) on variable-length lists to keep them functional. When you hit this minimum, the "remove" button (data-smark-action="remove") doesn’t silently fail: It's just it gets disabled automatically. Once you add more items, it re-enables. Check your list’s `<ul data-smark-type="list">`—if it’s at min_items, that’s why!

Tip: Add a disabled CSS rule (e.g., button[disabled] { opacity: 0.5; }) to make this state more obvious to users.


## Why does my «add» button stop working?

Similar to removal, SmarkForm respects a max_items limit if you set one (e.g., { max_items: 5 }). When the list hits this cap, the "add" button (data-smark-action="add") disables itself until you remove an item. It’s not broken—it’s just full!

Tip: Style the disabled state with CSS or set a higher max_items in your config if you need more slots.


## My exported JSON is missing some fields—what’s up?

By default, SmarkForm skips empty items in variable-length lists when exporting to JSON. If you want those empty fields included (e.g., "" or null), set { exportEmpties: true } in your config. Otherwise, only filled-in data makes the cut.

Example: `<input name="task">` left blank in a list? It’s gone unless exportEmpties is on.


## Why does my form focus the first field automatically?

SmarkForm’s autoFocus option (default: true) sets focus on the first editable field when the form loads, boosting accessibility. If this isn’t your vibe, disable it with { autoFocus: false } during initialization.

Note: This only happens on page load, not after actions like adding items.


## Can I configure SmarkForm without JavaScript?

Yep! You can use data-smark-options on your `<form>` tag to set options in HTML. For example, `<form data-smark-options='{"min_items": 2}'>` ensures at least two list items without touching JS. JS config overrides this if both are present.

Heads-up: It’s JSON, so watch your quotes and syntax!


## Why are my nested form fields named weirdly in the JSON?

If you use data-smark-prefix on a subform (e.g., `<div data-smark-prefix="user">`), SmarkForm prefixes its fields in the exported JSON (like user.name). It’s a neat way to avoid key clashes, but it might surprise you if unmarked.

Fix: Remove the prefix or lean into it for clarity.


## I added an event listener, but it’s not firing—why?

SmarkForm supports events like AfterAction_export, but also AfterAction_add, AfterAction_remove, and more. Make sure your action matches the data-smark-action (case-sensitive!) and that the event name is exact.

Test: myForm.on("AfterAction_add", () => console.log("Added!"));—works after an "add" action.


## My list won’t let me add items until I fill the current ones—is that intended?

Not quite! SmarkForm doesn’t require fields to be filled before adding items—it’s just the min_items and max_items limits at play. If your "add" button’s disabled, check if you’ve hit max_items or if a custom validation (not in core SmarkForm) is interfering.

Debug: Log your config with console.log(myForm.options).


## Where’s the error message when something goes wrong?

SmarkForm leans on silent prevention over loud errors. For example, hitting min_items disables "remove" instead of alerting you. It’s by design to keep things smooth, but you can hook into events (e.g., AfterAction_remove) to add custom feedback if needed.

Tip: Style disabled buttons to signal why actions aren’t working.


## What’s this “API interface” I keep hearing about?

The API interface is a future feature for dynamic data (think fetching options for a select component). It’s not live yet, but the code has stubs hinting at it. Stay tuned—details will land in the docs when it’s ready!

Peek: Check smarkform.js for _updateSelectOptions if you’re curious.


{: .hint :}
> Got more questions?
> 
> 👉 Open a [discussion](https://github.com/bitifet/SmarkForm/discussions) on GitHub or reach out!


