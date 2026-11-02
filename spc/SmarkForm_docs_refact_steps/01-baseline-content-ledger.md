# Step 01 — Baseline Page and Section Ledger

**Status:** baseline inventory only; all destination labels below are provisional until Step 02 approval. This ledger does not authorize edits or removals.

## Snapshot

- Worktree: `doc_refact` at commit `2484799b8f637dcf399c35971aad338e7d270ece` (plan files committed before starting this step).
- The worktree contains a pre-existing, unrelated modification to `docs/_data/package.json`: `@rollup/plugin-terser` is `^1.0.2` rather than `^1.0.0`, and `minimatch` is `^11.0.1` rather than `^11.0.3`. It was not created/staged by this step and must be preserved; establish its owner before any build/copy operation can overwrite it.
- `node` and `npm` are unavailable in this environment. The ignored `test/.cache/docs_examples.json` has 127 rows and an Oct 10 2026 mtime; it is a stale-cache reference only, not proof of current collector output. The source currently contains 131 parseable sampletab includes across 57 reader-facing Markdown files. Source IDs absent from the cache are `_about/faq.md#faq_empty_list`, `_about/showcase.md#nested_forms_with_load_save`, `_getting_started/quick_start.md#simple_legacy`, `_working_with_forms/form_traversing.md#form_trav_kanban`, and `_working_with_forms/hotkeys.md#hk_hidden`; the cache-only ID is `_working_with_forms/form_traversing.md#form_trav_multicontext`. See the sampletab ledger and regenerate with the collector when Node/npm are available.
- Current `doc_refact` HEAD is `2484799b8f637dcf399c35971aad338e7d270ece`; its merge base with `main` is `f01f95da4ed687aba79be040ad8751661eb553e2`. The plan commit is one local commit ahead of `origin/doc_refact`; re-check main ancestry before Step 02 because the maintainer is continuing main-branch updates.

## Reader-facing page and section inventory

Each H2/H3/H4 locator is listed so transfers can be closed individually. Destinations are proposals, not approved final routes. Current permalinks are verbatim from front matter. Incoming references below include explicit `relative_url` and local route references found by a source scan, deduplicated by source file/line. They are not a complete link graph: reference-style Markdown, anchors, Liquid-generated links, external links, and include-generated navigation require a full pass in Step 02/19.

### `_about/faq.md`

- **Current title / permalink / nav:** FAQ / `/about/faq` / `6`.
- **Candidate disposition:** About SmarkForm (retain/revise; exact route pending Step 02).
- **Explicit incoming route references found:** `_community/support.md:25`; `_working_with_forms/field_masking.md:611`; `index.md:353`.
- **Section locators and provisional destination:**
  - L27 `SmarkForm Essentials` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L29 `SmarkForm Essentials > What is SmarkForm?` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L52 `SmarkForm Essentials > Do I need a \`<form>\` tag?` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L75 `SmarkForm Essentials > How do I get and include SmarkForm?` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L108 `SmarkForm Essentials > What is the \`data-smark\` attribute?` → Core Concepts / Component Reference overview.
  - L135 `SmarkForm Essentials > What are the different SmarkForm component types?` → Core Concepts / Component Reference overview.
  - L184 `SmarkForm Essentials > What are triggers and actions?` → Step 07 action/context/target guide and Trigger reference.
  - L209 `SmarkForm Essentials > What is «context» in SmarkForm?` → Step 07 action/context/target guide and Trigger reference.
  - L239 `SmarkForm Essentials > What is the Singleton Pattern?` → Guides: Singleton Pattern and type references.
  - L289 `SmarkForm Essentials > How do I add a 'clear' button to a \`color\` or \`number\` field?` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L323 `Lists` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L325 `Lists > Why can't I remove items from my list sometimes?` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L339 `Lists > Why does my «add» button stop working?` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L349 `Lists > My list won't let me add items until I fill the current ones—is that intended?` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L356 `Lists > Why does my list render with no items?` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L411 `Lists > How do I add animations to list items?` → Guides: Animations.
  - L491 `Lists > I try to select text in a field inside a sortable list, but it starts dragging instead` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L548 `Data: Import, Export & Reset` → Guides: Data Import and Export / relevant type reference.
  - L550 `Data: Import, Export & Reset > My exported JSON is missing some fields—what's up?` → Guides: Data Import and Export / relevant type reference.
  - L559 `Data: Import, Export & Reset > Why are my nested form fields named weirdly in the JSON?` → Guides: Data Import and Export / relevant type reference.
  - L568 `Data: Import, Export & Reset > Why does my form export null values? How do I map them to HTML fields?` → Guides: Data Import and Export / relevant type reference.
  - L588 `Data: Import, Export & Reset > Is there a \`notNull\` attribute (or \`required\` option)?` → Guides: Data Import and Export / relevant type reference.
  - L614 `Data: Import, Export & Reset > How do I submit form data to a backend?` → Guides: Data Import and Export / relevant type reference.
  - L671 `Data: Import, Export & Reset > Can I use a classic HTML form submission instead of JSON export?` → Guides: Data Import and Export / relevant type reference.
  - L700 `Data: Import, Export & Reset > Does pressing Enter in a text field submit the form?` → Guides: Data Import and Export / relevant type reference.
  - L719 `Data: Import, Export & Reset > Do I need to enhance submit buttons as SmarkForm triggers?` → Step 07 action/context/target guide and Trigger reference.
  - L739 `Data: Import, Export & Reset > What happens to the submit button's \`name\` and \`value\` when the form submits?` → Guides: Data Import and Export / relevant type reference.
  - L777 `Data: Import, Export & Reset > Can I use \`action='mailto:…'\` to send form data by email?` → Step 07 action/context/target guide and Trigger reference.
  - L799 `Data: Import, Export & Reset > How do default values and reset work?` → Guides: Data Import and Export / relevant type reference.
  - L858 `Events & Actions` → Step 07 action/context/target guide and Trigger reference.
  - L860 `Events & Actions > I added an event listener, but it's not firing—why?` → Step 07 action/context/target guide and Trigger reference.
  - L871 `Events & Actions > How do I add custom actions?` → Step 07 action/context/target guide and Trigger reference.
  - L896 `Events & Actions > How do I add keyboard shortcuts (hotkeys)?` → Step 07 action/context/target guide and Trigger reference.
  - L945 `Events & Actions > What if I want to reach an outer action with the same hotkey?` → Step 07 action/context/target guide and Trigger reference.
  - L960 `Events & Actions > Can one trigger act on several components at once?` → Step 07 action/context/target guide and Trigger reference.
  - L987 `Behaviour & Troubleshooting` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L989 `Behaviour & Troubleshooting > Where's the error message when something goes wrong?` → Advanced Concepts: Error Codes.
  - L995 `Behaviour & Troubleshooting > \`myForm.find('/foo/bar')\` returns \`null\` but the field exists` → Guides: Form Traversing.
  - L1022 `Behaviour & Troubleshooting > What does \`await myForm.rendered\` do?` → Guides: Form Traversing.
  - L1046 `Behaviour & Troubleshooting > My masked field gets focused unexpectedly after form construction` → Guides: Field Masking.
  - L1094 `Behaviour & Troubleshooting > Why does my singleton wrapper raise \`NOT_A_SINGLETON\` or \`SINGLETON_TYPE_MISMATCH\`?` → Guides: Singleton Pattern and type references.
  - L1113 `API & JavaScript` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L1115 `API & JavaScript > Can I have multiple independent SmarkForm forms on a page?` → Advanced Concepts: Constructor / relevant action reference.
  - L1155 `API & JavaScript > What's this «API interface» I keep hearing about?` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L1165 `API & JavaScript > Is SmarkForm's API stable? Will upgrading break my code?` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L1202 `Mixin Types` → Guides: Mixin Types.
  - L1204 `Mixin Types > Can I implement my own component types?` → Core Concepts / Component Reference overview.
  - L1264 `Mixin Types > Are mixin styles isolated / scoped?` → Guides: Mixin Types.
  - L1282 `Mixin Types > Can I pass parameters to a mixin?` → Guides: Mixin Types.
  - L1312 `Mixin Types > Can a mixin template reference another mixin?` → Guides: Mixin Types.
  - L1319 `Mixin Types > Can mixins load from external files?` → Guides: Mixin Types.
  - L1345 `Integration & Deployment` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L1347 `Integration & Deployment > Which browsers has SmarkForm been tested on?` → FAQ remains an About discovery page; link to the relevant canonical reference.
  - L1364 `Integration & Deployment > Can I use SmarkForm in React (or Vue, Angular, etc.) projects?` → When SmarkForm Fits candidate.
  - L1377 `Integration & Deployment > Where does SmarkForm really shine?` → When SmarkForm Fits candidate.
  - L1383 `Integration & Deployment > Where does SmarkForm really shine? > Server-rendered HTML stacks` → When SmarkForm Fits candidate.
  - L1404 `Integration & Deployment > Where does SmarkForm really shine? > Static-site generators and JAMstack` → When SmarkForm Fits candidate.
  - L1411 `Integration & Deployment > Where does SmarkForm really shine? > Progressive enhancement of existing pages` → When SmarkForm Fits candidate.
  - L1419 `Integration & Deployment > Where does SmarkForm really shine? > Alpine.js and 'HTML-over-the-wire' stacks` → When SmarkForm Fits candidate.
  - L1431 `Integration & Deployment > Where does SmarkForm really shine? > Vanilla JavaScript projects and micro-frontends` → When SmarkForm Fits candidate.
  - L1438 `Integration & Deployment > Where does SmarkForm really shine? > Back-office tools and internal dashboards` → When SmarkForm Fits candidate.
  - L1445 `Integration & Deployment > Where does SmarkForm really shine? > In short` → When SmarkForm Fits candidate.
  - L1462 `Integration & Deployment > Why does \`clear\` restore my default value instead of emptying the field?` → Guides: Data Import and Export / relevant type reference.
  - L1488 `Have a question not covered here?` → FAQ remains an About discovery page; link to the relevant canonical reference.

### `_about/features.md`

- **Current title / permalink / nav:** Features / `/about/features` / `3`.
- **Candidate disposition:** About SmarkForm (retain/revise; exact route pending Step 02).
- **Explicit incoming route references found:** `index.md:311`; `index.md:313`; `index.md:315`; `index.md:317`; `index.md:319`; `index.md:321`; `index.md:323`; `index.md:325`; `index.md:327`; `index.md:331`; `index.md:333`.
- **Section locators and provisional destination:**
  - L22 `Markup agnostic` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L50 `Easy to use (low-code)` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L76 `Nestable forms` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L93 `Variable-length lists` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L111 `Context driven hotkeys` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L134 `Consistent User Experience` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L153 `A11Y friendly` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L170 `JSON based` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L182 `Lightweight yet highly compatible` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L196 `Flexible and extendable` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L206 `Directory-like addressability` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L225 `Reliability-oriented` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L243 `AI-agent ready` → About SmarkForm (retain/revise; exact route pending Step 02).

### `_about/introduction.md`

- **Current title / permalink / nav:** Introduction / `/about/introduction` / `1`.
- **Candidate disposition:** About SmarkForm; comparison material may be split to When SmarkForm Fits.
- **Explicit incoming route references found:** `_about/faq.md:48`; `index.md:298`.
- **Section locators and provisional destination:**
  - L29 `What SmarkForm Is (and Isn't Yet)` → About SmarkForm; comparison material may be split to When SmarkForm Fits.
  - L51 `About SmarkForm` → About SmarkForm; comparison material may be split to When SmarkForm Fits.
  - L92 `Motivation` → About SmarkForm; comparison material may be split to When SmarkForm Fits.
  - L129 `A Picture is Worth a Thousand Words` → About SmarkForm; comparison material may be split to When SmarkForm Fits.
  - L154 `A Picture is Worth a Thousand Words > The Example: Event Planner` → About SmarkForm; comparison material may be split to When SmarkForm Fits.
  - L171 `A Picture is Worth a Thousand Words > SmarkForm` → About SmarkForm; comparison material may be split to When SmarkForm Fits.
  - L293 `A Picture is Worth a Thousand Words > React` → When SmarkForm Fits candidate (keep only a concise neutral summary on Introduction).
  - L570 `A Picture is Worth a Thousand Words > Vue` → When SmarkForm Fits candidate (keep only a concise neutral summary on Introduction).
  - L802 `A Picture is Worth a Thousand Words > Gotchas` → When SmarkForm Fits candidate (keep only a concise neutral summary on Introduction).
  - L818 `A Picture is Worth a Thousand Words > What the numbers say` → When SmarkForm Fits candidate (keep only a concise neutral summary on Introduction).
  - L820 `A Picture is Worth a Thousand Words > What the numbers say > Metrics` → When SmarkForm Fits candidate (keep only a concise neutral summary on Introduction).
  - L859 `A Picture is Worth a Thousand Words > What the numbers say > Implementation time` → When SmarkForm Fits candidate (keep only a concise neutral summary on Introduction).

### `_about/manifesto.md`

- **Current title / permalink / nav:** Manifesto / `/about/manifesto` / `4`.
- **Candidate disposition:** About SmarkForm (retain/revise; exact route pending Step 02).
- **Explicit incoming route references found:** none detected by this limited scan; verify reference links/includes in Step 02.
- **Section locators and provisional destination:**
  - L24 `Be as easy to define as traditional HTML forms are.` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L32 `Be intuitive and accessible to users.` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L39 `Work seamlessly across all devices with no functionality penalty.` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L46 `Ensure a consistent user experience across different forms.` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L52 `Grant separation of concerns between design and logic.` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L60 `Encourage and facilitate usability and accessibility.` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L68 `Provide advanced capabilities like manual and automatic list sorting, etc.` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L75 `Not interfere with the actual HTML and CSS design.` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L82 `Return field values in proper data types according to the type of the field.` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L89 `Import and Export data in JSON format.` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L96 `Be able to handle any possible JSON structure.` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L103 `Be compatible with modern web technologies.` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L111 `Be Open Source and open to community contributions.` → About SmarkForm (retain/revise; exact route pending Step 02).

