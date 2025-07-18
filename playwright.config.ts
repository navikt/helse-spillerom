import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test'

const PORT = process.env.PORT || 3000

type OptionsType = { baseURL: string; timeout: number; server: PlaywrightTestConfig['webServer'] }
const opts: OptionsType = process.env.CI
    ? {
          baseURL: `http://localhost:3000`,
          timeout: 30 * 1000,
          server: undefined,
      }
    : process.env.FAST
      ? {
            baseURL: `http://localhost:${PORT}`,
            timeout: 30 * 1000,
            server: {
                command: 'npm run start:e2e',
                url: `http://localhost:${PORT}`,
                timeout: 120 * 1000,
                reuseExistingServer: !process.env.CI,
                stderr: 'pipe',
                stdout: 'pipe',
            },
        }
      : // Local dev server
        {
            baseURL: `http://localhost:${PORT}`,
            timeout: 120 * 2 * 1000,
            server: {
                command: 'NEXT_PUBLIC_IS_E2E=true npm run dev --turbo',
                url: `http://localhost:${PORT}`,
                timeout: 120 * 1000,
                reuseExistingServer: !process.env.CI,
                env: {
                    NEXT_PUBLIC_IS_E2E: 'true',
                },
                stderr: 'pipe',
                stdout: 'pipe',
            },
        }

export default defineConfig({
    testDir: './playwright',
    expect: {
        timeout: 5 * 1000,
    },
    timeout: opts.timeout,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? 'blob' : 'html',
    use: {
        baseURL: opts.baseURL,
        trace: 'on-first-retry',
        actionTimeout: 10 * 1000,
        navigationTimeout: 15 * 1000,
    },
    webServer: opts.server,
    projects: [
        {
            name: 'chromium light',
            use: { ...devices['Desktop Chrome'], colorScheme: 'light' },
        },
        {
            name: 'chromium dark',
            use: { ...devices['Desktop Chrome'], colorScheme: 'dark' },
        },
        ...(process.env.CI
            ? [
                  {
                      name: 'firefox',
                      use: { ...devices['Desktop Firefox'] },
                  },
              ]
            : []),
    ],
})
