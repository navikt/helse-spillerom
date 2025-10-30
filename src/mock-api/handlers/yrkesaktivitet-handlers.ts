import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '@navikt/next-logger'

import { Person } from '@/mock-api/session'
import { Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { Dag } from '@/schemas/dagoversikt'
import {
    InntektRequest,
    ArbeidstakerInntektRequest,
    PensjonsgivendeInntektRequest,
    FrilanserInntektRequest,
    ArbeidsledigInntektRequest,
    ArbeidstakerSkjønnsfastsettelseÅrsak,
} from '@/schemas/inntektRequest'
import { InntektData } from '@/schemas/inntektData'
import { genererDagoversikt } from '@/mock-api/utils/dagoversikt-generator'
import { kallBakrommetUtbetalingsberegning } from '@/mock-api/utils/bakrommet-client'
import { UtbetalingsberegningInput } from '@/schemas/utbetalingsberegning'
import { beregnSykepengegrunnlagV2 } from '@/mock-api/handlers/sykepengegrunnlagV2-handlers'
import { mockInntektsmeldinger } from '@/mock-api/handlers/inntektsmeldinger'
import { YrkesaktivitetKategorisering } from '@/schemas/yrkesaktivitetKategorisering'

function skalHaDagoversikt(kategorisering: YrkesaktivitetKategorisering): boolean {
    return kategorisering.sykmeldt === true
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

    try {
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
    } catch (error) {
        if (error instanceof Error && error.message.includes('ikke funnet')) {
            return NextResponse.json({ message: error.message }, { status: 400 })
        }
        throw error
    }
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
        function sporingsverdi(data: ArbeidstakerSkjønnsfastsettelseÅrsak): string {
            switch (data) {
                case 'AVVIK_25_PROSENT':
                    return 'ARBEIDSTAKER_SYKEPENGEGRUNNLAG_SKJOENN_AVVIK'
                case 'MANGELFULL_RAPPORTERING':
                    return 'ARBEIDSTAKER_SYKEPENGEGRUNNLAG_SKJOENN_URIKTIG'
                case 'TIDSAVGRENSET':
                    return 'ARBEIDSTAKER_SYKEPENGEGRUNNLAG_TIDSBEGRENSET_FOER_SLUTTDATO'
            }
            throw Error('Ukjent årsak for skjønnsfastsettelse')
        }

        return {
            inntektstype: 'ARBEIDSTAKER_SKJØNNSFASTSATT',
            omregnetÅrsinntekt: data.årsinntekt,
            sporing: sporingsverdi(data.årsak),
        }
    }

    if (data.type === 'MANUELT_BEREGNET') {
        return {
            inntektstype: 'ARBEIDSTAKER_MANUELT_BEREGNET',
            omregnetÅrsinntekt: data.årsinntekt,
            sporing: 'ARBEIDSTAKER_SYKEPENGEGRUNNLAG_HOVEDREGEL',
        }
    }

    if (data.type === 'AINNTEKT') {
        return {
            inntektstype: 'ARBEIDSTAKER_AINNTEKT',
            omregnetÅrsinntekt: 400000,
            sporing: 'ARBEIDSTAKER_SYKEPENGEGRUNNLAG_HOVEDREGEL',
            kildedata: {
                '2024-01': 30000,
                '2024-02': 30000,
                '2024-03': 30000,
            },
        }
    }

    if (data.type === 'INNTEKTSMELDING') {
        const inntektsmeldingId = data.inntektsmeldingId
        if (!inntektsmeldingId) {
            throw new Error('InntektsmeldingId er påkrevd for INNTEKTSMELDING type')
        }

        const inntektsmelding = mockInntektsmeldinger.find((im) => im.inntektsmeldingId === inntektsmeldingId)
        if (!inntektsmelding) {
            throw new Error(`Inntektsmelding med ID ${inntektsmeldingId} ikke funnet`)
        }

        return {
            inntektstype: 'ARBEIDSTAKER_INNTEKTSMELDING',
            omregnetÅrsinntekt: parseFloat(inntektsmelding.beregnetInntekt || '0') * 12,
            sporing: 'ARBEIDSTAKER_SYKEPENGEGRUNNLAG_HOVEDREGEL',
            inntektsmelding: inntektsmelding,
            inntektsmeldingId: inntektsmeldingId,
        }
    }

    throw new Error('Ukjent arbeidstaker inntekt type')
}

