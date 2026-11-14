---
title: "Select (Planned)"
layout: chapter
description: "Status of the proposed remote-options Select API: planned and not implemented; native select elements currently use the input type."
permalink: "/component_reference/select"
nav_order: 11
redirect_from:
  - "/component_types/type_select"
---


{% include links.md %}
# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/type_select.html depth=2 %}

</details>


## Status

{: .warning }
> **Planned, not implemented:** SmarkForm currently treats `<select>` as an
> ordinary `input` field. It does not process a `src` option, fetch option data,
> or update options when another field changes. See
> the [Roadmap]({{ "/about/roadmap" | relative_url }}#the-api-interface).

**Proposal sketch only (not runnable):**

```html
<select data-smark='{
    "src":[
        "https://example.com/some/api",
        {
            "someConstant":"actual_value",
            "@someField":"sibling_field_name",
            "@someOtherField":"/absolute/path/to/field",
            "@anotherField":"../relative/path/to/field"
        },
        "GET"
    ]
}'>
</select>
```

**Where:**

  * **src[0]:** Provides the endpoint url.
    - If it is the only argument provided, *src* can be simplified as just that
      url.
  * **src[1]:** *(Optional)* Provides arguments to be passed.
  * **src[2]:** *(Optional)* Specifies the HTTP method ('GET' by default).

**Proposed API Interface behavior (not implemented):**

If implemented, the *API Interface* proposal would fetch data based on the
specified endpoint, arguments, and other parameters (such as the method), while
also keeping track of changes in every field it depends on (those marked with
an initial `@`) so the consuming component (a *select* here) could update its
options when relevant data changes.

{: .info}
> One proposed feature is an interchangeable callback, called an *adapter*,
> for performing the fetch.
> 
> The default adapter described in the proposal would execute an HTTP request.
> 
> An application could replace it with an implementation for another API style
> or a mock used in tests.
