import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { Person } from '@/mock-api/session'
import { SykepengegrunnlagRequest, SykepengegrunnlagResponse, Inntekt } from '@/schemas/sykepengegrunnlag'

// Grunnbeløp for 2024: 124028 kroner = 12402800 øre
// 6G for 2024: 6 * 12402800 øre = 74416800 øre (744168 kroner)
const GRUNNBELØP_2024_ØRE = 12402800 // 124028 kr * 100
const SEKS_G_ØRE = GRUNNBELØP_2024_ØRE * 6 // 74416800 øre

export async function handleGetSykepengegrunnlag(person: Person | undefined, uuid: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    if (!person.sykepengegrunnlag) {
        person.sykepengegrunnlag = {}
    }

    const grunnlag = person.sykepengegrunnlag[uuid]
    if (!grunnlag) {
        return NextResponse.json({ message: 'Ingen sykepengegrunnlag funnet for periode' }, { status: 404 })
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

    // Valider inntekter
    for (let i = 0; i < body.inntekter.length; i++) {
        const inntekt = body.inntekter[i]
        if (inntekt.beløpPerMånedØre < 0) {
            return NextResponse.json(
                { message: `Beløp per måned kan ikke være negativt (inntekt ${i})` },
                { status: 400 },
            )
        }

        // Skjønnsfastsettelse er automatisk basert på kilde
        if (inntekt.kilde === 'SKJONNSFASTSETTELSE' && !body.begrunnelse?.trim()) {
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

    // Beregn sykepengegrunnlag
    const grunnlag = beregnSykepengegrunnlag(uuid, body.inntekter, body.begrunnelse)

    // Lagre i session
    if (!person.sykepengegrunnlag) {
        person.sykepengegrunnlag = {}
    }
    person.sykepengegrunnlag[uuid] = grunnlag

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
    return new NextResponse(null, { status: 204 })
}

function beregnSykepengegrunnlag(
    saksbehandlingsperiodeId: string,
    inntekter: Inntekt[],
    begrunnelse?: string,
): SykepengegrunnlagResponse {
    // Summer opp alle månedlige inntekter og konverter til årsinntekt (i øre)
    const totalInntektØre = inntekter.reduce((sum, inntekt) => sum + inntekt.beløpPerMånedØre, 0) * 12

    // Begrens til 6G
    const begrensetTil6G = totalInntektØre > SEKS_G_ØRE
    const sykepengegrunnlagØre = begrensetTil6G ? SEKS_G_ØRE : totalInntektØre

    const now = new Date().toISOString()

    return {
        id: uuidv4(),
        saksbehandlingsperiodeId,
        inntekter,
        totalInntektØre,
        grunnbeløp6GØre: SEKS_G_ØRE,
        begrensetTil6G,
        sykepengegrunnlagØre,
        begrunnelse,
        opprettet: now,
        opprettetAv: 'Saks McBehandlersen',
        sistOppdatert: now,
    }
}
