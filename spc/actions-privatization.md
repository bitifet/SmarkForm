# SmarkForm — Action Registry Privatization (future proposal)

> **Status:** design / proposal document — **not implemented**. Tracked here for
> future implementation. Related draft: `PROMPTS.md` → "Private actions".
>
> This document is the consolidated report on turning the internal `actions`
> map into a private, Symbol-keyed slot, **including the redesign of the tests
> that currently reach into that internal state**. It is deliberately deferred:
> nothing depends on it, and it is a hygiene/encapsulation change, not a bug
> fix.

Related sources:

- `src/lib/component.js` — `actions` initialisation (currently `me.actions = {}`).
- `src/types/trigger.type.js` — `@action` decorator stores the event-emitting
  wrapper; trigger resolution reads the map.
- `src/types/form.type.js` — internal `actions.submit(...)` calls.
- `src/main.js` — merges globally-registered `SmarkForm._customActions`.
- `test/events.tests.js`, `test/type_form_submit.tests.js`,
  `test/trigger_multicontext.tests.js` — current consumers of the public map.
- `docs/_resources/AGENTS/SmarkForm-Usage.md` — internal knowledge that still
  documents `context.actions[action]` and the wrapper mechanics.
- `PROMPTS.md` → "Private actions" — original draft prompt.

---

## 1. What it is

`component.actions` is a **plain, enumerable object** that the `@action`
decorator uses as an internal registry for the event-emitting wrapper around
each action method.

Current touch points (as of the deferral date):

| Location | Role |
|---|---|
| `src/lib/component.js` — `me.actions = {};` | Initialisation (already carries a `TODO` comment) |
| `src/types/trigger.type.js` — `@action` decorator initializer | Stores `this.actions[name] = async function …` |
| `src/types/trigger.type.js` — `getTriggerArgs()` / `onTriggerClick()` | Walks parents / context looking for `p.actions[action]` / `context?.actions[action]` |
| `src/types/form.type.js` | Internal calls `me.actions.submit(...)` and `me.root.actions.submit(...)` |
| `src/main.js` — `SmarkForm` constructor | Merges `SmarkForm._customActions` into `me.actions` |

## 2. Motivation

The intended public contract is only two mechanisms:

| Need | Mechanism |
|------|-----------|
| User-initiated action **with events** | HTML trigger (`data-smark='{"action":"…"}'`) |
| Programmatic action **without events** | Plain prototype method — `component.reset(data, opts)`, `component.export()`, … |

`component.actions` was never designed as API and **was already removed from
the published docs**. As an own enumerable property it:

- leaks into `for…in`, `Object.keys()`, devtools and JSON-ish serialization;
- is **collidable and shadowable** by user code;
- creates a confusing second way to call every action
  (`component.actions.reset()` vs `component.reset()`) with subtly different
  semantics (event emission, `focus` defaulting, `silent` handling).

Making it a `Symbol`-keyed slot removes all of the above: the slot stays
reachable internally (and, if desired, from tests) but is non-enumerable and
non-colliding.

## 3. Pros and cons

**Pros**

- Real encapsulation of an implementation detail; aligns code with the
  already-privatised published docs.
- Non-enumerable, non-colliding; no accidental public surface.
- Small, self-contained change (≈5 source files + 1 tiny shared module).
- Zero public-API breakage *in practice* (the map was never documented).

**Cons / risks**

- The **test suite is the real consumer** (see §5); the refactor forces a test
  redesign. This is the largest part of the work.
- A shared Symbol is a cross-file internal contract that can drift; mitigated
  by living in a tiny dedicated module.
- Pre-1.0, so a CHANGELOG note is sufficient — but any third-party code that
  reached for the (undocumented) `component.actions` would break.
- If a test-reachable seam is chosen (`Symbol.for`), "privacy" is by
  convention, not enforcement — acceptable, since the goal is to stop the map
  from being a *public, enumerable* surface.

## 4. Proposed change (Symbol approach)

```javascript
// src/lib/actions.js (new shared module):
export const ACTIONS = Symbol.for("SmarkForm.actions");
```

```javascript
// component.js — initialisation
me[ACTIONS] = {};

// trigger.type.js — decorator
this[ACTIONS][name] = async function (/* … */) { /* … */ };

// trigger.type.js — resolution
const mtd = context?.[ACTIONS]?.[action];
const ctx = parents.find(p => typeof p[ACTIONS]?.[action] === "function");

// main.js — merge custom actions
me[ACTIONS] = {
    ...me[ACTIONS],
    ...Object.fromEntries(
        Object.entries(SmarkForm._customActions)
            .map(([name, ctrl]) => [name, ctrl.bind(me)])
    ),
};
```

Notes:

- Use `Symbol.for("SmarkForm.actions")` (global registry) rather than a
  module-local `Symbol("actions")`. A module-local Symbol is unreachable from
  the browser-bundled test suite without a public seam; `Symbol.for` keeps a
  deliberate, key-named escape hatch while still being non-enumerable and
  effectively non-colliding.
