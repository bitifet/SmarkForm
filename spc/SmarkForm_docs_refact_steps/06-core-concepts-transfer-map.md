# Step 06 — Core Concepts Transfer Map

**Status:** The canonical page was reordered and reviewed. The original source
remains unchanged at `docs/_old_getting_started/old_core_concepts.md`; this file
records the editorial decisions and sampletab boundary.

## Section and anchor map

| Legacy section / locator | Step 06 destination | Decision |
|---|---|---|
| `Forms, Lists and (other) Fields` | `Map forms, lists, and fields to values` (`#forms-lists-and-other-fields`) | Kept the mental model and examples; corrected “any imaginable JSON” and unqualified depth wording. |
| `Fields`, `Form nesting`, `Lists` | Same-named sections in the mapping chapter | Preserved examples and demo values; clarified object vs array mapping. |
| `Component Types`, `Labels`, `Triggers`, `Actions`, `Triggers target` | `Actions, triggers, and component paths` | Retained short overviews; moved detailed context/path/target semantics to the Trigger and Form Traversing references / Step 07. Legacy anchors remain, including `#triggers`, `#actions`, and `#triggers-target`. |
| `Behaviour tunning` | `Wildcard list targets` (`#behaviour-tunning`) | Removed stale `to` spelling and malformed JSON examples; retained a short `target:"*"` / `preserve_non_empty` note with a List reference link. |
| `Constraining lists`, `Singletons` | Same-named sections in the mapping chapter | Kept their distinct sample and clarified `min_items`, `max_items`, and scalar singleton output. |
| `Addressability`, `Accessing Components` | `Accessing components` | Removed the pre-render `find()` example and null-HTML placeholder. Added `await myForm.rendered` before a relative component lookup and linked to Form Traversing. Preserved the relevant anchors. |
| `The data-smark Attribute` and its syntax sections | `Marking components with data-smark` | Moved ahead of value mapping, preserved old fragment IDs, and clarified valid JSON, inference, literal prefixed-option suffixes, normalization limits, and precedence. |
| Duplicate `Components and Actions` prose | Merged into the new Actions section | Preserved `#components-and-actions`, `#components`, and the duplicate `#actions-1` fragment; removed duplicated definitions. |
| `More...` | `Next steps` (`#more`) | Replaced with links to Using SmarkForm, Component Reference, Form Traversing, and Trigger. |

## Sampletab inventory and decisions

All eight include IDs remain in the canonical page. Each continues to use
`tests=false`; where a `demoValue` is present, the collector can generate its
standard round-trip smoke test.

| `formId` | Step 06 status |
|---|---|
| `simple_form` | Preserved; updated notes prompt export/import exploration. |
| `context_comparsion_simple` | Preserved and moved next to the Actions overview; notes now describe the field/form comparison without claiming a missing prompt handler. |
| `nested_forms` | Preserved; fixed the native email type typo and clarified nested object mapping. |
| `fixed_list` | Preserved; replaced stale notes with the verified `min_items` / `max_items` / `of` behavior. |
| `pets_list` | Preserved; corrected the duplicate option value and malformed capture fold marker. |
| `core_remove_inside_item` | Preserved under Trigger targets; it remains a compact list-item action example. |
| `core_singleton_phones` | Preserved under Singletons. |
| `components_paths` | Preserved as the sampletab anchor, but upgraded from `htmlSource=null` to a runnable nested form/list model with HTML, JS, notes, and demoValue captures. It now anchors the opening component-tree explanation. |

The `components_paths` demo exports the same nested value shown in the page:

```json
{
  "profile": {
    "name": "Ada Lovelace",
    "contact": { "email": "ada@example.com" }
  },
  "skills": ["mathematics", "computing"]
}
```

## Capture and test inventory

The 17 pre-existing capture declarations and their sampletab associations remain
present: `simple_form_example`, `simple_form_example_notes`, `demoValue`,
`context_comparsion_example_simple`, `notes`, `nested_forms_example`, `notes`,
`demoValue`, `fixed_list_example`, `fixed_list_example_notes`, `demoValue`,
`pets_list_example`, `pets_list_example_css`, `pets_list_example_notes`,
`demoValue`, `core_remove_inside_item_html`, and `core_singleton_phones_html`.
The repeated `notes` and `demoValue` capture names are intentional; the collector
processes captures in document order.

Step 06 adds four captures for the upgraded model sample:
`core_concepts_model_html`, `core_concepts_model_js`,
`core_concepts_model_notes`, and `core_concepts_model_demoValue`. The page has
eight sampletabs, all with `tests=false`; seven have demo values and are eligible
for the collector-generated round-trip test. No pre-existing custom test was
removed.

## Verified wording changes

* The tree follows marked components and their relationships, not arbitrary
  layout wrappers; the root is implicitly a form component.
* Forms map to objects, lists to arrays, and each field type has its own scalar
  value contract. The page links to Value Coercion and type references rather
  than cloning their detailed option tables.
* `data-smark` syntax progresses from inferred/bare to type shorthand to JSON
  options and prefixed attributes. Option suffixes map literally; public option
  names use `snake_case`; prefixed attributes override JSON options.
* The former `minItems` example and “to” target language were corrected or
  removed; JSON examples are valid and current.
* Detailed context, target, wildcard, and path behavior is intentionally
  deferred to Step 07's canonical reference work.

The source `_old_getting_started/old_core_concepts.md` was not edited or deleted.

## Verification

* Jekyll build succeeded with the locally available Ruby bundle.
* The rendered Core Concepts page contains eight sampletabs, including the
  upgraded `components_paths` nested example and its realistic demo value.
* Same-page TOC fragments and local links/fragments on Core Concepts, Quick
  Start, FAQ, and Form Traversing resolve in the built site.
* The canonical Core Concepts route is in the sitemap; `/old/` is not.
* Node/npm are unavailable here, so the docs collector, Playwright sample tests,
  and the generator's real Node execution were not run. Re-run them when Node is
  available; the generated TOC include is ignored build output.
