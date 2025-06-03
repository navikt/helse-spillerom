import { nextleton } from 'nextleton'
import { v4 as uuidv4 } from 'uuid'
import { cookies } from 'next/headers'
import { faker } from '@faker-js/faker/locale/nb_NO'
import dayjs, { Dayjs } from 'dayjs'

import { Personinfo } from '@/schemas/personinfo'
import { testpersoner } from '@/mock-api/testpersoner/testpersoner'
import { Saksbehandlingsperiode } from '@/schemas/saksbehandlingsperiode'
import { Vilkaarsvurdering } from '@/schemas/vilkaarsvurdering'

export interface Person {
    fnr: string
    personId: string
    personinfo: Personinfo
    saksbehandlingsperioder: Saksbehandlingsperiode[]
    vilkaarsvurderinger: Record<string, Vilkaarsvurdering[]>
}

type Session = {
    expires: Dayjs
    testpersoner: Person[]
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
        const personer = testpersoner.map(
            (p): Person => ({
                fnr: p.personinfo.fødselsnummer,
                personId: p.personId,
                personinfo: {
                    fødselsnummer: p.personinfo.fødselsnummer,
                    aktørId: p.personinfo.aktørId,
                    navn: p.personinfo.navn,
                    alder: p.personinfo.alder,
                },
                saksbehandlingsperioder: [...p.saksbehandlingsperioder],
                vilkaarsvurderinger: {},
            }),
        )

        sessionStore[sessionId] = {
            expires: dayjs().add(1, 'hour'),
            testpersoner: [
                ...personer,
                skapPerson('12345678902'),
                skapPerson('12345678903'),
                skapPerson('33423422323'),
            ],
        }
    }

    return sessionStore[sessionId]
}

function skapPerson(fnr: string): Person {
    faker.seed(Number(fnr))
    return {
        fnr: fnr,
        personId: Math.random().toString(36).substring(2, 7),
        personinfo: {
            fødselsnummer: fnr,
            aktørId: fnr + '00',
            navn: faker.person.firstName() + ' ' + faker.person.lastName(),
            alder: faker.number.int({ min: 14, max: 80 }),
        },
        saksbehandlingsperioder: [],
        vilkaarsvurderinger: {},
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
