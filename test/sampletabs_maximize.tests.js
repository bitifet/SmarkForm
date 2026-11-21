import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const controller = readFileSync(
    new URL('../docs/_includes/components/sampletabs_ctrl.md', import.meta.url),
    'utf8'
);
const controllerScript = controller.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
const controllerStyles = controller.match(/<style>\s*([\s\S]*?)<\/style>/)?.[1];

if (!controllerScript || !controllerStyles) {
    throw new Error('Could not extract the sampletabs controller script and styles');
}

function sampletabsFixture() {
    const data = {
        html: '<div id="myForm$$"><p>Preview content</p></div>',
        htmlSource: '<div id="myForm$$"><p>Preview content</p></div>',
        css: '-',
        cssHidden: '-',
        jsHead: '-',
        jsHeadDisplay: '-',
        jsHeadDisplayWithEditor: '-',
        jsHidden: '-',
        jsSource: '-',
        demoValue: '-',
        showEditor: true,
        editorToggleDisabled: false,
        minHeight: 0,
        smarkformUrl: 'data:text/javascript,',
    };

    return `<!doctype html>
<html><head><style>${controllerStyles}</style></head><body>
  <main>
    <div id="background-content">Page content behind the preview</div>
    <div id="example-max" class="tab-container" data-default-tab="preview">
      <a class="link-anchor" href="#example-max">Link</a>
      <div class="tab-labels">
        <a class="tab-label tab-label-active" data-tab="preview">Preview</a>
        <a class="tab-label" data-tab="html">HTML</a>
      </div>
      <div class="smarkform-edit-toolbar">
        <label><input type="checkbox" class="smarkform-edit-toggle"> Edit</label>
        <label class="smarkform-show-editor-label"><input type="checkbox" class="smarkform-show-editor-toggle" checked> Show editor</label>
        <label class="smarkform-include-editor-label" style="display:none"><input type="checkbox" class="smarkform-include-editor-toggle"> Include editor</label>
        <button class="smarkform-run-btn" style="display:none">Run</button>
        <button type="button" class="smarkform-maximize-btn" title="Maximize" aria-label="Maximize" aria-pressed="false">🗖 </button>
        <a class="smarkform-playground-help" href="#help">❓</a>
      </div>
      <div class="tab-content tab-content-preview tab-active">
        <div class="smarkform_example" style="overflow:auto">
          <div class="smarkform-preview-spinner"></div>
          <iframe class="smarkform-preview-frame" style="width:100%;border:none;display:none"></iframe>
          <div class="smarkform-resize-handle"></div>
        </div>
      </div>
      <div class="tab-content tab-content-html tab-code"><pre>Example source</pre></div>
      <script type="application/json" class="smarkform-src-data">${JSON.stringify(data)}</script>
    </div>
  </main>
  <script>${controllerScript}</script>
</body></html>`;
}

test('sampletabs maximize toggles the viewport overlay and restores with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.setContent(sampletabsFixture());

    const container = page.locator('#example-max');
    const button = container.locator('.smarkform-maximize-btn');
    await expect(button).toHaveAttribute('title', 'Maximize');
    await button.click();

    await expect(container).toHaveClass(/smarkform-maximized/);
    await expect(container).toHaveAttribute('role', 'dialog');
    await expect(container).toHaveAttribute('aria-modal', 'true');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(button).toHaveAttribute('title', 'Restore');
    await expect(button).toHaveText('🗗');
    await expect(page.locator('body')).toHaveClass(/smarkform-has-maximized-sampletab/);
    await expect(page.locator('#background-content')).toHaveJSProperty('inert', true);
    await expect.poll(() => container.evaluate(node => getComputedStyle(node).position)).toBe('fixed');

    await page.keyboard.press('Escape');
    await expect(container).not.toHaveClass(/smarkform-maximized/);
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await expect(button).toHaveAttribute('title', 'Maximize');
    await expect(page.locator('body')).not.toHaveClass(/smarkform-has-maximized-sampletab/);
    await expect(page.locator('#background-content')).toHaveJSProperty('inert', false);
    await expect(button).toBeFocused();

    await button.click();
    const frame = page.frameLocator('.smarkform-preview-frame');
    await frame.locator('.smarkform-editor-clear').focus();
    await frame.locator('.smarkform-editor-clear').press('Tab');
    await expect(container.locator('.smarkform-edit-toggle')).toBeFocused();
    await frame.locator('.smarkform-editor-clear').focus();
    await page.keyboard.press('Escape');
    await expect(container).not.toHaveClass(/smarkform-maximized/);
    await expect(button).toBeFocused();
    await expect(button).toHaveText('🗖');
});

test('sampletabs maximized editor moves to the right and rotates its action rail in landscape', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.setContent(sampletabsFixture());
    const container = page.locator('#example-max');
    await container.locator('.smarkform-maximize-btn').click();

    const frame = page.frameLocator('.smarkform-preview-frame');
    const stack = frame.locator('.smarkform-editor-stack');
    const rail = frame.locator('.smarkform-editor-actions');
    await expect(stack).toBeVisible();
    await expect.poll(() => stack.evaluate(node => getComputedStyle(node).display)).toBe('grid');
    await expect.poll(() => frame.locator('.smarkform-json-editor').evaluate(node => getComputedStyle(node).gridColumnStart)).toBe('3');
    await expect.poll(() => rail.evaluate(node => getComputedStyle(node).transform)).not.toBe('none');
    const railBox = await rail.boundingBox();
    expect(railBox.height).toBeGreaterThan(railBox.width);
});

test('sampletabs keeps the editor stacked in a maximized portrait preview', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.setContent(sampletabsFixture());
    await page.locator('.smarkform-maximize-btn').click();

    const frame = page.frameLocator('.smarkform-preview-frame');
    const stack = frame.locator('.smarkform-editor-stack');
    await expect.poll(() => stack.evaluate(node => getComputedStyle(node).display)).toBe('flex');
    await expect.poll(() => frame.locator('.smarkform-editor-actions').evaluate(node => getComputedStyle(node).transform)).toBe('none');
});
