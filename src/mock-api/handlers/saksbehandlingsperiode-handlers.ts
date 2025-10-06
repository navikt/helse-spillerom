import { randomUUID } from 'node:crypto'

import { NextResponse } from 'next/server'
import dayjs from 'dayjs'

import { getSession, hentAktivBruker, Person } from '@/mock-api/session'
import { Saksbehandlingsperiode, SaksbehandlingsperiodeEndring } from '@/schemas/saksbehandlingsperiode'
import { finnPerson } from '@/mock-api/testpersoner/testpersoner'
import { opprettSaksbehandlingsperiode } from '@/mock-api/utils/saksbehandlingsperiode-generator'
import { leggTilHistorikkinnslag } from '@/mock-api/utils/historikk-utils'
import { SykepengegrunnlagResponse } from '@schemas/sykepengegrunnlag'
import { genererDagoversikt } from '@/mock-api/utils/dagoversikt-generator'
import { triggerUtbetalingsberegning } from '@/mock-api/handlers/sykepengegrunnlag-handlers'
import { Bruker } from '@schemas/bruker'

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

    const aktivBruker = await hentAktivBruker()

    const tidligerePeriodeInntilNyPeriode = person.saksbehandlingsperioder.find((periode) =>
        dayjs(periode.tom).add(1, 'day').isSame(body.fom, 'day'),
    )

    const { saksbehandlingsperiode, yrkesaktivitet, dagoversikt, dokumenter } = opprettSaksbehandlingsperiode(
        personIdFraRequest,
        søknader,
        body.fom,
        body.tom,
        body.søknader || [],
        undefined,
        aktivBruker,
        tidligerePeriodeInntilNyPeriode?.skjæringstidspunkt ?? body.fom,
    )

    const nyPeriodeId = saksbehandlingsperiode.id

    person.saksbehandlingsperioder.push(saksbehandlingsperiode)

    // Legg til historikk for opprettelse
    leggTilHistorikkinnslag(person, nyPeriodeId, 'STARTET', 'UNDER_BEHANDLING', aktivBruker.navIdent)

    // Legg til yrkesaktivitet hvis det finnes noen
    if (yrkesaktivitet.length > 0) {
        if (!person.yrkesaktivitet) {
            person.yrkesaktivitet = {}
        }
        // Inkluder dagoversikt i yrkesaktivitet
        person.yrkesaktivitet[nyPeriodeId] = yrkesaktivitet.map((forhold) => ({
            ...forhold,
            dagoversikt: dagoversikt[forhold.id] || [],
        }))
    }

    // Legg til dagoversikt hvis det finnes noen
    if (Object.keys(dagoversikt).length > 0) {
        if (!person.dagoversikt) {
            person.dagoversikt = {}
        }
        Object.assign(person.dagoversikt, dagoversikt)
    }

    if (tidligerePeriodeInntilNyPeriode) {
        arvYrkesaktivitetOgSykepengegrunnlag(
            tidligerePeriodeInntilNyPeriode,
            saksbehandlingsperiode,
            person,
            aktivBruker,
        )
    }

    // Legg til dokumenter hvis det finnes noen
    if (dokumenter.length > 0) {
        if (!person.dokumenter) {
            person.dokumenter = {}
        }
        person.dokumenter[nyPeriodeId] = dokumenter
    }

    await triggerUtbetalingsberegning(person, nyPeriodeId)

    return NextResponse.json(saksbehandlingsperiode, { status: 201 })
}

export async function handleSendTilBeslutning(
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
    if (periode.status !== 'UNDER_BEHANDLING') {
        return NextResponse.json({ message: 'Invalid status transition' }, { status: 400 })
    }

    // Hent begrunnelse fra request body
    let individuellBegrunnelse: string | undefined = undefined
    try {
        const body = await request.json()
        individuellBegrunnelse = body.individuellBegrunnelse || undefined
    } catch (error) {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
    }

    periode.status = 'TIL_BESLUTNING'
    periode.individuellBegrunnelse = individuellBegrunnelse

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
    periode.beslutter = undefined // Nullstill beslutter

    // Legg til historikk med kommentar
    leggTilHistorikkinnslag(
        person,
        periodeId,
        'SENDT_I_RETUR',
        'UNDER_BEHANDLING',
        aktivBruker.navIdent,
        undefined,
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

export async function handleOppdaterSkjæringstidspunkt(
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

    // Hent skjæringstidspunkt fra request body
    let skjæringstidspunkt: string | undefined = undefined
    try {
        const body = await request.json()
        skjæringstidspunkt = body.skjaeringstidspunkt || undefined
    } catch (error) {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
    }

    // Valider datoformat hvis skjæringstidspunkt er satt
    if (skjæringstidspunkt && isNaN(Date.parse(skjæringstidspunkt))) {
        return NextResponse.json({ message: 'Ugyldig datoformat for skjæringstidspunkt' }, { status: 400 })
    }

    // Oppdater skjæringstidspunkt
    periode.skjæringstidspunkt = skjæringstidspunkt

    return NextResponse.json(periode, { status: 200 })
}

function arvYrkesaktivitetOgSykepengegrunnlag(
    tidligerePeriodeInntilNyPeriode: Saksbehandlingsperiode,
    nyPeriode: Saksbehandlingsperiode,
    person: Person,
    aktivBruker: Bruker,
) {
    const nyPeriodeId = nyPeriode.id
    if (!person.yrkesaktivitet[nyPeriodeId]) {
        person.yrkesaktivitet[nyPeriodeId] = []
    }

    const gammelTilNyIdMap = new Map<string, string>()

    if (person.yrkesaktivitet[tidligerePeriodeInntilNyPeriode.id] !== undefined) {
        const key = (k: Record<string, unknown>) => JSON.stringify(k)

        const map = new Map(person.yrkesaktivitet[nyPeriodeId].map((item) => [key(item.kategorisering), item]))

        person.yrkesaktivitet[tidligerePeriodeInntilNyPeriode.id].forEach((item) => {
            const k = key(item.kategorisering)
            if (!map.has(k)) {
                const newItem = {
                    ...item,
                    id: randomUUID(),
                    dagoversikt: genererDagoversikt(nyPeriode.fom, nyPeriode.tom),
                }
                map.set(k, newItem)
                gammelTilNyIdMap.set(item.id, newItem.id)
            } else {
                gammelTilNyIdMap.set(item.id, map.get(k)!.id)
            }
        })

        person.yrkesaktivitet[nyPeriodeId] = [
            ...person.yrkesaktivitet[nyPeriodeId],
            ...Array.from(map.values()).filter(
                (i) =>
                    !person.yrkesaktivitet[nyPeriodeId].some(
                        (existing) => key(existing.kategorisering) === key(i.kategorisering),
                    ),
            ),
        ]
    }

    if (person.sykepengegrunnlag[tidligerePeriodeInntilNyPeriode.id] !== undefined) {
        person.sykepengegrunnlag[nyPeriodeId] = {
            ...person.sykepengegrunnlag[tidligerePeriodeInntilNyPeriode.id],
            id: randomUUID(),
            saksbehandlingsperiodeId: nyPeriodeId,
            opprettetAv: aktivBruker.navIdent,
            opprettet: new Date().toISOString(),
            sistOppdatert: new Date().toISOString(),
            inntekter: person.sykepengegrunnlag[tidligerePeriodeInntilNyPeriode.id]!.inntekter.map((inntekt) => ({
                ...inntekt,
                yrkesaktivitetId: gammelTilNyIdMap.get(inntekt.yrkesaktivitetId) ?? randomUUID(),
            })),
        } as SykepengegrunnlagResponse
    }
}
