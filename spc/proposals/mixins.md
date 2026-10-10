# SmarkForm Mixins — Future Proposals (C & D)

> **Status:** design / proposal document — **not implemented**. It complements
> the as-implemented specification `spc/mixins.md`, which already covers
> proposals **A** (per-document base path) and **B** (eager preloading).
>
> This file records two **optional evolutions** of the mixin feature. Neither is
> a blocker for anything, and neither has a dependent feature. They are kept so
> that, if pursued later, the analysis and open questions start from full
> context rather than from scratch.

Related sources:

- `spc/mixins.md` — as-implemented specification (baseline for both proposals).
- `src/lib/mixin.js` — expansion engine.
- `src/lib/component.js` — integration and option threading.
- `docs/_advanced_concepts/mixin_types.md` — user guide.

---

## Status at a glance

| # | Proposal | Summary | Priority | Compatibility | State |
|---|---|---|---|---|---|
| A | Per-document base path | References resolve against their **source document** (page or external file) | — | — | **Implemented** |
| B | Eager preloading (`preload`) | External mixin docs are prefetched at root render | — | — | **Implemented** |
| C | Scoped registry / shadowing | Per-subtree mixin namespaces with nearest-wins lookup | Low–moderate | Opt-in (`smark_mixin_scoped`) | **Pending** |
| D | `placement` option | `"nest"` keeps caller content inside the clone | Moderate (ergonomics) | Opt-in (default `"replace"`) | **Pending** |

A and B are folded into `spc/mixins.md`. This document covers **C** and **D**
only.

---

## C. Scoped mixin registry / shadowing

### C.1 Current behaviour (baseline)

Per `spc/mixins.md` §2 and §4:

- **Local references** (`"#id"`) resolve with `getElementById()` against the
  **source document**: the main document at the top level, or the fetched
  external document for references that appear inside an external template
  (via the inherited `_mixinBase`).
- HTML `id` values are **document-global**. There is no per-subtree namespace
  and no shadowing: two `<template>` definitions cannot share an `id`
  (duplicate ids are invalid HTML and `getElementById` returns the first match).
- Mixin templates are plain `<template id="…">` elements, conventionally at
  document level. SmarkForm does **not** register them; they are looked up *on
  demand*, lazily, when a placeholder is enhanced.
- **External references** (`"url#id"`) are file-scoped but flat: an `id` is
  resolved within the fetched document; there is no namespacing beyond the URL.
- Consequence: there is **no encapsulation**. Every local template is visible
  to the entire page, and a third-party widget library's template ids can
  collide with the host page's ids.

### C.2 Proposed change

Introduce a **per-component registry** populated as containers are processed,
and change local resolution to walk it before falling back to the global
document:

- Each component holds a registry inherited from its parent
  (`Object.create(parent?._mixinRegistry || null)`), giving O(1) lookup,
  natural shadowing (nearest definition wins) and descendant-only visibility.
- A local template declared **inside a subtree** is registered only for that
  subtree and its descendants, instead of being globally reachable by id.
