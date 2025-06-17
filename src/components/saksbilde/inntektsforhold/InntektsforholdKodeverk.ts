export const inntektsforholdKodeverk = {
    kode: 'INNTEKTSFORHOLD',
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
                    kode: 'SELVSTENDIG_NÆRINGSDRIVENDE_TYPE',
                    navn: 'Type selvstendig næringsdrivende',
                    variant: 'CHECKBOX',
                    alternativer: [
                        {
                            kode: 'VANLIG',
                            navn: 'Vanlig selvstendig næringsdrivende',
                            underspørsmål: [
                                {
                                    kode: 'SELVSTENDIG_NÆRINGSDRIVENDE_FORSIKRING',
                                    navn: 'Nav-kjøpt forsikring',
                                    variant: 'RADIO',
                                    alternativer: [
                                        {
                                            kode: '1',
                                            navn: '80 prosent fra første sykedag',
                                        },
                                        {
                                            kode: '2',
                                            navn: '100 prosent fra 17. sykedag',
                                        },
                                        {
                                            kode: '3',
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
                                    kode: 'FISKER_BLAD_B',
                                    navn: 'Registrert i fiskermanntallets blad B (fiske som hovednæring)',
                                    variant: 'RADIO',
                                    alternativer: [
                                        {
                                            kode: 'ER_FISKER_BLAD_B',
                                            navn: 'Ja, er omfattet av kollektiv forsikring',
                                        },
                                        {
                                            kode: 'IKKE_FISKER_BLAD_B',
                                            navn: 'Nei, er ikke omfattet av kollektiv forsikring',
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
