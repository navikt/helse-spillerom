import dayjs from 'dayjs'
import { nextleton } from 'nextleton'
import { v4 as uuidv4 } from 'uuid'
import { cookies } from 'next/headers'

import { Personinfo } from '@/schemas/personinfo'

export interface Person {
    fnr: string
    personId: string
    personinfo: Personinfo
}

type session = {
    expires: dayjs.Dayjs
    testpersoner: Person[]
}
export const sessionStore = nextleton('sessionStore', () => {
    return {} as Record<string, session>
})

export async function getSession(): Promise<session> {
    const cookieStore = await cookies()

    function getSessionId(): string {
        const sessionIdCookie = cookieStore.get('mock-session')?.value

        if (sessionIdCookie) {
            return sessionIdCookie
        }
        const sessionId = uuidv4()

        cookieStore.set('mock-session', sessionId, {
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
        sessionStore[sessionId] = {
            expires: dayjs().add(1, 'hour'),
            testpersoner: [
                {
                    fnr: '12345678901',
                    personId: '8j4ns',
                    personinfo: {
                        fødselsnummer: '12345678901',
                        aktørId: '1234567891011',
                        navn: 'Kalle Kranfører',
                        alder: 47,
                    },
                },
            ],
        }
    }

    return sessionStore[sessionId]
}

export async function hentEllerOpprettPerson(fnr: string) {
    const session = await getSession()
    let person = session.testpersoner.find((p) => p.fnr === fnr)

    if (!person) {
        person = {
            fnr: fnr,
            personId: Math.random().toString(36).substring(2, 7),
            personinfo: {
                fødselsnummer: fnr,
                aktørId: '1234567891011',
                navn: 'Kalle Kranfører',
                alder: 47,
            },
        }
        session.testpersoner.push(person)
    }

    return person
}
