import { Arbeidsforhold } from '@/schemas/aareg'

export const mockArbeidsforhold: Arbeidsforhold[] = [
    {
        id: '2',
        type: { kode: 'maritimtArbeidsforhold', beskrivelse: 'Maritimt arbeidsforhold' },
        arbeidstaker: {
            identer: [
                {
                    type: 'AKTORID',
                    ident: '2073815043511',
                    gjeldende: true,
                },
                { type: 'FOLKEREGISTERIDENT', ident: '23818697341', gjeldende: true },
            ],
        },
        arbeidssted: { type: 'Underenhet', identer: [{ type: 'ORGANISASJONSNUMMER', ident: '907670201' }] },
        opplysningspliktig: { type: 'Hovedenhet', identer: [{ type: 'ORGANISASJONSNUMMER', ident: '963743254' }] },
        ansettelsesperiode: { startdato: '2005-05-15' },
        ansettelsesdetaljer: [
            {
                type: 'Maritim',
                fartsomraade: { kode: 'utenriks', beskrivelse: 'Utenriks' },
                skipsregister: { kode: 'nor', beskrivelse: 'NOR' },
                fartoeystype: { kode: 'boreplattform', beskrivelse: 'Boreplattform' },
                arbeidstidsordning: { kode: 'ikkeSkift', beskrivelse: 'Ikke skift' },
                ansettelsesform: { kode: 'fast', beskrivelse: 'Fast ansettelse' },
                yrke: { kode: '3423103', beskrivelse: 'SALGSKONSULENT (VIKARBYRÅ)' },
                antallTimerPrUke: 37.5,
                avtaltStillingsprosent: 100.0,
                rapporteringsmaaneder: { fra: '2005-05', til: null },
            },
        ],
        rapporteringsordning: { kode: 'A_ORDNINGEN', beskrivelse: 'Rapportert via a-ordningen (2015-d.d.)' },
        navArbeidsforholdId: 3141139,
        navVersjon: 0,
        navUuid: '8a1ac96b-7fc1-4718-93a2-7a9dfa16727a',
        opprettet: '2025-05-15T09:28:57.981',
        sistBekreftet: '2025-05-15T09:28:57',
        bruksperiode: { fom: '2025-05-15T09:28:57.934', tom: null },
    },
    {
        id: '1',
        type: { kode: 'ordinaertArbeidsforhold', beskrivelse: 'Ordinært arbeidsforhold' },
        arbeidstaker: {
            identer: [
                {
                    type: 'AKTORID',
                    ident: '2073815043511',
                    gjeldende: true,
                },
                { type: 'FOLKEREGISTERIDENT', ident: '23818697341', gjeldende: true },
            ],
        },
        arbeidssted: { type: 'Underenhet', identer: [{ type: 'ORGANISASJONSNUMMER', ident: '896929119' }] },
        opplysningspliktig: { type: 'Hovedenhet', identer: [{ type: 'ORGANISASJONSNUMMER', ident: '963743254' }] },
        ansettelsesperiode: { startdato: '2005-05-15' },
        ansettelsesdetaljer: [
            {
                type: 'Ordinaer',
                arbeidstidsordning: { kode: 'ikkeSkift', beskrivelse: 'Ikke skift' },
                ansettelsesform: { kode: 'fast', beskrivelse: 'Fast ansettelse' },
                yrke: { kode: '2310114', beskrivelse: 'HØYSKOLELÆRER' },
                antallTimerPrUke: 37.5,
                avtaltStillingsprosent: 100.0,
                rapporteringsmaaneder: { fra: '2005-05', til: null },
            },
        ],
        rapporteringsordning: { kode: 'A_ORDNINGEN', beskrivelse: 'Rapportert via a-ordningen (2015-d.d.)' },
        navArbeidsforholdId: 3141140,
        navVersjon: 0,
        navUuid: '5493131b-8682-429e-9360-a4f2985097e1',
        opprettet: '2025-05-15T09:28:58.008',
        sistBekreftet: '2025-05-15T09:28:58',
        bruksperiode: { fom: '2025-05-15T09:28:57.96', tom: null },
    },
]