- The lookup key must be chosen: the template `id` (today's key) or a dedicated
  *mixin name* (`<template data-smark='{"type":"mixin","name":"…"}'>`). Names
  decouple mixin names from HTML ids but add a declaration surface.
- External documents need a scoping rule too: templates from a fetched document
  could be registered into the importer's scope, optionally namespaced by URL.
- **Registration timing** becomes first-class: templates must exist before a
  reference is resolved, reintroducing ordering constraints (or a pre-scan).
- Lookup order becomes: local registry (nearest → root) → global document
  lookup (back-compat) → external document.

### C.3 Rationale (pros)

- **Encapsulation / no global namespace pollution**: a library can ship
  templates that cannot collide with the host page or another library.
- **Shadowing / specialisation**: a subform overrides a shared template for its
  own subtree without touching the global definition.
- **Private variants**: independent instances of the same widget can use
  different private templates.
- **Better composability** for large, multi-team apps and third-party widgets
  where a shared global id space is a real constraint.

### C.4 Costs (cons)

- **Significant complexity**: registry construction, registration timing,
  lookup order, and interaction with `_mixinBase`, external documents and the
  cycle chain (§11).
- **Fights HTML semantics**: `id` is inherently document-global (labels'
  `for=`, anchors, CSS `#id`, accessibility tooling). "Scoped ids" would be a
  SmarkForm-only concept that can surprise authors and tools.
- **Backward-compatibility risk**: existing forms rely on document-level
  `<template id="…">` being globally visible; scoped-first lookup must keep the
  global fallback, and subtle ordering differences could surface.
- **Weakens a current strength**: lazy, on-demand resolution gets harder when
  definitions must be registered ahead of use.
- **Limited marginal value**: unique ids plus external files already solve most
  cases; the feature mainly pays off in large, multi-team codebases.
- **Documentation / mental-model cost**: authors must understand two resolution
  models (global ids vs scoped names) and their precedence.

### C.5 Open questions

1. Lookup key — HTML `id`, or a dedicated mixin *name* on the template?
2. Should scoped templates be declared anywhere in the subtree, or only via an
   explicit registration element/attribute?
3. How does the registry interact with `_mixinBase` when the declaring subtree
   came from an external document?
4. Do external documents register into the importer's scope, and are they
   URL-namespaced by default?
5. What is the ordering contract (declare-before-use vs pre-scan)?
6. Opt-in switch shape (`smark_mixin_scoped: true`) and default.

### C.6 Verdict

*Low-to-moderate priority.* Genuinely useful for encapsulation and overrides,
but it introduces a second resolution model and weakens the simple "global
`<template id>`" mental model. If pursued, it should be **opt-in** so existing
global lookups keep working unchanged.

---

## D. `placement` option (`"replace"` | `"nest"`)

### D.1 Current behaviour (baseline)

Per `spc/mixins.md` §5 and §7:

- Expansion **always replaces** the placeholder with the template clone
  (`node.replaceWith(clone)`). From the rest of the pipeline the placeholder
  never existed.
- The placeholder's children are consumed **only** as snippet parameters
  (`data-for`); any other children are discarded together with the placeholder.
- Content customisation is done by marking slots inside the template with an
  `id` and supplying `data-for="<id>"` replacements at the usage site. Surviving
  slots are converted from `id` to `data-id`.
- The user guide already flags this as a future option
  (`docs/_advanced_concepts/mixin_types.md`): a `"placement"` option could allow
  `"nest"` in addition to the default `"replace"`; v1 supports `"replace"` only.

### D.2 Proposed change

Add a `placement` option on the mixin reference (default `"replace"`):

- **`"replace"`** (current): the clone takes the placeholder's place.
- **`"nest"`**: the clone is inserted and the caller's projected content is
  **retained inside the clone**, letting the usage site pass arbitrary content
  without pre-declaring `data-for` slots.

The change is conceptually small but raises design questions that must be
settled first.

### D.3 Rationale (pros)

- **Content projection**: pass markup into a mixin without declaring ids and
  `data-for` slots — simpler for ad-hoc, caller-supplied content.
- **Natural for wrapper/layout components** (card, panel, section, fieldset)
  whose body is exactly what the caller provides.
- **Reduces id usage in templates**, which the docs already discourage.
- **Additive and low compatibility risk**: opt-in, default `"replace"`
  untouched.

### D.4 Costs (cons)

- **Underspecified semantics**: without a slot convention it is ambiguous where
  content goes, and different components need different injection points.
- **Overlaps with `data-for`**: two content mechanisms in the same feature can
  confuse authors and complicate the docs.
- **Implementation surface**: neutralising the placeholder, merging projected
  content, id handling, and interaction with singleton/list/label detection.
- **Mental model shift**: in `"nest"` mode the placeholder element is no longer
  the component root, which is easy to forget while debugging.
- **Rendering/lifecycle subtleties**: projected nodes are ordinary DOM that the
  component's renderer walks; ordering and re-render semantics need care.
- **Documentation/maintenance cost** grows for a feature most authors can
  emulate today with a `data-for` slot.

### D.5 Open questions

1. **Where does projected content land?** Into the clone root, or into a
   designated slot (e.g. `data-slot="default"`)?
2. **How is the placeholder neutralised?** It carries the mixin `type`; keeping
   it verbatim would re-trigger expansion. Its `type` must be consumed and the
   element either stripped of `data-smark` or replaced by its children.
3. **Precedence vs `data-for`** when both are present.
4. **Enhancement of projected children**: projected markup may itself carry
   `data-smark` and should presumably be enhanced as normal components.
5. **Option/attribute merging and ids**: `name`/`type` merging (§6) and the
   `id`→`data-id` conversion (§7) must account for projected content.
6. **Lifecycle**: the clone root is the component; projected content becomes its
   children, affecting singleton/label/list detection and render order.
7. **List interaction**: inside a list, the placeholder is part of an item
   template (a role); `"nest"` must not disturb role detection or the
   list-placement warning.

### D.6 Verdict

*Moderate priority, ergonomics-only.* A nice authoring convenience and low-risk
because it is opt-in, but it needs a concrete slot design (and a clear
relationship with `data-for`) before implementation. The explicit `data-for`
mechanism already covers targeted replacement, so this should be justified by
concrete "wrapper component" use cases.

---

## Interaction between C and D

Both proposals are additive and independent; they can be adopted separately. If
both land, the `placement` option (§D) is per-reference and has no bearing on
the resolution registry (§C), so no ordering constraint is introduced between
them.

## Decision log

| Date | Decision |
|---|---|
| 2026-10-05 | Spec rewritten to as-implemented; A and B folded in; C and D split out into this file. |
| 2026-10-10 | Proposals moved from `spc/mixins-proposals.md` to `spc/proposals/mixins.md`; reframed as evolutions of the current status. Still not implemented. |
