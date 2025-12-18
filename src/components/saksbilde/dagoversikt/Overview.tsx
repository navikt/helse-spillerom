import React, { ReactElement } from 'react'
import { Heading, HStack, Table, VStack } from '@navikt/ds-react'
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
} from '@components/saksbilde/dagoversikt/dagoversiktUtils'
import { BeregningResponse } from '@schemas/utbetalingsberegning'
import { getFormattedDateString } from '@utils/date-format'
import { formaterBeløpKroner } from '@schemas/pengerUtils'
import { NavnOgIkon } from '@components/saksbilde/sykepengegrunnlag/NavnOgIkon'

interface OverviewProps {
    yrkesaktiviteter: YrkesaktivitetMedDagoversikt[]
    utbetalingsberegning: BeregningResponse | null | undefined
}

export function Overview({ yrkesaktiviteter, utbetalingsberegning }: OverviewProps): ReactElement {
    const anyYrkesaktivitet = yrkesaktiviteter[0]
    return (
        <HStack wrap={false} className="py-8">
            <VStack gap="2" className="w-min">
                <Heading level="3" size="xsmall" className="pl-2 invisible">
                    Felles
                </Heading>
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
                        {anyYrkesaktivitet.dagoversikt.map((dag, i) => {
                            const utbetalingsdata = utbetalingsberegning
                                ? finnUtbetalingsdata(utbetalingsberegning, anyYrkesaktivitet.id, dag.dato)
                                : null

                            const erHelgedag = erHelg(new Date(dag.dato))
                            const erAGP = erDagIPeriode(dag.dato, 'ARBEIDSGIVERPERIODE', anyYrkesaktivitet)
                            const erVentetid =
                                erDagIPeriode(dag.dato, 'VENTETID', anyYrkesaktivitet) ||
                                erDagIPeriode(dag.dato, 'VENTETID_INAKTIV', anyYrkesaktivitet)

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
