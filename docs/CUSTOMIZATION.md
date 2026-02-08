# Documentation Customizations

This document describes custom CSS and JavaScript implementations for the SmarkForm documentation site, including the auto color scheme and the user guide image system.

## Auto Color Scheme Implementation

This section contains custom CSS and JavaScript to implement automatic color scheme switching for the SmarkForm documentation site.

## Overview

The JustTheDocs theme (version 0.10.1) does not natively support automatic color scheme switching based on user system preferences. This custom implementation adds that functionality using CSS media queries and JavaScript.

## Files

### `/assets/css/auto-color-scheme.css`
Custom CSS that uses `@media (prefers-color-scheme: dark)` and `@media (prefers-color-scheme: light)` media queries to automatically apply the appropriate theme based on the user's system preferences.

**Features:**
- Automatic detection of system color scheme preference
- Dark mode color variables matching JustTheDocs dark theme
- Proper contrast ratios for accessibility
- Styles for all common elements (code blocks, tables, links, buttons, etc.)
- Tab components (code examples) adapt to color scheme

### `/assets/js/auto-logo-switcher.js`
JavaScript that dynamically switches the site logo between light and dark versions based on the user's color scheme preference.

**Features:**
- Detects initial color scheme preference
- Listens for changes in color scheme preference
- Automatically updates logo when preference changes
- Compatible with modern and legacy browsers

### `/_includes/head_custom.html`
Jekyll include file that loads the custom CSS and JavaScript files. This file is automatically included in the page head by JustTheDocs.

## How It Works

1. **CSS Media Queries**: The CSS file uses `prefers-color-scheme` media queries to apply different styles based on the user's system preference.

2. **Logo Switching**: The JavaScript detects the color scheme preference and updates the `.site-logo` element's background image to use either:
   - `/assets/logo/smarkform.svg` (light mode)
   - `/assets/logo/smarkform_dark.svg` (dark mode)

3. **Automatic Updates**: When the user changes their system color scheme preference, both the CSS and JavaScript automatically update to match.

## Color Scheme Variables

### Light Mode (Default)
Uses JustTheDocs default light theme colors.

### Dark Mode
| Variable | Color | Usage |
|----------|-------|-------|
| Background | `#202020` | Main background color |
| Sidebar | `#0d0d0d` | Sidebar background |
| Text | `#e9e9e9` | Body text and headings color |
| Links | `#8c7aff` | Link color (brightened for visibility) |
| Links (visited) | `#a896ff` | Visited link color |
| Nav Links | `#b8b8b8` | Sidebar navigation links |
| Nav Links (child) | `#a8a8a8` | Child navigation links |
| Borders | `#44434d` | Border and separator color |
| Code Blocks | `#2e2e2e` | Code background color |
| Code Containers | `#2e2e2e` | Highlight/figure containers |
| Inline Code | `#2a2a2a` | Inline code background (less bright) |
| Tab Labels | `#2e2e2e` | Tab button background |
| Tab Content | `#202020` | Tab content background |
| Form Inputs | `#3a3a3a` | Input/textarea background (middle gray) |
| Placeholder | `#999` | Input placeholder text color |
| Buttons | `#2a2a2a` | Regular button background (less bright) |
| Tables (header) | `#2e2e2e` | Table header background |
| Tables (striped) | `#252525` | Alternating table row background |
| Aux Nav Links | `#2a2a2a` | Auxiliary navigation button background |

## Testing

To test the implementation:

1. Build and serve the Jekyll site locally:
   ```bash
   npm run servedoc
   ```

2. Open the site in a browser

3. Change your system's color scheme preference:
   - **macOS**: System Preferences → General → Appearance
   - **Windows**: Settings → Personalization → Colors → Choose your color
   - **Linux**: Depends on your desktop environment

4. The site should automatically update to match your preference

## Browser Support

- ✅ Chrome/Edge 76+
- ✅ Firefox 67+
- ✅ Safari 12.1+
- ✅ Opera 62+

Older browsers will default to light mode.

## Maintenance

When updating the JustTheDocs theme:

