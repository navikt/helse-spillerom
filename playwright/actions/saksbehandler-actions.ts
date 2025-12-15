import { expect, Page, test } from '@playwright/test'

export function hentVenstremeny() {
    return async (page: Page) => {
        const venstremeny = page.getByRole('complementary', { name: 'venstre sidemeny' })
        await venstremeny.waitFor({ state: 'visible' })
        return venstremeny
    }
}

export function tilFørstesiden({ clearCookies }: { clearCookies: boolean } = { clearCookies: true }) {
    return async (page: Page) => {
        await test.step('Naviger til førstesiden', async () => {
            if (!clearCookies) {
                await page.context().clearCookies()
            }
            await page.goto('/')
        })
    }
}

export function søkPerson(ident: string) {
    return async (page: Page) => {
        await test.step(`Søk etter person med ident ${ident}`, async () => {
            const searchInput = page.getByRole('searchbox', { name: 'Fødselsnummer/Aktør-ID' })
            await searchInput.fill(ident)
            await searchInput.press('Enter')
        })
    }
}

export function navigerTilPerson(ident: string, forventetNavn?: string) {
    return async (page: Page) => {
        await test.step(`Naviger til person ${forventetNavn || ident}`, async () => {
            await søkPerson(ident)(page)
            await page.waitForURL('**/person/*')

            if (forventetNavn) {
                const header = page.getByRole('main')
                const navn = header.getByText(forventetNavn)
                await navn.waitFor({ state: 'visible' })
            }
        })
    }
}

export function navigerTilPersonOgBehandling(ident: string, forventetNavn?: string) {
    return async (page: Page) => {
        await test.step(`Naviger til person ${forventetNavn || ident} og velg behandling`, async () => {
            await navigerTilPerson(ident, forventetNavn)(page)

            // Finn og klikk på lenken til eksisterende behandling
            const behandlingLink = page.getByRole('link', { name: /\d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}/ })
            await behandlingLink.click()
            await page.waitForURL('**/person/*/*')
        })
    }
}

export function navigerTilYrkesaktivitetFane() {
    return async (page: Page) => {
        await test.step('Naviger til yrkesaktivitet-fanen', async () => {
            const yrkesaktivitetTab = page.getByRole('tab', { name: /Yrkesaktivitet/i })
            await yrkesaktivitetTab.click()
        })
    }
}

export function verifiserIngenYrkesaktiviteter() {
    return async (page: Page) => {
        await test.step('Verifiser at ingen yrkesaktivitet er registrert', async () => {
            const ingenYrkesaktiviteter = page.getByText('Ingen yrkesaktivitet registrert for denne behandlingen.')
            await ingenYrkesaktiviteter.waitFor({ state: 'visible' })
        })
    }
}

export function verifiserKategoriTag(forventetTekst: string) {
    return async (page: Page) => {
        await test.step(`Verifiser at kategoritag viser "${forventetTekst}"`, async () => {
            const venstremeny = await hentVenstremeny()(page)
            const saksinformasjon = venstremeny.getByRole('region', { name: 'Saksinformasjon' })
            await saksinformasjon.waitFor({ state: 'visible' })
            await expect(saksinformasjon).toContainText(forventetTekst)
        })
    }
}

export function åpneYrkesaktivitetSkjema() {
    return async (page: Page) => {
        await test.step('Åpne skjema for ny yrkesaktivitet', async () => {
            const leggTilButton = page.getByRole('button', { name: 'Legg til ny yrkesaktivitet' })
            await leggTilButton.click()
        })
    }
}

