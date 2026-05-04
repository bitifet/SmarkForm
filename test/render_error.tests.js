import { test, expect } from '@playwright/test';
import { renderPug } from '../src/lib/test/helpers.js';

test.describe('RenderError isolation', () => {
    const testTitle = 'RenderError isolation';

    test('sibling components still render after a renderError', async ({ page }) => {
        let onClosed;
        const pugSrc = (
`extends layout.pug
block mainForm
    input(
        data-smark={
            name: "bad",
            value: "from-option",
        }
        name="bad"
        value="from-attr"
    )
    input(
        data-smark={
            name: "good",
        }
        name="good"
    )
`);
        try {
            const rendered = await renderPug({
                title: testTitle,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            await expect(page.getByText('VALUE_CONFLICT')).toBeVisible({ timeout: 3000 });
            await page.waitForFunction(() => window.form?.find?.('good'), null, { timeout: 2000 });

            const goodPath = await page.evaluate(() => window.form.find('good').getPath());
            expect(goodPath).toBe('/good');
        } finally {
            if (onClosed) await onClosed();
        }
    });
});