### `_about/roadmap.md`

- **Current title / permalink / nav:** Roadmap / `/about/roadmap` / `5`.
- **Candidate disposition:** About SmarkForm (retain/revise; exact route pending Step 02).
- **Explicit incoming route references found:** `_about/faq.md:1162`; `_about/introduction.md:48`; `index.md:340`.
- **Section locators and provisional destination:**
  - L23 `Current Status` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L30 `Planned` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L33 `Planned > The «API interface»` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L53 `Planned > The «select» component type` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L62 `Planned > Conditional forms` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L72 `Later` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L75 `Later > The «UNDO» component` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L85 `Later > Infinite lists` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L90 `Later > Recursive lists` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L98 `Brainstorm` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L105 `Brainstorm > «hint» component type` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L114 `Brainstorm > Table Of Contents component` → About SmarkForm (retain/revise; exact route pending Step 02).
  - L122 `Brainstorm > Download action` → About SmarkForm (retain/revise; exact route pending Step 02).

### `_about/showcase.md`

- **Current title / permalink / nav:** Showcase / `/about/showcase` / `2`.
- **Candidate disposition:** Temporary legacy Showcase source; section crosswalk in `01-showcase-crosswalk.md`.
- **Explicit incoming route references found:** `_about/faq.md:49`; `_about/faq.md:487`; `_about/faq.md:556`; `_about/features.md:71`; `_about/features.md:90`; `_about/features.md:108`; `_about/features.md:123`; `_about/features.md:131`; `_about/features.md:150`; `_about/features.md:179`; `_about/features.md:240`; `_about/introduction.md:88`; `_advanced_concepts/events.md:188`; `_advanced_concepts/events.md:331`; `_getting_started/quick_start.md:940`; `_resources/user_guide.md:390`; `_working_with_forms/hotkeys.md:361`; `index.md:300`; `index.md:350`.
- **Section locators and provisional destination:**
  - L46 `Basics` → See `01-showcase-crosswalk.md`; provisional only.
  - L48 `Basics > Just a Form` → See `01-showcase-crosswalk.md`; provisional only.
  - L123 `Basics > Multiple-Level Nesting` → See `01-showcase-crosswalk.md`; provisional only.
  - L460 `Basics > Deeply nested forms` → See `01-showcase-crosswalk.md`; provisional only.
  - L520 `Basics > More on lists` → See `01-showcase-crosswalk.md`; provisional only.
  - L631 `Basics > Mixins` → See `01-showcase-crosswalk.md`; provisional only.
  - L912 `Basics > Nested lists and forms` → See `01-showcase-crosswalk.md`; provisional only.
  - L1183 `Basics > Item duplication and closure state` → See `01-showcase-crosswalk.md`; provisional only.
  - L1192 `Basics > A note on empty values` → See `01-showcase-crosswalk.md`; provisional only.
  - L1200 `Basics > Nesting Mixins` → See `01-showcase-crosswalk.md`; provisional only.
  - L1217 `Import and Export Data` → See `01-showcase-crosswalk.md`; provisional only.
  - L1239 `Import and Export Data > Intercepting the *import* and *export* events` → See `01-showcase-crosswalk.md`; provisional only.
  - L1411 `Import and Export Data > Submitting the form` → See `01-showcase-crosswalk.md`; provisional only.
  - L1508 `Import and Export Data > A note on context of the triggers` → See `01-showcase-crosswalk.md`; provisional only.
  - L1618 `Advanced UX Improvements` → See `01-showcase-crosswalk.md`; provisional only.
  - L1622 `Advanced UX Improvements > Auto enabling or disabling of actions` → See `01-showcase-crosswalk.md`; provisional only.
  - L1696 `Advanced UX Improvements > Context-Driven Keyboard Shortcuts (Hot Keys)` → See `01-showcase-crosswalk.md`; provisional only.
  - L1759 `Advanced UX Improvements > Reveal of hot keys` → See `01-showcase-crosswalk.md`; provisional only.
  - L1786 `Advanced UX Improvements > Hotkeys and context` → See `01-showcase-crosswalk.md`; provisional only.
  - L1838 `Advanced UX Improvements > Collapsible sections` → See `01-showcase-crosswalk.md`; provisional only.
  - L2378 `Advanced UX Improvements > Smooth navigation` → See `01-showcase-crosswalk.md`; provisional only.
  - L2387 `Advanced UX Improvements > 2nd level hotkeys` → See `01-showcase-crosswalk.md`; provisional only.
  - L2600 `Advanced UX Improvements > Hidden actions` → See `01-showcase-crosswalk.md`; provisional only.
  - L2675 `Advanced UX Improvements > Animations` → See `01-showcase-crosswalk.md`; provisional only.
  - L2779 `Advanced UX Improvements > Smart value coercion` → See `01-showcase-crosswalk.md`; provisional only.
  - L2789 `Advanced UX Improvements > Field Masking` → See `01-showcase-crosswalk.md`; provisional only.
  - L2919 `Advanced UX Improvements > Dynamic Dropdown Options` → See `01-showcase-crosswalk.md`; provisional only.
  - L2937 `Random Examples` → See `01-showcase-crosswalk.md`; provisional only.
  - L2943 `Random Examples > Simple Calculator` → See `01-showcase-crosswalk.md`; provisional only.
  - L3208 `Random Examples > Calculator (UX improved)` → See `01-showcase-crosswalk.md`; provisional only.
  - L3457 `Random Examples > Team Event Planner` → See `01-showcase-crosswalk.md`; provisional only.
  - L3723 `Conclusion` → See `01-showcase-crosswalk.md`; provisional only.

### `_about/showcase2.md`

- **Current title / permalink / nav:** Showcase 2 / `/about/showcase2` / `7`.
- **Candidate disposition:** Candidate final Showcase in Showcase & Examples; audit before choosing canonical route.
- **Explicit incoming route references found:** none detected by this limited scan; verify reference links/includes in Step 02.
- **Section locators and provisional destination:**
  - L114 `Just a Form` → Candidate final Showcase in Showcase & Examples; audit before choosing canonical route.
  - L173 `Just a Form > Features demonstrated` → Candidate final Showcase in Showcase & Examples; audit before choosing canonical route.
  - L249 `Project Kanban Board` → Candidate final Showcase in Showcase & Examples; audit before choosing canonical route.
  - L359 `Project Kanban Board > Features demonstrated` → Candidate final Showcase in Showcase & Examples; audit before choosing canonical route.
  - L480 `Race Registration System` → Candidate final Showcase in Showcase & Examples; audit before choosing canonical route.
  - L613 `Race Registration System > Features demonstrated` → Candidate final Showcase in Showcase & Examples; audit before choosing canonical route.
  - L708 `Product Configurator` → Candidate final Showcase in Showcase & Examples; audit before choosing canonical route.
  - L827 `Product Configurator > Features demonstrated` → Candidate final Showcase in Showcase & Examples; audit before choosing canonical route.

### `_advanced_concepts/animations.md`

- **Current title / permalink / nav:** Animations / `/advanced_concepts/animations` / `6`.
- **Candidate disposition:** Guides: corresponding practical topic.
- **Explicit incoming route references found:** `_about/showcase.md:2776`.
- **Section locators and provisional destination:**
  - L21 `Simple Example — Two-Class Symmetric Animation` → Guides: corresponding practical topic.
  - L106 `Advanced Example — Asymmetric Entry and Exit` → Guides: corresponding practical topic.
  - L198 `Lifecycle Events for Entry/Exit Animations` → Guides: corresponding practical topic.
  - L210 `Global vs. Per-List Application` → Guides: corresponding practical topic.

### `_advanced_concepts/error_codes.md`

- **Current title / permalink / nav:** Error Codes Reference / `/advanced_concepts/error_codes` / `5`.
- **Candidate disposition:** Advanced Concepts: retain detailed reference.
- **Explicit incoming route references found:** `_advanced_concepts/security_considerations.md:241`.
- **Section locators and provisional destination:**
  - L24 `Overview` → Advanced Concepts: retain detailed reference.
  - L41 `Component (Core)` → Advanced Concepts: retain detailed reference.
  - L45 `Component (Core) > \`INVALID_PARENT\`` → Advanced Concepts: retain detailed reference.
  - L52 `Component (Core) > \`INVALID_OPTIONS_OBJECT\`` → Advanced Concepts: retain detailed reference.
  - L64 `Component (Core) > \`SINGLETON_OPTION_CONFLICT\`` → Advanced Concepts: retain detailed reference.
  - L73 `Component (Core) > \`ACTION_IN_NON_TRIGGER\`` → Advanced Concepts: retain detailed reference.
  - L84 `Component (Core) > \`NO_TYPE_PROVIDED\`` → Advanced Concepts: retain detailed reference.
  - L93 `Component (Core) > \`UNKNOWN_TYPE\`` → Advanced Concepts: retain detailed reference.
  - L105 `Component (Core) > \`UNKNOWN_ACTION\`` → Advanced Concepts: retain detailed reference.
  - L115 `Form` → Advanced Concepts: retain detailed reference.
  - L117 `Form > \`REPEATED_FIELD_NAME\`` → Advanced Concepts: retain detailed reference.
  - L127 `List` → Advanced Concepts: retain detailed reference.
  - L129 `List > \`LIST_DUPLICATE_TEMPLATE\`` → Advanced Concepts: retain detailed reference.
  - L138 `List > \`LIST_UNKNOWN_TEMPLATE_ROLE\`` → Advanced Concepts: retain detailed reference.
  - L148 `List > \`LIST_CONTAINS_ID\`` → Advanced Concepts: retain detailed reference.
  - L159 `List > \`LIST_ITEM_TYPE_MISMATCH\`` → Advanced Concepts: retain detailed reference.
  - L169 `List > \`FIELD_IN_WRONG_LIST_TEMPLATE\`` → Advanced Concepts: retain detailed reference.
  - L179 `List > \`LIST_IMPORT_OVERFLOW\` *(event, not exception)*` → Advanced Concepts: retain detailed reference.
  - L198 `List > \`LIST_MAX_ITEMS_REACHED\` *(event, not exception)*` → Advanced Concepts: retain detailed reference.
  - L208 `List > \`LIST_MIN_ITEMS_REACHED\` *(event, not exception)*` → Advanced Concepts: retain detailed reference.
  - L218 `List > \`LIST_WRONG_ADDITEM_POSITION\`` → Advanced Concepts: retain detailed reference.
  - L226 `Scalar Fields` → Advanced Concepts: retain detailed reference.
  - L228 `Scalar Fields > \`VALUE_CONFLICT\`` → Advanced Concepts: retain detailed reference.
  - L239 `Scalar Fields > \`NOT_A_SINGLETON\`` → Advanced Concepts: retain detailed reference.
  - L249 `Scalar Fields > \`SINGLETON_TYPE_MISMATCH\`` → Advanced Concepts: retain detailed reference.
  - L259 `Label` → Advanced Concepts: retain detailed reference.
  - L261 `Label > \`EXTRA_FIELD_IN_LABEL\`` → Advanced Concepts: retain detailed reference.
  - L270 `Label > \`LABEL_EXPLICIT_TARGET\`` → Advanced Concepts: retain detailed reference.
  - L281 `Label > \`LABEL_FOR_NONFIELD\`` → Advanced Concepts: retain detailed reference.
  - L294 `Mixin Types` → Advanced Concepts: retain detailed reference.
  - L299 `Mixin Types > \`MIXIN_TYPE_MISSING_FRAGMENT\`` → Advanced Concepts: retain detailed reference.
  - L309 `Mixin Types > \`MIXIN_EXTERNAL_FETCH_BLOCKED\`` → Advanced Concepts: retain detailed reference.
  - L322 `Mixin Types > \`MIXIN_CROSS_ORIGIN_FETCH_BLOCKED\`` → Advanced Concepts: retain detailed reference.
  - L334 `Mixin Types > \`MIXIN_FETCH_ERROR\`` → Advanced Concepts: retain detailed reference.
  - L344 `Mixin Types > \`MIXIN_CIRCULAR_DEPENDENCY\`` → Advanced Concepts: retain detailed reference.
  - L353 `Mixin Types > \`MIXIN_TEMPLATE_NOT_FOUND\`` → Advanced Concepts: retain detailed reference.
  - L363 `Mixin Types > \`MIXIN_TEMPLATE_INVALID_ROOT\`` → Advanced Concepts: retain detailed reference.
  - L374 `Mixin Types > \`MIXIN_TEMPLATE_ROOT_HAS_NAME\`` → Advanced Concepts: retain detailed reference.
  - L385 `Mixin Types > \`MIXIN_SCRIPT_LOCAL_BLOCKED\`` → Advanced Concepts: retain detailed reference.
  - L396 `Mixin Types > \`MIXIN_SCRIPT_SAME_ORIGIN_BLOCKED\`` → Advanced Concepts: retain detailed reference.
  - L406 `Mixin Types > \`MIXIN_SCRIPT_CROSS_ORIGIN_BLOCKED\`` → Advanced Concepts: retain detailed reference.
  - L418 `Mixin Types > \`MIXIN_NESTED_SCRIPT_DISALLOWED\`` → Advanced Concepts: retain detailed reference.
  - L436 `Native Type Parsing Errors` → Advanced Concepts: retain detailed reference.

### `_advanced_concepts/events.md`

