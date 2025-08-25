import { Testperson } from '@/mock-api/testpersoner/testpersoner'
import { genererSaksbehandlingsperioder } from '@/mock-api/utils/saksbehandlingsperiode-generator'

// Grunndata for Kalle
const kalleGrunndata = {
    personId: '8j4ns',
    personinfo: {
        fødselsnummer: '12345678901',
        aktørId: '1234567891011',
        navn: 'Kalle Kranfører',
        alder: 47,
    },
    soknader: [
        {
            id: '1',
            type: 'ARBEIDSTAKERE' as const,
            status: 'NY' as const,
            arbeidssituasjon: 'ARBEIDSTAKER' as const,
            fom: '2024-08-02',
            tom: '2024-08-09',
            korrigerer: null,
            korrigertAv: null,
            sykmeldingSkrevet: '2024-08-02',
            startSyketilfelle: '2024-08-02',
            opprettet: '2024-08-02',
            sendtNav: '2024-08-02',
            sendtArbeidsgiver: '2024-08-02',
            arbeidsgiver: {
                navn: 'Kranførerkompaniet',
                orgnummer: '987654321',
            },
            soknadsperioder: [
                {
                    fom: '2024-08-02',
                    tom: '2024-08-09',
                    grad: 100,
                    sykmeldingstype: 'Sykemldingstype',
                },
            ],
        },
        {
            id: '2',
            type: 'ARBEIDSTAKERE' as const,
            status: 'NY' as const,
            arbeidssituasjon: 'ARBEIDSTAKER' as const,
            fom: '2024-08-10',
            tom: '2024-09-22',
            korrigerer: null,
            korrigertAv: null,
            sykmeldingSkrevet: '2024-08-10',
            startSyketilfelle: '2024-08-10',
            opprettet: '2024-08-10',
            sendtNav: '2024-08-10',
            sendtArbeidsgiver: '2024-08-10',
            arbeidsgiver: {
                navn: 'Kranførerkompaniet',
                orgnummer: '987654321',
            },
            soknadsperioder: [
                {
                    fom: '2024-08-10',
                    tom: '2024-09-22',
                    grad: 100,
                    sykmeldingstype: 'Sykemldingstype',
                },
            ],
        },
        {
            id: '3',
            type: 'ARBEIDSTAKERE' as const,
            status: 'NY' as const,
            arbeidssituasjon: 'ARBEIDSTAKER' as const,
            fom: '2025-01-01',
            tom: '2025-01-31',
            korrigerer: null,
            korrigertAv: null,
            sykmeldingSkrevet: '2025-01-01',
            startSyketilfelle: '2025-01-01',
            opprettet: '2025-01-01',
            sendtNav: '2025-01-01',
            sendtArbeidsgiver: '2025-01-01',
            arbeidsgiver: {
                navn: 'Kranførerkompaniet',
                orgnummer: '987654321',
            },
            soknadsperioder: [
                {
                    fom: '2025-01-01',
                    tom: '2025-01-31',
                    grad: 100,
                    sykmeldingstype: 'Sykemldingstype',
                },
            ],
        },
        {
            id: '4',
            type: 'ARBEIDSTAKERE' as const,
            status: 'NY' as const,
            arbeidssituasjon: 'ARBEIDSTAKER' as const,
            fom: '2025-02-01',
            tom: '2025-02-28',
            korrigerer: null,
            korrigertAv: null,
            sykmeldingSkrevet: '2025-01-01',
            startSyketilfelle: '2025-01-01',
            opprettet: '2025-01-01',
            sendtNav: '2025-01-01',
            sendtArbeidsgiver: '2025-01-01',
            arbeidsgiver: {
                navn: 'Kranførerkompaniet',
                orgnummer: '987654321',
            },
            soknadsperioder: [
                {
                    fom: '2025-02-01',
                    tom: '2025-02-28',
                    grad: 100,
                    sykmeldingstype: 'Sykemldingstype',
                },
            ],
        },
        {
            id: '5',
            type: 'ARBEIDSTAKERE' as const,
            status: 'NY' as const,
            arbeidssituasjon: 'ARBEIDSTAKER' as const,
            fom: '2025-01-01',
            tom: '2025-01-31',
            korrigerer: null,
            korrigertAv: null,
            sykmeldingSkrevet: '2025-01-01',
            startSyketilfelle: '2025-01-01',
            opprettet: '2025-01-01',
            sendtNav: '2025-01-01',
            sendtArbeidsgiver: '2025-01-01',
            arbeidsgiver: {
                navn: 'Krankompisen',
                orgnummer: '123456789',
            },
            soknadsperioder: [
                {
                    fom: '2025-01-01',
                    tom: '2025-01-31',
                    grad: 100,
                    sykmeldingstype: 'Sykemldingstype',
                },
            ],
        },
        {
            id: '6',
            type: 'ARBEIDSTAKERE' as const,
            status: 'NY' as const,
            arbeidssituasjon: 'ARBEIDSTAKER' as const,
            fom: '2024-01-01',
            tom: '2024-01-31',
            korrigerer: null,
            korrigertAv: null,
            sykmeldingSkrevet: '2024-01-01',
            startSyketilfelle: '2024-01-01',
            opprettet: '2024-01-01',
            sendtNav: '2024-01-01',
            sendtArbeidsgiver: '2024-01-01',
            arbeidsgiver: {
                navn: 'Krankompisen',
                orgnummer: '123456789',
            },
            soknadsperioder: [
                {
                    fom: '2024-01-01',
                    tom: '2024-01-31',
                    grad: 100,
                    sykmeldingstype: 'Sykemldingstype',
                },
            ],
        },
        {
            id: '7',
            type: 'ARBEIDSTAKERE' as const,
            status: 'NY' as const,
            arbeidssituasjon: 'ARBEIDSTAKER' as const,
            fom: '2023-01-01',
            tom: '2023-01-31',
            korrigerer: null,
            korrigertAv: null,
            sykmeldingSkrevet: '2023-01-01',
            startSyketilfelle: '2023-01-01',
            opprettet: '2023-01-01',
            sendtNav: '2023-01-01',
            sendtArbeidsgiver: '2023-01-01',
            arbeidsgiver: {
                navn: 'Krankompisen',
                orgnummer: '123456789',
            },
            soknadsperioder: [
                {
                    fom: '2023-01-01',
                    tom: '2023-01-31',
                    grad: 100,
                    sykmeldingstype: 'Sykemldingstype',
                },
            ],
        },
    ],
}

const periodeDefinisjon = [
    {
        fom: '2025-01-01',
        tom: '2025-02-28',
        søknadIder: ['3', '4', '5'], // Søknad 3 og 5 har samme periode, men ulik arbeidsgiver
        uuid: '607f8e85-b0ba-4240-9950-383f6d7eac9e',
    },

    {
        fom: '2024-08-02',
        tom: '2024-08-09',
        søknadIder: ['1'], // Refererer til søknad med id '1'
        uuid: '607f8e85-aaaa-4240-9950-383f6d7eac9e',
    },
]

const generertData = genererSaksbehandlingsperioder(kalleGrunndata.personId, kalleGrunndata.soknader, periodeDefinisjon)

export const Kalle: Testperson = {
    ...kalleGrunndata,
    saksbehandlingsperioder: generertData.saksbehandlingsperioder,
    yrkesaktivitet: generertData.yrkesaktivitet,
    dagoversikt: generertData.dagoversikt,
    dokumenter: generertData.dokumenter,
}
