#!/usr/bin/env bash
# SmarkForm test suite help — print a general overview or detailed topic info.
# Usage:
#   npm run test:help              → overview + topic list
#   npm run test:help <topic>      → detailed information about <topic>
#
set -euo pipefail

TOPIC="${1:-}"

# ── Shared helpers ────────────────────────────────────────────────────────────

say()  { printf '%b\n' "$*"; }
title(){ say "\n═══ $* ═══"; }
hdr()  { say "\n── $* ──"; }
bullet(){ say "  • $*"; }

overview_topics() {
  say ""
  say "Available topics (npm run test:help <topic>):"
  say ""
  say "  overview        Test types and quick-reference commands (this page)"
  say "  co-located      Co-located documentation example tests"
  say "  classic         Classic Playwright unit tests (test/*.tests.js)"
  say "  pug             Pug-based tests — setup, known issues"
  say "  prerequisites   What to run before testing (build, collect, validate)"
  say "  workers         Parallel workers, CI settings, –-workers flag"
  say "  debugging       Trace viewer, --headed, --debug, common problems"
  say "  files           Key files and their roles"
  say "  commands        All npm test commands with examples"
  say ""
}

# ── Topic: overview ──────────────────────────────────────────────────────────

topic_overview() {
  say "╔══════════════════════════════════════════════════════════════════════════════╗"
  say "║                        SmarkForm Test Suite Help                             ║"
  say "╚══════════════════════════════════════════════════════════════════════════════╝"

  hdr "Quick reference"
  say ""
  say "  npm test              Full matrix (chromium + firefox + webkit + chromium-mobile)"
  say "  npm run test:quick    One randomly-chosen browser (fast sanity check)"
  say "  npm run test:pick     Pick test file(s) interactively"
  say "  npm run pretest       Validate cheatsheet, build, collect docs examples"
  say "  npm run test:help     This overview; add a topic name for details"

  hdr "Test types at a glance"
  say ""
  say "  1. Co-located docs tests — auto-generated from every {% include sampletabs_tpl %}"
  say "     Runner: test/co_located_tests.tests.js  (~100+ examples)"
  say "  2. Classic Playwright tests — 19 suites in test/*.tests.js"
  say "     Cover individual features: masking, events, mixins, lists, etc."
  say "  3. Pug-based tests — subset of classic tests that compile .pug templates"
  say "     (events.tests.js, general.tests.js, mixin_types.tests.js)"

  overview_topics
}

# ── Topic: co-located ────────────────────────────────────────────────────────

topic_co_located() {
  title "Co-located Documentation Example Tests"

  say "Every playable example in docs/*.md (via {% include sampletabs_tpl %})"
  say "gets an auto-generated test page.  The collector scans the docs, extracts"
  say "parameters, and writes a manifest to test/.cache/docs_examples.json."

  hdr "Flow"
  bullet "scripts/collect-docs-examples.js  →  scans docs/ for includes"
  bullet "test/co_located_tests.tests.js    →  reads manifest, generates pages"
  bullet "test/co_located_tests_smoke.include.js  →  basic smoke assertions"
  bullet "test/co_located_tests_validation.tests.js → manifest integrity checks"

  hdr "What runs per example"
  bullet "Smoke check — form visible, no unexpected console / page errors"
  bullet "Custom tests — defined via the tests= capture in the include"
  bullet "demoValue round-trip — if demoValue is set, import + re-export check"

  hdr "Key include parameters"
  bullet "tests=false          skip custom co-located tests (smoke still runs)"
  bullet "expectedConsoleErrors  (default 0)  set >0 for intentional error demos"
  bullet "expectedPageErrors     (default 0)"
  bullet "smarkformOptions      JSON string → SmarkForm constructor options"
  bullet "demoValue             pre-populated JSON to verify import/export"

  hdr "Pin one example"
  say '  npx playwright test test/co_located_tests.tests.js \'
  say '    --project=chromium --grep "formId_name"'
}

# ── Topic: classic ───────────────────────────────────────────────────────────

