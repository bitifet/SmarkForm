# Documentation Examples — Agent Knowledge

This document describes how the Jekyll documentation example playground works and how to add/update examples. It is intended to help coding agents make correct changes to documentation.

## Architecture Overview

Documentation examples are rendered by two Liquid template files in `docs/_includes/components/`:

- **`sampletabs_tpl.md`**: The main template — renders the tabbed HTML/CSS/JS preview with all controls
- **`sampletabs_ctrl.md`**: The control logic (JS/CSS for tabs, playground buttons, hints)

Example usage in a `.md` doc file:

```liquid
{% capture myHtml %}
<form data-smark='{"name":"myForm"}'>
  <input data-smark type="text" name="name">
</form>
{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="my_example"
    htmlSource=myHtml
    showEditor=true
%}
```

## Include Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `formId` | (required) | Unique ID suffix for this example. Used to generate `myForm-<formId>` element ID. |
| `htmlSource` | `'-'` | HTML source string. Use `null` (literal string `'null'`) to hide the HTML tab. |
| `cssSource` | `'-'` | CSS source string |
| `jsHead` | (generated) | JS initialization code. Defaults to the simple constructor or a `demoValue` constructor. |
| `notes` | `'-'` | Markdown/HTML notes shown below the example |
| `showEditor` | `false` | Whether to show the JSON editor textarea for import/export |
| `selected` | `'preview'` | Which tab is initially active |
| `tests` | `false` | Co-located test code (JavaScript string) |
| `expectedPageErrors` | `0` | Number of JS errors expected during render |
| `demoValue` | `'-'` | JSON string for pre-populating the demo form (docs-only, filtered by collector) |

## `demoValue` Parameter — How It Works

When `demoValue` is provided:

1. **Executed JS** (hidden from user): The simple constructor is used — value is embedded directly in the `demo` subform's `data-smark`:
   ```html
   <div data-smark='{"name":"demo","value":<demoValue>}'>
   ```
   This sets `demo.defaultValue = demoValue`, so the Reset button restores it.

2. **Displayed JS** (shown in JS tab): The constructor shows the value for documentation clarity:
   ```javascript
   const myForm = new SmarkForm(document.getElementById("myForm-example"), {
       value: <demoValue>
   });
   ```

3. **Reset behavior**: The Reset button targets `context:"demo"`, which calls `demo.reset()` → `demo.import(demo.defaultValue)` = the demoValue, without touching the `editor` textarea (which is a sibling, not inside `demo`).

4. **Test isolation**: The collector (`scripts/collect-docs-examples.js`) explicitly filters out `demoValue` via `DOCS_ONLY_PARAMS`. Tests always see an empty form.

### Example

```liquid
{% capture demoValue %}{"name": "Alice Johnson", "email": "alice@example.com"}{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="contact_form"
    htmlSource=myHtml
    showEditor=true
    demoValue=demoValue
%}
```

### When NOT to Add `demoValue`

Do not add `demoValue` to examples that have co-located tests checking initial form state:
- Tests that assert `countItems() == 0` or `readField('/foo') == null` on page load
- Error demonstration examples (`expectedPageErrors=1`)
- Examples where `htmlSource=null` (no HTML tab)
- Examples that already set initial values via inline HTML `data-smark='{"value":...}'`

## Playground Buttons

The standard playground buttons (in order) are:
```
⬇️ Export | ⬆️ Import | ♻️ Reset | ❌ Clear
```

The Reset button targets `context:"demo"` — it resets the demo subform (not the root form). This means it restores the `demoValue` default (if set) without clearing the editor textarea.

Print styles hide all four buttons (`display: none !important`).

## The Demo/Editor Structure

The playground renders a root SmarkForm with two children:
- `demo` — the form container for the example's HTML
- `editor` — the JSON textarea (shown when `showEditor=true`)

