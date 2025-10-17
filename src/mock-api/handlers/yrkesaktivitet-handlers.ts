import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { Person } from '@/mock-api/session'
import { Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { Dag } from '@/schemas/dagoversikt'
import {
    InntektRequest,
    ArbeidstakerInntektRequest,
    PensjonsgivendeInntektRequest,
    FrilanserInntektRequest,
    ArbeidsledigInntektRequest,
} from '@/schemas/inntektRequest'
import { InntektData } from '@/schemas/inntektData'
import { genererDagoversikt } from '@/mock-api/utils/dagoversikt-generator'
import { kallBakrommetUtbetalingsberegning } from '@/mock-api/utils/bakrommet-client'
import { UtbetalingsberegningInput } from '@/schemas/utbetalingsberegning'
import { beregnSykepengegrunnlagV2 } from '@/mock-api/handlers/sykepengegrunnlagV2-handlers'

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

    const nyttInntektsforhold: Yrkesaktivitet = {
        id: uuidv4(),
        kategorisering,
        dagoversikt: skalHaDagoversikt(kategorisering)
            ? genererDagoversikt(saksbehandlingsperiode.fom, saksbehandlingsperiode.tom)
            : [],
        generertFraDokumenter: [],
        perioder: null, // Starter med null, kan oppdateres senere
    }

    if (!person.yrkesaktivitet) {
        person.yrkesaktivitet = {}
    }
    if (!person.yrkesaktivitet[uuid]) {
        person.yrkesaktivitet[uuid] = []
    }
    person.yrkesaktivitet[uuid].push(nyttInntektsforhold)

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

    await triggerUtbetalingsberegning(person, uuid)

    return new Response(null, { status: 204 })
}

export async function handlePutInntekt(
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
    const inntektRequest: InntektRequest = body

    // Oppdater inntektRequest på yrkesaktiviteten
    yrkesaktivitet.inntektRequest = inntektRequest

    // Generer inntektData basert på inntektRequest
    const inntektData = genererInntektData(inntektRequest)
    yrkesaktivitet.inntektData = inntektData
    // Slett utbetalingsberegning når inntekt endres
    if (person.utbetalingsberegning && person.utbetalingsberegning[uuid]) {
        delete person.utbetalingsberegning[uuid]
    }
    await triggerUtbetalingsberegning(person, uuid)

    return new Response(null, { status: 204 })
}

function genererInntektData(inntektRequest: InntektRequest): InntektData {
    switch (inntektRequest.inntektskategori) {
        case 'ARBEIDSTAKER':
            return genererArbeidstakerInntektData(inntektRequest.data)
        case 'SELVSTENDIG_NÆRINGSDRIVENDE':
            return genererSelvstendigNæringsdrivendeInntektData(inntektRequest.data)
        case 'INAKTIV':
            return genererInaktivInntektData(inntektRequest.data)
        case 'FRILANSER':
            return genererFrilanserInntektData(inntektRequest.data)
        case 'ARBEIDSLEDIG':
            return genererArbeidsledigInntektData(inntektRequest.data)
        default:
            throw new Error('Ukjent inntektskategori')
    }
}

function genererArbeidstakerInntektData(data: ArbeidstakerInntektRequest): InntektData {
    if (data.type === 'SKJONNSFASTSETTELSE') {
        return {
            inntektstype: 'ARBEIDSTAKER_SKJØNNSFASTSATT',
            omregnetÅrsinntekt: data.månedsbeløp * 12,
            sporing: `SKJØNNSFASTSATT_${data.årsak} TODO`,
        }
    }

    if (data.type === 'MANUELT_BEREGNET') {
        return {
            inntektstype: 'ARBEIDSTAKER_MANUELT_BEREGNET',
            omregnetÅrsinntekt: data.månedsbeløp * 12,
            sporing: 'BEREGNINGSSPORINGVERDI',
        }
    }

    if (data.type === 'AINNTEKT') {
        return {
            inntektstype: 'ARBEIDSTAKER_AINNTEKT',
            omregnetÅrsinntekt: 400000, // TODO: Hent ekte A-inntekt data
            sporing: 'A-inntekt TODO',
        }
    }

    if (data.type === 'INNTEKTSMELDING') {
        return {
            inntektstype: 'ARBEIDSTAKER_INNTEKTSMELDING',
            omregnetÅrsinntekt: 400000, // TODO: Hent ekte inntektsmelding data
            sporing: 'BEREGNINGSSPORINGVERDI',
            inntektsmeldingId: data.inntektsmeldingId,
        }
    }

    throw new Error('Ukjent arbeidstaker inntekt type')
}

