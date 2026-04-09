# Documentation Examples — Agent Knowledge

This document describes how the Jekyll documentation example playground works and how to add/update examples. It is intended to help coding agents make correct changes to documentation.

## Two Kinds of Examples

There are **two distinct kinds** of examples in this project. They serve different purposes and use different mechanisms.

### 1. Standalone Complete Examples (`src/examples/*.pug`)

These are full-page forms built as Pug templates and compiled by Rollup to `dist/examples/*.html`. They are displayed in the **`/resources/examples`** page via an `<iframe>` switcher.

**How to add a new standalone example:**

1. Create `src/examples/<name>.pug` extending `include/layout.pug` and setting `title`/`description` in `block append properties`, then provide form markup in `block mainForm`. Follow the conventions of `company.pug`, `beach.pug`, etc.

2. Import the new file in `src/examples/index.js` so Rollup compiles it:
   ```js
   import "./my-new-example.pug";
   ```

3. **⚠️ IMPORTANT — Register in `docs/_data/examples.csv`:**  
   Add a row to `docs/_data/examples.csv` so the example appears in the dropdown on the `/resources/examples` page. Without this step the HTML file is built but never shown in the documentation.
   ```csv
   "/dist/examples/my-new-example.html","My Example Title","A short description"
   ```
   The CSV columns are `url`, `title`, `details` (first row in the file is the header).

**File: `docs/_data/examples.csv`** is consumed by Jekyll in `docs/_resources/examples.md` via `{% for item in site.data.examples %}`. Every row becomes an `<option>` in the example selector dropdown.

### 2. Inline Jekyll Playground Examples (co-located in `.md` docs)

These are embedded directly inside Markdown documentation pages using the `sampletabs_tpl.md` Liquid include. They render a tabbed preview+editor widget right inside the doc page.

---

## Architecture Overview (Inline Playground)

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
| `htmlSource` | `'-'` | HTML source string. Pass an undefined variable to show a "Missing Example" placeholder (used to plan future examples). |
| `cssSource` | `'-'` | CSS source string |
| `jsHead` | (generated) | JS initialization code. Defaults to the simple constructor or a `demoValue` constructor. |
| `notes` | `'-'` | Markdown/HTML notes shown below the example |
| `showEditor` | `false` | Whether to show the JSON editor textarea for import/export |
| `selected` | `'preview'` | Which tab is initially active |
| `tests` | `false` | Co-located test code (JavaScript string) |
| `expectedPageErrors` | `0` | Number of JS errors expected during render |
| `demoValue` | `'-'` | JSON string for pre-populating the demo form (docs-only, filtered by collector) |
| `smarkformOptions` | `'-'` | JSON object string with root-level SmarkForm constructor options (e.g. `'{"allowLocalMixinScripts":"allow"}'`). Merged into the generated `default_jsHead` constructor call and stored in the test manifest so the test harness also uses them. Required for examples that use mixin `<script>` tags or other features that are disabled by default as a security measure. |

## `demoValue` Parameter — How It Works

When `demoValue` is provided:

1. **Executed JS** (hidden from user): The simple constructor is used — value is **not** embedded in HTML:
   ```html
   <div data-smark='{"name":"demo"}'>
   ```

2. **Displayed JS** (shown in JS tab): The constructor shows the value for documentation clarity:
   ```javascript
   const myForm = new SmarkForm(document.getElementById("myForm-example"), {
       value: <demoValue>
   });
   ```
   When the editor is shown (`showEditor=true`), it is wrapped in the `demo` key:
   ```javascript
   const myForm = new SmarkForm(document.getElementById("myForm-example"), {
       value: {"demo": <demoValue>}
   });
   ```

3. **Reset behavior**: The Reset button has no `context` — it resets the **root** form. The root was initialized with `value: {"demo": demoValue}`, so `root.defaultValue = {"demo": demoValue, "editor": ""}`. Reset restores the demo values and clears the editor textarea. Note: `setDefault` propagation does NOT flow to children, so `demo.defaultValue` itself stays `{}`; only the root knows the correct default.

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

### When to Skip `demoValue`

`demoValue` is safe to use alongside co-located tests — the collector filters it out so the test form always starts empty regardless of the parameter. There are only a few situations where `demoValue` should be skipped:

- **Error demonstration examples** (`expectedPageErrors=1`): Adding a `demoValue` is pointless unless the error itself could be triggered by the default value.
- **Undefined `htmlSource` (placeholder examples)**: When `htmlSource` is an undefined variable, the template renders a "Missing Example" placeholder; there's nothing to pre-populate.
- **Inline value already set**: Examples that already set initial values via an inline HTML `value` attribute or `data-smark='{"value":...}'` (e.g., `clear_reset_form`). Don't add `demoValue` on top of an existing inline value to avoid confusion.

### Tip: Harvesting Realistic Demo Data

