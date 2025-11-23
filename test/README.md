# SmarkForm Test Suite

This document explains how to install dependencies and run the test suite efficiently. For how to write tests and how the suite works under the hood, see:
- Writing tests: [WRITING_TESTS.md](./doc/WRITING_TESTS.md)
- Implementation details: [IMPLEMENTATION_DETAILS.md](./doc/IMPLEMENTATION_DETAILS.md)

This file covers:
<!-- vim-markdown-toc GitLab -->

* [Prerequisites](#prerequisites)
* [Arquitecture overview](#arquitecture-overview)
* [Quick start](#quick-start)
* [Running specific tests](#running-specific-tests)
    * [Co-located tests](#co-located-tests)
    * [Using test picker](#using-test-picker)
* [Debugging](#debugging)
* [Reports, traces, and artifacts](#reports-traces-and-artifacts)
* [Troubleshooting](#troubleshooting)
* [Common Playwright modifiers](#common-playwright-modifiers)
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

## Arquitecture overview

The test suite uses [Playwright](https://playwright.dev/) to run end-to-end tests.

The tests are located in the `test/` folder where you can find regular/custom
tests in `*.tests.js` files as well as a special test file called
`co_located_tests.tests.js` that runs tests co-located with documentation
examples.

Co-located tests are defined alongside documentation examples in the `docs/`
folder using Jekyll captures and includes. A collection script processes these
examples and generates a manifest that the Playwright tests use to run each
example's tests.

The collection phase is executed in the npm pretest phase, alongside the build
step to ensure the latest code is tested.

There is also a co_located_tests_validation.tests.js file that runs general
smoke tests on all documentation examples to ensure they load correctly and
meet basic expectations. They also enforce the presence of custom co-located
tests for each existing documentation example unless explicitly disabled.

All tests are run across multiple browsers (Chromium, Firefox, WebKit) to ensure
cross-browser compatibility.

See test/doc/WRITING_TESTS.md and test/doc/IMPLEMENTATION_DETAILS.md for more
details.


## Quick start

- Run the full suite (build + collect docs examples + run Playwright):
  ```bash
  npm run test
  ```
  This runs:
  - Build: scripts/build_production_smarkform.sh
  - Collector: node scripts/collect-docs-examples.js
  - Playwright tests: playwright test (all projects: chromium, firefox, webkit)

> 📌 Shothand `npm test` can be used instead of `npm run test`. We consisteltly
> use the longer form for consistency with the `npm run test:pick` command
> which can only be run this way.


- Run only the collector:
  ```bash
  node scripts/collect-docs-examples.js
  ```

- Run only tests (assumes build + collector already ran):
  ```bash
  npx playwright test
  ```

> 📌 From now on, we'll use exclusively `npm run test` since it ensures the
> build and collection steps are done.
> 
> If you are sure no changes were made, you only need to replace `npm run test`
> by `npx playwright test` to skip build + collection process if you want for a
> slightly faster run.


- Use playwright modifiers after `--`:
  ```bash
  npm run test -- --headed
  ```


## Running specific tests

> 📌 **tl;dr:** Use the [test picker](#using-test-picker) to interactively select
> browser, tests, etc... to run:
> 
> ```bash
> npm run test:pick
> ```

- Run by file:
  ```bash
  npm run test test/type_list.tests.js
  ```

- Run one browser (project):
  ```bash
  npm run test -- --project=chromium
  ```

- Filter by test title (regex). Docs examples are named "[<file>] <formId>":
  ```bash
  # Example: only the example with formId "test_with_custom_tests"
  npm run test -- -g "test_with_custom_tests"

  # Or by file tag
  npm run test -- -g "\\[_test_examples\\.md\\]"
  ```

- Run a single worker (useful on low-resource environments):
  ```bash
  npm run test -- --workers=1
  ```

### Co-located tests

- Run by file:
  ```bash
  npm run test test/co_located_tests.tests.js
  ```

- Run only tests of specific file (from the docs/ folder):
  ```bash
  npm run test test/co_located_tests.tests.js ../docs/_about/showcase.md
  ```

### Using test picker

- Run the interactive test picker:
  ```bash
  npm run test:pick
  # Without running the build + collection steps:
  ./scripts/pick_test.sh
  ```

- Repeat the last picked test:
  ```bash
  npm run test:pick -- --repeat
  # Without running the build + collection steps:
  ./scripts/pick_test.sh --repeat
  # ...or just select the "Repeat last choice" option in the picker
  ```

> 💡 **Hint:**
>   * Use the test picker to quickly select a browser and run the test you are
>     working on.
>   * Use it again and select "Repeat last choice" to re-run adding or removing
>     options (like `--headed`, `--debug`, etc...).
>   * Use it with the `--repeat` to quickly re-run with the exact same options as
>     last time.

## Debugging

- Headed mode:
  ```bash
  npm run test:pick -- --headed # run picked test in selected browser
  # Next iterations:
  npm run test:pick -- --repeat # it remembers passed options too
  ```

- Debug with inspector:
  ```bash
  npm run test:pick -- --debug
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
- `--ui`: [Playwright Test Runner UI mode](https://playwright.dev/docs/test-ui-mode).

See Playwright docs for more: [https://playwright.dev/docs/test-cli](https://playwright.dev/docs/test-cli)

## Minimal Playwright cheatsheet

- Selectors: `page.locator('css')`, `page.getByRole('button', { name: 'Save' })`
- Actions: `click()`, `fill()`, `press()`, `selectOption()`, `check()`, `uncheck()`
- Assertions: `await expect(locator).toBeVisible()`, `toHaveText()`, `toHaveCount()`, `toHaveValue()`
- Waits: `locator.waitFor()`, `page.waitForTimeout(ms)`

See test/doc/WRITING_TESTS.md for co-located tests and examples, and test/doc/IMPLEMENTATION_DETAILS.md for internals (collection pipeline, transformations, enforcement rules).

