const ordnaerForsikring = [
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
]
export const inntektsforholdKodeverk = {
    kode: 'INNTEKTSKATEGORI',
    navn: 'Type inntektsforhold',
    variant: 'SELECT',
    alternativer: [
        {
            kode: 'ARBEIDSTAKER',
            navn: 'Arbeidstaker',
            underspørsmål: [
                {
                    kode: 'ORGNUMMER',
                    navn: 'Organisasjonsnummer',
                    variant: 'TEXTFIELD',
                },
                {
                    kode: 'ER_SYKMELDT',
                    navn: 'Er sykmeldt fra forholdet',
                    variant: 'RADIO',
                    alternativer: [
                        { kode: 'ER_SYKMELDT_JA', navn: 'Ja' },
                        { kode: 'ER_SYKMELDT_NEI', navn: 'Nei' },
                    ],
                },
                {
                    kode: 'TYPE_ARBEIDSTAKER',
                    navn: 'Type arbeidstaker',
                    variant: 'RADIO',
                    alternativer: [
                        {
                            kode: 'ORDINÆRT_ARBEIDSFORHOLD',
                            navn: 'Ordinært arbeidsforhold',
                        },
                        {
                            kode: 'MARITIMT_ARBEIDSFORHOLD',
                            navn: 'Maritimt arbeidsforhold på norsk skip i utenlandsfart',
                        },
                        {
                            kode: 'FISKER',
                            navn: 'Fisker på blad B',
                        },
                        {
                            kode: 'VERNEPLIKTIG',
                            navn: 'Vernepliktig',
                        },
                        {
                            kode: 'DAGMAMMA_BARNETS_HJEM',
                            navn: 'Dagmamma/dagpappa i barnets hjem)',
                        },
                    ],
                },
            ],
        },
        {
            kode: 'FRILANSER',
            navn: 'Frilanser',
            underspørsmål: [
                {
                    kode: 'ORGNUMMER',
                    navn: 'Organisasjonsnummer',
                    variant: 'TEXTFIELD',
                },
                {
                    kode: 'ER_SYKMELDT',
                    navn: 'Er sykmeldt fra forholdet',
                    variant: 'RADIO',
                    alternativer: [
                        { kode: 'ER_SYKMELDT_JA', navn: 'Ja' },
                        { kode: 'ER_SYKMELDT_NEI', navn: 'Nei' },
                    ],
                },
                {
                    kode: 'FRILANSER_FORSIKRING',
                    navn: 'Nav-kjøpt forsikring',
                    variant: 'RADIO',
                    alternativer: [
                        {
                            kode: 'FORSIKRING_100_PROSENT_FRA_FØRSTE_SYKEDAG',
                            navn: '100 prosent fra første sykedag',
                        },
                        {
                            kode: 'INGEN_FORSIKRING',
                            navn: ' Ingen forsikring / ikke aktuelt pga også selvstendig næringsdrivende',
                        },
                    ],
                },
            ],
        },
        {
            kode: 'SELVSTENDIG_NÆRINGSDRIVENDE',
            navn: 'Selvstendig næringsdrivende',
            underspørsmål: [
                {
                    kode: 'ER_SYKMELDT',
                    navn: 'Er sykmeldt fra forholdet',
                    variant: 'RADIO',
                    alternativer: [
                        { kode: 'ER_SYKMELDT_JA', navn: 'Ja' },
                        { kode: 'ER_SYKMELDT_NEI', navn: 'Nei' },
                    ],
                },
                {
                    kode: 'TYPE_SELVSTENDIG_NÆRINGSDRIVENDE',
                    navn: 'Type selvstendig næringsdrivende',
                    variant: 'RADIO',
                    alternativer: [
                        {
                            kode: 'ORDINÆR_SELVSTENDIG_NÆRINGSDRIVENDE',
                            navn: 'Ordinær selvstendig næringsdrivende',
                            underspørsmål: ordnaerForsikring,
                        },
                        {
                            kode: 'DAGMAMMA_EGET_HJEM',
                            navn: 'Dagmamma/dagpappa i eget hjem',
                            underspørsmål: ordnaerForsikring,
                        },
                        {
                            kode: 'FISKER',
                            navn: 'Fisker på blad B',
                        },
                        {
                            kode: 'JORDBRUKER',
                            navn: 'Jordbruker omfattet av kollektiv forsikring',
                            underspørsmål: [
                                {
                                    kode: 'SELVSTENDIG_NÆRINGSDRIVENDE_FORSIKRING',
                                    navn: 'Nav-kjøpt forsikring',
                                    variant: 'RADIO',
                                    alternativer: [
                                        {
                                            kode: 'FORSIKRING_100_PROSENT_FRA_FØRSTE_SYKEDAG',
                                            navn: '100 prosent fra første sykedag',
                                        },
                                        {
                                            kode: 'INGEN_FORSIKRING',
                                            navn: 'Ingen kjøpt forsikring',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            kode: 'REINDRIFT',
                            navn: 'Reindriftsutøver omfattet av kollektiv forsikring',
                            underspørsmål: [
                                {
                                    kode: 'SELVSTENDIG_NÆRINGSDRIVENDE_FORSIKRING',
                                    navn: 'Nav-kjøpt forsikring',
                                    variant: 'RADIO',
                                    alternativer: [
                                        {
                                            kode: 'FORSIKRING_100_PROSENT_FRA_FØRSTE_SYKEDAG',
                                            navn: '100 prosent fra første sykedag',
                                        },
                                        {
                                            kode: 'INGEN_FORSIKRING',
                                            navn: 'Ingen kjøpt forsikring',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            kode: 'INAKTIV',
            navn: 'Inaktiv',
            kanIkkeKombineresMedAndre: true,
        },
        {
            kode: 'ARBEIDSLEDIG',
            navn: 'Arbeidsledig',
        },
        {
            kode: 'ANNET',
            navn: 'Annet',
        },
    ],
}