```html
<div id="myForm-<formId>">          <!-- root form -->
  <div data-smark='{"name":"demo","value":<demoValue>}'>
    <!-- the example's HTML goes here -->
  </div>
  <textarea data-smark='{"name":"editor"}'></textarea>  <!-- if showEditor=true -->
</div>
```

The Export/Import/Reset/Clear buttons all have `context:"demo"` to target the demo subform only.

## Co-located Tests

Tests are JavaScript strings captured in Liquid and passed via `tests=`:

```liquid
{% capture myTests %}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();
    // ...
};
{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="my_example"
    htmlSource=myHtml
    tests=myTests
%}
```

### Test Helper Functions

| Function | Description |
|----------|-------------|
| `readField('/path')` | Export the field at path (returns its current value) |
| `writeField('/path', value)` | Import value into field at path |
| `page.getByTitle('...')` | Locate button by title attribute |
| `page.getByRole('button', { name: '...' })` | Locate button by text |
| `root` | Playwright locator for the form's root element |

### Important: Tests See Empty Forms

The `demoValue` parameter is filtered by the collector, so co-located tests always render the form with no pre-populated data. Tests should NOT assume data is pre-loaded.

If a test needs non-null values, use `writeField` to set them explicitly:
```javascript
await writeField('/fieldname', 'some value');
```

### `exportEmpties` in Tests

When lists have `exportEmpties:false`, null/empty items are stripped from the exported array:
```javascript
// 3 null intervals in DOM → exported as []
expect(await readField('/myList')).toEqual([]);
```

To test duplication proves data is copied (not reset), write actual values first:
```javascript
await writeField('/items/0/name', 'Test Name');
await page.getByRole('button', { name: '✨' }).click();
expect(await readField('/items/1/name')).toBe('Test Name'); // copied, not null
```

## Collector (`scripts/collect-docs-examples.js`)

The collector scans all `.md` files in `docs/` looking for `include components/sampletabs_tpl.md` calls and extracts parameters into a test manifest (`test/.cache/docs_examples.json`).

### `DOCS_ONLY_PARAMS`

Parameters listed in `DOCS_ONLY_PARAMS` are filtered out and never reach the manifest:
```javascript
const DOCS_ONLY_PARAMS = new Set(["demoValue"]);
```

To add new docs-only parameters (ones that only affect Jekyll rendering, not tests), add them to this set in `scripts/collect-docs-examples.js`.

## Adding Realistic Demo Data

To add pre-populated data to an existing example:

1. Capture the JSON value in Liquid:
   ```liquid
   {% capture demoValue %}{"field1": "value1", "field2": "value2"}{% endcapture %}
   ```

2. Pass it to the include:
   ```liquid
   {% include components/sampletabs_tpl.md
       formId="..."
       demoValue=demoValue
       ...
   %}
   ```

3. The JSON must match the structure expected by the demo form's HTML.

4. For list fields: provide an array, e.g., `[{"name": "Alice"}, {"name": "Bob"}]`

5. For nested forms: match the nesting, e.g.:
   ```json
   {"user": {"name": "Alice", "email": "alice@example.com"}}
   ```

## Updating `sampletabs_tpl.md`

Key sections in the template (approximate line numbers as of PR #70):

- ~Line 47-58: `default_jsHead` / `default_jsHead_display` conditional block — generates the two JS variants based on `demoValue`
- ~Line 64: `jsHead` / `jsHead_display` assignment (with `include.jsHead` override)
- ~Line 97: `default_buttons` capture — the four action buttons
- ~Line 224: `rendered_jsSource` uses `jsHead_display` for the JS tab display
- ~Line 312: Actual form initialization uses `jsHead` (the executed version)
- The `full_htmlSource` variable wraps the example HTML in the `demo` subform div, injecting `demoValue_inner` if set

## Updating Print Styles

In `sampletabs_ctrl.md`, the print style block hides all interactive controls. To hide a new button type, add it to the list:
```css
button[data-smark*='"action":"reset"'] {
  display: none !important;
}
```
