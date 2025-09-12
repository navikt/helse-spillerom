import { v4 as uuidv4 } from 'uuid'

import { Søknad } from '@/schemas/søknad'
import { Dokument } from '@/schemas/dokument'

/**
 * Genererer dokumenter fra søknader basert på valgte søknad-IDer
 * Oppretter dokumenter som representerer søknadene i systemet
 */
export function genererDokumenterFraSøknader(søknader: Søknad[], søknadIder: string[]): Dokument[] {
    const valgteSøknader = søknader.filter((søknad) => søknadIder.includes(søknad.id))

    return valgteSøknader.map(
        (søknad): Dokument => ({
            id: uuidv4(),
            dokumentType: 'søknad',
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
