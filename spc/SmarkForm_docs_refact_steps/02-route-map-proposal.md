# Step 02 — Proposed Information Architecture and Route Map

**Status: proposal for maintainer approval — not an approved route map. Do not begin Step 03 or change `docs/_config.yml` until the maintainer approves or edits this proposal.**

## Recommendation

Adopt the collection/navigation structure in `spc/SmarkForm_docs_refact.md` §5, while **preserving the current permalink of every existing public page** wherever possible. Jekyll collection membership and front-matter permalinks are independent here: all 57 inventoried public pages currently have explicit permalinks, so changing collections does not require changing URLs. This minimizes external-link breakage and avoids introducing a redirect plugin or a new alias-generation mechanism. Use new, section-shaped routes only for newly created pages.

If the maintainer prefers URLs to mirror new collection names (`/start_here/...`, `/guides/...`, etc.), treat that as an alternative and approve a redirect strategy before implementation. `docs/Gemfile` and `docs/_config.yml` currently have no redirect plugin; do not assume a `redirect_from` feature works without verifying the GitHub Pages build.

## Proposed collection and navigation schema

Root **Home** remains `docs/index.md` at `/`. Proposed reader-facing collection order and titles (from SPC §5):

| Order | Collection key / source directory | Navigation title | Page order (from proposed IA) |
|---:|---|---|---|
| 1 | `showcase_examples` / `_showcase_examples` | Showcase & Examples | Showcase, Downloadable Examples, Playground |
| 2 | `start_here` / `_start_here` | Start Here | Quick Start, Getting SmarkForm, CDN, Download, Core Concepts |
| 3 | `guides` / `_guides` | Guides | Using SmarkForm, Data Import and Export, Form Traversing, Value Coercion, Field Masking, Events, Mixin Types, Singleton Pattern, Animations, API Interface (planned) |
| 4 | `accessibility` / `_accessibility` | Accessibility | Keyboard Navigation, Hotkeys, Accessible Labels and Names |
| 5 | `component_reference` / `_component_reference` | Component Reference | Overview, Form, List, Input, Number, Date, Time, DateTime-Local, Color, Radio, Select, File, Image, Video, Audio, Trigger, Label, Developer Cheatsheet |
| 6 | `advanced_topics` / `_advanced_topics` | Advanced Concepts | The SmarkForm Constructor, Security Considerations, Error Codes |
| 7 | `about` / `_about` | About SmarkForm | Introduction, When SmarkForm Fits, Features, Manifesto, FAQ, Roadmap |
| 8 | `for_end_users` / `_for_end_users` | For End Users | User Guide |
| 9 | `ai_agents` / `_ai_agents` | AI & Agents | AI & Agent Resources, SmarkForm Forms, SmarkForm Usage |
| 10 | `community` / `_community` | Community | Branding, Build in Public, Contact, Contributing, License, Support |

Page sequence above should be encoded with collection/page `nav_order` in Step 03; Contact’s existing file/front matter is a no-edit exception, even if nav ordering is handled around it. Technical docs, presentations, assets, includes, layouts, and capture-only files remain outside ordinary reader navigation.

## Existing public-page route map — recommended stable-URL policy

“Proposed canonical” is the path after the page is placed in its new collection. Existing routes stay unchanged except the legacy Showcase source, which becomes staging-only, and the candidate `showcase2.md`, which supplies the final Showcase at the legacy public Showcase URL. New routes are listed separately below.

