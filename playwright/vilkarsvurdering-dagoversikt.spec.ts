import { expect } from '@playwright/test'
import { validerAxe } from './uuvalidering'
import { test } from './fixtures'

test.describe('Vilkårsvurdering og Dagoversikt', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Kan vurdere vilkår og endre dager til avslått', async ({ page }, testInfo) => {
        // Søk opp Kalle Kranfører
        await page.goto('/person/8j4ns/607f8e85-aaaa-4240-9950-383f6d7eac22')

        // Naviger til Vilkårsvurdering-fanen
        await test.step('Naviger til Vilkårsvurdering', async () => {
            await page.getByRole('tab', { name: 'Vilkårsvurdering' }).click()
            await expect(page.getByRole('tabpanel', { name: 'Vilkårsvurdering' })).toBeVisible()
            // Vent på at Kapittel 2 - Medlemskap i folketrygden er synlig
            await expect(
                page.getByRole('row', { name: 'Kapittel 2 - Medlemskap i folketrygden Ikke vurdert Vis mer' }),
            ).toBeVisible()
        })

        // Valider tilgjengelighet
        await validerAxe(page, testInfo)

        // Utvid Kapittel 2 - Medlemskap i folketrygden
        await test.step('Utvid Kapittel 2 - Medlemskap i folketrygden', async () => {
            // Klikk på "Vis mer" knappen for Kapittel 2
            const kapittel2Row = page.getByRole('row', {
                name: 'Kapittel 2 - Medlemskap i folketrygden Ikke vurdert Vis mer',
            })
            await kapittel2Row.getByRole('button', { name: 'Vis mer' }).click()

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
            await expect(page.getByText('1/16')).toBeVisible()
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
            await page.getByRole('row', { name: 'Velg dag 01.09.2025 Syk 100' }).getByLabel('Velg dag').click()

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
                name: '01.09.2025 Avslått - SB - - - - Den sykmeldte er ikke medlem i folketrygden',
            })
            await expect(avslåttRow).toBeVisible()

            // Verifiser at kilde er "SB" (Saksbehandler)
            await expect(avslåttRow.getByText('SB')).toBeVisible()

            // Verifiser at merknaden vises
            await expect(avslåttRow.getByText('Den sykmeldte er ikke medlem i folketrygden')).toBeVisible()
        })

        // Valider tilgjengelighet på slutten
        await validerAxe(page, testInfo)
    })
})
