import { NextResponse } from 'next/server'

import { ErrorResponse } from '@/auth/beskyttetApi'
import { Søknad } from '@/schemas/søknad'

export async function GET(): Promise<NextResponse<Søknad[] | ErrorResponse>> {
    return NextResponse.json([
        {
            id: '1',
            søknadstype: 'ARBEIDSTAKERE',
            status: 'NY',
            arbeidssituasjon: 'ARBEIDSTAKER',
            fom: '2025-01-01',
            tom: '2025-01-31',
            korrigerer: null,
            korrigertAv: null,
            avbruttDato: null,
            sykmeldingUtskrevet: '2025-01-01',
            startSykeforlop: '2025-01-01',
            opprettetDato: '2025-01-01',
            sendtTilNAVDato: '2025-01-01',
            sendtTilArbeidsgiverDato: '2025-01-01',
            arbeidsgiver: {
                navn: 'Arbeidsgiver navn',
                orgnummer: '123456789',
            },
            søknadsPerioder: [
                {
                    fom: '2025-01-01',
                    tom: '2025-01-31',
                    grad: 100,
                    sykmeldingstype: 'Sykemldingstype',
                },
            ],
        },
    ])
}
