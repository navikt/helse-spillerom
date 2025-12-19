import React, { ReactElement } from 'react'
import { BodyShort, HStack, Table, VStack } from '@navikt/ds-react'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'

import { YrkesaktivitetMedDagoversikt } from '@components/saksbilde/dagoversikt/Dagoversikt'
import { erHelg } from '@utils/erHelg'
import { cn } from '@utils/tw'
import {
    erDagIPeriode,
    finnUtbetalingsdata,
    formaterTotalGrad,
    getDagtypeIcon,
    getDagtypeText,
    sumArbeidsgiverbeløpForYrkesaktivitet,
    sumPersonbeløpForYrkesaktivitet,
} from '@components/saksbilde/dagoversikt/dagoversiktUtils'
import { BeregningResponse } from '@schemas/utbetalingsberegning'
import { getFormattedDateString } from '@utils/date-format'
import { formaterBeløpKroner } from '@schemas/pengerUtils'
import { NavnOgIkon } from '@components/saksbilde/sykepengegrunnlag/NavnOgIkon'
import {
    countUtbetalingsdagerForYrkesaktivitet,
    formaterDager,
} from '@components/sidemenyer/venstremeny/Utbetalingsdager'

interface ComparisonTableProps {
    yrkesaktiviteter: YrkesaktivitetMedDagoversikt[]
    utbetalingsberegning: BeregningResponse | null | undefined
}

