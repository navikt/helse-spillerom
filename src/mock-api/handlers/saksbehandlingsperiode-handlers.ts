import { NextResponse } from 'next/server'

import { Person, getSession, hentAktivBruker } from '@/mock-api/session'
import { finnPerson } from '@/mock-api/testpersoner/testpersoner'
import { opprettSaksbehandlingsperiode } from '@/mock-api/utils/saksbehandlingsperiode-generator'

export async function handleGetAlleSaksbehandlingsperioder(): Promise<Response> {
    const session = await getSession()
    const alleSaksbehandlingsperioder = session.testpersoner.flatMap((person) =>
        person.saksbehandlingsperioder.map((periode) => ({
            ...periode,
            spilleromPersonId: person.personId,
            status: periode.status || 'UNDER_BEHANDLING',
        })),
    )

    return NextResponse.json(alleSaksbehandlingsperioder)
}

export async function handleGetSaksbehandlingsperioder(person: Person | undefined): Promise<Response> {
    const saksbehandlingsperioder =
        person?.saksbehandlingsperioder.map((periode) => ({
            ...periode,
            spilleromPersonId: person.personId,
            status: periode.status || 'UNDER_BEHANDLING',
        })) || []

    return NextResponse.json(saksbehandlingsperioder)
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

export async function handleSendTilBeslutning(person: Person | undefined, periodeId: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const periode = person.saksbehandlingsperioder.find((p) => p.id === periodeId)
    if (!periode) {
        return NextResponse.json({ message: 'Saksbehandlingsperiode not found' }, { status: 404 })
    }

    // Verifiser at statusendring er gyldig
    if (periode.status !== 'UNDER_BEHANDLING') {
        return NextResponse.json({ message: 'Invalid status transition' }, { status: 400 })
    }

    periode.status = 'TIL_BESLUTNING'

    return NextResponse.json(periode, { status: 200 })
}

export async function handleTaTilBeslutning(person: Person | undefined, periodeId: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const periode = person.saksbehandlingsperioder.find((p) => p.id === periodeId)
    if (!periode) {
        return NextResponse.json({ message: 'Saksbehandlingsperiode not found' }, { status: 404 })
    }

    // Verifiser at statusendring er gyldig
    if (periode.status !== 'TIL_BESLUTNING') {
        return NextResponse.json({ message: 'Invalid status transition' }, { status: 400 })
    }

    periode.status = 'UNDER_BESLUTNING'
    const aktivBruker = await hentAktivBruker()
    periode.beslutter = aktivBruker.navIdent

    return NextResponse.json(periode, { status: 200 })
}

export async function handleSendTilbake(person: Person | undefined, periodeId: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const periode = person.saksbehandlingsperioder.find((p) => p.id === periodeId)
    if (!periode) {
        return NextResponse.json({ message: 'Saksbehandlingsperiode not found' }, { status: 404 })
    }

    // Verifiser at statusendring er gyldig
    if (periode.status !== 'UNDER_BESLUTNING') {
        return NextResponse.json({ message: 'Invalid status transition' }, { status: 400 })
    }

    periode.status = 'UNDER_BEHANDLING'
    periode.beslutter = null // Nullstill beslutter

    return NextResponse.json(periode, { status: 200 })
}

export async function handleGodkjenn(person: Person | undefined, periodeId: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const periode = person.saksbehandlingsperioder.find((p) => p.id === periodeId)
    if (!periode) {
        return NextResponse.json({ message: 'Saksbehandlingsperiode not found' }, { status: 404 })
    }

    // Verifiser at statusendring er gyldig
    if (periode.status !== 'UNDER_BESLUTNING') {
        return NextResponse.json({ message: 'Invalid status transition' }, { status: 400 })
    }

    periode.status = 'GODKJENT'
    const aktivBruker = await hentAktivBruker()
    periode.beslutter = aktivBruker.navIdent

    return NextResponse.json(periode, { status: 200 })
}
