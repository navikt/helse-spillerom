import { logger } from '@navikt/next-logger'

import { erLokal } from '@/env'
import { UtbetalingsberegningInput, UtbetalingsberegningData } from '@/schemas/utbetalingsberegning'

/**
 * Kaller bakrommet demo utbetalingsberegning API
 * Returnerer null hvis vi kjører lokalt eller hvis kallet feiler
 */
export async function kallBakrommetUtbetalingsberegning(
    input: UtbetalingsberegningInput,
): Promise<UtbetalingsberegningData | null> {
    // Returner null hvis vi kjører lokalt
    if (erLokal) {
        logger.info('Kaller bakrommet utbetalingsberegning, men er lokal og returnerer null')
        return null
    }

    try {
        const response = await fetch('http://bakrommet/api/demo/utbetalingsberegning', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        })

        if (!response.ok) {
            logger.error('Bakrommet API kallet feilet', { status: response.status, statusText: response.statusText })
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
