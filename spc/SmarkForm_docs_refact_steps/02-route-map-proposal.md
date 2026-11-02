# Step 02 — Proposed Information Architecture and Clean Route Map

**Status:** the maintainer selected clean collection-based URLs. This file maps those URLs, but exact collection/grouping details, new slugs, and the redirect mechanism remain pending approval. Do not start Step 03 until the remaining gate is cleared.

## Collection and navigation schema

Follow SPC §5. Home remains the root. Proposed collection keys/directories, titles, and page order:

| Order | Collection key / directory | Navigation title | Proposed page order |
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

Page sequence should be encoded with collection/page `nav_order` in Step 03. Contact remains unchanged, including its front matter. Technical docs, presentations, assets, includes, layouts, and capture-only sources remain outside ordinary reader navigation.

## Canonical route map (proposed)

Use lowercase section/page slugs, preserve meaningful basenames, strip `type_` from component type routes, and use clear slugs for the overview and new pages. Routes are extensionless and have no trailing slash, consistent with the current explicit permalink style.

| Current source | Destination | Current route | Clean canonical route | Legacy alias/redirect source | Notes |
|---|---|---|---|---|---|
| `_about/faq.md` | About SmarkForm | `/about/faq` | `/about/faq` | — (unchanged route) | Remains in About; update content/links only as approved. |
| `_about/features.md` | About SmarkForm | `/about/features` | `/about/features` | — (unchanged route) | Remains in About; update content/links only as approved. |
| `_about/introduction.md` | About SmarkForm | `/about/introduction` | `/about/introduction` | — (unchanged route) | Remains in About; update content/links only as approved. |
| `_about/manifesto.md` | About SmarkForm | `/about/manifesto` | `/about/manifesto` | — (unchanged route) | Remains in About; update content/links only as approved. |
| `_about/roadmap.md` | About SmarkForm | `/about/roadmap` | `/about/roadmap` | — (unchanged route) | Remains in About; update content/links only as approved. |
| `_about/showcase.md` | Legacy staging only | `/about/showcase` | `/old/about/showcase` | `/about/showcase` → `/showcase_examples/showcase` | Full source moves to staging; old public route redirects to the candidate final Showcase. |
| `_about/showcase2.md` | Showcase & Examples | `/about/showcase2` | `/showcase_examples/showcase` | `/about/showcase2` (optional alias; confirm whether branch-only URL was shared externally) | Candidate final Showcase replaces legacy content at `/showcase_examples/showcase`; audit in Step 16. |
| `_advanced_concepts/animations.md` | Guides | `/advanced_concepts/animations` | `/guides/animations` | `/advanced_concepts/animations` | Move to the new collection and redirect the old public permalink. |
| `_advanced_concepts/error_codes.md` | Advanced Concepts | `/advanced_concepts/error_codes` | `/advanced_topics/error_codes` | `/advanced_concepts/error_codes` | Move to the new collection and redirect the old public permalink. |
| `_advanced_concepts/events.md` | Guides | `/advanced_concepts/events` | `/guides/events` | `/advanced_concepts/events` | Move to the new collection and redirect the old public permalink. |
| `_advanced_concepts/mixin_types.md` | Guides | `/advanced_concepts/mixin_types` | `/guides/mixin_types` | `/advanced_concepts/mixin_types` | Move to the new collection and redirect the old public permalink. |
| `_advanced_concepts/security_considerations.md` | Advanced Concepts | `/advanced_concepts/security_considerations` | `/advanced_topics/security_considerations` | `/advanced_concepts/security_considerations` | Move to the new collection and redirect the old public permalink. |
| `_advanced_concepts/the_singleton_pattern.md` | Guides | `/advanced_concepts/the_singleton_pattern` | `/guides/the_singleton_pattern` | `/advanced_concepts/the_singleton_pattern` | Move to the new collection and redirect the old public permalink. |
| `_advanced_concepts/the_smarkform_constructor.md` | Advanced Concepts | `/advanced_concepts/the_smarkform_constructor` | `/advanced_topics/the_smarkform_constructor` | `/advanced_concepts/the_smarkform_constructor` | Move to the new collection and redirect the old public permalink. |
| `_community/branding.md` | Community | `/community/branding` | `/community/branding` | — (unchanged route) | Community collection remains; no route redirect needed. |
| `_community/build-in-public.md` | Community | `/community/build-in-public` | `/community/build-in-public` | — (unchanged route) | Community collection remains; no route redirect needed. |
| `_community/contact.md` | Community | `/community/contact` | `/community/contact` | — (unchanged route) | No edits, no front-matter changes, no route change (explicit maintainer constraint). |
| `_community/contributing.md` | Community | `/community/contributing` | `/community/contributing` | — (unchanged route) | Community collection remains; no route redirect needed. |
| `_community/license.md` | Community | `/community/license` | `/community/license` | — (unchanged route) | Community collection remains; no route redirect needed. |
| `_community/support.md` | Community | `/community/support` | `/community/support` | — (unchanged route) | Community collection remains; no route redirect needed. |
| `_component_types/type_audio.md` | Component Reference | `/component_types/type_audio` | `/component_reference/audio` | `/component_types/type_audio` | Strip `type_` prefix in canonical URL. |
| `_component_types/type_color.md` | Component Reference | `/component_types/type_color` | `/component_reference/color` | `/component_types/type_color` | Strip `type_` prefix in canonical URL. |
| `_component_types/type_date.md` | Component Reference | `/component_types/type_date` | `/component_reference/date` | `/component_types/type_date` | Strip `type_` prefix in canonical URL. |
| `_component_types/type_datetime-local.md` | Component Reference | `/component_types/type_datetime-local` | `/component_reference/datetime-local` | `/component_types/type_datetime-local` | Strip `type_` prefix in canonical URL. |
| `_component_types/type_file.md` | Component Reference | `/component_types/type_file` | `/component_reference/file` | `/component_types/type_file` | Strip `type_` prefix in canonical URL. |
| `_component_types/type_form.md` | Component Reference | `/component_types/type_form` | `/component_reference/form` | `/component_types/type_form` | Strip `type_` prefix in canonical URL. |
| `_component_types/type_image.md` | Component Reference | `/component_types/type_image` | `/component_reference/image` | `/component_types/type_image` | Strip `type_` prefix in canonical URL. |
| `_component_types/type_input.md` | Component Reference | `/component_types/type_input` | `/component_reference/input` | `/component_types/type_input` | Strip `type_` prefix in canonical URL. |
| `_component_types/type_label.md` | Component Reference | `/component_types/type_label` | `/component_reference/label` | `/component_types/type_label` | Strip `type_` prefix in canonical URL. |
| `_component_types/type_list.md` | Component Reference | `/component_types/type_list` | `/component_reference/list` | `/component_types/type_list` | Strip `type_` prefix in canonical URL. |
| `_component_types/type_number.md` | Component Reference | `/component_types/type_number` | `/component_reference/number` | `/component_types/type_number` | Strip `type_` prefix in canonical URL. |
| `_component_types/type_radio.md` | Component Reference | `/component_types/type_radio` | `/component_reference/radio` | `/component_types/type_radio` | Strip `type_` prefix in canonical URL. |
| `_component_types/type_select.md` | Component Reference | `/component_types/type_select` | `/component_reference/select` | `/component_types/type_select` | Strip `type_` prefix in canonical URL. |
| `_component_types/type_time.md` | Component Reference | `/component_types/type_time` | `/component_reference/time` | `/component_types/type_time` | Strip `type_` prefix in canonical URL. |
| `_component_types/type_trigger.md` | Component Reference | `/component_types/type_trigger` | `/component_reference/trigger` | `/component_types/type_trigger` | Strip `type_` prefix in canonical URL. |
| `_component_types/type_video.md` | Component Reference | `/component_types/type_video` | `/component_reference/video` | `/component_types/type_video` | Strip `type_` prefix in canonical URL. |
| `_getting_started/core_component_types.md` | Component Reference | `/getting_started/core_component_types` | `/component_reference/overview` | `/getting_started/core_component_types` | Rename as Component Types Overview in new collection. |
| `_getting_started/core_concepts.md` | Start Here | `/getting_started/core_concepts` | `/start_here/core_concepts` | `/getting_started/core_concepts` | Move to the new collection and redirect the old public permalink. |
| `_getting_started/getting_smarkform.md` | Start Here | `/getting_started/getting_smarkform` | `/start_here/getting_smarkform` | `/getting_started/getting_smarkform` | Move to the new collection and redirect the old public permalink. |
| `_getting_started/quick_start.md` | Start Here | `/getting_started/quick_start` | `/start_here/quick_start` | `/getting_started/quick_start` | Move to the new collection and redirect the old public permalink. |
| `_resources/AGENTS/SmarkForm-Forms.md` | AI & Agents | `/resources/AGENTS/SmarkForm-Forms` | `/ai_agents/smarkform_forms` | `/resources/AGENTS/SmarkForm-Forms` | Move to the new collection and redirect the old public permalink. |
| `_resources/AGENTS/SmarkForm-Usage.md` | AI & Agents | `/resources/AGENTS/SmarkForm-Usage` | `/ai_agents/smarkform_usage` | `/resources/AGENTS/SmarkForm-Usage` | Move to the new collection and redirect the old public permalink. |
| `_resources/CDN.md` | Start Here | `/resources/CDN` | `/start_here/cdn` | `/resources/CDN` | Move to the new collection and redirect the old public permalink. |
| `_resources/ai-agents.md` | AI & Agents | `/resources/ai-agents` | `/ai_agents/resources` | `/resources/ai-agents` | Move to the new collection and redirect the old public permalink. |
| `_resources/cheatsheet.md` | Component Reference | `/resources/cheatsheet` | `/component_reference/cheatsheet` | `/resources/cheatsheet` | Move to the new collection and redirect the old public permalink. |
| `_resources/download.md` | Start Here | `/resources/download` | `/start_here/download` | `/resources/download` | Move to the new collection and redirect the old public permalink. |
| `_resources/examples.md` | Showcase & Examples | `/resources/examples` | `/showcase_examples/examples` | `/resources/examples` | Move to the new collection and redirect the old public permalink. |
| `_resources/playground.md` | Showcase & Examples | `/resources/playground` | `/showcase_examples/playground` | `/resources/playground` | Move to the new collection and redirect the old public permalink. |
| `_resources/user_guide.md` | For End Users | `/resources/user_guide` | `/for_end_users/user_guide` | `/resources/user_guide` | Move to the new collection and redirect the old public permalink. |
| `_working_with_forms/data_import_and_export.md` | Guides | `/working_with_forms/data_import_and_export` | `/guides/data_import_and_export` | `/working_with_forms/data_import_and_export` | Move to the new collection and redirect the old public permalink. |
| `_working_with_forms/field_masking.md` | Guides | `/working_with_forms/field_masking` | `/guides/field_masking` | `/working_with_forms/field_masking` | Move to the new collection and redirect the old public permalink. |
| `_working_with_forms/form_traversing.md` | Guides | `/working_with_forms/form_traversing` | `/guides/form_traversing` | `/working_with_forms/form_traversing` | Move to the new collection and redirect the old public permalink. |
| `_working_with_forms/hotkeys.md` | Accessibility | `/working_with_forms/hotkeys` | `/accessibility/hotkeys` | `/working_with_forms/hotkeys` | Move to the new collection and redirect the old public permalink. |
| `_working_with_forms/keyboard_navigation.md` | Accessibility | `/working_with_forms/keyboard_navigation` | `/accessibility/keyboard_navigation` | `/working_with_forms/keyboard_navigation` | Move to the new collection and redirect the old public permalink. |
| `_working_with_forms/the_api_interface.md` | Guides | `/working_with_forms/the_api_interface` | `/guides/the_api_interface` | `/working_with_forms/the_api_interface` | Move to the new collection and redirect the old public permalink. |
| `_working_with_forms/value_coercion.md` | Guides | `/working_with_forms/value_coercion` | `/guides/value_coercion` | `/working_with_forms/value_coercion` | Move to the new collection and redirect the old public permalink. |
| `index.md` | Home | `/` | `/` | — (unchanged route) | Keep as the root page; create a separate legacy copy only for review if required. |

