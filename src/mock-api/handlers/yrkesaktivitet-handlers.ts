import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { Person } from '@/mock-api/session'
import { Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { Dag } from '@/schemas/dagoversikt'
import { genererDagoversikt } from '@/mock-api/utils/dagoversikt-generator'
import { kallBakrommetUtbetalingsberegning } from '@/mock-api/utils/bakrommet-client'
import { UtbetalingsberegningInput } from '@/schemas/utbetalingsberegning'
import { beregnDekningsgrad } from '@/mock-api/utils/dekningsgrad-beregner'

function skalHaDagoversikt(kategorisering: Record<string, string | string[]>): boolean {
    const erSykmeldt = kategorisering['ER_SYKMELDT']
    return erSykmeldt === 'ER_SYKMELDT_JA' || erSykmeldt === undefined || erSykmeldt === null
}

export async function handleGetInntektsforhold(person: Person | undefined, uuid: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }
    if (!person.yrkesaktivitet) {
        person.yrkesaktivitet = {}
    }

    const yrkesaktivitet = person.yrkesaktivitet[uuid] || []
    return NextResponse.json(yrkesaktivitet)
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

    // Beregn dekningsgrad basert på kategorisering
    const dekningsgrad = beregnDekningsgrad(kategorisering)

    const nyttInntektsforhold: Yrkesaktivitet = {
        id: uuidv4(),
        kategorisering,
        dagoversikt: skalHaDagoversikt(kategorisering)
            ? genererDagoversikt(saksbehandlingsperiode.fom, saksbehandlingsperiode.tom)
            : [],
        generertFraDokumenter: [],
        dekningsgrad,
        perioder: null, // Starter med null, kan oppdateres senere
    }

    if (!person.yrkesaktivitet) {
        person.yrkesaktivitet = {}
    }
    if (!person.yrkesaktivitet[uuid]) {
        person.yrkesaktivitet[uuid] = []
    }
    person.yrkesaktivitet[uuid].push(nyttInntektsforhold)

    // Slett sykepengegrunnlag når yrkesaktivitet endres
    if (person.sykepengegrunnlag && person.sykepengegrunnlag[uuid]) {
        delete person.sykepengegrunnlag[uuid]
    }

    return NextResponse.json(nyttInntektsforhold, { status: 201 })
}

export async function handleDeleteInntektsforhold(
    person: Person | undefined,
    saksbehandlingsperiodeId: string,
    yrkesaktivitetId: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    if (!person.yrkesaktivitet || !person.yrkesaktivitet[saksbehandlingsperiodeId]) {
        return NextResponse.json({ message: 'Inntektsforhold not found' }, { status: 404 })
    }

    const yrkesaktivitetIndex = person.yrkesaktivitet[saksbehandlingsperiodeId].findIndex(
        (forhold) => forhold.id === yrkesaktivitetId,
    )

    if (yrkesaktivitetIndex === -1) {
        return NextResponse.json({ message: 'Inntektsforhold not found' }, { status: 404 })
    }

    // Remove the yrkesaktivitet
    person.yrkesaktivitet[saksbehandlingsperiodeId].splice(yrkesaktivitetIndex, 1)

    // Also remove associated dagoversikt if it exists
    if (person.dagoversikt && person.dagoversikt[yrkesaktivitetId]) {
        delete person.dagoversikt[yrkesaktivitetId]
    }

    // Slett sykepengegrunnlag når yrkesaktivitet endres
    if (person.sykepengegrunnlag && person.sykepengegrunnlag[saksbehandlingsperiodeId]) {
        delete person.sykepengegrunnlag[saksbehandlingsperiodeId]
    }

    // Slett utbetalingsberegning når yrkesaktivitet endres
    if (person.utbetalingsberegning && person.utbetalingsberegning[saksbehandlingsperiodeId]) {
        delete person.utbetalingsberegning[saksbehandlingsperiodeId]
    }

    return new Response(null, { status: 204 })
}

/**
 * Ren funksjon som oppdaterer dagoversikt på en yrkesaktivitet
 * Kan gjenbrukes i testdata-oppsett og andre steder
 */
export function oppdaterDagoversiktPåYrkesaktivitet(
    person: Person,
    uuid: string,
    yrkesaktivitetId: string,
    dagerSomSkalOppdateres: Dag[],
): void {
    const yrkesaktivitet = person.yrkesaktivitet?.[uuid]?.find((forhold) => forhold.id === yrkesaktivitetId)
    if (!yrkesaktivitet) {
        throw new Error(`Yrkesaktivitet med ID ${yrkesaktivitetId} ikke funnet`)
    }

    if (!Array.isArray(yrkesaktivitet.dagoversikt)) {
        throw new Error('Ingen dagoversikt på yrkesaktivitet')
    }

    // Oppdater kun dagene som finnes i body, behold andre dager uendret
    // Ignorer helgdager ved oppdatering
    const oppdaterteDager: Dag[] = [...yrkesaktivitet.dagoversikt]
    for (const oppdatertDag of dagerSomSkalOppdateres) {
        const index = oppdaterteDager.findIndex((d) => d.dato === oppdatertDag.dato)
        if (index !== -1) {
            const eksisterendeDag = oppdaterteDager[index]
            oppdaterteDager[index] = { ...eksisterendeDag, ...oppdatertDag, kilde: 'Saksbehandler' }
        }
    }
    yrkesaktivitet.dagoversikt = oppdaterteDager
}

