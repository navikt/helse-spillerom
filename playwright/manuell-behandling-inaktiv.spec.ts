import { expect } from '@playwright/test'
import { test } from './fixtures'
import {
    navigerTilPerson,
    opprettManuellBehandling,
    navigerTilYrkesaktivitetFane,
    åpneYrkesaktivitetSkjema,
    lagreYrkesaktivitet,
    verifiserKategoriTag,
} from './actions/saksbehandler-actions'
import { validerAxe } from './uuvalidering'

test.describe('Manuell behandling - Inaktiv med 65% dekning', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Kan opprette manuell behandling, sette inaktiv yrkesaktivitet med 65% dekning, sette sykepengegrunnlag til 60000, og verifisere utbetaling', async ({
        page,
    }) => {
        const personIdent = '45454545487'
        const forventetNavn = 'Tobias Halvorsen'
        const periodeFra = '01.01.2025'
        const periodeTil = '31.01.2025'
        const sykepengegrunnlag = '60000'
        const forventetUtbetaling = '41 400,00 kr'
        const forventetUtbetalingsdager = '23 dager'

        // 1. Naviger til person
        await test.step('Naviger til person', async () => {
            await navigerTilPerson(personIdent, forventetNavn)(page)
        })

        // 2. Opprett manuell behandling
        await test.step('Opprett manuell behandling', async () => {
            await opprettManuellBehandling(periodeFra, periodeTil)(page)
            await page.waitForURL('**/person/*/*')
        })

        // 3. Naviger til yrkesaktivitet og sett inaktiv med 65% dekning
        await test.step('Sett yrkesaktivitet til inaktiv med 65% dekning', async () => {
            await navigerTilYrkesaktivitetFane()(page)
            await åpneYrkesaktivitetSkjema()(page)

            // Velg "Inaktiv" som yrkesaktivitetstype
            const yrkesaktivitetSelect = page.getByLabel('Velg type yrkesaktivitet')
            await yrkesaktivitetSelect.selectOption('Inaktiv')

            // Velg "Bokstav A, 65% dekningsgrad"
            const dekningsgradRadio = page.getByRole('radio', { name: 'Bokstav A, 65% dekningsgrad' })
            await dekningsgradRadio.click()

            await lagreYrkesaktivitet()(page)
        })

        // 4. Verifiser at yrkesaktivitet er opprettet
        await test.step('Verifiser yrkesaktivitet', async () => {
            const yrkesaktivitetTabell = page.getByRole('table', { name: 'Yrkesaktivitet oversikt' })
            await expect(yrkesaktivitetTabell).toBeVisible()

            const inaktivRad = yrkesaktivitetTabell.locator('tbody tr').first()
            await expect(inaktivRad).toContainText('Inaktiv')
            await expect(inaktivRad).toContainText('Ja') // Sykmeldt

            // Verifiser at venstremeny viser 65% dekning
            const venstremeny = page.getByRole('complementary', { name: 'venstre sidemeny' })
            await expect(venstremeny).toContainText('Dekningsgrad:')
            await expect(venstremeny).toContainText('65%')
        })

        // 5. Naviger til sykepengegrunnlag og sett til 60000
        await test.step('Sett sykepengegrunnlag til 60000', async () => {
            const sykepengegrunnlagTab = page.getByRole('tab', { name: 'Sykepengegrunnlag' })
            await sykepengegrunnlagTab.click()

            // Klikk på "Rediger" knapp
            const redigerButton = page.getByRole('button', { name: 'Rediger' })
            await redigerButton.click()

            // Fyll ut inntekt til 60000
            const inntektInput = page.getByRole('textbox', { name: 'Inntekt' })
            await inntektInput.fill(sykepengegrunnlag)

            // Lagre endringer
            const lagreButton = page.getByRole('button', { name: 'Lagre' })
            await lagreButton.click()
        })

        // 6. Verifiser sykepengegrunnlag
        await test.step('Verifiser sykepengegrunnlag', async () => {
            const venstremeny = page.getByRole('complementary', { name: 'venstre sidemeny' })
            await expect(venstremeny).toContainText('Sykepengegrunnlag:')
            await expect(venstremeny).toContainText('720 000,00 kr') // 60000 * 12 måneder

            // Verifiser at inntekten vises i tabellen
            const inntektRad = page.locator('text=60 000,00 kr')
            await expect(inntektRad).toBeVisible()
        })

        // 7. Naviger til dagoversikt og sett alle arbeidsdager til syk
        await test.step('Sett alle arbeidsdager til syk', async () => {
            const dagoversiktTab = page.getByRole('tab', { name: 'Dagoversikt' })
            await dagoversiktTab.click()

            // Klikk på "Endre dager"
            const endreDagerButton = page.getByRole('button', { name: 'Endre dager' })
            await endreDagerButton.click()

            // Velg alle dager
            const velgAlleDagerCheckbox = page.getByRole('checkbox', { name: 'Velg alle dager' })
            await velgAlleDagerCheckbox.click()

            // Verifiser at alle dager er valgt og at formen viser riktig antall
            const endreButton = page.getByRole('button', { name: /Endre \(\d+\)/ })
            await expect(endreButton).toBeVisible()

            // Klikk på "Endre" knappen
            await endreButton.click()
        })

        // 8. Verifiser at alle arbeidsdager er satt til syk
        await test.step('Verifiser at arbeidsdager er satt til syk', async () => {
            const dagoversiktTabell = page.getByRole('table')
            await expect(dagoversiktTabell).toBeVisible()

            // Sjekk at arbeidsdager viser "Syk" og helgedager viser "Helg"
            const sykeDager = dagoversiktTabell.locator('text=Syk')
            const helgeDager = dagoversiktTabell.locator('text=Helg')

            // Det skal være 23 arbeidsdager (syk) og 8 helgedager
            await expect(sykeDager).toHaveCount(23)
            await expect(helgeDager).toHaveCount(8)

            // Verifiser at hver sykedag viser 1 800 kr i utbetaling
            const utbetalingBeløp = dagoversiktTabell.locator('text=1 800 kr')
            await expect(utbetalingBeløp).toHaveCount(23)

            // Verifiser total utbetaling før endring til ferie
            const venstremeny = page.getByRole('complementary', { name: 'venstre sidemeny' })
            await expect(venstremeny).toContainText('Utbetalingsdager:')
            await expect(venstremeny).toContainText(forventetUtbetalingsdager) // 23 dager
            await expect(venstremeny).toContainText('Beløp for perioden')
            await expect(venstremeny).toContainText(forventetUtbetaling) // 41 400,00 kr
        })

        // 9. Endre de første 10 dagene til ferie
        await test.step('Endre de første 10 dagene til ferie', async () => {
            // Klikk på "Endre dager" igjen
            const endreDagerButton = page.getByRole('button', { name: 'Endre dager' })
            await endreDagerButton.click()

            // Velg de første 10 arbeidsdagene (ikke helgedager)
            const dagoversiktTabell = page.getByRole('table')
            const arbeidsdager = dagoversiktTabell.locator('tbody tr').filter({ hasText: 'Syk' })

            // Velg de første 10 sykedagene
            for (let i = 0; i < 10; i++) {
                const rad = arbeidsdager.nth(i)
                const checkbox = rad.locator('input[type="checkbox"]')
                await checkbox.check()
            }

            // Velg "Ferie" som ny status
            const dagtypeSelect = page.getByRole('combobox', { name: 'Dagtype' })
            await dagtypeSelect.selectOption('Ferie')

            // Klikk på "Endre" knappen
            const endreButton = page.getByRole('button', { name: /Endre \(\d+\)/ })
            await endreButton.click()
        })

        // 10. Verifiser at de første 10 dagene er endret til ferie
        await test.step('Verifiser at de første 10 dagene er ferie', async () => {
            const dagoversiktTabell = page.getByRole('table')
            await expect(dagoversiktTabell).toBeVisible()

            // Sjekk at det nå er 13 sykedager og 10 feriedager
            const sykeDager = dagoversiktTabell.locator('text=Syk')
            const ferieDager = dagoversiktTabell.locator('text=Ferie')
            const helgeDager = dagoversiktTabell.locator('text=Helg')

            await expect(sykeDager).toHaveCount(13)
            await expect(ferieDager).toHaveCount(10)
            await expect(helgeDager).toHaveCount(8)

            // Verifiser at feriedager viser 0 kr i utbetaling (siste "0 kr" i hver rad er utbetaling)
            const ferieRader = dagoversiktTabell.locator('tbody tr').filter({ hasText: 'Ferie' })
            for (let i = 0; i < 10; i++) {
                const rad = ferieRader.nth(i)
                const utbetalingCell = rad.locator('td').nth(6) // Utbetaling kolonne
                await expect(utbetalingCell).toContainText('0 kr')
            }

            // Verifiser at de resterende sykedagene fortsatt viser 1 800 kr
            const sykUtbetaling = dagoversiktTabell.locator('text=1 800 kr')
            await expect(sykUtbetaling).toHaveCount(13)
        })

        // 11. Verifiser oppdatert total utbetaling
        await test.step('Verifiser oppdatert total utbetaling', async () => {
            const venstremeny = page.getByRole('complementary', { name: 'venstre sidemeny' })

            // Nye forventede verdier: 13 sykedager * 1 800 kr = 23 400 kr
            const forventetOppdatertUtbetaling = '23 400,00 kr'
            const forventetOppdatertUtbetalingsdager = '13 dager'

            // Verifiser utbetalingsdager
            await expect(venstremeny).toContainText('Utbetalingsdager:')
            await expect(venstremeny).toContainText(forventetOppdatertUtbetalingsdager)

            // Verifiser beløp for perioden
            await expect(venstremeny).toContainText('Beløp for perioden')
            await expect(venstremeny).toContainText(forventetOppdatertUtbetaling)

            // Verifiser utbetaling til person
            await expect(venstremeny).toContainText(forventetNavn)
            await expect(venstremeny).toContainText(forventetOppdatertUtbetaling)
        })
    })
})