export function fyllUtArbeidstakerYrkesaktivitet(orgnummer: string, erSykmeldt: boolean = true) {
    return async (page: Page) => {
        await test.step(`Fyll ut arbeidstaker yrkesaktivitet med orgnummer ${orgnummer}`, async () => {
            const typeSelect = page.getByRole('combobox', { name: 'Velg type yrkesaktivitet' })
            await typeSelect.waitFor({ state: 'visible' })
            await typeSelect.selectOption('ARBEIDSTAKER')

            const sykmeldtRadio = page.getByRole('group', { name: 'Er sykmeldt fra yrkesaktiviteten' })
            await sykmeldtRadio.waitFor({ state: 'visible' })
            await sykmeldtRadio.getByRole('radio', { name: erSykmeldt ? 'Ja' : 'Nei' }).check()

            const typeArbeidstakerRadio = page.getByRole('group', { name: 'Type arbeidstaker' })
            await typeArbeidstakerRadio.waitFor({ state: 'visible' })
            await typeArbeidstakerRadio.getByRole('radio', { name: 'Ordinært arbeidsforhold' }).check()

            const orgnummerField = page.getByRole('textbox', { name: 'Organisasjonsnummer' })
            await orgnummerField.waitFor({ state: 'visible' })
            await orgnummerField.fill(orgnummer)
        })
    }
}

export function fyllUtNæringsdrivendeYrkesaktivitet(
    type: string,
    navKjopt: string | null = null,
    erSykmeldt: boolean = false,
) {
    return async (page: Page) => {
        await test.step(`Fyll ut næringsdrivende yrkesaktivitet av type ${type}`, async () => {
            const typeSelect = page.getByRole('combobox', { name: 'Velg type yrkesaktivitet' })
            await typeSelect.selectOption('SELVSTENDIG_NÆRINGSDRIVENDE')

            const sykmeldtRadio = page.getByRole('group', { name: 'Er sykmeldt fra yrkesaktiviteten' })
            await sykmeldtRadio.getByRole('radio', { name: erSykmeldt ? 'Ja' : 'Nei' }).check()

            const typeNæringsdrivendeRadio = page.getByRole('group', { name: 'Type selvstendig næringsdrivende' })
            await typeNæringsdrivendeRadio.waitFor({ state: 'visible' })
            await typeNæringsdrivendeRadio.getByRole('radio', { name: type }).check()

            if (navKjopt) {
                const navKjoptRadio = page.getByRole('group', { name: 'Nav-kjøpt forsikring' })
                await navKjoptRadio.waitFor({ state: 'visible' })
                await navKjoptRadio.getByRole('radio', { name: navKjopt }).check()
            }
        })
    }
}

export function fyllUtFrilanserYrkesaktivitet(erSykmeldt: boolean = false, orgnummer: string) {
    return async (page: Page) => {
        await test.step('Fyll ut frilanser yrkesaktivitet', async () => {
            const typeSelect = page.getByRole('combobox', { name: 'Velg type yrkesaktivitet' })
            await typeSelect.selectOption('FRILANSER')

            const orgnummerField = page.getByRole('textbox', { name: 'Organisasjonsnummer' })
            await orgnummerField.waitFor({ state: 'visible' })
            await orgnummerField.fill(orgnummer)

            const sykmeldtRadio = page.getByRole('group', { name: 'Er sykmeldt fra yrkesaktiviteten' })
            await sykmeldtRadio.getByRole('radio', { name: erSykmeldt ? 'Ja' : 'Nei' }).check()

            const forsikringGroup = page.getByRole('group', { name: 'Nav-kjøpt forsikring' })
            await forsikringGroup.waitFor({ state: 'visible' })
            await forsikringGroup.getByRole('radio', { name: '100 prosent fra første sykedag' }).check()
        })
    }
}

export function fyllUtInaktivYrkesaktivitet() {
    return async (page: Page) => {
        await test.step(`Fyll ut inaktiv yrkesaktivitet`, async () => {
            const typeSelect = page.getByRole('combobox', { name: 'Velg type yrkesaktivitet' })
            await typeSelect.selectOption('INAKTIV')
        })
    }
}

export function lagreYrkesaktivitet() {
    return async (page: Page) => {
        await test.step('Lagre yrkesaktivitet', async () => {
            const opprettButton = page.getByRole('button', { name: 'Opprett' })
            opprettButton.waitFor({ state: 'visible' })
            await opprettButton.click()

            // Vent på at skjemaet lukkes
            opprettButton.waitFor({ state: 'hidden' })
        })
    }
}

export function lagreRedigertYrkesaktivitet() {
    return async (page: Page) => {
        await test.step('Lagre redigert yrkesaktivitet', async () => {
            const lagreButton = page.getByRole('button', { name: 'Lagre' })
            await lagreButton.click()

            // Vent på at redigeringen lukkes
            const leggTilButton = page.getByRole('button', { name: 'Legg til ny yrkesaktivitet' })
            await leggTilButton.waitFor({ state: 'visible' })
        })
    }
}

