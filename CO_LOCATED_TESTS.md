# Co-Located Custom Tests for Documentation Examples

## Overview

The documentation examples test pipeline now supports co-located custom tests that can be defined directly in documentation markdown files alongside the examples they test.

## Features

### 1. Custom Test Definitions

You can define custom Playwright tests for your examples by:

1. Creating a Jekyll capture block with your test code:

```markdown
{% capture my_example_tests %}
export default async ({ page, expect, id, helpers }) => {
  const root = helpers.root(page, id);
  await expect(root).toBeVisible();
  
  // Your custom test assertions here
  const button = page.getByRole('button', { name: 'Add' });
  await button.click();
  
  // Assert expected behavior
  await expect(page.locator('.item')).toHaveCount(1);
};
{% endcapture %}
```

2. Referencing it in your include block:

```markdown
{% include components/sampletabs_tpl.md
    formId="my_example"
    htmlSource=my_example_html
    tests=my_example_tests
%}
```

### 2. Test Function Parameters

Your test function receives the following parameters:

- `page`: Playwright Page object for interacting with the test page
- `expect`: Playwright expect function for assertions
- `id`: The formId of the example (e.g., "simple_list")
- `helpers`: Object with utility functions:
  - `helpers.root(page, id)`: Returns a Playwright locator for the form root element (`#myForm-${id}`)

### 3. Transformations

The same transformations applied to other sources also apply to tests:

- `█` (filled square) → 4 spaces (indentation hack)
- `$$` → `-${formId}` (unique ID suffix for the example)

### 4. Disabling Tests

To explicitly disable tests for an example (e.g., for simple demonstrations), use:

```markdown
{% include components/sampletabs_tpl.md
    formId="my_example"
    htmlSource=my_example_html
    tests=false
%}
```

### 5. Expected Error Counts

For examples that intentionally demonstrate error handling, you can specify expected error counts:

```markdown
{% include components/sampletabs_tpl.md
    formId="error_example"
    htmlSource=error_example_html
    tests=error_example_tests
    expectedConsoleErrors=1
    expectedPageErrors=0
%}
```

This tells the test runner that 1 console error is expected and should not fail the test.

## Requirements

⚠️ **Important**: All examples MUST either:
1. Define custom tests via `tests=capture_name`, OR
2. Explicitly disable tests with `tests=false`

Examples without a `tests` parameter or with an empty `tests` value will fail with an error message prompting you to add tests.

## Example

See `docs/_test_examples.md` for complete examples of:
- Examples with `tests=false`
- Examples with custom tests
- Examples with expected errors

## Migration Guide

For existing examples without tests:

1. **Simple examples**: Add `tests=false` to the include block if no custom behavior needs testing beyond the default smoke tests
2. **Interactive examples**: Write custom tests that exercise the interactive behavior
3. **Error demonstrations**: Add custom tests and specify `expectedConsoleErrors` or `expectedPageErrors` as needed

## Test Execution Flow

1. Collector script (`scripts/collect-docs-examples.js`) extracts tests code and adds it to the manifest
2. Test runner (`test/docs_examples.tests.js`) performs smoke checks (page loads, no unexpected errors)
3. If custom tests are defined, they are:
   - Written to a temporary `.mjs` file
   - Dynamically imported as an ES module
   - Executed with the test parameters
4. Test passes if all smoke checks and custom tests pass

## Benefits

- **Single Source of Truth**: Tests live alongside the examples they verify
- **Better Coverage**: Interactive examples can have meaningful behavioral tests
- **Documentation Accuracy**: Examples are continuously validated against actual behavior
- **Maintainability**: Changes to examples automatically update their tests
