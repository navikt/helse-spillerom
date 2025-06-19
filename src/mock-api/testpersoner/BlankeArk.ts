import { Testperson } from '@/mock-api/testpersoner/testpersoner'
import { genererSaksbehandlingsperioder } from '@/mock-api/utils/data-generators'

const blankGrunndata = {
    personId: 'blank',
    personinfo: {
        fødselsnummer: '13064512348',
        aktørId: '1234567891011',
        navn: 'Blanke Ark',
        alder: 22,
    },
    soknader: [],
}

const periodeDefinisjon = [
    {
        fom: '2025-03-01',
        tom: '2025-03-31',
        søknadIder: [],
        uuid: 'c600b6d4-aaaa-4515-a017-5b6d34cb1f62',
    },
]

const generertData = genererSaksbehandlingsperioder(blankGrunndata.personId, blankGrunndata.soknader, periodeDefinisjon)

export const BlankeArk: Testperson = {
    ...blankGrunndata,
    saksbehandlingsperioder: generertData.saksbehandlingsperioder,
    inntektsforhold: generertData.inntektsforhold,
    dagoversikt: generertData.dagoversikt,
    dokumenter: generertData.dokumenter,
}
