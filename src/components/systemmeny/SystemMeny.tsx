'use client'

import { ReactElement } from 'react'
import { Dropdown } from '@navikt/ds-react'
import {
    DropdownMenu,
    DropdownMenuGroupedList,
    DropdownMenuGroupedListHeading,
    DropdownMenuGroupedListItem,
    DropdownToggle,
} from '@navikt/ds-react/Dropdown'
import { ExternalLinkIcon, MenuGridIcon } from '@navikt/aksel-icons'
import { InternalHeaderButton } from '@navikt/ds-react/InternalHeader'

import { Maybe } from '@/utils/tsUtils'
import { usePersoninfo } from '@hooks/queries/usePersoninfo'

export function SystemMeny(): ReactElement {
    return (
        <Dropdown>
            <InternalHeaderButton as={DropdownToggle}>
                <MenuGridIcon title="Systemer og oppslagsverk" fontSize="2.25rem" />
            </InternalHeaderButton>
            <DropdownMenu className="w-max">
                <DropdownMenuGroupedList>
                    <DropdownMenuGroupedListHeading>Systemer og oppslagsverk</DropdownMenuGroupedListHeading>
                    <SystemMenyLinks />
                </DropdownMenuGroupedList>
            </DropdownMenu>
        </Dropdown>
    )
}

function SystemMenyLinks(): ReactElement[] {
    const { data: personinfo } = usePersoninfo()
    const maybeFnr: Maybe<string> = personinfo?.fødselsnummer ?? null
    const maybeAktørId: Maybe<string> = personinfo?.aktørId ?? null

    return createLinks(maybeFnr, maybeAktørId).map((link) =>
        'href' in link ? (
            <Link key={link.tekst} tekst={link.tekst} href={link.href} />
        ) : (
            <Button key={link.tekst} tekst={link.tekst} action={link.action} />
        ),
    )
}

export const redirigerTilArbeidOgInntektUrl = async (url: string, fødselsnummer: Maybe<string>) => {
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

const settModiaContext = async (fødselsnummer: string) => {
    const response = await fetch(`/api/modia/velgBruker`, {
        method: 'post',
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
const nullstillModiaContext = async () => {
    const response = await fetch(`/api/modia/aktivBruker`, { method: 'delete' })
    if (!response.ok) throw Error('Nullstilling av context feilet')
}

export const hoppTilModia = async (url: string, fødselsnummer: Maybe<string>) => {
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

type CommonLinkProps = { tekst: string }
type ButtonLink = CommonLinkProps & { action: () => void }
type HrefLink = CommonLinkProps & { href: string }

const Link = ({ tekst, href }: HrefLink): ReactElement => (
    <DropdownMenuGroupedListItem key={tekst} as="a" href={href} target="_blank" className="px-4 py-2 whitespace-nowrap">
        <Lenkeinnhold tekst={tekst} />
    </DropdownMenuGroupedListItem>
)

const Button = ({ tekst, action }: ButtonLink): ReactElement => (
    <DropdownMenuGroupedListItem key={tekst} as="button" className="px-4 py-2 whitespace-nowrap" onClick={action}>
        <Lenkeinnhold tekst={tekst} />
    </DropdownMenuGroupedListItem>
)

type LenkeinnholdProps = {
    tekst: string
}

const Lenkeinnhold = ({ tekst }: LenkeinnholdProps): ReactElement => (
    <>
        {tekst}
        <ExternalLinkIcon fontSize="1.1rem" title="Åpne ekstern lenke" />
    </>
)

const createLinks = (maybeFnr: Maybe<string>, maybeAktørId: Maybe<string>): Array<HrefLink | ButtonLink> => [
    {
        tekst: 'A-inntekt',
        action: () =>
            redirigerTilArbeidOgInntektUrl(
                'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/a-inntekt',
                maybeFnr,
            ),
    },
    {
        tekst: 'Aa-registeret',
        action: () =>
            redirigerTilArbeidOgInntektUrl(
                'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/arbeidstaker',
                maybeFnr,
            ),
    },
    {
        tekst: 'Gosys',
        href: maybeFnr
            ? `https://gosys.intern.nav.no/gosys/personoversikt/fnr=${maybeFnr}`
            : 'https://gosys.intern.nav.no/gosys/',
    },
    {
        tekst: 'Modia Sykefraværsoppfølging',
        action: () => hoppTilModia(`https://syfomodiaperson.intern.nav.no/sykefravaer/`, maybeFnr),
    },
    {
        tekst: 'Modia Personoversikt',
        href: maybeFnr
            ? `https://app.adeo.no/modiapersonoversikt/person/${maybeFnr}`
            : 'https://app.adeo.no/modiapersonoversikt',
    },
    {
        tekst: 'Oppdrag',
        href: 'https://wasapp.adeo.no/oppdrag/venteregister/details.htm',
    },
    {
        tekst: 'Foreldrepenger',
        href: maybeAktørId ? `https://fpsak.intern.nav.no/aktoer/${maybeAktørId}` : 'https://fpsak.intern.nav.no',
    },
    {
        tekst: 'Folketrygdloven kapittel 8',
        href: 'https://lovdata.no/pro/#document/NL/lov/1997-02-28-19/KAPITTEL_4-4',
    },
    { tekst: 'Brønnøysundregisteret', href: 'https://brreg.no' },
    {
        tekst: 'Rutiner for sykepenger',
        href: 'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Samhandlings--og-samordningsrutiner.aspx',
    },
    {
        tekst: 'Demosider for vedtak',
        action: () => hoppTilModia(`https://demo.ekstern.dev.nav.no/syk/sykepenger`, maybeFnr),
    },
]
