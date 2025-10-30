import { logger } from '@navikt/next-logger'

import { erDemo } from '@/env'

export async function POST(req: Request): Promise<Response> {
    // Kun tillatt i demo-versjonen
    if (!erDemo) {
        logger.warn('Bakrommet beregning API kun tillatt i demo-versjonen')
        return Response.json({ message: 'API kun tilgjengelig i demo-versjonen' }, { status: 403 })
    }

    try {
        logger.info('Proxying beregning request til bakrommet')

        // Proxy requesten til bakrommet
        const response = await fetch('http://bakrommet/api/demo/utbetalingsberegning', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: await req.text(),
        })

        const data = await response.text()

        // Returner responsen fra bakrommet med headers og statuskode
        const headers = new Headers()
        response.headers.forEach((value, key) => {
            headers.set(key, value)
        })

        return new Response(data, {
            status: response.status,
            statusText: response.statusText,
            headers: headers,
        })
    } catch (error) {
        logger.error(`Feil ved kall til bakrommet API i beregning route: ${JSON.stringify(error)}`)
        return Response.json({ message: 'Feil ved kall til bakrommet API' }, { status: 500 })
    }
}
