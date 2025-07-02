import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { Person } from '@/mock-api/session'
import { Inntektsforhold } from '@/schemas/inntektsforhold'
import { Dag } from '@/schemas/dagoversikt'
import { genererDagoversikt } from '@/mock-api/utils/dagoversikt-generator'

function skalHaDagoversikt(kategorisering: Record<string, string | string[]>): boolean {
    const erSykmeldt = kategorisering['ER_SYKMELDT']
    return erSykmeldt === 'ER_SYKMELDT_JA' || erSykmeldt === undefined || erSykmeldt === null
}

export async function handleGetInntektsforhold(person: Person | undefined, uuid: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }
    if (!person.inntektsforhold) {
        person.inntektsforhold = {}
    }

    const inntektsforhold = person.inntektsforhold[uuid] || []
    return NextResponse.json(inntektsforhold)
}

export async function handlePostInntektsforhold(
    request: Request,
    person: Person | undefined,
    uuid: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const saksbehandlingsperiode = person.saksbehandlingsperioder.find((periode) => periode.id === uuid)
    if (!saksbehandlingsperiode) {
        return NextResponse.json({ message: 'Saksbehandlingsperiode not found' }, { status: 404 })
    }

    const body = await request.json()
    const kategorisering = body.kategorisering

    const nyttInntektsforhold: Inntektsforhold = {
        id: uuidv4(),
        kategorisering,
        dagoversikt: skalHaDagoversikt(kategorisering)
            ? genererDagoversikt(saksbehandlingsperiode.fom, saksbehandlingsperiode.tom)
            : [],
        generertFraDokumenter: [],
    }

    if (!person.inntektsforhold) {
        person.inntektsforhold = {}
    }
    if (!person.inntektsforhold[uuid]) {
        person.inntektsforhold[uuid] = []
    }
    person.inntektsforhold[uuid].push(nyttInntektsforhold)

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

export async function handlePutInntektsforholdDagoversikt(
    request: Request,
    person: Person | undefined,
    uuid: string,
    inntektsforholdId: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const inntektsforhold = person.inntektsforhold?.[uuid]?.find((forhold) => forhold.id === inntektsforholdId)
    if (!inntektsforhold) {
        return NextResponse.json({ message: 'Inntektsforhold not found' }, { status: 404 })
    }

    const body = await request.json()
    // body er et array av dager som skal oppdateres
    if (!Array.isArray(body)) {
        return NextResponse.json({ message: 'Body must be an array of days' }, { status: 400 })
    }
    if (!Array.isArray(inntektsforhold.dagoversikt)) {
        return NextResponse.json({ message: 'Ingen dagoversikt på inntektsforhold' }, { status: 400 })
    }

    // Oppdater kun dagene som finnes i body, behold andre dager uendret
    // Ignorer helgdager ved oppdatering
    const oppdaterteDager: Dag[] = [...inntektsforhold.dagoversikt]
    for (const oppdatertDag of body as Dag[]) {
        const index = oppdaterteDager.findIndex((d) => d.dato === oppdatertDag.dato)
        if (index !== -1) {
            const eksisterendeDag = oppdaterteDager[index]
            // Ignorer oppdatering hvis den eksisterende dagen er en helg
            if (eksisterendeDag.dagtype !== 'Helg') {
                oppdaterteDager[index] = { ...eksisterendeDag, ...oppdatertDag, kilde: 'Saksbehandler' }
            }
        }
    }
    inntektsforhold.dagoversikt = oppdaterteDager

    return new Response(null, { status: 204 })
}

export async function handlePutInntektsforholdKategorisering(
    request: Request,
    person: Person | undefined,
    uuid: string,
    inntektsforholdId: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const inntektsforhold = person.inntektsforhold?.[uuid]?.find((forhold) => forhold.id === inntektsforholdId)
    if (!inntektsforhold) {
        return NextResponse.json({ message: 'Inntektsforhold not found' }, { status: 404 })
    }

    const body = await request.json()
    inntektsforhold.kategorisering = body

    return new Response(null, { status: 204 })
}
