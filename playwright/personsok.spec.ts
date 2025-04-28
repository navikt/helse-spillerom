import { expect } from '@playwright/test'

import { test } from './fixtures'

test.describe('Førstesiden', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Har innhold', async ({ page }) => {
        const hello = page.getByText('Personsøk')
        await expect(hello).toHaveCount(1)
    })
})
