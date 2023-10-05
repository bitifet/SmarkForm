---
title: «select» Component Type
layout: chapter
permalink: /component_types/type_select

---

*select* Component Type
=======================

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Introduction](#introduction)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


{: .info}
> 🚧  ＷＯＲＫ  ＩＮ  ＰＲＯＧＲＥＳＳ  🚧




Introduction
------------

Select component will be capable of loading its options from a remote API call
by passing its *src* property to so called "API Interface".

**Example:**

```html
<select data-smark='{
    "src":[
        "https/example.com/some/api",
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

**About API Interface:**

*API Interface* will be responsible for fetching the data based on the
specified endpoint, arguments, and other parameters (such as the method), while
also keeping track of changes in every field it depends on (those marked with
initial '@') allowing the comsummer component (a *select* in this case, but it
may be others in the future) to update its options every time relevant data
changes.

{: .info}
> 👉 One important feature here is the ability to perform the fetching process
> through an interchangeable callback referred to as an 'adapter.'
> 
> By default, this adapter internally executes an HTTP request as explained earlier.
> 
> However, it can be easily substituted with a custom implementation tailored
> to different types of APIs, ranging from GraphQL APIs to mock implementations
> used for testing purposes.

