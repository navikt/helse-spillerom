import { expect } from '@playwright/test'
import { test } from './fixtures'
import {
    søkPerson,
    navigerTilStartBehandling,
    aktiverManuellPeriode,
    deaktiverManuellPeriode,
    fyllUtManuellPeriode,
    fyllUtManuellPeriodeUtenTom,
    fyllUtManuellPeriodeUtenFom,
    endreSøknadDato,
    velgSøknad,
    fjernSøknad,
    startBehandling,
    verifiserFeilmelding,
    verifiserIngenFeilmelding,
    verifiserIngenSøknader,
    verifiserSøknaderTilgjengelige,
} from './actions/saksbehandler-actions'

test.describe('StartBehandling Form - Feilhåndtering', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test.describe('Kalle Kranfører - Søknad-basert periode', () => {
        test.beforeEach(async ({ page }) => {
            // Søk opp Kalle Kranfører og naviger til start behandling
            await søkPerson('12345678901')(page)
            await page.waitForURL('**/person/*')

            const header = page.getByRole('main')
            const navn = header.getByText('Kalle Kranfører')
            await expect(navn).toBeVisible()

            await navigerTilStartBehandling()(page)
        })

        test('viser feilmelding når ingen søknader er valgt', async ({ page }) => {
            // Prøv å starte behandling uten å velge søknader
            await startBehandling()(page)

            // Verifiser at feilmelding vises
            await verifiserFeilmelding('Du må velge minst én søknad')(page)
        })

        test('viser feilmelding når alle søknader fjernes', async ({ page }) => {
            // Endre dato til en tid hvor det er søknader tilgjengelige
            await endreSøknadDato('01.01.2024')(page)

            // Verifiser at søknader er tilgjengelige
            await verifiserSøknaderTilgjengelige()(page)

            // Velg en søknad først
            await velgSøknad(0)(page)

            // Fjern søknaden
            await fjernSøknad(0)(page)

            // Prøv å starte behandling
            await startBehandling()(page)

            // Verifiser at feilmelding vises
            await verifiserFeilmelding('Du må velge minst én søknad')(page)
        })

        test('viser ikke feilmelding når søknad er valgt', async ({ page }) => {
            // Endre dato til en tid hvor det er søknader tilgjengelige
            await endreSøknadDato('01.01.2024')(page)

            // Verifiser at søknader er tilgjengelige
            await verifiserSøknaderTilgjengelige()(page)

            // Velg en søknad
            await velgSøknad(0)(page)

            // Prøv å starte behandling
            await startBehandling()(page)

            // Verifiser at ingen feilmelding vises
            await verifiserIngenFeilmelding()(page)
        })

        test('viser feilmelding når dato endres og ingen søknader er tilgjengelige', async ({ page }) => {
            // Endre dato til en tid hvor det ikke er søknader
            await endreSøknadDato('01.01.2028')(page)

            // Verifiser at ingen søknader er tilgjengelige
            await verifiserIngenSøknader()(page)

            // Prøv å starte behandling
            await startBehandling()(page)

            // Verifiser at feilmelding vises
            await verifiserFeilmelding('Du må velge minst én søknad')(page)
        })
    })

    test.describe('Blanke Ark - Manuell periode', () => {
        test.beforeEach(async ({ page }) => {
            // Søk opp Blanke Ark og naviger til start behandling
            await søkPerson('13064512348')(page)
            await page.waitForURL('**/person/*')

            const header = page.getByRole('main')
            const navn = header.getByText('Blanke Ark')
            await expect(navn).toBeVisible()

            await navigerTilStartBehandling()(page)
        })

        test('viser feilmelding når manuell periode aktiveres uten datoer', async ({ page }) => {
            // Aktiver manuell periode
            await aktiverManuellPeriode()(page)

            // Prøv å starte behandling uten å fylle ut datoer
            await startBehandling()(page)

            // Verifiser at feilmelding vises
            await verifiserFeilmelding('Du må velge både fra og til dato')(page)
        })

        test('viser feilmelding når kun fra-dato er fylt ut', async ({ page }) => {
            // Aktiver manuell periode
            await aktiverManuellPeriode()(page)

            // Fyll ut kun fra-dato
            await fyllUtManuellPeriodeUtenTom('01.01.2024')(page)

            // Prøv å starte behandling
            await startBehandling()(page)

            // Verifiser at feilmelding vises
            await verifiserFeilmelding('Du må velge både fra og til dato')(page)
        })

        test('viser feilmelding når kun til-dato er fylt ut', async ({ page }) => {
            // Aktiver manuell periode
            await aktiverManuellPeriode()(page)

            // Fyll ut kun til-dato
            await fyllUtManuellPeriodeUtenFom('31.12.2024')(page)

            // Prøv å starte behandling
            await startBehandling()(page)

            // Verifiser at feilmelding vises
            await verifiserFeilmelding('Du må velge både fra og til dato')(page)
        })

        test('viser ikke feilmelding når begge datoer er fylt ut', async ({ page }) => {
            // Aktiver manuell periode
            await aktiverManuellPeriode()(page)

            // Fyll ut begge datoer
            await fyllUtManuellPeriode('01.01.2024', '31.12.2024')(page)

            // Prøv å starte behandling
            await startBehandling()(page)

            // Verifiser at ingen feilmelding vises
            await verifiserIngenFeilmelding()(page)
        })

        test('fjerner feilmelding når manuell periode deaktiveres', async ({ page }) => {
            // Aktiver manuell periode og fyll ut kun fra-dato
            await aktiverManuellPeriode()(page)
            await fyllUtManuellPeriodeUtenTom('01.01.2024')(page)

            // Prøv å starte behandling (dette vil vise feilmelding)
            await startBehandling()(page)
            await verifiserFeilmelding('Du må velge både fra og til dato')(page)

            // Deaktiver manuell periode
            await deaktiverManuellPeriode()(page)

            // Verifiser at feilmeldingen er fjernet
            await verifiserIngenFeilmelding()(page)
        })
    })

    test.describe('Kombinerte scenarier', () => {
        test('håndterer overgang mellom manuell og søknad-basert periode', async ({ page }) => {
            // Start med Kalle Kranfører
            await søkPerson('12345678901')(page)
            await page.waitForURL('**/person/*')
            await navigerTilStartBehandling()(page)

            // Prøv å starte behandling uten å velge søknader
            await startBehandling()(page)
            await verifiserFeilmelding('Du må velge minst én søknad')(page)

            // Aktiver manuell periode
            await aktiverManuellPeriode()(page)

            // Verifiser at feilmeldingen endres
            await startBehandling()(page)
            await verifiserFeilmelding('Du må velge både fra og til dato')(page)

            // Fyll ut manuell periode
            await fyllUtManuellPeriode('01.01.2024', '31.12.2024')(page)

            // Verifiser at ingen feilmelding vises
            await startBehandling()(page)
            await verifiserIngenFeilmelding()(page)
        })

        test('viser riktig feilmelding når man bytter mellom personer', async ({ page }) => {
            // Start med Kalle Kranfører
            await søkPerson('12345678901')(page)
            await page.waitForURL('**/person/*')
            await navigerTilStartBehandling()(page)

            // Aktiver manuell periode og fyll ut datoer
            await aktiverManuellPeriode()(page)
            await fyllUtManuellPeriode('01.01.2024', '31.12.2024')(page)

            // Verifiser at ingen feilmelding vises
            await startBehandling()(page)
            await verifiserIngenFeilmelding()(page)

            // Bytt til Blanke Ark
            await page.goto('/')
            await søkPerson('13064512348')(page)
            await page.waitForURL('**/person/*')
            await navigerTilStartBehandling()(page)

            // Prøv å starte behandling uten å velge søknader
            await startBehandling()(page)
            await verifiserFeilmelding('Du må velge minst én søknad')(page)
        })
    })
})
