# Auto Color Scheme Implementation

This directory contains custom CSS and JavaScript to implement automatic color scheme switching for the SmarkForm documentation site.

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
| Links | `#7253ed` | Link color |
| Borders | `#44434d` | Border and separator color |
| Code Blocks | `#2e2e2e` | Code background color |
| Code Containers | `#2e2e2e` | Highlight/figure containers |
| Tab Labels | `#2e2e2e` | Tab button background |
| Tab Content | `#202020` | Tab content background |
| Form Inputs | `#3a3a3a` | Input/textarea background (middle gray) |
| Placeholder | `#999` | Input placeholder text color |

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
