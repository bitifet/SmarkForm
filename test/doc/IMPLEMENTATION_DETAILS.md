# Test Suite – Implementation Details

This document explains how the documentation examples pipeline works under the hood.

Sections:
<!-- vim-markdown-toc GitLab -->

* [Pipeline overview (“How it works”)](#pipeline-overview-how-it-works)
* [Collector internals](#collector-internals)
* [Manifest schema (selected)](#manifest-schema-selected)
* [Test runner internals](#test-runner-internals)
* [Special behaviors and notes](#special-behaviors-and-notes)
* [Validation and references](#validation-and-references)

<!-- vim-markdown-toc -->

## Pipeline overview (“How it works”)

1) Collection phase (scripts/collect-docs-examples.js)
- Scans docs/ (excluding presentations, build artifacts, etc.)
- Finds include blocks: `{% include components/sampletabs_tpl.md ... %}`
- Resolves parameters: `formId`, `htmlSource`, `cssSource`, `jsHead`, `jsHidden`, `jsSource`, `tests`, `expectedConsoleErrors`, `expectedPageErrors`, and additional flags (showEditor, showEditorSource, addLoadSaveButtons)
- Resolves `{% capture %}` blocks and performs recursive interpolation of `{{ variables }}` (including Jekyll filters like replace)
- Applies transformations:
  - `█` → four spaces (indentation)
  - `$$` → `-${formId}` (ensures unique IDs per example)
  - Removes `!important` from CSS
- Skips examples with `jsSource="-"`
- Writes a JSON manifest to `test/.cache/docs_examples.json`

2) Execution phase (test/co_located_tests.tests.js)
- Loads the manifest
- For each example:
  - Generates a minimal HTML page with the example’s HTML/CSS and SmarkForm library
  - Injects JS (jsHead + jsHidden + jsSource) inside an IIFE
  - Performs smoke checks:
    - Page loads and form container is visible
    - Console and page error counts match expectations
  - Enforces tests presence (must be `tests=false` or valid code)
  - If custom tests are provided:
    - Writes the code to a temporary .mjs file
    - Dynamically imports it and invokes the default export with `{ page, expect, id, helpers }`

## Collector internals

Key steps:
- Capture extraction: `{% capture var %}...{% endcapture %}` stored in-memory and referenced by include parameters.
- Variable interpolation: recursively resolves `{{ variable }}`, supports `replace` filter. Special case: `{{""}}` becomes an empty string (Jekyll newline prevention).
- Parameter resolution:
  - `formId` used verbatim (not resolved from captures)
  - `tests=false` respected as a literal string
  - Other parameters may reference captures
- Transformations:
  - `█` → spaces
  - `$$` → `-${formId}` (done consistently across HTML/CSS/JS and tests)
  - CSS `!important` stripped
- Skips examples with `jsSource="-"`
- Default jsHead when missing:
  ```js
  const myForm = new SmarkForm(document.getElementById("myForm-${formId}"));
  ```
- Error expectations:
  - `expectedConsoleErrors` and `expectedPageErrors` parsed as integers (default 0).
- Additional flags recorded:
  - `showEditor`, `showEditorSource`, `addLoadSaveButtons` (boolean by string comparison).

## Manifest schema (selected)

Each example entry resembles:
```json
{
  "id": "<docs_path>_<formId>",
  "file": "<relative docs md file>",
  "formId": "my_example",
  "htmlSource": "...",
  "cssSource": "...",
  "jsHead": "...",
  "jsHidden": "...",
  "jsSource": "...",
  "tests": "false | <ESM code string>",
  "expectedConsoleErrors": 0,
  "expectedPageErrors": 0,
  "notes": "",
  "showEditor": false,
  "showEditorSource": false,
  "addLoadSaveButtons": false
}
```

Location: `test/.cache/docs_examples.json` (gitignored).

## Test runner internals

- Builds a temporary HTML page per example under `test/tmp/` and serves it via the local test server (helpers).
- Injects `dist/SmarkForm.umd.js` and the example’s JS (jsHead + jsHidden + jsSource).
- Records:
  - Console messages (collects .type() and .text())
  - Console errors (type === 'error')
  - Page errors (page.on('pageerror'))
- Assertions:
  - Form container `#myForm-${formId}` is visible
  - Error counts match `expectedConsoleErrors` and `expectedPageErrors` (default 0)
- Tests enforcement:
  - Missing/empty `tests` causes a descriptive failure
  - `tests=false` disables custom test execution but smoke checks still run
- Custom tests:
  - Written to a temporary `.mjs` module
  - Imported dynamically (`file://...`)
  - Must export a default async function
  - Receives `{ page, expect, id, helpers }`
  - `helpers.root(page, id)` → `#myForm-${id}` locator

## Special behaviors and notes

- Skipping examples:
  - Use `jsSource="-"` to exclude a docs example from the manifest and runner (for purely illustrative cases).
- Explicitly disabling custom tests:
  - `tests=false` satisfies the enforcement and only skips custom test execution; smoke checks still apply.
- Error demonstrations:
  - Use `expectedConsoleErrors` and `expectedPageErrors` to avoid red failures on intentional errors.
- showEditor handling:
  - The collector records `showEditor`, `showEditorSource`, and `addLoadSaveButtons`. These flags don’t impact the runner assertions but are preserved for completeness and potential future use.

## Validation and references

Validation tests at test/co_located_tests_validation.tests.js verify:
- The manifest loads
- `tests` is present for all examples and none are empty
- `expectedConsoleErrors` and `expectedPageErrors` exist and are valid
- Known examples in docs/_test_examples.md have the expected configuration
- Transformations (no `█`, no stray `$$`)

References:
- Examples: test/doc/_test_examples.md
- Collector: scripts/collect-docs-examples.js
- Runner: test/co_located_tests.tests.js

