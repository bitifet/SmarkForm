# SmarkForm Mixins --- Specification (v1 Draft)

## 1. Concept

A **mixin** is a SmarkForm component type that: - Is **non-field**. It's
required to be devined over a `<template>` tag. It's purpose is to register a
**new component type**.

------------------------------------------------------------------------

## 2. Declaration

### Inline

``` html
<template data-smark='{
  "type": "mixin",
  "name": "_example"
}'>
  ...
</template>
```

### External

``` html
<template data-smark='{
  "type": "mixin",
  "name": "_example",
  "src": "example.html"
}'></template>
```

------------------------------------------------------------------------

## 3. Naming

-   Must be unique in scope
-   Recommended to start with `_`
-   Must not collide with native types

------------------------------------------------------------------------

## 4. Base Path Resolution

Each component has:

    component._basePath

Rules: - Root → document.baseURI - Mixin from `src` → directory of src -
Children inherit from parent

Resolution walks up parents until basePath is found.

------------------------------------------------------------------------

## 5. Registry Model

Each component has its own registry:

    component._mixinRegistry = Object.create(parent?._mixinRegistry || null)

-   O(1) lookup
-   Natural shadowing
-   Scoped to descendants

------------------------------------------------------------------------

## 6. Registration

-   Mixins are registered when their container is processed
-   Available only to the same context and descendants

------------------------------------------------------------------------

## 7. Loading Strategy

-   Triggered when mixin is processed
-   Default: `"preload": true`

Order: 1. preload=true 2. preload=false

- This gives priority to preload=true, preload=false are also preloaded but after all preload=true have been attempted. This allows for a "best effort" approach to loading resources early without blocking the main thread on non-critical resources (for instance, components that won't be rendered until an item is added to a list that starts with zero items).

------------------------------------------------------------------------

## 8. Resource Cache

    Map<src, Promise<DocumentFragment>>

-   Fetch once
-   Parse once
-   Shared across mixins with the same `src` value.

------------------------------------------------------------------------

## 9. External Multi-Mixin Files

-   Multiple mixins allowed
-   Select by matching `name`
-   Fallback: single unnamed template
-   Otherwise: error

------------------------------------------------------------------------

## 10. Template Structure

-   Must resolve to **single root element**
-   Allowed inside:
    -   HTML
    -   SmarkForm components
    -   `<style>`
    -   `<script>`

------------------------------------------------------------------------

## 11. CSS Handling

-   Extract `<style>`
-   Inject once into `<head>`

------------------------------------------------------------------------

## 12. JS Handling

-   Extract `<script>`
-   Wrap into function
-   Execute at end of component `render()`

```{=html}
<!-- -->
```
    fn.call(componentInstance, context)

------------------------------------------------------------------------

## 13. Expansion

At render:

1.  Resolve mixin
2.  Await loading
3.  Clone template
4.  Replace node internally
5.  Continue rendering in place

------------------------------------------------------------------------

## 14. Nested Mixins

-   Fully supported
-   Use inherited registry

------------------------------------------------------------------------

## 15. Circular Dependencies

-   Must be detected
-   Throw error if found

------------------------------------------------------------------------

## 16. Data Model

-   Mixins expand into normal components
-   No naming collisions due to SmarkForm's hierarchical structure

------------------------------------------------------------------------

## 17. Open Questions

-   Script API shape
  - Receives new coponent instance as `this`.
-   Multiple `<script>` / `<style>`
  - No: One `<script>` and one `<style>` per mixin
-   Exact render timing
  - Needs to analyze where best fits in the SmarkForm render lifecycle
-   Error handling policy
  - Most probably just same as the rest of SmarkForm components.
-   Ordering constraints
  - Consider forcing mixins to come before any other component of a form (or list) throwing error if another component type already rendered.
  - This ensures all mixins defined before any component that might use them, and also simplifies the implementation by avoiding the need to handle late mixin definitions.
-   Single root strictness
  - Consider allowing other HTML content (comments, documentation, etc...) outside the component.
  - Only one root component per template. Name (if given) must match the provided in the `<template>` tag.
  - For external files, multiple `<template>` tags allowed. Whole file loaded in a newly created `<template>` then the appropriate (same or no 'name' property) inner template is picked and inserted into the component's `<template>`tag. The newly created `<template>` tag is kept indexed by the value of the 'src' property just in case another mixin references the same file. After the whole SmarkForm form initial render finishes, that cache is cleared to free memory.
-   Script safety

------------------------------------------------------------------------

## 18. Design Principles

-   DOM-first
-   Declarative
-   Scoped
-   Async-safe
-   No external templating