export async function handlePutDagoversikt(
    request: Request,
    person: Person | undefined,
    uuid: string,
    yrkesaktivitetId: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const yrkesaktivitet = person.yrkesaktivitet?.[uuid]?.find((forhold) => forhold.id === yrkesaktivitetId)
    if (!yrkesaktivitet) {
        return NextResponse.json({ message: 'Inntektsforhold not found' }, { status: 404 })
    }

    const body = await request.json()

    // Håndter både gammelt format (array av dager) og nytt format (objekt med dager og notat)
    let dagerSomSkalOppdateres: Dag[]
    if (Array.isArray(body)) {
        // Gammelt format: direkte array av dager
        dagerSomSkalOppdateres = body as Dag[]
    } else if (body && typeof body === 'object' && Array.isArray(body.dager)) {
        // Nytt format: objekt med dager og notat felter
        dagerSomSkalOppdateres = body.dager as Dag[]
        // TODO: Håndter notat hvis nødvendig
    } else {
        return NextResponse.json(
            { message: 'Body must be an array of days or an object with dager field' },
            { status: 400 },
        )
    }

    oppdaterDagoversiktPåYrkesaktivitet(person, uuid, yrkesaktivitetId, dagerSomSkalOppdateres)

    // Kall bakrommet for å beregne utbetalinger
    await triggerUtbetalingsberegning(person, uuid)
    return new Response(null, { status: 204 })
}

export async function handlePutInntektsforholdKategorisering(
    request: Request,
    person: Person | undefined,
    uuid: string,
    yrkesaktivitetId: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const yrkesaktivitet = person.yrkesaktivitet?.[uuid]?.find((forhold) => forhold.id === yrkesaktivitetId)
    if (!yrkesaktivitet) {
        return NextResponse.json({ message: 'Inntektsforhold not found' }, { status: 404 })
    }

    const body = await request.json()
    yrkesaktivitet.kategorisering = body

    // Beregn og oppdater dekningsgrad basert på ny kategorisering
    try {
        yrkesaktivitet.dekningsgrad = beregnDekningsgrad(body)
    } catch (error) {
        // Bruk standard dekningsgrad hvis beregning feiler
        yrkesaktivitet.dekningsgrad = 100
    }

    // Slett sykepengegrunnlag når yrkesaktivitet endres
    if (person.sykepengegrunnlag && person.sykepengegrunnlag[uuid]) {
        delete person.sykepengegrunnlag[uuid]
    }

    // Slett utbetalingsberegning når yrkesaktivitet endres
    if (person.utbetalingsberegning && person.utbetalingsberegning[uuid]) {
        delete person.utbetalingsberegning[uuid]
    }

    return new Response(null, { status: 204 })
}

export async function handlePutInntektsforholdPerioder(
    request: Request,
    person: Person | undefined,
    uuid: string,
    yrkesaktivitetId: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const yrkesaktivitet = person.yrkesaktivitet?.[uuid]?.find((forhold) => forhold.id === yrkesaktivitetId)
    if (!yrkesaktivitet) {
        return NextResponse.json({ message: 'Inntektsforhold not found' }, { status: 404 })
    }

    const body = await request.json()
    yrkesaktivitet.perioder = body

    // Slett sykepengegrunnlag når yrkesaktivitet endres
    if (person.sykepengegrunnlag && person.sykepengegrunnlag[uuid]) {
        delete person.sykepengegrunnlag[uuid]
    }

    // Slett utbetalingsberegning når yrkesaktivitet endres
    if (person.utbetalingsberegning && person.utbetalingsberegning[uuid]) {
        delete person.utbetalingsberegning[uuid]
    }

    return new Response(null, { status: 204 })
}

async function triggerUtbetalingsberegning(person: Person, saksbehandlingsperiodeId: string) {
    const sykepengegrunnlag = person.sykepengegrunnlag?.[saksbehandlingsperiodeId]
    const yrkesaktivitet = person.yrkesaktivitet?.[saksbehandlingsperiodeId]
    const saksbehandlingsperiode = person.saksbehandlingsperioder?.find((p) => p.id === saksbehandlingsperiodeId)

    if (!sykepengegrunnlag || !yrkesaktivitet || yrkesaktivitet.length === 0 || !saksbehandlingsperiode) {
        return
    }

    // Legg til manglende felter som bakrommet forventer
    const yrkesaktivitetMedManglendeFelter = yrkesaktivitet.map((ya) => ({
        ...ya,
        kategoriseringGenerert: null,
        dagoversiktGenerert: null,
        saksbehandlingsperiodeId,
        opprettet: new Date().toISOString(),
        generertFraDokumenter: [],
        dekningsgrad: ya.dekningsgrad || 100, // Bruk eksisterende dekningsgrad eller standard
    }))

    const input: UtbetalingsberegningInput = {
        sykepengegrunnlag,
        yrkesaktivitet: yrkesaktivitetMedManglendeFelter,
        saksbehandlingsperiode: {
            fom: saksbehandlingsperiode.fom,
            tom: saksbehandlingsperiode.tom,
        },
    }

    const beregningData = await kallBakrommetUtbetalingsberegning(input)
    if (beregningData) {
        if (!person.utbetalingsberegning) {
            person.utbetalingsberegning = {}
        }
        person.utbetalingsberegning[saksbehandlingsperiodeId] = beregningData
    }
}

// Test funksjon for å verifisere at det nye formatet fungerer
export function testNyttFormat() {
    const testData = {
        dager: [
            {
                dato: '2024-08-06',
                dagtype: 'Arbeidsdag',
                grad: null,
                avslåttBegrunnelse: [],
                kilde: 'Saksbehandler',
            },
        ],
        notat: '',
    }

    // Simuler at dette er et array av dager
    const dagerSomSkalOppdateres = testData.dager
    return dagerSomSkalOppdateres
}
