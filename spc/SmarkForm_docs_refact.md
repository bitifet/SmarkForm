# SmarkForm Documentation Refactoring Plan

**Status:** Draft for maintainer review — planning only; no documentation
refactoring is authorized by this plan itself.

**Review input:** `tmp/SmarkForm_external_review.md` (read in full, 2026-10-26).
**Plan revision:** 2026-10-27 — incorporates the maintainer's earlier Showcase
work and temporary old-content staging approach.

## 1. Purpose

Improve how quickly a new reader understands SmarkForm's central idea and finds
the right next step, while preserving the project's valuable explanations,
working examples, caveats, and technical references. The external review is a
useful outside perspective, not an authoritative description of the current API
or documentation. Recommendations below are checked against the current
`doc_refact` branch and should be re-verified against implementation/tests when
the actual edits begin.

The goal is **a clearer path through the existing material, not a smaller
documentation set at any cost**. Existing content must have an explicit
destination before any extraction, consolidation, or deletion is proposed.

## 2. Guardrails

1. **No silent content loss.** Before editing a page, inventory its prose,
   code captures, notes, CSS, JavaScript, demo data, and co-located tests. Map
   every useful item to a retained or revised destination. If a passage appears
   redundant, preserve its distinct technical detail and remove only genuinely
   repeated explanation after review.
2. **Keep examples executable and testable.** Sampletabs examples are product
   documentation and test fixtures, not disposable illustrations. Preserve
   their HTML/CSS/JS, realistic `demoValue`, notes, `smarkformOptions`, and
   custom tests unless a separately reviewed change replaces them with an
   equal-or-better tested example. Keep capture/fold conventions and playground
   requirements in `AGENTS/Documentation-Guidelines.md` and
   `AGENTS/Documentation-Examples.md`.
3. **Keep detailed references.** A short beginner path may link to an existing
   full guide; it must not replace component references, API details, edge
   cases, migration caveats, security guidance, or media/mixin documentation.
4. **Describe implemented behavior only.** Check claims against current source,
   specs, tests, and roadmap. Clearly label planned capabilities. In
   particular, do not imply built-in schema validation, a React/Vue wrapper,
   generated API metadata, or shareable playground URLs exist.
5. **URLs may change, but links must not be abandoned.** This is a pre-1.0
   project and the final information architecture may justify new permalinks.
   Decide the final route map before moving pages. Update internal links,
   navigation and fragments; provide redirects/aliases for old public URLs
   where practical. During parallel review, assign every legacy page a unique
   temporary permalink so old and new output can coexist without collisions.
6. **Retain SmarkForm's actual model.** HTML supplies the view and declarative
   component description; SmarkForm builds a component/field tree; forms and
   lists export structured values. DOM layout remains author-controlled. Do not
   suggest that arbitrary DOM nesting is itself the data model.
7. **Keep the site honest and balanced.** Distinguish structure/interaction
   management from validation, semantics, backend behavior, and styling. Explain
   native HTML behavior where SmarkForm relies on it.

## 3. What the review gets right — and what needs qualification

### Adopt as documentation goals

- Explain the **problem and mental model before the feature vocabulary**:
  HTML with `data-smark` describes a component tree; named fields, nested forms,
  and lists map naturally to objects and arrays; import/export moves structured
  data through that tree.
- Make the first successful example short and concrete, then let readers choose
  the fuller guided material or the API/reference route.
- Introduce the component-tree and action-context ideas visually, with accurate
  examples. Keep `context` and `target` distinct.
- Explain why the JSON options object exists alongside the lighter forms of
  `data-smark` syntax, rather than presenting JSON-in-HTML as an unexplained
  oddity.
- Reduce repeated explanations of the documentation playground. Explain its
  controls once per relevant reading context, then focus each example's notes on
  the SmarkForm behavior it demonstrates.
- Make claims about accessibility, validation, compatibility, and bundle size
  specific and verifiable instead of relying on broad feature labels.

### Adapt to the current project (do not copy verbatim)

- The homepage already has a substantial interactive **Event Planner** example,
  a nested-JSON explanation/diagram, and links to the Showcase, Quick Start,
  and downloadable examples. The Introduction already contains the Event
  Planner and a React/Vue comparison. The Showcase already has both a
  three-level school groups → students → grades example and a nested hotel
  schedule/mixin example. Therefore, first improve hierarchy and signposting;
  do not assume these examples need to be newly created or replaced.
- The current `quick_start.md` is a roughly 1,000-line tutorial. It includes
  useful examples and explanations for actions, import/export, events,
  traversal, context/target, lists, hotkeys, and setup. Replace it with a
  focused first-use path; transfer material that adds distinct value to its
  canonical existing pages, and do not keep or recreate a long tutorial merely
  to avoid deleting redundant content.
- `core_concepts.md` already documents shorthand forms: bare `data-smark`, a
  string type such as `data-smark="label"`, and `data-smark-*` options. Improve
  discoverability and progression; do not present these as newly invented
  syntax or imply that all options can be expressed without JSON in every
  situation.
- Context is not simply “ignore my immediate context and address X.” Natural
  context is resolved by walking ancestors to the nearest component that
  implements the action. An explicit `context` path starts at the trigger's
  enclosing field (triggers are not path nodes) and must resolve to a component
  that implements the action. A `target` path is resolved from the effective
  context, with action-specific semantics. Diagrams and examples must retain
  these distinctions and the existing wildcard/list behavior.
- Do not promise that SmarkForm automatically validates fields. Current docs
  say built-in validation is not implemented; the FAQ documents native HTML
  constraint validation, `BeforeAction_*` hooks, and native form submission.
  Reconcile conflicting/outdated wording (including the Quick Start claim that
  SmarkForm handles “validation”) in favor of verified behavior.
