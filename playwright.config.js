import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    channel: 'chrome',
    viewport: { width: 390, height: 844 },
  },
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 20000,
  },
  projects: [
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, channel: 'chrome' } },
  ],
})