- Do **not** add a public `runAction(name, data, opts)` helper preemptively;
  wait for a concrete non-test use case (see `PROMPTS.md`).

## 5. Test strategy — observable behaviour, not internal state

This is the corrected, required approach when the refactor is implemented. The
current tests reach into the internal map; that coupling is the thing to
remove, independent of the Symbol change.

**Principle:** tests must drive actions through the same entry points users
use, and assert on **observable effects** (emitted events, DOM/state changes,
network/form submissions), never on the existence or contents of the internal
wrapper map.

Concretely:

1. **Triggered, event-emitting path (the `actions` wrapper's real job).**
   A click on a trigger (`data-smark='{"action":"…"}'`) is the only *public*
   path that runs the event-emitting wrapper. To assert that an event fires:
   create/click the trigger (real user gesture), register a handler, and assert
   the handler's observable effect — e.g. a `BeforeAction_*` handler that calls
   `preventDefault()` (assert the action was cancelled) or an `AfterAction_*`
   handler that records/transforms data (assert the effect on the exported
   value or the DOM). **Do not** call `form.actions.export()` to force the
   wrapper.

   - `test/events.tests.js` currently does exactly this anti-pattern
     (`form.actions.export()` ×9) to trigger the event cycle. Redesign: add a
     real export trigger to the shared pug fixture and click it, keeping the
     event-log assertions.
   - The programmatic prototype methods (`form.export()`, `form.reset()`, …)
     remain the **public no-event path**: test them by calling the method and
     asserting the returned value / observable state — no event expectations.

2. **Submit interception.** `test/type_form_submit.tests.js` monkey-patches
   `form.actions.submit` (×31) to intercept. Redesign to assert through public
   surfaces instead:
   - drive submission via a real submit button / `submit` trigger;
   - observe it with `BeforeAction_submit` / `AfterAction_submit` handlers
     (public events) and by inspecting the intercepted native submission
     (e.g. a stubbed `fetch`, or a `BeforeAction_submit` handler calling
     `preventDefault()` to assert cancellation);
   - if a raw override is unavoidable, override the **prototype method**
     (`form.submit = …`) — a public surface — never the internal map.

3. **Multi-context dispatch.** `test/trigger_multicontext.tests.js` should
   assert the observable outcome (each matched component's state changed) by
   clicking wildcard-context triggers, not by reaching into `actions`.

4. **Fallback seam (only if a test genuinely cannot use a trigger):**
   `form[Symbol.for("SmarkForm.actions")]`. Prefer a trigger; use this sparingly
   and document why in the test.

This redesign makes the tests robust to the refactor and to *any* future change
in how the wrapper is stored — they encode behaviour, not structure.

## 6. Migration checklist

- [ ] Add `src/lib/actions.js` exporting `ACTIONS = Symbol.for("SmarkForm.actions")`.
- [ ] Swap the 5 internal consumers (`component.js`, `trigger.type.js` ×several,
      `form.type.js` ×2, `main.js`).
- [ ] Redesign affected tests per §5 (`events`, `type_form_submit`,
      `trigger_multicontext`).
- [ ] Update `docs/_resources/AGENTS/SmarkForm-Usage.md` ("How triggers call
      actions" / "The `@action` wrapper") to describe the Symbol slot or, better,
      to stop documenting the map as an access point.
- [ ] Remove the `TODO: use private Symbol` comments in `component.js` and
      `trigger.type.js`.
- [ ] CHANGELOG note under Unreleased (internal change; no public API impact).
- [ ] `npm run build` (tests run against `dist/`).

## 7. Compatibility

- No published-API change: `component.actions` was never documented externally.
- Internal-only behavioural change; user code that (incorrectly) touched
  `component.actions` is unsupported and pre-1.0.
- The event-emitting semantics themselves are unchanged — only *where* the
  wrapper is stored changes.

## 8. Decision

**Defer — low priority.** The motivating wart (enumerability/collision) is
cosmetic, was never documented, and has not been reported. The practical benefit
is small; the cost is dominated by the test redesign (§5), which is worth doing
*when* the refactor happens but does not on its own justify the refactor now.

**When implemented:** do the Symbol change **and** the §5 test redesign in the
same effort, so the suite stops depending on internal state permanently.

## 9. Open questions

1. `Symbol.for` (test-reachable) vs module-local `Symbol` (stricter privacy)?
   Recommendation: `Symbol.for`, to keep a key-named seam without a public API.
2. Should `docs/_resources/AGENTS/SmarkForm-Usage.md` keep describing the
   wrapper, or be rewritten to steer contributors to public entry points?
3. Is a public `runAction(name, data, opts)` ever warranted? Only on a concrete
   non-test use case.

## 10. Decision log

| Date | Decision |
|---|---|
| 2026-10-12 | Report consolidated into this file; test part corrected to require observable-behaviour testing; implementation deferred (low priority). |