| Current source | New navigation destination | Current permalink | Proposed canonical / staging path | Notes |
|---|---|---|---|
| `_about/faq.md` | About SmarkForm | `/about/faq` | `/about/faq` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_about/features.md` | About SmarkForm | `/about/features` | `/about/features` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_about/introduction.md` | About SmarkForm | `/about/introduction` | `/about/introduction` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_about/manifesto.md` | About SmarkForm | `/about/manifesto` | `/about/manifesto` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_about/roadmap.md` | About SmarkForm | `/about/roadmap` | `/about/roadmap` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_about/showcase.md` | Legacy staging only | `/about/showcase` | `/old/about/showcase (temporary legacy copy only)` | Move complete source to staging namespace; no longer owns public canonical URL. |
| `_about/showcase2.md` | Showcase & Examples | `/about/showcase2` | `/about/showcase (candidate final Showcase replaces the old page at this stable URL)` | Use as candidate final Showcase only after Step 16 audit; retire `/about/showcase2` branch-only route unless maintainer knows it was externally shared. |
| `_advanced_concepts/animations.md` | Guides | `/advanced_concepts/animations` | `/advanced_concepts/animations` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_advanced_concepts/error_codes.md` | Advanced Concepts | `/advanced_concepts/error_codes` | `/advanced_concepts/error_codes` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_advanced_concepts/events.md` | Guides | `/advanced_concepts/events` | `/advanced_concepts/events` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_advanced_concepts/mixin_types.md` | Guides | `/advanced_concepts/mixin_types` | `/advanced_concepts/mixin_types` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_advanced_concepts/security_considerations.md` | Advanced Concepts | `/advanced_concepts/security_considerations` | `/advanced_concepts/security_considerations` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_advanced_concepts/the_singleton_pattern.md` | Guides | `/advanced_concepts/the_singleton_pattern` | `/advanced_concepts/the_singleton_pattern` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_advanced_concepts/the_smarkform_constructor.md` | Advanced Concepts | `/advanced_concepts/the_smarkform_constructor` | `/advanced_concepts/the_smarkform_constructor` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_community/branding.md` | Community | `/community/branding` | `/community/branding` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_community/build-in-public.md` | Community | `/community/build-in-public` | `/community/build-in-public` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_community/contact.md` | Community | `/community/contact` | `/community/contact` | No edits, no front-matter changes, no route change (explicit maintainer constraint). |
| `_community/contributing.md` | Community | `/community/contributing` | `/community/contributing` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_community/license.md` | Community | `/community/license` | `/community/license` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_community/support.md` | Community | `/community/support` | `/community/support` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_component_types/type_audio.md` | Component Reference | `/component_types/type_audio` | `/component_types/type_audio` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_component_types/type_color.md` | Component Reference | `/component_types/type_color` | `/component_types/type_color` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_component_types/type_date.md` | Component Reference | `/component_types/type_date` | `/component_types/type_date` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_component_types/type_datetime-local.md` | Component Reference | `/component_types/type_datetime-local` | `/component_types/type_datetime-local` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_component_types/type_file.md` | Component Reference | `/component_types/type_file` | `/component_types/type_file` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_component_types/type_form.md` | Component Reference | `/component_types/type_form` | `/component_types/type_form` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_component_types/type_image.md` | Component Reference | `/component_types/type_image` | `/component_types/type_image` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_component_types/type_input.md` | Component Reference | `/component_types/type_input` | `/component_types/type_input` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_component_types/type_label.md` | Component Reference | `/component_types/type_label` | `/component_types/type_label` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_component_types/type_list.md` | Component Reference | `/component_types/type_list` | `/component_types/type_list` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_component_types/type_number.md` | Component Reference | `/component_types/type_number` | `/component_types/type_number` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_component_types/type_radio.md` | Component Reference | `/component_types/type_radio` | `/component_types/type_radio` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_component_types/type_select.md` | Component Reference | `/component_types/type_select` | `/component_types/type_select` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_component_types/type_time.md` | Component Reference | `/component_types/type_time` | `/component_types/type_time` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_component_types/type_trigger.md` | Component Reference | `/component_types/type_trigger` | `/component_types/type_trigger` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_component_types/type_video.md` | Component Reference | `/component_types/type_video` | `/component_types/type_video` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_getting_started/core_component_types.md` | Component Reference | `/getting_started/core_component_types` | `/getting_started/core_component_types` | Keep current public permalink even when nav collection changes. |
| `_getting_started/core_concepts.md` | Start Here | `/getting_started/core_concepts` | `/getting_started/core_concepts` | Keep current public permalink even when nav collection changes. |
| `_getting_started/getting_smarkform.md` | Start Here | `/getting_started/getting_smarkform` | `/getting_started/getting_smarkform` | Keep current public permalink even when nav collection changes. |
| `_getting_started/quick_start.md` | Start Here | `/getting_started/quick_start` | `/getting_started/quick_start` | Keep current public permalink even when nav collection changes. |
| `_resources/AGENTS/SmarkForm-Forms.md` | AI & Agents | `/resources/AGENTS/SmarkForm-Forms` | `/resources/AGENTS/SmarkForm-Forms` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_resources/AGENTS/SmarkForm-Usage.md` | AI & Agents | `/resources/AGENTS/SmarkForm-Usage` | `/resources/AGENTS/SmarkForm-Usage` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_resources/CDN.md` | Start Here | `/resources/CDN` | `/resources/CDN` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_resources/ai-agents.md` | AI & Agents | `/resources/ai-agents` | `/resources/ai-agents` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_resources/cheatsheet.md` | Component Reference | `/resources/cheatsheet` | `/resources/cheatsheet` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_resources/download.md` | Start Here | `/resources/download` | `/resources/download` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_resources/examples.md` | Showcase & Examples | `/resources/examples` | `/resources/examples` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_resources/playground.md` | Showcase & Examples | `/resources/playground` | `/resources/playground` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_resources/user_guide.md` | For End Users | `/resources/user_guide` | `/resources/user_guide` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_working_with_forms/data_import_and_export.md` | Guides | `/working_with_forms/data_import_and_export` | `/working_with_forms/data_import_and_export` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_working_with_forms/field_masking.md` | Guides | `/working_with_forms/field_masking` | `/working_with_forms/field_masking` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_working_with_forms/form_traversing.md` | Guides | `/working_with_forms/form_traversing` | `/working_with_forms/form_traversing` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_working_with_forms/hotkeys.md` | Accessibility | `/working_with_forms/hotkeys` | `/working_with_forms/hotkeys` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_working_with_forms/keyboard_navigation.md` | Accessibility | `/working_with_forms/keyboard_navigation` | `/working_with_forms/keyboard_navigation` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_working_with_forms/the_api_interface.md` | Guides | `/working_with_forms/the_api_interface` | `/working_with_forms/the_api_interface` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `_working_with_forms/value_coercion.md` | Guides | `/working_with_forms/value_coercion` | `/working_with_forms/value_coercion` | Keep current public permalink; collection/nav changes do not require link redirects. |
| `index.md` | Home (root page, outside collections) | `/` | `/` | Keep root route. |

## New-page routes proposed

| New page | Collection | Proposed permalink | Decision rationale |
|---|---|---|---|
| Using SmarkForm | Guides | `/guides/using_smarkform` | New developer walkthrough; links from compact Quick Start. |
| When SmarkForm Fits | About SmarkForm | `/about/when_smarkform_fits` | New neutral approach-comparison page; SPC asks maintainers to confirm About placement. |
| Accessible Labels and Names | Accessibility | `/accessibility/accessible_labels_and_names` | New synthesis; detailed Label type API remains in Component Reference. |

Keep the existing basename style for moved pages’ public routes (for example, `type_form` and `datetime-local`) unless the maintainer explicitly wants slug cleanup. Page titles/nav labels can be clean without renaming stable URLs. The final sitemap must contain only canonical pages and any intentionally retained public route.

## Temporary legacy staging routes

- Use an isolated `/old/<original-path>` namespace for `old_` copies during branch-only comparison (for example, legacy Showcase `/old/about/showcase`, legacy home `/old/`). Give every temporary page a unique explicit permalink; never rely on a filename change alone.
- Temporary sources are noindex/sitemap-excluded if the preview could be public. Keep the staging namespace out of final navigation and remove every staging page/config/marker before publication.
- The old long Showcase source stages at `/old/about/showcase`; the candidate final Showcase uses `/about/showcase`. The current candidate source `/about/showcase2` is branch-only, not known to be a previously deployed public page; ask if the maintainer shared that URL before deciding whether an alias is needed.
- Existing non-Showcase page routes remain canonical; their temporary copies must use `/old/...`, preventing collisions.

## Existing incoming-link and broken-route evidence

- `01-baseline-link-and-fragment-ledger.md` records 316 unique explicit page-route references, 112 with fragments, and 91 local fragment references across the 57 public pages. The links must be rebuilt/checked after final structure and again after staging cleanup.
- Three explicit route candidates currently have no matching page permalink: `/about/changelog` from `_about/faq.md:1177`, and `/advanced_concepts/data_import_and_export#setting-defaults-via-value` from `type_form.md:249` and `type_list.md:341`. Likely destinations are GitHub Releases and current `/working_with_forms/data_import_and_export#setting-defaults-via-value`; verify fragment before correcting in the owning content step.
- Presentation `.html` routes and `/dist/...` downloads are output/asset routes, not missing collection pages; validate them after build.
- Existing route preservation is recommended partly because there is no redirect plugin configured. If routes change, explicitly choose and test a redirect/alias approach before the staging migration.

## Maintainer approval required before Step 03

Please confirm or amend these choices:

1. Approve the ten collection names/titles and proposed reading order from SPC §5.
2. Approve **When SmarkForm Fits** under About SmarkForm and its proposed new permalink.
3. Approve preserving all existing public permalinks while changing collections/navigation, with the Showcase replacement and staging behavior above. Alternatively, choose clean collection-based URLs and require a redirect design.
4. Confirm `/about/showcase` remains the final Showcase URL and `/about/showcase2` was not a public route that needs an alias.
5. Confirm the three new-page permalinks, or provide preferred routes.
6. Confirm `docs/_community/contact.md` stays entirely unchanged and remains at `/community/contact`.

**Gate:** Step 02 is not complete until the maintainer records decisions. Do not create collection scaffolding, rename/move docs pages, or edit the route/front-matter map before this approval.
