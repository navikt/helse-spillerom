import { NextResponse } from 'next/server'

import type { PensjonsgivendeInntekt } from '../../schemas/pensjonsgivende'

// Ny testdata for pensjonsgivende inntekt
const testPensjonsgivendeInntekt: PensjonsgivendeInntekt = [
    {
        norskPersonidentifikator: '10419045026',
        inntektsaar: 2024,
        pensjonsgivendeInntekt: [
            {
                skatteordning: 'FASTLAND',
                datoForFastsetting: '2025-06-24T07:31:26.035Z',
                pensjonsgivendeInntektAvLoennsinntekt: '250000',
                pensjonsgivendeInntektAvLoennsinntektBarePensjonsdel: null,
                pensjonsgivendeInntektAvNaeringsinntekt: null,
                pensjonsgivendeInntektAvNaeringsinntektFraFiskeFangstEllerFamiliebarnehage: null,
            },
        ],
    },
    {
        norskPersonidentifikator: '10419045026',
        inntektsaar: 2023,
        pensjonsgivendeInntekt: [
            {
                skatteordning: 'FASTLAND',
                datoForFastsetting: '2025-06-24T07:32:30.396Z',
                pensjonsgivendeInntektAvLoennsinntekt: '250000',
                pensjonsgivendeInntektAvLoennsinntektBarePensjonsdel: '',
                pensjonsgivendeInntektAvNaeringsinntekt: '25000',
                pensjonsgivendeInntektAvNaeringsinntektFraFiskeFangstEllerFamiliebarnehage: null,
            },
        ],
    },
    {
        norskPersonidentifikator: '10419045026',
        inntektsaar: 2022,
        pensjonsgivendeInntekt: [
            {
                skatteordning: 'FASTLAND',
                datoForFastsetting: '2025-06-24T07:32:48.777Z',
                pensjonsgivendeInntektAvLoennsinntekt: null,
                pensjonsgivendeInntektAvLoennsinntektBarePensjonsdel: null,
                pensjonsgivendeInntektAvNaeringsinntekt: '900000',
                pensjonsgivendeInntektAvNaeringsinntektFraFiskeFangstEllerFamiliebarnehage: null,
            },
        ],
    },
    {
        norskPersonidentifikator: '10419045026',
        inntektsaar: 2021,
        pensjonsgivendeInntekt: [
            {
                skatteordning: 'FASTLAND',
                datoForFastsetting: '2025-06-24T07:33:10.123Z',
                pensjonsgivendeInntektAvLoennsinntekt: '1000000',
                pensjonsgivendeInntektAvLoennsinntektBarePensjonsdel: null,
                pensjonsgivendeInntektAvNaeringsinntekt: '200',
                pensjonsgivendeInntektAvNaeringsinntektFraFiskeFangstEllerFamiliebarnehage: null,
            },
        ],
    },
    {
        norskPersonidentifikator: '10419045026',
        inntektsaar: 2020,
        pensjonsgivendeInntekt: null,
    },
]

export async function handleGetPensjonsgivendeInntekt(personId: string) {
    if (personId === 'bosse') {
        // TODO noe eget på bosse
        return NextResponse.json(testPensjonsgivendeInntekt)
    }
    return NextResponse.json(testPensjonsgivendeInntekt)
}
