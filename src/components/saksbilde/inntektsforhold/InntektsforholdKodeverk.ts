export const inntektsforholdKodeverk = {
    kode: 'INNTEKTSKATEGORI',
    navn: 'Type inntektsforhold',
    variant: 'SELECT',
    alternativer: [
        {
            kode: 'ARBEIDSTAKER',
            navn: 'Arbeidstaker',
        },
        {
            kode: 'FRILANSER',
            navn: 'Frilanser',
        },
        {
            kode: 'SELVSTENDIG_NÆRINGSDRIVENDE',
            navn: 'Selvstendig næringsdrivende',
            underspørsmål: [
                {
                    kode: 'TYPE_SELVSTENDIG_NÆRINGSDRIVENDE',
                    navn: 'Type selvstendig næringsdrivende',
                    variant: 'CHECKBOX',
                    alternativer: [
                        {
                            kode: 'ORDINÆR_SELVSTENDIG_NÆRINGSDRIVENDE',
                            navn: 'Ordinær selvstendig næringsdrivende',
                            underspørsmål: [
                                {
                                    kode: 'SELVSTENDIG_NÆRINGSDRIVENDE_FORSIKRING',
                                    navn: 'Nav-kjøpt forsikring',
                                    variant: 'RADIO',
                                    alternativer: [
                                        {
                                            kode: 'FORSIKRING_80_PROSENT_FRA_FØRSTE_SYKEDAG',
                                            navn: '80 prosent fra første sykedag',
                                        },
                                        {
                                            kode: 'FORSIKRING_100_PROSENT_FRA_17_SYKEDAG',
                                            navn: '100 prosent fra 17. sykedag',
                                        },
                                        {
                                            kode: 'FORSIKRING_100_PROSENT_FRA_FØRSTE_SYKEDAG',
                                            navn: '100 prosent fra første sykedag',
                                        },
                                        {
                                            kode: 'INGEN_FORSIKRING',
                                            navn: 'Ingen forsikring',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            kode: 'FISKER',
                            navn: 'Fisker',
                            underspørsmål: [
                                {
                                    kode: 'FISKER_BLAD',
                                    navn: 'Blad i fiskermanntallet',
                                    variant: 'RADIO',
                                    alternativer: [
                                        {
                                            kode: 'FISKER_BLAD_A',
                                            navn: 'Blad A (fiske som binæring)',
                                        },
                                        {
                                            kode: 'FISKER_BLAD_B',
                                            navn: 'Blad B (fiske som hovednæring)',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            kode: 'JORDBRUKER',
                            navn: 'Jordbruker',
                        },
                        {
                            kode: 'REINDRIFT',
                            navn: 'Reindrift',
                        },
                    ],
                },
            ],
        },
        {
            kode: 'INAKTIV',
            navn: 'Inaktiv',
        },
        {
            kode: 'ANNET',
            navn: 'Annet',
        },
    ],
}
