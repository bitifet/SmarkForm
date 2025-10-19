# SmarkForm Test Suite

This document explains how to install dependencies and run the test suite efficiently. For how to write tests and how the suite works under the hood, see:
- Writing tests: [WRITING_TESTS.md](./WRITING_TESTS.md)
- Implementation details: [IMPLEMENTATION_DETAILS.md](./IMPLEMENTATION_DETAILS.md)

## Prerequisites

- Node.js 18+ recommended
- Install dependencies and Playwright browsers:
  ```bash
  npm install
  npx playwright install
  ```

## Quick start

- Run the full suite (build + collect docs examples + run Playwright):
  ```bash
  npm test
  ```
  This runs:
  - Build: scripts/build_production_smarkform.sh
  - Collector: node scripts/collect-docs-examples.js
  - Playwright tests: playwright test (all projects: chromium, firefox, webkit)

- Run only the collector:
  ```bash
  node scripts/collect-docs-examples.js
  ```

- Run only tests (assumes build + collector already ran):
  ```bash
  npx playwright test
  ```

## Running specific tests

- Run by file:
  ```bash
  npx playwright test test/docs_examples.tests.js
  ```

- Run one browser (project):
  ```bash
  npx playwright test --project=chromium
  ```

- Filter by test title (regex). Docs examples are named "[<file>] <formId>":
  ```bash
  # Example: only the example with formId "test_with_custom_tests"
  npx playwright test -g "test_with_custom_tests"

  # Or by file tag
  npx playwright test -g "\\[_test_examples\\.md\\]"
  ```

- Run a single worker (useful on low-resource environments):
  ```bash
  npx playwright test --workers=1
  ```

## Debugging

- Headed mode:
  ```bash
  npm run test:headed
  # or selectively
  npx playwright test --project=chromium --headed
  ```

- Debug with inspector:
  ```bash
  npx playwright test --debug
  # or
  PWDEBUG=1 npx playwright test
  ```

- Pause in the middle of a test (custom tests or your own .tests.js):
  ```js
  await page.pause();
  ```

## Reports, traces, and artifacts

- HTML report:
  - Open after a run:
    ```bash
    npx playwright show-report
    ```
  - Or open: playwright-report/index.html
- Traces on failure (enabled via playwright.config.js: trace=retain-on-failure):
  - Show a saved trace:
    ```bash
    npx playwright show-trace path/to/trace.zip
    ```

## Troubleshooting

- “Failed to load examples manifest” or empty manifest:
  - Run the collector:
    ```bash
    node scripts/collect-docs-examples.js
    ```
  - Ensure the build produced dist/SmarkForm.umd.js (npm test runs build first).

- “Example … is missing co-located tests” error:
  - Add tests to the include block in the docs using a capture, or add tests=false.
  - See test/WRITING_TESTS.md for how to add co-located tests.

- Unexpected console/page errors mismatch:
  - Set expectedConsoleErrors / expectedPageErrors in the include block for examples that intentionally error. See test/WRITING_TESTS.md.

- A docs example is purely illustrative and not an enhanced SmarkForm example:
  - Use jsSource="-" in the include block to skip it from the test manifest.

- Headed mode or CI resource constraints:
  - Run a single browser with --project=chromium.
  - Reduce workers: --workers=1.
  - Use --debug or page.pause() to step through.

## Minimal Playwright cheatsheet

- Selectors: `page.locator('css')`, `page.getByRole('button', { name: 'Save' })`
- Actions: `click()`, `fill()`, `press()`, `selectOption()`, `check()`, `uncheck()`
- Assertions: `await expect(locator).toBeVisible()`, `toHaveText()`, `toHaveCount()`, `toHaveValue()`
- Waits: `locator.waitFor()`, `page.waitForTimeout(ms)`

See test/WRITING_TESTS.md for co-located tests and examples, and test/IMPLEMENTATION_DETAILS.md for internals (collection pipeline, transformations, enforcement rules).