- The feature page currently includes future/incorrectly worded statements
  (for example, “automatic” list sorting coming soon despite working sortable
  lists, and inconsistent JSON/bundle claims). Audit and correct these against
  tests and current references before deciding what to retain.
- The introduction's framework comparison already exists. Keep a brief answer
  to the common newcomer question in the Introduction and move the fuller
  comparison to the proposed **When SmarkForm Fits** page. Review examples and
  metrics for fairness, currency and caveats; do not make the comparison a
  central product argument.

### Defer from this documentation-only effort

The review's suggestions for TypeScript declarations, a schema/validation
system, API metadata/code generation, URL-shareable playground state, and
framework adapters are product/engineering proposals, not documentation
refactoring deliverables. Do not create docs that imply these features exist.
If useful, record a separately scoped proposal in the project's planning system
after maintainer discussion. Accessibility audits or new product behavior also
need separate implementation/testing decisions; this plan only covers accurate
documentation of current behavior.

## 4. Current content inventory and preservation map

This is the initial inventory, based on the current `doc_refact` branch. During
implementation, make a more granular ledger of each source section and every
sampletabs capture/test before moving content.

| Current source / collection | Important material to retain | Planned editorial treatment |
|---|---|---|
| `docs/index.md` | Event Planner playground, field/data model graphic, features, status, community links | Lead with the core HTML-to-structured-data idea and a clear next step. Keep the interactive demo, supporting feature links, status, and community/footer material. Reorder before replacing. |
| `docs/_about/introduction.md` | Motivation, detailed Event Planner, SmarkForm/React/Vue examples, comparison tables/metrics/caveats | Use as the “why” narrative. Keep a concise neutral answer to the framework question and move the fuller comparison to **When SmarkForm Fits** after validating metrics and claims. |
| `docs/_about/features.md` | Feature explanations and cross-links | Reorganize into core model, developer benefits, and additional capabilities. Audit inaccurate/outdated statements, avoid repeating the entire introduction. |
| `docs/_about/showcase.md` (legacy long Showcase) | Accumulated interactive demos, source captures, CSS/JS, demo values, notes and explanations for features sometimes documented here before being ported to canonical pages | Treat as a source of valuable material, not as the intended final Showcase. Audit every feature, explanation, capture and unique behavior against canonical docs and the candidate final Showcase before retiring it. |
| `docs/_about/showcase2.md` (candidate Showcase) | Four denser, more visual examples: Just a Form, Project Kanban Board, Race Registration System, Product Configurator; includes `movingDepth`, wildcard multi-context actions, mixins, masking, hotkeys, events and feature summaries | Use as the primary design/content starting point for the intended short, visual Showcase, not as an assumed finished or fully accurate replacement. Verify claims and map legacy Showcase value into it or canonical pages. |
| `docs/showcase_analysis.md` and `AGENTS/Showcase-Restructure-Plan.md` | Earlier feature inventories, proposed destinations, previous decisions and gaps from an earlier consolidation | Reconcile against the actual legacy Showcase, `showcase2.md`, current docs and current implementation. Treat as valuable historical planning, not necessarily current truth; record which decisions still apply or are superseded. |
| `docs/_about/faq.md`, `roadmap.md` | Practical troubleshooting, submit behavior, defaults/reset, hotkeys, nulls, media/mixins, current/future status | Keep as discovery/reference destinations; align quick answers and feature status with canonical pages and implementation. |
| `docs/_getting_started/quick_start.md` | Short first-success material plus a roughly 1,000-line guided tutorial: setup, markup, triggers, data exchange, traversal, context/target, lists, hotkeys and more | Replace it with a concise first-use path. Curate its valuable sequential teaching material into a new **Using SmarkForm** guide at the start of Guides; link to that guide as the next step. Remove the old long page only after its content ledger is closed. |
| New `Using SmarkForm` guide | No current single page covers the complete developer learning path; useful sections are distributed across the old Quick Start and canonical references | Add a guided, practical developer tutorial based on valuable old Quick Start material. Explain the complete first build and the next steps, link to detailed Guides/Reference pages, and avoid copying their full APIs. |
| `getting_smarkform.md` | ESM/UMD, CDN, npm, download and GitHub options | Keep as the canonical installation/distribution reference; have the short path link here rather than duplicate all installation variants. Correct stale versions/examples if encountered. |
| `core_concepts.md`, `core_component_types.md` | Component/field tree, naming, values, nesting, lists, scalar types, singletons, shorthand syntax, triggers/actions, paths | Reorder from mental model → mapping to JSON → marking HTML → structural/scalar types → actions/addressing. Preserve distinct demos, but identify overlap with the dedicated component pages. Clarify draft/stale passages rather than silently omitting them. |
| `docs/_component_types/*` | Per-type options, actions, defaults, constraints and examples, including form/list/input, trigger/label, scalar and media types | Move into the new Component Reference collection. Do not collapse detailed pages into the overview. Audit claims; preserve examples and media details. |
| `docs/_working_with_forms/*` | Public API, data import/export, keyboard navigation, hotkeys, traversal, masking, coercion | Move task-oriented pages into Guides; move Keyboard Navigation and Hotkeys into Accessibility. Link from Using SmarkForm and relevant component pages. |
| `docs/_advanced_concepts/*` | Constructor, mixins, errors, animations, singleton, security, events | Move Events, Mixin Types, Singleton Pattern, and Animations into Guides. Keep only the Constructor, Security Considerations, and Error Codes in Advanced Concepts. Link prerequisites and preserve security/mixin details. |
| `docs/_resources/*` | Downloadable examples, end-user guide, cheatsheet, CDN/download, playground, AI resources and agent knowledge | Distribute into Showcase & Examples, Start Here, Component Reference, For End Users, and AI & Agents. Do not keep a generic Resources group unless the final inventory identifies a coherent set of pages that still needs one. |
| `docs/_community/*`, technical docs, presentations, assets/includes | Community, contributor guidance, build notes, presentations, site machinery | Keep the Community content in its own collection. Technical docs, presentations, and shared site infrastructure are not ordinary reader-facing sections. |

