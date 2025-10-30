import { logger } from '@navikt/next-logger'

import { UtbetalingsberegningData, UtbetalingsberegningInput } from '@/schemas/utbetalingsberegning'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'

/**
 * Kaller bakrommet demo utbetalingsberegning API
 * Returnerer mock data hvis vi kjører lokalt eller hvis kallet feiler
 */
export async function kallBakrommetUtbetalingsberegning(
    input: UtbetalingsberegningInput,
): Promise<UtbetalingsberegningData | null> {
    const response = await fetch('https://spillerom.ekstern.dev.nav.no/api/bakrommet-beregning', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    })

    if (!response.ok) {
        logger.error('Bakrommet API kallet feilet ' + response.status + ' ' + response.statusText)
        let data
        try {
            data = await response.json()
            // eslint-disable-next-line no-console
            console.log(JSON.stringify(input, null, 2))
            logger.error(
                `Bakrommet API kallet feilet ${response.status} ${response.statusText} ${JSON.stringify(data)}`,
            )
        } catch (error) {
            logger.error(`Feil ved kall til bakrommet API: ${JSON.stringify(error)}`, error)
            throw new Error('Feil ved kall til bakrommet API: ${JSON.stringify(error)}')
        }
        if (data) {
            logger.error(`Bakrommet API kallet feilet med data: ${JSON.stringify(data)}`)

            throw new ProblemDetailsError(data)
        }
        throw new Error('hjelp')

        // Bakrommet API kallet feilet
    }

    logger.info(`Bakrommet API kallet var OK: ${response.status} ${response.statusText}`)

    return await response.json()
}
