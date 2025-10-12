# SmarkForm Test Suite

## Overview

This directory contains the test suite for SmarkForm, including:

1. **Unit/Integration Tests** - Testing specific component types and functionality
2. **Documentation Examples Tests** - Automated tests extracted from documentation

## Documentation Examples Test Pipeline

The documentation examples test pipeline automatically extracts examples from the `docs/` directory and converts them into Playwright tests.

### How It Works

1. **Collection Phase** (`scripts/collect-docs-examples.js`)
   - Scans all markdown files in `docs/` (excluding presentations and other special folders)
   - Finds `{% include components/sampletabs_tpl.md ... %}` blocks
   - Extracts parameters: `formId`, `htmlSource`, `cssSource`, `jsHead`, `jsHidden`, `jsSource`
   - Resolves `{% capture %}` blocks and interpolates `{{ variables }}`
   - Applies Jekyll transformations:
     - `█` → spaces (indentation hack used in docs)
     - `$$` → `-${formId}` (unique ID suffix)
   - Strips `!important` from CSS (used for Jekyll styling override)
   - Outputs manifest to `test/.cache/docs_examples.json`

2. **Test Execution Phase** (`test/docs_examples.tests.js`)
   - Loads the manifest JSON
   - For each example, generates a minimal HTML page with:
     - The example's HTML source
     - The example's CSS (transformed)
     - SmarkForm library (`dist/SmarkForm.umd.js`)
     - The example's JavaScript (jsHead + jsHidden + jsSource)
   - Runs smoke tests:
     - ✓ Page loads without errors
     - ✓ Form container is visible
     - ✓ No console errors
     - ✓ No page errors

### Running Tests

```bash
# Run all tests (includes building and collecting examples)
npm test

# Run only the collector
node scripts/collect-docs-examples.js

# Run specific test file
npx playwright test test/docs_examples.tests.js
```

### Test Output

- Manifest: `test/.cache/docs_examples.json` (gitignored)
- Temporary HTML files: `test/tmp/` (gitignored, created during test runs)

### Adding New Documentation Examples

Simply add or modify examples in the `docs/` directory using the standard `{% include components/sampletabs_tpl.md %}` pattern. The tests will automatically pick them up on the next run.

### Future Enhancements

- Support for co-located tests via `tests=` parameter
- Custom assertions for specific examples
- Visual regression testing
- Accessibility testing