## New-page routes

| New page | Collection | Proposed route |
|---|---|---|
| Using SmarkForm | Guides | `/guides/using_smarkform` |
| When SmarkForm Fits | About SmarkForm | `/about/when_smarkform_fits` |
| Accessible Labels and Names | Accessibility | `/accessibility/accessible_labels_and_names` |

## Redirect and staging strategy

- Add `jekyll-redirect-from` to `docs/Gemfile` and the Jekyll plugin list in `docs/_config.yml`, then verify it with the local build and the custom GitHub Actions Pages build. Neither the Gemfile nor config currently includes it. Use `redirect_from` on canonical pages for old permalink(s); do not assume redirects work until a build confirms each old route and confirms aliases are not emitted as canonical sitemap entries.
- Redirect moved public routes in the table. Pages staying in About, Community, and `/` retain their routes. The legacy long Showcase's public `/about/showcase` redirects to `/showcase_examples/showcase`; the full source is staging-only at `/old/about/showcase`.
- Optionally redirect `/about/showcase2` to the final Showcase only if the maintainer confirms it was externally shared; it was added on this unmerged refactor branch and is not known to have been deployed.
- Stage migrated old content at `/old/<old-route>` with unique explicit permalinks, `noindex`, and sitemap exclusion. It must not occupy routes needed for redirects, and no staging route may ship. Pages whose collection and content remain unchanged can be shared rather than duplicated; specifically, do not rename, copy-edit, or otherwise change `docs/_community/contact.md`.
- Update internal links to canonical routes; redirects protect external bookmarks only. Keep `docs/_community/contact.md` exactly as-is and do not add an alias for it.

## Broken existing links found in Step 01

- `_about/faq.md:1177` points to `/about/changelog`, which has no current page/permalink. Proposed replacement: GitHub Releases, unless the maintainer wants a new changelog page.
- `_component_types/type_form.md:249` and `type_list.md:341` point to `/advanced_concepts/data_import_and_export#setting-defaults-via-value`; proposed target is `/guides/data_import_and_export#setting-defaults-via-value`. Confirm the fragment against the target heading before correcting the source links.
- `01-baseline-link-and-fragment-ledger.md` contains the explicit route/fragment inventory. Validate routes from the rendered site after migration, not from source names alone.

## Remaining approval gate

The URL policy is selected, but confirm or amend these details before implementation:

1. Approve the SPC collection names/titles, grouping, and nav sequence above.
2. Approve **When SmarkForm Fits** under About and its proposed route.
3. Approve the exact clean slugs, especially `overview`, stripping `type_`, `ai_agents/resources`, and the three new-page routes.
4. Approve `jekyll-redirect-from` as the redirect mechanism, or choose another tested solution.
5. Confirm `/about/showcase2` is not a public route that needs a redirect.
6. Confirm Contact remains entirely unchanged at `/community/contact`.

**Do not start Step 03 until these decisions are recorded.**
