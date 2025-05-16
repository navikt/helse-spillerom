import { Personinfo } from '@/schemas/personinfo'
import { Mattis } from '@/mock-api/testpersoner/MattisMatros'
import { Kalle } from '@/mock-api/testpersoner/KalleKranfører'
import { Søknad } from '@/schemas/søknad'
import { Saksbehandlingsperiode } from '@/schemas/saksbehandlingsperiode'

export interface Testperson {
    personId: string
    personinfo: Personinfo
    soknader: Søknad[]
    saksbehandlingsperioder: Saksbehandlingsperiode[]
}

export const testpersoner: Testperson[] = [Kalle, Mattis]

export function finnPerson(personId: string) {
    return testpersoner.find((p) => p.personId === personId)
}
