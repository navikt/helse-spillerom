import { Maybe } from '@/utils/tsUtils'

export type Årsak = {
    kode: string
    beskrivelse: string
}

export type Vilkår = {
    vilkårshjemmel: {
        lovverk: string
        lovverksversjon: string
        paragraf: string
        ledd: Maybe<string>
        setning: Maybe<string>
        bokstav: Maybe<string>
    }
    vilkårskode: string
    beskrivelse: string
    mulige_resultater: {
        OPPFYLT: Årsak[]
        IKKE_OPPFYLT: Årsak[]
    }
}

type Kodeverk = Vilkår[]

export const kodeverk: Kodeverk = [
    // Ftrl 22-13 3
    {
        vilkårshjemmel: {
            lovverk: 'Folketrygdloven',
            lovverksversjon: '2019-01-01',
            paragraf: '22-13',
            ledd: '3',
            setning: null,
            bokstav: null,
        },
        vilkårskode: 'MAA_SOKE_INNEN_TRE_MAANEDER',
        beskrivelse: 'En ytelse gis for opptil tre måneder før den måneden da kravet ble satt fram',
        mulige_resultater: {
            OPPFYLT: [
                {
                    kode: 'INNEN_TRE_MÅNEDER',
                    beskrivelse: 'Søknad fremsatt i tide',
                },
            ],
            IKKE_OPPFYLT: [
                {
                    kode: 'IKKE_INNEN_TRE_MÅNEDER',
                    beskrivelse: 'Søknad ikke fremsatt i tide',
                },
            ],
        },
    },
    // Ftrl 2-1
    {
        vilkårshjemmel: {
            lovverk: 'Folketrygdloven',
            lovverksversjon: '2019-01-01',
            paragraf: '2-1',
            ledd: null,
            setning: null,
            bokstav: null,
        },
        vilkårskode: 'BOINO',
        beskrivelse: 'Personer som er bosatt i Norge, er pliktige medlemmer i folketrygden',
        mulige_resultater: {
            OPPFYLT: [
                {
                    kode: 'en_kode',
                    beskrivelse: 'Er medlem i folketrygden',
                },
            ],
            IKKE_OPPFYLT: [
                {
                    kode: 'en_annen_kode',
                    beskrivelse: 'Er ikke medlem i folketrygden',
                },
            ],
        },
    },
    // Ftrl 8-4
    {
        vilkårshjemmel: {
            lovverk: 'Folketrygdloven',
            lovverksversjon: '2019-01-01',
            paragraf: '8-4',
            ledd: null,
            setning: null,
            bokstav: null,
        },
        vilkårskode: 'ARBUFOR',
        beskrivelse: 'Arbeidsufør',
        mulige_resultater: {
            OPPFYLT: [
                {
                    kode: 'en_kode',
                    beskrivelse: 'Er arbeidsufør',
                },
            ],
            IKKE_OPPFYLT: [
                {
                    kode: 'en_annen_kode',
                    beskrivelse: 'Er ikke arbeidsufør',
                },
            ],
        },
    },
    // Ftrl 8-2 1
    {
        vilkårshjemmel: {
            lovverk: 'Folketrygdloven',
            lovverksversjon: '2019-01-01',
            paragraf: '8-2',
            ledd: '1',
            setning: null,
            bokstav: null,
        },
        vilkårskode: 'OPPTJT',
        beskrivelse: 'Opptjeningstid',
        mulige_resultater: {
            OPPFYLT: [
                {
                    kode: 'en_kode',
                    beskrivelse: 'Her må det stå noeertert',
                },
            ],
            IKKE_OPPFYLT: [
                {
                    kode: 'en_annen_kode',
                    beskrivelse: 'Her må det stå noe',
                },
            ],
        },
    },
    // Ftrl 8-3 2
    {
        vilkårshjemmel: {
            lovverk: 'Folketrygdloven',
            lovverksversjon: '2019-01-01',
            paragraf: '8-3',
            ledd: '2',
            setning: null,
            bokstav: null,
        },
        vilkårskode: 'MINSTEINNT',
        beskrivelse: 'Har opparbeidet minste inntekt (1/2G) - inntektsgrunnlaget',
        mulige_resultater: {
            OPPFYLT: [
                {
                    kode: 'en_kode',
                    beskrivelse: 'Her må det stå noe',
                },
            ],
            IKKE_OPPFYLT: [
                {
                    kode: 'en_annen_kode',
                    beskrivelse: 'Her må det stå noe',
                },
            ],
        },
    },
    // Ftrl 8-3
    {
        vilkårshjemmel: {
            lovverk: 'Folketrygdloven',
            lovverksversjon: '2019-01-01',
            paragraf: '8-3',
            ledd: null,
            setning: null,
            bokstav: null,
        },
        vilkårskode: 'INNTAP',
        beskrivelse: 'Har tapt pensjonsgivende inntekt på grunn av arbeidsuførhet',
        mulige_resultater: {
            OPPFYLT: [
                {
                    kode: 'en_kode',
                    beskrivelse: 'Her må det stå noe',
                },
            ],
            IKKE_OPPFYLT: [
                {
                    kode: 'en_annen_kode',
                    beskrivelse: 'Her må det stå noe',
                },
            ],
        },
    },
]
