---
title: Testing Notes
nav_exclude: true
---

# Testing Notes

## Mobile Browser Coverage (PR #115)

### Background

The bug fixed in [PR #112](https://github.com/bitifet/SmarkForm/pull/112) affected
Chromium-based mobile browsers (e.g. Brave for Android). The root cause was that
Chromium uses `IME_ACTION_NEXT` when text inputs are inside a form that has more
inputs, causing the virtual keyboard "action button" to show **Next** instead of
**Done/Enter**. When tapped, Chromium calls `FocusNextElement()` at the native
layer — _bypassing JavaScript entirely_ — and then sends a synthetic
`KeyEvent(ENTER)`. SmarkForm's async keydown hook picked that up and advanced
focus a second time, skipping one field per keypress.

The fix sets `enterkeyhint="done"` on SmarkForm-managed text inputs during
`render()` so that Chromium uses `IME_ACTION_DONE` instead. SmarkForm's JS
`Enter` hook remains the sole navigation handler.

### Regression Tests

The tests for this fix live in `test/type_list.tests.js` under the section
heading:

```
// ─── Enter-key navigation inside a scalar list ────────────────────────────
```

There are five test cases exercised through `makeEnterNavTests()`:

| # | Test name | What it verifies |
|---|-----------|-----------------|
| 1 | `managed text inputs have enterkeyhint="done" set` | All SmarkForm-managed `<input>` elements inside a list have `enterkeyhint="done"` attribute |
| 2 | `IME-advance simulation: focus+keydown within threshold does not double-navigate` | When a native focus-advance + synthetic Enter (< 20 ms apart, as Chromium produces) is simulated, SmarkForm does **not** advance focus a second time |
| 3 | `Enter advances focus by exactly one list item` | Plain Enter keypress moves focus forward exactly one item |
| 4 | `Shift+Enter moves focus backwards by exactly one list item` | Shift+Enter moves focus backward exactly one item |
| 5 | `Sequential Enter presses advance focus one item at a time` | Pressing Enter twice from item 0 reaches item 1 then item 2, never skipping |

### Test run on current code (`HEAD`) under chromium-mobile — PASSES

```
npx playwright test --project=chromium-mobile \
  -g 'Enter-key navigation in scalar list' test/type_list.tests.js
```

Result: **5 passed**

```
[chromium-mobile] › Enter-key navigation in scalar list ›
    managed text inputs have enterkeyhint="done" set           ✓
    IME-advance simulation: …does not double-navigate          ✓
    Enter advances focus by exactly one list item              ✓
    Shift+Enter moves focus backwards by exactly one list item ✓
    Sequential Enter presses advance focus one item at a time  ✓
```

### Test run on tag `v0.13.1` (pre-fix) under chromium-mobile — FAILS

Steps taken:

```bash
git worktree add /tmp/smarkform-v0.13.1 0.13.1
cp test/type_list.tests.js     /tmp/smarkform-v0.13.1/test/
cp playwright.config.js        /tmp/smarkform-v0.13.1/
cd /tmp/smarkform-v0.13.1 && npm install && npm run build
node scripts/collect-docs-examples.js
npx playwright test --project=chromium-mobile \
  -g 'Enter-key navigation in scalar list' test/type_list.tests.js
```

Result: **2 failed, 3 passed**

```
  1) managed text inputs have enterkeyhint="done" set
     Error: expect(received).toBe(expected)
     Expected: "done"
     Received: null       ← enterkeyhint not set in old code

  2) IME-advance simulation: focus+keydown within threshold does not double-navigate
     Error: expect(received).toBe(expected)
     Expected: 1
     Received: 2          ← focus advanced twice (the original bug)
```

The three basic navigation tests (3–5) pass even on the old code because they
only test the JS-driven navigation path, which worked correctly before the fix.
The double-advance bug is exposed specifically by test #2 which simulates the
Chromium IME native-focus + synthetic Enter sequence.
