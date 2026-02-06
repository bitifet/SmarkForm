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
    * [Common Hotkeys](#common-hotkeys)
    * [Context-Aware Behavior](#context-aware-behavior)
* [Working with Lists](#working-with-lists)
    * [Adding and Removing Items](#adding-and-removing-items)
    * [Reordering Items](#reordering-items)
    * [Understanding List Limits](#understanding-list-limits)
* [Working with Subforms](#working-with-subforms)
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
- **Shift+Enter** — Move to the previous field like normal. But you can alternatively use **Ctrl+Shift+Enter** if you feel like it!
- In fact, you can consistently use **Ctrl+Enter** and **Ctrl+Shift+Enter** to navigate forth and back through fields from anywhere, no matter what type of field you're in.

## Discovering and Using Hotkeys

One of SmarkForm's most powerful features is context-aware keyboard shortcuts (hotkeys) that let you perform actions without reaching for your mouse.

### How to Discover Available Shortcuts

To see which keyboard shortcuts are available at any moment:

**Press and hold the Ctrl key** (or **Cmd** on Mac) ⌨️

While holding Ctrl, you'll see visual hints appear next to buttons showing their keyboard shortcuts. Release Ctrl to hide the hints.

{: .hint}
> **Try it now!** If you're filling out a form, hold down Ctrl to see what shortcuts are available.


<!-- 
@copilot:

This need to be elaborated to show smarkform's unique approach to hotkeys:
 
  - Same hotkey can be defined for actions in different places of the form (for instance '+' and '-' are commonly used for adding and removing items in lists and we can have multiple lists either in different places of the form or even nested within each other.
  - When two or more actions share the same hotkey, SmarkForm is smart enough to pick the more appropriate one based on the context (where the focus is). For instance, with nested lists (or forms) the inner ones will be picked first.
  - Using different hotkeys would have been weird since they have the exact same functionality (just in different places).
  - But if, for instance, we are filling a list of phones in a list of contacts and we want to add a new contact; if both lists have the same hotkey for adding items we'll only reach the "add phone" action instead of the "add contact" one...
  - For this scenario, SmarkForm provides a "second level" of hotkeys. That is: If, in addition to the Control key, you also hold the Shift key, SmarkForm will reveal/trigger the "second level" of hotkeys. That is: the "nearest" hotkey beyond the one that would be triggered by just holding Control. So, in the previous example, if we hold Control and Shift together, we'll trigger the "add contact" action instead of the "add phone" one.

This is kind of tough to explain with words, but it's really intuitive in practice.


That's why I need you to understand the concept and improve this documentation
to explain this to the users in a clear and intuitive way.

You can also add playable examples (you can pick or get inspiration from the
examples in the showcase) to make it easier to understand.

NOTE: Those examples are built using the "sampletabs" includes that also whow
the source code and a kind of "playground" editor for import/export of the form
data which is not interesting for a user guide. But we will implement the
ability of hidding them in a future update.

-->



### Common Hotkeys

Here are some frequently used shortcuts you'll encounter:

- **Ctrl+Plus** (+) — Add a new item to a list
- **Ctrl+Minus** (−) — Remove the current item from a list
- **Ctrl+Delete** — Delete or clear a value
- **Ctrl+D** — Duplicate an item (when available)

{: .info}
> **Note:** The exact shortcuts available depend on the form and where your cursor is. Hold Ctrl to see what's currently available!

<!-- 
@copilot:

Actual hotkeys are configured in the markup by the developer/designer of the
form. These are good/common choices but the actual hotkeys may differ from form
to form. The right way to know the available hotkeys is to hold the Control key
and see the hints.

So not sure if this section is really needed. Specially if we mention it in the
(future version of) "How to Discover Available Shortcuts" section. Maybe we can
just give a few examples of common hotkeys there at the same time we explain
how to discover them.

-->

### Context-Aware Behavior

SmarkForm hotkeys are *context-aware*, meaning the same shortcut can do different things depending on where you are in the form:

- If you're in a contact list, **Ctrl+Plus** adds a new contact
- If you're in a task list, **Ctrl+Plus** adds a new task
- Only the action relevant to your current position will trigger

This smart behavior prevents hotkey conflicts and lets forms use simple, memorable shortcuts throughout.


<!-- 
@copilot:

This section may be better removed if we finally already explain this earlier.
Or, if not, it may be reworded to work as a follow-up to the "How to Discover
Available Shortcuts" section.

-->

## Working with Lists

Many forms include dynamic lists where you can add, remove, or reorder items.

### Adding and Removing Items

Look for buttons with **plus** (+) or **minus** (−) icons, or use the hotkeys:

- **Click the + button** or press **Ctrl+Plus** — Add a new item
- **Click the − button** or press **Ctrl+Minus** — Remove the current item

{: .hint}
> **Empty items:** SmarkForm often creates a new empty item automatically when you start filling in the last one, so you can keep adding data smoothly.

<!--
@copilot:

Not bad but, again, we must keep in mind that the actual hotkeys may differ
from form to form.

-->

### Reordering Items

If the form supports it, you can reorder list items by dragging and dropping:

1. Click and hold on an item (usually by a drag handle or the item itself)
2. Drag it to the new position
3. Release to drop it in place

<!--
@copilot:

The form (being a SmarkForm instance) does support it. But it can allow or
disallow it depending on the use case. So maybe we should reword this to make
it clear that this is not always available.

-->

### Understanding List Limits

Some lists have minimum or maximum limits:

- **Minimum limit:** You won't be able to remove items below the minimum number required
- **Maximum limit:** The "Add" button will become disabled when the maximum is reached

When a button is disabled, it means the limit has been reached. You'll need to remove an item before you can add more.

<!--
@copilot:

The thing here is not "how to re-enable" the button.  The thing is that
more/less items are intentionally not allowed. The user can modify existing
items but not add more. In case of removal, this means that at least one (or
the minimum limit) item(s) are required.
-->

## Working with Subforms

Some forms contain nested sections called *subforms* — forms within forms. These might represent complex data like:

- Contact information within an address entry
- Product details within an order
- Project tasks within a project

Subforms work just like regular forms:

- Navigate through them using **Enter/Shift+Enter**
- Use hotkeys within their context
- Each subform maintains its own set of fields and actions

{: .hint}
> **Navigation tip:** When you reach the end of a subform, pressing Enter will typically move you to the next field in the parent form.


<!--
@copilot:

Not sure if this is relevant to the user. With the lists they see elements that
can be added or removed. But with forms this is more an implementation detail
than a real differnce.

-->


## Accessibility Features

SmarkForm is designed with accessibility in mind:

- **Full keyboard support:** Everything can be done without a mouse
- **Clear focus indicators:** You can always see where you are in the form
- **Smart tab order:** Disabled elements are automatically excluded from navigation
- **Semantic HTML:** Screen readers work naturally with SmarkForm forms
- **Visual feedback:** Clear indication when buttons are disabled or actions are unavailable

{: .info}
> ℹ️ **Using a screen reader?** SmarkForm forms are built with semantic HTML and ARIA attributes to ensure compatibility with assistive technologies.

<!--
@copilot:

This is the intention, but there is still work to be done in this area. The wording should reflect this.
Also it could be a good chance to invite users to report any accessibility issues they encounter so we can keep improving in this area.
-->

## Tips for Efficient Form Filling

Here are some tips to make form filling even faster:

1. **Learn a few hotkeys** — Even knowing just Ctrl+Plus and Ctrl+Minus for lists can save significant time

2. **Use Enter to navigate** — It's faster than Tab for moving between fields

3. **Hold Ctrl to explore** — When you encounter a new form, hold Ctrl to discover available shortcuts

4. **Watch for smart features** — Notice how buttons disable themselves when limits are reached, or how new list items appear automatically

5. **Use the keyboard for everything** — Once you're comfortable with navigation and hotkeys, you can often complete entire forms without touching your mouse

6. **Multiline fields** — Remember Ctrl+Enter for new lines in text areas

7. **Context matters** — The same hotkey might do different things in different sections — this is a feature, not a bug!

---

{: .hint}
> 🎯 **Want to see SmarkForm in action?** Check out the [Examples section]({{ "resources/examples" | relative_url }}) to explore interactive demonstrations of all these features.

{: .hint}
> 💻 **Are you a developer?** See the [Showcase section]({{ "/about/showcase" | relative_url }}) for in-depth examples with code, or visit the [Branding page]({{ "/community/branding" | relative_url }}) to learn how to link to this guide from your own forms.

---

*This guide covers the core user-facing features of SmarkForm-powered forms. The specific features available in any given form depend on how the developer has implemented it.*

**Questions or issues?** Visit the [Support page]({{ "/community/support" | relative_url }}) to get help.
