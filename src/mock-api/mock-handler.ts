import { logger } from '@navikt/next-logger'
import { NextResponse } from 'next/server'

import { raise } from '@utils/tsUtils'
import { personsøk } from '@/mock-api/personsøk'
import { hentPerson, hentAktivBruker } from '@/mock-api/session'
import {
    hentPersonIdFraUrl,
    hentUuidFraUrl,
    hentInntektsforholdUuidFraUrl,
    hentSoknadUuidFraUrl,
} from '@/mock-api/utils/url-utils'
import { addRandomDelay } from '@/mock-api/utils/delay-utils'
import { handlePersoninfo } from '@/mock-api/handlers/person-handlers'
import {
    handleDokumenter,
    handleAinntektHent,
    handleArbeidsforholdHent,
    handlePensjonsgivendeInntektHent,
} from '@/mock-api/handlers/dokument-handlers'
import {
    handleGetSaksbehandlingsperioder,
    handlePostSaksbehandlingsperioder,
    handleGetAlleSaksbehandlingsperioder,
    handleSendTilBeslutning,
    handleTaTilBeslutning,
    handleSendTilbake,
    handleGodkjenn,
    handleGetHistorikk,
} from '@/mock-api/handlers/saksbehandlingsperiode-handlers'
import { handleGetSoknader, handleGetSoknad } from '@/mock-api/handlers/soknad-handlers'
import { handleGetVilkaar, handlePutVilkaar, handleDeleteVilkaar } from '@/mock-api/handlers/vilkaar-handlers'
import {
    handleGetInntektsforhold,
    handlePostInntektsforhold,
    handleDeleteInntektsforhold,
    handlePutInntektsforholdKategorisering,
    handlePutInntektsforholdDagoversikt,
} from '@/mock-api/handlers/inntektsforhold-handlers'
import { handleGetAinntekt } from '@/mock-api/handlers/ainntekt-handlers'
import { handleGetArbeidsforhold } from '@/mock-api/handlers/arbeidsforhold-handlers'
import { handleGetPensjonsgivendeInntekt } from '@/mock-api/handlers/pensjonsgivende-inntekt-handlers'

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
    'GET /v1/bruker': async () => {
        // Hent roller fra sesjonen
        const bruker = await hentAktivBruker()

        return NextResponse.json(bruker)
    },

    'GET /v1/saksbehandlingsperioder': async () => handleGetAlleSaksbehandlingsperioder(),

    'GET /v1/[personId]/personinfo': async ({ person }) => handlePersoninfo(await person),

    'GET /v1/[personId]/saksbehandlingsperioder': async ({ person }) => handleGetSaksbehandlingsperioder(await person),

    'POST /v1/[personId]/saksbehandlingsperioder': async ({ request, person, personId }) =>
        handlePostSaksbehandlingsperioder(request, await person, personId),

    'GET /v1/[personId]/soknader': async ({ request, personId }) => handleGetSoknader(request, personId),

    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/dokumenter': async ({ person, uuid }) =>
        handleDokumenter(await person, uuid!),

    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/dokumenter/ainntekt/hent': async ({ request, person, uuid }) =>
        handleAinntektHent(request, await person, uuid!),

    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/dokumenter/arbeidsforhold/hent': async ({
        request,
        person,
        uuid,
    }) => handleArbeidsforholdHent(request, await person, uuid!),

    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/dokumenter/pensjonsgivendeinntekt/hent': async ({
        request,
        person,
        uuid,
    }) => handlePensjonsgivendeInntektHent(request, await person, uuid!),

    'GET /v1/[personId]/arbeidsforhold': async ({ personId }) => handleGetArbeidsforhold(personId),

    'GET /v1/[personId]/ainntekt': async ({ personId }) => handleGetAinntekt(personId),

    'GET /v1/[personId]/pensjonsgivendeinntekt': async ({ personId }) => handleGetPensjonsgivendeInntekt(personId),

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

    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/inntektsforhold/[uuid]/kategorisering': async ({
        request,
        person,
        uuid,
        inntektsforholdId,
    }) => handlePutInntektsforholdKategorisering(request, await person, uuid!, inntektsforholdId!),

    'DELETE /v1/[personId]/saksbehandlingsperioder/[uuid]/inntektsforhold/[uuid]': async ({
        person,
        uuid,
        inntektsforholdId,
    }) => handleDeleteInntektsforhold(await person, uuid!, inntektsforholdId!),

    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/inntektsforhold/[uuid]/dagoversikt': async ({
        request,
        person,
        uuid,
        inntektsforholdId,
    }) => handlePutInntektsforholdDagoversikt(request, await person, uuid!, inntektsforholdId!),

    'GET /v1/[personId]/soknader/[uuid]': async ({ personId, uuid }) => handleGetSoknad(personId, uuid!),

    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/sendtilbeslutning': async ({ person, uuid }) =>
        handleSendTilBeslutning(await person, uuid!),

    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/tatilbeslutning': async ({ person, uuid }) =>
        handleTaTilBeslutning(await person, uuid!),

    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/sendtilbake': async ({ person, uuid }) =>
        handleSendTilbake(await person, uuid!),

    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/godkjenn': async ({ person, uuid }) =>
        handleGodkjenn(await person, uuid!),

    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/historikk': async ({ person, uuid }) =>
        handleGetHistorikk(await person, uuid!),
}

export async function mocketBakrommetData(request: Request, path: string): Promise<Response> {
    logger.info(`Mocking path: ${path}`)

    try {
        // Add random delay to simulate realistic API response times
        await addRandomDelay()

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

        if (path.includes('/inntektsforhold/') && path.split('/').length > 6 && !path.includes('/dagoversikt')) {
            context.inntektsforholdId = hentInntektsforholdUuidFraUrl(request.url)
        }

        if (path.includes('/vilkaar/') && path.split('/').length > 6) {
            context.kode = request.url.split('/').pop()!
        }

        if (path.includes('/soknader/') && path.includes('[uuid]')) {
            context.uuid = hentSoknadUuidFraUrl(request.url)
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
