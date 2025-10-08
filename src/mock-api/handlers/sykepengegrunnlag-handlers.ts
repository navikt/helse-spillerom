import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { Person } from '@/mock-api/session'
import {
    Inntekt,
    InntektBeregnet,
    Inntektskilde,
    SykepengegrunnlagRequest,
    SykepengegrunnlagResponse,
} from '@/schemas/sykepengegrunnlag'
import { beregn1GØre, beregn6GØre, finnGrunnbeløpVirkningstidspunkt } from '@/utils/grunnbelop'
import { kallBakrommetUtbetalingsberegning } from '@/mock-api/utils/bakrommet-client'
import { UtbetalingsberegningInput } from '@/schemas/utbetalingsberegning'
import { Yrkesaktivitet } from '@schemas/yrkesaktivitet'

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

    // Hent yrkesaktivitet for denne perioden
    const yrkesaktivitet = person.yrkesaktivitet?.[uuid] || []
    if (yrkesaktivitet.length === 0) {
        return NextResponse.json({ message: 'Ingen yrkesaktivitet funnet for denne perioden' }, { status: 400 })
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

            // Hopp over refusjon som ikke har noen data (tomme felter)
            if (!refusjon.fom && (!refusjon.tom || refusjon.tom === '') && refusjon.beløpØre === 0) {
                continue
            }

            // fom må alltid være satt
            if (!refusjon.fom) {
                return NextResponse.json(
                    { message: `Fra-dato må være fylt ut (inntekt ${i}, refusjon ${j})` },
                    { status: 400 },
                )
            }

            if (refusjon.beløpØre < 0) {
                return NextResponse.json(
                    { message: `Refusjonsbeløp kan ikke være negativt (inntekt ${i}, refusjon ${j})` },
                    { status: 400 },
                )
            }

            // Valider at fom-dato er gyldig
            const fomDate = new Date(refusjon.fom)
            if (isNaN(fomDate.getTime())) {
                return NextResponse.json(
                    { message: `Ugyldig fra-dato format (inntekt ${i}, refusjon ${j})` },
                    { status: 400 },
                )
            }

            // Valider tom-dato kun hvis den er satt og ikke tom streng
            if (refusjon.tom && refusjon.tom !== '') {
                const tomDate = new Date(refusjon.tom)
                if (isNaN(tomDate.getTime())) {
                    return NextResponse.json(
                        { message: `Ugyldig til-dato format (inntekt ${i}, refusjon ${j})` },
                        { status: 400 },
                    )
                }

                if (fomDate > tomDate) {
                    return NextResponse.json(
                        { message: `Fra-dato kan ikke være etter til-dato (inntekt ${i}, refusjon ${j})` },
                        { status: 400 },
                    )
                }
            }
        }
    }

    // Beregn sykepengegrunnlag med avansert logikk
    const grunnlag = beregnSykepengegrunnlag(
        uuid,
        body.inntekter,
        body.begrunnelse,
        periode.skjæringstidspunkt,
        yrkesaktivitet,
    )

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
    yrkesaktivitet: Yrkesaktivitet[],
): SykepengegrunnlagResponse {
    // Hent gjeldende grunnbeløp basert på skjæringstidspunkt
    const seksGØre = beregn6GØre(skjæringstidspunkt)
    const grunnbeløpØre = beregn1GØre(skjæringstidspunkt)

    // Hent virkningstidspunktet for grunnbeløpet som ble brukt
    const grunnbeløpVirkningstidspunkt = finnGrunnbeløpVirkningstidspunkt(skjæringstidspunkt)

    // Summer opp alle inntekter som kommer fra arbeidstaker ved å se om yrkesaktivteten er arbeidstaker
    const sumAvArbeidstakerInntekterØre = inntekter
        .filter((inntekt) => {
            const yrkesaktivitetForInntekt = yrkesaktivitet.find((ya) => ya.id === inntekt.yrkesaktivitetId)
            return yrkesaktivitetForInntekt?.kategorisering?.['INNTEKTSKATEGORI'] === 'ARBEIDSTAKER'
        })
        .reduce((sum, inntekt) => sum + inntekt.beløpPerMånedØre, 0)

    // Beregn inntekter med grunnlag basert på yrkesaktivitet kategorisering
    const inntekterBeregnet: InntektBeregnet[] = inntekter.map((inntekt) => {
        const yrkesaktivitetForInntekt = yrkesaktivitet.find((ya) => ya.id === inntekt.yrkesaktivitetId)
        const erSelvstendigNæringsdrivende =
            yrkesaktivitetForInntekt?.kategorisering?.['INNTEKTSKATEGORI'] === 'SELVSTENDIG_NÆRINGSDRIVENDE'

        let grunnlagMånedligØre = inntekt.beløpPerMånedØre

        if (erSelvstendigNæringsdrivende) {
            // For selvstendig næringsdrivende: pensjonsgivende inntekt er begrenset til 6G minus arbeidstakerinntekter
            const pensjonsgivendeCappet6g = Math.min(inntekt.beløpPerMånedØre, seksGØre)
            const næringsinntekt = pensjonsgivendeCappet6g - sumAvArbeidstakerInntekterØre
            grunnlagMånedligØre = Math.max(næringsinntekt, 0)
        }

        return {
            yrkesaktivitetId: inntekt.yrkesaktivitetId,
            inntektMånedligØre: inntekt.beløpPerMånedØre,
            grunnlagMånedligØre,
            kilde: inntekt.kilde,
            refusjon: inntekt.refusjon,
        }
    })

    // Summer opp alle månedlige inntekter og konverter til årsinntekt (i øre)
    const totalInntektØre = inntekterBeregnet.reduce((sum, inntekt) => sum + inntekt.grunnlagMånedligØre, 0) * 12

    // Begrens til 6G
    const begrensetTil6G = totalInntektØre > seksGØre
    const sykepengegrunnlagØre = begrensetTil6G ? seksGØre : totalInntektØre

    const now = new Date().toISOString()

    return {
        id: uuidv4(),
        saksbehandlingsperiodeId,
        inntekter: inntekterBeregnet,
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

export async function triggerUtbetalingsberegning(person: Person, saksbehandlingsperiodeId: string) {
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
