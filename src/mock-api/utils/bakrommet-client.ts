import { logger } from '@navikt/next-logger'

import { erLokal } from '@/env'
import {
    UtbetalingsberegningInput,
    UtbetalingsberegningData,
    YrkesaktivitetUtbetalingsberegning,
    DagUtbetalingsberegning,
} from '@/schemas/utbetalingsberegning'
import { Dag } from '@/schemas/dagoversikt'

/**
 * Genererer mock utbetalingsberegning for lokalt miljø
 * Legger inn 100kr på de første 10 dagene (5 som refusjon)
 * Deretter 1kr mindre per dag frem til slutten av perioden
 * Fyller ut manglende dager med arbeidsdager basert på saksbehandlingsperioden
 */
function genererMockUtbetalingsberegning(input: UtbetalingsberegningInput): UtbetalingsberegningData {
    const yrkesaktiviteter: YrkesaktivitetUtbetalingsberegning[] = []

    for (const yrkesaktivitet of input.yrkesaktivitet) {
        const dager: DagUtbetalingsberegning[] = []
        let dagTeller = 0

        // Opprett komplett dagoversikt for hele saksbehandlingsperioden
        const komplettDagoversikt = fyllUtManglendeDager(yrkesaktivitet.dagoversikt || [], input.saksbehandlingsperiode)

        for (const dag of komplettDagoversikt) {
            // Kun beregn for syke dager
            if (dag.dagtype === 'Syk' || dag.dagtype === 'SykNav') {
                dagTeller++

                let utbetalingØre = 0
                let refusjonØre = 0

                if (dagTeller <= 10) {
                    // De første 10 dagene: 100kr utbetaling, 5kr refusjon
                    utbetalingØre = 10000 // 100kr i øre
                    refusjonØre = 500 // 5kr i øre
                } else {
                    // Etter dag 10: 1kr mindre per dag
                    const dagerEtterDag10 = dagTeller - 10
                    const utbetalingKroner = Math.max(0, 100 - dagerEtterDag10) // Ikke negativ
                    const refusjonKroner = Math.max(0, 5 - dagerEtterDag10) // Ikke negativ

                    utbetalingØre = utbetalingKroner * 100
                    refusjonØre = refusjonKroner * 100
                }

                dager.push({
                    dato: dag.dato,
                    utbetalingØre,
                    refusjonØre,
                    totalGrad: dag.grad || 100,
                })
            }
        }

        if (dager.length > 0) {
            yrkesaktiviteter.push({
                yrkesaktivitetId: yrkesaktivitet.id,
                dager,
            })
        }
    }

    return {
        yrkesaktiviteter,
    }
}

/**
 * Fyller ut manglende dager i saksbehandlingsperioden med arbeidsdager
 * Dager som ikke er definert i dagoversikten fylles ut som arbeidsdager
 */
function fyllUtManglendeDager(eksisterendeDager: Dag[], saksbehandlingsperiode: { fom: string; tom: string }): Dag[] {
    const eksisterendeDatoer = new Set(eksisterendeDager.map((dag) => dag.dato))
    const komplettDagoversikt = [...eksisterendeDager]

    // Fyll ut manglende dager som arbeidsdager
    const aktuellDato = new Date(saksbehandlingsperiode.fom)
    const tomDato = new Date(saksbehandlingsperiode.tom)

    while (aktuellDato <= tomDato) {
        const datoString = aktuellDato.toISOString().split('T')[0] // YYYY-MM-DD format

        if (!eksisterendeDatoer.has(datoString)) {
            const arbeidsdag: Dag = {
                dato: datoString,
                dagtype: 'Arbeidsdag',
                grad: null,
                avvistBegrunnelse: [],
                kilde: null,
            }
            komplettDagoversikt.push(arbeidsdag)
        }

        aktuellDato.setDate(aktuellDato.getDate() + 1)
    }

    // Sorter dager etter dato
    return komplettDagoversikt.sort((a, b) => a.dato.localeCompare(b.dato))
}

/**
 * Kaller bakrommet demo utbetalingsberegning API
 * Returnerer mock data hvis vi kjører lokalt eller hvis kallet feiler
 */
export async function kallBakrommetUtbetalingsberegning(
    input: UtbetalingsberegningInput,
): Promise<UtbetalingsberegningData | null> {
    // Bruk mock data hvis vi kjører lokalt
    if (erLokal) {
        logger.info('Kaller bakrommet utbetalingsberegning, men er lokal og bruker mock data')
        return genererMockUtbetalingsberegning(input)
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