- **Current title / permalink / nav:** Event Handling / `/advanced_concepts/events` / `2`.
- **Candidate disposition:** Guides: corresponding practical topic.
- **Explicit incoming route references found:** `_about/faq.md:669`; `_about/faq.md:869`; `_about/showcase2.md:408`; `_advanced_concepts/the_smarkform_constructor.md:55`; `_resources/cheatsheet.md:186`; `_resources/cheatsheet.md:319`; `_resources/cheatsheet.md:341`; `_resources/cheatsheet.md:342`; `_resources/playground.md:170`; `_working_with_forms/data_import_and_export.md:576`; `_working_with_forms/data_import_and_export.md:630`.
- **Section locators and provisional destination:**
  - L26 `Overview` → Guides: corresponding practical topic.
  - L44 `Action Lifecycle Events` → Guides: corresponding practical topic.
  - L55 `Action Lifecycle Events > BeforeAction events` → Guides: corresponding practical topic.
  - L70 `Action Lifecycle Events > AfterAction events` → Guides: corresponding practical topic.
  - L82 `Action Lifecycle Events > Preventing an action` → Guides: corresponding practical topic.
  - L100 `Registering Event Handlers` → Guides: corresponding practical topic.
  - L102 `Registering Event Handlers > Via options (declarative)` → Guides: corresponding practical topic.
  - L129 `Registering Event Handlers > Via the API (programmatic)` → Guides: corresponding practical topic.
  - L144 `Registering Event Handlers > Local vs. All handlers` → Guides: corresponding practical topic.
  - L191 `DOM Field Events` → Guides: corresponding practical topic.
  - L198 `DOM Field Events > Supported event types` → Guides: corresponding practical topic.
  - L234 `DOM Field Events > Event data payload` → Guides: corresponding practical topic.
  - L258 `Common Patterns` → Guides: corresponding practical topic.
  - L260 `Common Patterns > Submitting form data to a backend` → Guides: corresponding practical topic.
  - L313 `Common Patterns > Intercepting an import to fetch data asynchronously` → Guides: corresponding practical topic.
  - L335 `Common Patterns > Modifying exported data before it leaves` → Guides: corresponding practical topic.
  - L354 `Implementation Details` → Guides: corresponding practical topic.
  - L361 `Implementation Details > The \`@action\` decorator` → Guides: corresponding practical topic.
  - L379 `Implementation Details > Calling actions programmatically` → Guides: corresponding practical topic.
  - L383 `Implementation Details > Event bubbling: local, on, and all` → Guides: corresponding practical topic.

### `_advanced_concepts/mixin_types.md`

- **Current title / permalink / nav:** Mixin Types / `/advanced_concepts/mixin_types` / `3`.
- **Candidate disposition:** Guides: corresponding practical topic.
- **Explicit incoming route references found:** `_about/faq.md:1262`; `_about/faq.md:1341`; `_about/features.md:202`; `_about/showcase.md:909`; `_about/showcase.md:1208`; `_about/showcase2.md:373`; `_about/showcase2.md:461`; `_about/showcase2.md:806`; `_about/showcase2.md:838`; `_advanced_concepts/error_codes.md:297`; `_advanced_concepts/the_smarkform_constructor.md:112`; `_component_types/type_list.md:319`; `_resources/cheatsheet.md:38`; `_resources/cheatsheet.md:39`; `_resources/cheatsheet.md:40`; `_resources/cheatsheet.md:41`.
- **Section locators and provisional destination:**
  - L25 `Overview` → Guides: corresponding practical topic.
  - L67 `Defining a Mixin Template` → Guides: corresponding practical topic.
  - L89 `Using a Mixin Type` → Guides: corresponding practical topic.
  - L91 `Using a Mixin Type > Local mixin reference` → Guides: corresponding practical topic.
  - L111 `Using a Mixin Type > External mixin reference` → Guides: corresponding practical topic.
  - L159 `Template Constraints` → Guides: corresponding practical topic.
  - L202 `Expansion Semantics` → Guides: corresponding practical topic.
  - L224 `Option Merge Semantics` → Guides: corresponding practical topic.
  - L251 `Attribute Merge Semantics` → Guides: corresponding practical topic.
  - L291 `Snippet Parameters` → Guides: corresponding practical topic.
  - L303 `Snippet Parameters > How snippet parameters work` → Guides: corresponding practical topic.
  - L340 `Snippet Parameters > id to data-id conversion` → Guides: corresponding practical topic.
  - L382 `Snippet Parameters > Security: no nested scripts` → Guides: corresponding practical topic.
  - L398 `External Loading and Caching` → Guides: corresponding practical topic.
  - L400 `External Loading and Caching > URL resolution` → Guides: corresponding practical topic.
  - L418 `External Loading and Caching > Fetch and cache strategy` → Guides: corresponding practical topic.
  - L438 `External Loading and Caching > Eager preloading (\`preload\`)` → Guides: corresponding practical topic.
  - L464 `External Loading and Caching > Nested mixins and circular dependency detection` → Guides: corresponding practical topic.
  - L474 `List Placement Warning` → Guides: corresponding practical topic.
  - L517 `Scripts and Styles` → Guides: corresponding practical topic.
  - L553 `Scripts and Styles > Styles` → Guides: corresponding practical topic.
  - L566 `Scripts and Styles > Scripts` → Guides: corresponding practical topic.
  - L591 `Scripts and Styles > Scripts > Practical Example: Smart Date Prefill` → Guides: corresponding practical topic.
  - L631 `Scripts and Styles > Mixin Security Options` → Guides: corresponding practical topic.
  - L641 `Scripts and Styles > Mixin Security Options > External template fetch policy: \`smark_mixin_allow_external\`` → Guides: corresponding practical topic.
  - L677 `Scripts and Styles > Mixin Security Options > Script execution policy: \`smark_mixin_allow_local_scripts\`, \`smark_mixin_allow_same_origin_scripts\`, \`smark_mixin_allow_cross_origin_scripts\`` → Guides: corresponding practical topic.
  - L736 `Examples` → Guides: corresponding practical topic.
  - L738 `Examples > Reusable contact block` → Guides: corresponding practical topic.
  - L830 `Examples > Option override per usage site` → Guides: corresponding practical topic.
  - L899 `Examples > Snippet parameters: custom labels` → Guides: corresponding practical topic.
  - L974 `Examples > Labelled list of inputs: inputlist` → Guides: corresponding practical topic.
  - L1078 `Error Codes` → Guides: corresponding practical topic.

### `_advanced_concepts/security_considerations.md`

- **Current title / permalink / nav:** Security Considerations / `/advanced_concepts/security_considerations` / `4`.
- **Candidate disposition:** Advanced Concepts: retain detailed reference.
- **Explicit incoming route references found:** `_advanced_concepts/error_codes.md:318`; `_advanced_concepts/error_codes.md:392`.
- **Section locators and provisional destination:**
  - L32 `Secure-by-Default Philosophy` → Advanced Concepts: retain detailed reference.
  - L57 `Security Options are Root-Only` → Advanced Concepts: retain detailed reference.
  - L83 `Mixin External Template Loading (smark_mixin_allow_external)` → Advanced Concepts: retain detailed reference.
  - L111 `Mixin Script Execution (smark_mixin_allow_local_scripts, smark_mixin_allow_same_origin_scripts, smark_mixin_allow_cross_origin_scripts)` → Advanced Concepts: retain detailed reference.
  - L160 `Nested Scripts (MIXIN_NESTED_SCRIPT_DISALLOWED)` → Advanced Concepts: retain detailed reference.
  - L190 `JSON Encoding (enable_json_encoding)` → Advanced Concepts: retain detailed reference.
  - L230 `Error Codes Quick Reference` → Advanced Concepts: retain detailed reference.

### `_advanced_concepts/the_singleton_pattern.md`

- **Current title / permalink / nav:** The Singleton Pattern / `/advanced_concepts/the_singleton_pattern` / `1`.
- **Candidate disposition:** Guides: corresponding practical topic.
- **Explicit incoming route references found:** `_about/faq.md:1109`.
- **Section locators and provisional destination:**
  - L25 `Overview` → Guides: corresponding practical topic.
  - L42 `What Makes a Singleton` → Guides: corresponding practical topic.
  - L72 `Advantages` → Guides: corresponding practical topic.
  - L89 `Common Use Cases` → Guides: corresponding practical topic.
  - L91 `Common Use Cases > Complex HTML as a Single Field` → Guides: corresponding practical topic.
  - L106 `Common Use Cases > Avoiding Absolute Context Paths` → Guides: corresponding practical topic.
  - L134 `Common Use Cases > Wrappers and Triggers Inside List Items` → Guides: corresponding practical topic.
  - L143 `Common Use Cases > File Fields and Whole-Container Drop & Paste` → Guides: corresponding practical topic.
  - L154 `Common Use Cases > Scalar Lists` → Guides: corresponding practical topic.
  - L167 `Restrictions and Errors` → Guides: corresponding practical topic.
  - L169 `Restrictions and Errors > NOT_A_SINGLETON` → Guides: corresponding practical topic.
  - L175 `Restrictions and Errors > SINGLETON_TYPE_MISMATCH` → Guides: corresponding practical topic.
  - L182 `Restrictions and Errors > Relative vs Absolute Context` → Guides: corresponding practical topic.
  - L196 `Color Reset Example (Singleton)` → Guides: corresponding practical topic.
  - L272 `Phone List Example (Singleton)` → Guides: corresponding practical topic.

### `_advanced_concepts/the_smarkform_constructor.md`

- **Current title / permalink / nav:** The SmarkForm Constructor / `/advanced_concepts/the_smarkform_constructor` / `0`.
- **Candidate disposition:** Advanced Concepts: retain detailed reference.
- **Explicit incoming route references found:** `_about/faq.md:892`; `_resources/cheatsheet.md:31`; `_resources/cheatsheet.md:32`; `_resources/cheatsheet.md:47`; `_resources/cheatsheet.md:49`; `_resources/cheatsheet.md:131`.
- **Section locators and provisional destination:**
  - L25 `Constructor Syntax` → Advanced Concepts: retain detailed reference.
  - L36 `Pass-Through Options` → Advanced Concepts: retain detailed reference.
  - L61 `Pass-Through Options > Merging rules` → Advanced Concepts: retain detailed reference.
  - L82 `Constructor-Only Options` → Advanced Concepts: retain detailed reference.
  - L90 `Constructor-Only Options > Field Masking` → Advanced Concepts: retain detailed reference.
  - L103 `Constructor-Only Options > Mixin security policies` → Advanced Concepts: retain detailed reference.
  - L116 `Static Members` → Advanced Concepts: retain detailed reference.
  - L118 `Static Members > \`SmarkForm.registerMask(name, factory)\`` → Advanced Concepts: retain detailed reference.
  - L133 `Static Members > \`SmarkForm.registerCustomAction(name, handler)\`` → Advanced Concepts: retain detailed reference.
  - L156 `How the Component Tree is Built` → Advanced Concepts: retain detailed reference.
  - L166 `How the Component Tree is Built > Scope boundaries` → Advanced Concepts: retain detailed reference.
  - L184 `How the Component Tree is Built > Rendering order` → Advanced Concepts: retain detailed reference.
  - L190 `The \`rendered\` Promise` → Advanced Concepts: retain detailed reference.

### `_community/branding.md`

- **Current title / permalink / nav:** Branding / `/community/branding` / `5`.
- **Candidate disposition:** Community (retain in dedicated collection).
- **Explicit incoming route references found:** `_about/faq.md:957`; `_resources/user_guide.md:390`.
- **Section locators and provisional destination:**
  - L22 `Why Link to the User Guide` → Community (retain in dedicated collection).
  - L44 `Logo Assets` → Community (retain in dedicated collection).
  - L48 `Logo Assets > Available Variations` → Community (retain in dedicated collection).
  - L68 `Logo Assets > When to Use Which Variant` → Community (retain in dedicated collection).
  - L75 `Badge Implementation Examples` → Community (retain in dedicated collection).
  - L79 `Badge Implementation Examples > Compact Badge (Recommended for Forms)` → Community (retain in dedicated collection).
  - L99 `Badge Implementation Examples > Full Logo (For Documentation/About Pages)` → Community (retain in dedicated collection).
  - L114 `Badge Implementation Examples > Responsive Implementation` → Community (retain in dedicated collection).
  - L149 `Badge Implementation Examples > Dark Mode Support` → Community (retain in dedicated collection).
  - L187 `Best Practices` → Community (retain in dedicated collection).
  - L189 `Best Practices > Where to Place Badges` → Community (retain in dedicated collection).
  - L217 `Best Practices > Accessibility Considerations` → Community (retain in dedicated collection).
  - L239 `Best Practices > Mobile-Friendly Implementation` → Community (retain in dedicated collection).
  - L267 `Branding Guidelines` → Community (retain in dedicated collection).
  - L269 `Branding Guidelines > Respecting the Brand` → Community (retain in dedicated collection).
  - L290 `Branding Guidelines > Required Attribution Format` → Community (retain in dedicated collection).
  - L310 `Form Technology` → Community (retain in dedicated collection).
  - L322 `Logo Philosophy` → Community (retain in dedicated collection).

### `_community/build-in-public.md`

- **Current title / permalink / nav:** Build in Public / `/community/build-in-public` / `6`.
- **Candidate disposition:** Community (retain in dedicated collection).
- **Explicit incoming route references found:** none detected by this limited scan; verify reference links/includes in Step 02.
- **Section locators and provisional destination:**
  - L25 `Articles` → Community (retain in dedicated collection).
  - L27 `Articles > How We Gave Every Documentation Example Its Own Test — and Why It Caught Real Bugs` → Community (retain in dedicated collection).
  - L37 `Articles > Generating a Parametric SVG Logo with Pug` → Community (retain in dedicated collection).
  - L46 `Articles > Simplify Web Form Development with SmarkForm` → Community (retain in dedicated collection).
  - L55 `Presentations` → Community (retain in dedicated collection).
  - L57 `Presentations > Documents` → Community (retain in dedicated collection).
  - L61 `Presentations > Past Events` → Community (retain in dedicated collection).
  - L63 `Presentations > Past Events > December 12th, 2024 — Prueba una librería JavaScript para revolucionar tus formularios` → Community (retain in dedicated collection).

### `_community/contact.md`

