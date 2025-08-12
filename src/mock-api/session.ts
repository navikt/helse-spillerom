import { nextleton } from 'nextleton'
import { v4 as uuidv4 } from 'uuid'
import { cookies } from 'next/headers'
import { faker } from '@faker-js/faker/locale/nb_NO'
import dayjs, { Dayjs } from 'dayjs'

import { Personinfo } from '@/schemas/personinfo'
import { testpersoner, Testperson } from '@/mock-api/testpersoner/testpersoner'
import { Saksbehandlingsperiode, SaksbehandlingsperiodeEndring } from '@/schemas/saksbehandlingsperiode'
import { VilkaarsvurderingV2 } from '@/schemas/vilkaarsvurdering'
import { Inntektsforhold } from '@/schemas/inntektsforhold'
import { Dagoversikt } from '@/schemas/dagoversikt'
import { Dokument } from '@/schemas/dokument'
import { predefinerteBrukere } from '@/mock-api/predefinerte-brukere'
import { Bruker } from '@/schemas/bruker'

export interface Person {
    fnr: string
    personId: string
    personinfo: Personinfo
    saksbehandlingsperioder: Saksbehandlingsperiode[]
    vilkaarsvurderinger: Record<string, VilkaarsvurderingV2[]>
    inntektsforhold: Record<string, Inntektsforhold[]>
    dagoversikt: Record<string, Dagoversikt>
    dokumenter: Record<string, Dokument[]>
    historikk: Record<string, SaksbehandlingsperiodeEndring[]>
}

type Session = {
    expires: Dayjs
    testpersoner: Person[]
    aktivBruker: Bruker
}

// Deep copy funksjon for å unngå delte referanser mellom sesjoner
function deepCopyPerson(person: Testperson): Person {
    return {
        fnr: person.personinfo.fødselsnummer,
        personId: person.personId,
        personinfo: { ...person.personinfo },
        saksbehandlingsperioder: person.saksbehandlingsperioder.map((periode: Saksbehandlingsperiode) => ({
            ...periode,
            opprettet: new Date(periode.opprettet).toISOString(),
        })),
        vilkaarsvurderinger: {},
        inntektsforhold: JSON.parse(JSON.stringify(person.inntektsforhold || {})),
        dagoversikt: JSON.parse(JSON.stringify(person.dagoversikt || {})),
        dokumenter: JSON.parse(JSON.stringify(person.dokumenter || {})),
        historikk: {},
    }
}

export const sessionStore = nextleton('sessionStore', () => {
    return {} as Record<string, Session>
})

export async function getSession(): Promise<Session> {
    const cookieStore = await cookies()

    function getSessionId(): string {
        const cookieName = 'spillerom-testdata-session'
        const sessionIdCookie = cookieStore.get(cookieName)?.value

        if (sessionIdCookie) {
            return sessionIdCookie
        }
        const sessionId = uuidv4()

        cookieStore.set(cookieName, sessionId, {
            httpOnly: false,
            path: '/',
            expires: new Date(Date.now() + 60 * 60 * 1000),
            sameSite: 'none',
            secure: true,
        })

        return sessionId
    }

    const sessionId = getSessionId()
    if (!sessionStore[sessionId] || sessionStore[sessionId].expires.isBefore(dayjs())) {
        const personer = testpersoner.map(deepCopyPerson)

        sessionStore[sessionId] = {
            expires: dayjs().add(120, 'minute'),
            testpersoner: [
                ...personer,
                skapPerson('12345678902'),
                skapPerson('12345678903'),
                skapPerson('33423422323'),
            ],
            aktivBruker: predefinerteBrukere[0], // Default til Saks McBehandlersen
        }
    }

    return sessionStore[sessionId]
}

function skapPerson(fnr: string): Person {
    faker.seed(Number(fnr))

    // Generate a deterministic personId based on the fnr, padded to 5 chars
    const personId = (Number(fnr) % 100000).toString(36).padStart(5, '0')

    return {
        fnr: fnr,
        personId: personId,
        personinfo: {
            fødselsnummer: fnr,
            aktørId: fnr + '00',
            navn: faker.person.firstName() + ' ' + faker.person.lastName(),
            alder: faker.number.int({ min: 14, max: 80 }),
        },
        saksbehandlingsperioder: [],
        vilkaarsvurderinger: {},
        inntektsforhold: {},
        dagoversikt: {},
        dokumenter: {},
        historikk: {},
    }
}

export async function hentEllerOpprettPerson(fnr: string) {
    const session = await getSession()
    const person = session.testpersoner.find((p) => p.fnr === fnr)
    if (person) {
        return person
    }

    const nyPerson = skapPerson(fnr)
    session.testpersoner.push(nyPerson)

    return nyPerson
}

export async function hentPerson(personid: string) {
    const session = await getSession()
    return session.testpersoner.find((p) => p.personId === personid)
}

export async function oppdaterAktivBruker(navIdent: string) {
    const session = await getSession()
    const bruker = predefinerteBrukere.find((b) => b.navIdent === navIdent)
    if (bruker) {
        session.aktivBruker = bruker
    }
}

export async function hentAktivBruker(): Promise<Bruker> {
    const session = await getSession()
    return session.aktivBruker
}
