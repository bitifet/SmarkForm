*list* Component Type
=====================


Índex
-----


<!-- vim-markdown-toc GitLab -->

* [Introduction](#introduction)
    * [List Component](#list-component)
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


Introduction
------------

### List Component

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


5. At any time, you can capture the list and act over it programatically:


3. Use the provided API methods to interact with the list:

   ```javascript
   const myList = myForm.find("/myList");
   myList.addItem(); // Adds an Item at the end.
   myList.removeItem(); // Adds an Item at the end.
   myList.import([ // Import some data.
     {field1: "foo", field2: 5},
     {field1: "bar", field2: 15},
     {field1: "baz", field2: 75},
   }];
   const myData = await myList.export(); // Export list contents.
   myList.find("2/field2").import(25); // Update third item field2's value.
   ```


For more information on using the List component and its available methods, please refer to the [API Reference](#api-reference).

Feel free to adjust the content and structure of the section to match the specific functionality and usage of the List component in your SmarkForm library.



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
  * **position:** = "after" (default) / "before"
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

#### addItem (list Event)


#### removeItem (list Event)