function genererSelvstendigNæringsdrivendeInntektData(data: PensjonsgivendeInntektRequest): InntektData {
    if (data.type === 'SKJONNSFASTSETTELSE') {
        return {
            inntektstype: 'SELVSTENDIG_NÆRINGSDRIVENDE_SKJØNNSFASTSATT',
            omregnetÅrsinntekt: data.årsinntekt,
            sporing: 'BEREGNINGSSPORINGVERDI',
        }
    }
    /*

        aar: z.number(),
    rapportertinntekt: z.number(),
    inntektGrunnbelopsbegrenset: z.number(),
    grunnbeløpAar: z.number(),
    grunnbeløp: z.number(),
     */

    /**
     * { beløp: 124028, gyldigFra: '2024-05-01', virkningsdato: '2024-05-01', gyldigMinsteinntektKrav: '2024-06-03' },
     *     { beløp: 118620, gyldigFra: '2023-05-01', virkningsdato: '2023-05-01', gyldigMinsteinntektKrav: '2023-05-29' },
     *     { beløp: 111477, gyldigFra: '2022-0
     */

    if (data.type === 'PENSJONSGIVENDE_INNTEKT') {
        return {
            inntektstype: 'SELVSTENDIG_NÆRINGSDRIVENDE_PENSJONSGIVENDE',
            omregnetÅrsinntekt: 755568, // TODO: Hent ekte pensjonsgivende inntekt data
            sporing: 'BEREGNINGSSPORINGVERDI',
            pensjonsgivendeInntekt: {
                inntektAar: [{
                    aar: 2024,
                    rapportertinntekt: 2000000, // langt over 12 G
                    inntektGrunnbelopsbegrenset: 992224,
                    grunnbeløpAar: 2024,
                    grunnbeløp: 124028,
                },{
                    aar: 2023,
                    rapportertinntekt: 900000,
                    inntektGrunnbelopsbegrenset: 774480,
                    grunnbeløpAar: 2024,
                    grunnbeløp: 118620,
                },{
                    aar: 2022,
                    rapportertinntekt: 500000,
                    inntektGrunnbelopsbegrenset: 500000,
                    grunnbeløpAar: 2024,
                    grunnbeløp: 111477,
                }],
            },
        }
    }

    throw new Error('Ukjent selvstendig næringsdrivende inntekt type')
}

function genererInaktivInntektData(data: PensjonsgivendeInntektRequest): InntektData {
    if (data.type === 'SKJONNSFASTSETTELSE') {
        return {
            inntektstype: 'INAKTIV_SKJØNNSFASTSATT',
            omregnetÅrsinntekt: data.årsinntekt,
            sporing: 'BEREGNINGSSPORINGVERDI',
        }
    }

    if (data.type === 'PENSJONSGIVENDE_INNTEKT') {
        return {
            inntektstype: 'INAKTIV_PENSJONSGIVENDE',
            omregnetÅrsinntekt: 400000, // TODO: Hent ekte pensjonsgivende inntekt data
            sporing: 'BEREGNINGSSPORINGVERDI',
            pensjonsgivendeInntekt: {
                inntektAar: [], // TODO: Hent ekte data
            },
        }
    }

    throw new Error('Ukjent inaktiv inntekt type')
}

function genererFrilanserInntektData(data: FrilanserInntektRequest): InntektData {
    if (data.type === 'SKJONNSFASTSETTELSE') {
        return {
            inntektstype: 'FRILANSER_SKJØNNSFASTSATT',
            omregnetÅrsinntekt: data.månedsbeløp * 12,
            sporing: 'BEREGNINGSSPORINGVERDI',
        }
    }

    if (data.type === 'AINNTEKT') {
        return {
            inntektstype: 'FRILANSER_AINNTEKT',
            omregnetÅrsinntekt: 400000, // TODO: Hent ekte A-inntekt data
            sporing: 'A-inntekt TODO',
        }
    }

    throw new Error('Ukjent frilanser inntekt type')
}

function genererArbeidsledigInntektData(data: ArbeidsledigInntektRequest): InntektData {
    let omregnetÅrsinntekt: number

    switch (data.type) {
        case 'DAGPENGER':
            // Dagpenger: dagbeløp * 260 arbeidsdager per år
            omregnetÅrsinntekt = data.dagbeløp * 260
            break
        case 'VENTELONN':
        case 'VARTPENGER':
            // Ventelønn og vartpenger: månedsbeløp * 12 måneder
            omregnetÅrsinntekt = data.månedsbeløp * 12
            break
        default:
            throw new Error('Ukjent arbeidsledig inntekt type')
    }

    return {
        inntektstype: 'ARBEIDSLEDIG',
        omregnetÅrsinntekt,
        sporing: 'BEREGNINGSSPORINGVERDI',
    }
}

export async function triggerUtbetalingsberegning(person: Person, saksbehandlingsperiodeId: string) {
    // TODO flytt til egen fil
    const yrkesaktivitet = person.yrkesaktivitet?.[saksbehandlingsperiodeId]
    const saksbehandlingsperiode = person.saksbehandlingsperioder?.find((p) => p.id === saksbehandlingsperiodeId)
    if (!yrkesaktivitet || yrkesaktivitet.length === 0 || !saksbehandlingsperiode) {
        return
    }

    const sykepengegrunnlag = beregnSykepengegrunnlagV2(yrkesaktivitet, saksbehandlingsperiode.skjæringstidspunkt!)
    if (!sykepengegrunnlag) {
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