The component-type pages currently include `type_form`, `type_list`,
`type_input`, `type_trigger`, `type_label`, `type_radio`, `type_number`,
`type_date`, `type_time`, `type_datetime-local`, `type_color`, `type_file`,
`type_select`, `type_image`, `type_video`, and `type_audio`. Preserve the
distinctions among these types and their individual examples/options; the
beginner overview should not become their substitute. The working-with-forms chapters currently include
the API interface, data import/export, keyboard navigation, hotkeys, form
traversing, field masking, and value coercion. The proposed Guides collection
adds **Using SmarkForm** as the complete developer guide and moves Events,
Mixin Types, Singleton Pattern, and Animations from Advanced Concepts. The
current Advanced Concepts
pages include the constructor, mixins, error codes, animations, singleton
pattern, security considerations, and events; the proposed structure moves
mixins, events, singleton guidance, and animations into Guides, and keyboard,
hotkey, and labeling guidance into Accessibility.

### Quick Start transfer checklist

When shortening `quick_start.md`, account for each of these specific sections
and examples. This is a destination guide, not permission to delete a source
section; the implementation ledger should also record the capture IDs, notes,
and tests nested within each section.

| Existing Quick Start material | Intended treatment / destination |
|---|---|
| Basic setup, CDN load, local copy, npm/ESM/UMD links | Keep the shortest usable load/init path in Quick Start; move full distribution choices to Getting SmarkForm/CDN/Download. |
| Legacy plain-HTML example and initialized-but-unmarked version | Use in Using SmarkForm only if the contrast clarifies that initialization does not claim every element; otherwise record why the short Quick Start and Core Concepts make it redundant. |
| Marked-up simple form and clear/export trigger example | Retain a compact first-success version in Quick Start and use the richer tutorial sequence in Using SmarkForm; the two should have distinct instructional roles, not duplicate source verbatim. |
| Natural context, explicit context, per-field clear buttons | Introduce natural context briefly in Using SmarkForm; preserve relative-path and exact trigger semantics in Core Concepts / Trigger / Form Traversing. |
| Export button, `AfterAction_export`, import prompt and `BeforeAction_import` | Use a representative data-exchange step in Using SmarkForm; retain lifecycle detail in Data Import and Export / Events. Verify event casing and data flow. |
| `.find()` traversal examples and `rendered` timing warning | Use the simplest useful component lookup in Using SmarkForm; preserve callback/promise alternatives and timing detail in Form Traversing. |
| Context and target explanation; list add/remove and import/export target examples | Give Using SmarkForm the mental model and a simple example; preserve target-copy direction and detailed list/path semantics in canonical references. Do not merge `target` into `context`. |
| Confirmation-before-clear event examples and `isEmpty()` variant | Keep a concise event-driven example in Using SmarkForm only if it helps the guided workflow; put full patterns and conditional behavior in Events. |
| Hot Keys and Animated/sortable lists section headings and later telephone/schedule examples | Put the useful end-to-end sequence or example in Using SmarkForm where it advances the tutorial; put detailed hotkey, list, and animation rules in Accessibility, Guides, or Component Reference. Remove incomplete/redundant headings with a ledger decision. |
| Options object/event callback snippet | Preserve as a “next step” or reference link in Using SmarkForm and the event-registration pattern in Events; do not confuse constructor options with field `data-smark` options. |
| Boilerplate, local copy, package/CDN details | Consolidate with Getting SmarkForm / Download, preserving a clear route from Quick Start. |
| “You don't need a form tag” and native submit discussion | Reconcile with the current FAQ and form `submit` action. Preserve the distinction between an optional root element and actual supported native form submission; remove or correct the contradictory suggestion that `<form>` is discouraged only after verifying implementation. |
| Claim that SmarkForm handles “validation” | Correct to verified built-in behavior. Preserve the useful explanation of native browser constraints and custom validation via events in the appropriate reference; do not claim built-in validation exists. |

Similarly, the Showcase ledger should record at least the sampletab include,
all capture names, test code, and demo values for each example. In particular,
the school/groups example exercises cross-list movement and nested numeric
lists, while the hotel schedule demonstrates template roles, composed mixins,
per-instance scripts, and date suggestions; they are not interchangeable
“real-world form” showcases.

### Showcase-specific migration principle

The intended end state is a **shorter, more visual, feature-dense Showcase**;
it is not the current long Showcase copied with a few paragraphs removed. The
legacy page grew alongside sampletabs and became both a playground and an early
home for feature documentation. Some material has since been ported to
canonical pages, but completeness is not established. `showcase2.md` reflects
the maintainer's earlier design direction and is the starting point for the
final Showcase, subject to accuracy and coverage review. Reconcile the older
feature inventory against changes made since it was written, particularly
field masking and the `data-smark-*` option attributes, as well as Showcase
design additions such as `movingDepth` and wildcard context dispatch.

Use a three-way (and, where relevant, four-way) ledger for Showcase material:

1. **Legacy Showcase source:** exact section, heading, capture/include, notes,
   demo data and tests.
2. **Existing migration record:** corresponding row/decision in
   `docs/showcase_analysis.md` and `AGENTS/Showcase-Restructure-Plan.md`, if any.
3. **Canonical current destination:** the actual page/section/example already
   merged into this branch; verify the detail is complete, not merely mentioned.
4. **Candidate final Showcase:** `showcase2.md` example/feature summary, or a
   deliberate decision not to retain that material there.

The final Showcase should keep concise demonstrations and links, while
canonical pages carry complete explanations and reference detail. Porting a
paragraph is not enough if the destination lacks a useful interactive example;
porting an example is not enough if its distinctive behavior is unexplained.
Keep an interactive example in the final Showcase when it efficiently
demonstrates several complementary features. Do not force every legacy demo to
survive as a separate Showcase item: a denser final example or a tested example
in its canonical chapter may cover it, but the ledger must identify that
coverage precisely before removal.

