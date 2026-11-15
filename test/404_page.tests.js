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
    <img id="not-found-animation-image-control" width="880" height="487" src="poster.png"
      data-static-src="poster.png" data-animated-src="nested_data.gif">
    <button id="not-found-animation-text-control" hidden>Play the demo</button>
    <script>${script}</script>
  `);

  const image = page.locator('#not-found-animation-image-control');
  const textControl = page.locator('#not-found-animation-text-control');
  await expect(image).toHaveAttribute('src', 'poster.png');
  await expect(image).toHaveAttribute('role', 'button');
  await expect(image).toHaveAttribute('aria-label', 'Play the demo');
  await expect(image).toHaveAttribute('aria-pressed', 'false');
  await expect(textControl).toHaveText('Play the demo');

  await image.click();
  await expect(image).toHaveAttribute('src', 'nested_data.gif');
  await expect(image).toHaveAttribute('aria-label', 'Pause the demo');
  await expect(image).toHaveAttribute('aria-pressed', 'true');
  await expect(textControl).toHaveText('Pause the demo');

  await textControl.click();
  await expect(image).toHaveAttribute('src', 'poster.png');
  await expect(textControl).toHaveText('Play the demo');
});

test('404 animation pauses when reduced motion is enabled after playback starts', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setContent(`
    <img id="not-found-animation-image-control" width="880" height="487" src="poster.png"
      data-static-src="poster.png" data-animated-src="nested_data.gif">
    <button id="not-found-animation-text-control" hidden>Play the demo</button>
    <script>${script}</script>
  `);

  const image = page.locator('#not-found-animation-image-control');
  await expect(image).toHaveAttribute('src', 'nested_data.gif');
  await expect(image).toHaveAttribute('aria-label', 'Pause the demo');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(image).toHaveAttribute('src', 'poster.png');
  await expect(image).toHaveAttribute('aria-label', 'Play the demo');
  await expect(image).toHaveAttribute('aria-pressed', 'false');
});