export function verifiserYrkesaktivitetTabell() {
    return async (page: Page) => {
        const yrkesaktivitetTabell = page.getByRole('table', { name: 'Yrkesaktivitet oversikt' })
        await yrkesaktivitetTabell.waitFor({ state: 'visible' })
        return yrkesaktivitetTabell
    }
}

export function verifiserAntallYrkesaktiviteter(antall: number) {
    return async (page: Page) => {
        await test.step(`Verifiser at det er ${antall} yrkesaktiviteter`, async () => {
            const yrkesaktivitetTabell = await verifiserYrkesaktivitetTabell()(page)
            const tabellRader = yrkesaktivitetTabell.locator('tbody tr')
            await expect(tabellRader).toHaveCount(antall)
        })
    }
}

export function utvidYrkesaktivitetRad(radIndex: number = 0) {
    return async (page: Page) => {
        await test.step(`Utvid yrkesaktivitet-rad ${radIndex + 1}`, async () => {
            const yrkesaktivitetTabell = await verifiserYrkesaktivitetTabell()(page)
            const rad = yrkesaktivitetTabell.locator('tbody tr').nth(radIndex)
            const toggle = rad.getByRole('button', { name: /Vis (mer|mindre)/i })

            const toggleText = await toggle.textContent()
            if (toggleText?.includes('Vis mer')) {
                await toggle.click()
            }
        })
    }
}

export function slettYrkesaktivitet(radIndex: number = 0) {
    return async (page: Page) => {
        await test.step(`Slett yrkesaktivitet ${radIndex + 1}`, async () => {
            await utvidYrkesaktivitetRad(radIndex)(page)

            const yrkesaktivitetTabell = await verifiserYrkesaktivitetTabell()(page)
            const slettButton = yrkesaktivitetTabell.getByRole('button', {
                name: new RegExp(`Slett yrkesaktivitet ${radIndex + 1}`, 'i'),
            })
            await slettButton.waitFor({ state: 'visible' })
            await slettButton.click()

            // Bekreft sletting i modal
            const slettModal = page.getByRole('dialog', { name: 'Slett yrkesaktivitet' })
            await slettModal.waitFor({ state: 'visible' })

            const bekreftSlettButton = slettModal.getByRole('button', { name: 'Slett' })
            await bekreftSlettButton.click()

            // Vent på at modalen lukkes
            await slettModal.waitFor({ state: 'hidden' })
        })
    }
}

export function navigerTilStartBehandling() {
    return async (page: Page) => {
        await test.step('Naviger til start behandling-fanen', async () => {
            const startBehandlingButton = page.getByRole('button', { name: 'Start ny behandling' })
            await startBehandlingButton.click()
        })
    }
}

export function aktiverManuellPeriode() {
    return async (page: Page) => {
        await test.step('Aktiver manuell periode-modus', async () => {
            const manuellPeriodeCheckbox = page.getByRole('checkbox', { name: 'Manuell periode' })
            await manuellPeriodeCheckbox.check()
        })
    }
}

export function deaktiverManuellPeriode() {
    return async (page: Page) => {
        await test.step('Deaktiver manuell periode-modus', async () => {
            const manuellPeriodeCheckbox = page.getByRole('checkbox', { name: 'Manuell periode' })
            await manuellPeriodeCheckbox.uncheck()
        })
    }
}

export function fyllUtManuellPeriode(fom: string, tom: string) {
    return async (page: Page) => {
        await test.step(`Fyll ut manuell periode fra ${fom} til ${tom}`, async () => {
            const fomInput = page.getByRole('textbox', { name: 'Fra og med' })
            const tomInput = page.getByRole('textbox', { name: 'Til og med' })

            await fomInput.fill(fom)
            await tomInput.fill(tom)
        })
    }
}

export function fyllUtManuellPeriodeUtenTom(fom: string) {
    return async (page: Page) => {
        await test.step(`Fyll ut manuell periode fra ${fom} uten til-dato`, async () => {
            const fomInput = page.getByRole('textbox', { name: 'Fra og med' })
            await fomInput.fill(fom)
        })
    }
}

