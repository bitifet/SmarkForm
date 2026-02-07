---
title: User Guide
layout: chapter
permalink: /resources/user_guide
nav_order: 1
---

{% include links.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Welcome to SmarkForm-Powered Forms](#welcome-to-smarkform-powered-forms)
* [Keyboard Navigation](#keyboard-navigation)
    * [Navigating Between Fields](#navigating-between-fields)
    * [Navigating All Elements](#navigating-all-elements)
    * [Working with Multiline Text](#working-with-multiline-text)
* [Discovering and Using Hotkeys](#discovering-and-using-hotkeys)
    * [How to Discover Available Shortcuts](#how-to-discover-available-shortcuts)
    * [SmarkForm's Unique Hotkey Approach](#smarkforms-unique-hotkey-approach)
    * [Second-Level Hotkeys: Reaching Outer Contexts](#second-level-hotkeys-reaching-outer-contexts)
    * [Common Hotkey Patterns](#common-hotkey-patterns)
* [Working with Lists](#working-with-lists)
    * [Adding and Removing Items](#adding-and-removing-items)
    * [Reordering Items](#reordering-items)
    * [Understanding List Limits](#understanding-list-limits)
* [Working with Nested Sections](#working-with-nested-sections)
* [Accessibility Features](#accessibility-features)
* [Tips for Efficient Form Filling](#tips-for-efficient-form-filling)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

## Welcome to SmarkForm-Powered Forms

Welcome! You're about to fill out a form powered by **SmarkForm**, a technology designed to make form filling faster, easier, and more intuitive.

This guide will help you discover powerful features like keyboard shortcuts, smart navigation, and dynamic lists that will save you time and make the experience more pleasant.

{: .hint}
> **New to SmarkForm?** Don't worry! These forms work just like regular forms, but with helpful enhancements. You can use them normally, or speed things up with the tips below.

## Keyboard Navigation

SmarkForm-powered forms offer smooth keyboard navigation that helps you move through forms quickly and efficiently.

### Navigating Between Fields

Use **Enter** and **Shift+Enter** to jump directly between form fields:

- **Enter** `⏎ `— Move to the next field
- **Shift+Enter** `⇧``⏎ `— Move to the previous field

This navigation is smart: it skips over buttons and other non-field elements, taking you straight to where you need to enter information.

{: .hint}
> **Pro tip:** This is much faster than using the mouse or tabbing through every element on the page!

### Navigating All Elements

If you need to navigate through *all* elements (including buttons and links), use the standard **Tab** key:

- **Tab** `↹ `— Move to the next element (fields, buttons, links)
- **Shift+Tab** `⇧``↹ `— Move to the previous element

### Working with Multiline Text

In multiline text areas (textarea fields), pressing **Enter** adds a new line within the textarea as usual. To move to the next field instead, use:

- **Ctrl+Enter** (or **Cmd+Enter** on Mac) — Move to the next field from a multiline text area
- **Ctrl+Shift+Enter** (or **Cmd+Shift+Enter** on Mac) — Move to the previous field from a multiline text area

{: .hint}
> **Pro tip:** You can consistently use **Ctrl+Enter** and **Ctrl+Shift+Enter** to navigate through fields from anywhere, regardless of field type!

## Discovering and Using Hotkeys

One of SmarkForm's most powerful features is context-aware keyboard shortcuts (hotkeys) that let you perform actions without reaching for your mouse.

### How to Discover Available Shortcuts

To see which keyboard shortcuts are available at any moment:

**Press and hold the Ctrl key** (or **Cmd** on Mac) ⌨️

While holding Ctrl, you'll see visual hints appear next to buttons showing their keyboard shortcuts. Release Ctrl to hide the hints.

{: .hint}
> **Try it now!** If you're filling out a form, hold down Ctrl to see what shortcuts are available.

### SmarkForm's Unique Hotkey Approach

SmarkForm uses an intelligent, context-aware hotkey system that makes forms intuitive and efficient:

**The same hotkey can be used in different parts of the form.** For example, many forms use **+** to add items and **−** to remove items. If your form has multiple lists (like a list of contacts, each with their own list of phone numbers), the same **+** hotkey can be used for all of them without conflicts.

**SmarkForm automatically picks the right action based on context.** When you press a hotkey, SmarkForm triggers the action that's most relevant to where you're currently focused in the form. If you're focused on a phone number field, **Ctrl+Plus** adds a new phone number. The system always chooses the *nearest* action to your current position.

This context-aware behavior means you can learn just a few simple hotkeys (like **+**, **−**, and **Delete**) and use them throughout the entire form in a natural, intuitive way.

{: .hint}
> **Example:** Imagine filling out a contact list where each contact has their own list of phone numbers. When you're focused on a phone field, **Ctrl+Plus** adds another phone number to that contact. The same hotkey is reused naturally across different contexts!

### Second-Level Hotkeys: Reaching Outer Contexts

Sometimes you need to access an action in an outer context. For instance, while filling in a phone number, you might want to add a new contact (outer context) rather than another phone number (current context).

**To access second-level hotkeys, hold Ctrl+Alt together** (or **Cmd+Alt** on Mac).

This reveals hotkeys from the next level up in the form hierarchy. In our contact list example:
- **Ctrl+Plus** adds a phone number to the current contact (first level)
- **Ctrl+Alt+Plus** adds a new contact to the list (second level)

This two-level system keeps the interface clean while giving you keyboard access to everything.

{: .hint}
> **Try it:** Hold **Ctrl** to see nearby actions, then also hold **Alt** to reveal actions from the outer context. It's more intuitive in practice than in words!

### Common Hotkey Patterns

While the actual hotkeys available depend on how each form is configured, here are some patterns you'll frequently encounter:

- **Plus** (+) — Add a new item to a list
- **Minus** (−) — Remove the current item from a list  
- **Delete** — Clear or delete a value
- **D** — Duplicate an item (when available)

Remember: **hold Ctrl to discover what's available** in any specific form. The hints will show you exactly which shortcuts you can use.

## Working with Lists

Many forms include dynamic lists where you can add, remove, or reorder items.

### Adding and Removing Items

Look for buttons with **plus** (+) or **minus** (−) icons, or use hotkeys if configured:

- **Click the + button** or use its hotkey (often **Ctrl+Plus**) — Add a new item
- **Click the − button** or use its hotkey (often **Ctrl+Minus**) — Remove the current item

{: .hint}
> **Finding hotkeys:** Hold **Ctrl** to see which keyboard shortcuts are available for the specific form you're using. The actual hotkeys depend on how the form was designed.

{: .hint}
> **Empty items:** SmarkForm often creates a new empty item automatically when you start filling in the last one, so you can keep adding data smoothly.

### Reordering Items

Some forms allow you to reorder list items by dragging and dropping:

1. Click and hold on an item (usually by a drag handle or the item itself)
2. Drag it to the new position
3. Release to drop it in place

{: .info}
> **Note:** Not all lists support reordering. This feature is enabled based on the specific use case and requirements of each form.

### Understanding List Limits

Some lists have minimum or maximum limits for a reason:

- **Minimum limit:** At least this many items are required. You won't be able to remove items below this minimum.
- **Maximum limit:** No more items are allowed beyond this number. The "Add" button becomes disabled when the limit is reached.

These limits are intentional constraints based on the form's requirements. When a button is disabled, it means you've reached a limit — you can still modify existing items, but cannot add more or remove required ones.

## Working with Nested Sections

Some forms have sections nested within other sections (like contact details within a contact, or items within an order). From your perspective as a user, these work seamlessly:

- Navigate through them using **Enter/Shift+Enter** just like the rest of the form
- Hotkeys work within their context (see [Discovering and Using Hotkeys](#discovering-and-using-hotkeys) above)
- When you reach the end of a nested section, pressing Enter typically moves you to the next field in the parent section

{: .hint}
> **Pro tip:** You don't need to think about the form's internal structure — just navigate naturally and SmarkForm handles the rest!


## Accessibility Features

SmarkForm is designed with accessibility in mind, though we're continuously working to improve:

- **Full keyboard support:** Everything can be done without a mouse
- **Clear focus indicators:** You can always see where you are in the form
- **Smart tab order:** Disabled elements are automatically excluded from navigation
- **Semantic HTML:** Forms are built with semantic HTML to work with screen readers
- **Visual feedback:** Clear indication when buttons are disabled or actions are unavailable

{: .info}
> **Using assistive technologies?** We're committed to making SmarkForm accessible to everyone. If you encounter any accessibility issues, please [report them]({{ "/community/support" | relative_url }}) so we can continue improving!

## Tips for Efficient Form Filling

Here are some tips to make form filling even faster:

1. **Learn the discovery shortcut** — Hold **Ctrl** to see available hotkeys anytime you're unsure what actions are available

2. **Use Enter to navigate** — It's faster than Tab for moving between fields, and it skips non-field elements

3. **Master a few common hotkeys** — Once you learn hotkeys for common actions (like adding/removing list items), you can use them throughout the form

4. **Try second-level hotkeys** — Hold **Ctrl+Alt** to access outer context actions when working with nested structures

5. **Watch for smart features** — Notice how buttons disable themselves when limits are reached, or how new list items appear automatically

6. **Use the keyboard for everything** — Once you're comfortable with navigation and hotkeys, you can often complete entire forms without touching your mouse

7. **Context-aware shortcuts are a feature** — The same hotkey doing different things in different sections is intentional and makes the interface more intuitive

---

{: .hint}
> 🎯 **Want to see SmarkForm in action?** Check out the [Examples section]({{ "resources/examples" | relative_url }}) to explore interactive demonstrations of all these features.

{: .hint}
> 💻 **Are you a developer?** See the [Showcase section]({{ "/about/showcase" | relative_url }}) for in-depth examples with code, or visit the [Branding page]({{ "/community/branding" | relative_url }}) to learn how to link to this guide from your own forms.

---

*This guide covers the core user-facing features of SmarkForm-powered forms. The specific features available in any given form depend on how the developer has implemented it.*

**Questions or issues?** Visit the [Support page]({{ "/community/support" | relative_url }}) to get help.