- **Current title / permalink / nav:** Contact / `/community/contact` / `4`.
- **Candidate disposition:** Community; preserve page content/front matter/permalink/nav unchanged.
- **Explicit incoming route references found:** none detected by this limited scan; verify reference links/includes in Step 02.
- **Section locators and provisional destination:**
  - L13 `Quick links` → Community; preserve page content/front matter/permalink/nav unchanged.
  - L30 `Contributing` → Community; preserve page content/front matter/permalink/nav unchanged.
  - L36 `Community and updates` → Community; preserve page content/front matter/permalink/nav unchanged.

### `_community/contributing.md`

- **Current title / permalink / nav:** Contributing / `/community/contributing` / `2`.
- **Candidate disposition:** Community (retain in dedicated collection).
- **Explicit incoming route references found:** `_community/contact.md:33`; `index.md:422`.
- **Section locators:** no H2–H4 headings; inventory page body/front matter as a single source unit.

### `_community/license.md`

- **Current title / permalink / nav:** License / `/community/license` / `3`.
- **Candidate disposition:** Community (retain in dedicated collection).
- **Explicit incoming route references found:** `index.md:427`.
- **Section locators and provisional destination:**
  - L12 `MIT License` → Community (retain in dedicated collection).

### `_community/support.md`

- **Current title / permalink / nav:** Support / `/community/support` / `1`.
- **Candidate disposition:** Community (retain in dedicated collection).
- **Explicit incoming route references found:** `_resources/user_guide.md:362`; `_resources/user_guide.md:396`.
- **Section locators and provisional destination:**
  - L13 `Where should I go?` → Community (retain in dedicated collection).
  - L28 `Community support (Q&A)` → Community (retain in dedicated collection).
  - L39 `Bug reports` → Community (retain in dedicated collection).
  - L52 `Feature requests` → Community (retain in dedicated collection).
  - L62 `Security and responsible disclosure` → Community (retain in dedicated collection).
  - L69 `Response times and scope` → Community (retain in dedicated collection).
  - L75 `Professional/priority support` → Community (retain in dedicated collection).

### `_component_types/type_audio.md`

- **Current title / permalink / nav:** audio Component Type / `/component_types/type_audio` / `29`.
- **Candidate disposition:** Component Reference: corresponding type page.
- **Explicit incoming route references found:** none detected by this limited scan; verify reference links/includes in Step 02.
- **Section locators and provisional destination:**
  - L21 `Overview` → Component Reference: corresponding type page.
  - L44 `Try It` → Component Reference: corresponding type page.
  - L52 `Try It > Basic Real Audio Field` → Component Reference: corresponding type page.
  - L91 `Try It > Singleton With An Editable Name` → Component Reference: corresponding type page.
  - L145 `Try It > Audio List` → Component Reference: corresponding type page.
  - L186 `Try It > Empty-State Upload Affordance` → Component Reference: corresponding type page.
  - L242 `Empty State And Playback` → Component Reference: corresponding type page.
  - L262 `Empty State And Playback > Keyboard And Caption Navigation` → Component Reference: corresponding type page.
  - L276 `Validation And Options` → Component Reference: corresponding type page.
  - L299 `Format Recommendations` → Component Reference: corresponding type page.
  - L305 `Singletons And Lists` → Component Reference: corresponding type page.

### `_component_types/type_color.md`

- **Current title / permalink / nav:** «color» Component Type / `/component_types/type_color` / `5`.
- **Candidate disposition:** Component Reference: corresponding type page.
- **Explicit incoming route references found:** `_advanced_concepts/the_singleton_pattern.md:32`; `_getting_started/core_component_types.md:307`.
- **Section locators and provisional destination:**
  - L23 `Introduction` → Component Reference: corresponding type page.
  - L45 `Usage` → Component Reference: corresponding type page.
  - L139 `Requirements` → Component Reference: corresponding type page.
  - L189 `API Reference` → Component Reference: corresponding type page.
  - L191 `API Reference > Actions` → Component Reference: corresponding type page.
  - L198 `API Reference > Actions > (Async) export (Action)` → Component Reference: corresponding type page.
  - L210 `API Reference > Actions > (Async) import (Action)` → Component Reference: corresponding type page.
  - L223 `API Reference > Actions > (Async) clear (Action)` → Component Reference: corresponding type page.
  - L234 `API Reference > Actions > (Async) reset (Action)` → Component Reference: corresponding type page.

### `_component_types/type_date.md`

- **Current title / permalink / nav:** «date» Component Type / `/component_types/type_date` / `6`.
- **Candidate disposition:** Component Reference: corresponding type page.
- **Explicit incoming route references found:** `_getting_started/core_component_types.md:254`.
- **Section locators and provisional destination:**
  - L23 `Introduction` → Component Reference: corresponding type page.
  - L33 `Usage` → Component Reference: corresponding type page.
  - L100 `Usage > Data Formats` → Component Reference: corresponding type page.
  - L113 `Requirements` → Component Reference: corresponding type page.
  - L171 `API Reference` → Component Reference: corresponding type page.
  - L173 `API Reference > Actions` → Component Reference: corresponding type page.
  - L179 `API Reference > Actions > (Async) export (Action)` → Component Reference: corresponding type page.
  - L191 `API Reference > Actions > (Async) import (Action)` → Component Reference: corresponding type page.
  - L204 `API Reference > Actions > (Async) clear (Action)` → Component Reference: corresponding type page.
  - L215 `API Reference > Actions > (Async) reset (Action)` → Component Reference: corresponding type page.

### `_component_types/type_datetime-local.md`

- **Current title / permalink / nav:** «datetime-local» Component Type / `/component_types/type_datetime-local` / `8`.
- **Candidate disposition:** Component Reference: corresponding type page.
- **Explicit incoming route references found:** none detected by this limited scan; verify reference links/includes in Step 02.
- **Section locators and provisional destination:**
  - L23 `Introduction` → Component Reference: corresponding type page.
  - L33 `Usage` → Component Reference: corresponding type page.
  - L112 `Usage > Data Formats` → Component Reference: corresponding type page.
  - L129 `Requirements` → Component Reference: corresponding type page.
  - L186 `API Reference` → Component Reference: corresponding type page.
  - L188 `API Reference > Actions` → Component Reference: corresponding type page.
  - L194 `API Reference > Actions > (Async) export (Action)` → Component Reference: corresponding type page.
  - L206 `API Reference > Actions > (Async) import (Action)` → Component Reference: corresponding type page.
  - L219 `API Reference > Actions > (Async) clear (Action)` → Component Reference: corresponding type page.
  - L230 `API Reference > Actions > (Async) reset (Action)` → Component Reference: corresponding type page.

### `_component_types/type_file.md`

- **Current title / permalink / nav:** «file» Component Type / `/component_types/type_file` / `26`.
- **Candidate disposition:** Component Reference: corresponding type page.
- **Explicit incoming route references found:** `_advanced_concepts/the_singleton_pattern.md:33`; `_advanced_concepts/the_singleton_pattern.md:146`; `_advanced_concepts/the_singleton_pattern.md:152`; `_advanced_concepts/the_singleton_pattern.md:160`; `_component_types/type_audio.md:23`; `_component_types/type_image.md:27`; `_component_types/type_image.md:640`; `_component_types/type_image.md:703`; `_component_types/type_image.md:706`; `_component_types/type_video.md:23`; `_resources/cheatsheet.md:279`.
- **Section locators and provisional destination:**
  - L24 `Introduction` → Component Reference: corresponding type page.
  - L48 `Declaring a File Field` → Component Reference: corresponding type page.
  - L50 `Declaring a File Field > Real Field` → Component Reference: corresponding type page.
  - L68 `Declaring a File Field > The Singleton Pattern` → Component Reference: corresponding type page.
  - L228 `Importing and Exporting Data` → Component Reference: corresponding type page.
  - L236 `Importing and Exporting Data > Raw Format (data URL)` → Component Reference: corresponding type page.
  - L316 `Importing and Exporting Data > Structured Format (format: "json")` → Component Reference: corresponding type page.
  - L336 `Importing and Exporting Data > Encodings` → Component Reference: corresponding type page.
  - L348 `Importing and Exporting Data > Empty Fields` → Component Reference: corresponding type page.
  - L354 `Importing and Exporting Data > URLs as Input Values (Sugar)` → Component Reference: corresponding type page.
  - L373 `Options` → Component Reference: corresponding type page.
  - L375 `Options > accept` → Component Reference: corresponding type page.
  - L381 `Options > format and encoding` → Component Reference: corresponding type page.
  - L386 `Options > Disabling acquisition` → Component Reference: corresponding type page.
  - L397 `Files in Lists (of: "file")` → Component Reference: corresponding type page.
  - L544 `Files in Lists (of: "file") > Adding Files in Bulk` → Component Reference: corresponding type page.
  - L551 `Files in Lists (of: "file") > Dropping Files onto a List` → Component Reference: corresponding type page.
  - L557 `Files in Lists (of: "file") > Limits and Confirmation` → Component Reference: corresponding type page.
  - L564 `Downloading a File` → Component Reference: corresponding type page.
  - L697 `Limitations` → Component Reference: corresponding type page.

### `_component_types/type_form.md`

- **Current title / permalink / nav:** «form» Component Type / `/component_types/type_form` / `1`.
- **Candidate disposition:** Component Reference: corresponding type page.
- **Explicit incoming route references found:** `_about/faq.md:647`; `_about/faq.md:697`; `_about/showcase.md:126`; `_about/showcase.md:469`; `_about/showcase2.md:594`; `_about/showcase2.md:624`; `_advanced_concepts/security_considerations.md:226`; `_advanced_concepts/the_smarkform_constructor.md:53`; `_advanced_concepts/the_smarkform_constructor.md:56`; `_advanced_concepts/the_smarkform_constructor.md:57`; `_advanced_concepts/the_smarkform_constructor.md:58`; `_advanced_concepts/the_smarkform_constructor.md:59`; `_component_types/type_list.md:55`; `_getting_started/core_component_types.md:30`; `_resources/cheatsheet.md:36`; `_resources/cheatsheet.md:37`; `_resources/cheatsheet.md:42`; `_resources/cheatsheet.md:44`; `_resources/cheatsheet.md:45`; `_resources/cheatsheet.md:46`; `_resources/cheatsheet.md:127`; `_resources/cheatsheet.md:369`; `_working_with_forms/value_coercion.md:286`.
- **Section locators and provisional destination:**
  - L240 `Options` → Component Reference: corresponding type page.
  - L242 `Options > value` → Component Reference: corresponding type page.
  - L251 `Options > value > focus_on_click` → Component Reference: corresponding type page.
  - L259 `Options > value > auto_id` → Component Reference: corresponding type page.
  - L273 `Options > Actions` → Component Reference: corresponding type page.
  - L280 `Options > Actions > (Async) export (Action)` → Component Reference: corresponding type page.
  - L291 `Options > Actions > (Async) import (Action)` → Component Reference: corresponding type page.
  - L304 `Options > Actions > (Async) clear (Action)` → Component Reference: corresponding type page.
  - L320 `Options > Actions > (Async) reset (Action)` → Component Reference: corresponding type page.
  - L336 `Options > Actions > (Async) submit (Action)` → Component Reference: corresponding type page.
  - L454 `Options > Actions > Future: null (Action)` → Component Reference: corresponding type page.

### `_component_types/type_image.md`

- **Current title / permalink / nav:** «image» Component Type / `/component_types/type_image` / `27`.
- **Candidate disposition:** Component Reference: corresponding type page.
- **Explicit incoming route references found:** `_component_types/type_file.md:371`; `_component_types/type_file.md:714`; `_resources/cheatsheet.md:311`.
- **Section locators and provisional destination:**
  - L24 `Introduction` → Component Reference: corresponding type page.
  - L57 `Declaring an Image Field` → Component Reference: corresponding type page.
  - L59 `Declaring an Image Field > Real Field — a Profile Form` → Component Reference: corresponding type page.
  - L183 `Declaring an Image Field > The Singleton Pattern` → Component Reference: corresponding type page.
  - L279 `The Placeholder` → Component Reference: corresponding type page.
  - L358 `Acquiring Images` → Component Reference: corresponding type page.
  - L389 `Resizing and Converting` → Component Reference: corresponding type page.
  - L471 `Validation and image_enforce` → Component Reference: corresponding type page.
  - L505 `Images in Lists (Galleries)` → Component Reference: corresponding type page.
  - L624 `Downloading an Image` → Component Reference: corresponding type page.
  - L638 `Importing and Exporting Data` → Component Reference: corresponding type page.
  - L660 `Importing and Exporting Data > URLs as Input Values (Sugar)` → Component Reference: corresponding type page.
  - L689 `Limitations` → Component Reference: corresponding type page.

### `_component_types/type_input.md`

- **Current title / permalink / nav:** «input» Component Type / `/component_types/type_input` / `3`.
- **Candidate disposition:** Component Reference: corresponding type page.
- **Explicit incoming route references found:** `_about/showcase2.md:881`; `_advanced_concepts/the_singleton_pattern.md:29`; `_advanced_concepts/the_singleton_pattern.md:31`; `_component_types/type_color.md:25`; `_component_types/type_date.md:25`; `_component_types/type_datetime-local.md:25`; `_component_types/type_number.md:25`; `_component_types/type_radio.md:25`; `_component_types/type_time.md:25`; `_getting_started/core_component_types.md:57`; `_getting_started/core_component_types.md:255`; `_getting_started/core_component_types.md:308`.
- **Section locators and provisional destination:**
  - L23 `Introduction` → Component Reference: corresponding type page.
  - L32 `Usage` → Component Reference: corresponding type page.
  - L54 `JSON format (\`format\` option)` → Component Reference: corresponding type page.
  - L83 `API Reference` → Component Reference: corresponding type page.
  - L85 `API Reference > Actions` → Component Reference: corresponding type page.
  - L92 `API Reference > Actions > (Async) export (Action)` → Component Reference: corresponding type page.
  - L104 `API Reference > Actions > (Async) import (Action)` → Component Reference: corresponding type page.
  - L118 `API Reference > Actions > (Async) clear (Action)` → Component Reference: corresponding type page.
  - L129 `API Reference > Actions > (Async) reset (Action)` → Component Reference: corresponding type page.

