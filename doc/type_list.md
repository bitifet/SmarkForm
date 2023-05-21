*list* Component Type
=====================


Índex
-----


<!-- vim-markdown-toc GitLab -->

* [Options](#options)
    * [min_items](#min_items)
    * [max_items](#max_items)
    * [of](#of)
* [Actions](#actions)
    * [(Async) addItem (Action)](#async-additem-action)
        * [properties (addItem)](#properties-additem)
    * [(Async) removeItem (Action)](#async-removeitem-action)
        * [properties (removeItem)](#properties-removeitem)
    * [(Async) empty (Action)](#async-empty-action)
        * [properties (empty)](#properties-empty)
    * [count (Action)](#count-action)
        * [properties (count)](#properties-count)
* [Events](#events)
    * [addItem (list Event)](#additem-list-event)
    * [removeItem (list Event)](#removeitem-list-event)

<!-- vim-markdown-toc -->



Options
-------

### min_items

### max_items

### of

Actions
-------

### (Async) addItem (Action)

#### properties (addItem)

  * **action:** (= "addItem")
  * **origin:**
  * **context:**
  * **target:**
  * **position:** = "after" (default) / "before"
  * **autoscroll:**,   = "elegant" / "self" / "parent" / *falsy*

### (Async) removeItem (Action)



#### properties (removeItem)

  * **action:**: (= "removeItem")
  * **origin:**
  * **context:**
  * **target:**
  * **position:** = "after" (default) / "before"
  * **autoscroll:**,   = "elegant" / "self" / "parent" / *falsy*
  * **keep_non_empty:**
  * **failback:**


### (Async) empty (Action)

#### properties (empty)

  * **action:**: (= "empty")

### count (Action)

#### properties (count)

  * **action:**: (= "count")


Events
------

### addItem (list Event)


### removeItem (list Event)