Audit `showcase2.md` as a work in progress. Initial claims to verify include:

- “Auto-validates age vs. distance” in Race Registration: identify actual
  business-rule validation in the code/tests or remove/correct the claim.
- “Empty inputs produce `null`” in Just a Form: distinguish ordinary text
  empty-string values from nullable field types such as color/number/date.
- “Scoped” mixin CSS in Kanban/Product Configurator: mixin styles are global;
  class naming can limit their effects but does not provide CSS scoping.
- Kanban `movingDepth` explanation: describe the actual sibling-list/path
  relationship, not an assumed same-mixin rule unless verified in source/tests.
- Product Configurator mask output and use of Inputmask internals: verify the
  displayed value, clean exported value, and robustness of the example.

Use this initial candidate-example map to guide comparison with the legacy
Showcase; confirm the final source and destinations in the ledger:

| Candidate example | Dense feature combination to check for coverage |
|---|---|
| Just a Form | Field inference, named values, singleton wrapper, labels, color/null behavior, trigger context, playground import/export |
| Project Kanban Board | Mixins/slots, multiple lists, sortable handles, cross-list `movingDepth`, empty-list/header roles, wildcard context/target, `preserve_non_empty`, before-action confirmation, contextual hotkeys and list layout |
| Race Registration System | Lists of nested forms, previous-item duplication, position numbering, native collapsible sections and keyboard navigation, scalar coercion, radio/select/color, empty-item rules and hotkeys |
| Product Configurator | Reusable mixin templates, field masking/`unmaskedValue`, external mask library setup, sortable lists, cleanup triggers, keyboard hints and numeric mobile input mode |

This is a coverage checklist, not a claim that every item is correctly
implemented or currently working in `showcase2.md`.

### Temporary `old_` staging and URL migration

Use the maintainer's parallel approach so reviewers can compare complete old
content with the proposed structure before deleting anything. These `old_`
sections/pages are **temporary migration assets only**; they must be removed
before any refactored documentation is published or deployed.

1. Inventory and approve the new page/section structure and final canonical
   permalinks first. Treat `showcase2.md` as a candidate for the canonical
   Showcase and choose its final route as part of this map.
2. Rename **all existing user-facing sections and pages** with the temporary
   `old_` prefix, including Jekyll collection directories (for example,
   `_about` → `_old_about`) and page filenames (`old_<page>.md`). Register the
   corresponding old collection keys in `docs/_config.yml` and the legacy
   navigation, and register the new collections from the IA proposal. Keep
   shared `_includes`, `_layouts`, assets and site tooling out of this archive
   operation. Treat the root `docs/index.md` specially: retain a source copy
   under the temporary legacy collection and create the new `docs/index.md` for
   the canonical `/` route, rather than leaving the site without a root page.
3. Set explicit, unique temporary permalinks in each legacy page's front
   matter. File renaming alone is insufficient because existing pages often
   declare explicit `permalink` values. New pages receive their agreed final
   canonical URLs; temporary old pages use a separate path namespace so
   Jekyll never has two source pages writing the same output file.
4. During review, place the new sections/pages before a clearly labeled
   temporary legacy section in navigation. The legacy section is for local or
   branch review only, not a permanent archive. As an additional safety
   measure, exclude temporary pages from the sitemap and use `noindex` if the
   staging site can be exposed; the hard release gate remains removal of every
   temporary `old_` page/collection before publication.
5. Update all internal references and navigation after the route map is set.
   Links in legacy pages may point to another legacy page when preserving the
   old reading path is useful, or to the new canonical page when that is the
   intended current answer. Check both destinations deliberately. For old
   externally used permalinks that change, add and test redirects/aliases where
   practical; if a new canonical page retains an old permalink, no redirect is
   needed for that route.
6. Add paired HTML-comment migration markers at safe boundaries around each
   source portion and its destination, using the agreed `BEGIN old PORTED TO
   new_section_path` / `END old PORTED TO new_section_path` convention. For a
   portion deliberately not ported, mark it as reviewed/not-porting and record
   the rationale in the ledger rather than inventing a destination. Keep
   markers as comments **around** content, not as a comment wrapper that hides
   it. Do not insert marker text inside a Liquid capture in a way that changes
   captured example code or rendered output. For one-to-many and many-to-one
   transfers, list every source and destination in the authoritative ledger
   and repeat the relevant path in the markers. Use stable source locators
   (heading, capture/include name) in the ledger so comments remain verifiable
   after headings or URLs change.
7. Keep a migration ledger (source locator → destination locator(s) → status /
   decision / rationale) as the authoritative completeness check. Inline
   comments make progress visible in source; they do not replace the ledger.

The docs-example collector scans Markdown below `docs/`; each manifest example
ID includes its source file path as well as `formId`, so old and new pages can
be collected side by side without inherently colliding. Full example tests may
be deferred until the new content is in place as the maintainer prefers, but
keep Jekyll build, route/link checks, and collector parsing available as
structural checks during migration. Run the full relevant example and browser
test suites after legacy pages are removed and the new pages are final.

Before publication, remove every `old_` source page and temporary archive
collection, all temporary migration comments, temporary navigation entries,
and staging-only configuration. Then verify no generated output, sitemap,
navigation item, or link refers to a temporary route. If a final canonical URL
has changed from a previously public URL, retain a tested redirect/alias where
practical.

## 5. Proposed information architecture and reading paths

Retain useful detailed references while allowing the collection/section
structure, page names and canonical URLs to change when that improves
organization or discovery. Avoid collection churn that does not serve the new
reading paths. Make three distinct reading paths visible:

1. **See it:** Homepage → Showcase & Examples → downloadable examples.
2. **Use it now:** a compact Quick Start → installation and Core Concepts →
   Using SmarkForm for the fuller developer walkthrough.