### `_component_types/type_label.md`

- **Current title / permalink / nav:** «label» Component Type / `/component_types/type_label` / `10001`.
- **Candidate disposition:** Component Reference: corresponding type page.
- **Explicit incoming route references found:** `_about/showcase2.md:207`; `_about/showcase2.md:450`; `_getting_started/core_component_types.md:149`; `_getting_started/core_component_types.md:450`; `_getting_started/core_concepts.md:449`.
- **Section locators and provisional destination:**
  - L28 `Overview` → Component Reference: corresponding type page.
  - L155 `Details` → Component Reference: corresponding type page.
  - L177 `Targetting non scalar fields` → Component Reference: corresponding type page.
  - L282 `Options` → Component Reference: corresponding type page.
  - L291 `API Reference` → Component Reference: corresponding type page.

### `_component_types/type_list.md`

- **Current title / permalink / nav:** «list» Component Type / `/component_types/type_list` / `2`.
- **Candidate disposition:** Component Reference: corresponding type page.
- **Explicit incoming route references found:** `_about/faq.md:545`; `_about/showcase.md:128`; `_about/showcase.md:131`; `_about/showcase.md:134`; `_about/showcase.md:136`; `_about/showcase.md:1189`; `_about/showcase.md:1196`; `_about/showcase2.md:384`; `_about/showcase2.md:430`; `_about/showcase2.md:440`; `_about/showcase2.md:472`; `_about/showcase2.md:595`; `_about/showcase2.md:625`; `_about/showcase2.md:636`; `_about/showcase2.md:669`; `_about/showcase2.md:680`; `_about/showcase2.md:690`; `_about/showcase2.md:871`; `_about/showcase2.md:892`; `_advanced_concepts/mixin_types.md:1074`; `_advanced_concepts/the_singleton_pattern.md:165`; `_advanced_concepts/the_smarkform_constructor.md:54`; `_getting_started/core_component_types.md:31`; `_getting_started/core_component_types.md:152`; `_getting_started/core_component_types.md:170`; `_getting_started/quick_start.md:625`; `_resources/cheatsheet.md:43`; `_resources/cheatsheet.md:113`; `_resources/cheatsheet.md:125`; `_resources/cheatsheet.md:126`; `_resources/cheatsheet.md:128`; `_resources/cheatsheet.md:129`; `_resources/cheatsheet.md:130`; `_working_with_forms/value_coercion.md:287`.
- **Section locators and provisional destination:**
  - L60 `List items` → Component Reference: corresponding type page.
  - L134 `List items > Scalar item types` → Component Reference: corresponding type page.
  - L196 `List items > Applying the singleton pattern` → Component Reference: corresponding type page.
  - L249 `List items > Nesting lists` → Component Reference: corresponding type page.
  - L332 `List items > Options` → Component Reference: corresponding type page.
  - L334 `List items > Options > value` → Component Reference: corresponding type page.
  - L343 `List items > Options > min_items` → Component Reference: corresponding type page.
  - L352 `List items > Options > max_items` → Component Reference: corresponding type page.
  - L367 `List items > Options > sortable` → Component Reference: corresponding type page.
  - L432 `List items > Options > moving_depth (Cross-List Drag scope)` → Component Reference: corresponding type page.
  - L660 `List items > Options > export_empties` → Component Reference: corresponding type page.
  - L669 `List items > Options > of` → Component Reference: corresponding type page.
  - L679 `List items > Actions` → Component Reference: corresponding type page.
  - L686 `List items > Actions > (Async) export (Action)` → Component Reference: corresponding type page.
  - L696 `List items > Actions > (Async) import (Action)` → Component Reference: corresponding type page.
  - L713 `List items > Actions > (Async) clear (Action)` → Component Reference: corresponding type page.
  - L726 `List items > Actions > (Async) reset (Action)` → Component Reference: corresponding type page.
  - L739 `List items > Actions > (Async) addItem (Action)` → Component Reference: corresponding type page.
  - L754 `List items > Actions > (Async) removeItem (Action)` → Component Reference: corresponding type page.
  - L769 `List items > Actions > count (Action)` → Component Reference: corresponding type page.
  - L777 `List items > Actions > position (Action)` → Component Reference: corresponding type page.

### `_component_types/type_number.md`

- **Current title / permalink / nav:** «number» Component Type / `/component_types/type_number` / `4`.
- **Candidate disposition:** Component Reference: corresponding type page.
- **Explicit incoming route references found:** `_advanced_concepts/the_singleton_pattern.md:30`; `_getting_started/core_component_types.md:253`.
- **Section locators and provisional destination:**
  - L23 `Introduction` → Component Reference: corresponding type page.
  - L31 `Usage` → Component Reference: corresponding type page.
  - L63 `Requirements` → Component Reference: corresponding type page.
  - L112 `API Reference` → Component Reference: corresponding type page.
  - L114 `API Reference > Actions` → Component Reference: corresponding type page.
  - L121 `API Reference > Actions > (Async) export (Action)` → Component Reference: corresponding type page.
  - L133 `API Reference > Actions > (Async) import (Action)` → Component Reference: corresponding type page.
  - L146 `API Reference > Actions > (Async) clear (Action)` → Component Reference: corresponding type page.
  - L157 `API Reference > Actions > (Async) reset (Action)` → Component Reference: corresponding type page.

### `_component_types/type_radio.md`

- **Current title / permalink / nav:** «radio» Component Type / `/component_types/type_radio` / `9`.
- **Candidate disposition:** Component Reference: corresponding type page.
- **Explicit incoming route references found:** none detected by this limited scan; verify reference links/includes in Step 02.
- **Section locators and provisional destination:**
  - L23 `Introduction` → Component Reference: corresponding type page.
  - L31 `Usage` → Component Reference: corresponding type page.
  - L62 `Radio Button Groups` → Component Reference: corresponding type page.
  - L73 `Special Interactions` → Component Reference: corresponding type page.
  - L81 `Requirements` → Component Reference: corresponding type page.
  - L86 `API Reference` → Component Reference: corresponding type page.
  - L88 `API Reference > Actions` → Component Reference: corresponding type page.
  - L94 `API Reference > Actions > (Async) export (Action)` → Component Reference: corresponding type page.
  - L106 `API Reference > Actions > (Async) import (Action)` → Component Reference: corresponding type page.
  - L119 `API Reference > Actions > (Async) clear (Action)` → Component Reference: corresponding type page.
  - L130 `API Reference > Actions > (Async) reset (Action)` → Component Reference: corresponding type page.

### `_component_types/type_select.md`

- **Current title / permalink / nav:** «select» Component Type / `/component_types/type_select` / `8`.
- **Candidate disposition:** Component Reference: corresponding type page.
- **Explicit incoming route references found:** `_getting_started/core_component_types.md:418`.
- **Section locators:** no H2–H4 headings; inventory page body/front matter as a single source unit.

### `_component_types/type_time.md`

- **Current title / permalink / nav:** «time» Component Type / `/component_types/type_time` / `7`.
- **Candidate disposition:** Component Reference: corresponding type page.
- **Explicit incoming route references found:** none detected by this limited scan; verify reference links/includes in Step 02.
- **Section locators and provisional destination:**
  - L23 `Introduction` → Component Reference: corresponding type page.
  - L33 `Usage` → Component Reference: corresponding type page.
  - L106 `Usage > Data Formats` → Component Reference: corresponding type page.
  - L121 `Requirements` → Component Reference: corresponding type page.
  - L179 `API Reference` → Component Reference: corresponding type page.
  - L181 `API Reference > Actions` → Component Reference: corresponding type page.
  - L187 `API Reference > Actions > (Async) export (Action)` → Component Reference: corresponding type page.
  - L199 `API Reference > Actions > (Async) import (Action)` → Component Reference: corresponding type page.
  - L212 `API Reference > Actions > (Async) clear (Action)` → Component Reference: corresponding type page.
  - L223 `API Reference > Actions > (Async) reset (Action)` → Component Reference: corresponding type page.

### `_component_types/type_trigger.md`

- **Current title / permalink / nav:** «trigger» Component Type / `/component_types/type_trigger` / `10000`.
- **Candidate disposition:** Component Reference: corresponding type page.
- **Explicit incoming route references found:** `_about/showcase2.md:230`; `_advanced_concepts/events.md:34`; `_getting_started/core_component_types.md:150`; `_getting_started/core_component_types.md:437`; `_getting_started/core_concepts.md:958`; `_getting_started/core_concepts.md:969`.
- **Section locators and provisional destination:**
  - L21 `Introduction` → Component Reference: corresponding type page.
  - L33 `Options` → Component Reference: corresponding type page.
  - L39 `Options > action` → Component Reference: corresponding type page.
  - L46 `Options > context` → Component Reference: corresponding type page.
  - L57 `Options > target` → Component Reference: corresponding type page.
  - L65 `Options > hotkey` → Component Reference: corresponding type page.
  - L78 `Interactions` → Component Reference: corresponding type page.
  - L83 `Interactions > Hot Keys` → Component Reference: corresponding type page.
  - L95 `Origin` → Component Reference: corresponding type page.
  - L106 `Trigger Components` → Component Reference: corresponding type page.

### `_component_types/type_video.md`

- **Current title / permalink / nav:** video Component Type / `/component_types/type_video` / `28`.
- **Candidate disposition:** Component Reference: corresponding type page.
- **Explicit incoming route references found:** none detected by this limited scan; verify reference links/includes in Step 02.
- **Section locators and provisional destination:**
  - L21 `Overview` → Component Reference: corresponding type page.
  - L36 `Try It` → Component Reference: corresponding type page.
  - L93 `Try It > Singleton With An Editable Name` → Component Reference: corresponding type page.
  - L145 `Try It > Video List` → Component Reference: corresponding type page.
  - L186 `Try It > Form Items With Related Metadata` → Component Reference: corresponding type page.
  - L250 `Empty State And Playback` → Component Reference: corresponding type page.
  - L274 `Empty State And Playback > Keyboard And Caption Navigation` → Component Reference: corresponding type page.
  - L291 `Validation And Options` → Component Reference: corresponding type page.
  - L312 `Singletons And Lists` → Component Reference: corresponding type page.
  - L344 `Browser Limits` → Component Reference: corresponding type page.

### `_getting_started/core_component_types.md`

- **Current title / permalink / nav:** Core Component Types / `/getting_started/core_component_types` / `4`.
- **Candidate disposition:** Component Reference: overview.
- **Explicit incoming route references found:** `_about/faq.md:180`; `_about/faq.md:285`; `_about/showcase2.md:196`; `_about/showcase2.md:700`; `_component_types/type_color.md:42`; `_component_types/type_color.md:91`; `_component_types/type_color.md:98`; `_component_types/type_date.md:30`; `_component_types/type_datetime-local.md:30`; `_component_types/type_file.md:32`; `_component_types/type_image.md:187`; `_component_types/type_image.md:705`; `_component_types/type_input.md:28`; `_component_types/type_list.md:140`; `_component_types/type_list.md:200`; `_component_types/type_number.md:28`; `_component_types/type_time.md:30`; `_getting_started/core_concepts.md:912`; `_getting_started/quick_start.md:223`; `_resources/AGENTS/SmarkForm-Forms.md:223`; `_resources/cheatsheet.md:95`.
- **Section locators and provisional destination:**
  - L26 `Complex field types` → Component Reference: overview.
  - L28 `Complex field types > type: form and type: list` → Component Reference: overview.
  - L40 `Scalar field types` → Component Reference: overview.
  - L55 `Scalar field types > type: input` → Component Reference: overview.
  - L134 `Scalar field types > type: input > The Singleton Pattern.` → Component Reference: overview.
  - L251 `Scalar field types > type: number and type: date` → Component Reference: overview.
  - L304 `Scalar field types > type: color` → Component Reference: overview.
  - L416 `Scalar field types > type: select` → Component Reference: overview.
  - L429 `Non field component types` → Component Reference: overview.
  - L435 `Non field component types > type: trigger` → Component Reference: overview.
  - L448 `Non field component types > type: label` → Component Reference: overview.

### `_getting_started/core_concepts.md`

- **Current title / permalink / nav:** Core Concepts / `/getting_started/core_concepts` / `3`.
- **Candidate disposition:** Start Here: Core Concepts.
- **Explicit incoming route references found:** `_about/faq.md:131`; `_about/showcase2.md:184`; `_getting_started/quick_start.md:166`; `_getting_started/quick_start.md:215`; `_getting_started/quick_start.md:217`; `_getting_started/quick_start.md:220`; `_getting_started/quick_start.md:282`; `_getting_started/quick_start.md:823`; `_resources/cheatsheet.md:64`.
- **Section locators and provisional destination:**
  - L23 `Forms, Lists and (other) Fields` → Start Here: Core Concepts.
  - L83 `Forms, Lists and (other) Fields > Fields` → Start Here: Core Concepts.
  - L187 `Forms, Lists and (other) Fields > Form nesting` → Start Here: Core Concepts.
  - L267 `Forms, Lists and (other) Fields > Lists` → Start Here: Core Concepts.
  - L433 `Forms, Lists and (other) Fields > Component Types` → Start Here: Core Concepts.
  - L442 `Forms, Lists and (other) Fields > Labels` → Start Here: Core Concepts.
  - L454 `Forms, Lists and (other) Fields > Triggers` → Core Concepts overview plus Step 07 canonical guide.
  - L493 `Forms, Lists and (other) Fields > Actions` → Core Concepts overview plus Step 07 canonical guide.
  - L506 `Forms, Lists and (other) Fields > Triggers target` → Core Concepts overview plus Step 07 canonical guide.
  - L555 `Forms, Lists and (other) Fields > Behaviour tunning` → Start Here: Core Concepts.
  - L598 `Forms, Lists and (other) Fields > Constraining lists` → Start Here: Core Concepts.
  - L616 `Forms, Lists and (other) Fields > Singletons` → Start Here: Core Concepts.
  - L683 `Forms, Lists and (other) Fields > Addressability` → Core Concepts overview plus Step 07 canonical guide.
  - L725 `Forms, Lists and (other) Fields > More...` → Start Here: Core Concepts.
  - L732 `The \`data-smark\` Attribute` → Start Here: Core Concepts.
  - L785 `The \`data-smark\` Attribute > Syntax` → Start Here: Core Concepts.
  - L810 `The \`data-smark\` Attribute > Shorthand Syntaxes` → Start Here: Core Concepts.
  - L895 `Required and inferred properties` → Start Here: Core Concepts.
  - L909 `Required and inferred properties > Component-specific options` → Start Here: Core Concepts.
  - L918 `Components and Actions` → Core Concepts overview plus Step 07 canonical guide.
  - L920 `Components and Actions > Components` → Core Concepts overview plus Step 07 canonical guide.
  - L943 `Components and Actions > Actions` → Core Concepts overview plus Step 07 canonical guide.
  - L952 `Components and Actions > Trigger Components` → Core Concepts overview plus Step 07 canonical guide.
  - L972 `Accessing Components` → Start Here: Core Concepts.

