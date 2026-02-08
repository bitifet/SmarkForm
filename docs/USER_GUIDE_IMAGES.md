# User Guide Images - Capture Plan

This document lists all the illustrations needed for the User Guide, organized by section.

## Image Placeholders Added

All images currently point to `/assets/logo/smarkform.svg` as a placeholder. Replace these with actual screenshots following the specifications below.

### 1. Navigation - Enter Key Navigation
**Location:** Navigating Between Fields section  
**Alt text:** `Demonstration of Enter key navigation jumping between form fields, skipping buttons`  
**Caption:** Using Enter to navigate between fields (skips buttons and other non-field elements)  
**What to capture:**
- Show a form with multiple fields and some buttons between them
- Highlight the focused field
- Show arrows or annotations indicating Enter key moves to next field, skipping buttons
- Show the progression: Field 1 → [Button] → Field 2 (button is skipped)

**Suggested size:** Regular (max 800px wide on desktop)

---

### 2. Hotkeys - Discovery with Ctrl
**Location:** How to Discover Available Shortcuts section  
**Alt text:** `Screenshot showing hotkey hints appearing on buttons when Ctrl key is pressed`  
**Caption:** Holding Ctrl reveals hotkey hints next to action buttons  
**What to capture:**
- Show a form with several action buttons
- Display hotkey hints visible on the buttons (e.g., "+", "-", "Del")
- Annotate or show "Ctrl key held down" indicator
- Make it clear these hints appear dynamically when Ctrl is pressed

**Suggested size:** Regular (max 800px wide on desktop)

---

### 3. Hotkeys - Context-Aware Behavior
**Location:** SmarkForm's Unique Hotkey Approach section  
**Alt text:** `Example form showing a contact list where each contact has a phone number list, demonstrating context-aware hotkey behavior`  
**Caption:** Example: Same + hotkey works in different contexts (adding contacts vs adding phone numbers)  
**What to capture:**
- Show a nested list structure (contacts with phone numbers)
- Highlight two "+" buttons with the same hotkey
- Show focus in one context (e.g., phone number field)
- Annotate which "+" button would be triggered based on current focus
- Make it clear the same hotkey serves different purposes in different contexts

**Suggested size:** Regular (max 800px wide on desktop)

---

### 4. Hotkeys - Second Level (Ctrl+Alt)
**Location:** Second-Level Hotkeys section  
**Alt text:** `Side-by-side comparison showing Ctrl revealing first-level hotkeys (phone numbers) and Ctrl+Alt revealing second-level hotkeys (contacts)`  
**Caption:** First level (Ctrl): hotkeys for current context; Second level (Ctrl+Alt): hotkeys for outer context  
**What to capture:**
- Create a side-by-side or before/after comparison
- Left/Before: Show form with Ctrl pressed - inner context hotkeys visible (phone list +/-)
- Right/After: Show same form with Ctrl+Alt pressed - outer context hotkeys visible (contact list +/-)
- Use clear labels: "First Level (Ctrl)" and "Second Level (Ctrl+Alt)"
- Use the nested contact/phone example for consistency

**Suggested size:** Regular or Wide (may need more width for side-by-side)

---

### 5. Lists - Adding and Removing Items
**Location:** Adding and Removing Items section  
**Alt text:** `Dynamic list showing add and remove buttons with their associated hotkey hints`  
**Caption:** Adding and removing items from a list using buttons or hotkeys  
**What to capture:**
- Show a list with multiple items
- Show + and - buttons clearly visible
- Display hotkey hints (when Ctrl is held)
- Optionally show one item being added or removed (before/after or in action)
- Make buttons prominent and easy to identify

**Suggested size:** Regular (max 800px wide on desktop)

---

### 6. Lists - Reordering with Drag and Drop
**Location:** Reordering Items section  
**Alt text:** `List items being reordered through drag-and-drop interaction`  
**Caption:** Drag and drop to reorder list items  
**What to capture:**
- Show a list with drag handles or cursor grabbing an item
- Show an item being moved (semi-transparent or with visual indicator)
- Show the new position where it will be dropped
- Include visual cues like drag handle icons or cursor change
- Consider showing before/after states

**Suggested size:** Regular (max 800px wide on desktop)

---

### 7. Lists - Disabled Button at Limit
**Location:** Understanding List Limits section  
**Alt text:** `Add button shown as disabled when maximum list limit is reached`  
**Caption:** Button becomes disabled when list limit is reached  
**What to capture:**
- Show a list that has reached its maximum (or minimum for remove button)
- Show the disabled button with clear visual indication (grayed out)
- Optionally show a tooltip or message indicating why it's disabled
- Keep it simple and focused on the disabled button state

**Suggested size:** Small (max 300px wide on desktop)

---

## Image Directory Structure

Recommended path for user guide images:
```
docs/assets/images/user-guide/
├── 01-navigation-enter-key.png
├── 02-hotkeys-discovery.png
├── 03-hotkeys-context-aware.png
├── 04-hotkeys-second-level.png
├── 05-lists-add-remove.png
├── 06-lists-reorder.png
└── 07-lists-disabled-button.png
```

## Update Instructions

After capturing the images:

1. Save images to `docs/assets/images/user-guide/` directory
2. Use descriptive filenames as suggested above
3. Update `docs/_resources/user_guide.md` and replace:
   ```
   {{ '/assets/logo/smarkform.svg' | relative_url }}
   ```
   with:
   ```
   {{ '/assets/images/user-guide/XX-descriptive-name.png' | relative_url }}
   ```

4. Image format recommendations:
   - Use PNG for screenshots with text and UI elements
   - Use JPEG for photographic content (not applicable here)
   - Consider WebP for better compression (modern browsers)
   - Optimize images before committing (reduce file size without losing clarity)

## CSS Classes Available

The following CSS classes are available for customizing image display:

- `.user-guide-image` - Default container (max 800px on desktop)
- `.user-guide-image.small` - Smaller images (max 300px on desktop)
- `.user-guide-image.wide` - Full width images
- `.user-guide-image.inline` - Inline images (max 400px)

All images are responsive and will scale appropriately on mobile devices.

## Notes

- All images should be captured in light mode (dark mode adjustments handled by CSS)
- Ensure high contrast and readability
- Use consistent styling across all screenshots
- Keep file sizes reasonable (compress images)
- Consider 2x resolution for retina displays but optimize file size