1. Check if the theme has added native support for `color_scheme: auto`
2. If so, consider migrating to the native implementation
3. If not, verify that the custom CSS variables still match the theme's dark mode
4. Test thoroughly after any theme updates

## Future Improvements

- Consider adding a manual toggle switch for users who want to override their system preference
- Add smooth transitions between color schemes
- Consider implementing other color schemes (high contrast, sepia, etc.)

## Related Configuration

See `_config.yml` for documentation about why we use this custom implementation instead of the native `color_scheme` option.

---

## User Guide Image System

The documentation includes a responsive image system specifically designed for user guide illustrations.

### Overview

This system provides consistent styling for screenshots and illustrations in documentation pages, with responsive behavior across different screen sizes and automatic dark mode support.

### Files

#### `/assets/css/user-guide-images.css`
Custom CSS that provides responsive styling for documentation images with various size options.

**Features:**
- Responsive design for mobile, tablet, and desktop
- Dark mode support with adjusted borders and shadows
- Multiple size variants (default, small, inline, wide)
- Figure and figcaption styling
- Proper spacing and visual polish

#### `/_includes/head_custom.html`
The CSS is loaded via this Jekyll include file, making it available on all documentation pages.

### How to Add Images to Documentation

#### 1. Basic Image with Caption

```html
<figure class="user-guide-image">
  <img src="{{ '/assets/images/user-guide/my-image.png' | relative_url }}" 
       alt="Descriptive alt text explaining what the image shows">
  <figcaption>Optional caption providing context</figcaption>
</figure>
```

#### 2. Size Variants

**Small images** (max 300px on desktop):
```html
<figure class="user-guide-image small">
  <img src="{{ '/assets/images/user-guide/icon.png' | relative_url }}" 
       alt="Small UI element or icon">
  <figcaption>Small demonstration</figcaption>
</figure>
```

**Wide images** (full width):
```html
<figure class="user-guide-image wide">
  <img src="{{ '/assets/images/user-guide/full-layout.png' | relative_url }}" 
       alt="Complete form layout">
  <figcaption>Full-width layout example</figcaption>
</figure>
```

**Inline images** (max 400px, can flow with text):
```html
<figure class="user-guide-image inline">
  <img src="{{ '/assets/images/user-guide/button.png' | relative_url }}" 
       alt="Button example">
</figure>
```

#### 3. Image Guidelines

**Directory Structure:**
- Place images in `/assets/images/[section-name]/`
- Use descriptive filenames: `01-descriptive-name.png`
- Keep images organized by documentation section

**Image Format:**
- Use PNG for screenshots with text and UI elements
- Optimize images before committing (compress without losing clarity)
- Consider 2x resolution for retina displays but keep file size reasonable

**Alt Text Best Practices:**
- Describe what the image shows, not how it looks
- Be specific and descriptive
- Include context relevant to the surrounding text
- Example: "Screenshot showing hotkey hints appearing on buttons when Ctrl key is pressed"

**Visual Guidelines:**
- Capture images in light mode (dark mode styling handled by CSS)
- Ensure high contrast and readability
- Use consistent styling across screenshots
- Keep file sizes under 100KB when possible

### CSS Classes Reference

| Class | Max Width (Desktop) | Use Case |
|-------|---------------------|----------|
| `.user-guide-image` | 800px | Default for most screenshots |
| `.user-guide-image.small` | 300px | Icons, small UI elements |
| `.user-guide-image.inline` | 400px | Inline demonstrations |
| `.user-guide-image.wide` | 100% | Full-width layouts |

### Responsive Behavior

- **Mobile (≤768px)**: Images scale to full width with adjusted padding and smaller captions
- **Tablet (769-1024px)**: Images scale to 90% of container width
- **Desktop (≥1025px)**: Images respect maximum width constraints for optimal readability

### Dark Mode Support

Images automatically adjust for dark mode:
- Border color changes to darker shade
- Box shadow adjusts for better contrast
- Caption text color adapts to theme

### Example: User Guide Images

See `docs/_resources/user_guide.md` for real-world examples of this system in use, including:
- Navigation demonstrations
- Hotkey discovery screenshots
- Context-aware behavior illustrations
- List operation examples

The user guide demonstrates all size variants and proper usage of alt text and captions.
