import { expect } from '@playwright/test'
import { test } from './fixtures'
import { søkPerson } from './actions/saksbehandler-actions'

test.describe('Blanke Ark - Inntektsforhold', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies()
        await page.goto('/')
    })

    test('Kan opprette, redigere og slette inntektsforhold med riktige kategoritagger', async ({ page }) => {
        // Søk opp Blanke Ark
        await page.context().clearCookies()

        await søkPerson('13064512348')(page)
        await page.waitForURL('**/person/*')

        // Sjekk at navnet er riktig
        const header = page.getByRole('main')
        const navn = header.getByText('Blanke Ark')
        await expect(navn).toBeVisible()

        // Finn og klikk på lenken til eksisterende behandling
        const behandlingLink = page.getByRole('link', { name: /\d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}/ })
        await behandlingLink.click()
        await page.waitForURL('**/person/*/*')

        // Naviger til "Inntektsforhold"-fanen
        const inntektsforholdTab = page.getByRole('tab', { name: /Inntektsforhold/i })
        await inntektsforholdTab.click()

        // Sjekk at det ikke finnes noen inntektsforhold i utgangspunktet
        const ingenInntektsforhold = page.getByText(
            'Ingen inntektsforhold registrert for denne saksbehandlingsperioden.',
        )
        await expect(ingenInntektsforhold).toBeVisible()

        // Sjekk at venstremeny viser "Kategori ikke satt"
        const venstremeny = page.getByRole('complementary', { name: 'venstre sidemeny' })
        const kategoriTag = venstremeny.getByRole('region', { name: 'Inntektskategorier' })
        await expect(kategoriTag).toContainText('Kategori ikke satt')

        // 1. Opprett arbeidstaker inntektsforhold
        const leggTilButton = page.getByRole('button', { name: 'Legg til nytt inntektsforhold' })
        await leggTilButton.click()

        // Fyll ut skjema for arbeidstaker
        const typeSelect = page.getByRole('combobox', { name: 'Velg type inntektsforhold' })
        await expect(typeSelect).toBeVisible()
        await typeSelect.selectOption('ARBEIDSTAKER')

        const orgnummerField = page.getByRole('textbox', { name: 'Organisasjonsnummer' })
        await expect(orgnummerField).toBeVisible()
        await orgnummerField.fill('123456789')

        const sykmeldtRadio = page.getByRole('group', { name: 'Er sykmeldt fra forholdet' })
        await expect(sykmeldtRadio).toBeVisible()
        await sykmeldtRadio.getByRole('radio', { name: 'Ja' }).check()

        const typeArbeidstakerRadio = page.getByRole('group', { name: 'Type arbeidstaker' })
        await expect(typeArbeidstakerRadio).toBeVisible()
        await typeArbeidstakerRadio.getByRole('radio', { name: 'Ordinært arbeidsforhold' }).check()

        // Lagre inntektsforhold
        const opprettButton = page.getByRole('button', { name: 'Opprett' })
        await opprettButton.click()

        // Vent på at skjemaet lukkes og tabellen oppdateres
        await expect(leggTilButton).toBeVisible()

        // Sjekk at arbeidstaker inntektsforhold er opprettet
        const inntektsforholdTabell = page.getByRole('table', { name: 'Inntektsforhold oversikt' })
        await expect(inntektsforholdTabell).toBeVisible()

        const arbeidstakerRad = inntektsforholdTabell.locator('tbody tr').first()
        await expect(arbeidstakerRad).toContainText('Arbeidstaker')

        // Sjekk at venstremeny viser "Arbeidstaker"
        await expect(kategoriTag).toContainText('Arbeidstaker')

        // 2. Legg til næringsdrivende fisker på blad B
        await leggTilButton.click()

        // Fyll ut skjema for næringsdrivende fisker
        await typeSelect.selectOption('SELVSTENDIG_NÆRINGSDRIVENDE')

        await sykmeldtRadio.getByRole('radio', { name: 'Nei' }).check()

        const typeNæringsdrivendeRadio = page.getByRole('group', { name: 'Type selvstendig næringsdrivende' })
        await expect(typeNæringsdrivendeRadio).toBeVisible()
        await typeNæringsdrivendeRadio.getByRole('radio', { name: 'Fisker' }).check()

        // Lagre inntektsforhold
        await opprettButton.click()

        // Vent på at skjemaet lukkes
        await expect(leggTilButton).toBeVisible()

        // Sjekk at begge inntektsforhold er synlige
        const tabellRader = inntektsforholdTabell.locator('tbody tr')
        await expect(tabellRader).toHaveCount(4)

        // Sjekk at venstremeny viser "Arbeidstaker og selvstendig næringsdrivende"
        await expect(kategoriTag).toContainText('Arbeidstaker og selvstendig næringsdrivende')

        // 3. Endre første inntektsforhold til frilanser
        const førsteRad = inntektsforholdTabell.locator('tbody tr').first()

        // åpne raden før redigering
        const toggle = førsteRad.getByRole('button', { name: /Vis (mer|mindre)/i })
        if ((await toggle.textContent())?.includes('Vis mer')) {
            await toggle.click()
        }

        // 2) finn Rediger-knappen i den utvidede delen
        const redigerButton = inntektsforholdTabell.getByRole('button', {
            name: /Rediger inntektsforhold 1/i,
        })
        await expect(redigerButton).toBeVisible()
        await redigerButton.click()

        // Endre type til frilanser
        await typeSelect.selectOption('FRILANSER')

        // Fyll ut frilanser-spesifikke felter
        const forsikringGroup = page.getByRole('group', { name: 'Nav-kjøpt forsikring' })
        await forsikringGroup.getByRole('radio', { name: '100 prosent fra første sykedag' }).check()

        // Lagre endringene
        const lagreButton = page.getByRole('button', { name: 'Lagre' })
        await lagreButton.click()

        // Vent på at redigeringen lukkes
        await expect(leggTilButton).toBeVisible()

        // Sjekk at venstremeny viser "Frilanser og selvstendig næringsdrivende"
        await expect(kategoriTag).toContainText('Selvstendig næringsdrivende og frilanser')

        // 4. Slett frilanser-inntektsforholdet
        // åpne raden før sletting
        const toggleKnapp = førsteRad.getByRole('button', { name: /Vis (mer|mindre)/i })
        if ((await toggleKnapp.textContent())?.includes('Vis mer')) {
            await toggleKnapp.click()
        }

        // finn og klikk Slett
        const slettButton = inntektsforholdTabell.getByRole('button', {
            name: /Slett inntektsforhold 1/i,
        })
        await expect(slettButton).toBeVisible()
        await slettButton.click()

        // Bekreft sletting i modal
        const slettModal = page.getByRole('dialog', { name: 'Slett inntektsforhold' })
        await expect(slettModal).toBeVisible()

        const bekreftSlettButton = slettModal.getByRole('button', { name: 'Slett' })
        await bekreftSlettButton.click()

        // Vent på at modalen lukkes
        await expect(slettModal).not.toBeVisible()

        // Sjekk at det bare er ett inntektsforhold igjen
        await expect(tabellRader).toHaveCount(2)

        // Sjekk at venstremeny viser "Selvstendig næringsdrivende"
        await expect(kategoriTag).toContainText('Selvstendig næringsdrivende')
    })
})
