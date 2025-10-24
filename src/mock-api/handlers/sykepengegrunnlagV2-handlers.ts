import { NextResponse } from 'next/server'

import { Person } from '@/mock-api/session'
import {
    Næringsdel,
    SykepengegrunnlagV2,
    SykepengegrunnlagResponse,
    Sammenlikningsgrunnlag,
} from '@/schemas/sykepengegrunnlagV2'
import { beregn6G, beregnGrunnbeløp, finnGrunnbeløpVirkningstidspunkt } from '@/utils/grunnbelop'
import { Yrkesaktivitet } from '@/schemas/yrkesaktivitet'

export async function handleGetSykepengegrunnlagV2(person: Person | undefined, uuid: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    // Hent saksbehandlingsperiode
    const periode = person.saksbehandlingsperioder?.find((p) => p.id === uuid)
    if (!periode) {
        return NextResponse.json({ message: 'Saksbehandlingsperiode not found' }, { status: 404 })
    }

    // Hent yrkesaktiviteter for perioden
    const yrkesaktiviteter = person.yrkesaktivitet?.[uuid] || []
    if (yrkesaktiviteter.length === 0) {
        return NextResponse.json(null, { status: 200 })
    }

    // Sjekk om alle yrkesaktiviteter har inntektData
    const harFullInnntektsdata = yrkesaktiviteter.every((ya) => ya.inntektData != null)
    if (!harFullInnntektsdata) {
        return NextResponse.json(null, { status: 200 })
    }

    // Beregn sykepengegrunnlag v2
    const sykepengegrunnlag = beregnSykepengegrunnlagV2(yrkesaktiviteter, periode.skjæringstidspunkt!)

    // Generer mock sammenlikningsgrunnlag
    const sammenlikningsgrunnlag = sykepengegrunnlag ? genererMockSammenlikningsgrunnlag(sykepengegrunnlag) : null

    const response: SykepengegrunnlagResponse = {
        sykepengegrunnlag,
        sammenlikningsgrunnlag,
    }

    return NextResponse.json(response)
}

export function beregnSykepengegrunnlagV2(
    yrkesaktiviteter: Yrkesaktivitet[],
    skjæringstidspunkt: string,
): SykepengegrunnlagV2 | null {
    const grunnbeløp = beregnGrunnbeløp(skjæringstidspunkt, 1.0)
    const grunnbeløp6G = beregn6G(skjæringstidspunkt)
    const grunnbeløpVirkningstidspunkt = finnGrunnbeløpVirkningstidspunkt(skjæringstidspunkt)

    // Finn selvstendig næringsdrivende yrkesaktivitet
    const næringsdrivende = yrkesaktiviteter.find(
        (ya) => ya.kategorisering?.['INNTEKTSKATEGORI'] === 'SELVSTENDIG_NÆRINGSDRIVENDE',
    )

    const kombinert = næringsdrivende != null && yrkesaktiviteter.length > 1
    const renNæringsdrivende = næringsdrivende != null && yrkesaktiviteter.length === 1

    let næringsdel: Næringsdel | null = null

    if (kombinert && næringsdrivende?.inntektData) {
        const pensjonsgivendeÅrsinntekt = næringsdrivende.inntektData.omregnetÅrsinntekt
        const pensjonsgivendeÅrsinntekt6GBegrenset = Math.min(pensjonsgivendeÅrsinntekt, grunnbeløp6G)
        const pensjonsgivendeÅrsinntektBegrensetTil6G = pensjonsgivendeÅrsinntekt > grunnbeløp6G

        // Summer arbeidsinntekt fra andre yrkesaktiviteter
        const andreYrkesaktiviteter = yrkesaktiviteter.filter((ya) => ya.id !== næringsdrivende!.id)
        const sumAvArbeidsinntekt = andreYrkesaktiviteter.reduce(
            (sum, ya) => sum + (ya.inntektData?.omregnetÅrsinntekt || 0),
            0,
        )

        // Beregn næringsdel: pensjonsgivende inntekt 6G begrenset minus arbeidsinntekt
        const næringsdelBeløp = Math.max(pensjonsgivendeÅrsinntekt6GBegrenset - sumAvArbeidsinntekt, 0)

        næringsdel = {
            pensjonsgivendeÅrsinntekt,
            pensjonsgivendeÅrsinntekt6GBegrenset,
            pensjonsgivendeÅrsinntektBegrensetTil6G,
            næringsdel: næringsdelBeløp,
            sumAvArbeidsinntekt,
        }
    }

    // Beregn totalt inntektsgrunnlag
    let totaltInntektsgrunnlag: number

    if (renNæringsdrivende && næringsdrivende?.inntektData) {
        totaltInntektsgrunnlag = næringsdrivende.inntektData.omregnetÅrsinntekt
    } else if (kombinert && næringsdel) {
        // For kombinert: arbeidsinntekt + næringsdel
        const arbeidsinntekt = yrkesaktiviteter
            .filter((ya) => ya.kategorisering?.['INNTEKTSKATEGORI'] !== 'SELVSTENDIG_NÆRINGSDRIVENDE')
            .reduce((sum, ya) => sum + (ya.inntektData?.omregnetÅrsinntekt || 0), 0)
        totaltInntektsgrunnlag = arbeidsinntekt + næringsdel.næringsdel
    } else {
        // For andre tilfeller: sum av alle inntekter
        totaltInntektsgrunnlag = yrkesaktiviteter.reduce(
            (sum, ya) => sum + (ya.inntektData?.omregnetÅrsinntekt || 0),
            0,
        )
    }

    // Begrens til 6G
    const sykepengegrunnlag = Math.min(totaltInntektsgrunnlag, grunnbeløp6G)
    const begrensetTil6G = totaltInntektsgrunnlag > grunnbeløp6G

    return {
        grunnbeløp: grunnbeløp,
        totaltInntektsgrunnlag,
        sykepengegrunnlag,
        seksG: grunnbeløp6G,
        begrensetTil6G,
        grunnbeløpVirkningstidspunkt,
        næringsdel,
    }
}

function genererMockSammenlikningsgrunnlag(sykepengegrunnlag: SykepengegrunnlagV2): Sammenlikningsgrunnlag {
    // Generer et sammenlikningsgrunnlag som er litt annerledes enn sykepengegrunnlaget
    const variasjon = 0.05 // 5% variasjon
    const sammenlikningsgrunnlag = Math.round(
        sykepengegrunnlag.totaltInntektsgrunnlag * (1 + (Math.random() - 0.5) * variasjon),
    )

    const avvik = sammenlikningsgrunnlag - sykepengegrunnlag.totaltInntektsgrunnlag
    const avvikProsent =
        sykepengegrunnlag.totaltInntektsgrunnlag > 0
            ? (Math.abs(avvik) / sykepengegrunnlag.totaltInntektsgrunnlag) * 100
            : 0

    return {
        totaltSammenlikningsgrunnlag: sammenlikningsgrunnlag,
        avvikProsent: Math.round(avvikProsent * 100) / 100, // Rund til 2 desimaler
        avvikMotInntektsgrunnlag: avvik,
        basertPåDokumentId: crypto.randomUUID(),
    }
}
