# Writing Tests

This guide covers:

<!-- vim-markdown-toc GitLab -->

* [1) Co-located tests for documentation examples](#1-co-located-tests-for-documentation-examples)
    * [Disabling custom tests](#disabling-custom-tests)
    * [Expected error counts](#expected-error-counts)
    * [Enforcement](#enforcement)
    * [Other include flags gathered](#other-include-flags-gathered)
    * [Examples](#examples)
* [2) Classic Playwright tests in test/*.tests.js](#2-classic-playwright-tests-in-testtestsjs)
* [3) Running a single docs example test quickly](#3-running-a-single-docs-example-test-quickly)
* [4) Debugging tips](#4-debugging-tips)
* [5) Minimal Playwright cheatsheet](#5-minimal-playwright-cheatsheet)
* [6) Special cases summary](#6-special-cases-summary)

<!-- vim-markdown-toc -->


## 1) Co-located tests for documentation examples

Documentation examples use this include pattern in docs/*.md:
```markdown
{% include components/sampletabs_tpl.md
    formId="my_example"
    htmlSource=my_example_html
    jsSource=my_example_js
    hiddenJsSource=my_example_hidden_js
    cssSource=my_example_css
%}
```

Parameters may differ. Most are optional. Non quoted values are Jekyll
variables defined with `{% capture %}` blocks elsewhere in the file.

You can attach a custom Playwright test to an example by defining a Jekyll
capture with ES module code and then referencing it via tests=:

```markdown
{% capture my_example_tests %}
export default async ({ page, expect, id, root }) => {
  // 'id' is the formId, 'root' locates the form container
  // More helpers are available / can be added in the
  // tests/co_located_tests.tests.js file by modifying the helpers() builder.
  await expect(root).toBeVisible();

  // Your assertions here
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.locator('.item')).toHaveCount(1);
};
{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="my_example"
    htmlSource=my_example_html
    jsSource=my_example_js
    hiddenJsSource=my_example_hidden_js
    cssSource=my_example_css
    tests=my_example_tests
%}
```

Parameters passed to your test function:
- page: Playwright Page
- expect: Playwright assertions
- id: example formId (string)
- root: the locator for #myForm-${id}
- async readField(fldPath): exports specified field and returns its value. Can be the whole form (/) or anything.
- async writeField(fldPath, value): fills the specified field with the given value. Can be the whole form too...
- others...: you can add more helpers in tests/co_located_tests.tests.js by modifying the helpers() builder.

Transformations applied (same as HTML/CSS/JS sources):
- $$ → -${formId} (unique suffix for per-example IDs)
- █ (U+2588) → four spaces (indentation hack used in docs)
  - You won't need to use this in tests, but this means you can share code
    snippets used in visible source of the examples.

### Disabling custom tests

If an example doesn’t need a custom test, explicitly set:
```markdown
tests=false
```

Important behavior:
- tests=false disables only custom test execution; smoke checks still run (page renders, container visible, error counts match).
- To skip an example entirely (e.g., purely illustrative/non-enhanced), set jsSource="-" in the include block.

### Expected error counts

For examples that intentionally log errors (e.g., to demonstrate behavior), set expectations:

```markdown
{% capture error_example_tests %}
export default async ({ page, expect, id, root }) => {
  await expect(root).toBeVisible();
};
{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="error_demo"
    htmlSource=error_html
    jsSource=error_js
    tests=error_example_tests
    expectedConsoleErrors=1
    expectedPageErrors=0
%}
```

The runner will assert the counts of:
- Console errors: expectedConsoleErrors (default 0)
- Page errors: expectedPageErrors (default 0)

### Enforcement

Every example must specify tests=… or tests=false.
- Missing or empty tests will fail fast with a clear error message.
- Use scripts/add-tests-false-to-examples.js to bulk add tests=false to legacy examples.

### Other include flags gathered

The collector records additional flags for completeness (not used by the runner today but maintained for future use):
- showEditor, showEditorSource, addLoadSaveButtons

### Security options — `smarkformOptions`

Some examples use mixin templates with `<script>` or `<style>` siblings, or reference external templates.
Because SmarkForm defaults to a secure-by-default stance (scripts blocked, external fetches blocked), such
examples must **explicitly opt in** to the required permissions via the `smarkformOptions` include parameter.

`smarkformOptions` is a JSON object whose keys are SmarkForm constructor options. The collector stores it in
the manifest as a parsed JSON object. Both the normal smoke test and the demoValue round-trip test merge
these options into the SmarkForm constructor so the example renders correctly:

```markdown
{% include components/sampletabs_tpl.md
    formId="my_mixin_example"
    htmlSource=my_mixin_example_html
    demoValue='{"foo":"bar"}'
    smarkformOptions='{"allowLocalMixinScripts":"allow"}'
    tests=false
%}
```

Supported option keys (all optional):

| Option | Allowed values | Default | Purpose |
|---|---|---|---|
| `allowLocalMixinScripts` | `"block"` / `"noscript"` / `"allow"` / per-origin object | `"block"` | Allow `<script>` in local (`#id`) mixin templates |
| `allowSameOriginMixinScripts` | `"block"` / `"noscript"` / `"allow"` / per-origin object | `"block"` | Allow `<script>` in same-origin external mixin templates |
| `allowCrossOriginMixinScripts` | `"block"` / `"noscript"` / `"allow"` / per-origin object | `"block"` | Allow `<script>` in cross-origin external mixin templates |
| `allowExternalMixins` | `"block"` / `"same-origin"` / `"allow"` / per-origin object | `"block"` | Allow fetching mixin templates from external URLs |

**Per-origin object form** (supported by all four options): instead of a single
string, any option may be a plain object whose keys are origin strings
(e.g. `"https://cdn.example.com"`) and whose values are the allowed string
policy values for that option.  The special `"*"` key is a wildcard fallback.
When neither a matching origin key nor `"*"` is present the option defaults to
`"block"`.  Example:

```json
{
  "allowExternalMixins": {
    "https://trusted-cdn.example.com": "allow",
    "*": "block"
  },
  "allowCrossOriginMixinScripts": {
    "https://trusted-cdn.example.com": "allow",
    "*": "noscript"
  }
}
```

The `smarkformOptions` parameter also updates the `default_jsHead` that the docs template generates for
the iframe preview, so the interactive preview in the documentation also works correctly.

### Docs-only parameters (filtered out by the collector)

Some include parameters exist solely to configure the Jekyll documentation rendering and are explicitly excluded from the test manifest in previous versions. **As of the current implementation, `demoValue` is now collected and used by the smoke tests** — see the demoValue round-trip section below.

No parameters are currently filtered-out entirely. The `demoValue` parameter is collected but handled separately from the main test flow so that existing co-located tests are unaffected (they still start with an empty form).

### demoValue round-trip smoke test

For every example that declares a `demoValue`, the test runner automatically generates an additional **demoValue round-trip** test alongside the regular smoke test. This test:

1. Generates a dedicated HTML page that initialises the form with `{ value: <demoValue> }` as the SmarkForm constructor option.
2. Waits for `myForm.rendered` to resolve (root-level render complete) and then explicitly calls `myForm.import(demoValue)` to handle the asynchronous rendering of deeply nested sub-forms.
3. Exports the fully populated form.
4. Compares the export against the original `demoValue` using `deepFilterFalsy()` — a recursive helper that filters falsy values out of arrays so that `{foo:[null,23,null]}` is treated as equal to `{foo:[23]}`. This accounts for lists that use `exportEmpties:false` stripping empty items.

**Important**: demoValues must use the canonical formats that SmarkForm normalises to on export:
- **Time fields**: use `"HH:MM:SS"` (e.g. `"10:00:00"`), not `"HH:MM"` (`"10:00"`).
- **Number fields**: use plain numbers (e.g. `3`), not numeric strings (`"3"`).

If the demoValue uses a non-canonical format, the round-trip test will fail even if the form works correctly in the browser. The collector will surface this as a clear test failure with a diff.

### Existing co-located tests still see empty forms

The regular test (non-round-trip) is unaffected: it still starts with an empty form. The demoValue round-trip runs as a **separate, additional test** so the two concerns are cleanly separated.

### Examples

See docs/_test_examples.md for live samples:
- tests=false
- tests with behavior
- tests with expected errors

## 2) Classic Playwright tests in test/*.tests.js

Create a new file test/my_feature.tests.js:
```javascript
import { test, expect } from '@playwright/test';

test('my feature works', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000'); // adjust to your dev server if needed
  await expect(page.locator('#some-element')).toBeVisible();
});
```

Naming convention:
- Files end with .tests.js (see playwright.config.js testMatch)
- Use test.describe(...) to group when appropriate

Run:
```bash
npm run test test/my_feature.tests.js
```

## 3) Running a single docs example test quickly

Docs example test titles use the pattern:
```
[<docs_file_name.md>] <formId>
```

So you can filter by formId or by file tag:

```bash
# formId
npm run test -g "test_with_custom_tests"

# file tag (note escaping)
npm run test -g "\\[_test_examples\\.md\\]"
```

Or run the file directly:
```bash
npm run test test/co_located_tests.tests.js
```

## 4) Debugging tips

- Headed mode:
  ```bash
  npm run test --project=chromium --headed
  ```

- Inspector:
  ```bash
  npm run test --debug
  # or
  PWDEBUG=1 npm run test
  ```

- Pause execution inside your co-located test:
  ```js
  await page.pause();
  ```

- Resource constraints:
  - Use a single browser: --project=chromium
  - Reduce workers: --workers=1

## 5) Minimal Playwright cheatsheet

- Selectors: 
  - `page.locator('css')`
  - `page.getByRole('button', { name: 'Save' })`
- Actions:
  - `click()`, `dblclick()`, `fill()`, `press('Enter')`, `selectOption()`, `check()`, `uncheck()`
- Assertions (expect):
  - `toBeVisible()`, `toHaveText()`, `toHaveValue()`, `toHaveCount()`, `toBeChecked()`
- Waiting:
  - `locator.waitFor()`, `page.waitForTimeout(ms)`
- Traces & report:
  - `npm show-report`
  - `npm show-trace path/to/trace.zip`

## 6) Special cases summary

- Skip an example entirely: set `jsSource="-"`
- Disable custom test but keep smoke checks: set `tests=false`
- Intentional errors: set `expectedConsoleErrors` / `expectedPageErrors`
- All examples must declare `tests` (either custom or `false`)



