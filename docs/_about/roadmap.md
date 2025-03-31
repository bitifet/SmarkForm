---
title: Roadmap
layout: chapter
permalink: /about/roadmap
nav_order: 5

---

# {{ page.title }}

<br />
<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Current Status](#current-status)
* [Upcoming Features](#upcoming-features)
    * [Mixins](#mixins)
    * [The «API interface»](#the-api-interface)
    * [The «select» component type](#the-select-component-type)
    * [Conditional forms](#conditional-forms)
    * [«form» tag enhancenment](#form-tag-enhancenment)
* [Future Features](#future-features)
    * [The UNDO component.](#the-undo-component)
    * [Infinite lists](#infinite-lists)
    * [Recursive lists:](#recursive-lists)
* [Brainstorm](#brainstorm)
    * [Implement «hint» component type](#implement-hint-component-type)
    * [Implement Table Of Contents component](#implement-table-of-contents-component)
    * [Implement download action](#implement-download-action)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## Current Status

  * Actively developed and open to enhancements from contributors.

  * This Reference Manual is quite mature. But API documentation still needs a
    lot of work...

  * **Last Updated:** {{ site.data.computed.lastUpdated }}.


## Upcoming Features


### Mixins

Mixin feature to create new component types based on (but not limited to)
*SmarkForm* template.


### The «API interface»

The *API interface* will allow, for instance, to use the values of other fields
as arguments for an external API request to, say, fill the options of a
`<select>` component.

Consider the following example:

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

The *src* property will make use of the *API interface* to fetch data from a
remote server to load the propper options of the `<select>` component and keep
them up to date.

The *API Interface* will be responsible for fetching the data based on the
specified endpoint, arguments, and other parameters (such as the method), while
also keeping track of changes in every field it depends on (those marked with
initial '@') allowing the comsummer component (a *select* in this case, but there
may be others in the future) to automatically update its options set every time
relevant data changes.

{: .info}
> 👉 One important feature here is the ability to perform the fetching process
> through an interchangeable callback referred to as an 'adapter.'
> 
> By default, this adapter internally executes an HTTP request as explained earlier.
> 
> However, it can be easily substituted with a custom implementation tailored
> to different types of APIs, ranging from GraphQL APIs to mock implementations
> used for testing purposes.

The *src* property will accept two formats:

  1. A simple string with the URL to fetch data from.
  2. An array with the following structure:
     * **src[0]:** Provides the endpoint url.
     * **src[1]:** *(Optional)* Provides arguments to be passed.
     * **src[2]:** *(Optional)* Specifies the HTTP method ('GET' by default).

{: .hint :}
> In the parameters (*src[0]*) of the previous example, property names not
> prepended by an '@' are just literal values to be sent in every request.
> 
> In the case of those prepended by an '@', their value is the path to the
> field which value we want to pass to the API. The "@" character only serves
> to mark which arguments are literals and which are paths referencing other
> fields in the form. They will be stripped from the name of the field before
> sending the request.



Circular references will be automatically handled by preventing fetchings when
the corresponding value doesn't change.

For instance, let's imagine we have two `<select>` fields, one for countries
and the other for cities like in the following example:


```html
<label>Country</label>
<select data-smark='{
    "name":"country",
    "src":[
        "https/example.com/countries",
        { "@city_id":"city" }
    ],
    "encoding":"json"
}'>
    <option value="null">Select a country</option>
</select>
<label>City</label>
<select data-smark='{
    "name":"city",
    "src":[
        "https/example.com/countries",
        { "@country_id":"country" }
    ],
    "encoding":"json"
}'>
    <option value="null">Select a city</option>
</select>
```


{: .info :}
> The `encoding: "json"` property allows the default option's value to be a
> real *null* instead of a string with the word "null" in it.

**Here:**

  * When no option is selected in the country field, all the possible cities
    will be available.
  
  * If the user selects a country, the city options list will be updated to
    show only the cities of that country.

  * If the user selects a city, all but the corresponding country will be
    removed as country options and that country will be automatically selected
    if it already weren't..

  * If there is a country selected and after the user selecting a city, the
    resulting country list does not contain the selected country, an error
    event will be emitted and the change won't be applied (avoiding infinite
    loop).


### The «select» component type

It's almost already explainid in the [previous section](#the-api-interface).

It will be capable of dynamically loading its options from a remote API
depending on other fields values and reacting to their changes.

It will also allow for statically defined options, such as the *default*
"Select a country/city" option.


### Conditional forms

Sometimes is useful to make a field (which can also be a form or a list) to be
enabled or disabled depending on some conditions.

Adding a mechanism to model this disabilitation in the markup would be a game
changer for this specific cases.

The idea is to be able to specify a set of one or more paths to other fields
and an optional callback to transform them so that, whenever any of the pointed
fields changes, the callback is evaluated and, in case of falsy result, the
field will become disabled and vice versa.


### «form» tag enhancenment

By now, the use of the `<form>` tag is not mandatory and, in fact, discouraged
in this documentation (even it's native behaviour is prevented by *SmarkForm*).

That's because, even SmarkForm's best fit is to be handled throug *SmarkForm*'s
*import* and *export* actions, supporting *classic* `<form>` tag would provide
a decent graceful degradation (lists will become single items, subforms just
their fields and, if there is no name repetitions, things could go quite
smoothly).

But, if JavaScript is available, *classic* form layout submission could be an
easy pattern for simple applications that just need the power of *SmarkForm* to
handle complext data.

In such scenario, mocking the native `<form>`'s *enctype*s could fit perfectly
if only we find a way to send nested data through. Which could be eaily
achieved with a simple naming conventions.


## Future Features

### The UNDO component.

  * Contains single component (form, list, input...).
  * Acts as a "man in the middle".
  * Listen to the (future) component's "change" events to capture (export) and
    store changes.
  * Make its own changes' events distinguishable from regular ones (to avoid
    re-caching).
  * Provide additional "undo" and "redo" actions.
  * Etc...


### Infinite lists

Infinite lists (with lazy loading through [the API Interface](/advanced_concepts/the_api_interface)).

  * Properties be automatically mapped as `data-smark-<property_name>`-like
    (and vice-versa) attributes enabling `[data-smark-<property_name>]`-like
    CSS selectors.


  * The "src" property for import action, that will allow to load data from an
    external source every time the action is triggered. Also taking advantadge
    of the API interface, that will allow you to use other fields values as
    arguments for the API request.

  * The «select» component type with dynamic options loading through the API
    interface. The set of options could change depending on the value of other
    fields. In this case, they will be automatically updated every time it's
    needed.

  * Dynamic and reactive options loading for dropdowns (comming soon) through
    [the API Interface](/advanced_concepts/the_api_interface)).

   * The «multiform» component type, able to seamlessly works in tabular or
     accordion layouts, that will allow for multiple subform structures to be
     used in the same form, depending on the nature of the data being edited.



### Recursive lists:

  * recursive = (path) (Must be parent)
  * min_items = 0 (forcibly)
  * max_recursion = (optional) Self item will be removed from template when
    reached.


## Brainstorm


The following are spare and not yet mature ideas for possible future components
(not necessarily and in most cases they won't be core components but just
plugable components in their own repository).


### Implement «hint» component type

  * A component that can be used to display hints in a designed location using
    the "title" attribute of trigger components.
    - 👉 Consider to include all components with a "title" attribute.
  * Will look for all triggers in their context (recursively, but excluding
    subcontexts with their own hint component).
  * Will intercept the "mouseover" event of each of them and display their
    "title" attribute when the mouse passes over any of them.
  * 💡 ...or it may be just a new action for forms...
    - Hmmmm... 🤔


### Implement Table Of Contents component

  * Scan targetted component recursively.
  * Refresh on every change (add or remove items).
  * Show only components with a "toc-section" property.
  * Allow navigating to every secton through their (full path) id's.
  * Implement a "return to TOC" actions.
  * Stop scanning on compoenents containing a self-targetted TOC.


### Implement download action

  * Implement in lib/component.js.
  * Rely on (each type)'s export action.
  * Allow to specify file name (maybe even prompt...)
  * Downloads (exported) json by default
  * ...but allow for transformation filters to generate other kinds of data
    from json input.


**Sample code for download fuctionality:**

```javascript
function download(fileName, payload, ctype = "text/plain", charset="utf-8") {
    var dldAnchor = document.createElement('a');
    dldAnchor.setAttribute('href', `data:${ctype};charset=${charset},${encodeURIComponent(payload)}`);
    dldAnchor.setAttribute('download', fileName);
    dldAnchor.style.display = 'none';
    document.body.appendChild(dldAnchor);
    dldAnchor.click();
    document.body.removeChild(dldAnchor);
}

// Usage example
download(myFile.json, {foo: "bar"});
```
