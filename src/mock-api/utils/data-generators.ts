import { v4 as uuidv4 } from 'uuid'

import { Dagoversikt, Dag } from '@/schemas/dagoversikt'
import { Saksbehandlingsperiode } from '@/schemas/saksbehandlingsperiode'
import { Inntektsforhold } from '@/schemas/inntektsforhold'
import { Søknad } from '@/schemas/søknad'
import { Dokument } from '@/schemas/dokument'

export function genererDagoversikt(fom: string, tom: string): Dagoversikt {
    const dager: Dag[] = []
    const startDato = new Date(fom)
    const sluttDato = new Date(tom)

    // Generer dager fra fom til tom
    const currentDato = new Date(startDato)
    while (currentDato <= sluttDato) {
        const erHelg = currentDato.getDay() === 0 || currentDato.getDay() === 6

        dager.push({
            id: uuidv4(),
            type: erHelg ? 'HELGEDAG' : 'SYKEDAG',
            dato: currentDato.toISOString().split('T')[0], // YYYY-MM-DD format
        })

        // Gå til neste dag
        currentDato.setDate(currentDato.getDate() + 1)
    }

    return dager
}

export function getOrgnavn(orgnummer?: string, fallbackNavn?: string): string | undefined {
    if (!orgnummer) return fallbackNavn

    const mockOrganisasjoner: Record<string, string> = {
        '123456789': 'Krankompisen',
        '987654321': 'Kranførerkompaniet',
        '889955555': 'Danskebåten',
    }

    return mockOrganisasjoner[orgnummer] || fallbackNavn || `Organisasjon ${orgnummer}`
}

export function mapArbeidssituasjonTilInntektsforholdtype(
    arbeidssituasjon: string,
): 'ORDINÆRT_ARBEIDSFORHOLD' | 'FRILANSER' | 'SELVSTENDIG_NÆRINGSDRIVENDE' | 'ARBEIDSLEDIG' {
    switch (arbeidssituasjon) {
        case 'ARBEIDSTAKER':
            return 'ORDINÆRT_ARBEIDSFORHOLD'
        case 'FRILANSER':
            return 'FRILANSER'
        case 'NAERINGSDRIVENDE':
        case 'FISKER':
            return 'SELVSTENDIG_NÆRINGSDRIVENDE'
        case 'ARBEIDSLEDIG':
            return 'ARBEIDSLEDIG'
        default:
            return 'ORDINÆRT_ARBEIDSFORHOLD'
    }
}

export function genererDokumenterFraSøknader(søknader: Søknad[], søknadIder: string[]): Dokument[] {
    const valgteSøknader = søknader.filter((søknad) => søknadIder.includes(søknad.id))

    return valgteSøknader.map(
        (søknad): Dokument => ({
            id: uuidv4(),
            dokumentType: 'SØKNAD',
            eksternId: søknad.id,
            innhold: søknad,
            opprettet: new Date().toISOString(),
            request: {
                kilde: 'mock-api',
                tidsstempel: new Date().toISOString(),
            },
        }),
    )
}

