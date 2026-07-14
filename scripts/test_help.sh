#!/usr/bin/env bash
# Print a summary of the SmarkForm test suite, including test types,
# locations, and special considerations for running them.
# Usage: npm run test:help

cat << 'EOF'

╔══════════════════════════════════════════════════════════════════════════════╗
║                        SmarkForm Test Suite Help                             ║
╚══════════════════════════════════════════════════════════════════════════════╝

QUICK REFERENCE
───────────────
  npm test              Full matrix: chromium + firefox + webkit + chromium-mobile
  npm run test:quick    One randomly-chosen browser (fast sanity check)
  npm run test:pick     Pick specific test file(s) interactively
  npm run pretest       Validate cheatsheet, build, collect examples (auto-run)

TEST TYPES & LOCATIONS
──────────────────────

┌─ 1. Co-located documentation tests ──────────────────────────────────────┐
│  Runner:  test/co_located_tests.tests.js                                  │
│  Source:  docs/*.md  (examples defined via {% include sampletabs_tpl %})  │
│  Generator: scripts/collect-docs-examples.js → test/.cache/docs_examples.json │
│  Helper:  test/co_located_tests_smoke.include.js                          │
│  Validator: test/co_located_tests_validation.tests.js                     │
│                                                                            │
│  Every docs example gets an auto-generated HTML page with SmarkForm        │
│  loaded.  The framework runs:                                              │
│    • A smoke check (form visible, no unexpected console/page errors)      │
│    • Custom tests defined via the tests= capture in the include            │
│    • A demoValue round-trip (if demoValue is set)                         │
│                                                                            │
│  Key parameters on the include:                                            │
│    tests=false           skip co-located tests (smoke run still fires)    │
│    expectedConsoleErrors default 0 — set >0 for intentional error demos  │
│    smarkformOptions      JSON string → SmarkForm constructor options       │
│    demoValue             pre-populated JSON to verify import/export        │
│                                                                            │
│  Pin one example:                                                          │
│    npx playwright test test/co_located_tests.tests.js \                    │
│      --project=chromium --grep "formId_name"                              │
└────────────────────────────────────────────────────────────────────────────┘

┌─ 2. Classic Playwright unit tests ────────────────────────────────────────┐
│  Files:  test/*.tests.js  (19 suites covering individual features)        │
│                                                                            │
│  mask.tests.js              Legacy masking API                           │
│  declarative_mask.tests.js  SmarkForm.registerMask(), smark-mask scripts │
│  events.tests.js            Event system (.on, .onLocal, .onAll, focus)  │
│  general.tests.js           Core functionality, options validation       │
│  mixin_types.tests.js       Mixin templates, scoped masks, scripts       │
│  type_list.tests.js         List component (add/remove, sort, items)     │
│  type_number.tests.js       Number type behaviour                        │
│  type_form_submit.tests.js  Form submission (POST, JSON encoding)        │
│  clear_reset.tests.js       Clear / Reset actions                        │
│  render_error.tests.js      Error rendering in-place                    │
│  dist_sync.tests.js         Distribution file integrity                  │
│                                                                            │
│  Most classic tests use Pug templates loaded via test/src/lib/test/       │
│  helpers.js (renderPug / renderHtml).  They reference                      │
│  ../../dist/SmarkForm.umd.js — ensure npm run build was run first.        │
│                                                                            │
│  Run one file:                                                             │
│    npx playwright test test/mask.tests.js --project=chromium              │
│                                                                            │
│  Run one test:                                                             │
│    npx playwright test -g "test name pattern" --project=chromium          │
└────────────────────────────────────────────────────────────────────────────┘

┌─ 3. Pug-based tests (subset of classic tests) ───────────────────────────┐
│  Tests using renderPug() compile .pug templates on-the-fly via a test     │
│  HTTP server started by helpers.js.  This server reads files from disk,   │
│  never caches.                                                             │
│                                                                            │
│  Affected suites:  events.tests.js, general.tests.js, mixin_types.tests.js │
│                                                                            │
│  Known issues:                                                             │
│    • Pug compilation takes ~1-2s per test — first test may time out if    │
│      the server is cold.                                                  │
│    • Run with increased timeout if needed:                                │
│        npx playwright test --timeout=60000                                │
│    • If all Pug tests fail, kill leftover servers:                        │
│        pkill -f "node.*test.*server"                                      │
└────────────────────────────────────────────────────────────────────────────┘

PREREQUISITES
─────────────
  Always run before testing:
    1. npm run build          (generates dist/SmarkForm.{esm,umd}.js)
    2. node scripts/collect-docs-examples.js  (scans docs/ for examples)
    Or use npm run pretest which does both + validates the cheatsheet.

PLAYWRIGHT CONFIGURATION
────────────────────────
  File:   playwright.config.js
  Projects: chromium, firefox, webkit, chromium-mobile (Pixel 5)
  Reporter: HTML (playwright-report/index.html)
  Artifacts: trace + screenshot on failure

DEBUGGING
─────────
  • View last report:    npx playwright show-report
  • Trace on failure:    npx playwright show-trace <trace.zip>
  • Run headed:          npx playwright test --headed
  • Debug one test:      npx playwright test --debug -g "test name"
  • Slow-mo:             npx playwright test --headed --slowMo=500
  • Skip build:          PW_TEST_SKIP_BUILD=1 npx playwright test (if dist/ is fresh)

FILES YOU MAY NEED
──────────────────
  test/doc/WRITING_TESTS.md       – how to add new tests / co-located tests
  test/doc/IMPLEMENTATION_DETAILS.md – internal test infrastructure details
  test/.cache/docs_examples.json  – generated manifest of all docs examples
  test/co_located_tests.tests.js  – co-located test runner (read for helpers)
  src/lib/test/helpers.js         – Pug server, renderPug, renderHtml helpers
  scripts/collect-docs-examples.js – docs example scanner (Jekyll include parser)
  scripts/validate-cheatsheet.js  – cheatsheet integrity checker (runs in pretest)

EOF
