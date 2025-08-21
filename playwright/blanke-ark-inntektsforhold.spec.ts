import { expect } from '@playwright/test'
import { test } from './fixtures'
import {
    navigerTilPersonOgBehandling,
    navigerTilInntektsforholdFane,
    verifiserIngenInntektsforhold,
    verifiserKategoriTag,
    åpneInntektsforholdSkjema,
    fyllUtArbeidstakerInntektsforhold,
    fyllUtNæringsdrivendeInntektsforhold,
    fyllUtFrilanserInntektsforhold,
    lagreInntektsforhold,
    lagreRedigertInntektsforhold,
    verifiserAntallInntektsforhold,
    redigerInntektsforhold,
    slettInntektsforhold,
} from './actions/saksbehandler-actions'

test.describe('Blanke Ark - Inntektsforhold', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Kan opprette, redigere og slette inntektsforhold med riktige kategoritagger', async ({ page }) => {
        // Søk opp Blanke Ark og naviger til behandling
        await navigerTilPersonOgBehandling('13064512348', 'Blanke Ark')(page)

        // Naviger til "Inntektsforhold"-fanen
        await navigerTilInntektsforholdFane()(page)

        // Sjekk at det ikke finnes noen inntektsforhold i utgangspunktet
        await verifiserIngenInntektsforhold()(page)

        // Sjekk at venstremeny viser "Kategori ikke satt"
        await verifiserKategoriTag('Kategori ikke satt')(page)

        // 1. Opprett arbeidstaker inntektsforhold
        await åpneInntektsforholdSkjema()(page)
        await fyllUtArbeidstakerInntektsforhold('123456789', true)(page)
        await lagreInntektsforhold()(page)

        // Sjekk at arbeidstaker inntektsforhold er opprettet
        const inntektsforholdTabell = page.getByRole('table', { name: 'Inntektsforhold oversikt' })
        await expect(inntektsforholdTabell).toBeVisible()

        const arbeidstakerRad = inntektsforholdTabell.locator('tbody tr').first()
        await expect(arbeidstakerRad).toContainText('Arbeidstaker')

        // Sjekk at venstremeny viser "Arbeidstaker"
        await verifiserKategoriTag('Arbeidstaker')(page)

        // 2. Legg til næringsdrivende fisker på blad B
        await åpneInntektsforholdSkjema()(page)
        await fyllUtNæringsdrivendeInntektsforhold('Fisker', false)(page)
        await lagreInntektsforhold()(page)

        // Sjekk at begge inntektsforhold er synlige
        await verifiserAntallInntektsforhold(4)(page)

        // Sjekk at venstremeny viser "Arbeidstaker og selvstendig næringsdrivende"
        await verifiserKategoriTag('Arbeidstaker og selvstendig næringsdrivende')(page)

        // 3. Endre første inntektsforhold til frilanser
        await redigerInntektsforhold(0)(page)
        await fyllUtFrilanserInntektsforhold(false)(page)
        await lagreRedigertInntektsforhold()(page)

        // Sjekk at venstremeny viser "Frilanser og selvstendig næringsdrivende"
        await verifiserKategoriTag('Selvstendig næringsdrivende og frilanser')(page)

        // 4. Slett frilanser-inntektsforholdet
        await slettInntektsforhold(0)(page)

        // Sjekk at det bare er ett inntektsforhold igjen
        await verifiserAntallInntektsforhold(2)(page)

        // Sjekk at venstremeny viser "Selvstendig næringsdrivende"
        await verifiserKategoriTag('Selvstendig næringsdrivende')(page)
    })
})
