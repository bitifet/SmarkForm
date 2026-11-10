---
title: Manifesto
layout: chapter
description: "The design principles behind SmarkForm: use ordinary HTML as the form UI, keep data structured as JSON, and avoid framework lock-in."
permalink: "/about/manifesto"
nav_order: 6
---


{% include links.md %}

# {{ page.title }}



<br />
<div class="chaptertoc">
<p>A web form must:</p>

  {% include chaptertoc/manifesto.html depth=2 %}

</div>



## Be as easy to define as traditional HTML forms are.

A web form should allow developers to create forms using simple HTML tags, just
as they would with traditional HTML forms. The complexity of creating
interactive forms should be minimized, making the process intuitive and
straightforward.


## Be intuitive and accessible to users.

Web forms should be user-friendly, ensuring that users can easily understand
and interact with them. Accessibility should be designed in: provide built-in
support where the library can, and make the remaining author responsibilities
explicit rather than implied.


## Work seamlessly across all devices with no functionality penalty.

A web form library should ensure that forms are fully responsive and functional
on all devices, including desktops, tablets, and smartphones. There should not
be any loss of functionality when accessing the forms from different devices.


## Ensure a consistent user experience across different forms.

The user experience should be consistent across all forms. This means that
users should have a uniform experience in terms of navigation, and interaction,
regardless of the form they are using.

## Grant separation of concerns between design and logic.

Form implementation should allow designers to focus on the visual aspects of
the form (HTML and CSS) while developers concentrate on the functional logic
(JavaScript). This separation ensures that changes in design do not affect the
underlying logic and vice versa.


## Encourage and facilitate usability and accessibility.

A form library should include features and facilitate best practices that
promote usability and accessibility. This includes keyboard navigation, screen
reader compatibility, and other assistive technologies to ensure that forms are
usable by everyone.


## Provide advanced capabilities such as manual list sorting and dynamic data.

A modern form library should offer advanced features such as manual list
sorting, handling dynamic data, and providing complex form interactions
without the need for extensive custom coding. Automatic sorting by field value
is not implemented and is not currently scheduled; manual drag-and-drop sorting
is the supported behavior.


##  Not interfere with the actual HTML and CSS design.

A form library should integrate seamlessly with existing HTML and CSS. It
should not impose specific design constraints or interfere with the designer's
ability to style forms as they see fit.


##  Return field values in proper data types according to the type of the field.

Fields within a form should return values in the appropriate data types. For
example, a number field should return a numeric value, a date field should
return a properly formatted date, and so on.


##  Import and Export data in JSON format.

A form library should support importing and exporting form data in JSON format.
This makes it easier to handle complex data structures and integrate with other
systems that use JSON.


## Be able to handle nested JSON structures.

A web form should be flexible enough to manage nested objects and arrays. This
allows for the creation of complex forms that can handle sophisticated data
models without forcing every value into a flat list.


## Coexist with modern web technologies.

It should work with modern web technologies such as ES modules, Web Components,
and contemporary JavaScript frameworks and libraries without requiring them.
Integration should be explicit: SmarkForm is a DOM-first form library, not a
framework adapter.


##  Be Open Source and open to community contributions.

SmarkForm should be open-source, allowing developers to contribute to its
development. This fosters a community-driven project where users can suggest
improvements, report issues, and contribute code to enhance the library.










Each of these principles aims to make SmarkForm a robust, user-friendly, and powerful form library that meets the needs of both developers and users.