3. **Build/reference it:** task-oriented Guides and Accessibility → Component
   Reference → Advanced Concepts when deeper internals are needed.

### Proposed documentation structure

This is the proposed **user-facing** structure, excluding temporary `old_`
staging copies. It deliberately changes the current collection taxonomy rather
than treating it as mandatory. The order follows two prominent newcomer paths
from the external review—“I want to see it” and “I want to use it”—then moves
from task guides to detailed references and advanced material. It also makes
the different audiences and AI-agent resources explicit. New names and URLs
should be finalized in the route map before the parallel migration begins.

```text
Home
│
├── Showcase & Examples                 (_showcase_examples)
│   ├── Showcase                         [based on showcase2.md]
│   ├── Downloadable Examples
│   └── Playground
│
├── Start Here                          (_start_here)
│   ├── Quick Start                     [short, first-success path]
│   ├── Getting SmarkForm                [installation overview]
│   ├── CDN
│   ├── Download
│   └── Core Concepts                   [component tree and HTML-to-data model]
│
├── Guides                              (_guides)
│   ├── Using SmarkForm                 [complete developer guide; successor to old long Quick Start]
│   ├── Data Import and Export
│   ├── Form Traversing
│   ├── Value Coercion
│   ├── Field Masking
│   ├── Events
│   ├── Mixin Types
│   ├── The Singleton Pattern
│   ├── Animations
│   └── API Interface                   [clearly marked planned, not implemented]
│
├── Accessibility                       (_accessibility)
│   ├── Keyboard Navigation
│   ├── Hotkeys
│   └── Accessible Labels and Names    [new]
│
├── Component Reference                 (_component_reference)
│   ├── Component Types Overview       [from Core Component Types]
│   ├── Form
│   ├── List
│   ├── Input
│   ├── Number
│   ├── Date
│   ├── Time
│   ├── DateTime-Local
│   ├── Color
│   ├── Radio
│   ├── Select
│   ├── File
│   ├── Image
│   ├── Video
│   ├── Audio
│   ├── Trigger
│   ├── Label
│   └── Developer Cheatsheet
│
├── Advanced Concepts                  (_advanced_topics)
│   ├── The SmarkForm Constructor
│   ├── Security Considerations
│   └── Error Codes
│
├── About SmarkForm                    (_about)
│   ├── Introduction
│   ├── When SmarkForm Fits             [new; fuller neutral comparison]
│   ├── Features
│   ├── Manifesto
│   ├── FAQ
│   └── Roadmap
│
├── For End Users                      (_for_end_users)
│   └── User Guide
│
├── AI & Agents                        (_ai_agents)
│   ├── AI & Agent Resources
│   ├── SmarkForm Forms                [agent reference]
│   └── SmarkForm Usage                [agent reference]
│
└── Community                          (_community)
    ├── Branding
    ├── Build in Public
    ├── Contact
    ├── Contributing
    ├── License
    └── Support
```

Project/site-maintenance material (`docs/README.md`, `CUSTOMIZATION.md`,
`testing-notes.md`), presentations, attribution notes, capture-only Markdown,
includes, layouts, and assets are not ordinary reader-facing chapters in this
tree. Keep them in their appropriate source locations unless a separate reason
justifies moving them. The current Resources collection is intentionally
disbanded: each page moves to the section matching its primary audience and
task. If implementation uncovers a remaining coherent resource category,
revisit that decision rather than retaining an empty or catch-all section.

The new **Using SmarkForm** guide is the developer-facing next step after Quick
Start. It should turn the useful old tutorial material into one coherent
end-to-end learning path, link out to authoritative details, and avoid
reproducing whole reference pages. Quick Start stays short and points to it.
The **Accessible Labels and Names** page synthesizes labeling/accessible-name
guidance from existing docs; the Label Component Reference remains the full API
page.

The section boundaries reflect reader intent rather than existing Jekyll
collections:

- **Showcase & Examples** is a visual discovery path, not an About subsection.
  It brings the compact Showcase together with runnable/downloadable examples
  and the Playground.
- **Start Here** gets a newcomer from a short first-success example to the
  installation details and mental model. **Using SmarkForm** then provides the
  fuller developer walkthrough without turning Quick Start into another long
  reference chapter.
- **Guides** explain how to accomplish tasks and compose the library. Mixins,
  events, singletons, and animations belong here because they are practical
  tools developers use to build forms, not obscure internals.
- **Component Reference** defines type-specific APIs. Its overview should orient
  readers and link to the per-type pages rather than restating their options.
- **Advanced Concepts** is intentionally limited to constructor behavior,
  security, and error-code diagnosis. Technical depth alone is not a reason to
  classify an everyday developer tool as advanced.
- **Accessibility** makes keyboard behavior and accessible naming discoverable
  together, while the end-user User Guide remains a separate audience path.
- **About SmarkForm** answers what the library is and when it fits. The fuller,
  neutral framework/approach comparison lives on When SmarkForm Fits, not at the
  center of the Introduction.
- **AI & Agents** groups the agent resource page with its Forms and Usage
  references. AI remains a secondary path, without hiding those references
  under a generic Resources section.

The former Resources collection is therefore distributed by task and audience:
examples and Playground go with Showcase; installation/download material goes
with Start Here; the Cheatsheet goes with Component Reference; the User Guide
goes with End Users; and agent material goes with AI & Agents. Do not recreate a
catch-all Resources section unless the final inventory reveals a coherent set
that otherwise has no natural home.

The existing component overview moves from Getting Started into Component
Reference as an orientation page. Component-specific references remain separate so a
short beginner route does not flatten their options, edge cases, or examples.
The `When SmarkForm Fits` page is the home for the fuller neutral comparison;
the Introduction may briefly answer “how is this different?” and link there,
but should not center its narrative on React/Vue comparisons.

