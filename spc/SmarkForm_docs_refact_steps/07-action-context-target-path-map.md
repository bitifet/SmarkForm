# Step 07 — Action, Context, Target, and Path Map

This note records the source-verified semantics and the cross-page wording
changes for Step 07. It is a review aid, not reader-facing documentation.

## Behavior evidence

| Behavior | Implementation / test evidence | Wording used |
|---|---|---|
| Natural context | `src/types/trigger.type.js`, `getTriggerArgs()`: without a context path, it searches the trigger and ancestor chain for the first component implementing the action. The trigger itself has no actions. | “Nearest ancestor component that implements the requested action.” |
| Explicit context | `getTriggerArgs()` resolves `me.parent.find(contextPath)`. It does not retry ancestor search if the path resolves to an incompatible component. `onTriggerClick()` raises a render error with code `UNKNOWN_ACTION` when the selected context lacks the action. The same error occurs if natural resolution finds no action-capable ancestor. | Explicit paths start at the trigger's enclosing field (absolute paths start at root); the result must implement the action; no fallback. Missing natural context also errors on activation. |
| Trigger/label path nodes | `src/lib/component.js`, `find()` normalizes unnamed callers to the nearest named ancestor; `src/types/trigger.type.js` deletes trigger names. | Triggers and labels are components but not fields/path nodes. |
| Explicit target | `getTriggerArgs()` resolves `targetPath` with `context.find(targetPath)`. Absolute paths use normal root-based `find()` behavior. | Relative targets start at effective context; absolute targets start at the root. Do not confuse the target base with the context base. |
| Natural target inference | `getTriggerArgs()` infers a target from the trigger's ancestor chain only when context is natural and a child component lies on that chain. | A list-item trigger can target its item; explicit context does not infer a target from placement. If omitted, action-specific defaults apply. |
| Import/export direction | `src/decorators/export_to_target.deco.js` exports the context and imports into target; `src/decorators/import_from_target.deco.js` exports target and imports into context. | `export`: context → target. `import`: target → context. |
| List action defaults | `src/types/list.type.js`: `addItem` defaults to appending; `removeItem` defaults to an eligible item and enforces `min_items`. | List actions retain their own defaults when trigger target is unset; detailed options stay in the List reference. |
| Wildcard context | `trigger.type.js` filters wildcard matches to components implementing the action and dispatches sequentially. `test/trigger_multicontext.tests.js` verifies that non-action matches are skipped and a no-match wildcard is a no-op. | Wildcard dispatch is sequential; ineligible matches are skipped; no eligible matches are a no-op. |
| Unresolved target | Target decorators catch unresolved target operations. `export` can return its value without a destination import; `import` without explicit data can pass `undefined` to the context's import/default behavior. | Missing target is not described as a universal `UNKNOWN_ACTION`; validate targets and follow action-specific behavior. |
| Path traversal | `src/lib/component.js`, `find()`: slash-separated direct-child lookup; leading `/` resets to root; `..` moves to parent; `.` is current; `.+N` / `.-N` navigate siblings; `*` and `?` return multi-match results. | Full syntax remains in Form Traversing; short pages state only the path bases they need. |

## Page ownership and edits

| Page | Step 07 change / ownership |
|---|---|
| `docs/_component_reference/trigger.md` | Rewritten as the canonical action/trigger/context/target reference; preserves the previous option and interaction anchors. Its list/tree example distinguishes context from item target, and a new editor-safe demo exercises sibling copy plus list-item actions. |
| `docs/_guides/form_traversing.md` | Keeps the path grammar and practical navigation examples; clarifies the enclosing-field context base, effective-context target base, natural target inference, and wildcard no-match behavior. Duplicate context/target exposition is reduced. Remaining traversal material stays in this guide. |
| `docs/_start_here/core_concepts.md` | Retains only the concise action overview and links to Trigger / Form Traversing. |
| `docs/_about/faq.md` | Clarifies explicit context resolution and points to Trigger and Form Traversing. |
| `docs/_guides/events.md` | Clarifies that programmatic action calls have no trigger origin (unset); trigger-initiated lifecycle events expose their origin component. |
| `docs/_component_reference/cheatsheet.md` | Corrects `..fieldname` to `../fieldname`; summarizes context/target bases, direction, wildcard filtering, and missing-target caution. |
| `docs/_ai_agents/smarkform_usage.md`, `AGENTS/SmarkForm-Usage.md` | Aligns agent usage rules and relative-path examples with the implementation. |
| `docs/_guides/using_smarkform.md` | Step 07 aligned the interim route's action wording; Step 08 replaced the stub with the full practical guide while retaining the verified context/target model and reference links. |
| `skills/SmarkForm-Form-Builder.skill.md` and OpenCode export | Adds a concise correct context/target rule for generated forms. |
| `skills/SmarkForm-Advanced-Internals.skill.md` and OpenCode export | Replaces incorrect trigger-relative context/target claims and the malformed `..parentList` example with source-verified behavior. |

No existing sampletabs or tests were removed in this step. One new sampletab,
`trigger_context_target`, uses relative paths so it works in the playground
editor; its demoValue enables the collector-generated round-trip smoke test.
The root
`docs/_community/contact.md` remains untouched. The complete original pages stay
in the staged legacy tree for later cleanup/audit.

## Verification

* Reviewed the behavior against implementation and the existing wildcard
  multi-context Playwright tests.
* Jekyll build succeeded; the rendered-site route/fragment checker found zero
  broken non-legacy links/fragments. The canonical Trigger page is in the
  sitemap and the staged legacy route is excluded.
* The `trigger_context_target` sampletab renders with its demo value; its
  context/target paths are relative for the editor-wrapped preview.
* Node/npm and Playwright are unavailable in this environment; no test run is
  claimed here.
