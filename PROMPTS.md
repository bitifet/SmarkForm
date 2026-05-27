# PROMPTS.md

> This file is a Kind of "TODO" list for future features and improvements. But,
> instead of simple task headlines, each task is described in detail as a
> prompt draft for an AI language model.
> 
> This way it works trice as:
> 1. A detailed TODO list for future improvements.
> 2. A brainstorm blackboard to sort, refine and organize ideas.
> 3. A prompt storage where to grow and polish prompt drafts until they are ready
>    to be used.
>
> The best thing is that interdependences among tasks can be easily spotted
> before implementation and tweaks can be made before a single line of code is
> written.



### Private actions

> Status: Draft

Refactor `component.actions` to use a private Symbol so it is no longer
enumerable or directly accessible as a public property.

**Rationale:**

The `actions` object exists as an internal implementation artifact of the
`@action` decorator (`src/types/trigger.type.js`). The decorator needs
somewhere to stash the event-emitting wrapper function — `this.actions[name]`
is convenient — but it was never designed as a user-facing API.

The intended public contract is:

| Need | Mechanism |
|------|-----------|
| User-initiated action with events | HTML trigger (`data-smark='{"action":"..."}'`) |
| Programmatic action without events | `component.reset(data, opts)` (prototype method) |

Documenting `component.actions` creates confusion because there are now **two
ways** to call every action (`component.actions.reset()` vs `component.reset()`)
with subtle behavioural differences (events, focus defaulting, `silent` option
handling). The `actions` wrapper was also removed from the published docs in
PR #xx for this reason.

**Internal consumers that will need updating:**

1. `src/lib/component.js:104` — `me.actions = {}` initialisation.
2. `src/types/trigger.type.js:8` — decorator stores the wrapper.
3. `src/types/trigger.type.js:83` — `getTriggerArgs()` walks parents looking
   for `p.actions[action]`.
4. `src/types/trigger.type.js:114` — `onTriggerClick()` resolves
   `context?.actions[action]`.
5. `src/main.js:57` — `SmarkForm` constructor merges user-provided custom
   actions via `me.actions = { ...me.actions, ...customActions }`.

**Implementation sketch (Symbol approach):**

```javascript
// In component.js or a shared module:
const sym_actions = Symbol("actions");

// Initialisation (component.js):
me[sym_actions] = {};

// Decorator (trigger.type.js):
me[sym_actions][name] = async function (...) { ... };

// Access in trigger resolution (trigger.type.js):
const mtd = context?.[sym_actions][action];
const ctx = parents.find(p => typeof p[sym_actions][action] == "function");

// Merging custom actions (main.js):
me[sym_actions] = {
    ...me[sym_actions],
    ...Object.fromEntries(
        Object.entries(customActions).map(([n, c]) => [n, c.bind(me)])
    ),
};
```

Alternatively, if a public programmatic API for triggering actions with events
is ever needed, provide a focused helper like `component.runAction(name, data,
opts)` rather than exposing the entire map. Do not add this preemptively —
wait for a concrete use case.


### Disabled action

> Status: Draft

I want you to implement a new action called "disable" for the input component types and every other component type that does not inherit from input (form and list).

You also have to implement an internal "disabled" state for every component type which, for input based types, will just rely on the real "disabled" attribute of the targetFieldNode of the component.



### Null action

> Status: Draft

FIXME: Review this and contrast with the "dependent disabilitation" and  "multiforms" features. They may need to be merged or redefined in a more general way...

I want you to implement a new action called "null" for the form component type.

Unlike most actions that usually enhance buttons, the "null" action will enhance a checkbox and will work the following way:

If the checkbox is checked (default), every field in the form gets disabled.

