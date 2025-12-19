import { ReactElement } from 'react'
import { BodyShort, HStack } from '@navikt/ds-react'

import { useUtbetalingsberegning } from '@hooks/queries/useUtbetalingsberegning'
import { BeregningResponse, YrkesaktivitetUtbetalingsberegning } from '@schemas/utbetalingsberegning'

export function Utbetalingsdager(): ReactElement {
    const { data: utbetalingsberegning } = useUtbetalingsberegning()

    const antallDager = countUtbetalingsdagerTotal(utbetalingsberegning)

    return (
        <HStack justify="space-between" className="mb-4">
            <BodyShort size="small">Utbetalingsdager:</BodyShort>
            <BodyShort size="small">{formaterDager(antallDager)}</BodyShort>
        </HStack>
    )
}

export function formaterDager(dager: number): string {
    return `${dager} ${dager === 1 ? 'dag' : 'dager'}`
}

function countUtbetalingsdagerTotal(utbetalingsberegning: BeregningResponse | null | undefined): number {
    const yrkesaktiviteter = utbetalingsberegning?.beregningData?.yrkesaktiviteter ?? []
    const utbetalingsdager = yrkesaktiviteter.flatMap((ya) => [...getUtbetalingsdager(ya)])
    return new Set(utbetalingsdager).size
}

export function countUtbetalingsdagerForYrkesaktivitet(
    utbetalingsberegning: BeregningResponse | null | undefined,
    yrkesaktivitetId: string,
): number {
    const yrkesaktivitet = utbetalingsberegning?.beregningData?.yrkesaktiviteter?.find(
        (ya) => ya.yrkesaktivitetId === yrkesaktivitetId,
    )
    if (!yrkesaktivitet) return 0
    return getUtbetalingsdager(yrkesaktivitet).size
}

function getUtbetalingsdager(yrkesaktivitet: YrkesaktivitetUtbetalingsberegning): Set<string> {
    const utbetalingsdager = new Set<string>()
    for (const dag of yrkesaktivitet.utbetalingstidslinje.dager) {
        const arbeidsgiverbeløp = dag.økonomi.arbeidsgiverbeløp ?? 0
        const personbeløp = dag.økonomi.personbeløp ?? 0
        if (personbeløp > 0 || arbeidsgiverbeløp > 0) {
            utbetalingsdager.add(dag.dato)
        }
    }
    return utbetalingsdager
}
