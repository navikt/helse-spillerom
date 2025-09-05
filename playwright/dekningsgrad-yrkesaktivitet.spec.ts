import { expect } from '@playwright/test'
import { test } from './fixtures'
import {
    navigerTilPersonOgBehandling,
    navigerTilYrkesaktivitetFane,
    verifiserIngenYrkesaktiviteter,
    verifiserKategoriTag,
    åpneYrkesaktivitetSkjema,
    fyllUtArbeidstakerYrkesaktivitet,
    fyllUtNæringsdrivendeYrkesaktivitet,
    fyllUtFrilanserYrkesaktivitet,
    lagreYrkesaktivitet,
    verifiserAntallYrkesaktiviteter,
    slettYrkesaktivitet,
    navigerTilPerson,
    opprettManuellBehandling,
} from './actions/saksbehandler-actions'

test.describe('Dekningsgrad og Yrkesaktivitet', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Ingen synlig dekningsgrad for arbeidstaker', async ({ page }) => {
        // Naviger til person og behandling
        await navigerTilPerson('12345214260', 'Silje Tangen Larsen')(page)
        await opprettManuellBehandling('01.01.2025', '28.09.2025')(page)
        await navigerTilYrkesaktivitetFane()(page)
        await åpneYrkesaktivitetSkjema()(page)
        await fyllUtArbeidstakerYrkesaktivitet('123456789', true)(page)
        await lagreYrkesaktivitet()(page)

        await verifiserKategoriTag('Arbeidstaker')(page)

        // Sjekk at dekningsgrad IKKE vises for arbeidstaker (kun for næringsdrivende/inaktiv)
        const venstremeny = page.getByRole('complementary', { name: 'venstre sidemeny' })
        await venstremeny.waitFor({ state: 'visible' })

        // Dekningsgrad skal ikke være synlig for arbeidstaker
        const dekningsgradTekst = venstremeny.getByText('Dekningsgrad:')
        await expect(dekningsgradTekst).not.toBeVisible()
    })

    test('80% dekningsgrad vanlig selvstendig næringsdrivende', async ({ page }) => {
        // Naviger til person og behandling
        await navigerTilPerson('12345214261', 'Natalie Ruud')(page)
        await opprettManuellBehandling('01.01.2025', '28.09.2025')(page)
        await navigerTilYrkesaktivitetFane()(page)
        await åpneYrkesaktivitetSkjema()(page)
        await fyllUtNæringsdrivendeYrkesaktivitet('Ordinær selvstendig næringsdrivende', 'Ingen forsikring', true)(page)
        await lagreYrkesaktivitet()(page)

        await verifiserKategoriTag('Selvstendig næringsdrivende')(page)

        // Sjekk at dekningsgrad vises for selvstendig næringsdrivende
        const venstremeny = page.getByRole('complementary', { name: 'venstre sidemeny' })
        await venstremeny.waitFor({ state: 'visible' })

        // Dekningsgrad skal være synlig for selvstendig næringsdrivende
        const dekningsgradTekst = venstremeny.getByText('Dekningsgrad:')
        await dekningsgradTekst.waitFor({ state: 'visible' })
        await expect(dekningsgradTekst).toBeVisible()

        // Sjekk at det vises 80% dekningsgrad
        const dekningsgrad80 = venstremeny.getByText('80%')
        await expect(dekningsgrad80).toBeVisible()
    })
})