The first explanation should be approximately:

> Keep your HTML and CSS. Mark the elements SmarkForm should manage. SmarkForm
> builds a component tree from that markup, so nested forms and lists can
> import/export structured objects and arrays.

Pair this with a small, runnable before/after model: named inputs become object
properties; a list's item template becomes an array of values/objects; nested
forms/lists compose. Make clear that this is not a schema renderer and the
author still controls markup, CSS, semantics, validation, and application
submission policy.

### Proposed page responsibilities

- **Home:** concise product identity, visible HTML ↔ SmarkForm ↔ JSON concept,
  existing Event Planner demo, then clear audience routes and secondary
  benefits. Keep the current status, community, download/example, and
  contribution destinations available.
- **Introduction:** explain the problem SmarkForm addresses and when it fits;
  distinguish it from framework rendering/state patterns without claiming it
  replaces frameworks. Keep a brief, neutral answer to the common framework
  question and link to the fuller **When SmarkForm Fits** page.
- **When SmarkForm Fits:** new, secondary decision page comparing approaches
  neutrally by source of UI, data/state model, strengths and tradeoffs. Keep the
  existing Event Planner comparison only after auditing equivalence,
  measurements, assumptions and limitations; do not use code-line counts or
  bundle size as universal proof that one approach is better.
  Organize it around questions a newcomer actually asks: when markup-first
  structured editing is a good fit, when a general-purpose UI framework or a
  schema-rendered form may be a better fit, and what each approach asks the
  application author to own. Compare approaches rather than presenting a
  React/Vue “versus” contest; treat any same-form comparison as illustrative,
  not a benchmark, unless methods and measurements are reproducible.
- **Quick Start:** teach only enough to make a form and export a useful value:
  load the library (or link to installation choices), mark a couple of fields,
  initialize, and show an object result. End with a clear “Next: Using
  SmarkForm” link. Avoid turning this page into the longer tutorial again.
- **Using SmarkForm:** provide the fuller sequential developer guide at the
  beginning of Guides. Migrate valuable old Quick Start material into an
  improved progression (a useful form, nested data/lists, actions and context,
  import/export, and where to go for customization). Use Core Concepts for the
  canonical mental model and link to detailed pages rather than reproducing
  their complete explanations or option tables. Make the developer audience
  clear so this does not read like the separate end-user User Guide.
- **Core Concepts:** serve as the concise conceptual/reference bridge: component
  tree, fields vs non-fields, JSON mapping, `data-smark` syntax and defaults,
  nesting, lists, and the accurate natural/explicit context and target model.
- **Core Component Types / per-type chapters:** concise orientation plus links
  to canonical pages; preserve detailed options and nuanced component
  behavior where authors expect to find it.
- **Showcase:** use the shorter, more visual, feature-dense direction already
  explored in `showcase2.md` (currently Just a Form, Kanban, Race Registration,
  and Product Configurator), after auditing its content and claims. Explain the
  shared interactive controls once, keep examples easy to scan, and use concise
  feature summaries/cross-links. Preserve valuable legacy Showcase material in
  canonical pages and/or the denser examples according to the migration ledger;
  do not treat the current long page as the desired final Showcase.
- **Accessibility:** group Keyboard Navigation, Hotkeys, and a new Accessible
  Labels and Names page. The new page should consolidate the accessibility
  implications of SmarkForm's label wiring and `aria-labelledby` support while
  preserving the Label type's API details in Component Reference.

## 6. Content and behavior decisions

### `data-smark` progression and rationale

Teach the least noisy syntax first (`data-smark`, inferred type/name, and
`data-smark="label"` where applicable), then `data-smark-*` for attribute-based
options, then JSON options for combinations and values that need structured
configuration. Explain the single-options-object design as a consistent,
portable configuration mechanism with shorthand alternatives. State actual
precedence and parsing rules accurately: prefixed attributes override matching
JSON-object options; their values are normalized according to the option type.
Do not imply that a new `data-smark-type`/`data-smark-name` API has been adopted
or that the current configuration syntax is being changed.

### Component tree, context, target, and paths

Use one diagram with a root form, named subform, list, repeated item, and a
nested field. Pair it with examples of:

- natural context (nearest ancestor that implements the requested action);
- explicit relative and absolute `context` resolution from the trigger's
  enclosing field component;
- the fact that triggers do not count as path nodes;
- action `target` resolution from the effective context, including the
  direction of import/export target copying;
- list item defaults and any wildcard behavior only where the example can
  remain compact and precise.

Keep the canonical technical details in Trigger, Form Traversing, component
type, and Usage references. Do not simplify away the distinction between
`context` and `target`.

### Validation, accessibility, size, and framework claims

- Say that SmarkForm manages component structure, values, and interactions;
  it does not replace server-side validation. Show native attributes such as
  `required`/`type="email"` as platform behavior and describe event hooks as a
  custom validation point only with correct lifecycle semantics.
- Replace broad accessibility assurances with a support/responsibility
  statement grounded in actual keyboard behavior, focus management, generated
  ARIA, and authored semantics. Audit and test any claim before promoting it.
  The refactor may clarify current keyboard features but must not imply that
  documentation alone establishes conformance.
- Before publishing minified/gzip/Brotli numbers, measure the correct shipped
  artifact(s) with a repeatable method. Distinguish raw minified size from
  transfer size, identify format/version and whether the value includes the
  whole feature set. Keep “zero runtime dependencies” separate from bundle
  size.
- Describe SmarkForm as DOM/HTML-oriented and framework-independent only to the
  extent supported by its actual API. Do not add official React/Vue/Svelte
  integration promises or imply a wrapper is needed.
- Present AI-oriented material as a secondary way to use the declarative API;
  retain the installable skills and agent resources because they are useful,
  but do not let them displace the human learning path.

#### Accessibility: evidence and questions for a bounded audit

