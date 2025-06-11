import { logger } from '@navikt/next-logger'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { raise } from '@utils/tsUtils'
import { personsøk } from '@/mock-api/personsøk'
import { Søknad } from '@/schemas/søknad'
import { hentPerson } from '@/mock-api/session'
import { finnPerson } from '@/mock-api/testpersoner/testpersoner'
import { mockArbeidsforhold } from '@/mock-api/aareg'
import { Vilkaarsvurdering } from '@/schemas/vilkaarsvurdering'
import { Inntektsforhold } from '@/schemas/inntektsforhold'

import { ainntektData } from './ainntekt'

function hentPersonIdFraUrl(url: string): string {
    const parts = url.split('/')
    // Finn indeksen til 'v1' og ta neste del som er personId
    const v1Index = parts.findIndex((part) => part === 'v1')
    if (v1Index === -1 || v1Index + 1 >= parts.length) {
        throw new Error('Kunne ikke finne personId i URL')
    }
    return parts[v1Index + 1]
}

function hentUuidFraUrl(url: string): string {
    const parts = url.split('/')
    // Finn indeksen til 'saksbehandlingsperioder' og ta neste del som er uuid
    const periodeIndex = parts.findIndex((part) => part === 'saksbehandlingsperioder')
    if (periodeIndex === -1 || periodeIndex + 1 >= parts.length) {
        throw new Error('Kunne ikke finne UUID i URL')
    }
    return parts[periodeIndex + 1]
}

export async function mocketBakrommetData(request: Request, path: string): Promise<Response> {
    logger.info(`Mocking path: ${path}`)
    const personIdFraRequest = hentPersonIdFraUrl(request.url)
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
            const nyPeriode = {
                id: uuidv4(),
                spilleromPersonId: personIdFraRequest,
                opprettet: new Date().toISOString(),
                opprettetAvNavIdent: 'Z123456',
                opprettetAvNavn: 'Test Testesen',
                fom: body.fom,
                tom: body.tom,
                sykepengesoknadIder: body.sykepengesoknadIder || [],
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
        case 'GET /v1/[personId]/arbeidsforhold':
            return NextResponse.json(mockArbeidsforhold)
        case 'GET /v1/[personId]/ainntekt':
            return NextResponse.json(ainntektData)
        case 'POST /v1/personsok':
            return personsøk(request)
        case 'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaar': {
            if (!person) {
                return NextResponse.json({ message: 'Person not found' }, { status: 404 })
            }
            const uuid = hentUuidFraUrl(request.url)
            if (!person?.vilkaarsvurderinger) {
                person.vilkaarsvurderinger = {}
            }
            return NextResponse.json(person.vilkaarsvurderinger[uuid] || [])
        }
        case 'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaar/[kode]': {
            if (!person) {
                return NextResponse.json({ message: 'Person not found' }, { status: 404 })
            }
            const uuid = hentUuidFraUrl(request.url)
            const kode = request.url.split('/').pop()!
            const body = await request.json()
            const nyVurdering: Vilkaarsvurdering = {
                kode,
                vurdering: body.vurdering,
                årsak: body.årsak,
                notat: body.notat,
            }

            if (!person?.vilkaarsvurderinger) {
                person.vilkaarsvurderinger = {}
            }
            if (!person.vilkaarsvurderinger[uuid]) {
                person.vilkaarsvurderinger[uuid] = []
            }

            const existingIndex = person.vilkaarsvurderinger[uuid].findIndex((v) => v.kode === kode)
            if (existingIndex >= 0) {
                person.vilkaarsvurderinger[uuid][existingIndex] = nyVurdering
            } else {
                person.vilkaarsvurderinger[uuid].push(nyVurdering)
            }

            return NextResponse.json(nyVurdering, { status: 201 })
        }
        case 'DELETE /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaar/[kode]': {
            if (!person) {
                return NextResponse.json({ message: 'Person not found' }, { status: 404 })
            }
            const uuid = hentUuidFraUrl(request.url)
            const kode = request.url.split('/').pop()!

            if (!person?.vilkaarsvurderinger?.[uuid]) {
                return NextResponse.json({ message: 'Vilkaarsvurdering not found' }, { status: 404 })
            }

            const existingIndex = person.vilkaarsvurderinger[uuid].findIndex((v) => v.kode === kode)
            if (existingIndex >= 0) {
                person.vilkaarsvurderinger[uuid].splice(existingIndex, 1)
                return new NextResponse(null, { status: 204 })
            }

            return NextResponse.json({ message: 'Vilkaarsvurdering not found' }, { status: 404 })
        }
        case 'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/inntektsforhold': {
            if (!person) {
                return NextResponse.json({ message: 'Person not found' }, { status: 404 })
            }
            const uuid = hentUuidFraUrl(request.url)
            if (!person?.inntektsforhold) {
                person.inntektsforhold = {}
            }
            return NextResponse.json(person.inntektsforhold[uuid] || [])
        }
        case 'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/inntektsforhold': {
            if (!person) {
                return NextResponse.json({ message: 'Person not found' }, { status: 404 })
            }
            const uuid = hentUuidFraUrl(request.url)
            const body = await request.json()
            const nyttInntektsforhold: Inntektsforhold = {
                id: uuidv4(),
                inntektsforholdtype: body.inntektsforholdtype,
                sykmeldtFraForholdet: body.sykmeldtFraForholdet,
            }

            if (!person?.inntektsforhold) {
                person.inntektsforhold = {}
            }
            if (!person.inntektsforhold[uuid]) {
                person.inntektsforhold[uuid] = []
            }

            person.inntektsforhold[uuid].push(nyttInntektsforhold)

            return NextResponse.json(nyttInntektsforhold, { status: 201 })
        }
        default:
            raise(new Error(`Unknown path: ${path}`))
    }
}
