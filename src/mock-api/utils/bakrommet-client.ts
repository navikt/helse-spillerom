import { logger } from '@navikt/next-logger'

import { UtbetalingsberegningInput, UtbetalingsberegningData } from '@/schemas/utbetalingsberegning'

/**
 * Kaller bakrommet demo utbetalingsberegning API
 * Returnerer mock data hvis vi kjører lokalt eller hvis kallet feiler
 */
export async function kallBakrommetUtbetalingsberegning(
    input: UtbetalingsberegningInput,
): Promise<UtbetalingsberegningData | null> {
    try {
        const response = await fetch('https://spillerom.ekstern.dev.nav.no/api/bakrommet-beregning', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        })

        if (!response.ok) {
            logger.error('Bakrommet API kallet feilet ' + response.status + ' ' + response.statusText)
            try {
                const data = await response.json()
                logger.error(
                    'Bakrommet API kallet feilet ' +
                        response.status +
                        ' ' +
                        response.statusText +
                        ' ' +
                        JSON.stringify(data),
                )
            } catch (error) {
                logger.error('Feil ved kall til bakrommet API ' + JSON.stringify(error))
            }
            // Bakrommet API kallet feilet
            return null
        }

        logger.info('Bakrommet API kallet var OK', { status: response.status, statusText: response.statusText })

        const data = await response.json()
        return data
    } catch (error) {
        logger.error('Feil ved kall til bakrommet API', { error })
        // Feil ved kall til bakrommet API
        return null
    }
}
