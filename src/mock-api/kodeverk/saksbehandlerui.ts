import { type HovedspørsmålArray } from '@schemas/saksbehandlergrensesnitt'

export const saksbehandlerUi: HovedspørsmålArray = [
    {
        kode: 'SDFSDF',
        beskrivelse: 'tap av pensjonsgivende inntekt og minsteinntekt',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [
            {
                kode: 'INNTEKTSTAP',
                navn: 'Inntektstap pga arbeidsuførhet',
                variant: 'RADIO',
                alternativer: [
                    { kode: 'INNTEKTSTAP_JA', navn: 'Ja', underspørsmål: [] },
                    {
                        kode: 'INNTEKTSTAP_NEI',
                        navn: 'Nei',
                        underspørsmål: [],
                    },
                ],
            },
            {
                kode: 'FYLT_70_GRUPPE',
                navn: null,
                variant: 'CHECKBOX',
                alternativer: [
                    {
                        kode: 'FYLT_70',
                        navn: 'Fylt 70 år',
                        underspørsmål: [],
                    },
                ],
            },
        ],
    },
]
