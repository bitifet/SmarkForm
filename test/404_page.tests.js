import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../docs/404.html', import.meta.url), 'utf8');
const script = source.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];

test('404 animation control script is present and valid', () => {
  expect(script, '404 page has an inline animation control').toBeTruthy();
  expect(() => new Function(script)).not.toThrow();
  expect(source).toContain('prefers-reduced-motion: reduce');
  expect(source).toContain('nested_data-poster.png');
});

test('404 animation starts still for reduced motion and can be played or paused', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setContent(`
    <img id="not-found-nested-data" src="poster.png"
      data-static-src="poster.png" data-animated-src="nested_data.gif">
    <button class="not-found-animation-toggle" hidden>Play demo animation</button>
    <script>${script}</script>
  `);

  const image = page.locator('#not-found-nested-data');
  const toggle = page.locator('.not-found-animation-toggle');
  await expect(image).toHaveAttribute('src', 'poster.png');
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveText('Play demo animation');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');

  await toggle.click();
  await expect(image).toHaveAttribute('src', 'nested_data.gif');
  await expect(toggle).toHaveText('Pause demo animation');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');

  await toggle.click();
  await expect(image).toHaveAttribute('src', 'poster.png');
  await expect(toggle).toHaveText('Play demo animation');
});

test('404 animation pauses when reduced motion is enabled after playback starts', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setContent(`
    <img id="not-found-nested-data" src="poster.png"
      data-static-src="poster.png" data-animated-src="nested_data.gif">
    <button class="not-found-animation-toggle" hidden>Play demo animation</button>
    <script>${script}</script>
  `);

  const image = page.locator('#not-found-nested-data');
  const toggle = page.locator('.not-found-animation-toggle');
  await expect(image).toHaveAttribute('src', 'nested_data.gif');
  await expect(toggle).toHaveText('Pause demo animation');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(image).toHaveAttribute('src', 'poster.png');
  await expect(toggle).toHaveText('Play demo animation');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
});
