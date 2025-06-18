import { expect, Page } from '@playwright/test'

import { test } from './fixtures'
import { søkPerson } from './actions/saksbehandler-actions'

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
        await søkPerson('123456')(page)

        const errorMessage = page.getByText('Ident må være 11 eller 13 siffer lang')
        await expect(errorMessage).toBeVisible()
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

        const navn = header.getByText('Martin Hansen')
        await expect(navn).toBeVisible()

        // Klikk på "Start behandling" knappen
        const startBehandlingButton = page.getByRole('button', { name: 'Start ny behandling' })
        await startBehandlingButton.click()

        // Sjekk at "Ingen søknader" vises
        const ingenSoknader = page.getByText('Ingen søknader etter valgt dato')
        await expect(ingenSoknader).toBeVisible()
    })

    test('Kan navigere til eksisterende behandling for Kalle Kranfører og se inntektsforhold', async ({ page }) => {
        // Søk opp Kalle Kranfører
        await søkPerson('12345678901')(page)
        await page.waitForURL('**/person/*')

        // Sjekk at navnet er riktig
        const header = page.getByRole('main')
        const navn = header.getByText('Kalle Kranfører')
        await expect(navn).toBeVisible()

        // Finn og klikk på lenken til eksisterende behandling (forvent én behandling i tabellen)
        const behandlingLink = page.getByRole('link', { name: /\d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}/ })
        await behandlingLink.click()
        await page.waitForURL('**/person/*/*')

        // Naviger til "Inntektsforhold"-fanen
        const inntektsforholdTab = page.getByRole('tab', { name: /Inntektsforhold/i })
        await inntektsforholdTab.click()

        // Sjekk at inntektsforhold vises i tabellen
        const typeHeader = page.getByRole('columnheader', { name: 'Type' })
        await expect(typeHeader).toBeVisible()
        const typeCell = page.getByText(
            /Arbeidstaker|Ordinært arbeidsforhold|Frilanser|Selvstendig næringsdrivende|Inaktiv/,
        )
        await expect(typeCell).toBeVisible()
    })
})
