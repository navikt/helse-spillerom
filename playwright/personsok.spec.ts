import { expect, Page } from '@playwright/test'

import { test } from './fixtures'

async function søkPerson(page: Page, ident: string) {
    const main = page.locator('main')
    const searchInput = main.getByRole('searchbox')
    await searchInput.fill(ident)
    await searchInput.press('Enter')
}

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

    test('Viser feilmelding ved ugyldig input med 6 siffer', async ({ page }) => {
        await søkPerson(page, '123456')

        const errorMessage = page.getByText('Ident må være 11 eller 13 siffer lang')
        await expect(errorMessage).toBeVisible()
    })

    test('Viser feilmelding ved person som ikke finnes', async ({ page }) => {
        await søkPerson(page, '91234567890')

        const errorMessage = page.getByText('Person ikke funnet')
        await expect(errorMessage).toBeVisible()
    })

    test('Kan søke opp Kalle Kranfører og kommer til riktig side', async ({ page }) => {
        await søkPerson(page, '12345678901')

        // Vent på at vi kommer til person-siden
        await page.waitForURL('**/person/*')

        // Sjekk at navnet er riktig
        const header = page.getByRole('main')
        const navn = header.getByText('Kalle Kranfører')
        await expect(navn).toBeVisible()
    })

    test('Kan søke opp person uten søknader', async ({ page }) => {
        await søkPerson(page, '12345678902')

        // Vent på at vi kommer til person-siden
        await page.waitForURL('**/person/*')

        // Sjekk at vi kommer til person-siden
        const header = page.getByRole('main')
        await expect(header).toBeVisible()

        const navn = header.getByText('Martin Hansen')
        await expect(navn).toBeVisible()

        // Klikk på "Start behandling" knappen
        const startBehandlingButton = page.getByRole('button', { name: 'Start ny behandling' })
        await startBehandlingButton.click()

        // Sjekk at "Ingen søknader" vises
        const ingenSoknader = page.getByText('Ingen søknader etter valgt dato')
        await expect(ingenSoknader).toBeVisible()
    })
})
