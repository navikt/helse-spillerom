import { expect } from '@playwright/test'

import { test } from './fixtures'

test.describe('Tester førstesiden', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Har innhold', async ({ page }) => {
        const hello = page.getByText('Hello world')
        await expect(hello).toHaveCount(1)
    })
})
