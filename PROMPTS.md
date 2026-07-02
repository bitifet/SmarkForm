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


### Declarative Masking API

> Status: Draft

Implement a declarative masking system that lets users apply external masking
libraries to fields without writing `find()` + `.mask()` boilerplate after
`await rendered`.

#### Motivation

The current `mask(callback)` method works but requires:
- `await myForm.rendered`
- `myForm.find("path/to/field")`
- calling `.mask(callback)` on the result

This fails for list items added after initial render, because their mask is
never applied. A declarative approach ensures masks are applied at render time,
whether initial render or when a list item is cloned.

#### Proposed API — Two Approaches

**Approach 1 — `SmarkForm.registerMask()` (JavaScript API)**

```javascript
// Register before creating any SmarkForm instance
SmarkForm.registerMask("creditCard", (node) => {
    return new IMask(node, { mask: "0000 0000 0000 0000" });
});

SmarkForm.registerMask("price", (node) => {
    return new IMask(node, {
        mask: Number,
        scale: 2,
        thousandsSeparator: " "
    });
});
```

Then reference by name in `data-smark`:

```html
<input data-smark='{"name":"cardNumber","mask":"creditCard"}'>
```

**Approach 2 — `<script type="smark-mask">` (Declarative, HTML-centric)**

```html
<script type="smark-mask" data-name="creditCard">
    (node) => new IMask(node, { mask: "0000 0000 0000 0000" });
</script>
```

The `script[type="smark-mask"]` tag is inert — browsers don't execute it.
SmarkForm scans for these during initialization, evaluates the content, and
registers each named mask function internally.

This works naturally inside **mixin templates** — a mixin that uses a masked
field can carry its own `<script type="smark-mask">` in its `<template>`
element.

**Mixin scope**: Masks defined inside a mixin template are scoped to that
mixin's expansion — they don't pollute the global registry. When the mixin is
loaded, its masks are registered; when the mixin template is expanded for a
specific field, the mixin's masks take precedence over global ones. This lets
different mixins define a mask named "price" without conflict.

Implementation sketch: the mixin system already has its own options merging
pipeline (`getNodeOptions` in `component.js`). Mixin-scoped masks would be
stored alongside the mixin template and passed through the same merge logic,
so mixin-local masks override global masks during expansion but don't affect
other mixins or the global registry.

#### How Registration Works

Both approaches feed into the same internal registry:

```javascript
// Internal (component.js or a static registry)
SmarkForm._maskRegistry = {};

SmarkForm.registerMask = function(name, fn) {
    SmarkForm._maskRegistry[name] = fn;
};
```

The `<script type="smark-mask">` scanner can be implemented inline in the
constructor or as a utility:

```javascript
for (const el of document.querySelectorAll('script[type="smark-mask"]')) {
    const name = el.getAttribute("data-name");
    const fn = new Function("return " + el.textContent)();
    SmarkForm.registerMask(name, fn);
}
```

#### Integration with `render()` — Timing

When a component is rendered (including list items being cloned), the mask
is applied at the **end of `render()`**, after `targetFieldNode` has been
assigned. The `data-smark` options (including `mask`) are already available
in `me.options` from the constructor — no timing conflict.

```javascript
// At the end of input.type.js render(), after targetFieldNode is set
if (me.options.mask && typeof me.options.mask === "string") {
    const factory = SmarkForm._maskRegistry[me.options.mask];
    if (factory) {
        const input = me.targetFieldNode;
        if (input) {
            const type = input.getAttribute("type");
            if (type && type !== "text" && type !== "textarea") {
                input.setAttribute("type", "text");
            }
            me._maskInstance = factory(input);
        }
    } else if (SmarkForm._maskConfig.throwOnMissing) {
        throw new Error(`Mask "${me.options.mask}" not found in registry`);
    } else {
        console.warn(`Mask "${me.options.mask}" not found in registry`);
    }
}
```

The constructor flow: `me.options = options` (has `mask` from `data-smark`).
Then `render()` runs → assigns `targetFieldNode` → applies mask.

#### The `.mask()` Method Is Removed

Since this is a feature branch (not yet public API), the old `.mask()` method
is **removed**. All masking is done declaratively via `data-smark` or the
registry API. This avoids user confusion — the old method didn't work for list
items added after render, and keeping it would create two inconsistent ways to
mask a field.

Only the declarative approach (`{"mask":"name"}` in `data-smark`) and the
`registerMask()` API remain.

For edge cases that need custom programmatic logic, users can register a named
mask via `SmarkForm.registerMask()` and reference it in `data-smark`.

#### `export()` / `import()` Behavior

The existing integration with `export()` (returning `_maskInstance.unmaskedValue`
when available) and `import()` (dispatching `input` event) remains unchanged.

#### List Item Masking — Automatic

When a list clones a new item, the item's `data-smark` is processed as part of
`render()`. If any field in the cloned item has `{"mask":"creditCard"}`, the
mask function is looked up from the registry and applied — no manual
intervention needed.

This is the key advantage over the current `.mask()` approach.

#### Singleton Handling

Same as current: singleton components delegate mask to their inner field. The
`mask` property on a singleton is treated identically — the inner field's
render applies the mask.

#### HTML Input Type

When a mask is applied, the input's `type` is changed to `"text"` (if not
already). Original type is not restored — masking is permanent.

#### Error Handling

Configurable via `SmarkForm.maskConfig` (or similar global option):

```javascript
SmarkForm.maskConfig = {
    throwOnMissing: true  // default: throw; set to false to only warn
};
```

When `throwOnMissing` is `true` (default), referencing an unregistered mask
name throws an error — catching it during development. When `false`, a
console warning is emitted and the field is left unmasked.

#### Implementation Steps (Draft)

1. Add `SmarkForm._maskRegistry = {}` and `SmarkForm.maskConfig` in `main.js`
2. Add `SmarkForm.registerMask(name, fn)` static method
3. In the constructor or init phase, scan for `<script type="smark-mask">` tags and register them
4. In `input.type.js` at the end of `render()`, check `me.options.mask` and apply
5. Modify `export()` (already checks `_maskInstance`) and `import()` (dispatch `input` event) — reuse existing logic
6. Mixin system: when expanding a mixin template, its local `<script type="smark-mask">` definitions are merged into the expansion's mask scope, taking precedence over the global registry during that mixin's lifetime
7. Remove the old `.mask()` method from `input.type.js`
