import { Testperson } from '@/mock-api/testpersoner/testpersoner'
import { genererSaksbehandlingsperioder } from '@/mock-api/utils/data-generators'

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
                    sykmeldingstype: 'Sykemldingstype',
                },
            ],
        },
    ],
}

// Generer saksbehandlingsperioder, inntektsforhold og dagoversikt basert på søknader
const periodeDefinisjon = [
    {
        fom: '2025-03-01',
        tom: '2025-03-31',
        søknadIder: ['3'], // Refererer til søknad med id '3'
        uuid: 'c600b6d4-558c-4515-a017-5b6d34cb1f62',
    },
]

const generertData = genererSaksbehandlingsperioder(
    mattisGrunndata.personId,
    mattisGrunndata.soknader,
    periodeDefinisjon,
)

export const Mattis: Testperson = {
    ...mattisGrunndata,
    ...generertData,
}
