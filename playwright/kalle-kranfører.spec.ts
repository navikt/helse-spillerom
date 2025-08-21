import { expect } from '@playwright/test'
import { test } from './fixtures'
import { søkPerson } from './actions/saksbehandler-actions'

test.describe('Kalle Kranfører', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Kan navigere til eksisterende behandling og se yrkesaktivitet', async ({ page }) => {
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

        // Naviger til "Yrkesaktivitet"-fanen
        const yrkesaktivitetTab = page.getByRole('tab', { name: /Yrkesaktivitet/i })
        await yrkesaktivitetTab.click()

        // Sjekk at "Legg til yrkesaktivitet"-knappen har riktig tilgjengelighet
        const leggTilButton = page.getByRole('button', { name: 'Legg til ny yrkesaktivitet' })
        await expect(leggTilButton).toBeVisible()
        // Sjekk at ikonet er skjult for skjermlesere
        const plusIcon = leggTilButton.locator('svg')
        await expect(plusIcon).toHaveAttribute('aria-hidden', 'true')

        // Sjekk at det vises en melding om at ingen yrkesaktivitet er registrert
        const ingenYrkesaktivitetMelding = page.getByText(
            'Ingen yrkesaktivitet registrert for denne saksbehandlingsperioden.',
        )
        await expect(ingenYrkesaktivitetMelding).toBeVisible()

        // Naviger til "Dagoversikt"-fanen
        const dagoversiktTab = page.getByRole('tab', { name: /Dagoversikt/i })
        await dagoversiktTab.click()

        // Sjekk at tabellen for dagoversikt er synlig
        const dagoversiktTable = page.locator('table', {
            has: page.locator('th', { hasText: 'Dato' }),
        })
        await expect(dagoversiktTable).toBeVisible()

        // Sjekk antall dager i tabellen
        const rows = dagoversiktTable.locator('tbody tr')
        const rowCount = await rows.count()
        await expect(rowCount).toBe(59)
    })
})
