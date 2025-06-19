import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { Person } from '@/mock-api/session'
import { Inntektsforhold } from '@/schemas/inntektsforhold'
import { genererDagoversikt, getOrgnavn } from '@/mock-api/utils/data-generators'

export async function handleGetInntektsforhold(person: Person | undefined, uuid: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }
    if (!person.inntektsforhold) {
        person.inntektsforhold = {}
    }
    return NextResponse.json(person.inntektsforhold[uuid] || [])
}

export async function handlePostInntektsforhold(
    request: Request,
    person: Person | undefined,
    uuid: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const body = await request.json()

    const nyttInntektsforhold: Inntektsforhold = {
        id: uuidv4(),
        kategorisering: { ...body.kategorisering, ORGNAVN: getOrgnavn(body.kategorisering['ORGNUMMER']) ?? '' },
    }

    if (!person.inntektsforhold) {
        person.inntektsforhold = {}
    }
    if (!person.inntektsforhold[uuid]) {
        person.inntektsforhold[uuid] = []
    }

    person.inntektsforhold[uuid].push(nyttInntektsforhold)

    // Opprett dagoversikt automatisk hvis sykmeldt fra forholdet
    if (body.kategorisering['ER_SYKMELDT'] === 'ER_SYKMELDT_JA') {
        if (!person.dagoversikt) {
            person.dagoversikt = {}
        }

        // Finn saksbehandlingsperioden for å få fom og tom
        const saksbehandlingsperiode = person.saksbehandlingsperioder.find((p) => p.id === uuid)
        if (saksbehandlingsperiode) {
            person.dagoversikt[nyttInntektsforhold.id] = genererDagoversikt(
                saksbehandlingsperiode.fom,
                saksbehandlingsperiode.tom,
            )
        }
    }

    return NextResponse.json(nyttInntektsforhold, { status: 201 })
}

export async function handleDeleteInntektsforhold(
    person: Person | undefined,
    saksbehandlingsperiodeId: string,
    inntektsforholdId: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    if (!person.inntektsforhold || !person.inntektsforhold[saksbehandlingsperiodeId]) {
        return NextResponse.json({ message: 'Inntektsforhold not found' }, { status: 404 })
    }

    const inntektsforholdIndex = person.inntektsforhold[saksbehandlingsperiodeId].findIndex(
        (forhold) => forhold.id === inntektsforholdId,
    )

    if (inntektsforholdIndex === -1) {
        return NextResponse.json({ message: 'Inntektsforhold not found' }, { status: 404 })
    }

    // Remove the inntektsforhold
    person.inntektsforhold[saksbehandlingsperiodeId].splice(inntektsforholdIndex, 1)

    // Also remove associated dagoversikt if it exists
    if (person.dagoversikt && person.dagoversikt[inntektsforholdId]) {
        delete person.dagoversikt[inntektsforholdId]
    }

    return new Response(null, { status: 204 })
}

export async function handleGetDagoversikt(person: Person | undefined, inntektsforholdId: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }
    if (!person.dagoversikt) {
        person.dagoversikt = {}
    }
    return NextResponse.json(person.dagoversikt[inntektsforholdId] || [])
}
