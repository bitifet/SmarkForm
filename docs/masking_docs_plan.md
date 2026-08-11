# Field Masking Documentation — Improvement Plan

## Overview

The field_masking.md page needs several fixes and improvements. This document
breaks the work into independent runs that can be committed separately.

## Run 1: Fix Custom Mask Example (No Library) — UNKNOWN_TYPE Bug

**Goal:** Diagnose and fix the `type:"text"` → UNKNOWN_TYPE render error.

**Steps:**
1. Change the Custom Mask example from `tests=false` to a real co-located test
   that validates the field renders (not as error).
2. Run the test → fails (UNKNOWN_TYPE).
3. Diagnose: `type:"text"` is not a registered SmarkForm type; the correct type
   is `"input"`.
4. Fix the example: `type:"text"` → `type:"input"`.
5. Test passes.
6. Commit.

**Files:**
- `docs/_advanced_concepts/field_masking.md` (Custom Mask section)
- `test/declarative_mask.tests.js` (optional: add test there too)

---

## Run 2: Fix All Examples — Add Proper Wrapper Element

**Goal:** All 5 sampletabs examples (CC, Price, Custom, Singleton, Validation)
use `id="myForm$$"` pattern so the playground wrapper works correctly.

**Steps:**
1. Review each example: ensure HTML has `id="myForm$$"` form root.
2. Fix JS selector to `new SmarkForm("#myForm-{formId}")`.
3. Verify export() produces expected nested structure.
4. Update `AGENTS.md` / `AGENTS/Documentation-Examples.md` with the pattern
   rule.
5. Commit.

**Note:** Wait — the sampletabs template already replaces `$$` with `-{formId}`.
But examples in field_masking.md use custom ids like `id="payment"`. This works
for simple previews but breaks in the playground editor because the "demo"
subform wrapping doesn't see the expected structure. Fix all of them.

---

## Run 3: Enhance Credit Card Example + Validation

**Goal:** Make the credit card factory export `null` for invalid numbers.
Evolve the Validation section or merge it with the credit card example.

**Steps:**
1. Evolve credit card factory to check `imask.masked.isValid` and return null
   when invalid, or let the mask instance handle it.
2. Add a note explaining why this is desirable (SmarkForm philosophy: don't
   export invalid data).
3. Rework the Validation section — if credit card already demonstrates
   validation, the separate Validation section may be redundant.
4. Commit.

---

## Run 4: Merge Singleton into Custom Mask + Improve Notes

**Goal:** Replace the awkward singleton quantity example with a phone-in-list
example that naturally demonstrates both custom masking and singleton+list.

**Steps:**
1. Rewrite the "Phone (digits only)" custom mask into a phone list example
   (list of phone numbers, each wrapped in a singleton, with a remove button).
2. Remove the standalone "Singleton (Single Field) Masking" section.
3. Add a brief note in the phone example's Notes tab pointing out the singleton
   usage.
4. Review and improve/reorganize/remove all Notes across all examples.
   - No "Try it!" motivational junk.
   - Notes should provide genuine insight or be removed.
5. Commit.

---

## Run 5: Sampletabs Smoke Test (Evaluation Only)

**Goal:** Evaluate viability of a smoke test that checks all sampletabs
examples render without error indicators.

**Steps:**
1. Analyze feasibility: can a Playwright test detect SmarkForm inline error
   indicators across all examples?
2. Review all existing examples to check for false positives.
3. Document recommendations.

**Result: Deferred — not worth implementing.**

Analysis found that every SmarkForm render error (`handleRenderError`) both:
- Replaces the failed node with a `<div title="RenderError(...)">` DOM indicator
- Logs `console.error(error)` — which the existing co-located test framework
  already detects via its `expectedConsoleErrors` assertion.

A DOM indicator check would detect the **exact same signal** as the existing
console error counter. There is no scenario today where a DOM indicator appears
without a corresponding console error. Adding DOM detection is redundant.

**If the implementation changes in the future** (e.g., error indicators get CSS
classes, or the `console.error` call is removed from `handleRenderError`), the
strategy would be:

1. Add `page.locator('[title^="RenderError("]').count()` to
   `test/co_located_tests_smoke.include.js`
2. Parallel `expectedErrorIndicators` to `expectedConsoleErrors`
3. The 5 intentional-error examples get `expectedErrorIndicators=1`

For now, no code changes needed.
