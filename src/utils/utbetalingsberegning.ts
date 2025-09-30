import { BeregningResponse, Dag, Økonomi } from '@/schemas/utbetalingsberegning'
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
 * Hjelpefunksjon for å hente beløp fra økonomi-objekt
 * Bruker dagligInt som standard, faller tilbake på dagligDouble hvis ikke tilgjengelig
 */
function hentBeløpFraØkonomi(økonomi: Økonomi, beløpType: keyof Økonomi): number {
    const beløp = økonomi[beløpType] as { dagligInt?: { beløp: number }; dagligDouble?: { beløp: number } } | undefined
    if (!beløp) return 0

    // Prioriter dagligInt, fall tilbake på dagligDouble
    if (beløp.dagligInt?.beløp !== undefined) {
        return beløp.dagligInt.beløp
    }
    if (beløp.dagligDouble?.beløp !== undefined) {
        return Math.round(beløp.dagligDouble.beløp)
    }
    return 0
}

/**
 * Hjelpefunksjon for å sjekke om en dag er en arbeidsdag (ikke helg)
 */
function erArbeidsdag(dag: Dag): boolean {
    return (
        dag['@type'] === 'NavDagDto' ||
        dag['@type'] === 'ArbeidsgiverperiodeDagDto' ||
        dag['@type'] === 'ArbeidsgiverperiodeDagNavDto' ||
        dag['@type'] === 'ArbeidsdagDto'
    )
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
        let refusjonØre = 0
        let utbetalingØre = 0

        yrkesaktivitetBeregning.utbetalingstidslinje.dager.forEach((dag) => {
            // Hent beløp fra økonomi-objektet
            const arbeidsgiverRefusjonsbeløp = hentBeløpFraØkonomi(dag.økonomi, 'arbeidsgiverRefusjonsbeløp')
            const personbeløp = hentBeløpFraØkonomi(dag.økonomi, 'personbeløp')

            // For arbeidsdager, legg til refusjon og utbetaling
            if (erArbeidsdag(dag)) {
                refusjonØre += arbeidsgiverRefusjonsbeløp
                utbetalingØre += personbeløp
            }
        })

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
