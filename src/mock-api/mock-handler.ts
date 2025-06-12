import { logger } from '@navikt/next-logger'
import { NextResponse } from 'next/server'

import { raise } from '@utils/tsUtils'
import { personsøk } from '@/mock-api/personsøk'
import { hentPerson } from '@/mock-api/session'
import { mockArbeidsforhold } from '@/mock-api/aareg'
import { hentPersonIdFraUrl, hentUuidFraUrl, hentInntektsforholdUuidFraUrl } from '@/mock-api/utils/url-utils'
import { handlePersoninfo, handleDokumenter } from '@/mock-api/handlers/person-handlers'
import {
    handleGetSaksbehandlingsperioder,
    handlePostSaksbehandlingsperioder,
} from '@/mock-api/handlers/saksbehandlingsperiode-handlers'
import { handleGetSoknader } from '@/mock-api/handlers/soknad-handlers'
import { handleGetVilkaar, handlePutVilkaar, handleDeleteVilkaar } from '@/mock-api/handlers/vilkaar-handlers'
import {
    handleGetInntektsforhold,
    handlePostInntektsforhold,
    handleGetDagoversikt,
} from '@/mock-api/handlers/inntektsforhold-handlers'

import { ainntektData } from './ainntekt'

interface HandlerContext {
    request: Request
    person?: ReturnType<typeof hentPerson>
    personId: string
    uuid?: string
    inntektsforholdId?: string
    kode?: string
}

type HandlerFunction = (context: HandlerContext) => Promise<Response>

const handlers: Record<string, HandlerFunction> = {
    'GET /v1/[personId]/personinfo': async ({ person }) => handlePersoninfo(await person),

    'GET /v1/[personId]/saksbehandlingsperioder': async ({ person }) => handleGetSaksbehandlingsperioder(await person),

    'POST /v1/[personId]/saksbehandlingsperioder': async ({ request, person, personId }) =>
        handlePostSaksbehandlingsperioder(request, await person, personId),

    'GET /v1/[personId]/soknader': async ({ request, personId }) => handleGetSoknader(request, personId),

    'GET /v1/[personId]/dokumenter': async () => handleDokumenter(),

    'GET /v1/[personId]/arbeidsforhold': async () => NextResponse.json(mockArbeidsforhold),

    'GET /v1/[personId]/ainntekt': async () => NextResponse.json(ainntektData),

    'POST /v1/personsok': async ({ request }) => personsøk(request),

    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaar': async ({ person, uuid }) =>
        handleGetVilkaar(await person, uuid!),

    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaar/[kode]': async ({ request, person, uuid, kode }) =>
        handlePutVilkaar(request, await person, uuid!, kode!),

    'DELETE /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaar/[kode]': async ({ person, uuid, kode }) =>
        handleDeleteVilkaar(await person, uuid!, kode!),

    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/inntektsforhold': async ({ person, uuid }) =>
        handleGetInntektsforhold(await person, uuid!),

    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/inntektsforhold': async ({ request, person, uuid }) =>
        handlePostInntektsforhold(request, await person, uuid!),

    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/inntektsforhold/[uuid]/dagoversikt': async ({
        person,
        inntektsforholdId,
    }) => handleGetDagoversikt(await person, inntektsforholdId!),
}

export async function mocketBakrommetData(request: Request, path: string): Promise<Response> {
    logger.info(`Mocking path: ${path}`)

    try {
        const personId = hentPersonIdFraUrl(request.url)
        const person = hentPerson(personId)

        // Prepare context
        const context: HandlerContext = {
            request,
            person,
            personId,
        }

        // Extract additional parameters based on path
        if (path.includes('/saksbehandlingsperioder/') && path.includes('[uuid]')) {
            context.uuid = hentUuidFraUrl(request.url)
        }

        if (path.includes('/inntektsforhold/') && path.includes('/dagoversikt')) {
            context.inntektsforholdId = hentInntektsforholdUuidFraUrl(request.url)
        }

        if (path.includes('/vilkaar/') && path.split('/').length > 6) {
            context.kode = request.url.split('/').pop()!
        }

        // Find and execute handler
        const handler = handlers[path]
        if (handler) {
            return await handler(context)
        }

        raise(new Error(`Unknown path: ${path}`))
    } catch (error) {
        logger.error('Error in mocketBakrommetData:', error)
        return NextResponse.json(
            { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 },
        )
    }
}
