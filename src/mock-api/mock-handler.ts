import { logger } from '@navikt/next-logger'
import { NextResponse } from 'next/server'

import { raise } from '@utils/tsUtils'

export async function mocketBakrommetData(request: Request, path: string): Promise<Response> {
    logger.info(`Mocking path: ${path}`)

    switch (path) {
        case 'GET /v1/[personId]/personinfo':
            return NextResponse.json({
                fødselsnummer: '62345678906',
                aktørId: '1234567891011',
                navn: 'Kalle Kranfører',
                alder: 47,
            })
        case 'GET /v1/[personId]/soknader':
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
                        navn: 'Annen Arbeidsgiver',
                        orgnummer: '987654321',
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
                        navn: 'Arbeidsgiver Navn',
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
        case 'POST /v1/personsok':
            return NextResponse.json({ personId: 'abc45' })
        default:
            raise(new Error(`Unknown path: ${path}`))
    }
}
