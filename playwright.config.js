import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'test',
  testMatch: '**/*.tests.js',
  reporter: [['list'], ['html']],
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Chromium mobile emulation – catches bugs specific to Android/Brave-style
    // browsers (e.g. the IME_ACTION_NEXT double-advance regression fixed in
    // PR #112).  Included in `npm test` (full matrix) and `npm run test:quick`
    // (random-browser fast run) alike.
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 5'] },
    },
    // Also test for safari.
    {
      name: 'safari-mobile',
      use: { ...devices['iPhone 12'] },
    },
  ],
  forbidOnly: !!process.env.CI,
});
