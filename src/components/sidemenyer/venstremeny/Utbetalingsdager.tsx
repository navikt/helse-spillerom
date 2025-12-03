import { ReactElement } from 'react'
import { HStack, BodyShort } from '@navikt/ds-react'

import { useUtbetalingsberegning } from '@hooks/queries/useUtbetalingsberegning'

export function Utbetalingsdager(): ReactElement {
    const { data: utbetalingsberegning } = useUtbetalingsberegning()

    // Beregn antall unike datoer med utbetaling eller refusjon
    const utbetalingsdager = new Set<string>()

    if (utbetalingsberegning?.beregningData?.yrkesaktiviteter) {
        utbetalingsberegning.beregningData.yrkesaktiviteter.forEach((yrkesaktivitet) => {
            yrkesaktivitet.utbetalingstidslinje.dager.forEach((dag) => {
                // Hent beløp fra økonomi-objektet
                const arbeidsgiverbeløp = dag.økonomi.arbeidsgiverbeløp || 0
                const personbeløp = dag.økonomi.personbeløp || 0

                // Legg til datoen hvis det er utbetaling eller refusjon
                if (personbeløp > 0 || arbeidsgiverbeløp > 0) {
                    utbetalingsdager.add(dag.dato)
                }
            })
        })
    }

    const antallDager = utbetalingsdager.size

    return (
        <HStack justify="space-between" className="mb-4">
            <BodyShort size="small">Utbetalingsdager:</BodyShort>
            <BodyShort size="small">
                {antallDager} {antallDager === 1 ? 'dag' : 'dager'}
            </BodyShort>
        </HStack>
    )
}
