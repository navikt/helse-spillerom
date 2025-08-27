import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { Person } from '@/mock-api/session'
import {
    SykepengegrunnlagRequest,
    SykepengegrunnlagResponse,
    Inntekt,
    Inntektskilde,
} from '@/schemas/sykepengegrunnlag'
import { beregn6GØre, beregn1GØre, finnGrunnbeløpVirkningstidspunkt } from '@/utils/grunnbelop'
import { kallBakrommetUtbetalingsberegning } from '@/mock-api/utils/bakrommet-client'
import { UtbetalingsberegningInput } from '@/schemas/utbetalingsberegning'

export async function handleGetSykepengegrunnlag(person: Person | undefined, uuid: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    if (!person.sykepengegrunnlag) {
        person.sykepengegrunnlag = {}
    }

    const grunnlag = person.sykepengegrunnlag[uuid]
    if (!grunnlag) {
        return NextResponse.json(null, { status: 200 })
    }

    return NextResponse.json(grunnlag)
}

export async function handlePutSykepengegrunnlag(
    request: Request,
    person: Person | undefined,
    uuid: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const body: SykepengegrunnlagRequest = await request.json()

    // Valider request
    if (!body.inntekter || body.inntekter.length === 0) {
        return NextResponse.json({ message: 'Må ha minst én inntekt' }, { status: 400 })
    }

    // Hent saksbehandlingsperiode for å få skjæringstidspunkt
    const periode = person.saksbehandlingsperioder?.find((p) => p.id === uuid)
    if (!periode) {
        return NextResponse.json({ message: 'Saksbehandlingsperiode not found' }, { status: 404 })
    }

    if (!periode.skjæringstidspunkt) {
        return NextResponse.json({ message: 'Periode mangler skjæringstidspunkt' }, { status: 400 })
    }

    // Valider inntekter
    for (let i = 0; i < body.inntekter.length; i++) {
        const inntekt = body.inntekter[i]
        if (inntekt.beløpPerMånedØre < 0) {
            return NextResponse.json(
                { message: `Beløp per måned kan ikke være negativt (inntekt ${i})` },
                { status: 400 },
            )
        }

        // Valider at kilde er en gyldig enum verdi
        const gyldigeKilder: Inntektskilde[] = [
            'AINNTEKT',
            'INNTEKTSMELDING',
            'PENSJONSGIVENDE_INNTEKT',
            'SAKSBEHANDLER',
            'SKJONNSFASTSETTELSE',
        ]
        if (!gyldigeKilder.includes(inntekt.kilde)) {
            return NextResponse.json({ message: `Ugyldig kilde: ${inntekt.kilde} (inntekt ${i})` }, { status: 400 })
        }

        // Skjønnsfastsettelse er automatisk basert på kilde
        if (inntekt.kilde === 'SKJONNSFASTSETTELSE' && (!body.begrunnelse || !body.begrunnelse.trim())) {
            return NextResponse.json({ message: 'Skjønnsfastsettelse krever begrunnelse' }, { status: 400 })
        }

        for (let j = 0; j < (inntekt.refusjon || []).length; j++) {
            const refusjon = inntekt.refusjon![j]
            if (refusjon.beløpØre < 0) {
                return NextResponse.json(
                    { message: `Refusjonsbeløp kan ikke være negativt (inntekt ${i}, refusjon ${j})` },
                    { status: 400 },
                )
            }
            if (new Date(refusjon.fom) > new Date(refusjon.tom)) {
                return NextResponse.json(
                    { message: `Fra-dato kan ikke være etter til-dato (inntekt ${i}, refusjon ${j})` },
                    { status: 400 },
                )
            }
        }
    }

    // Beregn sykepengegrunnlag med avansert logikk
    const grunnlag = beregnSykepengegrunnlag(uuid, body.inntekter, body.begrunnelse, periode.skjæringstidspunkt)

    // Lagre i session
    if (!person.sykepengegrunnlag) {
        person.sykepengegrunnlag = {}
    }
    person.sykepengegrunnlag[uuid] = grunnlag

    // Kall bakrommet for å beregne utbetalinger
    await triggerUtbetalingsberegning(person, uuid)

    return NextResponse.json(grunnlag)
}

export async function handleDeleteSykepengegrunnlag(person: Person | undefined, uuid: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    if (!person.sykepengegrunnlag?.[uuid]) {
        return NextResponse.json({ message: 'Sykepengegrunnlag not found' }, { status: 404 })
    }

    delete person.sykepengegrunnlag[uuid]

    // Slett utbetalingsberegning når sykepengegrunnlag slettes
    if (person.utbetalingsberegning && person.utbetalingsberegning[uuid]) {
        delete person.utbetalingsberegning[uuid]
    }

    return new NextResponse(null, { status: 204 })
}

function beregnSykepengegrunnlag(
    saksbehandlingsperiodeId: string,
    inntekter: Inntekt[],
    begrunnelse: string | null | undefined,
    skjæringstidspunkt: string,
): SykepengegrunnlagResponse {
    // Hent gjeldende grunnbeløp basert på skjæringstidspunkt
    const seksGØre = beregn6GØre(skjæringstidspunkt)
    const grunnbeløpØre = beregn1GØre(skjæringstidspunkt)

    // Hent virkningstidspunktet for grunnbeløpet som ble brukt
    const grunnbeløpVirkningstidspunkt = finnGrunnbeløpVirkningstidspunkt(skjæringstidspunkt)

    // Summer opp alle månedlige inntekter og konverter til årsinntekt (i øre)
    const totalInntektØre = inntekter.reduce((sum, inntekt) => sum + inntekt.beløpPerMånedØre, 0) * 12

    // Begrens til 6G
    const begrensetTil6G = totalInntektØre > seksGØre
    const sykepengegrunnlagØre = begrensetTil6G ? seksGØre : totalInntektØre

    const now = new Date().toISOString()

    return {
        id: uuidv4(),
        saksbehandlingsperiodeId,
        inntekter,
        totalInntektØre,
        grunnbeløpØre,
        grunnbeløp6GØre: seksGØre,
        begrensetTil6G,
        sykepengegrunnlagØre,
        begrunnelse,
        grunnbeløpVirkningstidspunkt,
        opprettet: now,
        opprettetAv: 'Saks McBehandlersen',
        sistOppdatert: now,
    }
}

async function triggerUtbetalingsberegning(person: Person, saksbehandlingsperiodeId: string) {
    const sykepengegrunnlag = person.sykepengegrunnlag?.[saksbehandlingsperiodeId]
    const yrkesaktivitet = person.yrkesaktivitet?.[saksbehandlingsperiodeId]

    if (!sykepengegrunnlag || !yrkesaktivitet || yrkesaktivitet.length === 0) {
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
    }

    const beregningData = await kallBakrommetUtbetalingsberegning(input)
    if (beregningData) {
        if (!person.utbetalingsberegning) {
            person.utbetalingsberegning = {}
        }
        person.utbetalingsberegning[saksbehandlingsperiodeId] = beregningData
    }
}
