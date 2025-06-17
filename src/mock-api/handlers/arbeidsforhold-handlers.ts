import { NextResponse } from 'next/server'

import { Arbeidsforhold } from '@/schemas/aareg'

import { mockArbeidsforhold } from '../aareg'

const bosseArbeidsforhold: Arbeidsforhold[] = [
    {
        id: '1',
        type: {
            kode: 'frilanserOppdragstakerHonorarPersonerMm',
            beskrivelse:
                'Frilansere/oppdragstakere, styremedlemmer, folkevalgte, personer som innehar tillitsverv, fosterforelder, støttekontakter, avlastere og personer med omsorgslønn',
        },
        arbeidstaker: {
            identer: [
                {
                    type: 'AKTORID',
                    ident: '2848573276175',
                    gjeldende: true,
                },
                {
                    type: 'FOLKEREGISTERIDENT',
                    ident: '22848997769',
                    gjeldende: true,
                },
            ],
        },
        arbeidssted: {
            type: 'Underenhet',
            identer: [
                {
                    type: 'ORGANISASJONSNUMMER',
                    ident: '805824352',
                },
            ],
        },
        opplysningspliktig: {
            type: 'Hovedenhet',
            identer: [
                {
                    type: 'ORGANISASJONSNUMMER',
                    ident: '963743254',
                },
            ],
        },
        ansettelsesperiode: {
            startdato: '2005-06-17',
        },
        ansettelsesdetaljer: [
            {
                type: 'Frilanser',
                arbeidstidsordning: {
                    kode: 'ikkeSkift',
                    beskrivelse: 'Ikke skift',
                },
                ansettelsesform: {
                    kode: 'fast',
                    beskrivelse: 'Fast ansettelse',
                },
                yrke: {
                    kode: '0010962',
                    beskrivelse: 'ADJUNKT LR 28',
                },
                antallTimerPrUke: 2,
                avtaltStillingsprosent: 5.0,
                rapporteringsmaaneder: {
                    fra: '2005-06',
                    til: null,
                },
            },
        ],
        rapporteringsordning: {
            kode: 'A_ORDNINGEN',
            beskrivelse: 'Rapportert via a-ordningen (2015-d.d.)',
        },
        navArbeidsforholdId: 3142071,
        navVersjon: 0,
        navUuid: '21fd56e2-4918-4ce0-8879-6ca235ac4429',
        opprettet: '2025-06-17T08:39:49.924',
        sistBekreftet: '2025-06-17T08:39:49',
        bruksperiode: {
            fom: '2025-06-17T08:39:49.878',
            tom: null,
        },
    },
]

export async function handleGetArbeidsforhold(personId: string) {
    if (personId === 'bosse') {
        return NextResponse.json(bosseArbeidsforhold)
    }
    return NextResponse.json(mockArbeidsforhold)
}
