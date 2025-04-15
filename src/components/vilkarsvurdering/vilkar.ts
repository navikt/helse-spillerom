export interface Regel {
    navn: string
    id: string
    lovverk: LovverkPeker[]
    unntakbar?: boolean
}

interface LovverkPeker {
    lovverk: string
    lovverksversjon: string
    paragraf: string
    ledd?: number
    punktum?: number
    bokstav?: string
}

const fellesRegler = [
    {
        navn: 'Søknaden er fremsatt til riktig tid',
        id: 'R1',
        lovverk: [
            {
                lovverk: 'Folketrygdloven',
                lovverksversjon: '2020-01-01',
                paragraf: '22-13',
            },
        ],
    },
    {
        navn: 'Den sykmeldte har tilstrekkelig opptjening',
        id: 'R4',
        unntakbar: true,
        lovverk: [
            {
                lovverk: 'Folketrygdloven',
                lovverksversjon: '2020-01-01',
                paragraf: '8-2',
            },
        ],
    },
    {
        navn: 'Den sykmeldte har tapt pensjonsgivende inntekt på grunn av arbeidsuførhet',
        id: 'R5',
        lovverk: [
            {
                lovverk: 'Folketrygdloven',
                lovverksversjon: '2020-01-01',
                paragraf: '8-3',
            },
        ],
    },
    {
        navn: 'Den sykmeldte oppfyller minstekrav til sykepengegrunnlag',
        id: 'R6',
        lovverk: [
            {
                lovverk: 'Folketrygdloven',
                lovverksversjon: '2020-01-01',
                paragraf: '8-3',
                ledd: 2,
            },
        ],
    },
]

const utenriksfartRegler: Regel[] = [
    {
        navn: 'Den sykmeldte er ansatt på et norsk skip i utenriksfart',
        id: 'R2',
        lovverk: [
            {
                lovverk: 'Folketrygdloven',
                lovverksversjon: '2020-01-01',
                paragraf: '8-44',
                ledd: 1,
                punktum: 1,
            },
        ],
    },
    {
        navn: 'Den sykmeldte er arbeidsufør som arbeidstaker på skip',
        id: 'R3',
        lovverk: [
            {
                lovverk: 'Folketrygdloven',
                lovverksversjon: '2020-01-01',
                paragraf: '8-44',
                ledd: 1,
                bokstav: 'a',
            },
        ],
    },
    {
        navn: 'Unntak fra hovedregelen om tilstrekkelig opptjening er til stede',
        id: 'R4_U',
        unntakbar: true,
        lovverk: [
            {
                lovverk: 'Folketrygdloven',
                lovverksversjon: '2020-01-01',
                paragraf: '8-44',
                bokstav: 'b',
            },
        ],
    },
]

export const regler: Regel[] = [...fellesRegler, ...utenriksfartRegler]

export const sakstyper: { [key: string]: string[] } = {
    Sjømenn: ['R1', 'R2', 'R3', 'R4', 'R4_U', 'R5', 'R6'],
    'Midlertidig ute av inntektsgivende arbeid': ['R1', 'R4', 'R5', 'R6'],
    Annet: ['R1'],
}
