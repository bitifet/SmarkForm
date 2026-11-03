# Step 12 — Component Reference Foundation Transfer Map

**Status:** The Component Reference collection was already registered and
ordered in Step 03. Step 12 finalized its overview and Developer Cheatsheet,
confirmed the existing nav sequence, added a concise built-in type index, and
updated links to reflect the component tree and current implementation. The
staged legacy pages remain unchanged.

## Page review and dispositions

| Source / canonical destination | Material and disposition | Step 12 accuracy/link work |
|---|---|---|
| `_getting_started/core_component_types.md` → `docs/_component_reference/overview.md` | Replaced the long taxonomy/tutorial page with an orientation map, type/value table, concise singleton summary, links, and one new object/list example. | Retained key legacy fragment IDs (`core-component-types`, `complex-field-types`, `scalar-field-types`, `type-input`, `type-number-and-type-date`, `type-color`, `type-select`, `non-field-component-types`, `type-trigger`, `type-label`, `the-singleton-pattern`). Distinguished all registered built-ins from native `<select>` (which uses `input`) and the planned-only remote Select proposal. |
| `_resources/cheatsheet.md` → `docs/_component_reference/cheatsheet.md` | Kept the original quick-reference sections and useful code examples; added Video and Audio quick references and completed the registered type inventory. The page retains its generated depth-3 TOC and old `/resources/cheatsheet` redirect. | Fixed instance variable examples to `myForm`; corrected action vs direct-method distinctions, list `count`/`position`/`move`, `import(undefined)`, and hotkey Tab behavior; clarified native `select`, mixins, and planned API Interface; linked media references and Value Coercion; retained concise type/API detail rather than duplicating chapters. |
| `docs/_config.yml` / Component Reference navigation | Collection key already exists at nav order 5, with output and `sort_by: nav_order`; no config change was needed. Overview remains nav 1 and Cheatsheet nav 18, matching the approved route map. | Rendered sitemap/sidebar checks confirm both public pages appear at their clean routes; old aliases remain excluded from the sitemap. |

## Legacy overview sample dispositions

The former overview's six sampletabs were not carried forward as six redundant
type tutorials. Their distinct jobs now have authoritative destinations:

| Old sample | Disposition |
|---|---|
| `input_example` | The built-in `input` type is indexed here; native field usage remains in the Input reference and Start Here examples. |
| `no_singleton_example` | The context contrast is summarized in the new singleton paragraph; detailed behavior lives in the Singleton Pattern guide and Trigger reference. |
| `singleton_example` | The wrapper pattern is summarized and linked to the full Singleton Pattern guide; type-specific color behavior remains in the Color reference. |
| `number_and_date_example` | Separate Number and Date references are linked from the inventory; the overview no longer repeats their conversion APIs. |
| `color_example` | The Color reference remains canonical for options and behavior. |
| `clear_others_example` | `clear` is indexed in the Cheatsheet and fully described with `reset` in Data Import and Export; the overview drops the duplicate multi-field sample. |

The new sample, `component_tree_overview`, shows a form object with a nested
list of task objects. Its `demoValue` enables the collector-generated value
round-trip smoke test. Captures: `component_tree_overview_html`,
`component_tree_overview_js`, `component_tree_overview_notes`, and
`component_tree_overview_demoValue`; `tests=false` is retained.

## Cheatsheet detail coverage

The original Constructor Options, `data-smark`, Component Types, List Template
Roles, Actions, Context & Target Resolution, Event System, Data Import / Export,
File Fields, Image Fields, API Methods, Hotkeys, Form Submission, and Quick
Templates sections remain. Video and Audio Fields is new. No static code
example was removed from the Cheatsheet.

The type index was checked against `src/main.js`: the registered built-ins are
`form`, `list`, `input`, `number`, `date`, `time`, `datetime-local`, `color`,
`radio`, `file`, `image`, `video`, `audio`, `trigger`, and `label`. It explains
that `<select>` maps to `input`; the separate dynamic Select proposal remains
planned and unimplemented. Mixin references are described as a reusable
template feature rather than another registered built-in type.

The action summary was checked against decorators and methods: `count` and
`position` are list actions, `move(options)` is a list method rather than an
action, `sort` is not a built-in action, and media exposes the documented
`download`, `rename`, and (video/audio) `pick` actions. The hotkey note now
limits automatic `tabindex="-1"` behavior to list `addItem`/`removeItem`
triggers when no value was authored.

## Cross-reference updates

Updated current links from the overview to the Singleton Pattern guide, and
from FAQ, Showcase, AI Forms, and scalar component references to the canonical
overview or singleton guide. Existing Core Concepts, Quick Start, Using
SmarkForm, Features, and Roadmap links already used the approved overview or
Cheatsheet routes and remain valid. Staged `/old/` sources were left untouched.

## Verification

* `docs/_component_reference/overview.md` and `cheatsheet.md` have canonical
  titles, descriptions, permalinks, and nav order; migration/sitemap staging
  flags are removed. Existing redirect aliases remain.
* Generated `overview.html` and `cheatsheet.html` TOCs were refreshed. The
  Cheatsheet declares `depth=3`, matching `scripts/validate-cheatsheet.js`.
* Jekyll build and rendered public-link/fragment scan pass. Both pages are
  indexable and in the sitemap; their old aliases are not sitemap entries.
* A local Python check verified that every cheatsheet `relative_url` target
  exists and every generated TOC fragment points to a rendered heading.
* Node/npm are unavailable, so `scripts/validate-cheatsheet.js`, the collector,
  and Playwright were not run. Their later run remains with the user.
