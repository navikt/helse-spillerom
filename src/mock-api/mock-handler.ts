import { logger } from '@navikt/next-logger'
import { NextResponse } from 'next/server'

import { raise } from '@utils/tsUtils'
import { personsok } from '@/mock-api/personsok'
import { Søknad } from '@/schemas/søknad'

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
            const soknader: Søknad[] = [
                {
                    id: '1',
                    type: 'ARBEIDSTAKERE',
                    status: 'NY',
                    arbeidssituasjon: 'ARBEIDSTAKER',
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
                        navn: 'Annen Arbeidsgiver',
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
                    id: '1',
                    type: 'ARBEIDSTAKERE',
                    status: 'NY',
                    arbeidssituasjon: 'ARBEIDSTAKER',
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
                        navn: 'Arbeidsgiver Navn',
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
            ]
            return NextResponse.json(soknader)
        case 'GET /v1/[personId]/dokumenter':
            return NextResponse.json([
                {
                    id: '1',
                    type: 'INNTEKTSMELDING',
                    sendtTilNAVTidsunkt: '2025-01-01T09:12:10',
                },
                {
                    id: '2',
                    type: 'SØKNAD',
                    sendtTilNAVTidsunkt: '2025-01-01T08:06:30',
                },
                {
                    id: '3',
                    type: 'SYKMELDING',
                    sendtTilNAVTidsunkt: '2025-01-01T07:30:00',
                },
            ])
        case 'POST /v1/personsok':
            return personsok(request)
        default:
            raise(new Error(`Unknown path: ${path}`))
    }
}