The easiest way to produce a correct `demoValue` JSON for an existing example:
1. Open the documentation page in a browser (use `npm run servedoc`)
2. Fill in realistic data directly in the **Preview** tab
3. Click the **⬇️ Export** button
4. Copy the JSON from the editor textarea
5. Paste as the `demoValue` capture in Liquid, tweaking as needed

This ensures the JSON structure exactly matches what the form expects. One common tweak: if a list uses `exportEmpties:false`, the exported JSON will omit empty items — but if you want Reset to restore a list with one empty item, provide `[{}]` in `demoValue` for that list.

## Playground Buttons

The standard playground buttons (in order) are:
```
⬇️ Export | ⬆️ Import | ♻️ Reset | ❌ Clear
```

The Reset button has **no context** — it targets the root form (not just `demo`). This means it restores `demoValue` AND clears the editor textarea (both are children of the root). The root form's `defaultValue` is set via `value: {"demo": demoValue}` in the JS constructor.

Print styles hide all four buttons (`display: none !important`).

## The Demo/Editor Structure

The playground renders a root SmarkForm with two children:
- `demo` — the form container for the example's HTML
- `editor` — the JSON textarea (shown when `showEditor=true`)

```html
<div id="myForm-<formId>">          <!-- root form (defaultValue includes demoValue) -->
  <div data-smark='{"name":"demo"}'>
    <!-- the example's HTML goes here -->
  </div>
  <textarea data-smark='{"name":"editor"}'></textarea>  <!-- if showEditor=true -->
</div>
```

The ⬇️ Export and ⬆️ Import buttons target `context:"demo"` to operate on the demo subform only. The ♻️ Reset button has no context and targets the root form. The ❌ Clear button targets `context:"demo"` to clear the demo subform only.

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

### Important: Tests See Empty Forms (co-located tests)

The regular co-located test still starts with an **empty form**, regardless of `demoValue`. Tests should NOT assume data is pre-loaded.

A separate **demoValue round-trip** test (auto-generated) initialises the form with the demoValue and verifies the export matches. This is a different test with a different purpose.

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

Previously, the `demoValue` parameter was listed in `DOCS_ONLY_PARAMS` and filtered out before building the manifest. **This has changed**: `demoValue` is now collected and stored in the manifest, and a dedicated demoValue round-trip smoke test is generated for every example that declares one.

There are currently no parameters in `DOCS_ONLY_PARAMS`.

### `smarkformOptions` — security and behaviour options

SmarkForm applies a **secure-by-default** policy for features that carry a security risk.
Examples that need these features must explicitly opt in via `smarkformOptions`:

```liquid
{% include components/sampletabs_tpl.md
    formId="my_mixin_example"
    htmlSource=my_mixin_example_html
    smarkformOptions='{"allowLocalMixinScripts":"allow"}'
    tests=my_mixin_example_tests
%}
```

The `smarkformOptions` JSON is:
- Merged into the generated `default_jsHead` constructor call in the iframe preview.
- Stored in the test manifest and injected into the test harness for both smoke tests and demoValue round-trips.

**Commonly needed options:**

| Option | Values | Default | When needed |
|--------|--------|---------|-------------|
| `allowLocalMixinScripts` | `"block"` / `"noscript"` / `"allow"` | `"block"` | Examples using `<script>` inside a local (`#id`) mixin template |
| `allowSameOriginMixinScripts` | `"block"` / `"noscript"` / `"allow"` | `"block"` | Examples using `<script>` inside a same-origin external mixin template |
| `allowCrossOriginMixinScripts` | `"block"` / `"noscript"` / `"allow"` | `"block"` | Examples using `<script>` inside a cross-origin mixin template |
| `allowExternalMixins` | `"block"` / `"same-origin"` / `"allow"` | `"block"` | Examples using mixin type references with an external URL |
| `enableJsonEncoding` | `true` / `false` | `false` | Examples using `enctype="application/json"` form submission |

**Important:** `smarkformOptions` only works with the auto-generated `default_jsHead`. If you
provide a custom `jsHead`, you must incorporate the security options into it manually.

### demoValue in the manifest

The manifest now includes a `demoValue` field (string, or `null`) for each example. The collector processes captures and includes in **document order**, so each include sees only the captures defined before it in the file. This correctly handles files like `showcase.md` where the capture variable is redefined multiple times.

When writing a `demoValue`, use canonical data formats:
- **Time fields**: `"HH:MM:SS"` (e.g. `"14:30:00"`) — SmarkForm normalises shorter strings to include seconds on export.
- **Number fields**: plain numbers (e.g. `3`, not `"3"`) — `type="number"` inputs export numbers, not strings.

### demoValue round-trip smoke test

For every example with a `demoValue`, the test runner automatically generates a `(demoValue round-trip)` test that:

1. Creates a test page initialising the form with `{ value: <demoValue> }` as the SmarkForm constructor option.
2. Waits for `myForm.rendered` then re-imports demoValue to ensure nested sub-forms receive the value.
3. Exports and compares using `deepFilterFalsy()` which filters falsy items out of arrays (to handle `exportEmpties:false`).

Existing co-located tests are unaffected — they still start with an empty form.

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