topic_classic() {
  title "Classic Playwright Unit Tests"

  say "Located in test/*.tests.js — 19 suites total."
  say ""

  printf "  %-30s %s\n" "mask.tests.js" "Legacy masking API"
  printf "  %-30s %s\n" "declarative_mask.tests.js" "registerMask(), smark-mask scripts"
  printf "  %-30s %s\n" "events.tests.js" "Event system (.on, .onLocal, .onAll, focus)"
  printf "  %-30s %s\n" "general.tests.js" "Core functionality, options validation"
  printf "  %-30s %s\n" "mixin_types.tests.js" "Mixin templates, scoped masks, scripts"
  printf "  %-30s %s\n" "type_list.tests.js" "List component (add/remove, sort, items)"
  printf "  %-30s %s\n" "type_number.tests.js" "Number type behaviour"
  printf "  %-30s %s\n" "type_form_submit.tests.js" "Form submission (POST, JSON encoding)"
  printf "  %-30s %s\n" "clear_reset.tests.js" "Clear / Reset actions"
  printf "  %-30s %s\n" "render_error.tests.js" "Error rendering in-place"
  printf "  %-30s %s\n" "dist_sync.tests.js" "Distribution file integrity"

  hdr "Run one file"
  bullet "npx playwright test test/mask.tests.js --project=chromium"

  hdr "Run one test"
  bullet 'npx playwright test -g "test name pattern" --project=chromium'
}

# ── Topic: pug ───────────────────────────────────────────────────────────────

topic_pug() {
  title "Pug-based Tests"

  say "Some classic tests use Pug templates compiled on-the-fly by a local HTTP"
  say "server (started by test/src/lib/test/helpers.js).  The server reads files"
  say "from disk on every request — it never caches."

  hdr "Affected suites"
  bullet "events.tests.js"
  bullet "general.tests.js"
  bullet "mixin_types.tests.js"

  hdr "How they work"
  bullet "Each test calls renderPug() which creates an HTML file with a random suffix"
  bullet "The file is served via http://127.0.0.1:<port>/test/tmp/<name>.html"
  bullet "The HTML references ../../dist/SmarkForm.umd.js — must run npm run build first"
  bullet "The onClosed() callback deletes the temp file after the test finishes"

  hdr "Known issues"
  bullet "Pug compilation takes ~1-2s per test; first test may time out when cold"
  bullet "If all Pug tests fail, kill leftover servers: pkill -f 'node.*test.*server'"
  bullet "Run with increased timeout: npx playwright test --timeout=60000"
  bullet "The server port increments if the first port is busy (logs to console)"
}

# ── Topic: prerequisites ─────────────────────────────────────────────────────

topic_prerequisites() {
  title "Prerequisites"

  say "Always run before testing:"
  say ""
  say "  1. npm run build"
  say "     Generates dist/SmarkForm.esm.js and dist/SmarkForm.umd.js"
  say ""
  say "  2. node scripts/collect-docs-examples.js"
  say "     Scans docs/ for {% include sampletabs_tpl %} blocks"
  say "     → writes test/.cache/docs_examples.json"
  say ""
  say "  Or use the combined script:"
  say "     npm run pretest"
  say "     (also runs scripts/validate-cheatsheet.js)"

  hdr "Skipping build"
  say "  If dist/ is already fresh and you only changed test code, set:"
  say "     PW_TEST_SKIP_BUILD=1 npx playwright test"
}

# ── Topic: workers ───────────────────────────────────────────────────────────

topic_workers() {
  title "Parallel Workers"

  hdr "Default behaviour"
  bullet "Playwright auto-detects CPU cores and runs that many parallel workers"
  bullet "Co-located tests can benefit from more workers (many independent examples)"
  bullet "Classic tests share a Pug server — too many workers may cause port conflicts"

  hdr "Setting workers"
  bullet "npx playwright test --workers=4          # 4 parallel workers"
  bullet "npx playwright test --workers=1          # serial (useful for debugging)"
  bullet "Set in playwright.config.js:  workers: 4"

  hdr "CI considerations"
  bullet "CI machines often have fewer cores — Pin workers explicitly"
  bullet "The co-located test runner already serialises within each file"
  bullet "Timeout increases linearly with worker count (cold Pug server per worker)"
}

