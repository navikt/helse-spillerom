import { NextResponse } from 'next/server'

import { Person } from '@/mock-api/session'
import { finnPerson } from '@/mock-api/testpersoner/testpersoner'
import { opprettSaksbehandlingsperiode } from '@/mock-api/utils/saksbehandlingsperiode-generator'

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
    const testperson = finnPerson(personIdFraRequest)
    const søknader = testperson?.soknader || []

    const resultat = opprettSaksbehandlingsperiode(
        personIdFraRequest,
        søknader,
        body.fom,
        body.tom,
        body.søknader || [],
    )

    person.saksbehandlingsperioder.push(resultat.saksbehandlingsperiode)

    // Legg til inntektsforhold hvis det finnes noen
    if (resultat.inntektsforhold.length > 0) {
        if (!person.inntektsforhold) {
            person.inntektsforhold = {}
        }
        // Inkluder dagoversikt i inntektsforhold
        const inntektsforholdMedDagoversikt = resultat.inntektsforhold.map((forhold) => ({
            ...forhold,
            dagoversikt: resultat.dagoversikt[forhold.id] || [],
        }))
        person.inntektsforhold[resultat.saksbehandlingsperiode.id] = inntektsforholdMedDagoversikt
    }

    // Legg til dagoversikt hvis det finnes noen
    if (Object.keys(resultat.dagoversikt).length > 0) {
        if (!person.dagoversikt) {
            person.dagoversikt = {}
        }
        Object.assign(person.dagoversikt, resultat.dagoversikt)
    }

    // Legg til dokumenter hvis det finnes noen
    if (resultat.dokumenter.length > 0) {
        if (!person.dokumenter) {
            person.dokumenter = {}
        }
        person.dokumenter[resultat.saksbehandlingsperiode.id] = resultat.dokumenter
    }

    return NextResponse.json(resultat.saksbehandlingsperiode, { status: 201 })
}