The documentation should reflect SmarkForm's facilitation philosophy: preserve
native HTML semantics and let authors choose the markup/roles appropriate to
their UI, while automating useful associations and interaction behavior. Do
not claim that SmarkForm alone makes an arbitrary form accessible.

Current implementation/documentation evidence to preserve accurately:

- `label.type.js` sets a real `for` association for native scalar controls and
  adds the SmarkForm label's ID to `aria-labelledby` for non-native fields such
  as forms/lists. It also preserves existing `aria-labelledby` tokens. The
  author remains responsible for meaningful label text and appropriate native
  grouping/semantics (for example, `fieldset`/`legend` where suitable).
- Input navigation supports Enter/Shift+Enter and special handling for
  textareas and native `<details>`; `focus()` skips action triggers and can open
  collapsed sections when requested. Add/remove actions have focus behavior.
- SmarkForm sets `aria-busy` during root rendering. Lists currently receive
  `aria-live="polite"` and `aria-atomic="true"`. Media loading notices use a
  `role="status"` live region. Image fields leave authored `alt` untouched;
  audio/video retain native controls when authors provide them.
- SmarkForm does not appear to assign generic ARIA roles to every form/list
  container. Documentation should not suggest that a container has gained a
  particular landmark, group, or list role unless verified; authors can choose
  semantic HTML and explicit ARIA appropriate to their interface.

Issues/opportunities to verify and report separately (do not implement as part
of this documentation-only refactor):

1. **Correct the platform shortcut claim.** The end-user guide says `Cmd` on
   macOS reveals/uses hotkeys, but `src/lib/hotkeys.js` currently checks
   `ctrlKey`/`Control`, not `metaKey`/`Meta`. Correct the docs to Ctrl-only
   unless source behavior is deliberately changed in a separate task.
2. **Test live announcements.** Every list currently gets `aria-live="polite"`
   and `aria-atomic="true"`. Verify with representative screen readers whether
   adding/removing/reordering items announces useful concise updates or repeats
   too much list content. Consider whether announcement behavior should be
   configurable or narrower; do not guess from the attributes alone.
3. **Do not rely on CSS-generated hotkey hints for AT discoverability.** The
   `data-hotkey` reveal is styled through pseudo-elements. Verify what assistive
   technologies expose, and ensure essential actions still have accessible,
   operable controls and descriptions without relying on generated content or
   CSS-hidden buttons.
4. **Review broad keyboard promises.** The User Guide's “full keyboard
   support/everything” claims need qualification against native controls,
   browser behavior, authored markup, and hotkey-only patterns. Keyboard
   reachability does not by itself establish screen-reader usability.
5. **Check generated names and focus order.** Test native labels, non-native
   `aria-labelledby` associations, singleton fields, radio groups, image/media
   fields, nested/collapsed lists, and dynamically inserted/removed controls
   with browser accessibility trees and at least representative screen-reader
   combinations.
6. **Keep author responsibilities explicit.** Cover visible focus styling,
   contrast, meaningful image alternatives, media captions/transcripts, semantic
   structure, and reduced-motion preferences as author/design responsibilities
   where SmarkForm does not supply them.

The documentation pass should correct verified wording and produce a short
accessibility follow-up list for the maintainer. Any behavioral fix or formal
conformance claim should go through a dedicated implementation/audit effort
with browser and assistive-technology testing.

## 7. Staged implementation sequence

Each stage should be reviewed before proceeding to the next. A stage may be
split into smaller commits when implementation begins; the external review is
not authorization to make all changes in one large rewrite.

### Stage 0 — Baseline and editorial audit

- Record the current `doc_refact` branch state and the exact source revision.
- Build a content ledger for edited pages: section/heading, capture name,
  example purpose, notes, `demoValue`, tests, source page, destination, and
  disposition.
- For Showcase content, compare the legacy long page, `showcase2.md`,
  `docs/showcase_analysis.md`, `AGENTS/Showcase-Restructure-Plan.md`, and
  already-merged canonical destination pages. Verify rather than assume prior
  transfer decisions are complete.
- Search local links, fragment links, current permalinks, incoming references,
  feature claims, and TODO/draft passages. Identify canonical pages for
  behavior topics. Propose the target information architecture and final URL
  map, including old-URL compatibility decisions.
- Classify proposed changes as **keep**, **rewrite for clarity**, **move with
  destination**, **verify/correct**, or **defer for maintainer decision**.

**Exit condition:** no substantial example, explanation, or API detail is
unaccounted for; the target structure and canonical URL map are approved.

### Stage 1 — Parallel structure and link continuity

- Rename the existing user-facing sections/pages into the temporary `old_`
  namespace while leaving shared site infrastructure in place. Register any
  renamed Jekyll collections and Just-the-Docs navigation explicitly.
- Create the new section/page structure with approved final permalinks. Give
  each temporary legacy page a unique archive permalink; do not rely on
  filename changes to alter explicit front-matter permalinks.
- Update internal links, fragment links, navigation URLs, and references across
  both old and new pages so navigation works in the parallel review build.
  Position new sections before the clearly temporary legacy section.
- Add source/destination migration comments at safe boundaries and keep their
  authoritative source-locator → destination-locator mapping in the ledger.
- Keep temporary pages out of the sitemap and add `noindex` if the review
  build could be publicly reachable. The required guarantee is that no
  temporary content or route ships.

**Exit condition:** both structures build side by side, every route is unique,
and internal navigation/links resolve before substantial content is moved.

### Stage 2 — Positioning and entry routes

- Agree a concise product sentence and supporting explanation, avoiding
  unqualified “low-code,” “markup agnostic,” and “form enhancer” language when
  more concrete terms are clearer.
- Restructure homepage hierarchy around the existing interactive example and
  HTML/data model; preserve links and secondary content.
