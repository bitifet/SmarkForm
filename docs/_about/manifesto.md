---
title: Manifesto
layout: chapter
permalink: /about/manifesto
nav_order: 2

---

# {{ page.title }}



<br />
<div class="chaptertoc">
<p>A web form must:</p>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Be as easy to define as traditional HTML forms are.](#be-as-easy-to-define-as-traditional-html-forms-are)
* [Be intuitive and accessible to users.](#be-intuitive-and-accessible-to-users)
* [Work seamlessly across all devices with no functionality penalty.](#work-seamlessly-across-all-devices-with-no-functionality-penalty)
* [Ensure a consistent user experience across different forms.](#ensure-a-consistent-user-experience-across-different-forms)
* [Grant separation of concerns between design and logic.](#grant-separation-of-concerns-between-design-and-logic)
* [Encourage and facilitate usability and accessibility.](#encourage-and-facilitate-usability-and-accessibility)
* [Provide advanced capabilities like manual and automatic list sorting, etc.](#provide-advanced-capabilities-like-manual-and-automatic-list-sorting-etc)
* [Not interfere with the actual HTML and CSS design.](#not-interfere-with-the-actual-html-and-css-design)
* [Return field values in proper data types according to the type of the field.](#return-field-values-in-proper-data-types-according-to-the-type-of-the-field)
* [Import and Export data in JSON format.](#import-and-export-data-in-json-format)
* [Be able to handle any possible JSON structure.](#be-able-to-handle-any-possible-json-structure)
* [Be compatible with modern web technologies.](#be-compatible-with-modern-web-technologies)
* [Be Open Source and open to community contributions.](#be-open-source-and-open-to-community-contributions)

<!-- vim-markdown-toc -->
       " | markdownify }}

</div>



## Be as easy to define as traditional HTML forms are.

A web form should allow developers to create forms using simple HTML tags, just
as they would with traditional HTML forms. The complexity of creating
interactive forms should be minimized, making the process intuitive and
straightforward.


## Be intuitive and accessible to users.

Web forms should be user-friendly, ensuring that users can easily understand
and interact with them. Accessibility features should be built-in, making the
forms usable by people with various disabilities.


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


##  Provide advanced capabilities like manual and automatic list sorting, etc.

A modern form library should offer advanced features such as sorting lists
manually or automatically, handling dynamic data, and providing complex form
interactions without the need for extensive custom coding.


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


##  Be able to handle any possible JSON structure.

A web form should be flexible enough to manage any JSON structure, including
nested objects and arrays. This allows for the creation of complex forms that
can handle sophisticated data models.


##  Be compatible with modern web technologies.

It also should work seamlessly with modern web technologies such as ES6
modules, Web Components, and other contemporary JavaScript frameworks and
libraries. This ensures that it remains relevant and useful in modern web
development.


##  Be Open Source and open to community contributions.

SmarkForm should be open-source, allowing developers to contribute to its
development. This fosters a community-driven project where users can suggest
improvements, report issues, and contribute code to enhance the library.










Each of these principles aims to make SmarkForm a robust, user-friendly, and powerful form library that meets the needs of both developers and users.
