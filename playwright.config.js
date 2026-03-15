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
    // PR #112).  Only included in `npm run test:full`; the default `npm test`
    // runs chromium desktop only for speed.
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 5'] },
    },
  ],
  forbidOnly: !!process.env.CI,
});
