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
  ],
  forbidOnly: !!process.env.CI,
});
