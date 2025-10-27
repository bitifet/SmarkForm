# SmarkForm Test Suite

This document explains how to install dependencies and run the test suite efficiently. For how to write tests and how the suite works under the hood, see:
- Writing tests: [WRITING_TESTS.md](./doc/WRITING_TESTS.md)
- Implementation details: [IMPLEMENTATION_DETAILS.md](./doc/IMPLEMENTATION_DETAILS.md)

This file covers:
<!-- vim-markdown-toc GitLab -->

* [Prerequisites](#prerequisites)
* [Quick start](#quick-start)
* [Common Playwright modifiers](#common-playwright-modifiers)
* [Running specific tests](#running-specific-tests)
* [Co-located tests](#co-located-tests)
* [Debugging](#debugging)
* [Reports, traces, and artifacts](#reports-traces-and-artifacts)
* [Troubleshooting](#troubleshooting)
* [Minimal Playwright cheatsheet](#minimal-playwright-cheatsheet)

<!-- vim-markdown-toc -->


## Prerequisites

- Node.js 18+ recommended
- Install dependencies and Playwright browsers:
  ```bash
  npm install
  npx playwright install
  npx playwright install-deps
  ```

## Quick start

- Run the full suite (build + collect docs examples + run Playwright):
  ```bash
  npm run test
  # or simply
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
  npm run test:only
  # or
  npx playwright test
  ```

> 📌 From now on, we'll use exclusively `npm run test` since it ensures the
> build and collection steps are done.
> 
> If you are sure no changes were made, you only need to add ':only'
> (`npm run test:only`) to skip build + collection process.


- Use playwright modifiers after `--`:
  ```bash
  npm run test -- --headed
  ```


## Common Playwright modifiers

- `--list`: list all tests without running them
- `--project=<name>`: run specific browser/project (chromium, firefox, webkit)
- `-g <regex>`: filter tests by title (regex)
- `--workers=<number>`: number of parallel workers
- `--debug`: run in debug mode (enables inspector)
- `--headed`: run browsers in headed mode
- `--trace=<mode>`: trace collection mode (on, off, retain-on-failure, etc.)
- `--reporter=<name>`: specify reporter (list, dot, html, etc.)
- `--timeout=<ms>`: set test timeout in milliseconds
- `--retries=<number>`: number of retries on failure

See Playwright docs for more: [https://playwright.dev/docs/test-cli](https://playwright.dev/docs/test-cli)

## Running specific tests

- Run by file:
  ```bash
  npm run test test/type_list.tests.js
  ```

- Run one browser (project):
  ```bash
  npm run test --project=chromium
  ```

- Filter by test title (regex). Docs examples are named "[<file>] <formId>":
  ```bash
  # Example: only the example with formId "test_with_custom_tests"
  npm run test -g "test_with_custom_tests"

  # Or by file tag
  npm run test -g "\\[_test_examples\\.md\\]"
  ```

- Run a single worker (useful on low-resource environments):
  ```bash
  npm run test --workers=1
  ```

## Co-located tests

- Run by file:
  ```bash
  npm run test test/co_located_tests.tests.js
  ```

- Run only tests of specific file (from the docs/ folder):
  ```bash
  npm run test test/co_located_tests.tests.js ../docs/_about/showcase.md
  ```

## Debugging

- Headed mode:
  ```bash
  npm run test -- --headed
  # or selectively
  npm run test -- --project=chromium --headed
  ```

- Debug with inspector:
  ```bash
  npm run test -- --debug
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
  - Ensure the build produced dist/SmarkForm.umd.js (npm run test runs build first).

- “Example … is missing co-located tests” error:
  - Add tests to the include block in the docs using a capture, or add tests=false.
  - See test/doc/WRITING_TESTS.md for how to add co-located tests.

- Unexpected console/page errors mismatch:
  - Set expectedConsoleErrors / expectedPageErrors in the include block for examples that intentionally error. See [test/doc/WRITING_TESTS.md](./doc/WRITING_TESTS.md).

- If a docs example is purely illustrative and not an enhanced SmarkForm example:
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

See test/doc/WRITING_TESTS.md for co-located tests and examples, and test/doc/IMPLEMENTATION_DETAILS.md for internals (collection pipeline, transformations, enforcement rules).

