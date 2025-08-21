import { expect } from '@playwright/test'
import { test } from './fixtures'
import {
    navigerTilPersonOgBehandling,
    navigerTilYrkesaktivitetFane,
    verifiserIngenYrkesaktivitet,
    verifiserKategoriTag,
    åpneYrkesaktivitetSkjema,
    fyllUtArbeidstakerYrkesaktivitet,
    fyllUtNæringsdrivendeYrkesaktivitet,
    fyllUtFrilanserYrkesaktivitet,
    lagreYrkesaktivitet,
    lagreRedigertYrkesaktivitet,
    verifiserAntallYrkesaktivitet,
    redigerYrkesaktivitet,
    slettYrkesaktivitet,
} from './actions/saksbehandler-actions'

test.describe('Blanke Ark - Yrkesaktivitet', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Kan opprette, redigere og slette yrkesaktivitet med riktige kategoritagger', async ({ page }) => {
        // Søk opp Blanke Ark og naviger til behandling
        await navigerTilPersonOgBehandling('13064512348', 'Blanke Ark')(page)

        // Naviger til "Yrkesaktivitet"-fanen
        await navigerTilYrkesaktivitetFane()(page)

        // Sjekk at det ikke finnes noen yrkesaktivitet i utgangspunktet
        await verifiserIngenYrkesaktivitet()(page)

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
        await fyllUtNæringsdrivendeYrkesaktivitet('Fisker', false)(page)
        await lagreYrkesaktivitet()(page)

        // Sjekk at begge yrkesaktivitet er synlige
        await verifiserAntallYrkesaktivitet(4)(page)

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

        // Sjekk at det bare er ett yrkesaktivitet igjen
        await verifiserAntallYrkesaktivitet(2)(page)

        // Sjekk at venstremeny viser "Selvstendig næringsdrivende"
        await verifiserKategoriTag('Selvstendig næringsdrivende')(page)
    })
})
