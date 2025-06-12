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
    inntektsforhold: {
        'c81515ce-b803-4043-aa77-38d0aca9c4d6': [
            {
                id: '8a7f2e95-c1ba-4350-8850-423f7d8ebc7e',
                inntektsforholdtype: 'ORDINÆRT_ARBEIDSFORHOLD',
                sykmeldtFraForholdet: true,
                orgnummer: '889955555',
                orgnavn: 'Danskebåten',
            },
        ],
    },
    dagoversikt: {
        '8a7f2e95-c1ba-4350-8850-423f7d8ebc7e': [
            {
                id: 'f5ba7c6d-9e0f-2a3b-6c7d-0f1a2b3c4d5e',
                type: 'HELGEDAG',
                dato: '2025-03-01',
            },
            {
                id: 'a6cb8d7e-0f1a-3b4c-7d8e-1a2b3c4d5e6f',
                type: 'HELGEDAG',
                dato: '2025-03-02',
            },
            {
                id: 'b7dc9e8f-1a2b-4c5d-8e9f-2b3c4d5e6f7a',
                type: 'SYKEDAG',
                dato: '2025-03-03',
            },
            {
                id: 'c8ed0f9a-2b3c-5d6e-9f0a-3c4d5e6f7a8b',
                type: 'SYKEDAG',
                dato: '2025-03-04',
            },
            {
                id: 'd9fe1a0b-3c4d-6e7f-0a1b-4d5e6f7a8b9c',
                type: 'SYKEDAG',
                dato: '2025-03-05',
            },
            {
                id: 'e0af2b1c-4d5e-7f8a-1b2c-5e6f7a8b9c0d',
                type: 'SYKEDAG',
                dato: '2025-03-06',
            },
            {
                id: 'f1ba3c2d-5e6f-8a9b-2c3d-6f7a8b9c0d1e',
                type: 'SYKEDAG',
                dato: '2025-03-07',
            },
            {
                id: 'a2cb4d3e-6f7a-9b0c-3d4e-7a8b9c0d1e2f',
                type: 'HELGEDAG',
                dato: '2025-03-08',
            },
            {
                id: 'b3dc5e4f-7a8b-0c1d-4e5f-8b9c0d1e2f3a',
                type: 'HELGEDAG',
                dato: '2025-03-09',
            },
            {
                id: 'c4ed6f5a-8b9c-1d2e-5f6a-9c0d1e2f3a4b',
                type: 'SYKEDAG',
                dato: '2025-03-10',
            },
            {
                id: 'd5fe7a6b-9c0d-2e3f-6a7b-0d1e2f3a4b5c',
                type: 'SYKEDAG',
                dato: '2025-03-11',
            },
            {
                id: 'e6af8b7c-0d1e-3f4a-7b8c-1e2f3a4b5c6d',
                type: 'SYKEDAG',
                dato: '2025-03-12',
            },
            {
                id: 'f7ba9c8d-1e2f-4a5b-8c9d-2f3a4b5c6d7e',
                type: 'SYKEDAG',
                dato: '2025-03-13',
            },
            {
                id: 'a8cb0d9e-2f3a-5b6c-9d0e-3a4b5c6d7e8f',
                type: 'SYKEDAG',
                dato: '2025-03-14',
            },
            {
                id: 'b9dc1e0f-3a4b-6c7d-0e1f-4b5c6d7e8f9a',
                type: 'HELGEDAG',
                dato: '2025-03-15',
            },
            {
                id: 'c0ed2f1a-4b5c-7d8e-1f2a-5c6d7e8f9a0b',
                type: 'HELGEDAG',
                dato: '2025-03-16',
            },
            {
                id: 'd1fe3a2b-5c6d-8e9f-2a3b-6d7e8f9a0b1c',
                type: 'SYKEDAG',
                dato: '2025-03-17',
            },
            {
                id: 'e2af4b3c-6d7e-9f0a-3b4c-7e8f9a0b1c2d',
                type: 'SYKEDAG',
                dato: '2025-03-18',
            },
            {
                id: 'f3ba5c4d-7e8f-0a1b-4c5d-8f9a0b1c2d3e',
                type: 'SYKEDAG',
                dato: '2025-03-19',
            },
            {
                id: 'a4cb6d5e-8f9a-1b2c-5d6e-9a0b1c2d3e4f',
                type: 'SYKEDAG',
                dato: '2025-03-20',
            },
            {
                id: 'b5dc7e6f-9a0b-2c3d-6e7f-0b1c2d3e4f5a',
                type: 'SYKEDAG',
                dato: '2025-03-21',
            },
            {
                id: 'c6ed8f7a-0b1c-3d4e-7f8a-1c2d3e4f5a6b',
                type: 'HELGEDAG',
                dato: '2025-03-22',
            },
            {
                id: 'd7fe9a8b-1c2d-4e5f-8a9b-2d3e4f5a6b7c',
                type: 'HELGEDAG',
                dato: '2025-03-23',
            },
            {
                id: 'e8af0b9c-2d3e-5f6a-9b0c-3e4f5a6b7c8d',
                type: 'SYKEDAG',
                dato: '2025-03-24',
            },
            {
                id: 'f9ba1c0d-3e4f-6a7b-0c1d-4f5a6b7c8d9e',
                type: 'SYKEDAG',
                dato: '2025-03-25',
            },
            {
                id: 'a0cb2d1e-4f5a-7b8c-1d2e-5a6b7c8d9e0f',
                type: 'SYKEDAG',
                dato: '2025-03-26',
            },
            {
                id: 'b1dc3e2f-5a6b-8c9d-2e3f-6b7c8d9e0f1a',
                type: 'SYKEDAG',
                dato: '2025-03-27',
            },
            {
                id: 'c2ed4f3a-6b7c-9d0e-3f4a-7c8d9e0f1a2b',
                type: 'SYKEDAG',
                dato: '2025-03-28',
            },
            {
                id: 'd3fe5a4b-7c8d-0e1f-4a5b-8d9e0f1a2b3c',
                type: 'HELGEDAG',
                dato: '2025-03-29',
            },
            {
                id: 'e4af6b5c-8d9e-1f2a-5b6c-9e0f1a2b3c4d',
                type: 'HELGEDAG',
                dato: '2025-03-30',
            },
            {
                id: 'f5ba7c6d-9e0f-2a3b-6c7d-0f1a2b3c4d52',
                type: 'SYKEDAG',
                dato: '2025-03-31',
            },
        ],
    },
}
