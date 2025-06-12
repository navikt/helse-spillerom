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
        inntektsforholdtype: body.inntektsforholdtype,
        sykmeldtFraForholdet: body.sykmeldtFraForholdet,
        orgnummer: body.orgnummer,
        orgnavn: getOrgnavn(body.orgnummer),
    }

    if (!person.inntektsforhold) {
        person.inntektsforhold = {}
    }
    if (!person.inntektsforhold[uuid]) {
        person.inntektsforhold[uuid] = []
    }

    person.inntektsforhold[uuid].push(nyttInntektsforhold)

    // Opprett dagoversikt automatisk hvis sykmeldt fra forholdet
    if (body.sykmeldtFraForholdet) {
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

export async function handleGetDagoversikt(person: Person | undefined, inntektsforholdId: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }
    if (!person.dagoversikt) {
        person.dagoversikt = {}
    }
    return NextResponse.json(person.dagoversikt[inntektsforholdId] || [])
}
