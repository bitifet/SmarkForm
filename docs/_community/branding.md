---
title: Branding
layout: chapter
permalink: /community/branding
nav_order: 5
---

{% include links.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Why Link to the User Guide](#why-link-to-the-user-guide)
* [Logo Assets](#logo-assets)
    * [Available Variations](#available-variations)
    * [When to Use Which Variant](#when-to-use-which-variant)
* [Badge Implementation Examples](#badge-implementation-examples)
    * [Compact Badge (Recommended for Forms)](#compact-badge-recommended-for-forms)
    * [Full Logo (For Documentation/About Pages)](#full-logo-for-documentationabout-pages)
    * [Responsive Implementation](#responsive-implementation)
    * [Dark Mode Support](#dark-mode-support)
* [Best Practices](#best-practices)
    * [Where to Place Badges](#where-to-place-badges)
    * [Accessibility Considerations](#accessibility-considerations)
    * [Mobile-Friendly Implementation](#mobile-friendly-implementation)
* [Branding Guidelines](#branding-guidelines)
    * [Respecting the Brand](#respecting-the-brand)
    * [Required Attribution Format](#required-attribution-format)
* [Logo Philosophy](#logo-philosophy)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

## Why Link to the User Guide

By linking to the SmarkForm [User Guide]({{ "/resources/user_guide" | relative_url }}), you provide several benefits to your users:

**Better User Experience Through Education:**
- Users discover powerful keyboard shortcuts that speed up form filling
- Clear documentation reduces confusion and support requests
- Users feel more confident and efficient using your forms

**Consistent Experience Across Forms:**
- Users who learn SmarkForm features once can apply them to all SmarkForm-powered forms
- Building a common vocabulary and expectations across applications
- Reduced learning curve for users encountering multiple SmarkForm implementations

**Brand Recognition and Trust:**
- The SmarkForm badge signals a commitment to user experience
- Shows that your application uses modern, well-documented technology
- Connects users to a broader ecosystem of high-quality forms

{: .hint}
> 💡 **Quick win:** Adding a simple badge with a link takes just a few minutes but can significantly improve your users' experience!

## Logo Assets

All SmarkForm logo assets are available in the repository under `docs/assets/logo/` and can be accessed via the jsDelivr CDN for production use.

### Available Variations

SmarkForm provides several logo variations to suit different contexts:

**Full Logos:**
- `smarkform.svg` — Full logo, optimized for light backgrounds
- `smarkform_dark.svg` — Full logo, optimized for dark backgrounds
- `smarkform_mono.svg` — Monochrome version for light backgrounds
- `smarkform_mono_dark.svg` — Monochrome version for dark backgrounds

**Compact Logos:**
- `smarkform_compact.svg` — Compact version for light backgrounds (recommended for badges)
- `smarkform_dark_compact.svg` — Compact version for dark backgrounds
- `smarkform_mono_compact.svg` — Monochrome compact for light backgrounds
- `smarkform_mono_dark_compact.svg` — Monochrome compact for dark backgrounds

{: .info}
> ℹ️ **CDN Access:** All logos are available via jsDelivr CDN at:
> `https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@latest/docs/assets/logo/[filename]`

### When to Use Which Variant

- **Compact logos** — Best for form footers, badges, and small spaces where you want to acknowledge SmarkForm without taking up much room
- **Full logos** — Better for documentation pages, about sections, or larger promotional areas
- **Monochrome versions** — Use when you need the logo to match your site's color scheme or when printing in black and white
- **Dark/Light variants** — Choose based on your background color to ensure proper contrast

## Badge Implementation Examples

Here are copy-paste ready code snippets for implementing SmarkForm badges in your forms and documentation.

### Compact Badge (Recommended for Forms)

The compact badge is perfect for form footers and provides a clean, unobtrusive link to the user guide:

```html
<a href="https://smarkform.bitifet.net/resources/user_guide" 
   title="Learn about SmarkForm-powered forms"
   target="_blank"
   rel="noopener noreferrer">
  <img src="https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@latest/docs/assets/logo/smarkform_compact.svg" 
       alt="Powered by SmarkForm" 
       height="24">
</a>
```

**Result:** A 24px high badge that links to the user guide.

{: .hint}
> 💡 **Styling tip:** Adjust the `height` attribute (e.g., `height="20"` or `height="32"`) to match your design needs.

### Full Logo (For Documentation/About Pages)

For documentation pages or "About" sections where you have more space:

```html
<a href="https://smarkform.bitifet.net" 
   title="Visit SmarkForm Documentation"
   target="_blank"
   rel="noopener noreferrer">
  <img src="https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@latest/docs/assets/logo/smarkform.svg" 
       alt="SmarkForm - Powerful while effortless forms" 
       height="48">
</a>
```

### Responsive Implementation

For a badge that scales appropriately on different screen sizes:

```html
<style>
  .smarkform-badge {
    display: inline-block;
    margin: 1rem 0;
    transition: opacity 0.2s;
  }
  .smarkform-badge:hover {
    opacity: 0.8;
  }
  .smarkform-badge img {
    height: 24px;
    width: auto;
  }
  @media (max-width: 768px) {
    .smarkform-badge img {
      height: 20px;
    }
  }
</style>

<a href="https://smarkform.bitifet.net/resources/user_guide" 
   class="smarkform-badge"
   title="Learn about SmarkForm-powered forms"
   target="_blank"
   rel="noopener noreferrer">
  <img src="https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@latest/docs/assets/logo/smarkform_compact.svg" 
       alt="Powered by SmarkForm">
</a>
```

### Dark Mode Support

For sites with dark mode support, use CSS to switch between light and dark logos:

```html
<style>
  .smarkform-badge-light {
    display: inline-block;
  }
  .smarkform-badge-dark {
    display: none;
  }
  
  @media (prefers-color-scheme: dark) {
    .smarkform-badge-light {
      display: none;
    }
    .smarkform-badge-dark {
      display: inline-block;
    }
  }
</style>

<a href="https://smarkform.bitifet.net/resources/user_guide" 
   title="Learn about SmarkForm-powered forms"
   target="_blank"
   rel="noopener noreferrer">
  <img src="https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@latest/docs/assets/logo/smarkform_compact.svg" 
       alt="Powered by SmarkForm" 
       class="smarkform-badge-light"
       height="24">
  <img src="https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@latest/docs/assets/logo/smarkform_dark_compact.svg" 
       alt="Powered by SmarkForm" 
       class="smarkform-badge-dark"
       height="24">
</a>
```

## Best Practices

### Where to Place Badges

**Recommended placements:**

1. **Form footer** — The most common and unobtrusive location
   ```html
   <footer class="form-footer">
     <p>
       This form is powered by 
       <a href="https://smarkform.bitifet.net/resources/user_guide">
         <img src="https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@latest/docs/assets/logo/smarkform_compact.svg" 
              alt="SmarkForm" 
              height="16" 
              style="vertical-align: middle;">
       </a>
     </p>
   </footer>
   ```

2. **Near the submit button** — Helps users discover features before submission
3. **Help/information section** — Group with other help resources
4. **About page** — Use the full logo in your application's about section

**Avoid:**
- Placing badges in the middle of the form (distracting)
- Using logos that are too large and dominate the interface
- Hiding badges in footer text where users won't see them

### Accessibility Considerations

When implementing badges, ensure they're accessible:

```html
<!-- Good: Descriptive alt text and title -->
<a href="https://smarkform.bitifet.net/resources/user_guide" 
   title="Learn about SmarkForm features and keyboard shortcuts"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="Learn about SmarkForm-powered forms (opens in new window)">
  <img src="https://cdn.jsdelivr.net/gh/bitifet/SmarkForm@latest/docs/assets/logo/smarkform_compact.svg" 
       alt="Powered by SmarkForm">
</a>
```

**Key points:**
- Provide meaningful `alt` text for screen readers
- Use descriptive `title` attributes for hover information
- Include `aria-label` when the context isn't clear
- Use `rel="noopener noreferrer"` for security when opening in new tabs

### Mobile-Friendly Implementation

Ensure badges work well on mobile devices:

- Use relative sizing (percentages or viewport units) when appropriate
- Ensure badges remain clickable (minimum 44x44px touch target recommended)
- Consider reducing size on smaller screens to save space
- Test on actual devices to verify visibility and usability

```css
.smarkform-badge {
  display: inline-block;
  padding: 0.5rem; /* Increases touch target */
  margin: -0.5rem; /* Compensates for padding */
}

.smarkform-badge img {
  height: 24px;
  width: auto;
}

@media (max-width: 480px) {
  .smarkform-badge img {
    height: 20px;
  }
}
```

## Branding Guidelines

### Respecting the Brand

When using SmarkForm logos and badges:

**Do:**
- ✅ Use the official logo files provided
- ✅ Link to the SmarkForm website or user guide
- ✅ Maintain the logo's aspect ratio
- ✅ Ensure adequate contrast with the background
- ✅ Use the appropriate variant (light/dark) for your background

**Don't:**
- ❌ Modify the logo colors, proportions, or design
- ❌ Use outdated or unofficial logo versions
- ❌ Rotate, skew, or distort the logo
- ❌ Add effects (shadows, glows, etc.) that obscure the logo
- ❌ Use the logo as part of your own branding or product name

{: .warning}
> ⚠️ The SmarkForm name and logo are the property of their respective owners. Use them respectfully and in accordance with these guidelines.

### Required Attribution Format

When using SmarkForm in your project, we appreciate attribution. Here are the recommended formats:

**Minimal (badge only):**
- A visible badge linking to `https://smarkform.bitifet.net/resources/user_guide`

**Standard (badge + text):**
```html
<p>
  This form is powered by 
  <a href="https://smarkform.bitifet.net">SmarkForm</a>.
  <a href="https://smarkform.bitifet.net/resources/user_guide">
    Learn about the features →
  </a>
</p>
```

**Extended (documentation):**
```markdown
## Form Technology

This application uses [SmarkForm](https://smarkform.bitifet.net), 
a powerful form library that provides enhanced keyboard navigation, 
context-aware hotkeys, and dynamic form features. 

Learn more about [using SmarkForm-powered forms](https://smarkform.bitifet.net/resources/user_guide).
```

{: .hint}
> 💡 **Not required but appreciated:** While attribution isn't legally required by the license, it helps users discover SmarkForm's features and supports the project's growth!

## Logo Philosophy

The SmarkForm logo is designed to be clean, modern, and memorable. It uses a parametric design approach that allows for consistent variations across different contexts.

{: .info}
> ℹ️ **Interested in the design process?** Read about the logo's creation and philosophy in the article: [Generating a Parametric SVG Logo with Pug](https://dev.to/bitifet/generating-a-parametric-svg-logo-with-pug-8m0)

The parametric design ensures:
- **Consistency** across all variations (full, compact, mono)
- **Scalability** from tiny badges to large banners
- **Flexibility** for light and dark backgrounds
- **Professional appearance** that reflects the quality of the library

---

{: .hint}
> 🎯 **Ready to add a badge to your form?** Copy one of the examples above and paste it into your HTML!

{: .hint}
> 💻 **Want to see examples in action?** Check out the [Examples section]({{ "resources/examples" | relative_url }}) to see how other developers have implemented SmarkForm badges.

---

**Questions about branding or logo usage?** Contact us at [smarkform@bitifet.net](mailto:smarkform@bitifet.net) or open a discussion at [GitHub Discussions](https://github.com/bitifet/SmarkForm/discussions).
