---
title: «trigger» Component Type
layout: chapter
permalink: /component_types/type_trigger
nav_order: 10000

---

# {{ page.title }}

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Actions](#actions)
    * [Interactions](#interactions)
    * [Origin](#origin)
    * [Context](#context)
    * [Target](#target)
* [Trigger Components](#trigger-components)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>



Actions
-------

Every component type may have its own special methods called *actions* to
interact with it.

For example, *list* components are provided with *addItem* and *removeItem*
actions to add or remove items from the list.

Actions can be triggered both programatically or when user interacts with a
*trigger component* of the given action whose [*context*](#context) is a
component of given type.


### Interactions

Nowadays the only possible interaction for trigger components is the 'click'
event. But in the future actions are expected to listen to several events (i.e.
right/middle/left click or even keyboard events...) which would be mapped to
specific behaviour variations.

When the user interacts with an *action* component, its [context](#context) is
resolved and the propper action method is called in it.


### Origin

The origin of an action is the actual *trigger* component from which the action
was originated. For programatically triggered actions its value is *Null*.

This allow action implementations to interact with its originating trigger
component.

### Context

The context of an action is the component willing to receive the action every
time it is triggered.

That is, by default, the **second** nearest ancestor (because nearest ancestor
is the default [target](#target)) of the trigger component whose type implements
an action of that name.

In trigger components the context can be altered by using the *context* property,
consisting a relative (starting from default context) or absolute path to the
desired context.

This is what allows, for example, to place the *addItem* trigger components of a
list outside of the actual list.

**Example:**
```html
<button data-smark='{"action":"addItem","context":"myList"}'></button>
<ul data-smark="{}">
  <li>...</li>
</ul>
```

For convenience context is passed to the action handler by a property of that
name even it is always the class of its component type.

For programatically triggered actions, context is (as expected) always the
component to from wihch we call the action.

**Example:**
```javascript
myForm.find("/myList").removeItem();
```

### Target

The target of an action is the component to which the action is to be peformed.

By default it is the nearest ancestor of the trigger component but, as with
*context*, it can be explicitly specified in the *target* property by a
relative or absolute path.

For example, in the *removeItem* action of *list* components, the *target* is
the item of the list that is going to be removed.

**Example:**

```html
<button data-smark='{"action":"addItem","context":"myList"}'></button>
<ul data-smark="{}">
  <li>
    ...
    <button data-smark='{"action":"removeItem"}'>
  </li>
</ul>
```



Trigger Components
------------------



