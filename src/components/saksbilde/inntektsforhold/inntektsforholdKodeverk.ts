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
                            navn: 'Maritimt arbeidsforhold',
                            underspørsmål: [
                                {
                                    kode: 'SKIPSFART',
                                    navn: 'Skipsfart',
                                    variant: 'RADIO',
                                    alternativer: [
                                        {
                                            kode: 'NORSK_UTENLANDSFART',
                                            navn: 'Norsk skip i utenlandsfart',
                                        },
                                        {
                                            kode: 'VANLIG_SKIPSFART',
                                            navn: 'Vanlig skipsfart?',
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
                            navn: 'Ingen Ingen forsikring / ikke aktuelt pga også selvstendig næringsdrivende',
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
                            underspørsmål: [
                                {
                                    kode: 'KOLLEKTIV_FORSIKRING_JORDBRUKER',
                                    navn: 'Kollektiv forsikring for jordbrukere',
                                    variant: 'RADIO',
                                    alternativer: [
                                        {
                                            kode: 'KOLLEKTIV_FORSIKRING_JORDBRUKER_JA',
                                            navn: 'Ja',
                                        },
                                        {
                                            kode: 'KOLLEKTIV_FORSIKRING_JORDBRUKER_NEI',
                                            navn: 'Nei',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            kode: 'REINDRIFT',
                            navn: 'Reindriftsutøver',
                            underspørsmål: [
                                {
                                    kode: 'KOLLEKTIV_FORSIKRING_REINDRIFT',
                                    navn: 'Kollektiv forsikring for reindriftsutøvere',
                                    variant: 'RADIO',
                                    alternativer: [
                                        {
                                            kode: 'KOLLEKTIV_FORSIKRING_REINDRIFT_JA',
                                            navn: 'Ja',
                                        },
                                        {
                                            kode: 'KOLLEKTIV_FORSIKRING_REINDRIFT_NEI',
                                            navn: 'Nei',
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
        },
        {
            kode: 'ANNET',
            navn: 'Annet',
        },
    ],
}
