*select* Component Type
=======================

<!-- Table of Contents {{{ -->

<table align="right"><tr><td>
<details open>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

<!-- vim-markdown-toc GitLab -->

* [Introduction](#introduction)

<!-- vim-markdown-toc -->

</details>
</td></tr></table>

<!-- }}} -->


<table align="left">
<tr><th>
🚧  ＷＯＲＫ  ＩＮ  ＰＲＯＧＲＥＳＳ  🚧
</th></tr>
<tr><td align="center">

This component is not yet implemented.

  👍 It will b before SmarkForm 1.0.0 release.

  🔧 Meanwhile, this document tries to explain what it will be capable of and,
     at the same time, serve as a base for its future documentation.

  ⚠️  As always, all information may be incomplete, inaccurate, outdated or even
     **completely wrong**.

👍 We welcome any feedback, suggestions, or improvements as we continue to
enhance and expand the functionality of SmarkForm.

</td></tr>
</table>



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

> 👉 One important feature here is the ability to perform the fetching process
> through an interchangeable callback referred to as an 'adapter.'
> 
> By default, this adapter internally executes an HTTP request as explained earlier.
> 
> However, it can be easily substituted with a custom implementation tailored
> to different types of APIs, ranging from GraphQL APIs to mock implementations
> used for testing purposes.

