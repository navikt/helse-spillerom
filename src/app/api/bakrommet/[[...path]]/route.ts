import { proxyRouteHandler } from '@navikt/next-api-proxy'
import { logger } from '@navikt/next-logger'
import { getToken, requestOboToken, validateAzureToken } from '@navikt/oasis'

import { erLokalEllerDemo, getServerEnv } from '@/env'
import { mocketBakrommetData } from '@/mock-api/mock-handler'

import { allowedAPIs, cleanPath } from './config'

type RouteParams = {
    params: Promise<{ path: string[] }>
}

export const GET = bakrommetProxy
export const POST = bakrommetProxy
export const PUT = bakrommetProxy
export const DELETE = bakrommetProxy

async function bakrommetProxy(request: Request, { params }: RouteParams): Promise<Response> {
    const proxyPath = `/${(await params).path.join('/')}`
    const api = `${request.method} ${proxyPath}`

    if (!allowedAPIs.includes(cleanPath(api))) {
        logger.warn(`404 Unknown API: ${api}, clean path: ${cleanPath(api)}`)
        return Response.json({ message: 'Not found' }, { status: 404 })
    }

    if (erLokalEllerDemo) {
        return await mocketBakrommetData(request, cleanPath(api))
    }

    const accessToken = getToken(request)
    if (!accessToken) {
        logger.error('No access token found in request')
        return new Response('Not logged in', { status: 401 })
    }

    const result = await validateAzureToken(accessToken)
    if (!result.ok) {
        logger.warn('kunne ikke validere azuretoken i bakrommet proxy')
        return new Response('Not logged in', { status: 401 })
    }

    const serverEnv = getServerEnv()
    const oboResult = await requestOboToken(accessToken, serverEnv.BAKROMMET_SCOPE)
    if (!oboResult.ok) {
        logger.error(new Error(`Unable to exchange OBO token: ${oboResult.error.message}`, { cause: oboResult.error }))
        return new Response('Not logged in', { status: 401 })
    }

    logger.info(`Proxying request for path ${serverEnv.BAKROMMET_HOST}${proxyPath}`)
    return await proxyRouteHandler(request, {
        hostname: serverEnv.BAKROMMET_HOST,
        path: proxyPath,
        https: false,
        bearerToken: oboResult.token,
    })
}
