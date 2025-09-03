---
title: «label» Component Type
layout: chapter
permalink: /component_types/type_label
nav_order: 10001

---

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Introduction](#introduction)
* [Usage](#usage)
* [Automatic Field Association](#automatic-field-association)
* [Options](#options)
* [Restrictions](#restrictions)
* [API Reference](#api-reference)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

## Introduction

The `label` component type is a special enhancement component that extends `SmarkComponent` (not the typical `input` component). It provides intelligent labeling capabilities with automatic field association and enhanced accessibility features.

- **Purpose:** Enhances HTML label elements with automatic field targeting and improved accessibility
- **Naming:** Labels are always unnamed components (they don't have a `name` property)
- **Association:** Automatically creates `for` attribute associations with nearby form fields
- **Selectability:** Controls text selection behavior through the `allow_select` option

## Usage

The `label` component can be used to create enhanced labels that automatically associate themselves with form fields. It works with both explicit targeting and automatic field detection.

**Example - Automatic Association:**

```html
<!-- Label automatically associates with the next form field -->
<label data-smark>Username:</label>
<input type="text" data-smark name="username" placeholder="Enter username">
```

**Example - Explicit Targeting:**

```html
<!-- Label explicitly targets a specific field -->
<label data-smark='{"target":"myField"}'>Email Address:</label>
<div>
    <input type="email" data-smark name="myField" placeholder="Enter email">
</div>
```

**Example - With Options:**

```html
<!-- Label with custom options -->
<label data-smark='{"allow_select": true, "context": "myForm"}'>
    Selectable Label Text
</label>
```

## Automatic Field Association

The `label` component provides intelligent field targeting:

- **Automatic Detection:** When no explicit target is specified, the label searches for the next form field in the DOM
- **ID Generation:** Automatically generates unique IDs for target fields that don't have one
- **For Attribute:** Sets the `for` attribute on the label to establish proper accessibility relationships
- **Scope Limitation:** Only works with native input fields (scalars), not with complex SmarkForm components like forms or lists

## Options

The `label` component supports several configuration options:

- **`allow_select`** (boolean, default: false): Controls whether the label text can be selected by the user. When false, sets `user-select: none` CSS property.
- **`context`** (string): Specifies the context component for field resolution. Relative paths start from the default context.
- **`target`** (string): Explicitly specifies which field the label should associate with. Can be a relative or absolute path to the target component.

## Restrictions

The `label` component has important usage restrictions:

- **No Field Components:** Labels cannot contain other SmarkForm field components (components that have a `name` property)
- **Action Components Only:** Only action components (like triggers) are allowed inside label elements
- **Native Fields Only:** Automatic association only works with native HTML input elements, not complex SmarkForm components

If you attempt to place a field component inside a label, SmarkForm will throw a `FIELD_IN_LABEL` error.

## API Reference

The `label` component type is primarily a passive enhancement component and does not expose the standard import/export/clear actions that field components provide. Instead, it focuses on:

- **Field Association:** Automatically establishing relationships with form fields
- **Accessibility Enhancement:** Improving screen reader and keyboard navigation support
- **Action Component Management:** Allowing action components (like buttons) to be placed within labels for enhanced user interaction

Labels work by enhancing the DOM structure and relationships rather than managing data, making them fundamentally different from data-oriented field components.

