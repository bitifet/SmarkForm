*list* Component Type
=====================




Introduction
------------

### List Component

<!-- vim-markdown-toc GitLab -->

    * [Usage](#usage)
* [API Reference](#api-reference)
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
The List component in SmarkForm allows you to dynamically manage a list of
items within your form. It uses the content of the container element as the
template for each item in the list.


### Usage

To use the List component, follow these steps:

1. Create a form containing the list:

   ```html
   <div id="myForm">
     <ul data-smark="{name: 'myList' type: 'list'}">
       <li>
         <!-- Content of this list item will be used as a template for each item -->
       </li>
     </ul>
     <p>
       <button data-smark="{"action":"empty"}">❌ Clear</button>
       <button data-smark="{"action":"export"}">💾 Submit</button>
     </p>
   </div>
   ```

  > 📌 We could have ommitted the *type* property because it will be
  > automatically infered by the ``<ul>`` type, but it is recommended to
  > explicitly specify types to avoid potential errors in case of markup
  > modifications.

2. Initialize the SmarkForm instance:

   ```javascript
   const myForm = new SmarkForm(document.getElementById("myForm"));
   ```

   📌 This is just a simple example. For detailed explanation of how to build a
      full-featured SmarkForm see [Creating a simple SmarkForm
      form](./index.md#creating-a-simple-smarkform-form) section of this manual.


3. Add a template for the list items:

   ```html
   <div id="myForm">
     <ul data-smark="{name: 'myList' type: 'list'}">
       <li>
         <input type="text" name="field1" data-smark />
         <input type="number" name="field2" data-smark />
       </li>
     </ul>
   </div>
   ```

   > 📌 List item templates are automatically enhanced as components of type
   > *form* by default. You can override this by specifying the "data-smark"
   > attribute explicitly or using the "of" property in the list *data-smark*
   > attribute.


4. Add controls to add and remove items:

   ```html
   <div id="myForm">
     <ul data-smark="{name: 'myList' type: 'list'}">
       <li>
         <input type="text" name="field1" data-smark />
         <input type="number" name="field2" data-smark />
         <button data-smark="{action='removeItem'}">Remove Item</button>
       </li>
     </ul>
     <button data-smark="{action='addItem', for='myForm'}">Remove Item</button>
   </div>
   ```

   > 📌 The *removeItem* action here takes its containing component (the
   > implicitly created form over ``<li>`` template)) as its target (an its
   > containing list as its context). On the other hand, the *addItem* action,
   > being outside of the list, uses the *for* property to specify the
   > (relative) path to its context. In this case, being target unspecified,
   > new items will be appended at the end of the list.


For more information on using the List component and its available methods,
please refer to the [API Reference](#api-reference).

Feel free to adjust the content and structure of the section to match the
specific functionality and usage of the List component in your SmarkForm
library.



API Reference
-------------

### Options

#### min_items

#### max_items

#### of

### Actions

#### (Async) addItem (Action)

##### properties (addItem)

  * **action:** (= "addItem")
  * **origin:**
  * **context:**
  * **target:**
  * **position:** = "after" (default) / "before"
  * **autoscroll:**,   = "elegant" / "self" / "parent" / *falsy*

#### (Async) removeItem (Action)



##### properties (removeItem)

  * **action:**: (= "removeItem")
  * **origin:**
  * **context:**
  * **target:**
  * **autoscroll:**,   = "elegant" / "self" / "parent" / *falsy*
  * **keep_non_empty:**
  * **failback:**


#### (Async) empty (Action)

##### properties (empty)

  * **action:**: (= "empty")

#### count (Action)

##### properties (count)

  * **action:**: (= "count")



### Events

The List component emits the following events:

#### addItem (list Event)

Triggered when a new item is going to be added to the list. This event occurs
just **after** the new item node is created and **before** it is actually
inserted in the DOM.

Event data contains the properties received by the originating `addItem`
action, plus the following properties:

  * `newItemTarget`: The new DOM element that is about to be inserted (not yet
    a component).

  * `onRendered`: A callback setter that allows executing code after the item
    is actually inserted in the DOM and rendered as a new child component of
    the list. The newly created child component is provided as an argument to
    the callback.


**Example:**

```javascript
myForm.on("addItem", function({
    newItemTarget,
    onRendered,
}) {
    newItemTarget.classList.add("ingoing");
    onRendered((newItem) => {
        newItem.target.classList.remove("ingoing");
        newItem.target.classList.add("ongoing");
        // Alternatively, we could have used just newItemTarget instead of
        // newItem.target here.
    });
});
```

In this example, we add the CSS class `ingoing` to the new item before it is
rendered, and then change it by the class (`ongoing`) after it is rendered.

This way we can animate the insertion of a new item with a few CSS lines such
as follows:

```css
.form-group .ingoing {
    transform: scaleY(0) translateY(-50%);
}

.form-group .ongoing {
    transition:
        transform 70ms ease-in
    ;
}
```

#### removeItem (list Event)

Triggered when an item is going to be removed from the list. This event occurs
just **before** removing the item from the DOM and the list itself.

Event data contains the properties received by the originating `removeItem`
action, plus the following properties:

  * `oldItem`: The child component (Smark component) of the list that is about
    to be removed.

  * `oldItemTarget`: The DOM element that is about to be removed from the DOM
    (the target of `oldItem`).

  * `onRemoved`: A callback setter that allows executing code after
    `oldItemTarget` is actually removed from the DOM and `oldItem` is removed
    from the list.  No arguments will be provided to this callback.


**Example:**

```javascript
myForm.on("removeItem", async function({
    oldItemTarget,
    onRemoved,
}) {
    oldItemTarget.classList.remove("ongoing");
    oldItemTarget.classList.add("outgoing");

    // Await transition to finish before removing the item:
    const [duration, multiplier = 1000] = window.getComputedStyle(oldItemTarget)
        .getPropertyValue('transition-duration')
        .slice(0,-1).replace("m","/1")
        .split("/")
        .map(Number)
    ;
    await new Promise(resolve => setTimeout(
        resolve,
        duration * multiplier
    ));
});
```

In this example, we add the `outgoing` CSS class to the item being removed so
that it can be easily animated with a few CSS such as follows:

```css
.form-group .outgoing {
    transform: scaleY(0) translateY(-50%);
    transition:
        transform 70ms ease-out
    ;
}
```

Then it wait for the specified transition duration to elapse preventing the
item being actually removed from the DOM until animation finished.




