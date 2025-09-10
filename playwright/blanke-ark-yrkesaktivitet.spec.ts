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
    lagreRedigertYrkesaktivitet,
    verifiserAntallYrkesaktiviteter,
    redigerYrkesaktivitet,
    slettYrkesaktivitet,
} from './actions/saksbehandler-actions'

test.describe('Blanke Ark - Yrkesaktivitet', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Kan opprette, redigere og slette yrkesaktiviteter med riktige kategoritagger', async ({ page }) => {
        // Søk opp Blanke Ark og naviger til behandling
        await navigerTilPersonOgBehandling('13064512348', 'Blanke Ark')(page)

        // Naviger til "Yrkesaktivitet"-fanen
        await navigerTilYrkesaktivitetFane()(page)

        // Sjekk at det ikke finnes noen yrkesaktiviteter i utgangspunktet
        await verifiserIngenYrkesaktiviteter()(page)

        // Sjekk at venstremeny viser "Kategori ikke satt"
        await verifiserKategoriTag('Kategori ikke satt')(page)

        // 1. Opprett arbeidstaker yrkesaktivitet
        await åpneYrkesaktivitetSkjema()(page)
        await fyllUtArbeidstakerYrkesaktivitet('123456789', true)(page)
        await lagreYrkesaktivitet()(page)

        // Sjekk at arbeidstaker yrkesaktivitet er opprettet
        const yrkesaktivitetTabell = page.getByRole('table', { name: 'Yrkesaktivitet oversikt' })
        await expect(yrkesaktivitetTabell).toBeVisible()

        const arbeidstakerRad = yrkesaktivitetTabell.locator('tbody tr').first()
        await expect(arbeidstakerRad).toContainText('Arbeidstaker')

        // Sjekk at venstremeny viser "Arbeidstaker"
        await verifiserKategoriTag('Arbeidstaker')(page)

        // 2. Legg til næringsdrivende fisker på blad B
        await åpneYrkesaktivitetSkjema()(page)
        await fyllUtNæringsdrivendeYrkesaktivitet('Fisker', null, false)(page)
        await lagreYrkesaktivitet()(page)

        // Sjekk at begge yrkesaktiviteter er synlige
        await verifiserAntallYrkesaktiviteter(4)(page)

        // Sjekk at venstremeny viser "Arbeidstaker og selvstendig næringsdrivende"
        await verifiserKategoriTag('Arbeidstaker og selvstendig næringsdrivende')(page)

        // 3. Endre første yrkesaktivitet til frilanser
        await redigerYrkesaktivitet(0)(page)
        await fyllUtFrilanserYrkesaktivitet(false)(page)
        await lagreRedigertYrkesaktivitet()(page)

        // Sjekk at venstremeny viser "Frilanser og selvstendig næringsdrivende"
        await verifiserKategoriTag('Selvstendig næringsdrivende og frilanser')(page)

        // 4. Slett frilanser-yrkesaktiviteten
        await slettYrkesaktivitet(0)(page)

        // Sjekk at det bare er én yrkesaktivitet igjen
        await verifiserAntallYrkesaktiviteter(2)(page)

        // Sjekk at venstremeny viser "Selvstendig næringsdrivende"
        await verifiserKategoriTag('Selvstendig næringsdrivende')(page)
    })
})
