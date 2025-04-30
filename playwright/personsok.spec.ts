import { expect } from '@playwright/test'

import { test } from './fixtures'

test.describe('Førstesiden', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Har innhold', async ({ page }) => {
        const main = page.locator('main')
        const hello = main.getByText('Fødselsnummer/Aktør-ID')
        await expect(hello).toHaveCount(1)
    })
})
