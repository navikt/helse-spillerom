import { BeregningResponse } from '@/schemas/utbetalingsberegning'
import { Yrkesaktivitet } from '@/schemas/yrkesaktivitet'
import { formaterBeløpØre } from '@/schemas/sykepengegrunnlag'

export interface Utbetalingssum {
    arbeidsgivere: ArbeidsgiverUtbetaling[]
    direkteUtbetalingØre: number
}

export interface ArbeidsgiverUtbetaling {
    orgnummer: string
    refusjonØre: number
}

/**
 * Beregner total utbetaling basert på utbetalingsberegning og yrkesaktivitet
 * Sorterer arbeidsgivere med refusjonsutbetaling først, deretter direkte utbetalinger
 */
export function beregnUtbetalingssum(
    utbetalingsberegning: BeregningResponse | null | undefined,
    yrkesaktivitet: Yrkesaktivitet[] | null | undefined,
): Utbetalingssum {
    if (!utbetalingsberegning?.beregningData?.yrkesaktiviteter || !yrkesaktivitet) {
        return {
            arbeidsgivere: [],
            direkteUtbetalingØre: 0,
        }
    }

    const arbeidsgiverUtbetalinger: ArbeidsgiverUtbetaling[] = []
    let direkteUtbetalingØre = 0

    // Gå gjennom hver yrkesaktivitet og beregn utbetalinger
    utbetalingsberegning.beregningData.yrkesaktiviteter.forEach((yrkesaktivitetBeregning) => {
        const yrkesaktivitetData = yrkesaktivitet.find((ya) => ya.id === yrkesaktivitetBeregning.yrkesaktivitetId)

        if (!yrkesaktivitetData) return

        const orgnummer = yrkesaktivitetData.kategorisering['ORGNUMMER'] as string

        // Summer opp alle dager for denne yrkesaktiviteten
        const refusjonØre = yrkesaktivitetBeregning.dager.reduce((sum, dag) => sum + dag.refusjonØre, 0)
        const utbetalingØre = yrkesaktivitetBeregning.dager.reduce((sum, dag) => sum + dag.utbetalingØre, 0)

        // Legg til arbeidsgiver hvis det finnes refusjon
        if (refusjonØre > 0) {
            arbeidsgiverUtbetalinger.push({
                orgnummer,
                refusjonØre,
            })
        }

        // Summer opp direkte utbetalinger fra alle yrkesaktiviteter
        direkteUtbetalingØre += utbetalingØre
    })

    // Sorter arbeidsgivere etter refusjonsbeløp (høyest først)
    arbeidsgiverUtbetalinger.sort((a, b) => b.refusjonØre - a.refusjonØre)

    return {
        arbeidsgivere: arbeidsgiverUtbetalinger,
        direkteUtbetalingØre,
    }
}

/**
 * Formaterer utbetalingssum for visning i UI
 */
export function formaterUtbetalingssum(utbetalingssum: Utbetalingssum) {
    return {
        direkteUtbetaling: formaterBeløpØre(utbetalingssum.direkteUtbetalingØre),
        arbeidsgivere: utbetalingssum.arbeidsgivere.map((ag) => ({
            ...ag,
            refusjon: formaterBeløpØre(ag.refusjonØre),
        })),
    }
}
