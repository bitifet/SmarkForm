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

* [👉 Current Status](#-current-status)
* [🕒 Upcoming Features](#-upcoming-features)
* [💡 Brainstorm](#-brainstorm)
    * [Implement Table Of Contents component.](#implement-table-of-contents-component)
    * [Implement download action](#implement-download-action)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## 👉 Current Status

  * Actively developed and open to enhancements from contributors.

  * This Reference Manual is quite mature. But API documentation still needs a
    lot of work...

  * **Last Updated:** {{ site.data.computed.lastUpdated }}.


## 🕒 Upcoming Features

  * Mixin feature to create new component types based on (but not limited to)
    *SmarkForm* template.

  * Dynamic and reactive options loading for dropdowns (comming soon) through
    [the API Interface](/advanced_concepts/the_api_interface)).

  * Infinite lists (with lazy loading through [the API
    Interface](/advanced_concepts/the_api_interface)).

  * Properties be automatically mapped as `data-smark-<property_name>`-like
    (and vice-versa) attributes enabling `[data-smark-<property_name>]`-like
    CSS selectors.

  * The "API interface", that will allow, for instance, to use other fields
    values as arguments an external API request to, say, fill the options of a
    <select> tag.

  * The "src" property for import action, that will allow to load data from an
    external source every time the action is triggered. Also taking advantadge
    of the API interface, that will allow you to use other fields values as
    arguments for the API request.

  * The «select» component type with dynamic options loading through the API
    interface. The set of options could change depending on the value of other
    fields. In this case, they will be automatically updated every time it's
    needed.

   * The «multiform» component type, able to seamlessly works in tabular or
     accordion layouts, that will allow for multiple subform structures to be
     used in the same form, depending on the nature of the data being edited.

   * The UNDO component.
        - Contains single component (form, list, input...).
        - Acts as a "man in the middle".
        - Listen to the (future) component's "change" events to capture
          (export) and store changes.
        - Make its own changes' events distinguishable from regular ones (to
          avoid re-caching).
        - Provide additional "undo" and "redo" actions.
        - Etc...

   * Recursive lists:
     - recursive = (path) (Must be parent)
     - min_items = 0 (forcibly)
     - max_recursion = (optional) Self item will be removed from template when
       reached.


## 💡 Brainstorm


The following are spare and not yet mature ideas for possible future components
(not necessarily and in most cases they won't be core components but just
plugable components in their own repository).


### Implement Table Of Contents component.
  - Scan targetted component recursively.
  - Refresh on every change (add or remove items).
  - Show only components with a "toc-section" property.
  - Allow navigating to every secton through their (full path) id's.
  - Implement a "return to TOC" actions.
  - Stop scanning on compoenents containing a self-targetted TOC.




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
