---
title: "The API Interface (Planned)"
layout: chapter
description: "The API Interface is a proposed SmarkForm capability and is not implemented."
permalink: "/guides/the_api_interface"
nav_order: 10
redirect_from:
  - "/working_with_forms/the_api_interface"
---

{% include links.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary><strong>📖 Table of Contents</strong></summary>

  {% include chaptertoc/the_api_interface.html depth=2 %}

</details>

{: .warning }
> **Status: planned, not implemented.** SmarkForm does not currently provide
> declarative field-to-API bindings, automatic dependent-field fetching, or an
> interchangeable API adapter.

The [Roadmap]({{ "/about/roadmap" | relative_url }}#the-api-interface) records a
possible direction for connecting component values to remote data. It is a
proposal, not a supported API contract or delivery commitment. Do not use an
`src` option or other API Interface syntax in production forms.

## Integrate APIs with current features

Today, application code can fetch data and pass it to SmarkForm with
`import()`. Use an export trigger or event handler to send form values back to a
service. These are application-owned workflows; SmarkForm does not automatically
watch dependencies or refresh fields from an endpoint.

- [Data Import and Export]({{ "/guides/data_import_and_export" | relative_url }})
  covers payload shapes, defaults, and programmatic `import()` / `export()`.
- [Events]({{ "/guides/events" | relative_url }}) covers trigger-driven action
  lifecycle hooks and DOM field events.
