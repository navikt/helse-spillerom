import { expect, test } from '@playwright/test'

import {
    fyllUtArbeidsledigYrkesaktivitet,
    lagreYrkesaktivitet,
    navigerTilPerson,
    navigerTilYrkesaktivitetFane,
    opprettManuellBehandling,
    åpneYrkesaktivitetSkjema,
} from './actions/saksbehandler-actions'

test.describe('Manuell behandling - Juli 2025 med arbeidsledig', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Kan opprette manuell behandling for juli 2025, legge til arbeidsledig yrkesaktivitet, vurdere 8-2 som oppfylt, sette alle dager til ferie, og sende til godkjenning', async ({
        page,
    }) => {
        const personIdent = '2234520200'
        const periodeFra = '01.07.2025'
        const periodeTil = '31.07.2025'

        // 1. Naviger til person
        await test.step('Søk opp person', async () => {
            await navigerTilPerson(personIdent)(page)
        })

        // 2. Opprett manuell behandling for juli 2025
        await test.step('Opprett manuell behandling for juli 2025', async () => {
            await opprettManuellBehandling(periodeFra, periodeTil)(page)
            await page.waitForURL('**/person/*/*')
        })

        // 3. Legg til yrkesaktivitet: arbeidsledig
        await test.step('Legg til yrkesaktivitet: arbeidsledig', async () => {
            await navigerTilYrkesaktivitetFane()(page)
            await åpneYrkesaktivitetSkjema()(page)
            await fyllUtArbeidsledigYrkesaktivitet()(page)
            await lagreYrkesaktivitet()(page)
        })

        // 4. Verifiser at yrkesaktivitet er opprettet
        await test.step('Verifiser at yrkesaktivitet er opprettet', async () => {
            const yrkesaktivitetTabell = page.getByRole('table', { name: 'Yrkesaktivitet oversikt' })
            await expect(yrkesaktivitetTabell).toBeVisible()

            const arbeidsledigRad = yrkesaktivitetTabell.locator('tbody tr').first()
            await expect(arbeidsledigRad).toContainText('Arbeidsledig')
        })

        // 5. Naviger til Vilkårsvurdering og vurder 8-2 (Opptjeningstid) som oppfylt
        await test.step('Naviger til Vilkårsvurdering', async () => {
            await page.getByRole('tab', { name: 'Vilkårsvurdering' }).click()
            await expect(page.getByRole('tabpanel', { name: 'Vilkårsvurdering' })).toBeVisible()
        })

        await test.step('Utvid § 8-2 Opptjeningstid', async () => {
            // Finn raden med § 8-2
            const opptjeningstidRow = page.getByRole('row', { name: /Opptjeningstid.*Ikke vurdert.*Vis mer/ })
            await opptjeningstidRow.waitFor({ state: 'visible' })
            await opptjeningstidRow.click()

            // Vent på at innholdet blir synlig
            await expect(page.getByText('Oppfyller vilkår om opptjeningstid')).toBeVisible()
        })

        await test.step('Vurder opptjeningstid som oppfylt', async () => {
            // Velg "Ja, minst fire uker i arbeid umiddelbart før arbeidsuførhet"
            await page.getByRole('radio', { name: 'Ja, minst fire uker i arbeid umiddelbart før arbeidsuførhet' }).click()

            // Legg til begrunnelse
            const begrunnelseField = page.getByRole('textbox', { name: 'Begrunnelse' })
            await begrunnelseField.fill('Personen oppfyller vilkår om opptjeningstid')

            // Lagre vurderingen
            await page.getByRole('button', { name: 'Lagre vurdering' }).click()

            // Verifiser at status er oppdatert til "Oppfylt"
            await expect(page.getByText('Oppfylt')).toBeVisible()
        })

        // 6. Naviger til Dagoversikt og sett alle dager til ferie
        await test.step('Naviger til Dagoversikt', async () => {
            await page.getByRole('tab', { name: 'Dagoversikt' }).click()
            await expect(page.getByRole('tabpanel', { name: 'Dagoversikt' })).toBeVisible()
        })

        await test.step('Åpne endre dager-skjema', async () => {
            await page.getByRole('button', { name: 'Endre dager' }).click()

            // Verifiser at skjemaet er åpent
            await expect(
                page.getByRole('heading', { name: 'Velg én eller flere dager du vil endre i tabellen ovenfor' }),
            ).toBeVisible()
        })

        await test.step('Velg alle dager', async () => {
            // Velg alle dager
            const velgAlleDagerCheckbox = page.getByRole('checkbox', { name: 'Velg alle dager' })
            await velgAlleDagerCheckbox.click()

            // Verifiser at skjemaet for endring vises
            await expect(page.getByRole('heading', { name: /Fyll inn hva de \d+ valgte dagene skal endres til/ })).toBeVisible()
        })

        await test.step('Endre alle dager til ferie', async () => {
            // Velg "Ferie" fra dropdown
            await page.getByLabel('Dagtype').selectOption('Ferie')

            // Legg til notat til beslutter
            const notatField = page.getByRole('textbox', { name: 'Notat til beslutter' })
            await notatField.fill('Alle dager settes til ferie')

            // Lagre endringen
            const endreButton = page.getByRole('button', { name: /Endre \(\d+\)/ })
            await endreButton.click()

            // Vent på at dagoversikten oppdateres
            await page.waitForTimeout(1000)
        })

        await test.step('Verifiser at dager er endret til ferie', async () => {
            const dagoversiktTabell = page.getByRole('table')
            await expect(dagoversiktTabell).toBeVisible()

            // Sjekk at feriedager vises
            const ferieDager = dagoversiktTabell.locator('text=Ferie')
            const ferieCount = await ferieDager.count()
            expect(ferieCount).toBeGreaterThan(0)
        })

        // 7. Send behandlingen til godkjenning
        await test.step('Send til godkjenning', async () => {
            // Finn og klikk på "Send til godkjenning" knappen i venstremeny
            const sendTilGodkjenningButton = page.getByRole('button', { name: 'Send til godkjenning' })
            await sendTilGodkjenningButton.waitFor({ state: 'visible' })
            await sendTilGodkjenningButton.click()

            // Vent på at modal åpnes
            const modal = page.getByRole('dialog', { name: 'Send til godkjenning modal' })
            await modal.waitFor({ state: 'visible' })

            // Fyll ut individuell begrunnelse (hvis påkrevd)
            const begrunnelseField = modal.getByRole('textbox', { name: /begrunnelse/i })
            if (await begrunnelseField.isVisible()) {
                await begrunnelseField.fill('Behandling klar for godkjenning')
            }

            // Klikk på bekreft/send knappen
            const bekreftButton = modal.getByRole('button', { name: /Send/i })
            await bekreftButton.click()

            // Vent på at modalen lukkes
            await modal.waitFor({ state: 'hidden' })
        })

        await test.step('Verifiser at behandlingen er sendt til godkjenning', async () => {
            // Sjekk at status er oppdatert (kan være i venstremeny eller som melding)
            const venstremeny = page.getByRole('complementary', { name: 'venstre sidemeny' })
            
            // Vent litt for at status skal oppdateres
            await page.waitForTimeout(1000)
            
            // Sjekk at "Send til godkjenning" knappen ikke lenger er synlig
            const sendTilGodkjenningButton = page.getByRole('button', { name: 'Send til godkjenning' })
            await expect(sendTilGodkjenningButton).not.toBeVisible()
        })
    })
})
