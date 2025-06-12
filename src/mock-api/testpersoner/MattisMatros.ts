import { Testperson } from '@/mock-api/testpersoner/testpersoner'

export const Mattis: Testperson = {
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
            type: 'ARBEIDSTAKERE',
            status: 'SENDT',
            arbeidssituasjon: 'ARBEIDSTAKER',
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
                    sykmeldingstype: 'Sykemldingstype',
                },
            ],
        },
    ],
    saksbehandlingsperioder: [
        {
            id: 'c81515ce-b803-4043-aa77-38d0aca9c4d6',
            spilleromPersonId: 'jf74h',
            opprettet: '2025-03-01T10:00:00Z',
            opprettetAvNavIdent: 'Z123456',
            opprettetAvNavn: 'Test Testesen',
            fom: '2025-03-01',
            tom: '2025-03-31',
        },
    ],
}