### `_getting_started/getting_smarkform.md`

- **Current title / permalink / nav:** Getting SmarkForm / `/getting_started/getting_smarkform` / `2`.
- **Candidate disposition:** Start Here: Getting SmarkForm/installation.
- **Explicit incoming route references found:** `_about/faq.md:104`; `_about/features.md:192`; `_getting_started/quick_start.md:1005`; `_resources/CDN.md:36`.
- **Section locators and provisional destination:**
  - L24 `Available formats` → Start Here: Getting SmarkForm/installation.
  - L44 `Using a CDN (Esiest approach)` → Start Here: Getting SmarkForm/installation.
  - L50 `Using a CDN (Esiest approach) > ES module` → Start Here: Getting SmarkForm/installation.
  - L63 `Using a CDN (Esiest approach) > UMD Module` → Start Here: Getting SmarkForm/installation.
  - L100 `Download minified` → Start Here: Getting SmarkForm/installation.
  - L106 `Installing it from NPM` → Start Here: Getting SmarkForm/installation.
  - L133 `Clone from GitHub` → Start Here: Getting SmarkForm/installation.

### `_getting_started/quick_start.md`

- **Current title / permalink / nav:** Quick Start / `/getting_started/quick_start` / `1`.
- **Candidate disposition:** Split between compact Quick Start and Using SmarkForm/canonical references.
- **Explicit incoming route references found:** `_about/faq.md:205`; `_about/faq.md:234`; `_about/features.md:46`; `_about/showcase.md:28`; `_about/showcase.md:1408`; `_about/showcase2.md:155`; `_working_with_forms/form_traversing.md:35`; `index.md:351`.
- **Section locators and provisional destination:**
  - L33 `Basic setup` → Compact Quick Start; full setup details to Getting SmarkForm.
  - L35 `Basic setup > Create an HTML document` → Compact Quick Start; full setup details to Getting SmarkForm.
  - L56 `Basic setup > Include SmarkForm Library` → Compact Quick Start; full setup details to Getting SmarkForm.
  - L98 `Basic setup > Create a simple HTML form` → Compact Quick Start; full setup details to Getting SmarkForm.
  - L138 `Basic setup > Initialize the Form` → Compact Quick Start; full setup details to Getting SmarkForm.
  - L162 `Do the magic` → Quick Start / Using SmarkForm split; decide against source locator in Step 08.
  - L227 `Do the magic > Actions and Triggers` → Using SmarkForm outline and/or canonical Guides/Reference; curate in Step 08.
  - L296 `Do the magic > Exporting data` → Using SmarkForm outline and/or canonical Guides/Reference; curate in Step 08.
  - L367 `Do the magic > Importing data` → Using SmarkForm outline and/or canonical Guides/Reference; curate in Step 08.
  - L423 `Do the magic > Form traversing` → Using SmarkForm outline and/or canonical Guides/Reference; curate in Step 08.
  - L532 `Do the magic > Context and Target` → Using SmarkForm outline and/or canonical Guides/Reference; curate in Step 08.
  - L694 `Go further...` → Quick Start / Using SmarkForm split; decide against source locator in Step 08.
  - L699 `Go further... > Event handling` → Using SmarkForm outline and/or canonical Guides/Reference; curate in Step 08.
  - L803 `Go further... > Hot Keys` → Using SmarkForm outline and/or canonical Guides/Reference; curate in Step 08.
  - L806 `Go further... > Animated and sortable lists` → Using SmarkForm outline and/or canonical Guides/Reference; curate in Step 08.
  - L811 `Customize your form` → Using SmarkForm outline and/or canonical Guides/Reference; curate in Step 08.
  - L948 `Final notes` → Quick Start / Using SmarkForm split; decide against source locator in Step 08.
  - L951 `Final notes > Boilerplate file` → Getting SmarkForm / Download / CDN.
  - L972 `Final notes > You don't need a form tag` → Quick Start or Core Concepts; reconcile native-submit behavior.
  - L984 `Final notes > Using your own copy of SmarkForm library` → Getting SmarkForm / Download / CDN.
  - L998 `Final notes > Alternative forms to get/include Smarkform` → Compact Quick Start; full setup details to Getting SmarkForm.
  - L1008 `Final notes > The option's object` → Using SmarkForm outline and/or canonical Guides/Reference; curate in Step 08.

### `_resources/AGENTS/SmarkForm-Forms.md`

- **Current title / permalink / nav:** SmarkForm Forms — Agent Knowledge / `/resources/AGENTS/SmarkForm-Forms` / `1`.
- **Candidate disposition:** AI & Agents.
- **Explicit incoming route references found:** `_resources/ai-agents.md:24`; `_resources/ai-agents.md:136`.
- **Section locators and provisional destination:**
  - L24 `Consuming SmarkForm in External Projects` → AI & Agents.
  - L34 `Consuming SmarkForm in External Projects > Via CDN (quickest — good for demos and AI-generated playgrounds)` → AI & Agents.
  - L69 `Consuming SmarkForm in External Projects > Via npm (bundler projects)` → AI & Agents.
  - L86 `Consuming SmarkForm in External Projects > Via downloaded copy` → AI & Agents.
  - L101 `Minimal Working Form` → AI & Agents.
  - L128 `Common Component Patterns` → AI & Agents.
  - L130 `Common Component Patterns > Plain text / number / email inputs` → AI & Agents.
  - L143 `Common Component Patterns > Null-aware numeric / date / time / color fields` → AI & Agents.
  - L157 `Common Component Patterns > Radio group` → AI & Agents.
  - L167 `Common Component Patterns > Nested subform` → AI & Agents.
  - L179 `Common Component Patterns > Label (read-only display field)` → AI & Agents.
  - L190 `Common Component Patterns > Label auto-linking` → AI & Agents.
  - L206 `Common Component Patterns > Singleton pattern` → AI & Agents.
  - L225 `Common Component Patterns > Collapsible section` → AI & Agents.
  - L246 `List Patterns` → AI & Agents.
  - L248 `List Patterns > Simple list with add/remove buttons inside the list` → AI & Agents.
  - L264 `List Patterns > List with min_items and max_items` → AI & Agents.
  - L277 `List Patterns > List with empty_list template` → AI & Agents.
  - L288 `List Patterns > List with initial value (pre-populated)` → AI & Agents.
  - L300 `List Patterns > Sortable list` → AI & Agents.
  - L313 `List Patterns > export_empties` → AI & Agents.
  - L328 `List Patterns > Buttons outside a list (using context path)` → AI & Agents.
  - L344 `Action Triggers` → AI & Agents.
  - L357 `Action Triggers > Export / Import with a linked textarea` → AI & Agents.
  - L367 `Action Triggers > Hotkeys` → AI & Agents.
  - L380 `Default Values and Reset Semantics` → AI & Agents.
  - L382 `Default Values and Reset Semantics > Setting a default via HTML` → AI & Agents.
  - L400 `Default Values and Reset Semantics > import() updates the default (since v0.13.0)` → AI & Agents.
  - L419 `Listening to Events` → AI & Agents.
  - L441 `Programmatic Access` → AI & Agents.
  - L472 `Accessibility and UX Conventions` → AI & Agents.
  - L484 `Prompt Templates for Developers` → AI & Agents.
  - L488 `Prompt Templates for Developers > Prompt: Create a simple contact form` → AI & Agents.
  - L497 `Prompt Templates for Developers > Prompt: Create a form with a repeating list` → AI & Agents.
  - L512 `Prompt Templates for Developers > Prompt: Add a SmarkForm form to an existing page` → AI & Agents.
  - L525 `Agent Checklist` → AI & Agents.

### `_resources/AGENTS/SmarkForm-Usage.md`

- **Current title / permalink / nav:** SmarkForm Usage — Agent Knowledge / `/resources/AGENTS/SmarkForm-Usage` / `2`.
- **Candidate disposition:** AI & Agents.
- **Explicit incoming route references found:** `_resources/AGENTS/SmarkForm-Forms.md:18`; `_resources/AGENTS/SmarkForm-Forms.md:537`; `_resources/ai-agents.md:25`.
- **Section locators and provisional destination:**
  - L18 `Component Types` → AI & Agents.
  - L39 `File Fields — Key Rules` → AI & Agents.
  - L56 `Image and Video Fields` → AI & Agents.
  - L71 `How SmarkForm Enhances HTML` → AI & Agents.
  - L103 `List Component — Critical Rules` → AI & Agents.
  - L107 `List Component — Critical Rules > Template Roles` → AI & Agents.
  - L121 `List Component — Critical Rules > Buttons inside vs. outside a list` → AI & Agents.
  - L157 `List Component — Critical Rules > List Initialization with \`value\` Property` → AI & Agents.
  - L168 `List Component — Critical Rules > \`export_empties\` Behavior` → AI & Agents.
  - L185 `Form Component — \`value\` and \`defaultValue\`` → AI & Agents.
  - L198 `CSS Layout with SmarkForm Lists` → AI & Agents.
  - L202 `CSS Layout with SmarkForm Lists > CSS Grid with Lists` → AI & Agents.
  - L240 `Actions` → AI & Agents.
  - L255 `Actions > Action Context Resolution` → AI & Agents.
  - L268 `Actions > Action Target Resolution` → AI & Agents.
  - L307 `Actions > \`@action\` Decorator — Calling Convention and Nuances` → AI & Agents.
  - L313 `Actions > \`@action\` Decorator — Calling Convention and Nuances > Signature convention` → AI & Agents.
  - L333 `Actions > \`@action\` Decorator — Calling Convention and Nuances > How triggers call actions` → AI & Agents.
  - L346 `Actions > \`@action\` Decorator — Calling Convention and Nuances > The \`@action\` wrapper — what it does` → AI & Agents.
  - L368 `Actions > \`@action\` Decorator — Calling Convention and Nuances > Programmatic calls — prototype method` → AI & Agents.
  - L378 `Actions > \`@action\` Decorator — Calling Convention and Nuances > \`export_to_target\` and \`import_from_target\` — data pipeline decorators` → AI & Agents.
  - L385 `\`import()\` and \`set_default\` — Default Value Semantics` → AI & Agents.
  - L389 `\`import()\` and \`set_default\` — Default Value Semantics > Behavior Summary` → AI & Agents.
  - L399 `\`import()\` and \`set_default\` — Default Value Semantics > How the New Default is Computed` → AI & Agents.
  - L409 `\`import()\` and \`set_default\` — Default Value Semantics > Breaking Change From Earlier Versions` → AI & Agents.
  - L417 `\`import()\` and \`set_default\` — Default Value Semantics > HTML Trigger Example` → AI & Agents.
  - L426 `\`find()\` Prefer Relative Paths` → AI & Agents.
  - L444 `\`find()\` Timing — Must Await \`rendered\`` → AI & Agents.
  - L461 `List Template Roles — Complete Reference` → AI & Agents.
  - L473 `List Template Roles — Complete Reference > Rules for non-\`item\` roles` → AI & Agents.

### `_resources/CDN.md`

- **Current title / permalink / nav:** CDN / `/resources/CDN` / `3`.
- **Candidate disposition:** Start Here: CDN / Download.
- **Explicit incoming route references found:** `_getting_started/getting_smarkform.md:97`; `_resources/AGENTS/SmarkForm-Forms.md:66`; `_resources/download.md:72`.
- **Section locators and provisional destination:**
  - L24 `SmarkForm` → Start Here: CDN / Download.
  - L38 `SmarkForm > Latest Version` → Start Here: CDN / Download.
  - L47 `Other Resources` → Start Here: CDN / Download.
  - L49 `Other Resources > CSS` → Start Here: CDN / Download.
  - L65 `Other Resources > Latest sample CSS:` → Start Here: CDN / Download.

### `_resources/ai-agents.md`

- **Current title / permalink / nav:** AI & Agent Resources / `/resources/ai-agents` / `6`.
- **Candidate disposition:** AI & Agents.
- **Explicit incoming route references found:** `_about/features.md:261`.
- **Section locators and provisional destination:**
  - L20 `Agent Knowledge Files` → AI & Agents.
  - L32 `How to Use These Files When Prompting an AI` → AI & Agents.
  - L42 `How to Use These Files When Prompting an AI > Quick Reference Prompts` → AI & Agents.
  - L54 `Installable Skills` → AI & Agents.
  - L59 `Installable Skills > Core Skill (recommended)` → AI & Agents.
  - L73 `Installable Skills > Optional Advanced Skill` → AI & Agents.
  - L86 `Installable Skills > Import into opencode or similar tools` → AI & Agents.
  - L117 `Maintenance Rules for Skill Files` → AI & Agents.
  - L133 `Prompt Templates` → AI & Agents.
  - L139 `Prompt Templates > Simple form` → AI & Agents.
  - L148 `Prompt Templates > Form with a repeating list` → AI & Agents.
  - L163 `Prompt Templates > Adding SmarkForm to an existing page` → AI & Agents.

