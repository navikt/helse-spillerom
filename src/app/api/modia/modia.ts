import { v4 as uuidv4 } from 'uuid'
import { requestOboToken } from '@navikt/oasis'
import { logger } from '@navikt/next-logger'

import { getServerEnv } from '@/env'

export async function kallModia(path: string, method: string, token: string, data?: string): Promise<Response> {
    const callId = uuidv4()
    const serverEnv = getServerEnv()

    const oboResult = await requestOboToken(token, serverEnv.MODIA_SCOPE)
    if (!oboResult.ok) {
        logger.error(new Error(`Unable to exchange OBO token: ${oboResult.error.message}`, { cause: oboResult.error }))
        return new Response('Not logged in', { status: 401 })
    }

    const options = {
        method: method,
        headers: {
            Authorization: `Bearer ${oboResult.token}`,
            'X-Request-Id': callId,
            'Content-Type': 'application/json',
            'Nav-Consumer-Id': 'speil',
        },
        body: data,
    }

    const modiaBaseUrl = serverEnv.MODIA_BASE_URL
    const url = `${modiaBaseUrl}${path}`

    const response = await fetch(url, options)
    if (!response.ok) throw Error(`Fetch feilet, status: ${response.status}`)

    return response
}