function genererSelvstendigNæringsdrivendeInntektData(data: PensjonsgivendeInntektRequest): InntektData {
    if (data.type === 'SKJONNSFASTSETTELSE') {
        return {
            inntektstype: 'SELVSTENDIG_NÆRINGSDRIVENDE_SKJØNNSFASTSATT',
            omregnetÅrsinntekt: data.årsinntekt,
            sporing: 'SELVSTENDIG_SYKEPENGEGRUNNLAG_SKJOENN_VARIG_ENDRING',
        }
    }
    if (data.type === 'PENSJONSGIVENDE_INNTEKT') {
        return {
            inntektstype: 'SELVSTENDIG_NÆRINGSDRIVENDE_PENSJONSGIVENDE',
            omregnetÅrsinntekt: 795568, // TODO: Hent ekte pensjonsgivende inntekt data
            sporing: 'SELVSTENDIG_SYKEPENGEGRUNNLAG_HOVEDREGEL',
            pensjonsgivendeInntekt: {
                omregnetÅrsinntekt: 795568,
                pensjonsgivendeInntekt: [
                    {
                        år: '2024',
                        rapportertinntekt: 2000000, // langt over 12 G
                        justertÅrsgrunnlag: 992224,
                        antallGKompensert: 8.0,
                        snittG: 124028,
                    },
                    {
                        år: '2023',
                        rapportertinntekt: 900000,
                        justertÅrsgrunnlag: 774480,
                        antallGKompensert: 6.5,
                        snittG: 118620,
                    },
                    {
                        år: '2022',
                        rapportertinntekt: 620000,
                        justertÅrsgrunnlag: 620000,
                        antallGKompensert: 5.6,
                        snittG: 111477,
                    },
                ],
                anvendtGrunnbeløp: 124028,
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
            sporing: 'INAKTIV_SYKEPENGEGRUNNLAG_SKJOENN_VARIG_ENDRING',
        }
    }

    if (data.type === 'PENSJONSGIVENDE_INNTEKT') {
        return {
            inntektstype: 'INAKTIV_PENSJONSGIVENDE',
            omregnetÅrsinntekt: 795568, // TODO: Hent ekte pensjonsgivende inntekt data
            sporing: 'INAKTIV_SYKEPENGEGRUNNLAG_HOVEDREGEL',
            pensjonsgivendeInntekt: {
                omregnetÅrsinntekt: 795568,
                pensjonsgivendeInntekt: [
                    {
                        år: '2024',
                        rapportertinntekt: 2000000, // langt over 12 G
                        justertÅrsgrunnlag: 992224,
                        antallGKompensert: 8.0,
                        snittG: 124028,
                    },
                    {
                        år: '2023',
                        rapportertinntekt: 900000,
                        justertÅrsgrunnlag: 774480,
                        antallGKompensert: 6.5,
                        snittG: 118620,
                    },
                    {
                        år: '2022',
                        rapportertinntekt: 620000,
                        justertÅrsgrunnlag: 620000,
                        antallGKompensert: 5.6,
                        snittG: 111477,
                    },
                ],
                anvendtGrunnbeløp: 124028,
            },
        }
    }

    throw new Error('Ukjent inaktiv inntekt type')
}

function genererFrilanserInntektData(data: FrilanserInntektRequest): InntektData {
    if (data.type === 'SKJONNSFASTSETTELSE') {
        return {
            inntektstype: 'FRILANSER_SKJØNNSFASTSATT',
            omregnetÅrsinntekt: data.årsinntekt,
            sporing: 'FRILANSER_SYKEPENGEGRUNNLAG_SKJOENN_AVVIK',
        }
    }

    if (data.type === 'AINNTEKT') {
        return {
            inntektstype: 'FRILANSER_AINNTEKT',
            omregnetÅrsinntekt: 400000, // TODO: Hent ekte A-inntekt data
            sporing: 'FRILANSER_SYKEPENGEGRUNNLAG_HOVEDREGEL',
            kildedata: {
                '2024-01': 30000,
                '2024-02': 30000,
                '2024-03': 30000,
            },
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
            omregnetÅrsinntekt = data.årsinntekt
            break
        default:
            throw new Error('Ukjent arbeidsledig inntekt type')
    }

    return {
        inntektstype: 'ARBEIDSLEDIG',
        omregnetÅrsinntekt,
        sporing: 'DAGPENGEMOTTAKER_SYKEPENGEGRUNNLAG',
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

    // hvis ikke alle yrkesaktiviteter har inntektData, kan vi ikke beregne
    const harFullInnntektsdata = yrkesaktivitet.every((ya) => ya.inntektData != null)
    if (!harFullInnntektsdata) {
        logger.info('Har ikke full inntektsdata')
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