export function fyllUtManuellPeriodeUtenFom(tom: string) {
    return async (page: Page) => {
        await test.step(`Fyll ut manuell periode til ${tom} uten fra-dato`, async () => {
            const tomInput = page.getByRole('textbox', { name: 'Til og med' })
            await tomInput.fill(tom)
        })
    }
}

export function endreSøknadDato(dato: string) {
    return async (page: Page) => {
        await test.step(`Endre søknad-dato til ${dato}`, async () => {
            const datoInput = page.getByRole('textbox', { name: 'Hent alle søknader etter' })
            await datoInput.fill(dato)
            await datoInput.press('Enter')
        })
    }
}

export function velgSøknad(søknadIndex: number = 0) {
    return async (page: Page) => {
        await test.step(`Velg søknad ${søknadIndex + 1}`, async () => {
            const søknadCheckboxes = page.getByRole('checkbox', {
                name: /\d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}/,
            })
            await søknadCheckboxes.nth(søknadIndex).check()
        })
    }
}

export function fjernSøknad(søknadIndex: number = 0) {
    return async (page: Page) => {
        await test.step(`Fjern søknad ${søknadIndex + 1}`, async () => {
            const søknadCheckboxes = page.getByRole('checkbox', {
                name: /\d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}/,
            })
            await søknadCheckboxes.nth(søknadIndex).uncheck()
        })
    }
}

export function startBehandling() {
    return async (page: Page) => {
        await test.step('Klikk på start behandling-knappen', async () => {
            const startButton = page.getByRole('button', { name: 'Start behandling' })
            await startButton.click()
        })
    }
}

export function verifiserFeilmelding(forventetTekst: string) {
    return async (page: Page) => {
        await test.step(`Verifiser at feilmelding "${forventetTekst}" vises`, async () => {
            const feilmelding = page.getByText(forventetTekst)
            await expect(feilmelding).toBeVisible()
        })
    }
}

export function verifiserIngenFeilmelding() {
    return async (page: Page) => {
        await test.step('Verifiser at ingen feilmelding vises', async () => {
            const feilmeldinger = page.locator('.text-red-600')
            await expect(feilmeldinger).toHaveCount(0)
        })
    }
}

export function verifiserIngenSøknader() {
    return async (page: Page) => {
        await test.step('Verifiser at ingen søknader er tilgjengelige', async () => {
            const ingenSøknader = page.getByText('Ingen søknader etter valgt dato')
            await expect(ingenSøknader).toBeVisible()
        })
    }
}

export function verifiserSøknaderTilgjengelige() {
    return async (page: Page) => {
        await test.step('Verifiser at søknader er tilgjengelige', async () => {
            const søknadCheckboxes = page.getByRole('checkbox', {
                name: /\d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}/,
            })
            await expect(søknadCheckboxes.first()).toBeVisible()
        })
    }
}

export function navigerTilOpprettBehandling() {
    return async (page: Page) => {
        await test.step('Naviger til opprett behandling', async () => {
            const startBehandlingButton = page.getByRole('button', { name: 'Start ny behandling' })
            await startBehandlingButton.click()
            await page.waitForURL('**/opprett-saksbehandlingsperiode')
        })
    }
}

export function opprettManuellBehandling(fom: string, tom: string) {
    return async (page: Page) => {
        await test.step(`Opprett manuell behandling fra ${fom} til ${tom}`, async () => {
            await navigerTilOpprettBehandling()(page)

            const manuellPeriodeCheckbox = page.getByRole('checkbox', { name: 'Manuell periode' })
            await manuellPeriodeCheckbox.check()

            // Fyll ut periode-datoer
            const fomInput = page.getByRole('textbox', { name: 'Fra og med' })
            const tomInput = page.getByRole('textbox', { name: 'Til og med' })

            await fomInput.fill(fom)
            await tomInput.fill(tom)

            // Start behandling
            const startButton = page.getByRole('button', { name: 'Start behandling' })
            await startButton.click()
        })
    }
}

