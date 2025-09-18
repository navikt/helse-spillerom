import { Personinfo } from '@/schemas/personinfo'
import { Mattis } from '@/mock-api/testpersoner/MattisMatros'
import { Søknad } from '@/schemas/søknad'
import { Saksbehandlingsperiode } from '@/schemas/saksbehandlingsperiode'
import { Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { Dagoversikt } from '@/schemas/dagoversikt'
import { Dokument } from '@/schemas/dokument'

import { Person } from '../session'

import { Bosse } from './BosseBunntrål'
import { BlankeArk } from './BlankeArk'
import { Kalle } from './KalleKranfører'
import { Mugge } from './MuggeMcMurstein'

export interface Testperson {
    personId: string
    personinfo: Personinfo
    soknader: Søknad[]
    saksbehandlingsperioder: Saksbehandlingsperiode[]
    yrkesaktivitet?: Record<string, Yrkesaktivitet[]>
    dagoversikt?: Record<string, Dagoversikt>
    dokumenter: Record<string, Dokument[]>
    postCreateCallback?: (person: Person) => void
}

export const testpersoner: Testperson[] = [Kalle, Mattis, Bosse, BlankeArk, Mugge]

export function finnPerson(personId: string) {
    return testpersoner.find((p) => p.personId === personId)
}