# ── Topic: debugging ─────────────────────────────────────────────────────────

topic_debugging() {
  title "Debugging"

  hdr "View last report"
  bullet "npx playwright show-report"

  hdr "Trace viewer (recorded on failure)"
  bullet "npx playwright show-trace test-results/<...>/trace.zip"

  hdr "Run headed (see browser)"
  bullet "npx playwright test --headed"
  bullet "npx playwright test --headed --slowMo=500   # slow motion"

  hdr "Debug one test step by step"
  bullet "npx playwright test --debug -g 'test name'"

  hdr "Common problems"
  bullet "Tests can't find window.myForm  →  constructor crashed; check console"
  bullet "All Pug tests fail              →  kill leftover server: pkill -f 'node.*test.*server'"
  bullet "TypeError from isSerializable  →  an option contains a function; strip on_* / smark_*"
  bullet "Timeout waiting for rendered    →  render phase threw; check page.on('pageerror')"
  bullet "collector says 'Cannot parse'  →  Jekyll include has syntax error in the .md file"
}

# ── Topic: files ─────────────────────────────────────────────────────────────

topic_files() {
  title "Key Files"

  printf "  %-45s %s\n" "test/.cache/docs_examples.json" "Generated manifest of all docs examples"
  printf "  %-45s %s\n" "test/co_located_tests.tests.js" "Co-located test runner (read for helpers)"
  printf "  %-45s %s\n" "test/co_located_tests_smoke.include.js" "Smoke check assertions"
  printf "  %-45s %s\n" "test/co_located_tests_validation.tests.js" "Manifest validation"
  printf "  %-45s %s\n" "scripts/collect-docs-examples.js" "Docs example scanner"
  printf "  %-45s %s\n" "scripts/validate-cheatsheet.js" "Cheatsheet integrity checker"
  printf "  %-45s %s\n" "scripts/test_quick.sh" "Pick a random browser + run"
  printf "  %-45s %s\n" "scripts/test_pick.sh" "Interactive test file picker"
  printf "  %-45s %s\n" "src/lib/test/helpers.js" "renderPug / renderHtml / test server"
  printf "  %-45s %s\n" "test/doc/WRITING_TESTS.md" "How to write new tests"
  printf "  %-45s %s\n" "test/doc/IMPLEMENTATION_DETAILS.md" "Test infrastructure internals"
  printf "  %-45s %s\n" "playwright.config.js" "Playwright configuration"
  printf "  %-45s %s\n" "dist/SmarkForm.umd.js" "UMD bundle loaded by test pages"
}

# ── Topic: commands ──────────────────────────────────────────────────────────

topic_commands() {
  title "All Test Commands"

  say "npm test                                    Full matrix, all browsers"
  say "npm run test:quick                          One random browser"
  say "npm run test:pick                           Interactive file picker"
  say "npm run pretest                             Build + collect + validate"
  say "npm run test:help                           This overview"
  say "npm run test:help <topic>                   Detailed topic info"
  say ""
  say "npx playwright test --project=chromium      Chromium only"
  say "npx playwright test --project=chromium --headed    With visible browser"
  say "npx playwright test --debug                          Step debugger"
  say "npx playwright test -g 'pattern'                     Grep test names"
  say "npx playwright test --workers=4                       Parallel workers"
  say "npx playwright test --timeout=60000                   60s per-test timeout"
  say "npx playwright test test/mask.tests.js                Single file"
  say "npx playwright test test/mask.tests.js:42             Single test at line"
  say "npx playwright show-report                            HTML report"
  say "npx playwright show-trace <zip>                       Trace viewer"
}

# ── Dispatch ─────────────────────────────────────────────────────────────────

case "$TOPIC" in
  overview|"")      topic_overview ;;
  co-located)       topic_co_located ;;
  classic)          topic_classic ;;
  pug)              topic_pug ;;
  prerequisites)    topic_prerequisites ;;
  workers)          topic_workers ;;
  debugging)        topic_debugging ;;
  files)            topic_files ;;
  commands)         topic_commands ;;
  *)
    say "Unknown topic: $TOPIC"
    overview_topics
    exit 1
    ;;
esac
