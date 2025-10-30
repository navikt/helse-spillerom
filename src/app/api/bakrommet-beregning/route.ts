import { logger } from '@navikt/next-logger'
import { proxyRouteHandler } from '@navikt/next-api-proxy'

import { erDemo, getServerEnv } from '@/env'

export async function POST(request: Request): Promise<Response> {
    // Kun tillatt i demo-versjonen
    if (!erDemo) {
        logger.warn('Bakrommet beregning API kun tillatt i demo-versjonen')
        return Response.json({ message: 'API kun tilgjengelig i demo-versjonen' }, { status: 403 })
    }
    const serverEnv = getServerEnv()

    return await proxyRouteHandler(request, {
        hostname: serverEnv.BAKROMMET_HOST,
        path: '/api/demo/utbetalingsberegning',
        https: false,
    })
}
