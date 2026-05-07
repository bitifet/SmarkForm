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

* [Agent Knowledge Files](#agent-knowledge-files)
* [How to Use These Files When Prompting an AI](#how-to-use-these-files-when-prompting-an-ai)
  * [Quick Reference Prompts](#quick-reference-prompts)
* [Installable Skills](#installable-skills)
  * [Core Skill (recommended)](#core-skill-recommended)
  * [Optional Advanced Skill](#optional-advanced-skill)
  * [Import into opencode or similar tools](#import-into-opencode-or-similar-tools)
* [Maintenance Rules for Skill Files](#maintenance-rules-for-skill-files)
* [Prompt Templates](#prompt-templates)
  * [Simple form](#simple-form)
  * [Form with a repeating list](#form-with-a-repeating-list)
  * [Adding SmarkForm to an existing page](#adding-smarkform-to-an-existing-page)

<!-- vim-markdown-toc -->
     " | markdownify }}

</details>

## Agent Knowledge Files

| File | Best for |
|------|----------|
| [SmarkForm Forms]({{ "/resources/AGENTS/SmarkForm-Forms" | relative_url }}) | **Implementing forms** — CDN/npm/downloaded-copy snippets, common component patterns, lists, actions, hotkeys, prompt templates, agent checklist |
| [SmarkForm Usage]({{ "/resources/AGENTS/SmarkForm-Usage" | relative_url }}) | **Deep internals** — component types, list template roles, `exportEmpties`, `@action` decorator, `find()` timing, CSS grid layout |

Both files are versioned alongside the library and always reflect the deployed
release.

---

## How to Use These Files When Prompting an AI

1. **Decide which task you need help with** (implement a form, update docs,
   write tests, etc.).
2. **Open the relevant page** from the table above and copy its content.
3. **Paste it at the top of your prompt** (or attach it as context), then
   describe your specific request.
4. **Include your desired schema** — field names, types, list structure —
   so the AI can generate matching HTML immediately.

### Quick Reference Prompts

You can also link the agent directly to the versioned page:

```
Read https://smarkform.bitifet.net/resources/AGENTS/SmarkForm-Forms
then implement a contact form with fields: name, email, message.
Load SmarkForm from CDN (pin to the latest stable version).
```

---

## Installable Skills

The repository includes installable skill specs so AI tools can enforce
SmarkForm-specific implementation rules.

### Core Skill (recommended)

- `skills/SmarkForm-Form-Builder.skill.md`

Use this for general SmarkForm form implementation. It enforces:
- source-priority lookups (deployed docs first)
- event/action-first implementation patterns
- required `await myForm.rendered` timing
- list/context/template rules
- root-level security option rules
- mandatory “SmarkForm compliance checklist” in outputs

### Optional Advanced Skill

- `skills/SmarkForm-Advanced-Internals.skill.md`

Use this when handling advanced internals and edge cases.

### Import into opencode or similar tools

1. Open the desired skill file from `skills/`.
2. Copy its full content into your tool's skill/instruction definition.
3. Keep the source-priority section unchanged so the agent always prefers:
   - `https://smarkform.bitifet.net/resources/AGENTS/SmarkForm-Forms`
   - `https://smarkform.bitifet.net/resources/AGENTS/SmarkForm-Usage`
4. If your tool supports separate skills, install:
   - core skill as default
   - advanced skill as opt-in

---

## Maintenance Rules for Skill Files

- When `docs/_resources/AGENTS/SmarkForm-Forms.md` or
  `docs/_resources/AGENTS/SmarkForm-Usage.md` changes, review and update both
  files under `skills/` if affected; when in doubt, update both in the same PR.
- Apply the same update rule when their deployed equivalents change:
  `https://smarkform.bitifet.net/resources/AGENTS/SmarkForm-Forms` and
  `https://smarkform.bitifet.net/resources/AGENTS/SmarkForm-Usage`.
- Keep the source-priority order intact so deployed docs remain the primary
  knowledge source for agents.
- If behavioral rules change, update both the skill file(s) and this page.

---

## Prompt Templates

The following ready-to-use prompts are reproduced from the
[SmarkForm Forms]({{ "/resources/AGENTS/SmarkForm-Forms" | relative_url }}) reference page.
Copy, adapt, and paste into your AI assistant.

### Simple form

```
Using SmarkForm (CDN ESM: https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.esm.js),
create a contact form with fields: name (text), email (email), phone (text, optional),
message (textarea). Include Export and Reset buttons. Log exported data to the console.
Follow patterns from https://smarkform.bitifet.net/resources/AGENTS/SmarkForm-Forms.
```

### Form with a repeating list

```
Using SmarkForm loaded via CDN (UMD: https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.umd.js),
create an invoice form with:
- Header fields: client name (text), date (date)
- A line-items list (name it "items") where each item has: description (text),
  quantity (number, SmarkForm null-aware), unit_price (number, null-aware).
- min_items:1, max_items:10 on the list.
- Add/Remove hotkeys + and -.
- Export and Reset buttons outside the list.
Output exported JSON to a <pre> element on the page.
Refer to https://smarkform.bitifet.net/resources/AGENTS/SmarkForm-Forms for patterns.
```

### Adding SmarkForm to an existing page

```
I have an existing HTML page. Add a SmarkForm registration form to the
#registration-section div. Fields: username (text), password (input type="password",
plain input — not a SmarkForm type), role (radio: admin / editor / viewer).
Load SmarkForm from npm (already installed as "smarkform"). Use ESM import.
Set defaultValue for role to "editor". After export, POST the data to /api/register.
See https://smarkform.bitifet.net/resources/AGENTS/SmarkForm-Forms for patterns.
```
