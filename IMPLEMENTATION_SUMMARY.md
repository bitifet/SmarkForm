# Documentation Examples Test Pipeline - Implementation Summary

## Overview

Successfully implemented a comprehensive test pipeline that automatically extracts examples from documentation and converts them into Playwright smoke tests.

## What Was Built

### 1. Collector Script (`scripts/collect-docs-examples.js`)

A Node.js script that:
- Scans all markdown files in `docs/` directory (excluding presentations and build artifacts)
- Finds `{% include components/sampletabs_tpl.md ... %}` blocks
- Extracts parameters: `formId`, `htmlSource`, `cssSource`, `jsHead`, `jsHidden`, `jsSource`, `tests`, `expectedConsoleErrors`, `expectedPageErrors`
- Resolves `{% capture %}` blocks with content
- Performs recursive interpolation of `{{ variables }}`
- Supports Jekyll filters like `{{ var | replace: "old", "new" }}`
- Handles special cases like `{{""}}` (Jekyll newline prevention)
- Applies documentation-specific transformations:
  - `█` → spaces (indentation hack)
  - `$$` → `-${formId}` (unique ID suffix)
  - Strips `!important` from CSS
- **NEW**: Processes `tests=` parameter for co-located custom tests
  - Resolves test code from capture blocks
  - Applies transformations (█ and $$)
  - Handles `tests=false` as literal string
  - Sets `tests` to empty string if not provided
- **NEW**: Parses `expectedConsoleErrors` and `expectedPageErrors` for error assertions
- Cleans up unresolved template-level variables
- Outputs a JSON manifest to `test/.cache/docs_examples.json`

### 2. Playwright Test Harness (`test/docs_examples.tests.js`)

A Playwright test file that:
- Loads the generated manifest
- Creates one test per example
- Generates a minimal HTML page for each example containing:
  - The example's HTML
  - The example's CSS (transformed)
  - SmarkForm library (`dist/SmarkForm.umd.js`)
  - The example's JavaScript (jsHead + jsHidden + jsSource combined)
- Runs smoke tests for each example:
  - Verifies the page loads without errors
  - Verifies the form container is visible
  - Verifies console errors match expectations (default: 0)
  - Verifies page errors match expectations (default: 0)
- **NEW**: Enforces tests presence/validity
  - Fails if `tests` is missing or empty
  - Provides clear error message to add `tests=` parameter
  - Allows `tests=false` to explicitly disable custom tests
- **NEW**: Executes co-located custom tests when defined
  - Writes test code to temporary `.mjs` file
  - Dynamically imports test module
  - Executes test function with: `{ page, expect, id, helpers }`
  - Provides `helpers.root(page, id)` utility for form root locator

### 3. Integration

- Updated `package.json` to run collector before tests
- Added `.gitignore` entry for `test/.cache/`
- Created comprehensive documentation in `test/README.md`

## Results

### Statistics

- **Total examples extracted:** 63
- **Documentation files processed:** 11
- **Examples with CSS:** 20
- **Examples with custom JavaScript:** 13
- **Examples with hidden JavaScript:** 3
- **Examples with notes:** 22
- **Examples with editor:** 43

### Files Covered

- `_about/showcase.md`: 22 examples
- `_component_types/type_color.md`: 3 examples
- `_component_types/type_date.md`: 2 examples
- `_component_types/type_form.md`: 1 example
- `_component_types/type_label.md`: 3 examples
- `_component_types/type_list.md`: 4 examples
- `_component_types/type_number.md`: 2 examples
- `_getting_started/core_component_types.md`: 6 examples
- `_getting_started/core_concepts.md`: 6 examples
- `_getting_started/quick_start.md`: 13 examples
- `index.md`: 1 example

### Verification

All transformations verified as working correctly:
- ✅ All `{{ variables }}` resolved or cleaned
- ✅ All `$$` placeholders replaced with formId
- ✅ All `█` blocks converted to spaces
- ✅ All `!important` removed from CSS
- ✅ Recursive interpolation working
- ✅ Jekyll filter support working

## Usage

```bash
# Run all tests (automatically runs collector)
npm test

# Run only the collector
node scripts/collect-docs-examples.js

# Run specific test file
npx playwright test test/docs_examples.tests.js

# Run tests in headed mode
npm run test:headed
```

## Co-Located Custom Tests (NEW)

The pipeline now supports co-located custom tests defined directly in documentation:

### Features
- **Custom Test Definition**: Define Playwright test code in Jekyll capture blocks
- **Test Execution**: Tests are dynamically imported and executed for each example
- **Helper Functions**: Built-in utilities like `helpers.root(page, id)`
- **Explicit Opt-Out**: Use `tests=false` to explicitly disable custom tests
- **Error Expectations**: Support for `expectedConsoleErrors` and `expectedPageErrors`
- **Enforcement**: All examples must define `tests` (either custom or `false`)

### Documentation
- See `CO_LOCATED_TESTS.md` for complete usage guide
- See `docs/_test_examples.md` for working examples
- See `scripts/add-tests-false-to-examples.js` for migration tool

### Migration
All existing examples have been updated with `tests=false` to maintain backwards compatibility while enabling future custom tests.

## Future Enhancements

Additional features that could be added:
- Visual regression testing
- Accessibility testing
- Performance benchmarks
- Snapshot testing for form state

## Technical Highlights

1. **Recursive Variable Resolution**: Handles nested Jekyll variables like `{{ var1 | replace: "x", "{{ var2 }}" }}`

2. **Jekyll Filter Support**: Implements the `replace` filter and can be extended to support other Jekyll filters

3. **Special Character Handling**: Correctly processes Unicode characters like `█` (U+2588)

4. **Transformation Pipeline**: Applies multiple transformations in the correct order

5. **Error Prevention**: Cleans up unresolved template-level variables that don't affect functionality

## Benefits

1. **Documentation Accuracy**: Every example in the documentation is now automatically tested
2. **Regression Prevention**: Changes that break examples will be caught immediately
3. **Maintenance Reduction**: No need to manually maintain separate test examples
4. **Single Source of Truth**: Documentation examples serve as both docs and tests
5. **Continuous Validation**: Examples stay in sync with the codebase

## Conclusion

The test pipeline is fully operational and ready to use. All 63 documentation examples are successfully extracted, transformed, and ready to be tested with Playwright.
