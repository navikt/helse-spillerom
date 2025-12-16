import { expect, test } from '@playwright/test'

import { validerAxe } from './actions/uuvalidering'
import {
    fyllUtArbeidstakerYrkesaktivitet,
    lagreYrkesaktivitet,
    navigerTilPerson,
    opprettManuellBehandling,
    åpneYrkesaktivitetSkjema,
} from './actions/saksbehandler-actions'

test.describe('Vilkårsvurdering og Dagoversikt', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Kan vurdere vilkår og endre dager til avslått', async ({ page }, testInfo) => {
        const personIdent = '15454587654'
        const periodeFra = '01.09.2025'
        const periodeTil = '20.09.2025'

        // 1. Naviger til person
        await test.step('Naviger til person', async () => {
            await navigerTilPerson(personIdent)(page)
        })

        // 2. Opprett manuell behandling
        await test.step('Opprett manuell behandling', async () => {
            await opprettManuellBehandling(periodeFra, periodeTil)(page)
            await page.waitForURL('**/person/*/*')
        })

        await åpneYrkesaktivitetSkjema()(page)
        await fyllUtArbeidstakerYrkesaktivitet('874372637', true)(page)
        await lagreYrkesaktivitet()(page)

        // Naviger til Vilkårsvurdering-fanen
        await test.step('Naviger til Vilkårsvurdering', async () => {
            await page.getByRole('tab', { name: 'Vilkårsvurdering' }).click()
            await expect(page.getByRole('tabpanel', { name: 'Vilkårsvurdering' })).toBeVisible()
            // Vent på at Kapittel 2 - Medlemskap i folketrygden er synlig
            await expect(
                page.getByRole('row', { name: 'Medlemskap i folketrygden Ikke vurdert Vis mer' }),
            ).toBeVisible()
        })

        // Valider tilgjengelighet
        await validerAxe(page, testInfo)

        // Utvid Kapittel 2 - Medlemskap i folketrygden
        await test.step('Utvid Kapittel 2 - Medlemskap i folketrygden', async () => {
            // Klikk på "Vis mer" knappen for Kapittel 2
            page.getByRole('row', {
                name: 'Medlemskap i folketrygden Ikke vurdert Vis mer',
            }).click()

            // Vent på at innholdet blir synlig
            await expect(page.getByText('Er den sykmeldte medlem i folketrygden?')).toBeVisible()
        })

        // Vurder medlemskap i folketrygden
        await test.step('Vurder medlemskap i folketrygden', async () => {
            // Velg "Nei" for medlemskap
            await page.getByRole('radio', { name: 'Nei' }).click()

            // Legg til begrunnelse
            const begrunnelseField = page.getByRole('textbox', { name: 'Begrunnelse' })
            await begrunnelseField.fill('Personen er ikke medlem i folketrygden')

            // Lagre vurderingen
            await page.getByRole('button', { name: 'Lagre vurdering' }).click()

            // Verifiser at status er oppdatert
            await expect(page.getByText('Ikke oppfylt')).toBeVisible()
            await expect(page.getByText('1/12')).toBeVisible()
        })

        // Naviger til Dagoversikt-fanen
        await test.step('Naviger til Dagoversikt', async () => {
            await page.getByRole('tab', { name: 'Dagoversikt' }).click()
            await expect(page.getByRole('tabpanel', { name: 'Dagoversikt' })).toBeVisible()
        })

        // Åpne endre dager-skjema
        await test.step('Åpne endre dager-skjema', async () => {
            await page.getByRole('button', { name: 'Endre dager' }).click()

            // Verifiser at skjemaet er åpent
            await expect(
                page.getByRole('heading', { name: 'Velg én eller flere dager du vil endre i tabellen ovenfor' }),
            ).toBeVisible()
        })

        // Velg dag som skal endres
        await test.step('Velg dag som skal endres', async () => {
            // Velg 01.09.2025
            await page.getByRole('row', { name: 'Velg dag 01.09.2025 Arbeid' }).getByLabel('Velg dag').click()

            // Verifiser at skjemaet for endring vises
            await expect(
                page.getByRole('heading', { name: 'Fyll inn hva de 1 valgte dagene skal endres til' }),
            ).toBeVisible()
        })

        // Endre dagtype til avslått
        await test.step('Endre dagtype til avslått', async () => {
            // Velg "Avslått (Den sykmeldte er ikke medlem i folketrygden)" fra dropdown
            await page.getByLabel('Dagtype').selectOption('Avslått (Den sykmeldte er ikke medlem i folketrygden)')

            // Legg til notat til beslutter
            const notatField = page.getByRole('textbox', { name: 'Notat til beslutter' })
            await notatField.fill('Dagen endres til avslått fordi personen ikke er medlem i folketrygden')

            // Lagre endringen
            await page.getByRole('button', { name: 'Endre (1)' }).click()
        })

        // Verifiser at endringen er lagret
        await test.step('Verifiser at endringen er lagret', async () => {
            // Vent på at dagoversikten oppdateres
            await expect(page.getByRole('table')).toBeVisible()

            // Verifiser at 01.09.2025 nå vises som "Avslått"
            const avslåttRow = page.getByRole('row', {
                name: /01\.09\.2025.*Avslått.*Saksbehandler/,
            })
            await expect(avslåttRow).toBeVisible()

            // Verifiser at kilde er saksbehandler
            await expect(avslåttRow.getByRole('img', { name: 'Saksbehandler' })).toBeVisible()

            // Verifiser at paragraf-referansen vises som en lenke (i stedet for direkte beskrivelse)
            // Dette kan være "Kapittel 2" (kun kapittel) eller "§2-1" (kapittel-paragraf)
            const paragrafLink = avslåttRow.locator('a[href*="lovdata.no"]')
            await expect(paragrafLink).toBeVisible()

            // Verifiser at lenken har riktig href
            await expect(paragrafLink).toHaveAttribute(
                'href',
                /https:\/\/lovdata\.no\/lov\/1997-02-28-19\/§\d+(?:-\d+)?/,
            )
            await expect(paragrafLink).toHaveAttribute('target', '_blank')
            await expect(paragrafLink).toHaveAttribute('rel', 'noopener noreferrer')

            // Verifiser at tooltip fungerer ved å hover over paragraf-lenken
            await paragrafLink.hover()

            // Vent på at tooltip vises med beskrivelsen
            await expect(page.locator('[role="tooltip"]')).toBeVisible()
            await expect(page.locator('[role="tooltip"]')).toContainText('Den sykmeldte er ikke medlem i folketrygden')

            //unhover paragraf-lenken
            await page.mouse.move(0, 0)

            // Verifiser at tooltip ikke vises
            await expect(page.locator('[role="tooltip"]')).not.toBeVisible()
        })

        // Valider tilgjengelighet på slutten
        await validerAxe(page, testInfo)
    })
})
