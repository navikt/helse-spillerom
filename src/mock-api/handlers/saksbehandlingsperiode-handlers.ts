import { NextResponse } from 'next/server'

import { Person, getSession, hentAktivBruker } from '@/mock-api/session'
import { SaksbehandlingsperiodeEndring } from '@/schemas/saksbehandlingsperiode'
import { finnPerson } from '@/mock-api/testpersoner/testpersoner'
import { opprettSaksbehandlingsperiode } from '@/mock-api/utils/saksbehandlingsperiode-generator'
import { leggTilHistorikkinnslag } from '@/mock-api/utils/historikk-utils'

/**
 * Sjekker om to datoperioder overlapper med hverandre
 * Matcher logikken i bakrommet for overlappsjekk
 */
function perioderOverlapper(fom1: string, tom1: string, fom2: string, tom2: string): boolean {
    const startDato1 = new Date(fom1)
    const sluttDato1 = new Date(tom1)
    const startDato2 = new Date(fom2)
    const sluttDato2 = new Date(tom2)

    // To perioder overlapper hvis start1 <= slutt2 og start2 <= slutt1
    return startDato1 <= sluttDato2 && startDato2 <= sluttDato1
}

/**
 * Finner eksisterende perioder som overlapper med angitt periode
 * Matcher bakrommet sin finnPerioderForPersonSomOverlapper-logikk
 */
function finnOverlappendePerioderForPerson(person: Person, fom: string, tom: string) {
    return person.saksbehandlingsperioder.filter((periode) => perioderOverlapper(fom, tom, periode.fom, periode.tom))
}

/**
 * Oppretter en ProblemDetails-respons som matcher bakrommet sitt format
 */
function opprettProblemDetailsResponse(title: string, status: number = 400) {
    return NextResponse.json(
        {
            type: 'https://spillerom.ansatt.nav.no/validation/input',
            title: title,
            status: status,
            detail: null,
            instance: null,
        },
        {
            status: status,
            headers: {
                'Content-Type': 'application/problem+json',
            },
        },
    )
}

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

    // Valider datoer
    if (body.fom && body.tom && new Date(body.fom) > new Date(body.tom)) {
        return opprettProblemDetailsResponse('Fom-dato kan ikke være etter tom-dato')
    }

    // Sjekk for overlappende perioder - matcher bakrommet sin logikk
    if (body.fom && body.tom) {
        const overlappendePerioderForPerson = finnOverlappendePerioderForPerson(person, body.fom, body.tom)
        if (overlappendePerioderForPerson.length > 0) {
            return opprettProblemDetailsResponse('Angitte datoer overlapper med en eksisterende periode')
        }
    }

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

    // Legg til historikk for opprettelse
    const aktivBruker = await hentAktivBruker()
    leggTilHistorikkinnslag(
        person,
        resultat.saksbehandlingsperiode.id,
        'STARTET',
        'UNDER_BEHANDLING',
        aktivBruker.navIdent,
    )

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

    // Legg til historikk
    const aktivBruker = await hentAktivBruker()
    leggTilHistorikkinnslag(person, periodeId, 'SENDT_TIL_BESLUTNING', 'TIL_BESLUTNING', aktivBruker.navIdent)

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

    // Legg til historikk
    leggTilHistorikkinnslag(
        person,
        periodeId,
        'TATT_TIL_BESLUTNING',
        'UNDER_BESLUTNING',
        aktivBruker.navIdent,
        aktivBruker.navIdent,
    )

    return NextResponse.json(periode, { status: 200 })
}

export async function handleSendTilbake(
    request: Request,
    person: Person | undefined,
    periodeId: string,
): Promise<Response> {
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

    // Hent kommentar fra request body
    let kommentar = ''
    try {
        const body = await request.json()
        kommentar = body.kommentar || ''
    } catch (error) {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
    }

    if (!kommentar.trim()) {
        return NextResponse.json({ message: 'Kommentar er påkrevd' }, { status: 400 })
    }

    periode.status = 'UNDER_BEHANDLING'
    const aktivBruker = await hentAktivBruker()
    periode.beslutter = null // Nullstill beslutter

    // Legg til historikk med kommentar
    leggTilHistorikkinnslag(
        person,
        periodeId,
        'SENDT_I_RETUR',
        'UNDER_BEHANDLING',
        aktivBruker.navIdent,
        null,
        kommentar,
    )

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

    // Legg til historikk
    leggTilHistorikkinnslag(person, periodeId, 'GODKJENT', 'GODKJENT', aktivBruker.navIdent, aktivBruker.navIdent)

    return NextResponse.json(periode, { status: 200 })
}

export async function handleGetHistorikk(person: Person | undefined, periodeId: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const periode = person.saksbehandlingsperioder.find((p) => p.id === periodeId)
    if (!periode) {
        return NextResponse.json({ message: 'Saksbehandlingsperiode not found' }, { status: 404 })
    }

    // Hent historikk for denne saksbehandlingsperioden
    const historikk: SaksbehandlingsperiodeEndring[] = person.historikk[periodeId] || []

    return NextResponse.json(historikk, { status: 200 })
}
