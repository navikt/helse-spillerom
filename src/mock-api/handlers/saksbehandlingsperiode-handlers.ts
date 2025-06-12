import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { Person } from '@/mock-api/session'
import { finnPerson } from '@/mock-api/testpersoner/testpersoner'
import { Inntektsforhold } from '@/schemas/inntektsforhold'
import {
    genererDagoversikt,
    getOrgnavn,
    mapArbeidssituasjonTilInntektsforholdtype,
} from '@/mock-api/utils/data-generators'

export async function handleGetSaksbehandlingsperioder(person: Person | undefined): Promise<Response> {
    return NextResponse.json(person?.saksbehandlingsperioder || [])
}

export async function handlePostSaksbehandlingsperioder(
    request: Request,
    person: Person | undefined,
    personIdFraRequest: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const body = await request.json()
    const nyPeriode = {
        id: uuidv4(),
        spilleromPersonId: personIdFraRequest,
        opprettet: new Date().toISOString(),
        opprettetAvNavIdent: 'Z123456',
        opprettetAvNavn: 'Test Testesen',
        fom: body.fom,
        tom: body.tom,
        sykepengesoknadIder: body.sykepengesoknadIder || [],
    }
    person.saksbehandlingsperioder.push(nyPeriode)

    // Automatisk opprettelse av inntektsforhold basert på valgte søknader
    if (body.sykepengesoknadIder && body.sykepengesoknadIder.length > 0) {
        const testperson = finnPerson(personIdFraRequest)
        const søknader = testperson?.soknader || []
        const valgteSøknader = søknader.filter((søknad) => body.sykepengesoknadIder.includes(søknad.id))

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

        // Opprett inntektsforhold og dagoversikt
        if (!person.inntektsforhold) {
            person.inntektsforhold = {}
        }
        if (!person.dagoversikt) {
            person.dagoversikt = {}
        }
        if (!person.inntektsforhold[nyPeriode.id]) {
            person.inntektsforhold[nyPeriode.id] = []
        }

        unikeInntektsforhold.forEach((forhold) => {
            const nyttInntektsforhold: Inntektsforhold = {
                id: uuidv4(),
                inntektsforholdtype: mapArbeidssituasjonTilInntektsforholdtype(forhold.arbeidssituasjon),
                sykmeldtFraForholdet: true, // Automatisk sykmeldt siden det er basert på søknader
                orgnummer: forhold.orgnummer,
                orgnavn: getOrgnavn(forhold.orgnummer, forhold.orgnavn),
            }

            person.inntektsforhold[nyPeriode.id].push(nyttInntektsforhold)

            // Opprett dagoversikt automatisk siden alle er sykmeldt
            person.dagoversikt[nyttInntektsforhold.id] = genererDagoversikt(nyPeriode.fom, nyPeriode.tom)
        })
    }

    return NextResponse.json(nyPeriode, { status: 201 })
}
