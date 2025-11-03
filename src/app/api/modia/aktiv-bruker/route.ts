import { getToken, validateAzureToken } from '@navikt/oasis'
import { logger } from '@navikt/next-logger'

import { erDevLokalEllerDemo } from '@/env'
import { kallModia } from '@/app/api/modia/modia'

export async function DELETE(request: Request): Promise<Response> {
    const token = erDevLokalEllerDemo ? null : getToken(request)
    if (!token) {
        logger.error('No access token found in request')
        return new Response('Not logged in', { status: 401 })
    }

    const result = await validateAzureToken(token)
    if (!result.ok) {
        logger.warn('kunne ikke validere azuretoken i /modia/aktiv-bruker')
        return new Response('Not logged in', { status: 401 })
    }

    try {
        await kallModia('/api/context/aktivbruker', request.method, token)
        return new Response(null, { status: 200 })
    } catch (error) {
        logger.warn(`Nullstilling av person i modiacontext feilet: ${error}`)
        return new Response(null, { status: 500 })
    }
}
