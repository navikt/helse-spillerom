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
            const main = page.locator('main')
            const searchInput = main.getByRole('searchbox', { name: 'Fødselsnummer/Aktør-ID' })
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

export function navigerTilInntektsforholdFane() {
    return async (page: Page) => {
        await test.step('Naviger til inntektsforhold-fanen', async () => {
            const inntektsforholdTab = page.getByRole('tab', { name: /Inntektsforhold/i })
            await inntektsforholdTab.click()
        })
    }
}

export function verifiserIngenInntektsforhold() {
    return async (page: Page) => {
        await test.step('Verifiser at ingen inntektsforhold er registrert', async () => {
            const ingenInntektsforhold = page.getByText(
                'Ingen inntektsforhold registrert for denne saksbehandlingsperioden.',
            )
            await ingenInntektsforhold.waitFor({ state: 'visible' })
        })
    }
}

export function verifiserKategoriTag(forventetTekst: string) {
    return async (page: Page) => {
        await test.step(`Verifiser at kategoritag viser "${forventetTekst}"`, async () => {
            const venstremeny = page.getByRole('complementary', { name: 'venstre sidemeny' })
            const kategoriTag = venstremeny.getByRole('region', { name: 'Inntektskategorier' })
            await kategoriTag.waitFor({ state: 'visible' })
            await expect(kategoriTag).toContainText(forventetTekst)
        })
    }
}

export function åpneInntektsforholdSkjema() {
    return async (page: Page) => {
        await test.step('Åpne skjema for nytt inntektsforhold', async () => {
            const leggTilButton = page.getByRole('button', { name: 'Legg til nytt inntektsforhold' })
            await leggTilButton.click()
        })
    }
}

export function fyllUtArbeidstakerInntektsforhold(orgnummer: string, erSykmeldt: boolean = true) {
    return async (page: Page) => {
        await test.step(`Fyll ut arbeidstaker inntektsforhold med orgnummer ${orgnummer}`, async () => {
            const typeSelect = page.getByRole('combobox', { name: 'Velg type inntektsforhold' })
            await typeSelect.waitFor({ state: 'visible' })
            await typeSelect.selectOption('ARBEIDSTAKER')

            const orgnummerField = page.getByRole('textbox', { name: 'Organisasjonsnummer' })
            await orgnummerField.waitFor({ state: 'visible' })
            await orgnummerField.fill(orgnummer)

            const sykmeldtRadio = page.getByRole('group', { name: 'Er sykmeldt fra forholdet' })
            await sykmeldtRadio.waitFor({ state: 'visible' })
            await sykmeldtRadio.getByRole('radio', { name: erSykmeldt ? 'Ja' : 'Nei' }).check()

            const typeArbeidstakerRadio = page.getByRole('group', { name: 'Type arbeidstaker' })
            await typeArbeidstakerRadio.waitFor({ state: 'visible' })
            await typeArbeidstakerRadio.getByRole('radio', { name: 'Ordinært arbeidsforhold' }).check()
        })
    }
}

export function fyllUtNæringsdrivendeInntektsforhold(type: 'Fisker' | 'Andre', erSykmeldt: boolean = false) {
    return async (page: Page) => {
        await test.step(`Fyll ut næringsdrivende inntektsforhold av type ${type}`, async () => {
            const typeSelect = page.getByRole('combobox', { name: 'Velg type inntektsforhold' })
            await typeSelect.selectOption('SELVSTENDIG_NÆRINGSDRIVENDE')

            const sykmeldtRadio = page.getByRole('group', { name: 'Er sykmeldt fra forholdet' })
            await sykmeldtRadio.getByRole('radio', { name: erSykmeldt ? 'Ja' : 'Nei' }).check()

            const typeNæringsdrivendeRadio = page.getByRole('group', { name: 'Type selvstendig næringsdrivende' })
            await typeNæringsdrivendeRadio.waitFor({ state: 'visible' })
            await typeNæringsdrivendeRadio.getByRole('radio', { name: type }).check()
        })
    }
}

