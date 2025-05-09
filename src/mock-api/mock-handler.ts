import { logger } from '@navikt/next-logger'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { raise } from '@utils/tsUtils'
import { personsøk } from '@/mock-api/personsøk'
import { Søknad } from '@/schemas/søknad'
import { hentPerson } from '@/mock-api/session'
import { Saksbehandlingsperiode } from '@/schemas/saksbehandlingsperiode'

export async function mocketBakrommetData(request: Request, path: string): Promise<Response> {
    logger.info(`Mocking path: ${path}`)
    const personIdFraRequest = request.url.split('/').slice(-2)[0]

    switch (path) {
        case 'GET /v1/[personId]/personinfo':
            const person = await hentPerson(personIdFraRequest)
            if (!person) {
                return NextResponse.json(
                    {
                        message: 'Person not found',
                    },
                    { status: 404 },
                )
            }
            return NextResponse.json({
                fødselsnummer: person.fnr,
                aktørId: person.personinfo.aktørId,
                navn: person.personinfo.navn,
                alder: person.personinfo.alder,
            })
        case 'GET /v1/[personId]/saksbehandlingsperioder':
            const perioder: Saksbehandlingsperiode[] = [
                {
                    id: uuidv4(),
                    spilleromPersonId: personIdFraRequest,
                    opprettet: new Date().toISOString(),
                    opprettetAvNavIdent: 'Z123456',
                    opprettetAvNavn: 'Test Testesen',
                    fom: '2024-03-01',
                    tom: '2024-03-31',
                },
                {
                    id: uuidv4(),
                    spilleromPersonId: personIdFraRequest,
                    opprettet: new Date().toISOString(),
                    opprettetAvNavIdent: 'Z123456',
                    opprettetAvNavn: 'Test Testesen',
                    fom: '2024-04-01',
                    tom: '2024-04-30',
                },
            ]
            return NextResponse.json(perioder)
        case 'POST /v1/[personId]/saksbehandlingsperioder':
            const body = await request.json()
            const nyPeriode: Saksbehandlingsperiode = {
                id: uuidv4(),
                spilleromPersonId: personIdFraRequest,
                opprettet: new Date().toISOString(),
                opprettetAvNavIdent: 'Z123456',
                opprettetAvNavn: 'Test Testesen',
                fom: body.fom,
                tom: body.tom,
            }
            return NextResponse.json(nyPeriode, { status: 201 })
        case 'GET /v1/[personId]/soknader':
            const url = new URL(request.url)
            const fom = url.searchParams.get('fom')
            const soknader: Søknad[] = [
                {
                    id: '1',
                    type: 'ARBEIDSTAKERE',
                    status: 'NY',
                    arbeidssituasjon: 'ARBEIDSTAKER',
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
                        navn: 'Arbeidsgivernavn 1',
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
                    id: '1',
                    type: 'ARBEIDSTAKERE',
                    status: 'NY',
                    arbeidssituasjon: 'ARBEIDSTAKER',
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
                        navn: 'Arbeidsgivernavn 1',
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
                        navn: 'Arbeidsgivernavn 1',
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
                    id: '2',
                    type: 'ARBEIDSTAKERE',
                    status: 'NY',
                    arbeidssituasjon: 'ARBEIDSTAKER',
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
                        navn: 'Arbeidsgivernavn 1',
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
                    id: '3',
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
                        navn: 'Arbeidsgivernavn 2',
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
                    id: '4',
                    type: 'ARBEIDSTAKERE',
                    status: 'NY',
                    arbeidssituasjon: 'ARBEIDSTAKER',
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
                        navn: 'Arbeidsgivernavn 2',
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
                    id: '5',
                    type: 'ARBEIDSTAKERE',
                    status: 'NY',
                    arbeidssituasjon: 'ARBEIDSTAKER',
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
                        navn: 'Arbeidsgivernavn 2',
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
            ]
            return NextResponse.json(
                soknader.filter((soknad) => {
                    //soknad fom er lik eller større enn fom
                    if (!fom) return true
                    const fomDate = new Date(fom)
                    const soknadFomDate = new Date(soknad.fom!)
                    return soknadFomDate >= fomDate
                }),
            )
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
            return personsøk(request)
        default:
            raise(new Error(`Unknown path: ${path}`))
    }
}
