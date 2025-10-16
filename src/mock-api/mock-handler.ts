import { logger } from '@navikt/next-logger'
import { NextResponse } from 'next/server'

import { raise } from '@utils/tsUtils'
import { personsøk } from '@/mock-api/personsøk'
import { hentAktivBruker, hentPerson } from '@/mock-api/session'
import {
    hentInntektsforholdUuidFraUrl,
    hentPersonIdFraUrl,
    hentSoknadUuidFraUrl,
    hentUuidFraUrl,
} from '@/mock-api/utils/url-utils'
import { addRandomDelay } from '@/mock-api/utils/delay-utils'
import { handlePersoninfo } from '@/mock-api/handlers/person-handlers'
import {
    handleAinntektHent,
    handleArbeidsforholdHent,
    handleDokumenter,
    handlePensjonsgivendeInntektHent,
} from '@/mock-api/handlers/dokument-handlers'
import {
    handleGetAlleSaksbehandlingsperioder,
    handleGetHistorikk,
    handleGetSaksbehandlingsperioder,
    handleGodkjenn,
    handleOppdaterSkjæringstidspunkt,
    handlePostSaksbehandlingsperioder,
    handleSendTilbake,
    handleSendTilBeslutning,
    handleTaTilBeslutning,
} from '@/mock-api/handlers/saksbehandlingsperiode-handlers'
import { handleGetSoknad, handleGetSoknader } from '@/mock-api/handlers/soknad-handlers'
import { handleDeleteVilkaar, handleGetVilkaar, handlePutVilkaar } from '@/mock-api/handlers/vilkaar-handlers'
import {
    handleDeleteInntektsforhold,
    handleGetInntektsforhold,
    handlePostInntektsforhold,
    handlePutDagoversikt,
    handlePutInntektsforholdKategorisering,
    handlePutInntektsforholdPerioder,
    handlePutInntekt,
} from '@/mock-api/handlers/yrkesaktivitet-handlers'
import { handleGetAinntekt } from '@/mock-api/handlers/ainntekt-handlers'
import { handleGetArbeidsforhold } from '@/mock-api/handlers/arbeidsforhold-handlers'
import { handleGetPensjonsgivendeInntekt } from '@/mock-api/handlers/pensjonsgivende-inntekt-handlers'
import {
    handleDeleteSykepengegrunnlag,
    handleGetSykepengegrunnlag,
    handlePutSykepengegrunnlag,
} from '@/mock-api/handlers/sykepengegrunnlag-handlers'
import { handleGetSykepengegrunnlagV2 } from '@/mock-api/handlers/sykepengegrunnlagV2-handlers'
import { handleGetUtbetalingsberegning } from '@/mock-api/handlers/utbetalingsberegning-handlers'
import { handleGetInntektsmeldinger } from '@/mock-api/handlers/inntektsmeldinger'

interface HandlerContext {
    request: Request
    person?: ReturnType<typeof hentPerson>
    personId: string
    uuid?: string
    yrkesaktivitetId?: string
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

    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaarsvurdering': async ({ person, uuid }) =>
        handleGetVilkaar(await person, uuid!),

    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaarsvurdering/[kode]': async ({
        request,
        person,
        uuid,
        kode,
    }) => handlePutVilkaar(request, await person, uuid!, kode!),

    'DELETE /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaarsvurdering/[kode]': async ({ person, uuid, kode }) =>
        handleDeleteVilkaar(await person, uuid!, kode!),

    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet': async ({ person, uuid }) =>
        handleGetInntektsforhold(await person, uuid!),

    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet': async ({ request, person, uuid }) =>
        handlePostInntektsforhold(request, await person, uuid!),

    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet/[uuid]/kategorisering': async ({
        request,
        person,
        uuid,
        yrkesaktivitetId,
    }) => handlePutInntektsforholdKategorisering(request, await person, uuid!, yrkesaktivitetId!),

    'DELETE /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet/[uuid]': async ({
        person,
        uuid,
        yrkesaktivitetId,
    }) => handleDeleteInntektsforhold(await person, uuid!, yrkesaktivitetId!),

    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet/[uuid]/dagoversikt': async ({
        request,
        person,
        uuid,
        yrkesaktivitetId,
    }) => handlePutDagoversikt(request, await person, uuid!, yrkesaktivitetId!),

    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet/[uuid]/perioder': async ({
        request,
        person,
        uuid,
        yrkesaktivitetId,
    }) => handlePutInntektsforholdPerioder(request, await person, uuid!, yrkesaktivitetId!),

    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet/[uuid]/inntekt': async ({
        request,
        person,
        uuid,
        yrkesaktivitetId,
    }) => handlePutInntekt(request, await person, uuid!, yrkesaktivitetId!),

    'GET /v1/[personId]/soknader/[uuid]': async ({ personId, uuid }) => handleGetSoknad(personId, uuid!),

    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/sendtilbeslutning': async ({ request, person, uuid }) =>
        handleSendTilBeslutning(request, await person, uuid!),

    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/tatilbeslutning': async ({ person, uuid }) =>
        handleTaTilBeslutning(await person, uuid!),

    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/sendtilbake': async ({ request, person, uuid }) =>
        handleSendTilbake(request, await person, uuid!),

    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/godkjenn': async ({ person, uuid }) =>
        handleGodkjenn(await person, uuid!),

    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/historikk': async ({ person, uuid }) =>
        handleGetHistorikk(await person, uuid!),

    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/sykepengegrunnlag': async ({ person, uuid }) =>
        handleGetSykepengegrunnlag(await person, uuid!),

    'GET /v2/[personId]/saksbehandlingsperioder/[uuid]/sykepengegrunnlag': async ({ person, uuid }) =>
        handleGetSykepengegrunnlagV2(await person, uuid!),

    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/sykepengegrunnlag': async ({ request, person, uuid }) =>
        handlePutSykepengegrunnlag(request, await person, uuid!),

    'DELETE /v1/[personId]/saksbehandlingsperioder/[uuid]/sykepengegrunnlag': async ({ person, uuid }) =>
        handleDeleteSykepengegrunnlag(await person, uuid!),

    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/utbetalingsberegning': async ({ person, uuid }) =>
        handleGetUtbetalingsberegning(await person, uuid!),

    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/skjaeringstidspunkt': async ({ request, person, uuid }) =>
        handleOppdaterSkjæringstidspunkt(request, await person, uuid!),

    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet/[uuid]/inntektsmeldinger': async () =>
        handleGetInntektsmeldinger(),
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

        if (path.includes('/yrkesaktivitet/') && path.includes('/dagoversikt')) {
            context.yrkesaktivitetId = hentInntektsforholdUuidFraUrl(request.url)
        }

        if (
            path.includes('/yrkesaktivitet/') &&
            path.split('/').length > 6 &&
            !path.includes('/dagoversikt') &&
            !path.includes('/inntekt')
        ) {
            context.yrkesaktivitetId = hentInntektsforholdUuidFraUrl(request.url)
        }

        if (path.includes('/yrkesaktivitet/') && path.includes('/inntekt')) {
            context.yrkesaktivitetId = hentInntektsforholdUuidFraUrl(request.url)
        }

        if (path.includes('/vilkaarsvurdering/') && path.split('/').length > 6) {
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
        /* eslint-disable-next-line no-console */
        console.error(error)
        return NextResponse.json(
            { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 },
        )
    }
}
