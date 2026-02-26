---
title: AI & Agent Resources
layout: chapter
permalink: /resources/ai-agents
nav_order: 6
---

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Overview](#overview)
* [Agent Knowledge Files](#agent-knowledge-files)
* [How to Use These Files When Prompting an AI](#how-to-use-these-files-when-prompting-an-ai)
    * [Quick Reference Prompts](#quick-reference-prompts)
* [Prompt Templates](#prompt-templates)
    * [Simple form](#simple-form)
    * [Form with a repeating list](#form-with-a-repeating-list)
    * [Adding SmarkForm to an existing page](#adding-smarkform-to-an-existing-page)

<!-- vim-markdown-toc -->
     " | markdownify }}

</details>

## Overview

The `AGENTS/` directory at the root of the [SmarkForm
repository](https://github.com/bitifet/SmarkForm) contains specialised
knowledge files designed for AI coding agents (and human developers who want
concise, actionable guidance). These files capture patterns, gotchas, and
implementation details that are not obvious from reading the source code.

{: .hint}
> If you are prompting an AI assistant to implement or modify a SmarkForm
> form, paste the relevant `AGENTS/` file(s) into your prompt context (or
> point the AI to this page). This dramatically improves result quality.

---

## Agent Knowledge Files

| File | Best for |
|------|----------|
| [`AGENTS/SmarkForm-Forms.md`](https://github.com/bitifet/SmarkForm/blob/main/AGENTS/SmarkForm-Forms.md) | **Implementing forms** — CDN/npm/downloaded-copy snippets, common component patterns, lists, actions, hotkeys, prompt templates, agent checklist |
| [`AGENTS/SmarkForm-Usage.md`](https://github.com/bitifet/SmarkForm/blob/main/AGENTS/SmarkForm-Usage.md) | **Deep internals** — component types, list template roles, `exportEmpties`, `@action` decorator, `find()` timing, CSS grid layout |
| [`AGENTS/Documentation-Examples.md`](https://github.com/bitifet/SmarkForm/blob/main/AGENTS/Documentation-Examples.md) | **Docs examples** — `demoValue`, `DOCS_ONLY_PARAMS`, co-located test patterns, playground template structure |
| [`AGENTS/Documentation-Guidelines.md`](https://github.com/bitifet/SmarkForm/blob/main/AGENTS/Documentation-Guidelines.md) | **Docs style** — callout types, emoji rules, Just-the-docs conventions |

All files are plain Markdown — you can copy them directly into an AI chat or
reference them by URL.

---

## How to Use These Files When Prompting an AI

1. **Decide which task you need help with** (implement a form, update docs,
   write tests, etc.).
2. **Copy the relevant `AGENTS/` file** from GitHub (raw view is easiest).
3. **Paste it at the top of your prompt** (or attach it as context), then
   describe your specific request.
4. **Include your desired schema** — field names, types, list structure —
   so the AI can generate matching HTML immediately.

### Quick Reference Prompts

You can also link the agent directly to the file:

```
Read https://raw.githubusercontent.com/bitifet/SmarkForm/main/AGENTS/SmarkForm-Forms.md
then implement a contact form with fields: name, email, message.
Load SmarkForm from CDN (pin to the latest stable version).
```

---

## Prompt Templates

The following ready-to-use prompts are reproduced from
`AGENTS/SmarkForm-Forms.md`. Copy, adapt, and paste into your AI assistant.

### Simple form

```
Using SmarkForm (CDN ESM: https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.esm.js),
create a contact form with fields: name (text), email (email), phone (text, optional),
message (textarea). Include Export and Reset buttons. Log exported data to the console.
Follow patterns from AGENTS/SmarkForm-Forms.md.
```

### Form with a repeating list

```
Using SmarkForm loaded via CDN (UMD), create an invoice form with:
- Header fields: client name (text), date (date)
- A line-items list (name it "items") where each item has: description (text),
  quantity (number, SmarkForm null-aware), unit_price (number, null-aware).
- min_items:1, max_items:10 on the list.
- Add/Remove hotkeys + and -.
- Export and Reset buttons outside the list.
Output exported JSON to a <pre> element on the page.
Refer to AGENTS/SmarkForm-Forms.md for patterns.
```

### Adding SmarkForm to an existing page

```
I have an existing HTML page. Add a SmarkForm registration form to the
#registration-section div. Fields: username (text), password (input type="password",
plain input — not a SmarkForm type), role (radio: admin / editor / viewer).
Load SmarkForm from npm (already installed as "smarkform"). Use ESM import.
Set defaultValue for role to "editor". After export, POST the data to /api/register.
See AGENTS/SmarkForm-Forms.md for patterns.
```
