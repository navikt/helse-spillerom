import { logger } from '@navikt/next-logger'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { raise } from '@utils/tsUtils'
import { personsøk } from '@/mock-api/personsøk'
import { Søknad } from '@/schemas/søknad'
import { hentPerson } from '@/mock-api/session'
import { Saksbehandlingsperiode } from '@/schemas/saksbehandlingsperiode'
import { finnPerson } from '@/mock-api/testpersoner/testpersoner'

export async function mocketBakrommetData(request: Request, path: string): Promise<Response> {
    logger.info(`Mocking path: ${path}`)
    const personIdFraRequest = request.url.split('/').slice(-2)[0]
    const person = await hentPerson(personIdFraRequest)

    switch (path) {
        case 'GET /v1/[personId]/personinfo': {
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
        }
        case 'GET /v1/[personId]/saksbehandlingsperioder':
            return NextResponse.json(person?.saksbehandlingsperioder || [])

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
            person?.saksbehandlingsperioder.push(nyPeriode)
            return NextResponse.json(nyPeriode, { status: 201 })
        case 'GET /v1/[personId]/soknader':
            const url = new URL(request.url)
            const fom = url.searchParams.get('fom')
            const soknader: Søknad[] = finnPerson(personIdFraRequest)?.soknader || []
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
