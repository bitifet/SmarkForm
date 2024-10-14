---
title: TO-DO List
layout: chapter
permalink: /about/TODO
nav_order: 3

---

# {{ page.title }}

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [UX Improvements](#ux-improvements)
    * [👉 Keyboard Shortcuts](#-keyboard-shortcuts)
    * [👉 Auto disabled triggers](#-auto-disabled-triggers)
* [Pending core features](#pending-core-features)
    * [👉 The API interface](#-the-api-interface)
    * [👉 *src* property for import action](#-src-property-for-import-action)
* [Pending core components](#pending-core-components)
    * [👉 The «select» component](#-the-select-component)
    * [👉 The «multiform» component](#-the-multiform-component)
* [Other possible features](#other-possible-features)
    * [💡 Implement Focus subsystem. Let's say:](#-implement-focus-subsystem-lets-say)
    * [💡 Recursive lists](#-recursive-lists)
* [New non-core components](#new-non-core-components)
    * [💡 Implement UNDO component.](#-implement-undo-component)
    * [💡 Implement Table Of Contents component.](#-implement-table-of-contents-component)
* [Spare Ideas](#spare-ideas)
    * [Implement download action](#implement-download-action)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## UX Improvements

### 👉 Keyboard Shortcuts
  - Allow component types to capture keyboard events to trigger actions.
  - I.e. Ctrl+"+" in list item may add new item below (trigger addItem action
    with that item as target).
  - I.e. Ctrl+"-" in list item may remove the item containing it (trigger
    removeItem action with that item as target).


{: .hint}
>   * We will define a new "shorcut" property to specify a standard key name
>     (defined for keydown events).
>   * Ctrl key keydown event will trigger a hint reveal (by default, setting
>     ::before content property), but only for those triggers targetting
>     currently focused field.
>   * ...or its parents as long as they don't conflict with the innermost
>     triggers.
>   * Finally, if the specified key is pressed while holding 'Ctrl' key, the
>     trigger will be fired.


### 👉 Auto disabled triggers

When, for instance, a list reaches the number of items specified as *maxItems*
property, the *addItem* action wont be performed (since the limit is reached).

Now this condition is checked inside the action implementation.

We should instead implement a kind of action "permissions" allowing to tell
whether an action can or cannot be performed beforehand.

After that, non callable actions should be automatically disabled through the
"disabled" html attribute (and vice-versa).

## Pending core features


### 👉 The API interface

Bla bla bla...



### 👉 *src* property for import action

Taking advantadge of the API interface it will not only allow for loading data
from static source:

The API interface will allow to use other fields values as arguments for the
API request to perform everty time the action is triggered.


## Pending core components


### 👉 The «select» component

...

### 👉 The «multiform» component
  - Multiple subform templates (every direct child of its original layout)
    internally stored (likewise lists item template...).
  - Only one "active" (actually inserted in DOM) at the same time
    (interchangeablilityy).
  - import() and export() methods work always over currently selected subform.
  - Each subform must include a <select> (or any other input smart type) tag
    whose name should match some "selector" property in the options object
    passed to mulitform component (data-smark attribute) and whose value
    should decide wich template is actually used (making imports and exports
    consistent thanks to this field).


## Other possible features


### 💡 Implement Focus subsystem. Let's say:

  - AddItem send focus to added Item.
  - This item (type) in turn, may re-send it to inner parts (i.e.: first
    input for forms, etc...)

### 💡 Recursive lists

  - recursive = (path) (Must be parent)
  - min_items = 0 (forcibly)
  - max_recursion = (optional) Self item will be removed from template when
    reached.

## New non-core components

The following are ideas for possible future components (not necessarily and in
most cases they won't be core components but just plugable components in their
own repository.

### 💡 Implement UNDO component.
  - Contains single component (form, list, input...).
  - Acts as a "man in the middle".
  - Listen to the (future) component's "change" events to capture (export)
    and store changes.
  - Make its own changes' events distinguishable from regular ones (to avoid
    re-caching).
  - Provide additional "undo" and "redo" actions.
  - Etc...

### 💡 Implement Table Of Contents component.
  - Scan targetted component recursively.
  - Refresh on every change (add or remove items).
  - Show only components with a "toc-section" property.
  - Allow navigating to every secton through their (full path) id's.
  - Implement a "return to TOC" actions.
  - Stop scanning on compoenents containing a self-targetted TOC.



## Spare Ideas

Spare (not yet mature) random ideas...

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

