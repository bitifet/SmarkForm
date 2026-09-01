// test/mask_imask.tests.js
// ========================
// Playwright tests for the IMask credit-card example ("card" mask) used in
// the docs (docs/_working_with_forms/field_masking.md and showcase).
// Replicates the mask factory verbatim so a broken example can't hide behind
// a passing smoke test — specifically the runtime import()/export() path.

import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

// Verbatim copy of the "card" mask factory from the docs example.
// When this drifts from docs/_working_with_forms/field_masking.md (mask_cc_js)
// or docs/_about/showcase.md (showcase_mask_js), update both copies together.
const cardMaskPreScript = `
SmarkForm.registerMask("card", (node) => {
  node.placeholder = "0000 0000 0000 0000";
  node.inputMode = "numeric";

  let showLazy = true;
  const imask = new IMask(node, {
    mask: "0000 0000 0000 0000",
    lazy: true,
  });

  let prevValue = node.value;
  let lastKey = "";
  node.addEventListener("keydown", (e) => { lastKey = e.key; });
  node.addEventListener("input", () => {
    const hasContent = imask.masked.unmaskedValue.length > 0;
    if (hasContent && showLazy) {
      showLazy = false;
      imask.updateOptions({
        mask: "0000 0000 0000 0000",
        lazy: false,
        placeholderChar: "_",
      });
    } else if (!hasContent && !showLazy) {
      showLazy = true;
      imask.updateOptions({
        mask: "0000 0000 0000 0000",
        lazy: true,
      });
    }
    if (node.value === prevValue && node === document.activeElement) {
      if (lastKey !== "Backspace" && lastKey !== "Delete") {
        node.style.boxShadow = "0 0 0 2px #f80";
        setTimeout(() => node.style.boxShadow = "", 250);
      }
    }
    prevValue = node.value;
    const raw = imask.masked.unmaskedValue;
    const showError = raw.length > 0 && !imask.masked.isComplete;
    node.setCustomValidity(showError ? "Please enter the full 16-digit card number" : "");
  });

  return {
    get unmaskedValue() {
      return imask.masked.isComplete ? imask.masked.unmaskedValue : null;
    },
    set unmaskedValue(v) {
      // Use IMask's top-level setter (syncs the DOM via updateControl).
      imask.unmaskedValue = v;
      // IMask diffs an "input" event against its last saved selection, which
      // is only refreshed on focus/keydown. Since SmarkForm dispatches an
      // "input" event after every import, a stale selection would make IMask
      // read the imported value as a duplicate insertion (e.g. "4111" →
      // "4111 4111"). Sync caret and selection to the end instead.
      const len = node.value.length;
      node.setSelectionRange(len, len);
      imask._selection = { start: len, end: len };
    },
  };
});
`;

const pugSrc = `extends layout.pug
block mainForm
    script(src="https://cdn.jsdelivr.net/npm/imask@6.6.3")
    div#myForm
        div(data-smark={type:"form", name:"payment"})
            p
                label Card Number:
                input(
                    data-smark={type:"number", name:"cardNumber", mask:"card"}
                    type="number"
                )
`;

async function setup(page) {
    const rendered = await renderPug({
        title: 'mask_imask',
        src: pugSrc,
        preScript: cardMaskPreScript,
    });
    await page.goto(rendered.url);
    await page.evaluate(() => window.form.rendered);
    return rendered;
}

test('IMask card: runtime import shows formatted value and exports number', async ({ page }) => {
    let onClosed;
    try {
        const rendered = await setup(page);
        onClosed = rendered.onClosed;

        const result = await page.evaluate(async () => {
            const field = form.find("/payment/cardNumber");
            const node = field.targetFieldNode;
            await field.import("4111111111111111");
            return {
                value: node.value,
                invalid: node.matches(":invalid"),
                exported: await field.export(),
                formData: await form.export(),
            };
        });
        expect(result.value).toBe("4111 1111 1111 1111");
        expect(result.invalid).toBe(false);
        expect(result.exported).toBe(4111111111111111);
        expect(result.formData).toEqual({ payment: { cardNumber: 4111111111111111 } });

        // Round trip: the imported value re-exports identically.
        await page.evaluate(async () => {
            await form.import({ payment: { cardNumber: "4111111111111111" } });
        });
        const reExported = await page.evaluate(() => form.export());
        expect(reExported).toEqual({ payment: { cardNumber: 4111111111111111 } });
    } finally {
        if (onClosed) await onClosed();
    }
});

test('IMask card: incomplete import exports null and marks field invalid', async ({ page }) => {
    let onClosed;
    try {
        const rendered = await setup(page);
        onClosed = rendered.onClosed;

        const result = await page.evaluate(async () => {
            const field = form.find("/payment/cardNumber");
            const node = field.targetFieldNode;
            await field.import("4111");
            return {
                value: node.value,
                invalid: node.matches(":invalid"),
                exported: await field.export(),
            };
        });
        expect(result.value).toBe("4111 ____ ____ ____");
        expect(result.invalid).toBe(true);
        expect(result.exported).toBe(null);
    } finally {
        if (onClosed) await onClosed();
    }
});