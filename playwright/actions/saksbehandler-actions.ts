import { Page, expect, test } from '@playwright/test'

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

export function navigerTilPersonOgBehandling(ident: string, forventetNavn?: string) {
    return async (page: Page) => {
        await test.step(`Naviger til person ${forventetNavn || ident} og velg behandling`, async () => {
            await søkPerson(ident)(page)
            await page.waitForURL('**/person/*')

            if (forventetNavn) {
                const header = page.getByRole('main')
                const navn = header.getByText(forventetNavn)
                await navn.waitFor({ state: 'visible' })
            }

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
            const ingenYrkesaktiviteter = page.getByText(
                'Ingen yrkesaktivitet registrert for denne saksbehandlingsperioden.',
            )
            await ingenYrkesaktiviteter.waitFor({ state: 'visible' })
        })
    }
}

export function verifiserKategoriTag(forventetTekst: string) {
    return async (page: Page) => {
        await test.step(`Verifiser at kategoritag viser "${forventetTekst}"`, async () => {
            const venstremeny = page.getByRole('complementary', { name: 'venstre sidemeny' })
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

            const orgnummerField = page.getByRole('textbox', { name: 'Organisasjonsnummer' })
            await orgnummerField.waitFor({ state: 'visible' })
            await orgnummerField.fill(orgnummer)

            const sykmeldtRadio = page.getByRole('group', { name: 'Er sykmeldt fra yrkesaktiviteten' })
            await sykmeldtRadio.waitFor({ state: 'visible' })
            await sykmeldtRadio.getByRole('radio', { name: erSykmeldt ? 'Ja' : 'Nei' }).check()

            const typeArbeidstakerRadio = page.getByRole('group', { name: 'Type arbeidstaker' })
            await typeArbeidstakerRadio.waitFor({ state: 'visible' })
            await typeArbeidstakerRadio.getByRole('radio', { name: 'Ordinært arbeidsforhold' }).check()
        })
    }
}

export function fyllUtNæringsdrivendeYrkesaktivitet(type: 'Fisker' | 'Andre', erSykmeldt: boolean = false) {
    return async (page: Page) => {
        await test.step(`Fyll ut næringsdrivende yrkesaktivitet av type ${type}`, async () => {
            const typeSelect = page.getByRole('combobox', { name: 'Velg type yrkesaktivitet' })
            await typeSelect.selectOption('SELVSTENDIG_NÆRINGSDRIVENDE')

            const sykmeldtRadio = page.getByRole('group', { name: 'Er sykmeldt fra yrkesaktiviteten' })
            await sykmeldtRadio.getByRole('radio', { name: erSykmeldt ? 'Ja' : 'Nei' }).check()

            const typeNæringsdrivendeRadio = page.getByRole('group', { name: 'Type selvstendig næringsdrivende' })
            await typeNæringsdrivendeRadio.waitFor({ state: 'visible' })
            await typeNæringsdrivendeRadio.getByRole('radio', { name: type }).check()
        })
    }
}

export function fyllUtFrilanserYrkesaktivitet(erSykmeldt: boolean = false) {
    return async (page: Page) => {
        await test.step('Fyll ut frilanser yrkesaktivitet', async () => {
            const typeSelect = page.getByRole('combobox', { name: 'Velg type yrkesaktivitet' })
            await typeSelect.selectOption('FRILANSER')

            const sykmeldtRadio = page.getByRole('group', { name: 'Er sykmeldt fra yrkesaktiviteten' })
            await sykmeldtRadio.getByRole('radio', { name: erSykmeldt ? 'Ja' : 'Nei' }).check()

            const forsikringGroup = page.getByRole('group', { name: 'Nav-kjøpt forsikring' })
            await forsikringGroup.waitFor({ state: 'visible' })
            await forsikringGroup.getByRole('radio', { name: '100 prosent fra første sykedag' }).check()
        })
    }
}

export function lagreYrkesaktivitet() {
    return async (page: Page) => {
        await test.step('Lagre yrkesaktivitet', async () => {
            const opprettButton = page.getByRole('button', { name: 'Opprett' })
            await opprettButton.click()

            // Vent på at skjemaet lukkes
            const leggTilButton = page.getByRole('button', { name: 'Legg til ny yrkesaktivitet' })
            await leggTilButton.waitFor({ state: 'visible' })
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

export function redigerYrkesaktivitet(radIndex: number = 0) {
    return async (page: Page) => {
        await test.step(`Rediger yrkesaktivitet ${radIndex + 1}`, async () => {
            await utvidYrkesaktivitetRad(radIndex)(page)

            const yrkesaktivitetTabell = await verifiserYrkesaktivitetTabell()(page)
            const redigerButton = yrkesaktivitetTabell.getByRole('button', {
                name: new RegExp(`Rediger yrkesaktivitet ${radIndex + 1}`, 'i'),
            })
            await redigerButton.waitFor({ state: 'visible' })
            await redigerButton.click()
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
