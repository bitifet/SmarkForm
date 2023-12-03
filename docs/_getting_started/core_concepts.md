---
title: Core Concepts
layout: chapter
permalink: /getting_started/core_concepts
nav_order: 4

---

# {{ page.title }}

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Forms, Lists and Fields](#forms-lists-and-fields)
    * [Fields](#fields)
    * [Component nesting](#component-nesting)
    * [Lists](#lists)
    * [Triggers](#triggers)
    * [Triggers target](#triggers-target)
    * [Behaviour tunning](#behaviour-tunning)
    * [Constraining lists](#constraining-lists)
    * [Singletons](#singletons)
    * [Addressability](#addressability)
    * [More...](#more)
* [The `data-smark` Attribute](#the-data-smark-attribute)
    * [Syntax](#syntax)
    * [Shorthand Syntaxes](#shorthand-syntaxes)
        * [String Value](#string-value)
        * [No value at all](#no-value-at-all)
* [Mandatory properties](#mandatory-properties)
* [Components and Actions](#components-and-actions)
    * [Components](#components)
    * [Actions](#actions)
    * [Trigger Components](#trigger-components)
* [Accessing Components](#accessing-components)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


{: .warning }
> The code examples in this section have been designed to provide a clearer
> understanding of the concepts they illustrate.
> 
> In most real-world scenarios, these examples may not be the best choices.
> 
> For instance, we will seldom need to use onRendered callbacks, as all form
> interactions will be handled through *trigger* components.


## Forms, Lists and Fields

When we initialize a *SmarkForm* instance over some DOM element, it is enhanced
as **a *SmarkForm* form** component which is returned as our *root form*.

```javascript
const myForm = new SmarkForm(some_DOM_element); // Or myRootForm
```

👉 Then, every inner DOM element with a *data-smark* attribute, will be
enhanced as another SmarkForm component. No matter if it is a direct child or a
descendant of any depth.

```html
<div id='myForm'> <!-- SmarkForm Component -->
  <input name='userId' data-smark> <!-- SmarkForm Component -->
  <ul>
    <li><input name='name' data-smark> <!-- SmarkForm Component --> </li>
    <li><input name='surname' data-smark> <!-- SmarkForm Component --> </li>
  </ul>
  <script>
    const myForm = new SmarkForm(document.getElementById("myForm"));
  </script>
</div>
```

### Fields

👉 **Every *SmarkForm* component (except *triggers*) is a form field** from and
to which **we can import and export values**.

So our *root form* is also a *field* (of type "form") from and to which we can
import and export *values* (JSON objects).

```javascript
myForm.onRendered(function() {
  this.export().then(console.log);
  // { "userId": "", "name": "", "surname": "" }
  this.import({name: "John"})
    .then(()=>this.export())
    .then(console.log)
  ;
  // { "userId": "", "name": "John", "surname": "" }
});
```

{: .info }
> Alternatively, you can enhance readability by providing the onRendered
> callback through the options object and/or using an async function.
> 
> ```javascript
> const myForm = new SmarkForm(document.getElementById("myForm"), {
>     async onRendered() {
>         console.log(await this.export());
>         // { "userId": "", "name": "", "surname": "" }
>         await this.import({name: "John"});
>         console.log(await this.export());
>         // { "userId": "", "name": "John", "surname": "" }
>     },
> });
> ```

### Component nesting

👉 This also mean **we can nest forms** inside other forms as regular fields
(holding JSON objects) with no depth limit.

```html
<div id='myForm'>
  <input name='userId' value='0001' data-smark>
  <div data-smark='{"type":"form","name":"personal_data"}'>
    <input name='name' value='John' data-smark>
    <input name='surname' value='Doe' data-smark>
  </div>
  <script>
    const myForm = new SmarkForm(document.getElementById("myForm"), {
        async onRendered() {
            console.log(await this.export());
            // { "userId": "0001", "personal_data": { "name": "John", "surname": "Doe" } }
        }
    });
  </script>
</div>
```

### Lists

👉 In case we need arrays, the *list* component type come to rescue: Likewise
forms hold JSON objects, **lists hold JSON arrays**. So we are able to define
simple HTML forms that can import and export any imaginable JSON data.


```html
<div data-smark='{"type":"form","name":"personal_data"}'>
  <input name='name' data-smark>
  <input name='surname' data-smark>
  <ul data-smark='{"type":"list","name":"pets"}'>
    <li>
      <input name='species' data-smark>
      <input name='name' data-smark>
    </li>
  </ul>
  <button data-smark='{"action":"addItem","for":"pets"}'>Add Pet</button>
  <button data-smark='{"action":"removeItem","for":"pets"}'>Remove Pet</button>
</div>
```

{: .info }
> To enable users to control the array's length, the *list* component type
> offers the "addItem" and "removeItem" *actions*.
> 
> 👉 *Actions* are functions provided by component types for interaction. They
> can be triggered by components of the so-called "trigger" type, where the
> component acts as their *context*.
> 
> 👉 Trigger components have a (mandatory) *action* attribute which specifies
> the action to be triggered.
> 
> 👉 In order to improve readability, the *action* property is not allowed in
> any other component type and, hence, the `"type": "trigger"` become optional
> (and discouraged).


### Triggers

👉 *Trigger* components have a "natural context" which is the closest
*SmarkForm* component conaining it (That is: *personal_data* subform in
previous example) but its actual *context* is the closest component
**implementing that action** unless overridden by the *for* property.

The *for* property specifies the *relative path*, from its *natural context*
to the actual context of the trigger.

### Triggers target

👉 Besides the *context*, *trigger* components may also have a *target*
consisting of an inner component to which the specified action is performed.

The target can be specified using the *to* property, but it can also have a
default value depending on the context's component type. In the case of *lists*,
the default target is the list item that contains the *trigger* component (if
it is contained within one) or the last item in the list otherwise. For
example, when clicking the "Remove Pet" button in the previous example, the
last pet in the list would be removed.

**In other words:** We can move the *removeItem* trigger button inside list
items allowing users to cherry-pick which item to remove:

```html
<ul data-smark='{"type":"list","name":"pets"}'>
  <li>
    <input name='species' data-smark>
    <input name='name' data-smark>
    <button data-smark='{"action":"removeItem"}'>❌</button>
  </li>
</ul>
<button data-smark='{"action":"addItem","for":"pets"}'>➕</button>
<!-- (Optionally we can keep both)
<button data-smark='{"action":"removeItem","for":"pets"}'>➖</button>
-->
```

{: .info }
> Similarly, we could have placed an "addItem" button too inside the list item
> template. In that case, new items would be inserted **after** the item
> containing the button (its default target) unless if we set the *position*
> property to "before".
> 
> {: .warning }
> > But keep in mind that, if *minItems* (see [Constraining
> > lists](#constraining-lists) below...) is set to 0 you would need at least
> > another *external* "addItem" button to be able to add items to the list
> > when it is empty...


### Behaviour tunning

👉 A special case for the "to" property is specifying it as "\*". In this case,
the *trigger* button's target will be all items of the list.

Which combined (or not) with the *keep_non_empty* property of *list* component
type's *removeItem* action, may lead to several interesting combinations:

➡️  Remove last empty pet. If none is empty, remove last one:

```html
<button
    data-smark='{
        "action":"removeItem",
        "for":"pets",
        "keep_non_empty":true
    }'
>Remove Pet</button>
```

➡️  Remove all pets with no filled data:
```html
<button
    data-smark='{
        "action":"removeItem",
        "for":"pets",
        "to":"*",
        "keep_non_empty":true
    }'
>Clear Empty Pets</button>
```

➡️  Remove all pets unconditionally:
```html
<button
    data-smark='{
        "action":"removeItem",
        "for":"pets",
        "to":"*",
    }'
>Remove All Pets</button>
```

### Constraining lists

👉 By default, lists can hold any number of items, from 1 to infinite. But this
can be overridden with *minItems* and *maxItems* properties. Example:

```html
<ul data-smark='{
    "type":"list",
    "name":"pets",
    "minItems": 0,
    "maxItems": 5,
}'>
  <li>
    <!-- ... -->
  </li>
</ul>
```

### Singletons

👉 As we have seen, lists can hold any number of *subform* instances. But  if
we need a list of just scalar values such as text or numbers (`<input>`,
`<textarea>`, `<select>`...) there will be no room for trigger components in
list items to, say, remove given item.

But the *input* component type can handle not only single `<input>`, `<selext>`
and `<textarea>`tags but also any other tag surrounding a whole subform with
the only restriction that only one actual field is allowed (and, in fact,
required) inside but allowing the presence of any number of *trigger*
components.

This special behavior of the *input* component type is what we call a
*singleton*, which adheres to the following rules:

  * They only allow for a single non *trigger* component in it.
  * Does not require (and it's not advisable) to provide a name for that
    component.
  * When imported or exported, they receive and return only the value ot that
    field.

{: .info}
> Not only *input* components are *singletons*. Also all other components
> inheriting from it (*number*, *date*...) work as singletons too.

**Example:**

```html
<div data-smark='{"type":"form","name":"personal_data"}'>
  <input name='name'  data-smark>
  <input name='surname' data-smark>
  <ul data-smark='{"type":"list","name":"phones"}'>
    <li data-smark='{"type":"input"}'>
      <input placeholder='Phone Number' type="text" data-smark>
      <button data-smark='{"action":"removeItem"}'>❌</button>
    </li>
  </ul>
  <button data-smark='{"action":"addItem","for":"phones"}'>➕</button>
</div>
```

{: .hint}
> This forced us to explicitly specify the *data-smark* property in the list
> item template. To avoid this we can use the "of" property of the list to
> specify the desired SmarkForm component type:
> 
> 
> ```html
> <ul data-smark='{"type":"list","name":"phones","of":"input"}'>
>   <li>
>     <input placeholder='Phone Number' type="text" data-smark>
>     <button data-smark='{"action":"removeItem"}'>❌</button>
>   </li>
> </ul>
> ```

### Addressability

In the previous examples we have seen the *for* and *to* properties that let us
pointing to some *SmarkForm* component from another.

It may seem we simply used the value of the *name* property of the field we
want to point to. But, in fact, those were "directory-like" relative paths.

We also mentioned that our root form is, in fact, a SmarkForm field that
imports and exports JSON data.

And all SmarkForm fields have a `.find()` method through which we can get any
other fields of the form by providding a relative or absolute (starting with
'/' which points to our root).

**Example:***

```javascript
myForm.export().then(console.log);
// {name:"",surname:"",phones:[""],pets:[{ species: '', name: '' } ] }
const firstPet = myForm.find("pets/0")
firstPet.export().then(console.log);
// { species: '', name: '' } 

```

<!--

TODO:

  * Addressability:
    - Import and export given vectors.

  * AutoId...

-->






### More...

{: .hint }
> Check out our [🔗 Complete Examples]({{ "resources/examples" | relative_url }})
> section to better understand these concepts.


## The `data-smark` Attribute

The `data-smark` attribute is used in SmarkForm to identify and enhance
specific DOM elements (HTML tags) as SmarkForm components. It also provides the
required properties for their enhancement.

{: .warning }
> The terms *attribute* and *property* may lead to confussion.
> 
> In this whole manual, we will consistently use **the term *attribute* to refer
> [HTML elemnts attributes](https://www.w3schools.com/html/html_attributes.asp)**
> and **the term *property* to refer object properties** and, specially
> SmarkForm components's properties defined in their *data-smark* attribute.

By using the `data-smark` attribute, you can mark elements to be transformed
into SmarkForm components, while the remaining elements are ignored by
SmarkForm.

{: .info }
> The following are **exceptions to this rule:**
>
> 1. The root element (the DOM element passed to the SmarkForm constructor to
>    be enhanced as *SmarkForm*) is always considered a SmarkForm component.
> 2. The item template of a list component, which is the only allowed direct
>    child in the HTML source before rendering, will always be rendered (per
>    each list item) as a SmarkForm component by default.
> 
> 👉 **In both cases, the `data-smark` attribute can be omitted.**

**Example:**

```html
<div id="myForm">
    <!-- Other form fields... -->
    <ul data-smark='{"name": "myList", "type": "list", "maxItems": 5}'>
        <li>
            <!-- Template describing list Item's layout -->
        </li>
    </ul>
    <!-- Other form fields... -->
</div>
<script>
    const myForm = new SmarkForm(document.getElementById("myForm"));
</script>
```

{: .hint }
> In the previous example:
>   * The outer `<div>` does not need the *data-smark* property since it is the
>     DOM element we enhanced as a *SmarkForm* root form field.
>   * The `<li>` element is the template that the  *list* component will render
>     as SmarkForm component every time a new item is added to the list.

### Syntax

The `data-smark` attribute should contain a valid JSON object with following
attributes:

  * `type` **(Mandatory):** Which specifies the component type.

  * `name` **(Recommended):** Field name to identify the component in its form
    level. Defaults to the value of the `name` attribute of actual HTML tag. If
    none given, random generated valued will be used instead.

  * *(other...)*: Depending on actual component type...


{: .info }
> 📌 There are also exceptions to this rule:
>
> 1. Any component with the `action` property is of "trigger" type and hence
>    the *type* property can be omitted.
> 
> 2. *Trigger* components are not considered form fields and, therefore, they
>    have no *name* property.


### Shorthand Syntaxes

For the sake of brevity, the *data-smark* attribute can also be specified in
the following alternative ways:

#### String Value

If only the type needs to be specified, it can be done as a regular string.

**Example:**

  * **Shorthand:** `<div data-smark="list">` 
  * **Long Form:** `<div data-smark='{"type": "list"}'>`

#### No value at all

Since component type can be infered from actual tag name and attributes, and
field name can be provided as regular property, the whole *data-smark*
attribute value can be omitted if we are happy with this inference:

**Example:**

  * **Shorthand:** `<textarea ... data-smark>`
  * **Long Form:** `<textarea data-smark='{}>`
  * **Equivalent (type infered) value:** `<textarea data-smark='{"type": "input"}>`



## Mandatory properties

The following properties are (nearly) mandatory:

- The `type` property is always necessary to determine which component type
  controller should be used for rendering the component. In many cases, it can be
  inferred based on the tag name or the presence of the `action` property, which
  forces the type to be "trigger".

- The `name` property is required for all non-trigger components.
   - If not explicitly provided, it can be inferred from the `name` property of
     the tag being enhanced. For example, `<input name="foo" data-smark>`.
   - If not provided and cannot be inferred, a randomly generated name will be
     used.

- The `action` property is mandatory for all [components of the type
  "trigger"](#trigger-components) to specify which [action](actions) they
  actually trigger. In fact, the `type="trigger"` property itself is optional
  here having it is implied by the presence of the `action` property.


**Other properties:**

Depending on the actual component type other properties may be applicable.

In case of *triggers*, despite `type`and `name`, is worth to mention that,
except for the `for` and `to` properties


FIXME: To be continued...
//// ** ... the rest of available properties depend on the type of its [context]()...

TODO: Link 'for' and 'to' to propper type_trigger.md section...



## Components and Actions

### Components

A SmarkForm *component* is just a DOM element (HTML tag) which has a
"data-smark" property providding a JSON-formatted *options* object.

It looks like as follows:

```html
<input data-smark='{type: "input"}'/>
```

{: .info }
> 📌 If only type option is specified, it can be simplified as:
> ```html
> <input data-smark='input'/>
> ```
> ...or just leave it empty to let SmarkForm engine to figure out its type:
> ```html
> <input data-smark/>
> ```


### Actions

*Actions* are operations that can be performed over components.

Some of them such as `import`, `export` and `empty` are available for all
components types while others are tied to secific types like `addItem` an d
`removeItem` for lists, etc...


### Trigger Components

*Trigger Components* are a special type of *component* that serve to trigger
actions on another compoenent which we refer to it as its "context".

Any SmarkForm component whith an *action* property is a [Trigger
Component]({{ "component_types/type_trigger" | relative_url }}) and for the
sake of simplicity, its *type* property can be ommitted but it cannot take a
different value than "trigger".

**Example:**

```html
<button data-smark='{action: "removeItem"}'></button>
```

{: .hint }
> 📖 For detailed information see [Trigger Type Documentation]({{ "component_types/type_trigger" | relative_url }}).



## Accessing Components


```javascript
const form = new SmarkForm(
    document.querySelector("#main-form")
);
```

