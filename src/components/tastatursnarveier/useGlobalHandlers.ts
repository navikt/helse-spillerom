import { useTheme } from 'next-themes'

import { ShortcutId } from '@components/tastatursnarveier/shortcutMetadata'
import { ShortcutHandler } from '@components/tastatursnarveier/context'
import { usePersoninfo } from '@hooks/queries/usePersoninfo'

type GlobalHandlersResponse = {
    allGlobalHandlers: Partial<Record<ShortcutId, ShortcutHandler>>
    externalLinks: Partial<Record<ShortcutId, ShortcutHandler>>
}

export function useGlobalHandlers(): GlobalHandlersResponse {
    const { data: personinfo } = usePersoninfo()
    const { theme, setTheme } = useTheme()
    const fødselsnummer = personinfo?.fødselsnummer
    const aktørId = personinfo?.aktørId

    const toggleDarkMode = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    const externalLinks: Partial<Record<ShortcutId, ShortcutHandler>> = {
        open_aa_reg: () =>
            redirigerTilArbeidOgInntektUrl(
                'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/arbeidstaker',
                fødselsnummer,
            ),
        open_brreg: () => window.open('https://brreg.no', '_blank'),
        open_demoside_vedtak: () => hoppTilModia('https://demo.ekstern.dev.nav.no/syk/sykepenger', fødselsnummer),
        open_a_inntekt: () =>
            redirigerTilArbeidOgInntektUrl(
                'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/a-inntekt',
                fødselsnummer,
            ),
        open_foreldrepenger: () =>
            window.open(
                aktørId ? `https://fpsak.intern.nav.no/aktoer/${aktørId}` : 'https://fpsak.intern.nav.no',
                '_blank',
            ),
        open_gosys: () =>
            window.open(
                fødselsnummer
                    ? `https://gosys.intern.nav.no/gosys/personoversikt/fnr=${fødselsnummer}`
                    : 'https://gosys.intern.nav.no/gosys/',
                '_blank',
            ),
        open_lovdata: () => window.open('https://lovdata.no/pro/#document/NL/lov/1997-02-28-19/KAPITTEL_4-4', '_blank'),
        open_modia_personoversikt: () =>
            window.open(
                fødselsnummer
                    ? `https://app.adeo.no/modiapersonoversikt/person/${fødselsnummer}`
                    : 'https://app.adeo.no/modiapersonoversikt',
                '_blank',
            ),
        open_oppdrag: () => window.open('https://wasapp.adeo.no/oppdrag/venteregister/details.htm', '_blank'),
        open_rutiner: () =>
            window.open(
                'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Samhandlings--og-samordningsrutiner.aspx',
                '_blank',
            ),
        open_modia_sykefraværsoppfølging: () =>
            hoppTilModia('https://syfomodiaperson.intern.nav.no/sykefravaer/', fødselsnummer),
    }

    return {
        allGlobalHandlers: { ...externalLinks, toggle_dark_mode: toggleDarkMode },
        externalLinks: externalLinks,
    }
}

async function redirigerTilArbeidOgInntektUrl(url: string, fødselsnummer?: string) {
    if (!fødselsnummer) {
        window.open('https://arbeid-og-inntekt.nais.adeo.no')
        return
    }
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Nav-Personident': fødselsnummer,
                'Nav-Enhet': '4488',
                'Nav-A-inntekt-Filter': '8-28Sykepenger',
            },
        })
        const data = await response.text()
        window.open(data)
    } catch {
        window.open('https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/error')
    }
}

async function hoppTilModia(url: string, fødselsnummer?: string) {
    const forbered = () => (fødselsnummer ? settModiaContext(fødselsnummer) : nullstillModiaContext())
    try {
        await forbered()
    } catch (_) {
        const tekst = fødselsnummer
            ? 'Søk av person i Modia feilet, du må søke den opp manuelt når du kommer til Modia.'
            : 'Forrige person kan fortsatt være valgt når du kommer til Modia.'
        const fortsett = confirm(`${tekst}\n\nTrykk på OK for fortsette til Modia.`)
        if (!fortsett) return
    }
    window.open(url)
}
async function settModiaContext(fødselsnummer: string) {
    const response = await fetch(`/api/modia/velg-bruker`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            verdi: fødselsnummer,
            eventType: 'NY_AKTIV_BRUKER',
        }),
    })
    if (!response.ok) throw Error('Setting av context feilet')
}

async function nullstillModiaContext() {
    const response = await fetch(`/api/modia/aktiv-bruker`, { method: 'DELETE' })
    if (!response.ok) throw Error('Nullstilling av context feilet')
}
