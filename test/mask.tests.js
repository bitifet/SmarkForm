import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

const pugSrc = (// {{{
`extends layout.pug
block mainForm
    .section
        // Plain text field - type must NOT be changed
        p
            label Text Field
            input(
                data-smark
                name="textField"
                type="text"
            )

        // Number field - type must be changed to "text" for masking
        p
            label Number Field
            input(
                data-smark={
                    type: "number",
                    name: "numberField"
                }
                type="number"
            )

        // Date field - type must be changed to "text" for masking
        p
            label Date Field
            input(
                data-smark={
                    type: "date",
                    name: "dateField"
                }
                type="date"
            )

        // Singleton number (mask called on outer singleton component)
        div(data-smark={
            type: "number",
            name: "singletonNumber"
        })
            p
                label Singleton Number
                input(data-smark type="number")
`);// }}}

test.describe('mask() method', () => {
    const test_title = 'mask() method';

    test('changes input type to "text" for number fields', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                const field = form.find("/numberField");
                await field.import(42); // ensure rendered
                const typeBefore = field.targetFieldNode.getAttribute("type");
                field.mask(() => null);
                const typeAfter = field.targetFieldNode.getAttribute("type");
                return { typeBefore, typeAfter, originalType: field._originalType };
            });

            expect(result.typeBefore).toBe("number");
            expect(result.typeAfter).toBe("text");
            expect(result.originalType).toBe("number");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('changes input type to "text" for date fields', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                const field = form.find("/dateField");
                await field.import("2024-01-15");
                const typeBefore = field.targetFieldNode.getAttribute("type");
                field.mask(() => null);
                const typeAfter = field.targetFieldNode.getAttribute("type");
                return { typeBefore, typeAfter, originalType: field._originalType };
            });

            expect(result.typeBefore).toBe("date");
            expect(result.typeAfter).toBe("text");
            expect(result.originalType).toBe("date");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('does not change type for plain text fields', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                const field = form.find("/textField");
                await field.import("hello");
                const typeBefore = field.targetFieldNode.getAttribute("type");
                field.mask(() => null);
                const typeAfter = field.targetFieldNode.getAttribute("type");
                return { typeBefore, typeAfter, originalType: field._originalType };
            });

            expect(result.typeBefore).toBe("text");
            expect(result.typeAfter).toBe("text");
            expect(result.originalType).toBeUndefined();
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('calls callback with the targetFieldNode', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                const field = form.find("/numberField");
                await field.import(99);
                let receivedNode = null;
                field.mask(node => {
                    receivedNode = node;
                    return null;
                });
                return {
                    isSameNode: receivedNode === field.targetFieldNode,
                    tagName: receivedNode?.tagName,
                };
            });

            expect(result.isSameNode).toBe(true);
            expect(result.tagName).toBe("INPUT");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('returns the component itself for chaining', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                const field = form.find("/textField");
                await field.import("hi");
                const returned = field.mask(() => null);
                return returned === field;
            });

            expect(result).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('export() uses _maskInstance.unmaskedValue when provided', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                const field = form.find("/textField");
                await field.import("original");
                // Apply mock mask: displays formatted value but tracks unmasked separately
                const mockMask = { unmaskedValue: "raw_value" };
                field.mask(node => {
                    node.value = "formatted_value"; // mask changes display
                    return mockMask;
                });
                // export() should return unmaskedValue, not the formatted display value
                const exported = await field.export();
                return { exported, displayValue: field.targetFieldNode.value };
            });

            expect(result.exported).toBe("raw_value");
            expect(result.displayValue).toBe("formatted_value");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('number field export() still returns a JS number when mask provides unmaskedValue', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                const field = form.find("/numberField");
                await field.import(1234.56);
                // Mock a number mask: display "1,234.56", unmasked "1234.56"
                const mockMask = { unmaskedValue: "1234.56" };
                field.mask(node => {
                    node.value = "1,234.56"; // formatted display
                    return mockMask;
                });
                const exported = await field.export();
                return { exported, type: typeof exported };
            });

            expect(result.exported).toBe(1234.56);
            expect(result.type).toBe("number");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('export() falls back to nodeFld.value when no unmaskedValue', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                const field = form.find("/textField");
                await field.import("hello");
                // mask returns an object WITHOUT unmaskedValue
                field.mask(() => ({ someOtherProp: true }));
                const exported = await field.export();
                return exported;
            });

            expect(result).toBe("hello");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('export() falls back to nodeFld.value when callback returns null', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                const field = form.find("/textField");
                await field.import("world");
                field.mask(() => null);
                const exported = await field.export();
                return exported;
            });

            expect(result).toBe("world");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('singleton: mask() delegates to inner field', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                const singleton = form.find("/singletonNumber");
                await singleton.import(100);
                const returned = singleton.mask(() => null);
                return {
                    // mask() returns the outer singleton component
                    returnedIsSingleton: returned === singleton,
                    // _maskInstance is on the inner field, not the singleton itself
                    innerHasMask: singleton.children[""]._maskInstance !== undefined,
                    outerHasNoMask: singleton._maskInstance === undefined,
                    // type is changed on the actual input element
                    inputType: singleton.targetFieldNode.getAttribute("type"),
                };
            });

            expect(result.returnedIsSingleton).toBe(true);
            expect(result.innerHasMask).toBe(true);
            expect(result.outerHasNoMask).toBe(true);
            expect(result.inputType).toBe("text");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('singleton: export() still returns correct number type after masking', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                const singleton = form.find("/singletonNumber");
                await singleton.import(42);
                const mockMask = { unmaskedValue: "42" };
                singleton.mask(node => {
                    node.value = "42.00"; // formatted display
                    return mockMask;
                });
                const exported = await singleton.export();
                return { exported, type: typeof exported };
            });

            expect(result.exported).toBe(42);
            expect(result.type).toBe("number");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('import() dispatches input event on masked field', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                const field = form.find("/textField");
                await field.import("initial");
                let inputEventCount = 0;
                const mockMask = { unmaskedValue: "" };
                field.mask(node => {
                    node.addEventListener("input", () => {
                        inputEventCount++;
                        mockMask.unmaskedValue = node.value;
                    });
                    return mockMask;
                });
                await field.import("updated");
                return { inputEventCount, unmaskedValue: mockMask.unmaskedValue };
            });

            expect(result.inputEventCount).toBeGreaterThanOrEqual(1);
            expect(result.unmaskedValue).toBe("updated");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('import() does NOT dispatch extra input event on unmasked field', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                const field = form.find("/textField");
                await field.import("initial");
                let inputEventCount = 0;
                field.targetFieldNode.addEventListener("input", () => {
                    inputEventCount++;
                });
                // No mask applied
                await field.import("no mask");
                return { inputEventCount };
            });

            expect(result.inputEventCount).toBe(0);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

});