export function ComparisonTable({ yrkesaktiviteter, utbetalingsberegning }: ComparisonTableProps): ReactElement {
    const yrkesaktivitetMedFlestGråDager = finnYrkesaktivitetMedFlestGråDager(yrkesaktiviteter)

    return (
        <HStack wrap={false}>
            <VStack gap="2" className="w-min">
                <BodyShort className="pl-2 invisible">Felles</BodyShort>
                <Table size="small" className="border-t border-ax-border-neutral-subtle">
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell className="w-px whitespace-nowrap text-ax-medium">Dato</TableHeaderCell>
                            <TableHeaderCell
                                align="right"
                                className="w-px whitespace-nowrap text-ax-medium"
                                title="Total sykdomsgrad for alle yrkesaktiviteter denne dagen"
                            >
                                Total grad
                            </TableHeaderCell>
                            <TableHeaderCell
                                align="right"
                                className="hidden w-px whitespace-nowrap md:table-cell text-ax-medium"
                            >
                                Dager igjen
                            </TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableHeaderCell className="border-b border-ax-border-neutral-strong text-ax-medium">
                                TOTAL
                            </TableHeaderCell>
                            <TableDataCell className="border-b border-ax-border-neutral-strong" />
                            <TableDataCell className="border-b border-ax-border-neutral-strong" />
                        </TableRow>
                        {yrkesaktivitetMedFlestGråDager.dagoversikt.map((dag, i) => {
                            const utbetalingsdata = utbetalingsberegning
                                ? finnUtbetalingsdata(utbetalingsberegning, yrkesaktivitetMedFlestGråDager.id, dag.dato)
                                : null

                            const erHelgedag = erHelg(new Date(dag.dato))
                            const erAGP = erDagIPeriode(dag.dato, 'ARBEIDSGIVERPERIODE', yrkesaktivitetMedFlestGråDager)
                            const erVentetid =
                                erDagIPeriode(dag.dato, 'VENTETID', yrkesaktivitetMedFlestGråDager) ||
                                erDagIPeriode(dag.dato, 'VENTETID_INAKTIV', yrkesaktivitetMedFlestGråDager)

                            return (
                                <TableRow
                                    key={i}
                                    className={cn(
                                        (erAGP || erVentetid) &&
                                            'bg-ax-bg-neutral-soft hover:bg-ax-bg-neutral-moderate-hover shadow-[inset_3px_0_0_0_var(--ax-border-neutral-strong)]',
                                        erHelgedag && 'bg-stripes',
                                        erAGP && (erVentetid || erHelgedag) && 'bg-agp-helg',
                                    )}
                                >
                                    <TableDataCell className="text-ax-medium">
                                        {getFormattedDateString(dag.dato)}
                                    </TableDataCell>
                                    <TableDataCell align="right" className="text-ax-medium">
                                        {formaterTotalGrad(utbetalingsdata?.økonomi.totalGrad)}
                                    </TableDataCell>
                                    <TableDataCell align="right" className="hidden md:table-cell text-ax-medium">
                                        -
                                    </TableDataCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </VStack>
            {yrkesaktiviteter.map((yrkesaktivitet) => (
                <VStack key={yrkesaktivitet.id} gap="2" className="border-l border-ax-border-neutral-strong w-min">
                    <NavnOgIkon
                        kategorisering={yrkesaktivitet.kategorisering}
                        orgnavn={yrkesaktivitet.orgnavn}
                        className="pl-2"
                    />
                    <Table size="small" className="border-t border-ax-border-neutral-subtle">
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell className="w-px whitespace-nowrap text-ax-medium">
                                    Dagtype
                                </TableHeaderCell>
                                <TableHeaderCell align="right" className="w-px whitespace-nowrap text-ax-medium">
                                    Grad
                                </TableHeaderCell>
                                <TableHeaderCell align="right" className="w-px whitespace-nowrap text-ax-medium">
                                    Refusjon
                                </TableHeaderCell>
                                <TableHeaderCell align="right" className="w-px whitespace-nowrap text-ax-medium">
                                    Utbetaling
                                </TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableDataCell className="border-b border-ax-border-neutral-strong text-ax-medium">
                                    {formaterDager(
                                        countUtbetalingsdagerForYrkesaktivitet(utbetalingsberegning, yrkesaktivitet.id),
                                    )}
                                </TableDataCell>
                                <TableDataCell className="border-b border-ax-border-neutral-strong" />
                                <TableDataCell
                                    className="border-b border-ax-border-neutral-strong text-ax-medium"
                                    align="right"
                                >
                                    {formaterBeløpKroner(
                                        sumArbeidsgiverbeløpForYrkesaktivitet(utbetalingsberegning, yrkesaktivitet.id),
                                        2,
                                        'currency',
                                        false,
                                    )}
                                </TableDataCell>
                                <TableDataCell
                                    className="border-b border-ax-border-neutral-strong text-ax-medium"
                                    align="right"
                                >
                                    {formaterBeløpKroner(
                                        sumPersonbeløpForYrkesaktivitet(utbetalingsberegning, yrkesaktivitet.id),
                                        2,
                                        'currency',
                                        false,
                                    )}
                                </TableDataCell>
                            </TableRow>
                            {yrkesaktivitet.dagoversikt.map((dag, i) => {
                                const utbetalingsdata = utbetalingsberegning
                                    ? finnUtbetalingsdata(utbetalingsberegning, yrkesaktivitet.id, dag.dato)
                                    : null

                                const erHelgedag = erHelg(new Date(dag.dato))
                                const erAGP = erDagIPeriode(dag.dato, 'ARBEIDSGIVERPERIODE', yrkesaktivitet)
                                const erVentetid =
                                    erDagIPeriode(dag.dato, 'VENTETID', yrkesaktivitet) ||
                                    erDagIPeriode(dag.dato, 'VENTETID_INAKTIV', yrkesaktivitet)
                                return (
                                    <TableRow
                                        key={i}
                                        className={cn(
                                            dag.dagtype === 'Avslått' && 'bg-ax-bg-danger-moderate',
                                            (erAGP || erVentetid) &&
                                                'bg-ax-bg-neutral-soft hover:bg-ax-bg-neutral-moderate-hover',
                                            erHelgedag && 'bg-stripes',
                                            erAGP && (erVentetid || erHelgedag) && 'bg-agp-helg',
                                        )}
                                    >
                                        <TableDataCell>
                                            <HStack wrap={false} gap="2" align="center" className="text-ax-medium">
                                                {getDagtypeIcon(dag.dagtype, erHelgedag)}
                                                <span className="whitespace-nowrap">
                                                    {getDagtypeText(
                                                        dag.dagtype,
                                                        dag.andreYtelserBegrunnelse,
                                                        erHelgedag,
                                                        erAGP,
                                                        erVentetid,
                                                    )}
                                                </span>
                                            </HStack>
                                        </TableDataCell>
                                        <TableDataCell align="right" className="text-ax-medium whitespace-nowrap">
                                            {dag.grad ? `${dag.grad} %` : '-'}
                                        </TableDataCell>
                                        <TableDataCell align="right" className="text-ax-medium">
                                            {formaterBeløpKroner(
                                                utbetalingsdata?.økonomi.arbeidsgiverbeløp,
                                                2,
                                                'currency',
                                                false,
                                            )}
                                        </TableDataCell>
                                        <TableDataCell align="right" className="text-ax-medium">
                                            {formaterBeløpKroner(
                                                utbetalingsdata?.økonomi.personbeløp,
                                                2,
                                                'currency',
                                                false,
                                            )}
                                        </TableDataCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </VStack>
            ))}
        </HStack>
    )
}

function finnYrkesaktivitetMedFlestGråDager(yrkesaktiviteter: YrkesaktivitetMedDagoversikt[]) {
    return yrkesaktiviteter.reduce((max, current) => {
        const countAgpVentetidDays = (ya: YrkesaktivitetMedDagoversikt) =>
            ya.dagoversikt.filter(
                (dag) =>
                    erDagIPeriode(dag.dato, 'ARBEIDSGIVERPERIODE', ya) ||
                    erDagIPeriode(dag.dato, 'VENTETID', ya) ||
                    erDagIPeriode(dag.dato, 'VENTETID_INAKTIV', ya),
            ).length

        return countAgpVentetidDays(current) > countAgpVentetidDays(max) ? current : max
    }, yrkesaktiviteter[0])
}
