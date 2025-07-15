---
title: Form Traversing
layout: chapter
permalink: /advanced_concepts/form_traversing
nav_order: 4

---

{% include links.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Introduction](#introduction)
* [Path Syntax Overview](#path-syntax-overview)
    * [Absolute Paths](#absolute-paths)
    * [Relative Paths](#relative-paths)
    * [Special Path Segments](#special-path-segments)
* [Basic Navigation Patterns](#basic-navigation-patterns)
    * [Child Navigation](#child-navigation)
    * [Parent Navigation](#parent-navigation)
    * [Root Access](#root-access)
* [Context and Target in Actions](#context-and-target-in-actions)
    * [Understanding Context](#understanding-context)
    * [Understanding Target](#understanding-target)
    * [Natural Context Resolution](#natural-context-resolution)
    * [Explicit Context and Target Specification](#explicit-context-and-target-specification)
* [List Item Sibling Navigation](#list-item-sibling-navigation)
    * [Syntax](#syntax)
    * [Navigation Direction](#navigation-direction)
    * [Use Cases](#use-cases)
    * [Examples](#examples)
* [Advanced Path Features](#advanced-path-features)
    * [Wildcard Patterns](#wildcard-patterns)
    * [Multi-Match Results](#multi-match-results)
* [Practical Examples](#practical-examples)
    * [Data Copying Between List Items](#data-copying-between-list-items)
    * [Complex Form Navigation](#complex-form-navigation)
    * [Dynamic Context Resolution](#dynamic-context-resolution)
* [Best Practices](#best-practices)
* [Common Patterns and Idioms](#common-patterns-and-idioms)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

## Introduction

Form traversing in SmarkForm provides a powerful and intuitive way to navigate through the component hierarchy and interact with specific parts of your forms. The `.find()` method serves as the primary mechanism for locating components within the form structure, supporting both simple navigation and complex path-based queries.

Building upon the foundational concepts introduced in the [Quick Start Guide]({{ "getting_started/quick_start#form-traversing" | relative_url }}), this comprehensive guide explores the full capabilities of SmarkForm's traversing system, including the newly implemented list item sibling navigation feature.

Every SmarkForm component provides a `.find()` method that accepts a path-like route to locate target components. This path-based approach enables precise navigation through nested form structures, making it easy to access, manipulate, and coordinate between different parts of your form.

## Path Syntax Overview

SmarkForm paths follow a familiar filesystem-like syntax that makes navigation intuitive for developers. Understanding the different types of paths and their behaviors is essential for effective form traversing.

### Absolute Paths

Absolute paths begin with a forward slash (`/`) and are resolved from the form root, regardless of the current component's position in the hierarchy.

```javascript
// Always resolves from the form root
const businessData = myForm.find("/businessData");
const specificField = myForm.find("/personalData/address");
```

Absolute paths are particularly useful when you need to access components from any position within the form, ensuring consistent behavior regardless of the calling context.

### Relative Paths

Relative paths do not begin with a forward slash and are resolved relative to the current component. This enables context-aware navigation that adapts based on the caller's position.

```javascript
// From within a list item, access a sibling field
const nameField = currentItem.find("name");

// From a parent component, access nested children
const phoneList = personalData.find("contactInfo/phones");
```

### Special Path Segments

SmarkForm recognizes several special path segments that provide convenient navigation shortcuts:

- `..` - Navigate to the parent component
- `.+N` - Navigate to the next sibling (where N is a positive integer)
- `.-N` - Navigate to the previous sibling (where N is a positive integer)
- `*` and `?` - Wildcard patterns for multi-match queries

## Basic Navigation Patterns

### Child Navigation

Direct child navigation uses the component's name as defined in the `name` attribute or the `data-smark` configuration:

```javascript
// Navigate to direct children
const personalInfo = form.find("personalData");
const businessInfo = form.find("businessData");

// Chain navigation for deeper access
const streetAddress = form.find("personalData/address/street");
```

### Parent Navigation

Use the `..` segment to navigate to parent components:

```javascript
// From a deeply nested component, access its parent
const parentForm = currentField.find("..");

// Navigate to grandparent or higher ancestors
const grandParent = currentField.find("../../");
const greatGrandParent = currentField.find("../../../");
```

### Root Access

Access the form root from any component using an absolute path:

```javascript
// Always resolves to the form root
const formRoot = anyComponent.find("/");
```

## Context and Target in Actions

Understanding the concepts of *context* and *target* is crucial for effective action implementation and form interaction patterns.

### Understanding Context

The **context** of an action is the component over which the action will be applied. Context determination follows a hierarchical resolution process:

1. **Explicit Context**: When specified via the `context` property in a trigger's `data-smark` configuration
2. **Natural Context**: The nearest ancestor component that implements the requested action
3. **Default Context**: The form root if no suitable ancestor is found

```javascript
// Explicit context specification
<button data-smark='{"action":"clear", "context":"personalData"}'>
    Clear Personal Data
</button>

// Natural context (nearest implementing ancestor)
<div data-smark='{"name":"personalData", "type":"form"}'>
    <button data-smark='{"action":"clear"}'>Clear</button>
    <!-- Context resolves to personalData -->
</div>
```

### Understanding Target

The **target** represents a specific child component within the context that should receive the action. Target resolution follows similar principles to context resolution:

```javascript
// Explicit target specification
<button data-smark='{"action":"export", "context":"personalData", "target":"address"}'>
    Export Address
</button>

// Natural target resolution based on DOM hierarchy
<div data-smark='{"name":"addresses", "type":"list"}'>
    <div>
        <button data-smark='{"action":"removeItem"}'>Remove</button>
        <!-- Target resolves to this list item -->
    </div>
</div>
```

### Natural Context Resolution

Natural context resolution examines the component hierarchy to find the most appropriate context for an action:

```javascript
// Example hierarchy:
// Form Root
//   ├── personalData (form)
//   │   ├── name (input)
//   │   └── clearButton (trigger)
//   └── businessData (form)

// When clearButton is clicked:
// 1. Check clearButton - doesn't implement 'clear'
// 2. Check personalData - implements 'clear' ✓
// Result: personalData becomes the context
```

This automatic resolution eliminates the need for explicit wiring in most common scenarios.

### Explicit Context and Target Specification

For complex forms or specific interaction patterns, you can explicitly specify both context and target:

```javascript
// Copy data from one section to another
<button data-smark='{
    "action": "export",
    "context": "personalData",
    "target": "/businessData"
}'>Copy Personal to Business</button>

// Import data with specific targeting
<button data-smark='{
    "action": "import",
    "context": "businessData",
    "target": "/personalData/address"
}'>Import Address</button>
```

## List Item Sibling Navigation

The newly implemented list item sibling navigation feature provides a powerful mechanism for accessing adjacent items within lists using a concise dot notation syntax.

### Syntax

Sibling navigation uses a single dot followed by a signed integer:

- `.+N` - Navigate forward N positions (next siblings)
- `.-N` - Navigate backward N positions (previous siblings)

Where N is a positive integer representing the number of positions to move.

```javascript
// Navigate to the next sibling
const nextItem = currentListItem.find(".+1");

// Navigate to the previous sibling  
const prevItem = currentListItem.find(".-1");

// Navigate multiple positions
const itemTwoPositionsAhead = currentListItem.find(".+2");
const itemThreePositionsBehind = currentListItem.find(".-3");
```

### Navigation Direction

The direction of navigation corresponds to the visual order of list items:

- **Forward navigation** (`.+N`): Moves toward items that appear later in the list
- **Backward navigation** (`.--N`): Moves toward items that appear earlier in the list

```javascript
// In a list: [Item0, Item1, Item2, Item3, Item4]
// From Item2 position:

const item3 = item2.find(".+1");  // Forward to Item3
const item4 = item2.find(".+2");  // Forward to Item4
const item1 = item2.find(".-1");  // Backward to Item1
const item0 = item2.find(".-2");  // Backward to Item0
```

### Use Cases

Sibling navigation enables powerful patterns for list manipulation and data management:

#### Data Duplication and Synchronization

```javascript
// Copy data from current item to next item
const currentData = await currentItem.export();
const nextItem = currentItem.find(".+1");
if (nextItem) {
    await nextItem.import({data: currentData});
}
```

#### Comparative Operations

```javascript
// Compare current item with previous item
const currentValue = await currentItem.find("value").export();
const previousItem = currentItem.find(".-1");
if (previousItem) {
    const previousValue = await previousItem.find("value").export();
    // Perform comparison logic
}
```

#### Sequential Data Processing

```javascript
// Process items in sequence
let currentItem = list.find("0"); // Start with first item
while (currentItem) {
    await processItem(currentItem);
    currentItem = currentItem.find(".+1"); // Move to next
}
```

### Examples

#### Copy Data Between Adjacent List Items

```html
<ul data-smark='{"name": "employees", "type": "list", "of": "form"}'>
    <li>
        <input name="name" data-smark placeholder="Name">
        <input name="email" data-smark placeholder="Email">
        <button data-smark='{
            "action": "export",
            "target": ".+1"
        }'>Copy to Next</button>
        <button data-smark='{
            "action": "import", 
            "target": ".-1"
        }'>Copy from Previous</button>
    </li>
</ul>
```

#### Sequential Form Validation

```javascript
// Validate all items in sequence, stopping at first error
async function validateSequentially(list) {
    let currentItem = list.find("0");
    let position = 0;
    
    while (currentItem) {
        const isValid = await validateItem(currentItem);
        if (!isValid) {
            console.log(`Validation failed at position ${position}`);
            return false;
        }
        currentItem = currentItem.find(".+1");
        position++;
    }
    return true;
}
```

#### Dynamic List Navigation UI

```html
<!-- Navigation controls within list items -->
<div data-smark='{"name": "records", "type": "list", "of": "form"}'>
    <div>
        <input name="data" data-smark>
        <div class="navigation">
            <button data-smark='{
                "action": "export",
                "context": ".",
                "target": ".-1"
            }'>← Copy from Previous</button>
            <button data-smark='{
                "action": "export", 
                "context": ".",
                "target": ".+1"
            }'>Copy to Next →</button>
        </div>
    </div>
</div>
```

## Advanced Path Features

### Wildcard Patterns

SmarkForm supports wildcard patterns for multi-component selection:

```javascript
// Select all children matching a pattern
const allPhones = form.find("employees/*/phones");

// Single character wildcard
const specificItems = form.find("data/?/value");
```

### Multi-Match Results

When using wildcards, `.find()` returns an array of matching components:

```javascript
// Returns array of all employee components
const employees = form.find("employees/*");

// Process each match
employees.forEach(async (employee) => {
    const data = await employee.export();
    console.log(data);
});
```

## Practical Examples

### Data Copying Between List Items

This example demonstrates a practical implementation of sibling navigation for data copying in a contact list:

```html
<div id="contactForm">
    <div data-smark='{"name": "contacts", "type": "list", "of": "form", "min_items": 1}'>
        <fieldset>
            <legend>Contact Information</legend>
            <p>
                <label data-smark>Name:</label>
                <input name="name" data-smark type="text">
            </p>
            <p>
                <label data-smark>Email:</label>
                <input name="email" data-smark type="email">
            </p>
            <p>
                <label data-smark>Phone:</label>
                <input name="phone" data-smark type="tel">
            </p>
            <div class="actions">
                <button data-smark='{
                    "action": "export",
                    "target": ".+1"
                }'>📋 Copy to Next</button>
                <button data-smark='{
                    "action": "import",
                    "target": ".-1"
                }'>📥 Copy from Previous</button>
                <button data-smark='{"action": "removeItem"}'>🗑️ Remove</button>
            </div>
        </fieldset>
    </div>
    <button data-smark='{"action": "addItem", "context": "contacts"}'>➕ Add Contact</button>
</div>
```

### Complex Form Navigation

Navigate through nested form structures using combined path expressions:

```javascript
// Access nested data in complex forms
const form = new SmarkForm(document.getElementById("complexForm"));

// Navigate to specific nested fields
const streetAddress = form.find("/customer/addresses/0/street");
const billingEmail = form.find("/customer/billing/email");

// Use relative navigation from current context
const currentAddress = form.find("/customer/addresses/0");
const nextAddress = currentAddress.find(".+1");
const cityField = currentAddress.find("city");
```

### Dynamic Context Resolution

Implement dynamic behavior based on component relationships:

```javascript
// Smart data synchronization
class FormSynchronizer {
    constructor(form) {
        this.form = form;
        this.setupSynchronization();
    }
    
    async setupSynchronization() {
        // Listen for changes in any employee record
        this.form.on("AfterAction_import", async (event) => {
            const {context} = event;
            
            // If it's an employee item, sync with siblings
            if (context.parent?.name === "employees") {
                await this.syncWithSiblings(context);
            }
        });
    }
    
    async syncWithSiblings(employeeItem) {
        const employeeData = await employeeItem.export();
        
        // Sync common data with next item if exists
        const nextEmployee = employeeItem.find(".+1");
        if (nextEmployee) {
            const nextData = await nextEmployee.export();
            nextData.department = employeeData.department; // Sync department
            await nextEmployee.import({data: nextData});
        }
    }
}
```

## Best Practices

### Path Construction

1. **Use absolute paths for global references**: When accessing components that should be reachable from anywhere in the form, use absolute paths starting with `/`.

2. **Prefer relative paths for local navigation**: When working within a specific section or component, use relative paths to maintain flexibility.

3. **Leverage natural context resolution**: Allow SmarkForm's natural context resolution to determine appropriate contexts automatically when possible.

4. **Use meaningful component names**: Ensure your component names clearly indicate their purpose to make paths self-documenting.

### Sibling Navigation Guidelines

1. **Check existence before use**: Always verify that sibling components exist before attempting to interact with them:
   ```javascript
   const nextItem = currentItem.find(".+1");
   if (nextItem) {
       // Safe to interact with nextItem
   }
   ```

2. **Handle boundary conditions**: Consider what happens at list boundaries (first/last items) and implement appropriate fallback behavior.

3. **Use descriptive variable names**: When storing references to sibling components, use names that clearly indicate the relationship:
   ```javascript
   const previousContact = currentContact.find(".-1");
   const nextContact = currentContact.find(".+1");
   ```

### Performance Considerations

1. **Cache frequently accessed components**: Store references to commonly accessed components rather than repeatedly calling `.find()`.

2. **Use specific paths**: More specific paths are generally more efficient than broad wildcard searches.

3. **Minimize deep traversal**: When possible, use shorter paths by starting from a more appropriate base component.

## Common Patterns and Idioms

### Sequential Processing Pattern

```javascript
// Process all list items in order
function processListSequentially(list) {
    let currentItem = list.find("0");
    const results = [];
    
    while (currentItem) {
        results.push(processItem(currentItem));
        currentItem = currentItem.find(".+1");
    }
    
    return results;
}
```

### Bidirectional Data Sync Pattern

```javascript
// Synchronize data between adjacent items
async function syncBidirectional(item, field) {
    const value = await item.find(field).export();
    
    // Sync with previous item
    const prevItem = item.find(".-1");
    if (prevItem) {
        await prevItem.find(field).import({data: value});
    }
    
    // Sync with next item
    const nextItem = item.find(".+1");
    if (nextItem) {
        await nextItem.find(field).import({data: value});
    }
}
```

### Conditional Navigation Pattern

```javascript
// Navigate based on conditions
function findNextValidItem(currentItem) {
    let candidate = currentItem.find(".+1");
    
    while (candidate) {
        if (await candidate.isValid()) {
            return candidate;
        }
        candidate = candidate.find(".+1");
    }
    
    return null; // No valid item found
}
```

### Form Section Coordination Pattern

```javascript
// Coordinate between different form sections
class FormCoordinator {
    constructor(form) {
        this.form = form;
    }
    
    async copyPersonalToBusiness() {
        const personalData = this.form.find("/personalData");
        const businessData = this.form.find("/businessData");
        
        const personal = await personalData.export();
        
        // Map personal data to business fields
        await businessData.import({
            data: {
                companyName: personal.name,
                contactEmail: personal.email,
                // ... other mappings
            }
        });
    }
}
```

The combination of these patterns with SmarkForm's traversing capabilities enables the creation of sophisticated, interactive forms with minimal boilerplate code. The path-based navigation system, enhanced with sibling navigation, provides a powerful foundation for building complex form interactions while maintaining code clarity and maintainability.