import { expect, test } from '@playwright/test'

import {
    fyllUtArbeidstakerYrkesaktivitet,
    fyllUtNæringsdrivendeYrkesaktivitet,
    lagreYrkesaktivitet,
    navigerTilPerson,
    navigerTilPersonOgBehandling,
    navigerTilYrkesaktivitetFane,
    opprettManuellBehandling,
    åpneYrkesaktivitetSkjema,
} from './actions/saksbehandler-actions'
import { validerAxe } from './actions/uuvalidering'

test.describe('UU validering test', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Kjører gjennom hovedflyten og tester med axe', async ({ page }) => {
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await validerAxe(page, test.info())

        await navigerTilPerson('10101021310')(page)
        await validerAxe(page, test.info())

        const periodeFra = '01.01.2025'
        const periodeTil = '31.01.2025'

        await test.step('Opprett manuell behandling', async () => {
            await opprettManuellBehandling(periodeFra, periodeTil)(page)
            await page.waitForURL('**/person/*/*')
        })

        await validerAxe(page, test.info())

        // Naviger til "Yrkesaktivitet"-fanen
        await navigerTilYrkesaktivitetFane()(page)
        await validerAxe(page, test.info())

        await åpneYrkesaktivitetSkjema()(page)
        await validerAxe(page, test.info())

        await fyllUtArbeidstakerYrkesaktivitet('123456789', true)(page)
        await validerAxe(page, test.info())

        await lagreYrkesaktivitet()(page)

        // 2. Legg til næringsdrivende fisker på blad B
        await åpneYrkesaktivitetSkjema()(page)
        await fyllUtNæringsdrivendeYrkesaktivitet('Fisker', null, false)(page)
        await lagreYrkesaktivitet()(page)

        await validerAxe(page, test.info())
        // TODO fortsett med SPG, vilkårsvurdering osv
    })
})