export function fyllUtFrilanserInntektsforhold(erSykmeldt: boolean = false) {
    return async (page: Page) => {
        await test.step('Fyll ut frilanser inntektsforhold', async () => {
            const typeSelect = page.getByRole('combobox', { name: 'Velg type inntektsforhold' })
            await typeSelect.selectOption('FRILANSER')

            const sykmeldtRadio = page.getByRole('group', { name: 'Er sykmeldt fra forholdet' })
            await sykmeldtRadio.getByRole('radio', { name: erSykmeldt ? 'Ja' : 'Nei' }).check()

            const forsikringGroup = page.getByRole('group', { name: 'Nav-kjøpt forsikring' })
            await forsikringGroup.waitFor({ state: 'visible' })
            await forsikringGroup.getByRole('radio', { name: '100 prosent fra første sykedag' }).check()
        })
    }
}

export function lagreInntektsforhold() {
    return async (page: Page) => {
        await test.step('Lagre inntektsforhold', async () => {
            const opprettButton = page.getByRole('button', { name: 'Opprett' })
            await opprettButton.click()

            // Vent på at skjemaet lukkes
            const leggTilButton = page.getByRole('button', { name: 'Legg til nytt inntektsforhold' })
            await leggTilButton.waitFor({ state: 'visible' })
        })
    }
}

export function lagreRedigertInntektsforhold() {
    return async (page: Page) => {
        await test.step('Lagre redigert inntektsforhold', async () => {
            const lagreButton = page.getByRole('button', { name: 'Lagre' })
            await lagreButton.click()

            // Vent på at redigeringen lukkes
            const leggTilButton = page.getByRole('button', { name: 'Legg til nytt inntektsforhold' })
            await leggTilButton.waitFor({ state: 'visible' })
        })
    }
}

export function verifiserInntektsforholdTabell() {
    return async (page: Page) => {
        const inntektsforholdTabell = page.getByRole('table', { name: 'Inntektsforhold oversikt' })
        await inntektsforholdTabell.waitFor({ state: 'visible' })
        return inntektsforholdTabell
    }
}

export function verifiserAntallInntektsforhold(antall: number) {
    return async (page: Page) => {
        await test.step(`Verifiser at det er ${antall} inntektsforhold`, async () => {
            const inntektsforholdTabell = await verifiserInntektsforholdTabell()(page)
            const tabellRader = inntektsforholdTabell.locator('tbody tr')
            await expect(tabellRader).toHaveCount(antall)
        })
    }
}

export function utvidInntektsforholdRad(radIndex: number = 0) {
    return async (page: Page) => {
        await test.step(`Utvid inntektsforhold-rad ${radIndex + 1}`, async () => {
            const inntektsforholdTabell = await verifiserInntektsforholdTabell()(page)
            const rad = inntektsforholdTabell.locator('tbody tr').nth(radIndex)
            const toggle = rad.getByRole('button', { name: /Vis (mer|mindre)/i })

            const toggleText = await toggle.textContent()
            if (toggleText?.includes('Vis mer')) {
                await toggle.click()
            }
        })
    }
}

export function redigerInntektsforhold(radIndex: number = 0) {
    return async (page: Page) => {
        await test.step(`Rediger inntektsforhold ${radIndex + 1}`, async () => {
            await utvidInntektsforholdRad(radIndex)(page)

            const inntektsforholdTabell = await verifiserInntektsforholdTabell()(page)
            const redigerButton = inntektsforholdTabell.getByRole('button', {
                name: new RegExp(`Rediger inntektsforhold ${radIndex + 1}`, 'i'),
            })
            await redigerButton.waitFor({ state: 'visible' })
            await redigerButton.click()
        })
    }
}

export function slettInntektsforhold(radIndex: number = 0) {
    return async (page: Page) => {
        await test.step(`Slett inntektsforhold ${radIndex + 1}`, async () => {
            await utvidInntektsforholdRad(radIndex)(page)

            const inntektsforholdTabell = await verifiserInntektsforholdTabell()(page)
            const slettButton = inntektsforholdTabell.getByRole('button', {
                name: new RegExp(`Slett inntektsforhold ${radIndex + 1}`, 'i'),
            })
            await slettButton.waitFor({ state: 'visible' })
            await slettButton.click()

            // Bekreft sletting i modal
            const slettModal = page.getByRole('dialog', { name: 'Slett inntektsforhold' })
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
