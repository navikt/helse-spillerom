import { expect, Page, test } from '@playwright/test'
import {
    fyllUtArbeidstakerYrkesaktivitet,
    fyllUtInaktivYrkesaktivitet,
    fyllUtNæringsdrivendeYrkesaktivitet,
    hentVenstremeny,
    opprettManuellBehandlingMedYrkesaktivitet,
    settSykepengegrunnlag,
    settSykepengegrunnlagNæringsdrivende,
    verifiserKategoriTag,
} from './actions/saksbehandler-actions'

test.describe('Dekningsgrad og Yrkesaktivitet', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Ingen synlig dekningsgrad for arbeidstaker', async ({ page }) => {
        await opprettManuellBehandlingMedYrkesaktivitet('12345214260', () =>
            fyllUtArbeidstakerYrkesaktivitet('123456789', true)(page),
        )(page)
        await settSykepengegrunnlag()(page)

        await verifiserKategoriTag('Arbeidstaker')(page)
        await verifiserDekningsgradIkkeSynlig(page)
    })

    test('80% dekningsgrad vanlig selvstendig næringsdrivende', async ({ page }) => {
        await opprettManuellBehandlingMedYrkesaktivitet('12345214261', () =>
            fyllUtNæringsdrivendeYrkesaktivitet('Ordinær selvstendig næringsdrivende', 'Ingen forsikring', true)(page),
        )(page)
        await settSykepengegrunnlagNæringsdrivende()(page)

        await verifiserKategoriTag('Selvstendig næringsdrivende')(page)
        await verifiserDekningsgradSynlig(page, '80%')
    })

    test('100% dekningsgrad fisker blad B næringsdrivende', async ({ page }) => {
        await opprettManuellBehandlingMedYrkesaktivitet('12345214262', () =>
            fyllUtNæringsdrivendeYrkesaktivitet('Fisker', null, true)(page),
        )(page)
        await settSykepengegrunnlagNæringsdrivende()(page)

        await verifiserKategoriTag('Selvstendig næringsdrivende')(page)
        await verifiserDekningsgradSynlig(page, '100%')
    })

    test('100% dekningsgrad vanlig næringsdrivende med valgt forsikring', async ({ page }) => {
        await opprettManuellBehandlingMedYrkesaktivitet('12345214263', () =>
            fyllUtNæringsdrivendeYrkesaktivitet(
                'Ordinær selvstendig næringsdrivende',
                '100 prosent fra første sykedag',
                true,
            )(page),
        )(page)
        await settSykepengegrunnlagNæringsdrivende()(page)

        await verifiserKategoriTag('Selvstendig næringsdrivende')(page)
        await verifiserDekningsgradSynlig(page, '100%')
    })

    test('65% dekningsgrad inaktiv yrkeskategori', async ({ page }) => {
        await opprettManuellBehandlingMedYrkesaktivitet('12345214264', () =>
            fyllUtInaktivYrkesaktivitet('Bokstav A, 65% dekningsgrad')(page),
        )(page)
        await settSykepengegrunnlagNæringsdrivende()(page)

        await verifiserKategoriTag('Inaktiv')(page)
        await verifiserDekningsgradSynlig(page, '65%')
    })

    test('100% dekningsgrad inaktiv yrkeskategori', async ({ page }) => {
        await opprettManuellBehandlingMedYrkesaktivitet('12345214265', () =>
            fyllUtInaktivYrkesaktivitet('Bokstav B, 100% dekningsgrad')(page),
        )(page)
        await settSykepengegrunnlagNæringsdrivende()(page)

        await verifiserKategoriTag('Inaktiv')(page)
        await verifiserDekningsgradSynlig(page, '100%')
    })
})

// Hjelpefunksjoner for dekningsgrad-verifisering
async function verifiserDekningsgradIkkeSynlig(page: Page) {
    const venstremeny = await hentVenstremeny()(page)
    const dekningsgradTekst = venstremeny.getByText('Dekningsgrad:')
    await expect(dekningsgradTekst).not.toBeVisible()
}

async function verifiserDekningsgradSynlig(page: Page, forventetProsent: string) {
    const venstremeny = await hentVenstremeny()(page)
    const dekningsgradTekst = venstremeny.getByText('Dekningsgrad:')
    await dekningsgradTekst.waitFor({ state: 'visible' })
    await expect(dekningsgradTekst).toBeVisible()

    const dekningsgradProsent = venstremeny.getByText(forventetProsent)
    await expect(dekningsgradProsent).toBeVisible()
}