### `_resources/cheatsheet.md`

- **Current title / permalink / nav:** Developer Cheatsheet / `/resources/cheatsheet` / `5`.
- **Candidate disposition:** Component Reference: Developer Cheatsheet.
- **Explicit incoming route references found:** none detected by this limited scan; verify reference links/includes in Step 02.
- **Section locators and provisional destination:**
  - L25 `Constructor Options` → Component Reference: Developer Cheatsheet.
  - L53 `The \`data-smark\` Attribute` → Component Reference: Developer Cheatsheet.
  - L68 `Component Types` → Component Reference: Developer Cheatsheet.
  - L99 `List Template Roles` → Component Reference: Developer Cheatsheet.
  - L117 `Actions` → Component Reference: Developer Cheatsheet.
  - L137 `Context & Target Resolution` → Component Reference: Developer Cheatsheet.
  - L178 `Event System` → Component Reference: Developer Cheatsheet.
  - L210 `Data Import / Export` → Component Reference: Developer Cheatsheet.
  - L255 `File Fields` → Component Reference: Developer Cheatsheet.
  - L283 `Image Fields` → Component Reference: Developer Cheatsheet.
  - L315 `API Methods` → Component Reference: Developer Cheatsheet.
  - L321 `API Methods > Action methods` → Component Reference: Developer Cheatsheet.
  - L330 `API Methods > Utilities & Introspection` → Component Reference: Developer Cheatsheet.
  - L350 `Hotkeys` → Component Reference: Developer Cheatsheet.
  - L367 `Form Submission` → Component Reference: Developer Cheatsheet.
  - L385 `Quick Templates` → Component Reference: Developer Cheatsheet.
  - L387 `Quick Templates > Simple form` → Component Reference: Developer Cheatsheet.
  - L401 `Quick Templates > Nested form` → Component Reference: Developer Cheatsheet.
  - L410 `Quick Templates > List with all template roles` → Component Reference: Developer Cheatsheet.
  - L424 `Quick Templates > Trigger with context and target` → Component Reference: Developer Cheatsheet.
  - L431 `Quick Templates > Sortable list` → Component Reference: Developer Cheatsheet.
  - L443 `Quick Templates > Tooltip mixin with CSS` → Component Reference: Developer Cheatsheet.

### `_resources/download.md`

- **Current title / permalink / nav:** Download / `/resources/download` / `2`.
- **Candidate disposition:** Start Here: CDN / Download.
- **Explicit incoming route references found:** `_getting_started/getting_smarkform.md:102`; `_getting_started/quick_start.md:967`; `_resources/AGENTS/SmarkForm-Forms.md:89`; `_resources/CDN.md:52`.
- **Section locators and provisional destination:**
  - L23 `SmarkForm` → Start Here: CDN / Download.
  - L28 `SmarkForm > Latest version` → Start Here: CDN / Download.
  - L33 `SmarkForm > Older versions` → Start Here: CDN / Download.
  - L40 `Other Resources` → Start Here: CDN / Download.
  - L42 `Other Resources > CSS` → Start Here: CDN / Download.
  - L60 `Other Resources > Boilerplate Template` → Start Here: CDN / Download.

### `_resources/examples.md`

- **Current title / permalink / nav:** Examples / `/resources/examples` / `4`.
- **Candidate disposition:** Showcase & Examples: downloadable examples.
- **Explicit incoming route references found:** `_about/showcase.md:24`; `_community/branding.md:341`; `_getting_started/core_concepts.md:728`; `_getting_started/quick_start.md:19`; `_getting_started/quick_start.md:943`; `_getting_started/quick_start.md:962`; `_resources/CDN.md:54`; `_resources/download.md:48`; `_resources/download.md:57`; `_resources/user_guide.md:387`; `index.md:304`; `index.md:352`.
- **Section locators:** no H2–H4 headings; inventory page body/front matter as a single source unit.

### `_resources/playground.md`

- **Current title / permalink / nav:** Playground / `/resources/playground` / `7`.
- **Candidate disposition:** Showcase & Examples: Playground.
- **Explicit incoming route references found:** `_about/showcase2.md:241`.
- **Section locators and provisional destination:**
  - L40 `Architecture` → Showcase & Examples: Playground.
  - L63 `Exploring the Editor` → Showcase & Examples: Playground.
  - L76 `Random Examples` → Showcase & Examples: Playground.
  - L78 `Random Examples > Simple Calculator` → Showcase & Examples: Playground.

### `_resources/user_guide.md`

- **Current title / permalink / nav:** User Guide / `/resources/user_guide` / `1`.
- **Candidate disposition:** For End Users: User Guide.
- **Explicit incoming route references found:** `_about/faq.md:954`; `_community/branding.md:24`.
- **Section locators and provisional destination:**
  - L22 `Welcome to SmarkForm-Powered Forms` → For End Users: User Guide.
  - L31 `Keyboard Navigation` → For End Users: User Guide.
  - L35 `Keyboard Navigation > Navigating Between Fields` → For End Users: User Guide.
  - L53 `Keyboard Navigation > Navigating All Elements` → For End Users: User Guide.
  - L60 `Keyboard Navigation > Working with Multiline Text` → For End Users: User Guide.
  - L70 `Discovering and Using Hotkeys` → For End Users: User Guide.
  - L74 `Discovering and Using Hotkeys > How to Discover Available Shortcuts` → For End Users: User Guide.
  - L91 `Discovering and Using Hotkeys > SmarkForm's Unique Hotkey Approach` → For End Users: User Guide.
  - L110 `Discovering and Using Hotkeys > Second-Level Hotkeys: Reaching Outer Contexts` → For End Users: User Guide.
  - L131 `Discovering and Using Hotkeys > Common Hotkey Patterns` → For End Users: User Guide.
  - L142 `Working with Lists` → For End Users: User Guide.
  - L146 `Working with Lists > Adding and Removing Items` → For End Users: User Guide.
  - L165 `Working with Lists > Reordering Items` → For End Users: User Guide.
  - L195 `Working with Lists > Understanding List Limits` → For End Users: User Guide.
  - L210 `Working with Files and Media` → For End Users: User Guide.
  - L218 `Working with Files and Media > Files` → For End Users: User Guide.
  - L231 `Working with Files and Media > Images` → For End Users: User Guide.
  - L245 `Working with Files and Media > Videos` → For End Users: User Guide.
  - L271 `Working with Files and Media > Audio` → For End Users: User Guide.
  - L301 `Working with Collapsible Sections` → For End Users: User Guide.
  - L305 `Working with Collapsible Sections > Navigating Collapsible Sections with the Keyboard` → For End Users: User Guide.
  - L336 `Working with Nested Sections` → For End Users: User Guide.
  - L348 `Accessibility Features` → For End Users: User Guide.
  - L364 `Tips for Efficient Form Filling` → For End Users: User Guide.

### `_working_with_forms/data_import_and_export.md`

- **Current title / permalink / nav:** Importing and Exporting Data / `/working_with_forms/data_import_and_export` / `3`.
- **Candidate disposition:** Guides: corresponding task guide.
- **Explicit incoming route references found:** `_about/showcase.md:1220`; `_about/showcase2.md:218`; `_about/showcase2.md:231`; `_advanced_concepts/the_smarkform_constructor.md:53`; `_advanced_concepts/the_smarkform_constructor.md:54`; `_advanced_concepts/the_smarkform_constructor.md:199`; `_resources/cheatsheet.md:121`; `_resources/cheatsheet.md:122`; `_resources/cheatsheet.md:123`; `_resources/cheatsheet.md:124`; `_resources/cheatsheet.md:218`; `_resources/cheatsheet.md:319`; `_resources/cheatsheet.md:325`; `_resources/cheatsheet.md:326`; `_resources/cheatsheet.md:327`; `_resources/cheatsheet.md:328`; `_working_with_forms/value_coercion.md:285`.
- **Section locators and provisional destination:**
  - L25 `Overview` → Guides: corresponding task guide.
  - L50 `The \`export\` Action` → Guides: corresponding task guide.
  - L62 `The \`export\` Action > Return value structure` → Guides: corresponding task guide.
  - L135 `The \`export\` Action > The \`export_empties\` option` → Guides: corresponding task guide.
  - L180 `The \`import\` Action` → Guides: corresponding task guide.
  - L187 `The \`import\` Action > Accepted data formats` → Guides: corresponding task guide.
  - L244 `The \`import\` Action > The \`set_default\` option` → Guides: corresponding task guide.
  - L276 `The \`import\` Action > The \`focus\` option` → Guides: corresponding task guide.
  - L287 `Default Values, \`clear\`, and \`reset\`` → Guides: corresponding task guide.
  - L289 `Default Values, \`clear\`, and \`reset\` > Setting defaults via \`value\`` → Guides: corresponding task guide.
  - L315 `Default Values, \`clear\`, and \`reset\` > How \`import\` updates the default` → Guides: corresponding task guide.
  - L330 `Default Values, \`clear\`, and \`reset\` > Comparing \`clear\` and \`reset\`` → Guides: corresponding task guide.
  - L381 `Piping Data Between Components` → Guides: corresponding task guide.
  - L397 `Piping Data Between Components > Using \`target\` with \`export\`` → Guides: corresponding task guide.
  - L425 `Piping Data Between Components > Using \`target\` with \`import\`` → Guides: corresponding task guide.
  - L441 `Piping Data Between Components > Chaining export and import` → Guides: corresponding task guide.
  - L545 `Programmatic API` → Guides: corresponding task guide.
  - L580 `Common Patterns` → Guides: corresponding task guide.
  - L582 `Common Patterns > Loading initial data from a server` → Guides: corresponding task guide.
  - L604 `Common Patterns > Submitting form data to a backend` → Guides: corresponding task guide.
  - L633 `Common Patterns > Using \`<form>\` with \`mailto:\` and \`enctype\`` → Guides: corresponding task guide.
  - L651 `Common Patterns > Save and restore draft data` → Guides: corresponding task guide.

### `_working_with_forms/field_masking.md`

- **Current title / permalink / nav:** Field Masking / `/working_with_forms/field_masking` / `5`.
- **Candidate disposition:** Guides: corresponding task guide.
- **Explicit incoming route references found:** `_about/faq.md:1090`; `_about/showcase.md:2885`; `_about/showcase.md:2915`; `_about/showcase2.md:807`; `_about/showcase2.md:849`; `_about/showcase2.md:860`; `_advanced_concepts/the_smarkform_constructor.md:101`; `_advanced_concepts/the_smarkform_constructor.md:131`.
- **Section locators and provisional destination:**
  - L34 `How It Works` → Guides: corresponding task guide.
  - L54 `Applying a Mask to a Field` → Guides: corresponding task guide.
  - L104 `Registering a Mask` → Guides: corresponding task guide.
  - L106 `Registering a Mask > Via JavaScript` → Guides: corresponding task guide.
  - L152 `Registering a Mask > Via Declarative HTML` → Guides: corresponding task guide.
  - L192 `Credit Card Example (IMask)` → Guides: corresponding task guide.
  - L315 `Custom Mask Example (No Library + Singleton + List)` → Guides: corresponding task guide.
  - L400 `Mixin-Scoped Masks` → Guides: corresponding task guide.
  - L456 `Using Other Masking Libraries (Maska)` → Guides: corresponding task guide.
  - L547 `Error Handling` → Guides: corresponding task guide.
  - L552 `Error Handling > \`smark_mask_throw_on_missing: true\` (default)` → Guides: corresponding task guide.
  - L560 `Error Handling > \`smark_mask_throw_on_missing: false\`` → Guides: corresponding task guide.
  - L572 `Error Handling > Error Codes` → Guides: corresponding task guide.
  - L581 `Focus and Mask Factories` → Guides: corresponding task guide.
  - L615 `Masks and External Libraries` → Guides: corresponding task guide.

### `_working_with_forms/form_traversing.md`