- Design the compact Quick Start and its “next step” link to **Using SmarkForm**.
  Curate the old long tutorial into that guide, moving details to canonical
  references rather than reproducing them; remove the old page only after the
  transfer ledger is complete.

**Exit condition:** a new reader can see what the library does, run a minimal
example, and find the comprehensive learning/reference material.

### Stage 3 — Core mental model and syntax

- Reorder Core Concepts around markup → component tree → value mapping → forms
  and lists → scalar fields → triggers/actions → paths.
- Add an accessible visual/ASCII model and a runnable minimal nested-data
  example. Use current supported syntax, stable `myForm` naming, and
  `await myForm.rendered` wherever component lookup/import timing requires it.
- Make shorthand syntax and JSON-option rationale discoverable. Resolve
  obsolete/draft sections explicitly and reconcile terminology across pages.

**Exit condition:** introductory explanations agree with component references,
examples, and implementation.

### Stage 4 — Using SmarkForm guide and context explanation

- Create the complete **Using SmarkForm** guide at the beginning of Guides, with
  a coherent practical progression for developers. Use the old Quick Start as
  an input, not as a page to copy verbatim: preserve its valuable examples and
  explanations, merge redundant passages, and link to canonical Guides and
  Reference pages for full detail.
- Link to Using SmarkForm from the end of the compact Quick Start as the
  explicit “continue learning” path.
- Link to the canonical Core Concepts component-tree model; use a compact
  reminder in Using SmarkForm only where the practical walkthrough needs it.
  Ensure the context/target learning step is accurate and linked to its full
  reference.
- Reconcile action semantics across Quick Start, Core Concepts, Trigger,
  Form Traversing, FAQ, and `AGENTS/SmarkForm-Usage.md` where relevant.

**Exit condition:** readers can distinguish path base, effective context, and
target base without relying on a misleading shortcut.

### Stage 5 — Showcase and feature-claim cleanup

- Use `showcase2.md` as the starting point for the intended final Showcase;
  refine its four dense examples and visual feature summaries instead of
  treating the current long Showcase as the final structure.
- Map every legacy Showcase section, capture, and distinctive explanation to
  an exact destination in the new Showcase, canonical documentation, or an
  explicit reviewed “not retained” decision. Confirm that already-ported
  material is complete and that needed canonical pages have useful examples.
- Keep the Showcase concise and visual, with shared playground instructions
  explained once. Preserve the legacy examples' unique behavior through the
  denser Showcase examples or tested canonical examples where appropriate.
- Audit features, introduction, FAQ, and home claims for current implementation,
  roadmap status, and tested behavior. Correct validation, sorting, accessibility,
  bundle, and comparison statements as needed.

**Exit condition:** no unsupported claim is introduced, and every removed
paragraph/capture has a documented reason and (when substantive) destination.

### Stage 6 — Site-wide verification and release cleanup

- Check navigation order and collection names, front matter, descriptions,
  generated chapter TOCs, all internal URLs/fragments, and old public URL
  redirects/aliases where applicable.
- Compare every original capture/test identifier against the edited version or
  destination. Re-run the docs-example collector; after content placement is
  complete and old pages are removed, run the full relevant co-located and
  Playwright test suites.
- Build the docs and run link/route validation plus cheatsheet validation.
  Validate internal URLs and fragments against the complete rendered `_site`,
  not just the changed Markdown files or cheatsheet.
  Preview the site and manually inspect the homepage, Quick Start, Core
  Concepts, Showcase, and changed mobile/keyboard interactions.
- Review diff specifically for removed code blocks, changed option names,
  copied stale examples, generated artifacts, and changes outside documentation
  scope. Remove all `old_` pages/collections, migration comments, temporary
  links/navigation, and staging-only configuration before anything is
  published; then rebuild and check the final sitemap, navigation, and links.
- Follow the documentation-change tracking instructions for the actual edits:
  update gitignored `UPDATED_DOCS.md` entries by affected page; update
  `AGENTS.md` if project automation or agent guidance changes.

**Exit condition:** docs build and relevant tests pass; links resolve; examples
remain runnable; the preservation ledger closes with no unexplained losses; no
temporary legacy content or route is present in the publishable tree.

## 8. Acceptance criteria

- The site states early and plainly that authors keep control of HTML/CSS while
  SmarkForm maps annotated DOM components to structured values such as objects
  and arrays.
- A beginner can get from the homepage to a minimal working form without
  encountering advanced terms first; the thorough material remains available.
- The navigation matches the approved structure schema, and the short Quick
  Start contains no duplicated tutorial content that belongs in a canonical
  reference.
- Existing interactive examples, co-located tests, detailed type references,
  and important caveats have been retained or deliberately replaced after
  review; none were removed only to shorten a page.
- The `data-smark` syntax, tree/path model, action context/target behavior,
  list semantics, and import/export claims agree across the docs.
- Validation, accessibility, framework, and size statements are specific,
  evidence-based, and do not imply unimplemented features.
- Final canonical permalinks and useful anchors follow the approved structure.
  Every internal link works, and changed old public URLs have a deliberate
  redirect/alias decision.
- Temporary `old_` pages, collections, markers, archive navigation and
  staging-only configuration are removed before publication; no temporary
  legacy route appears in the final built site or sitemap.
- Jekyll build, TOC/link checks, example collection, and relevant Playwright
  documentation tests pass.

## 9. Remaining review points before implementation

1. Review the proposed structure above: confirm the section names, page grouping,
   and whether the new **When SmarkForm Fits** page belongs under About.
2. Approve the final canonical permalink map after the information architecture
   is settled. URLs may change, but internal references and useful old URLs
   need an explicit migration plan.
3. The accessibility pass should report verified current behavior and
   candidate follow-up work; any behavior change or conformance claim belongs
   in a separate, evidence-backed effort.

After these points are agreed, approve the content-transfer and URL ledgers
before changing user-facing documentation. The temporary `old_` copies are
migration scaffolding only and must not be published.