export function opprettSaksbehandlingsperiode(
    spilleromPersonId: string,
    søknader: Søknad[],
    fom: string,
    tom: string,
    søknadIder: string[],
    uuid?: string,
): {
    saksbehandlingsperiode: Saksbehandlingsperiode
    inntektsforhold: Inntektsforhold[]
    dagoversikt: Record<string, Dagoversikt>
    dokumenter: Dokument[]
} {
    const dagoversikt: Record<string, Dagoversikt> = {}

    // Opprett saksbehandlingsperiode
    const saksbehandlingsperiode: Saksbehandlingsperiode = {
        id: uuid || uuidv4(),
        spilleromPersonId: spilleromPersonId,
        opprettet: new Date().toISOString(),
        opprettetAvNavIdent: 'Z123456',
        opprettetAvNavn: 'Test Testesen',
        fom: fom,
        tom: tom,
    }

    const inntektsforhold: Inntektsforhold[] = []

    // Automatisk opprettelse av inntektsforhold basert på valgte søknader
    if (søknadIder && søknadIder.length > 0) {
        const valgteSøknader = søknader.filter((søknad) => søknadIder.includes(søknad.id))

        // Opprett unike inntektsforhold basert på orgnummer + arbeidssituasjon
        const unikeInntektsforhold = new Map<
            string,
            {
                orgnummer?: string
                orgnavn?: string
                arbeidssituasjon: string
            }
        >()

        valgteSøknader.forEach((søknad) => {
            const orgnummer = søknad.arbeidsgiver?.orgnummer
            const arbeidssituasjon = søknad.arbeidssituasjon || 'ANNET'

            // Lag unik nøkkel basert på orgnummer + arbeidssituasjon
            const key = `${orgnummer || 'ingen'}_${arbeidssituasjon}`

            if (!unikeInntektsforhold.has(key)) {
                unikeInntektsforhold.set(key, {
                    orgnummer,
                    orgnavn: søknad.arbeidsgiver?.navn,
                    arbeidssituasjon,
                })
            }
        })

        unikeInntektsforhold.forEach((forhold) => {
            const nyttInntektsforhold: Inntektsforhold = {
                id: uuidv4(),
                inntektsforholdtype: mapArbeidssituasjonTilInntektsforholdtype(forhold.arbeidssituasjon),
                sykmeldtFraForholdet: true, // Automatisk sykmeldt siden det er basert på søknader
                orgnummer: forhold.orgnummer,
                orgnavn: getOrgnavn(forhold.orgnummer, forhold.orgnavn),
            }

            inntektsforhold.push(nyttInntektsforhold)

            // Opprett dagoversikt automatisk siden alle er sykmeldt
            dagoversikt[nyttInntektsforhold.id] = genererDagoversikt(fom, tom)
        })
    }

    // Generer dokumenter fra søknadene
    const dokumenter = genererDokumenterFraSøknader(søknader, søknadIder)

    return {
        saksbehandlingsperiode,
        inntektsforhold,
        dagoversikt,
        dokumenter,
    }
}

export function genererSaksbehandlingsperioder(
    spilleromPersonId: string,
    søknader: Søknad[],
    perioder: Array<{ fom: string; tom: string; søknadIder: string[]; uuid?: string }>,
): {
    saksbehandlingsperioder: Saksbehandlingsperiode[]
    inntektsforhold: Record<string, Inntektsforhold[]>
    dagoversikt: Record<string, Dagoversikt>
    dokumenter: Record<string, Dokument[]>
} {
    const saksbehandlingsperioder: Saksbehandlingsperiode[] = []
    const alleInntektsforhold: Record<string, Inntektsforhold[]> = {}
    const alleDagoversikt: Record<string, Dagoversikt> = {}
    const alleDokumenter: Record<string, Dokument[]> = {}

    perioder.forEach((periode) => {
        const resultat = opprettSaksbehandlingsperiode(
            spilleromPersonId,
            søknader,
            periode.fom,
            periode.tom,
            periode.søknadIder,
            periode.uuid,
        )

        saksbehandlingsperioder.push(resultat.saksbehandlingsperiode)
        alleInntektsforhold[resultat.saksbehandlingsperiode.id] = resultat.inntektsforhold

        // Kombiner dagoversikt
        Object.assign(alleDagoversikt, resultat.dagoversikt)

        // Legg til dokumenter for denne saksbehandlingsperioden
        if (resultat.dokumenter.length > 0) {
            alleDokumenter[resultat.saksbehandlingsperiode.id] = resultat.dokumenter
        }
    })

    return {
        saksbehandlingsperioder,
        inntektsforhold: alleInntektsforhold,
        dagoversikt: alleDagoversikt,
        dokumenter: alleDokumenter,
    }
}
