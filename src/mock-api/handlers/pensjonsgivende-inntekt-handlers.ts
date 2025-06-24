import { NextResponse } from 'next/server'

const bossePensjonsgivendeInntekt = {
    inntektsaar: '2023',
    personidentifikator: '30816199456',
    skjermet: false,
    grunnlag: [
        {
            tekniskNavn: 'SUM_BARNS_INNTEKT',
            verdi: 0,
            kategori: 'Barns inntekt',
        },
        {
            tekniskNavn: 'LOENNSINNTEKT',
            verdi: 450000,
            kategori: 'Lønnsinntekt',
        },
        {
            tekniskNavn: 'NAERINGSINNTEKT',
            verdi: 0,
            kategori: 'Næringsinntekt',
        },
        {
            tekniskNavn: 'PENSJON_ELLER_TRYGD',
            verdi: 0,
            kategori: 'Pensjon eller trygd',
        },
    ],
}

const defaultPensjonsgivendeInntekt = {
    inntektsaar: '2023',
    personidentifikator: '11838999850',
    skjermet: false,
    grunnlag: [
        {
            tekniskNavn: 'SUM_BARNS_INNTEKT',
            verdi: 0,
            kategori: 'Barns inntekt',
        },
        {
            tekniskNavn: 'LOENNSINNTEKT',
            verdi: 480000,
            kategori: 'Lønnsinntekt',
        },
        {
            tekniskNavn: 'NAERINGSINNTEKT',
            verdi: 0,
            kategori: 'Næringsinntekt',
        },
        {
            tekniskNavn: 'PENSJON_ELLER_TRYGD',
            verdi: 0,
            kategori: 'Pensjon eller trygd',
        },
    ],
}

export async function handleGetPensjonsgivendeInntekt(personId: string) {
    if (personId === 'bosse') {
        return NextResponse.json(bossePensjonsgivendeInntekt)
    }
    return NextResponse.json(defaultPensjonsgivendeInntekt)
}