export function opprettManuellBehandlingMedYrkesaktivitet(
    personIdent: string,
    fyllUtYrkesaktivitet: (page: Page) => Promise<void>,
    fom: string = '01.01.2025',
    tom: string = '28.09.2025',
) {
    return async (page: Page) => {
        await test.step(`Opprett manuell behandling med yrkesaktivitet for person ${personIdent}`, async () => {
            await navigerTilPerson(personIdent)(page)
            await opprettManuellBehandling(fom, tom)(page)
            await navigerTilYrkesaktivitetFane()(page)
            await åpneYrkesaktivitetSkjema()(page)
            await fyllUtYrkesaktivitet(page)
            await lagreYrkesaktivitet()(page)
        })
    }
}

export function navigerTilSykepengegrunnlagFane() {
    return async (page: Page) => {
        await test.step('Naviger til sykepengegrunnlag-fanen', async () => {
            const sykepengegrunnlagTab = page.getByRole('tab', { name: 'Sykepengegrunnlag', exact: true })
            await sykepengegrunnlagTab.click()
        })
    }
}

export function velgSykepengegrunnlagKilde(kilde: 'Inntektsmelding' | 'A-inntekt' | 'Skjønnsfastsatt') {
    return async (page: Page) => {
        await test.step(`Velg sykepengegrunnlag kilde: ${kilde}`, async () => {
            // Vent på at skjemaet er åpent
            await page.waitForSelector('form', { state: 'visible' })

            const kildeSelect = page.getByRole('combobox', { name: 'Kilde' })
            await kildeSelect.waitFor({ state: 'visible' })
            await kildeSelect.selectOption({ label: kilde })
        })
    }
}

export function fyllUtSykepengegrunnlag(inntekt: string, begrunnelse: string = 'Test inntekt for sykepengegrunnlag') {
    return async (page: Page) => {
        await test.step(`Fyll ut sykepengegrunnlag med inntekt ${inntekt}`, async () => {
            // Vent på at skjemaet er åpent
            await page.waitForSelector('form', { state: 'visible' })

            // Velg kilde først for å gjøre årsinntekt-feltet redigerbart
            // For manuell inntekt må vi velge "Skjønnsfastsatt"
            await velgSykepengegrunnlagKilde('Skjønnsfastsatt')(page)

            // Vent på at årsinntekt-feltet blir redigerbart
            const inntektField = page.getByRole('textbox', { name: 'Årsinntekt' })
            await inntektField.waitFor({ state: 'visible' })
            await inntektField.waitFor({ state: 'attached' })
            // Sjekk at feltet ikke lenger er readonly
            await expect(inntektField).not.toHaveAttribute('readonly', '')
            await inntektField.fill(inntekt)

            const begrunnelseField = page.getByRole('textbox', { name: 'Begrunnelse' })
            await begrunnelseField.waitFor({ state: 'visible' })
            await begrunnelseField.fill(begrunnelse)
        })
    }
}

export function lagreSykepengegrunnlag() {
    return async (page: Page) => {
        await test.step('Lagre sykepengegrunnlag', async () => {
            const lagreButton = page.getByRole('button', { name: 'Lagre' })
            await lagreButton.click()

            // Vent på at skjemaet lukkes
            await lagreButton.waitFor({ state: 'hidden' })
        })
    }
}

export function settSykepengegrunnlagNæringsdrivende(begrunnelse: string = 'Test inntekt for sykepengegrunnlag') {
    return async (page: Page) => {
        await test.step(`Forn næringsdrivende`, async () => {
            await navigerTilSykepengegrunnlagFane()(page)
            const begrunnelseField = page.getByRole('textbox', { name: 'Begrunnelse' })
            await begrunnelseField.waitFor({ state: 'visible' })
            await begrunnelseField.fill(begrunnelse)
            await lagreSykepengegrunnlag()(page)
        })
    }
}

export function settSykepengegrunnlag(
    inntekt: string = '500000',
    begrunnelse: string = 'Test inntekt for sykepengegrunnlag',
) {
    return async (page: Page) => {
        await test.step(`Sett sykepengegrunnlag med inntekt ${inntekt}`, async () => {
            await navigerTilSykepengegrunnlagFane()(page)
            await fyllUtSykepengegrunnlag(inntekt, begrunnelse)(page)
            await lagreSykepengegrunnlag()(page)
        })
    }
}
