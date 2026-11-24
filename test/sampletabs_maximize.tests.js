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
    const logoSvg = (width, height) => `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`
    )}`;
    const logoUrls = {
        fullLight: logoSvg(410, 100),
        fullDark: logoSvg(410, 100),
        compactLight: logoSvg(111, 100),
        compactDark: logoSvg(111, 100),
    };
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

    return {logoUrls, html: `<!doctype html>
<html><head><style>${controllerStyles}</style></head><body>
  <main>
    <div id="background-content">Page content behind the preview</div>
    <div id="example-max" class="tab-container" data-default-tab="preview">
      <a class="link-anchor" href="#example-max">Link</a>
      <div class="tab-labels">
        <div class="smarkform-tab-label-group">
          <a class="tab-label tab-label-active" href="#example-max:preview" data-tab="preview">Preview</a>
          <a class="tab-label" href="#example-max:html" data-tab="html">HTML</a>
          <a class="tab-label tab-label-right" href="#example-max:notes" data-tab="notes">Notes</a>
        </div>
        <div class="smarkform-maximized-brand"><img alt="SmarkForm"
          data-full-light="${logoUrls.fullLight}" data-full-dark="${logoUrls.fullDark}"
          data-compact-light="${logoUrls.compactLight}" data-compact-dark="${logoUrls.compactDark}"></div>
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
      <div class="tab-content tab-content-notes"><p>Notes text should remain readable in a wide preview. This paragraph represents a longer note with enough content to show the intended line-length limit.</p></div>
      <script type="application/json" class="smarkform-src-data">${JSON.stringify(data)}</script>
    </div>
  </main>
  <script>${controllerScript}</script>
</body></html>`};
}

test('sampletabs maximize toggles the viewport overlay and restores with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.setContent(sampletabsFixture().html);

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
    await expect(container.locator('.tab-label[data-tab="preview"]')).toBeFocused();
    await frame.locator('.smarkform-editor-clear').focus();
    await page.keyboard.press('Escape');
    await expect(container).not.toHaveClass(/smarkform-maximized/);
    await expect(button).toBeFocused();
    await expect(button).toHaveText('🗖');
});

test('sampletabs maximized editor moves to the right and rotates its action rail in landscape', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.setContent(sampletabsFixture().html);
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
    await page.setContent(sampletabsFixture().html);
    await page.locator('.smarkform-maximize-btn').click();

    const frame = page.frameLocator('.smarkform-preview-frame');
    const stack = frame.locator('.smarkform-editor-stack');
    await expect.poll(() => stack.evaluate(node => getComputedStyle(node).display)).toBe('flex');
    await expect.poll(() => frame.locator('.smarkform-editor-actions').evaluate(node => getComputedStyle(node).transform)).toBe('none');
    const portraitEditorLayout = await frame.locator('body').evaluate(body => {
        const editor = body.querySelector('.smarkform-json-editor');
        const demo = body.querySelector('.smarkform-editor-demo');
        return {
            viewportHeight: document.documentElement.clientHeight,
            editorHeight: editor.getBoundingClientRect().height,
            demoHeight: demo.getBoundingClientRect().height,
        };
    });
    expect(portraitEditorLayout.editorHeight)
        .toBeLessThanOrEqual(portraitEditorLayout.viewportHeight * 0.4 + 2);
    expect(portraitEditorLayout.demoHeight).toBeGreaterThan(100);
});

test('maximized tabbar moves Notes left and chooses the logo variant that fits', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const fixture = sampletabsFixture();
    await page.setContent(fixture.html);
    const container = page.locator('#example-max');
    const button = container.locator('.smarkform-maximize-btn');
    const tabbar = container.locator('.tab-labels');
    const notes = container.locator('.tab-label[data-tab="notes"]');
    const preview = container.locator('.tab-label[data-tab="preview"]');
    const brand = container.locator('.smarkform-maximized-brand');
    const logo = brand.locator('img');

    await expect(brand).toBeHidden();
    await button.click();
    const dark = await page.evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches);
    await expect(logo).toHaveAttribute('src', dark ? fixture.logoUrls.fullDark : fixture.logoUrls.fullLight);
    await expect.poll(() => logo.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    await page.evaluate(() => new Promise(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
    ));
    const leftOrder = await Promise.all([
        preview.boundingBox(), notes.boundingBox(), brand.boundingBox(),
    ]);
    expect(leftOrder[0].x).toBeLessThan(leftOrder[1].x);
    expect(leftOrder[1].x + leftOrder[1].width).toBeLessThan(leftOrder[2].x);
    const tabbarBox = await tabbar.boundingBox();
    const logoBox = await logo.boundingBox();
    expect(logoBox.height).toBeGreaterThan(50);
    const alignmentTolerance = 3; // Allow fractional CSS-pixel rounding after responsive image load.
    expect(Math.abs((leftOrder[2].y + leftOrder[2].height / 2)
        - (tabbarBox.y + tabbarBox.height / 2))).toBeLessThan(alignmentTolerance);
    expect(Math.abs((leftOrder[0].y + leftOrder[0].height)
        - (tabbarBox.y + tabbarBox.height))).toBeLessThan(alignmentTolerance);
    expect(Math.abs((leftOrder[1].y + leftOrder[1].height)
        - (tabbarBox.y + tabbarBox.height))).toBeLessThan(alignmentTolerance);
    expect(tabbarBox.x + tabbarBox.width - (leftOrder[2].x + leftOrder[2].width)).toBeGreaterThan(14);

    await tabbar.evaluate(node => { node.style.width = '280px'; });
    await expect(logo).toHaveAttribute('src', dark ? fixture.logoUrls.compactDark : fixture.logoUrls.compactLight);

    await notes.click();
    const noteLayout = await container.locator('.tab-content-notes p').evaluate(paragraph => ({
        width: paragraph.getBoundingClientRect().width,
        maxWidth: parseFloat(getComputedStyle(paragraph).maxWidth),
        panelWidth: paragraph.parentElement.getBoundingClientRect().width,
    }));
    expect(noteLayout.maxWidth).toBeLessThan(noteLayout.panelWidth);
    expect(noteLayout.width).toBeLessThanOrEqual(noteLayout.maxWidth + 1);
});

test('sampletab geometry animation is skipped when reduced motion is requested', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.setContent(sampletabsFixture().html);
    await page.evaluate(() => {
        const animate = Element.prototype.animate;
        window.__sampletabAnimations = [];
        Element.prototype.animate = function(...args) {
            window.__sampletabAnimations.push(args);
            return animate.apply(this, args);
        };
    });
    await page.emulateMedia({reducedMotion: 'no-preference'});
    const container = page.locator('#example-max');
    const button = container.locator('.smarkform-maximize-btn');
    await button.click();
    await expect.poll(() => page.evaluate(() => window.__sampletabAnimations.length)).toBe(1);

    await page.emulateMedia({reducedMotion: 'reduce'});
    await button.click();
    await expect(container).not.toHaveClass(/smarkform-maximized/);
    expect(await page.evaluate(() => window.__sampletabAnimations.length)).toBe(1);
});
