import { Testperson } from '@/mock-api/testpersoner/testpersoner'

// Grunndata for Mattis
const mattisGrunndata = {
    personId: 'jf74h',
    personinfo: {
        fødselsnummer: '13065212348',
        aktørId: '1234567891011',
        navn: 'Mattis Matros',
        alder: 18,
    },
    soknader: [
        {
            id: '3',
            type: 'ARBEIDSTAKERE' as const,
            status: 'SENDT' as const,
            arbeidssituasjon: 'ARBEIDSTAKER' as const,
            fom: '2025-03-01',
            tom: '2025-03-31',
            korrigerer: null,
            korrigertAv: null,
            sykmeldingSkrevet: '2025-01-01',
            startSyketilfelle: '2025-01-01',
            opprettet: '2025-01-01',
            sendtNav: '2025-01-01',
            sendtArbeidsgiver: '2025-01-01',
            arbeidsgiver: {
                navn: 'Danskebåten',
                orgnummer: '889955555',
            },
            soknadsperioder: [
                {
                    fom: '2025-03-01',
                    tom: '2025-03-31',
                    grad: 100,
                    faktiskGrad: 82,
                    sykmeldingstype: 'Sykemldingstype',
                },
            ],
        },
    ],
}

export const Mattis: Testperson = {
    ...mattisGrunndata,
    saksbehandlingsperioder: [],
    inntektsforhold: {},
    dagoversikt: {},
    dokumenter: {},
}