- **Current title / permalink / nav:** Form Traversing / `/working_with_forms/form_traversing` / `0`.
- **Candidate disposition:** Guides: corresponding task guide.
- **Explicit incoming route references found:** `_about/faq.md:235`; `_about/faq.md:985`; `_about/features.md:221`; `_about/showcase2.md:396`; `_about/showcase2.md:637`; `_advanced_concepts/the_smarkform_constructor.md:199`; `_component_types/type_label.md:32`; `_component_types/type_label.md:163`; `_resources/cheatsheet.md:148`; `_resources/cheatsheet.md:319`; `_resources/cheatsheet.md:335`; `_working_with_forms/data_import_and_export.md:525`.
- **Section locators and provisional destination:**
  - L25 `Introduction` → Guides: corresponding task guide.
  - L39 `Path Syntax Overview` → Guides: corresponding task guide.
  - L43 `Path Syntax Overview > Absolute Paths` → Guides: corresponding task guide.
  - L55 `Path Syntax Overview > Relative Paths` → Guides: corresponding task guide.
  - L67 `Path Syntax Overview > Special Path Segments` → Guides: corresponding task guide.
  - L76 `Basic Navigation Patterns` → Guides: corresponding task guide.
  - L78 `Basic Navigation Patterns > Child Navigation` → Guides: corresponding task guide.
  - L91 `Basic Navigation Patterns > Parent Navigation` → Guides: corresponding task guide.
  - L104 `Basic Navigation Patterns > Root Access` → Guides: corresponding task guide.
  - L113 `Context and Target in Actions` → Guides: corresponding task guide.
  - L117 `Context and Target in Actions > Context Terminology` → Guides: corresponding task guide.
  - L125 `Context and Target in Actions > Triggers and Labels Are Not Field Components` → Guides: corresponding task guide.
  - L133 `Context and Target in Actions > Understanding Context` → Guides: corresponding task guide.
  - L155 `Context and Target in Actions > Understanding Target` → Guides: corresponding task guide.
  - L203 `Context and Target in Actions > Natural Context Resolution` → Guides: corresponding task guide.
  - L222 `Context and Target in Actions > Explicit Context and Target Specification` → Guides: corresponding task guide.
  - L247 `List Item Sibling Navigation` → Guides: corresponding task guide.
  - L251 `List Item Sibling Navigation > Syntax` → Guides: corresponding task guide.
  - L272 `List Item Sibling Navigation > Navigation Direction` → Guides: corresponding task guide.
  - L289 `List Item Sibling Navigation > Use Cases` → Guides: corresponding task guide.
  - L293 `List Item Sibling Navigation > Use Cases > Data Duplication and Synchronization` → Guides: corresponding task guide.
  - L304 `List Item Sibling Navigation > Use Cases > Comparative Operations` → Guides: corresponding task guide.
  - L316 `List Item Sibling Navigation > Use Cases > Sequential Data Processing` → Guides: corresponding task guide.
  - L327 `List Item Sibling Navigation > Examples` → Guides: corresponding task guide.
  - L329 `List Item Sibling Navigation > Examples > Copy Data Between Adjacent List Items` → Guides: corresponding task guide.
  - L370 `List Item Sibling Navigation > Examples > Sequential Form Validation` → Guides: corresponding task guide.
  - L391 `List Item Sibling Navigation > Examples > Dynamic List Navigation UI` → Guides: corresponding task guide.
  - L441 `Advanced Path Features` → Guides: corresponding task guide.
  - L443 `Advanced Path Features > Wildcard Patterns` → Guides: corresponding task guide.
  - L455 `Advanced Path Features > Wildcard \`context\` Multi-Dispatch` → Guides: corresponding task guide.
  - L601 `Advanced Path Features > Multi-Match Results` → Guides: corresponding task guide.
  - L616 `Practical Examples` → Guides: corresponding task guide.
  - L618 `Practical Examples > Data Copying Between List Items` → Guides: corresponding task guide.
  - L658 `Practical Examples > Complex Form Navigation` → Guides: corresponding task guide.
  - L676 `Practical Examples > Dynamic Context Resolution` → Guides: corresponding task guide.
  - L714 `Best Practices` → Guides: corresponding task guide.
  - L716 `Best Practices > Path Construction` → Guides: corresponding task guide.
  - L726 `Best Practices > Sibling Navigation Guidelines` → Guides: corresponding task guide.
  - L744 `Best Practices > Performance Considerations` → Guides: corresponding task guide.
  - L752 `Common Patterns and Idioms` → Guides: corresponding task guide.
  - L754 `Common Patterns and Idioms > Sequential Processing Pattern` → Guides: corresponding task guide.
  - L771 `Common Patterns and Idioms > Bidirectional Data Sync Pattern` → Guides: corresponding task guide.
  - L792 `Common Patterns and Idioms > Conditional Navigation Pattern` → Guides: corresponding task guide.
  - L810 `Common Patterns and Idioms > Form Section Coordination Pattern` → Guides: corresponding task guide.

### `_working_with_forms/hotkeys.md`

- **Current title / permalink / nav:** Hotkeys / `/working_with_forms/hotkeys` / `2`.
- **Candidate disposition:** Accessibility: corresponding guide.
- **Explicit incoming route references found:** `_about/faq.md:943`; `_about/showcase.md:1793`; `_about/showcase2.md:340`; `_about/showcase2.md:419`; `_component_types/type_trigger.md:73`; `_resources/cheatsheet.md:363`; `_working_with_forms/form_traversing.md:585`.
- **Section locators and provisional destination:**
  - L24 `Overview` → Accessibility: corresponding guide.
  - L41 `Defining a Hotkey` → Accessibility: corresponding guide.
  - L77 `Hotkey Reveal (Ctrl Discovery)` → Accessibility: corresponding guide.
  - L129 `Context Sensitivity` → Accessibility: corresponding guide.
  - L184 `Conflict Resolution` → Accessibility: corresponding guide.
  - L203 `Hiding Trigger Buttons (While Keeping Hotkeys)` → Accessibility: corresponding guide.
  - L305 `Accessibility Considerations` → Accessibility: corresponding guide.
  - L319 `Further Examples` → Accessibility: corresponding guide.

### `_working_with_forms/keyboard_navigation.md`

- **Current title / permalink / nav:** Keyboard Navigation / `/working_with_forms/keyboard_navigation` / `1`.
- **Candidate disposition:** Accessibility: corresponding guide.
- **Explicit incoming route references found:** `_about/showcase.md:130`; `_about/showcase.md:2384`; `_about/showcase2.md:341`; `_about/showcase2.md:648`.
- **Section locators and provisional destination:**
  - L18 `Enter / Shift+Enter Navigation` → Accessibility: corresponding guide.
  - L64 `Tab-Flow Exclusion for Hotkey-Equipped Buttons` → Accessibility: corresponding guide.
  - L108 `Alt+Enter for Collapsed Sections` → Accessibility: corresponding guide.
  - L160 `Using \`<details>\` as List Items` → Accessibility: corresponding guide.

### `_working_with_forms/the_api_interface.md`

- **Current title / permalink / nav:** The API Interface / `/working_with_forms/the_api_interface` / `6`.
- **Candidate disposition:** Guides: API Interface, label planned unless implemented.
- **Explicit incoming route references found:** `_component_types/type_select.md:33`.
- **Section locators:** no H2–H4 headings; inventory page body/front matter as a single source unit.

### `_working_with_forms/value_coercion.md`

- **Current title / permalink / nav:** Value Coercion / `/working_with_forms/value_coercion` / `4`.
- **Candidate disposition:** Guides: corresponding task guide.
- **Explicit incoming route references found:** `_about/showcase.md:2786`; `_about/showcase2.md:596`; `_about/showcase2.md:659`; `_component_types/type_input.md:81`; `_resources/cheatsheet.md:245`.
- **Section locators and provisional destination:**
  - L19 `Scalar-to-Array List Coercion` → Guides: corresponding task guide.
  - L28 `Scalar-to-Array List Coercion > Exporting Empty Items` → Guides: corresponding task guide.
  - L134 `Number, Date, Time, and JSON Coercion` → Guides: corresponding task guide.
  - L152 `Number, Date, Time, and JSON Coercion > JSON format` → Guides: corresponding task guide.

### `index.md`

- **Current title / permalink / nav:** SmarkForm / `/` / `0`.
- **Candidate disposition:** Home (retain/reorder; `/` remains the home route).
- **Explicit incoming route references found:** `_about/showcase.md:3459`.
- **Section locators and provisional destination:**
  - L250 `Interactive Demo` → Home; retain or reorder this existing destination.
  - L283 `TL;DR` → Home; retain or reorder this existing destination.
  - L309 `Main Features` → Home; retain or reorder this existing destination.
  - L336 `Current Status` → Home; retain or reorder this existing destination.
  - L345 `Where to Go Next?` → Home; retain or reorder this existing destination.
  - L356 `Community and Support` → Home; retain or reorder this existing destination.
  - L367 `Community and Support > 🚀 Stay tuned` → Home; retain or reorder this existing destination.
  - L417 `Contributing` → Home; retain or reorder this existing destination.
  - L425 `License` → Home; retain or reorder this existing destination.

## Non-reader-facing documentation sources to preserve

- `docs/_resources/examples.capture.md` — capture/source data used by the Examples page; inventory its data, but do not treat it as a public chapter.
Standalone download examples are also documentation content. `docs/_data/examples.csv` currently exposes nine Pug sources:

| Source | Published URL / CSV title | Current source title / description | Inventory locator |
|---|---|---|---|
| `src/examples/company.pug` | `/dist/examples/company.html` — Company | Company Example — responsive company form layout | full `block mainForm`, plus shared controller sample |
| `src/examples/todo-list.pug` | `/dist/examples/todo-list.html` — TO-DO List | TODO-List Example — complete task list | full `block mainForm`, plus shared controller sample |
| `src/examples/hiking.pug` | `/dist/examples/hiking.html` — Adventure Tracking | Adventure Tracking Example — excursion planning/tracking form | full `block mainForm`, plus shared controller sample |
| `src/examples/beach.pug` | `/dist/examples/beach.html` — Beach Surveillance | Beach Surveillance Example — seasonal beach services survey | full `block mainForm`, plus shared controller sample |
| `src/examples/event-registration.pug` | `/dist/examples/event-registration.html` — Event Registration | Event Registration / Ticketing — attendees, guests, ticket types, needs | full `block mainForm`, plus shared controller sample |
| `src/examples/expense-report.pug` | `/dist/examples/expense-report.html` — Expense Report | Expense Report / Reimbursement — expense line items and approval | full `block mainForm`, plus shared controller sample |
| `src/examples/medical-intake.pug` | `/dist/examples/medical-intake.html` — Medical Intake | Medical Appointment Intake — history, medications, allergies, reason | full `block mainForm`, plus shared controller sample |
| `src/examples/property-inspection.pug` | `/dist/examples/property-inspection.html` — Property Inspection | Rental Property Inspection Report — room conditions and sign-off | full `block mainForm`, plus shared controller sample |
| `src/examples/restaurant-reservation.pug` | `/dist/examples/restaurant-reservation.html` — Restaurant Reservation | Restaurant Reservation + Preorder — reservation and optional courses | full `block mainForm`, plus shared controller sample |

Each page is composed through `src/examples/include/layout.pug`, which marks the form as `SmarkForm sample`; `sample_controller.pug` marks the shared initialization/controller code. Preserve both rendered download and source, CSV order/title/details, Pug title/description, assets/styles, and controller behavior. Shared `credits.pug`, `autobackground.pug`, `mixins.pug`, `templates.pug`, `urls.pug`, and the example Sass sources are supporting infrastructure. `src/examples/template.pug` is imported by the build but is not listed in the CSV (marked pending); inspect and retain it unless a separate reviewed decision says otherwise. No tracked Playwright test references `src/examples`, `dist/examples`, or `examples.csv`; downloadable-page examples are therefore not covered by the co-located example manifest and require build/preview checks if changed.
- `docs/_includes/**`, `docs/_layouts/**`, `docs/_data/**`, `docs/_sass/**`, `docs/assets/**`, and generated `docs/_site/**` — site infrastructure/assets/output, not bulk legacy-archive candidates. The `docs/_data/package.json` dirty change is explicitly out of scope.
- `docs/README.md`, `CUSTOMIZATION.md`, `testing-notes.md`, `masking_docs_plan.md`, `showcase_analysis.md`, and `docs/presentations/**` — technical/maintainer/presentation sources; keep in appropriate source locations unless Step 02 identifies a separate reason. `showcase_analysis.md` remains a migration record, not a reader-facing page. Repository `README.md` and installable skills are not part of the Jekyll IA move, but check their inbound links if canonical routes change.
- Repository-level specs, this step plan, `AGENTS/Showcase-Restructure-Plan.md`, and `PROMPTS.md` are planning/agent resources, not site pages.

## Cross-cutting audit flags for Step 02+

- Quick Start has 22 H2–H4 locators and 14 sampletabs spanning setup, actions, exchange, traversal/context, events, hotkeys, lists, customization, and boilerplate; see exact source-to-sample mapping in the example ledger.
- Core Concepts mixes the mental model/syntax with action/path details; preserve the distinction between its concise overview and Step 07 canonical guidance.
- Legacy Showcase and candidate `showcase2.md` contain 20 and 4 sampletabs respectively; see `01-showcase-crosswalk.md`.
- Introduction contains Event Planner comparison material (React/Vue/metrics) in addition to motivation; When SmarkForm Fits needs a route and neutral-scope decision.
- `docs/_component_types/type_select.md` has no H2–H4 headings, capture declarations, or sampletabs; inspect its body/front matter before deciding whether it needs additions or only a route move.
- `docs/_working_with_forms/the_api_interface.md` has no headings or sampletabs under this parser; verify whether it is an intentionally planned stub and label honestly.
- `docs/_community/contact.md` is a no-edit exception from the maintainer: preserve content and front matter unchanged. It already resides in the Community collection.
- The post-0.25.0 API uses snake_case option keys, but `docs/_about/showcase2.md` still uses `movingDepth`, `exportEmpties`, and `smark_mixin_allowLocalScripts`. The planning notes `showcase_plan.md`, `showcase_feature_mapping.md`, and `old_showcase_examples_plan.md` also contain pre-0.25 spellings. Treat them as historical content, verify current implementation, and do not copy those spellings into new documentation. Use the migration map in `CHANGELOG.md` while editing the candidate Showcase; historical changelog entries need not be rewritten.
- Initial claim scan finds the Quick Start statement that SmarkForm handles “validation” (`docs/_getting_started/quick_start.md`, around L814), broad “Markup agnostic”/“low-code”/“A11Y friendly” Feature headings, and showcase2 claims about automatic business validation, null empties, scoped mixin CSS, and `movingDepth`. Reconcile these against current implementation, the FAQ's native-constraint explanation, and SPC §3/§6 before deciding wording.
- Agent references, Examples capture data, and technical notes have destinations outside the normal user-guide tree; do not delete them as collateral cleanup.
- Explicit route/fragment scan results and the three unresolved route candidates are recorded in `01-baseline-link-and-fragment-ledger.md`.

## Step 02 decision list

1. Approve collection/page grouping and navigation order from the SPC, including
   the new Start Here, Guides, Accessibility, Component Reference, For End
   Users, and AI & Agents paths.
2. Approve whether/where **When SmarkForm Fits** is created, and its neutral
   comparison scope and treatment of existing React/Vue measurements.
3. Approve canonical routes for the candidate Showcase, compact Quick Start,
   Using SmarkForm, new Accessibility page, and all moved collections.
4. Decide which old public routes keep their permalink, receive redirects/aliases,
   or have another explicit compatibility disposition. `/about/showcase` and
   `/about/showcase2` especially need a deliberate decision.
5. Confirm that the Contact page is the no-edit exception and retains its
   current `/community/contact` route.
6. Resolve any content-ledger entries whose candidate destination is ambiguous
   before Step 03 creates the dual-tree structure.
