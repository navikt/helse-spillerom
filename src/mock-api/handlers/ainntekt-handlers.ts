import { NextResponse } from 'next/server'

import { Ainntekt } from '@/schemas/ainntekt'

import { ainntektData } from '../ainntekt'

const bosseAinntekt: Ainntekt = {
    arbeidsInntektMaaned: [
        {
            aarMaaned: '2024-11',
            arbeidsInntektInformasjon: {
                inntektListe: [
                    {
                        inntektType: 'LOENNSINNTEKT',
                        beloep: 2000.0,
                        fordel: 'kontantytelse',
                        inntektskilde: 'A-ordningen',
                        inntektsperiodetype: 'Maaned',
                        inntektsstatus: 'LoependeInnrapportert',
                        utbetaltIMaaned: '2024-11',
                        opplysningspliktig: {
                            identifikator: '963743254',
                            aktoerType: 'ORGANISASJON',
                        },
                        virksomhet: {
                            identifikator: '805824352',
                            aktoerType: 'ORGANISASJON',
                        },
                        inntektsmottaker: {
                            identifikator: '22848997769',
                            aktoerType: 'NATURLIG_IDENT',
                        },
                        inngaarIGrunnlagForTrekk: true,
                        utloeserArbeidsgiveravgift: false,
                        informasjonsstatus: 'InngaarAlltid',
                        beskrivelse: 'timeloenn',
                        antall: 2,
                    },
                ],
            },
        },
        {
            aarMaaned: '2024-12',
            arbeidsInntektInformasjon: {
                inntektListe: [
                    {
                        inntektType: 'LOENNSINNTEKT',
                        beloep: 2000.0,
                        fordel: 'kontantytelse',
                        inntektskilde: 'A-ordningen',
                        inntektsperiodetype: 'Maaned',
                        inntektsstatus: 'LoependeInnrapportert',
                        utbetaltIMaaned: '2024-12',
                        opplysningspliktig: {
                            identifikator: '963743254',
                            aktoerType: 'ORGANISASJON',
                        },
                        virksomhet: {
                            identifikator: '805824352',
                            aktoerType: 'ORGANISASJON',
                        },
                        inntektsmottaker: {
                            identifikator: '22848997769',
                            aktoerType: 'NATURLIG_IDENT',
                        },
                        inngaarIGrunnlagForTrekk: true,
                        utloeserArbeidsgiveravgift: false,
                        informasjonsstatus: 'InngaarAlltid',
                        beskrivelse: 'timeloenn',
                        antall: 2,
                    },
                ],
            },
        },
        {
            aarMaaned: '2024-10',
            arbeidsInntektInformasjon: {
                inntektListe: [
                    {
                        inntektType: 'LOENNSINNTEKT',
                        beloep: 2000.0,
                        fordel: 'kontantytelse',
                        inntektskilde: 'A-ordningen',
                        inntektsperiodetype: 'Maaned',
                        inntektsstatus: 'LoependeInnrapportert',
                        utbetaltIMaaned: '2024-10',
                        opplysningspliktig: {
                            identifikator: '963743254',
                            aktoerType: 'ORGANISASJON',
                        },
                        virksomhet: {
                            identifikator: '805824352',
                            aktoerType: 'ORGANISASJON',
                        },
                        inntektsmottaker: {
                            identifikator: '22848997769',
                            aktoerType: 'NATURLIG_IDENT',
                        },
                        inngaarIGrunnlagForTrekk: true,
                        utloeserArbeidsgiveravgift: false,
                        informasjonsstatus: 'InngaarAlltid',
                        beskrivelse: 'timeloenn',
                        antall: 2,
                    },
                ],
            },
        },
        {
            aarMaaned: '2024-08',
            arbeidsInntektInformasjon: {
                inntektListe: [
                    {
                        inntektType: 'LOENNSINNTEKT',
                        beloep: 2000.0,
                        fordel: 'kontantytelse',
                        inntektskilde: 'A-ordningen',
                        inntektsperiodetype: 'Maaned',
                        inntektsstatus: 'LoependeInnrapportert',
                        utbetaltIMaaned: '2024-08',
                        opplysningspliktig: {
                            identifikator: '963743254',
                            aktoerType: 'ORGANISASJON',
                        },
                        virksomhet: {
                            identifikator: '805824352',
                            aktoerType: 'ORGANISASJON',
                        },
                        inntektsmottaker: {
                            identifikator: '22848997769',
                            aktoerType: 'NATURLIG_IDENT',
                        },
                        inngaarIGrunnlagForTrekk: true,
                        utloeserArbeidsgiveravgift: false,
                        informasjonsstatus: 'InngaarAlltid',
                        beskrivelse: 'timeloenn',
                        antall: 2,
                    },
                ],
            },
        },
        {
            aarMaaned: '2024-07',
            arbeidsInntektInformasjon: {
                inntektListe: [
                    {
                        inntektType: 'LOENNSINNTEKT',
                        beloep: 2000.0,
                        fordel: 'kontantytelse',
                        inntektskilde: 'A-ordningen',
                        inntektsperiodetype: 'Maaned',
                        inntektsstatus: 'LoependeInnrapportert',
                        utbetaltIMaaned: '2024-07',
                        opplysningspliktig: {
                            identifikator: '963743254',
                            aktoerType: 'ORGANISASJON',
                        },
                        virksomhet: {
                            identifikator: '805824352',
                            aktoerType: 'ORGANISASJON',
                        },
                        inntektsmottaker: {
                            identifikator: '22848997769',
                            aktoerType: 'NATURLIG_IDENT',
                        },
                        inngaarIGrunnlagForTrekk: true,
                        utloeserArbeidsgiveravgift: false,
                        informasjonsstatus: 'InngaarAlltid',
                        beskrivelse: 'timeloenn',
                        antall: 2,
                    },
                ],
            },
        },
        {
            aarMaaned: '2024-09',
            arbeidsInntektInformasjon: {
                inntektListe: [
                    {
                        inntektType: 'LOENNSINNTEKT',
                        beloep: 2000.0,
                        fordel: 'kontantytelse',
                        inntektskilde: 'A-ordningen',
                        inntektsperiodetype: 'Maaned',
                        inntektsstatus: 'LoependeInnrapportert',
                        utbetaltIMaaned: '2024-09',
                        opplysningspliktig: {
                            identifikator: '963743254',
                            aktoerType: 'ORGANISASJON',
                        },
                        virksomhet: {
                            identifikator: '805824352',
                            aktoerType: 'ORGANISASJON',
                        },
                        inntektsmottaker: {
                            identifikator: '22848997769',
                            aktoerType: 'NATURLIG_IDENT',
                        },
                        inngaarIGrunnlagForTrekk: true,
                        utloeserArbeidsgiveravgift: false,
                        informasjonsstatus: 'InngaarAlltid',
                        beskrivelse: 'timeloenn',
                        antall: 2,
                    },
                ],
            },
        },
        {
            aarMaaned: '2025-02',
            arbeidsInntektInformasjon: {
                inntektListe: [
                    {
                        inntektType: 'LOENNSINNTEKT',
                        beloep: 2000.0,
                        fordel: 'kontantytelse',
                        inntektskilde: 'A-ordningen',
                        inntektsperiodetype: 'Maaned',
                        inntektsstatus: 'LoependeInnrapportert',
                        utbetaltIMaaned: '2025-02',
                        opplysningspliktig: {
                            identifikator: '963743254',
                            aktoerType: 'ORGANISASJON',
                        },
                        virksomhet: {
                            identifikator: '805824352',
                            aktoerType: 'ORGANISASJON',
                        },
                        inntektsmottaker: {
                            identifikator: '22848997769',
                            aktoerType: 'NATURLIG_IDENT',
                        },
                        inngaarIGrunnlagForTrekk: true,
                        utloeserArbeidsgiveravgift: false,
                        informasjonsstatus: 'InngaarAlltid',
                        beskrivelse: 'timeloenn',
                        antall: 2,
                    },
                ],
            },
        },
        {
            aarMaaned: '2025-01',
            arbeidsInntektInformasjon: {
                inntektListe: [
                    {
                        inntektType: 'LOENNSINNTEKT',
                        beloep: 2000.0,
                        fordel: 'kontantytelse',
                        inntektskilde: 'A-ordningen',
                        inntektsperiodetype: 'Maaned',
                        inntektsstatus: 'LoependeInnrapportert',
                        utbetaltIMaaned: '2025-01',
                        opplysningspliktig: {
                            identifikator: '963743254',
                            aktoerType: 'ORGANISASJON',
                        },
                        virksomhet: {
                            identifikator: '805824352',
                            aktoerType: 'ORGANISASJON',
                        },
                        inntektsmottaker: {
                            identifikator: '22848997769',
                            aktoerType: 'NATURLIG_IDENT',
                        },
                        inngaarIGrunnlagForTrekk: true,
                        utloeserArbeidsgiveravgift: false,
                        informasjonsstatus: 'InngaarAlltid',
                        beskrivelse: 'timeloenn',
                        antall: 2,
                    },
                ],
            },
        },
    ],
    ident: {
        identifikator: '22848997769',
        aktoerType: 'NATURLIG_IDENT',
    },
}

export async function handleGetAinntekt(personId: string) {
    if (personId === 'bosse') {
        return NextResponse.json(bosseAinntekt)
    }
    return NextResponse.json(ainntektData)
}
