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

    // Hent inntektsforhold og inkluder dagoversikt
    const inntektsforhold = person.inntektsforhold[uuid] || []
    const inntektsforholdMedDagoversikt = inntektsforhold.map((forhold) => ({
        ...forhold,
        sykmeldtFraForholdet: forhold.kategorisering['ER_SYKMELDT'] === 'ER_SYKMELDT_JA',
        dagoversikt: person.dagoversikt?.[forhold.id] || [],
        generertFraDokumenter: [],
    }))

    return NextResponse.json(inntektsforholdMedDagoversikt)
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
        sykmeldtFraForholdet: body.kategorisering['ER_SYKMELDT'] === 'ER_SYKMELDT_JA',
        dagoversikt: [],
        generertFraDokumenter: [],
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
            // Oppdater inntektsforhold med dagoversikt
            nyttInntektsforhold.dagoversikt = person.dagoversikt[nyttInntektsforhold.id]
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

export async function handlePutInntektsforholdKategorisering(
    request: Request,
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
    const body = await request.json()
    const index = person.inntektsforhold[saksbehandlingsperiodeId].findIndex((f) => f.id === inntektsforholdId)
    if (index === -1) {
        return NextResponse.json({ message: 'Inntektsforhold not found' }, { status: 404 })
    }
    // Oppdater kategorisering og ORGNAVN
    const updated: Inntektsforhold = {
        ...person.inntektsforhold[saksbehandlingsperiodeId][index],
        kategorisering: { ...body, ORGNAVN: getOrgnavn(body['ORGNUMMER']) ?? '' },
    }
    person.inntektsforhold[saksbehandlingsperiodeId][index] = updated
    return new Response(null, { status: 204 })
}

export async function handlePutInntektsforholdDagoversikt(
    request: Request,
    person: Person | undefined,
    inntektsforholdId: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const body = await request.json()

    // Oppdater dagoversikt i person.dagoversikt
    if (!person.dagoversikt) {
        person.dagoversikt = {}
    }
    person.dagoversikt[inntektsforholdId] = body

    // Oppdater dagoversikt i alle inntektsforhold for alle saksbehandlingsperioder
    if (person.inntektsforhold) {
        Object.values(person.inntektsforhold).forEach((forholdList) => {
            const forhold = forholdList.find((f) => f.id === inntektsforholdId)
            if (forhold) {
                forhold.dagoversikt = body
            }
        })
    }

    return new Response(null, { status: 204 })
}
