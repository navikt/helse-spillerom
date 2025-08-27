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
            // Bakrommet API kallet feilet
            return null
        }

        const data = await response.json()
        return data
    } catch (error) {
        // Feil ved kall til bakrommet API
        return null
    }
}
