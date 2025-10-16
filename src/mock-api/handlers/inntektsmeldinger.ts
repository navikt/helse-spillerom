import { NextResponse } from 'next/server'

import { Inntektsmelding } from '../../schemas/inntektsmelding'

const mockInntektsmeldinger: Inntektsmelding[] = [
    {
        inntektsmeldingId: '67e56f3c-6eee-4378-b9e3-ad8be6b7a111',
        arbeidstakerFnr: '12345678787',
        arbeidstakerAktorId: '213456',
        virksomhetsnummer: '910825585',
        arbeidsgiverFnr: null,
        arbeidsgiverAktorId: null,
        begrunnelseForReduksjonEllerIkkeUtbetalt: '',
        arbeidsgivertype: 'VIRKSOMHET',
        arbeidsforholdId: '123456789',
        beregnetInntekt: '52000.00',
        innsenderFulltNavn: 'Test Testesen',
        innsenderTelefon: '12345',
        refusjon: {
            beloepPrMnd: null,
            opphoersdato: null,
        },
        endringIRefusjoner: [],
        opphoerAvNaturalytelser: [],
        gjenopptakelseNaturalytelser: [],
        arbeidsgiverperioder: [
            {
                fom: '2023-04-18',
                tom: '2023-05-03',
            },
        ],
        status: 'GYLDIG',
        arkivreferanse: 'AR13764323',
        ferieperioder: [],
        foersteFravaersdag: '2023-04-18',
        mottattDato: '2023-05-16T08:49:43',
        naerRelasjon: true,
        avsenderSystem: {
            navn: 'AltinnPortal',
            versjon: '1.489',
        },
        arsakTilInnsending: 'Ny',
        forespurt: false,
    },
    {
        inntektsmeldingId: '78f67g4d-7fff-5489-c0f4-be9f7c8b8a222',
        arbeidstakerFnr: '12345678787',
        arbeidstakerAktorId: '213456',
        virksomhetsnummer: '910825585',
        arbeidsgiverFnr: null,
        arbeidsgiverAktorId: null,
        begrunnelseForReduksjonEllerIkkeUtbetalt: '',
        arbeidsgivertype: 'VIRKSOMHET',
        arbeidsforholdId: '123456789',
        beregnetInntekt: '48000.00',
        innsenderFulltNavn: 'Kari Nordmann',
        innsenderTelefon: '54321',
        refusjon: {
            beloepPrMnd: '48000.00',
            opphoersdato: '2023-06-15',
        },
        endringIRefusjoner: [],
        opphoerAvNaturalytelser: [],
        gjenopptakelseNaturalytelser: [],
        arbeidsgiverperioder: [
            {
                fom: '2023-05-04',
                tom: '2023-05-18',
            },
        ],
        status: 'GYLDIG',
        arkivreferanse: 'AR13764324',
        ferieperioder: [],
        foersteFravaersdag: '2023-05-04',
        mottattDato: '2023-05-20T10:30:15',
        naerRelasjon: false,
        avsenderSystem: {
            navn: 'AltinnPortal',
            versjon: '1.489',
        },
        arsakTilInnsending: 'Endring',
        forespurt: true,
    },
    {
        inntektsmeldingId: '89g78h5e-8ggg-6590-d1g5-cf0g8d9c9b333',
        arbeidstakerFnr: '12345678787',
        arbeidstakerAktorId: '213456',
        virksomhetsnummer: '910825585',
        arbeidsgiverFnr: null,
        arbeidsgiverAktorId: null,
        begrunnelseForReduksjonEllerIkkeUtbetalt: 'Redusert arbeidstid',
        arbeidsgivertype: 'VIRKSOMHET',
        arbeidsforholdId: '123456789',
        beregnetInntekt: '35000.00',
        innsenderFulltNavn: 'Ola Hansen',
        innsenderTelefon: '98765',
        refusjon: {
            beloepPrMnd: null,
            opphoersdato: null,
        },
        endringIRefusjoner: [],
        opphoerAvNaturalytelser: [],
        gjenopptakelseNaturalytelser: [],
        arbeidsgiverperioder: [
            {
                fom: '2023-05-19',
                tom: '2023-06-02',
            },
        ],
        status: 'GYLDIG',
        arkivreferanse: 'AR13764325',
        ferieperioder: [],
        foersteFravaersdag: '2023-05-19',
        mottattDato: '2023-06-05T14:22:30',
        naerRelasjon: false,
        avsenderSystem: {
            navn: 'AltinnPortal',
            versjon: '1.489',
        },
        arsakTilInnsending: 'Ny',
        forespurt: false,
    },
]

export async function handleGetInntektsmeldinger(): Promise<Response> {
    return NextResponse.json(mockInntektsmeldinger)
}
