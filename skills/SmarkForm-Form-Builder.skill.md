# SmarkForm Form Builder — Installable Skill Spec

## Goal

Generate production-ready SmarkForm forms that follow current SmarkForm patterns and avoid common implementation mistakes.

## Source Priority (mandatory)

When implementing or modifying forms, consult sources in this order:

1. **Primary (always first):**
   - https://smarkform.bitifet.net/resources/AGENTS/SmarkForm-Forms
   - https://smarkform.bitifet.net/resources/AGENTS/SmarkForm-Usage
2. **Fallback (repo source of canonical pages):**
   - `docs/_resources/AGENTS/SmarkForm-Forms.md`
   - `docs/_resources/AGENTS/SmarkForm-Usage.md`
3. **Last fallback (repo pointers):**
   - `AGENTS/SmarkForm-Forms.md`
   - `AGENTS/SmarkForm-Usage.md`

If sources disagree, prefer the highest-priority source.

## Required Rules (hard requirements)

1. **Event/action integration**
   - Use SmarkForm actions and SmarkForm events (`BeforeAction_*` / `AfterAction_*`) for form workflows.
   - Do not replace SmarkForm action flows with arbitrary ad-hoc DOM listeners on managed form controls.
2. **Render timing**
   - Always wait for `await myForm.rendered` before any `find()` usage or component-tree-dependent logic.
3. **List/template/context semantics**
   - Follow list template role rules (`item`, `empty_list`, `header`, `footer`, etc.).
   - Respect context/target resolution semantics for triggers.
   - For controls inside cloned item templates that target sub-lists, use safe placement patterns documented in SmarkForm Usage.
4. **Security/root options**
   - Security-sensitive options must be configured on the root SmarkForm constructor options (not via nested `data-smark` inheritance tricks).
   - Keep secure defaults unless explicit requirement justifies opt-in.
5. **Naming convention in examples**
   - Use `myForm` as the SmarkForm instance variable in generated JS examples.

## Standard Implementation Workflow

1. Read primary source pages.
2. Draft HTML with `data-smark` attributes on all managed fields.
3. Initialize with:
   - `const myForm = new SmarkForm(document.getElementById("myForm"), options);`
   - `await myForm.rendered;`
4. Wire behavior through SmarkForm actions/events.
5. Validate against the compliance checklist below.

## Output Contract

Every response that delivers SmarkForm code must include:

1. The implementation.
2. A **SmarkForm compliance checklist** section showing pass/fail for each item.

If any checklist item fails, the skill must treat output as incomplete and revise
it before finalizing. If revision is not possible, add a clear warning header
(`SmarkForm compliance incomplete`) and explicitly report unmet items and why.

## SmarkForm Compliance Checklist (mandatory)

Template below is intentionally unchecked in this skill spec. In generated
outputs, agents must replace it with explicit pass/fail marks per item.

When generating output, evaluate each item and report explicit pass/fail status.
Replace template markers with:
- `[x]` for pass
- `[ ]` for fail
Do not leave this section as an untouched unchecked template.

- [ ] Managed fields include `data-smark`.
- [ ] Root element is passed to `new SmarkForm(...)` correctly.
- [ ] Uses `myForm` variable naming convention.
- [ ] `await myForm.rendered` before `find()` and component-dependent logic.
- [ ] Uses SmarkForm actions/events for form workflows (`BeforeAction_*` / `AfterAction_*`) where applicable.
- [ ] List template roles and placement rules are respected.
- [ ] `context` / `target` paths follow SmarkForm rules.
- [ ] No conflicting dual defaults (`value=""` plus JSON `"value"` on same element).
- [ ] Security-sensitive options are set at root constructor options when needed.
- [ ] Production CDN examples use explicit version numbers (for example
      `@0.16.0`) and do not use `@latest`.

## Distribution Notes

- This file is the canonical core skill artifact in-repo.
- For external tools (opencode, similar), adapt this spec to tool-specific front matter/format without changing behavioral rules.
