import { expect } from '@playwright/test'
import { test } from './fixtures'
import { søkPerson } from './actions/saksbehandler-actions'

test.describe('Kalle Kranfører', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Kan navigere til eksisterende behandling og se inntektsforhold', async ({ page }) => {
        // Søk opp Kalle Kranfører
        await søkPerson('12345678901')(page)
        await page.waitForURL('**/person/*')

        // Sjekk at navnet er riktig
        const header = page.getByRole('main')
        const navn = header.getByText('Kalle Kranfører')
        await expect(navn).toBeVisible()

        // Finn og klikk på lenken til eksisterende behandling (forvent én behandling i tabellen)
        const behandlingLink = page.getByRole('link', { name: '01.01.2025 - 28.02.2025' })
        await behandlingLink.click()
        await page.waitForURL('**/person/*/*')

        // Naviger til "Inntektsforhold"-fanen
        const inntektsforholdTab = page.getByRole('tab', { name: /Inntektsforhold/i })
        await inntektsforholdTab.click()

        // Sjekk at "Legg til inntektsforhold"-knappen har riktig tilgjengelighet
        const leggTilButton = page.getByRole('button', { name: 'Legg til nytt inntektsforhold' })
        await expect(leggTilButton).toBeVisible()
        // Sjekk at ikonet er skjult for skjermlesere
        const plusIcon = leggTilButton.locator('svg')
        await expect(plusIcon).toHaveAttribute('aria-hidden', 'true')

        // Finn tabellen som inneholder inntektsforhold ved å bruke kolonneoverskriftene
        const inntektsforholdTable = page
            .locator('table', {
                has: page.locator('th', { hasText: 'Inntektsforhold' }),
            })
            .filter({
                has: page.locator('th', { hasText: 'Sykmeldt' }),
            })
        await expect(inntektsforholdTable).toBeVisible()

        // Finn første rad i tabellen
        const firstRow = inntektsforholdTable.locator('tbody tr').first()
        await expect(firstRow).toBeVisible()

        // Finn første celle i første rad
        const firstCell = firstRow.locator('td p').first()
        await expect(firstCell).toBeVisible()
        await expect(firstCell).toHaveText('Arbeidstaker')
    })
})
