import { Personinfo } from '@/schemas/personinfo'
import { Mattis } from '@/mock-api/testpersoner/MattisMatros'
import { Kalle } from '@/mock-api/testpersoner/KalleKranfører'
import { Søknad } from '@/schemas/søknad'
import { Saksbehandlingsperiode } from '@/schemas/saksbehandlingsperiode'
import { Inntektsforhold } from '@/schemas/inntektsforhold'
import { Dagoversikt } from '@/schemas/dagoversikt'
import { Dokument } from '@/schemas/dokument'

import { Bosse } from './BosseBunntrål'
import { BlankeArk } from './BlankeArk'

export interface Testperson {
    personId: string
    personinfo: Personinfo
    soknader: Søknad[]
    saksbehandlingsperioder: Saksbehandlingsperiode[]
    inntektsforhold?: Record<string, Inntektsforhold[]>
    dagoversikt?: Record<string, Dagoversikt>
    dokumenter: Record<string, Dokument[]>
}

export const testpersoner: Testperson[] = [Kalle, Mattis, Bosse, BlankeArk]

export function finnPerson(personId: string) {
    return testpersoner.find((p) => p.personId === personId)
}
