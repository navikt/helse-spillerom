import { NextResponse } from 'next/server'

import { beskyttetApi, ErrorResponse } from '@/auth/beskyttetApi'
import { erLokal } from '@/env'
import { BeregningsreglerArray } from '@schemas/beregningsregler'

export async function GET(request: Request): Promise<NextResponse<BeregningsreglerArray | ErrorResponse>> {
    return await beskyttetApi<BeregningsreglerArray | ErrorResponse>(
        request,
        async (): Promise<NextResponse<BeregningsreglerArray | ErrorResponse>> => {
            if (!erLokal) {
                try {
                    const response = await fetch(
                        'https://sp-kodeverk.ekstern.dev.nav.no/api/v2/open/beregningsregler',
                        {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                            },
                            cache: 'no-cache',
                        },
                    )

                    if (!response.ok) {
                        return NextResponse.json(
                            { message: `Kunne ikke hente beregningsregler (${response.status})` },
                            { status: response.status },
                        )
                    }

                    const data: BeregningsreglerArray = await response.json()
                    return NextResponse.json(data)
                } catch (error) {
                    return NextResponse.json(
                        { message: 'Feil ved henting av beregningsregler fra ekstern tjeneste' },
                        { status: 500 },
                    )
                }
            }

            // For lokal utvikling, returner tom struktur
            return Promise.resolve(
                NextResponse.json([
                    {
                        kode: 'ARBEIDSTAKER_100',
                        beskrivelse: 'Til arbeidstakere ytes det sykepenger med 100 prosent av sykepengegrunnlaget',
                        vilkårshjemmel: {
                            lovverk: 'Folketrygdloven',
                            lovverksversjon: '1997-05-01',
                            kapittel: '8',
                            paragraf: '16',
                            ledd: '1',
                            setning: undefined,
                            bokstav: undefined,
                        },
                    },
                    {
                        kode: 'ORDINAER_SELVSTENDIG_80',
                        beskrivelse:
                            'Til en selvstendig næringsdrivende ytes det sykepenger med 80 prosent av sykepengegrunnlaget',
                        vilkårshjemmel: {
                            lovverk: 'Folketrygdloven',
                            lovverksversjon: '1997-05-01',
                            kapittel: '8',
                            paragraf: '35',
                            ledd: '1',
                            setning: undefined,
                            bokstav: undefined,
                        },
                        sistEndretAv: 'Andersen, Håvard Stigen',
                        sistEndretDato: '2025-09-18T12:12:36.386Z',
                    },
                    {
                        kode: 'ORDINAER_SELVSTENDIG_NAVFORSIKRING_100',
                        beskrivelse:
                            'En selvstendig næringsdrivende kan mot særskilt premie tegne forsikring som kan omfatte sykepenger med 100 prosent av sykepengegrunnlaget fra 17. sykedag eller sykepenger med 100 prosent av sykepengegrunnlaget fra første sykedag',
                        vilkårshjemmel: {
                            lovverk: 'Folketrygdloven',
                            lovverksversjon: '1999-10-01',
                            kapittel: '8',
                            paragraf: '36',
                            ledd: '1',
                            setning: undefined,
                            bokstav: 'b-c',
                        },
                        sistEndretAv: 'Andersen, Håvard Stigen',
                        sistEndretDato: '2025-09-18T12:12:36.387Z',
                    },
                    {
                        kode: 'SELVSTENDIG_KOLLEKTIVFORSIKRING_100',
                        beskrivelse:
                            'Spesielle yrkesgrupper kan tegne kollektiv forsikring (jordbruker, reindriftsutøver og fisker)',
                        vilkårshjemmel: {
                            lovverk: 'Folketrygdloven',
                            lovverksversjon: '1999-10-01',
                            kapittel: '8',
                            paragraf: '36',
                            ledd: '4',
                            setning: undefined,
                            bokstav: undefined,
                        },
                        sistEndretAv: 'Andersen, Håvard Stigen',
                        sistEndretDato: '2025-09-18T12:12:36.387Z',
                    },
                    {
                        kode: 'FRILANSER_100',
                        beskrivelse: 'Til en frilanser ytes det sykepenger med 100 prosent av sykepengegrunnlaget',
                        vilkårshjemmel: {
                            lovverk: 'Folketrygdloven',
                            lovverksversjon: '1997-05-01',
                            kapittel: '8',
                            paragraf: '38',
                            ledd: '1',
                            setning: '1',
                            bokstav: undefined,
                        },
                        sistEndretAv: 'Andersen, Håvard Stigen',
                        sistEndretDato: '2025-09-18T12:12:36.387Z',
                    },
                    {
                        kode: 'INAKTIV_65',
                        beskrivelse:
                            'For yrkesaktive medlemmer som midlertidig har vært ute av inntektsgivende arbeid og som fremdeles er ute av inntektsgivende arbeid utgjør sykepengene 65 prosent av sykepengegrunnlaget',
                        vilkårshjemmel: {
                            lovverk: 'Folketrygdloven',
                            lovverksversjon: '2020-01-01',
                            kapittel: '8',
                            paragraf: '47',
                            ledd: '6',
                            setning: '2',
                            bokstav: undefined,
                        },
                    },
                    {
                        kode: 'INAKTIV_100',
                        beskrivelse:
                            'For yrkesaktive medlemmer som midlertidig har vært ute av inntektsgivende arbeid og som er i arbeid uten å fylle vilkåret i § 8-2 om fire ukers opptjeningstid utgjør sykepengene 100 prosent av sykepengegrunnlaget',
                        vilkårshjemmel: {
                            lovverk: 'Folketrygdloven',
                            lovverksversjon: '2020-01-01',
                            kapittel: '8',
                            paragraf: '47',
                            ledd: '6',
                            setning: '3',
                            bokstav: undefined,
                        },
                    },
                    {
                        kode: 'DAGPENGEMOTTAKER_100',
                        beskrivelse: 'Medlemmer med dagpenger under arbeidsløshet eller ventelønn m.m',
                        vilkårshjemmel: {
                            lovverk: 'Folketrygdloven',
                            lovverksversjon: '2024-12-20',
                            kapittel: '8',
                            paragraf: '49',
                            ledd: '3',
                            setning: '1',
                            bokstav: undefined,
                        },
                    },
                ]),
            )
        },
    )
}
