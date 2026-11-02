---
title: "Using SmarkForm"
layout: chapter
permalink: "/guides/using_smarkform"
nav_order: 1
description: "A practical developer guide to building and composing SmarkForm forms."
migration_stub: true
sitemap: false
---

{% include links.md %}

# {{ page.title }}

> The complete practical walkthrough is being prepared in Step 08. Until then,
> use the current references below; the original long tutorial remains staged
> for its content transfer.

Start with the [compact Quick Start]({{ "/start_here/quick_start" | relative_url }})
and [Core Concepts]({{ "/start_here/core_concepts" | relative_url }}). For action
workflows, remember the shared model:

- With no `context`, the nearest ancestor implementing the action handles it.
- An explicit `context` path starts at the trigger's enclosing field and must
  resolve to a component that implements the action.
- `target` is separate: its path starts at the effective context; `export` copies
  context → target, while `import` copies target → context.

See the [Trigger reference]({{ "/component_reference/trigger" | relative_url }}),
[Form Traversing]({{ "/guides/form_traversing" | relative_url }}),
[Data Import and Export]({{ "/guides/data_import_and_export" | relative_url }}),
and [Events]({{ "/guides/events" | relative_url }}) for the current details.

The [preserved long Quick Start]({{ "/old/getting_started/quick_start" | relative_url }})
remains available while this guide is prepared.
