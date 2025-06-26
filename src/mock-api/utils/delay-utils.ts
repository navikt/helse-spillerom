/**
 * Utility for adding random delays to mock API responses
 * Skips delay when running in Playwright mode
 */

const isPlaywrightMode = process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT === 'true'

/**
 * Adds a random delay, unless in Playwright mode
 */
export async function addRandomDelay(): Promise<void> {
    if (isPlaywrightMode) {
        return
    }

    const delayMs = Math.random() * 100 + 500 // Random delay between 100-500ms
    await new Promise((resolve) => setTimeout(resolve, delayMs))
}

/**
 * Adds a random delay with custom min/max range, unless in Playwright mode
 */
export async function addCustomDelay(minMs: number, maxMs: number): Promise<void> {
    if (isPlaywrightMode) {
        return
    }

    const delayMs = Math.random() * (maxMs - minMs) + minMs
    await new Promise((resolve) => setTimeout(resolve, delayMs))
}
