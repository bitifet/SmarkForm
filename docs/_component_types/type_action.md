---
title: «action» Component Type
layout: default
permalink: /component_types/type_action

---

*action* Component Type
=======================

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
* [Action Components](#action-components)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>



Actions
-------

Every component type may have its own special methods called *actions* to
interact with it.

For example, *list* components are provided with *addItem* and *removeItem*
actions to add or remove items from the list.

Actions can be triggered both programatically or when user interacts with an
*action component* of the given action whose [*context*](#context) is a
component of given type.


### Interactions

Nowadays the only possible interaction for action components is the 'click'
event. But in the future actions are expected to listen to several events (i.e.
right/middle/left click or even keyboard events...) which would be mapped to
specific behaviour variations.

When the user interacts with an *action* component, its [context](#context) is
resolved and the propper action method is called in it.


### Origin

The origin of an action is the actual *action* component from which the action
was originated. For programatically triggered actions its value is *Null*.

This allow action implementations to interact with its originating action
component.

### Context

The context of an action is the component willing to receive the action every
time it is triggered.

That is, by default, the **second** nearest ancestor (because nearest ancestor
is the default [target](#target)) of the action component whose type implements
an action of that name.

In action components the context can be altered by using the *for* property,
consisting a relative (starting from default context) or absolute path to the
desired context.

This is what allows, for example, to place the *addItem* action components of a
list outside of the actual list.

**Example:**
```html
<button data-smark='{"action":"addItem","for":"myList"}'></button>
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

The target of en action is the component to which the action is to be peformed.

By default it is the nearest ancestor of the action component but, as with
*context*, it can be explicitly specified in the *target* property by a
relative or absolute path.

For example, in the *removeItem* action of *list* components, the *target* is
the item of the list that is going to be removed.

**Example:**

```html
<button data-smark='{"action":"addItem","for":"myList"}'></button>
<ul data-smark="{}">
  <li>
    ...
    <button data-smark='{"action":"removeItem"}'>
  </li>
</ul>
```



Action Components
-----------------



