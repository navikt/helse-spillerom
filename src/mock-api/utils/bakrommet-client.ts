import { logger } from '@navikt/next-logger'

import { UtbetalingsberegningData, UtbetalingsberegningInput } from '@/schemas/utbetalingsberegning'

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
                // eslint-disable-next-line no-console
                console.log(JSON.stringify(input, null, 2))
                logger.error(
                    `Bakrommet API kallet feilet ${response.status} ${response.statusText} ${JSON.stringify(data)}`,
                )
            } catch (error) {
                logger.error(`Feil ved kall til bakrommet API: ${JSON.stringify(error)}`)
            }
            // Bakrommet API kallet feilet
            return null
        }

        logger.info(`Bakrommet API kallet var OK: ${response.status} ${response.statusText}`)

        return await response.json()
    } catch (error) {
        logger.error(`Feil ved kall til bakrommet API: ${JSON.stringify(error)}`)
        // Feil ved kall til bakrommet API
        return null
    }
}
