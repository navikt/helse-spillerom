import { expect, test } from '@playwright/test'

import { søkPerson } from './actions/saksbehandler-actions'

test.describe('Førstesiden', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Viser feilmelding ved ugyldig input med 6 siffer', async ({ page }) => {
        await søkPerson('123456')(page)

        const errorMessage = page.getByText('Ident må være 11 eller 13 siffer')
        await expect(errorMessage).toBeVisible()
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })

    test('Viser feilmelding ved person som ikke finnes', async ({ page }) => {
        await søkPerson('91234567890')(page)

        const errorMessage = page.getByText('Person ikke funnet')
        await expect(errorMessage).toBeVisible()
    })

    test('Kan søke opp person uten søknader', async ({ page }) => {
        await søkPerson('12345678902')(page)

        // Vent på at vi kommer til person-siden
        await page.waitForURL('**/person/*')

        // Sjekk at vi kommer til person-siden
        const header = page.getByRole('main')
        await expect(header).toBeVisible()

        const navn = header.getByText('Hanna Andrea Johansen')
        await expect(navn).toBeVisible()

        // Klikk på "Start behandling" knappen
        const startBehandlingButton = page.getByRole('button', { name: 'Start ny behandling' })
        await startBehandlingButton.click()

        // Sjekk at "Ingen søknader" vises
        const ingenSoknader = page.getByText('Ingen søknader etter valgt dato')
        await expect(ingenSoknader).toBeVisible()
    })
})
