import { BeregningResponse } from '@/schemas/utbetalingsberegning'
import { Yrkesaktivitet } from '@/schemas/yrkesaktivitet'
import { formaterBeløpØre } from '@/schemas/sykepengegrunnlag'

export interface Utbetalingssum {
    totalUtbetalingØre: number
    totalRefusjonØre: number
    totalBeløpØre: number
    arbeidsgivere: ArbeidsgiverUtbetaling[]
    direkteUtbetalingØre: number
}

export interface ArbeidsgiverUtbetaling {
    orgnummer: string
    navn: string
    refusjonØre: number
    utbetalingØre: number
    totalBeløpØre: number
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
            totalUtbetalingØre: 0,
            totalRefusjonØre: 0,
            totalBeløpØre: 0,
            arbeidsgivere: [],
            direkteUtbetalingØre: 0,
        }
    }

    const arbeidsgiverUtbetalinger: ArbeidsgiverUtbetaling[] = []
    let totalUtbetalingØre = 0
    let totalRefusjonØre = 0

    // Gå gjennom hver yrkesaktivitet og beregn utbetalinger
    utbetalingsberegning.beregningData.yrkesaktiviteter.forEach((yrkesaktivitetBeregning) => {
        const yrkesaktivitetData = yrkesaktivitet.find((ya) => ya.id === yrkesaktivitetBeregning.yrkesaktivitetId)

        if (!yrkesaktivitetData) return

        const orgnummer = yrkesaktivitetData.kategorisering['ORGNUMMER'] as string
        const navn = (yrkesaktivitetData.kategorisering['NAVN'] as string) || orgnummer

        // Summer opp alle dager for denne yrkesaktiviteten
        const refusjonØre = yrkesaktivitetBeregning.dager.reduce((sum, dag) => sum + dag.refusjonØre, 0)
        const utbetalingØre = yrkesaktivitetBeregning.dager.reduce((sum, dag) => sum + dag.utbetalingØre, 0)
        const totalBeløpØre = refusjonØre + utbetalingØre

        if (totalBeløpØre > 0) {
            arbeidsgiverUtbetalinger.push({
                orgnummer,
                navn,
                refusjonØre,
                utbetalingØre,
                totalBeløpØre,
            })

            totalRefusjonØre += refusjonØre
            totalUtbetalingØre += utbetalingØre
        }
    })

    // Sorter arbeidsgivere: refusjonsutbetalinger først, deretter direkte utbetalinger
    arbeidsgiverUtbetalinger.sort((a, b) => {
        // Hvis begge har refusjon, sorter etter refusjonsbeløp (høyest først)
        if (a.refusjonØre > 0 && b.refusjonØre > 0) {
            return b.refusjonØre - a.refusjonØre
        }
        // Hvis kun en har refusjon, den kommer først
        if (a.refusjonØre > 0 && b.refusjonØre === 0) {
            return -1
        }
        if (a.refusjonØre === 0 && b.refusjonØre > 0) {
            return 1
        }
        // Hvis ingen har refusjon, sorter etter total beløp (høyest først)
        return b.totalBeløpØre - a.totalBeløpØre
    })

    const totalBeløpØre = totalUtbetalingØre + totalRefusjonØre

    return {
        totalUtbetalingØre,
        totalRefusjonØre,
        totalBeløpØre,
        arbeidsgivere: arbeidsgiverUtbetalinger,
        direkteUtbetalingØre: totalUtbetalingØre,
    }
}

/**
 * Formaterer utbetalingssum for visning i UI
 */
export function formaterUtbetalingssum(utbetalingssum: Utbetalingssum) {
    return {
        totalUtbetaling: formaterBeløpØre(utbetalingssum.totalUtbetalingØre),
        totalRefusjon: formaterBeløpØre(utbetalingssum.totalRefusjonØre),
        totalBeløp: formaterBeløpØre(utbetalingssum.totalBeløpØre),
        direkteUtbetaling: formaterBeløpØre(utbetalingssum.direkteUtbetalingØre),
        arbeidsgivere: utbetalingssum.arbeidsgivere.map((ag) => ({
            ...ag,
            refusjon: formaterBeløpØre(ag.refusjonØre),
            utbetaling: formaterBeløpØre(ag.utbetalingØre),
            totalBeløp: formaterBeløpØre(ag.totalBeløpØre),
        })),
    }
}
