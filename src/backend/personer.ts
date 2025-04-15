import { Arbeidsgiver, RSArbeidssituasjonType, RSSoknad } from '@typer/soknad'

export const personer: Person[] = [
    {
        fodselsnummer: '23826700000',
        aktorId: '992232890123',
        navn: 'Ola Nordmann',
        alder: 42,
        bohenetId: '3453',
        boenhetNavn: 'Oslo kommune',
        beskrivelse: 'To etterfølgende søknader fra en arbeidsgiver',
        soknader: [
            skapSoknad({
                fom: '2025-01-01',
                tom: '2025-01-20',
                id: '1234werw56',
                arbeidsgiver: { navn: 'MATBUTIKKEN', orgnummer: '999333654' },
                arbeidssituasjon: 'ARBEIDSTAKER',
            }),
            skapSoknad({
                fom: '2025-01-21',
                tom: '2025-02-18',
                id: '12werwwerwere3456',
                arbeidsgiver: { navn: 'MATBUTIKKEN', orgnummer: '999333654' },
                arbeidssituasjon: 'ARBEIDSTAKER',
            }),
        ],
    },
    {
        fodselsnummer: '22345678902',
        aktorId: '2234567890123',
        navn: 'Kari Nordmann',
        alder: 35,
        bohenetId: '223456789',
        boenhetNavn: 'Bergen kommune',
        beskrivelse: 'To arbeidsgivere',
        soknader: [
            skapSoknad({
                fom: '2025-01-01',
                tom: '2025-01-20',
                id: '123456',
                arbeidsgiver: { navn: 'MATBUTIKKEN', orgnummer: '999333654' },
                arbeidssituasjon: 'ARBEIDSTAKER',
            }),
            skapSoknad({
                fom: '2025-01-21',
                tom: '2025-02-18',
                id: '12werwe3rewrw456',
                arbeidsgiver: { navn: 'MATBUTIKKEN', orgnummer: '999333654' },
                arbeidssituasjon: 'ARBEIDSTAKER',
            }),
            skapSoknad({
                fom: '2025-01-21',
                tom: '2025-02-18',
                id: '12werwwwee3456',
                arbeidsgiver: { navn: 'KIOSKEN', orgnummer: '23423234' },
                arbeidssituasjon: 'ARBEIDSTAKER',
            }),
        ],
    },
    {
        fodselsnummer: '32345678903',
        aktorId: '3234567890123',
        navn: 'Per Hansen',
        alder: 29,
        bohenetId: '323456789',
        boenhetNavn: 'Trondheim kommune',
        beskrivelse: 'Arbeidstaker og næringsdrivende',

        soknader: [
            skapSoknad({
                fom: '2025-01-21',
                tom: '2025-02-18',
                id: '12werwe34erter56',
                arbeidsgiver: { navn: 'MATBUTIKKEN', orgnummer: '999333654' },
                arbeidssituasjon: 'ARBEIDSTAKER',
            }),
            skapSoknad({
                fom: '2025-01-21',
                tom: '2025-02-18',
                id: '12werwe3456',
                arbeidssituasjon: 'NAERINGSDRIVENDE',
            }),
        ],
    },
    {
        fodselsnummer: '42345678904',
        aktorId: '4234567890123',
        navn: 'Anne Larsen',
        alder: 50,
        bohenetId: '423456789',
        boenhetNavn: 'Stavanger kommune',
        beskrivelse: 'Næringsdrivende',

        soknader: [
            skapSoknad({
                fom: '2025-01-21',
                tom: '2025-02-18',
                id: '12werwswewee3456',
                arbeidssituasjon: 'NAERINGSDRIVENDE',
            }),
        ],
    },
    {
        fodselsnummer: '52345678905',
        aktorId: '5234567890123',
        navn: 'Jonas Olsen',
        alder: 27,
        bohenetId: '523456789',
        boenhetNavn: 'Kristiansand kommune',
        beskrivelse: 'Annet arbeidsforhold',
        soknader: [
            skapSoknad({
                fom: '2025-01-21',
                tom: '2025-02-18',
                id: '12werwswewee432234456',
                arbeidssituasjon: 'ANNET',
            }),
        ],
    },
    {
        fodselsnummer: '62345678906',
        aktorId: '6234567890123',
        navn: 'Maria Nilsen',
        alder: 33,
        bohenetId: '623456789',
        boenhetNavn: 'Tromsø kommune',
    },
    {
        fodselsnummer: '72345678907',
        aktorId: '7234567890123',
        navn: 'Sindre Pedersen',
        alder: 40,
        bohenetId: '723456789',
        boenhetNavn: 'Drammen kommune',
    },
    {
        fodselsnummer: '82345678908',
        aktorId: '8234567890123',
        navn: 'Elin Johansen',
        alder: 38,
        bohenetId: '823456789',
        boenhetNavn: 'Fredrikstad kommune',
    },
    {
        fodselsnummer: '92345678909',
        aktorId: '9234567890123',
        navn: 'Henrik Kristiansen',
        alder: 45,
        bohenetId: '923456789',
        boenhetNavn: 'Porsgrunn kommune',
    },
    {
        fodselsnummer: '02345678910',
        aktorId: '0234567890123',
        navn: 'Linda Berg',
        alder: 32,
        bohenetId: '023456789',
        boenhetNavn: 'Skien kommune',
    },
]

export function hentPerson(aktorid: string): Person | undefined {
    return personer.find((person) => person.aktorId === aktorid)
}

export function hentPersonMedFnr(fnr: string): Person | undefined {
    return personer.find((person) => person.fodselsnummer === fnr)
}

interface Person {
    fodselsnummer: string
    aktorId: string
    navn: string
    alder: number
    bohenetId: string
    boenhetNavn: string
    soknader?: RSSoknad[]
    beskrivelse?: string
}

function skapSoknad(opts: {
    fom: string
    tom: string
    id: string
    grad?: number
    arbeidssituasjon: RSArbeidssituasjonType
    arbeidsgiver?: Arbeidsgiver | null
}): RSSoknad {
    return {
        id: opts.id,
        fom: opts.fom,
        tom: opts.tom,
        soknadstype: 'ARBEIDSTAKERE',
        status: 'SENDT',
        arbeidssituasjon: opts.arbeidssituasjon,
        korrigerer: null,
        korrigertAv: null,
        avbruttDato: null,
        sykmeldingUtskrevet: null,
        startSykeforlop: null,
        opprettetDato: new Date().toISOString(),
        sendtTilNAVDato: null,
        sendtTilArbeidsgiverDato: null,
        arbeidsgiver: opts.arbeidsgiver || null,
        soknadPerioder: [
            {
                fom: opts.fom,
                tom: opts.tom,
                grad: opts.grad || 100,
                sykmeldingstype: 'AKTIVITET_IKKE_MULIG',
            },
        ],
    }
}
