---
name: smarkform-advanced-internals
description: Optional advanced skill for SmarkForm internals-heavy work — action semantics, list/context edge cases, and security-sensitive patterns.
---

# SmarkForm Advanced Internals — Optional Skill Spec

## Goal

Handle advanced SmarkForm internals safely: complex list semantics, action
decorator nuances, context/target path edge-cases, data-flattening pitfalls,
and security-sensitive option interactions.

## Scope

Use this optional skill for tasks involving any of the following:

- Nested list/template edge cases (lists inside list items, shared sub-templates)
- Programmatic action invocation (`form.do("action", ...)`) nuances
- Complex `context` / `target` path resolution (cross-list, parent-relative)
- `@action` decorator argument position semantics
- Mixin/security-option-sensitive implementations
- Data export flattening (`keyStyle`, `arrayStyle`, `exportEmpties`) edge cases

For standard form implementation, load the core skill first:
- `skills/SmarkForm-Form-Builder.skill.md`

## Source Priority

Use the exact source-priority order defined in
`skills/SmarkForm-Form-Builder.skill.md`.  Additionally, for internals-first
tasks, start by reading:

- https://smarkform.bitifet.net/resources/AGENTS/SmarkForm-Usage

## Non-negotiable Internals Rules

### `@action` Calling Conventions

- The **first argument** to a decorated action method is always the event
  target element (or `null` for programmatic calls).
- The **last argument** is the action payload (an object passed by the caller).
- Intermediate arguments are positional extras from the trigger (e.g. a
  `SmarkFormEvent` instance for internal invocations).
- When calling actions programmatically via `form.do("actionName", payload)`,
  the target is set to the form root and the payload is the second argument.
- Never bypass the action system by calling decorated methods directly —
  always go through `form.do()` or a trigger element with `action` attribute.

### Action Context and Target Resolution

- `context` resolves relative to the **trigger element's** component in the
  SmarkForm tree.
- `target` resolves relative to the **context result**, then walks up/down
  the component tree by name.
- Inside a list item, `context: ".."` refers to the list component itself;
  `context: "../.."` refers to the list's parent.
- When targeting a sibling list from inside a cloned item template, use
  `target: ".."` + the sibling list name (e.g.
  `data-smark='{"action":"addItem","target":"..parentList"}'` is wrong — use
  the correct path documented in SmarkForm Usage).
- Cross-list targets in sortable lists resolve relative to the **source**
  trigger's context, not the drop target.

### List Template Role Lifecycle

- Only `item` role templates are **cloned** (`header`, `footer`, `empty_list`
  are singletons).
- `placeholder` templates appear when `max_items` is set and the list is
  not full — they are cloned but carry no data binding.
- `separator` and `last_separator` are cloned and inserted between items.
  `last_separator` replaces `separator` for the gap between the second-last
  and last item.
- Roles are assigned at registration time. Dynamically changing a template's
  role after registration has no effect.

### Mixin Security Options

- `allowExternalMixins`, `allowLocalMixinScripts`,
  `allowSameOriginMixinScripts`, and `allowCrossOriginMixinScripts` are
  **root-level only** — they cannot be overridden per-component via
  `data-smark`.
- These options form a progressive allowlist: setting a broader option
  implicitly permits narrower ones only if the narrower isn't explicitly set.
- Default is `"block"` for all.  Only opt-in when a specific mixin source
  is required and its provenance is verified.

### Data Flattening (`exportEmpties`, `keyStyle`, `arrayStyle`)

- `exportEmpties: true` includes entries for empty lists, empty strings, and
  `null` values in the exported JSON.  Without it, empty slots are omitted
  entirely, which can shift array indices on round-trip import.
- `keyStyle: "dot"` flattens nested keys into dotted paths
  (`"address.city"`) instead of bracket notation (`"address[city]"`).
  Use `"bracket"` (default) for standard form encoding compatibility.
- `arrayStyle: "index"` produces `"items[0]"`, `"items[1]"` keys; `"repeat"`
  (default) produces repeated `"items[]"` keys.  Index style preserves
  position but breaks if items are removed mid-list.

## Output Requirement

After delivering advanced-internals code, provide a short "advanced compliance
check" confirming:

- source pages consulted
- internals rules applied
- unresolved ambiguity (if any)

## Distribution Notes

- This file is the canonical advanced skill artifact in-repo.  The YAML front
  matter uses opencode-compatible fields; other tools may need minor format
  adaptation.
- If behavioral rules change, update this file and `ai-agents.md` in the same
  PR.
