import { expect } from '@playwright/test'
import { test } from './fixtures'
import { navigerTilPersonOgBehandling } from './actions/saksbehandler-actions'

test.describe('Dokumentnedlasting fra høyremeny', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Kan åpne høyremeny og teste dokumentnedlasting med UU-validering', async ({ page }) => {
        // Naviger til Blanke Ark testpersonen og saksbehandlingsperioden
        await navigerTilPersonOgBehandling('13064512348', 'Blanke Ark')(page)

        // Åpne høyremenyen med dokumenter
        // Åpne høyremenyen ved å klikke på "Vis dokumenter" knappen
        const viseDokumenterKnapp = page.getByRole('button', { name: 'Vis dokumenter' })
        await expect(viseDokumenterKnapp).toBeVisible()
        await viseDokumenterKnapp.click()

        // Fortsett med resten av testen...
        const ainntektKnapp = page.getByRole('button', { name: 'Last ned A-inntekt som dokument' })
        await expect(ainntektKnapp).toBeVisible()

        // Test nedlasting av A-inntekt
        await expect(ainntektKnapp).toBeVisible()
        await ainntektKnapp.click()
        await expect(ainntektKnapp).not.toBeVisible()

        // Vent på at dokumentet vises i listen - bruk mer fleksibel selektor
        const ainntektDokument = page
            .getByRole('button')
            .filter({ hasText: /A-inntekt/ })
            .first()
        await expect(ainntektDokument).toBeVisible()
        /*

                     console.log(`✅ Fant ${buttonCount} nedlastingsknapper`)

                     // Fortsett med resten av testen...
                     const ainntektKnapp = page.getByRole('button', { name: 'Last ned A-inntekt som dokument' })
                     await expect(ainntektKnapp).toBeVisible()


                     // Test nedlasting av A-inntekt
                     await ainntektKnapp.click()
                     await expect(ainntektKnapp).toHaveClass(/navds-button--loading/, { timeout: 5000 })
                     await expect(ainntektKnapp).not.toBeVisible()

                     // Vent på at dokumentet vises i listen - bruk mer fleksibel selektor
                     const ainntektDokument = page.getByRole('button').filter({ hasText: /A-inntekt/ }).first()
                     await expect(ainntektDokument).toBeVisible({ timeout: 10000 })



                     const arbeidsforholdKnapp = page.getByRole('button', { name: 'Last ned arbeidsforhold som dokument' })
                     await expect(arbeidsforholdKnapp).toBeVisible()

                     const pensjonsgivendeKnapp = page.getByRole('button', { name: 'Last ned pensjonsgivende inntekt som dokument' })
                     await expect(pensjonsgivendeKnapp).toBeVisible()

                     // Debug: logg hvilke dokumenter som faktisk vises
                     const dokumentButtons = page.getByRole('list', { name: 'Dokumenter' }).getByRole('button')
                     console.log('Dokumenter funnet:', await dokumentButtons.allTextContents())

                     // Ekspander A-inntekt dokumentet
                     await ainntektDokument.click()
                     await expect(ainntektDokument).toHaveAttribute('aria-expanded', 'true')

                     console.log('✅ A-inntekt dokument er ekspandert')

                     // Verifiser at tabellen er synlig
                     const ainntektTabell = page.getByRole('table')
                     await expect(ainntektTabell).toBeVisible()

                     // Sjekk at tabellheadere er på plass
                     await expect(page.getByRole('columnheader', { name: 'År/Måned' })).toBeVisible()
                     await expect(page.getByRole('columnheader', { name: 'Unike' })).toBeVisible()
                     await expect(page.getByRole('columnheader', { name: 'Total' })).toBeVisible()

                     console.log('✅ A-inntekt tabell og headere er synlige')

                     // Sjekk at det er data i tabellen - finn første rad med år-data
                     const yearRows = page.getByRole('row').filter({ hasText: /^\d{4}$/ })
                     await expect(yearRows.first()).toBeVisible()

                     // Sjekk at det er totalbeløp synlig (formatert som NOK)
                     await expect(page.getByText(/kr/, { exact: false })).toBeVisible()

                     console.log('✅ A-inntekt data er synlig i tabellen')

                     // Test ekspandering av år-data
                     const expandButton = page.getByRole('button', { name: 'Vis' }).first()
                     if (await expandButton.isVisible()) {
                         await expandButton.click()
                         await expect(expandButton).toHaveText('Skjul')
                         console.log('✅ Kan ekspandere år-data i A-inntekt')
                     }

                     // UU-validering etter dokumentvisning
                     // (UU-validering skjer automatisk etter testen via fixtures)

                     // Lukk dokumentet
                     await ainntektDokument.click()
                     await expect(ainntektDokument).toHaveAttribute('aria-expanded', 'false')

                     console.log('✅ A-inntekt dokument er lukket')

                     // Test nedlasting av arbeidsforhold
                     await arbeidsforholdKnapp.click()
                     await expect(arbeidsforholdKnapp).toHaveClass(/navds-button--loading/, { timeout: 5000 })
                     await expect(arbeidsforholdKnapp).not.toBeVisible()

                     // Vent på at arbeidsforhold dokumentet vises
                     const arbeidsforholdDokument = page.getByRole('button', { name: /Arbeidsforhold/ })
                     await expect(arbeidsforholdDokument).toBeVisible({ timeout: 10000 })

                     console.log('✅ Arbeidsforhold dokument er synlig')

                     // Ekspander arbeidsforhold dokumentet
                     await arbeidsforholdDokument.click()
                     await expect(arbeidsforholdDokument).toHaveAttribute('aria-expanded', 'true')

                     // Verifiser grunnleggende innhold (arbeidsforhold har også tabeller)
                     const arbeidsforholdTabell = page.getByRole('table')
                     await expect(arbeidsforholdTabell).toBeVisible()

                     console.log('✅ Arbeidsforhold tabell er synlig')

                     // Lukk arbeidsforhold dokumentet
                     await arbeidsforholdDokument.click()
                     await expect(arbeidsforholdDokument).toHaveAttribute('aria-expanded', 'false')

                     console.log('✅ Arbeidsforhold dokument er lukket')

                     // Test nedlasting av pensjonsgivende inntekt
                     await pensjonsgivendeKnapp.click()
                     await expect(pensjonsgivendeKnapp).toHaveClass(/navds-button--loading/, { timeout: 5000 })
                     await expect(pensjonsgivendeKnapp).not.toBeVisible()

                     // Vent på at pensjonsgivende inntekt dokumentet vises
                     const pensjonsgivendeDokument = page.getByRole('button', { name: /Pensjonsgivende inntekt/ })
                     await expect(pensjonsgivendeDokument).toBeVisible({ timeout: 10000 })

                     console.log('✅ Pensjonsgivende inntekt dokument er synlig')

                     // Ekspander pensjonsgivende inntekt dokumentet
                     await pensjonsgivendeDokument.click()
                     await expect(pensjonsgivendeDokument).toHaveAttribute('aria-expanded', 'true')

                     // Verifiser at innhold er synlig (kan være tabell eller annen struktur)
                     const pensjonsgivendeInnhold = page.locator('#dokument-innhold-').locator('visible=true').first()
                     await expect(pensjonsgivendeInnhold).toBeVisible()

                     console.log('✅ Pensjonsgivende inntekt innhold er synlig')

                     // Lukk pensjonsgivende inntekt dokumentet
                     await pensjonsgivendeDokument.click()
                     await expect(pensjonsgivendeDokument).toHaveAttribute('aria-expanded', 'false')

                     console.log('✅ Pensjonsgivende inntekt dokument er lukket')

                     console.log('🎉 Alle dokumenter er testet - nedlasting, visning og lukking')
             */
    })
})
