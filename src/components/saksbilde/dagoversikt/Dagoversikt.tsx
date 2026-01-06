'use client'

import React, { ReactElement, useState } from 'react'
import { Alert, BodyShort, Button, Checkbox, Heading, HStack, Table, Tabs, VStack } from '@navikt/ds-react'
import { TabsList, TabsPanel, TabsTab } from '@navikt/ds-react/Tabs'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'
import { PersonPencilIcon } from '@navikt/aksel-icons'

import { Dagoversikt as _Dagoversikt } from '@schemas/dagoversikt'
import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'
import { useUtbetalingsberegning } from '@hooks/queries/useUtbetalingsberegning'
import { getFormattedDateString } from '@utils/date-format'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'
import { cn } from '@utils/tw'
import { DagendringForm } from '@components/saksbilde/dagoversikt/DagendringForm'
import { PeriodeForm } from '@components/saksbilde/dagoversikt/PeriodeForm'
import { FetchError } from '@components/saksbilde/FetchError'
import { useKodeverk } from '@/hooks/queries/useKodeverk'
import { erHelg } from '@utils/erHelg'
import { Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { formaterBeløpKroner } from '@schemas/pengerUtils'
import { DagoversiktKildeTag } from '@components/ikoner/kilde/kildeTags'
import { AvslåttBegrunnelser } from '@components/saksbilde/dagoversikt/AvslåttBegrunnelser'
import {
    erDagIPeriode,
    finnUtbetalingsdata,
    formaterTotalGrad,
    getDagtypeIcon,
    getDagtypeText,
    sumArbeidsgiverbeløpForYrkesaktivitet,
    sumPersonbeløpForYrkesaktivitet,
} from '@components/saksbilde/dagoversikt/dagoversiktUtils'
import { ComparisonTable } from '@components/saksbilde/dagoversikt/ComparisonTable'
import {
    countUtbetalingsdagerForYrkesaktivitet,
    formaterDager,
} from '@components/sidemenyer/venstremeny/Utbetalingsdager'
import { BeregningResponse } from '@schemas/utbetalingsberegning'

import { getInntektsforholdDisplayText } from '../yrkesaktivitet/yrkesaktivitetVisningTekst'

export type YrkesaktivitetMedDagoversikt = Yrkesaktivitet & { dagoversikt: NonNullable<_Dagoversikt> }

interface DagoversiktProps {
    value: string
}

export function Dagoversikt({ value }: DagoversiktProps): ReactElement {
    const {
        data: yrkesaktiviteter,
        isLoading: yrkesaktivitetLoading,
        isError: yrkesaktivitetError,
        refetch,
    } = useYrkesaktivitet()
    const { data: utbetalingsberegning } = useUtbetalingsberegning()
    const { data: kodeverk = [] } = useKodeverk()
    const kanSaksbehandles = useKanSaksbehandles()
    const [aktivYrkesaktivitetId, setAktivYrkesaktivitetId] = useState<string>()
    const [erIRedigeringsmodus, setErIRedigeringsmodus] = useState(false)
    const [valgteDatoer, setValgteDatoer] = useState<Set<string>>(new Set())

    // Filtrer kun yrkesaktiviteter som har dagoversikt med innhold
    const yrkesaktivitetMedDagoversikt =
        yrkesaktiviteter?.filter(
            (ya): ya is YrkesaktivitetMedDagoversikt => ya.dagoversikt != null && ya.dagoversikt.length > 0,
        ) ?? []

    // Sett første yrkesaktivitet som aktivt hvis det ikke er sett
    const aktivYrkesaktivitet = aktivYrkesaktivitetId
        ? yrkesaktivitetMedDagoversikt.find((ya) => ya.id === aktivYrkesaktivitetId)
        : yrkesaktivitetMedDagoversikt[0]

    const aktivYrkesaktivitetDagoversikt = aktivYrkesaktivitet?.dagoversikt || []

    // Sjekk om alle dager er valgt for aktiv yrkesaktivitet
    const erAlleValgt =
        aktivYrkesaktivitetDagoversikt.length > 0 &&
        aktivYrkesaktivitetDagoversikt.every((dag) => valgteDatoer.has(dag.dato))

    // Sjekk om noen dager er valgt (for indeterminate state)
    const erNoenValgt = aktivYrkesaktivitetDagoversikt.some((dag) => valgteDatoer.has(dag.dato))

    const handleDatoToggle = (dato: string, valgt: boolean) => {
        setValgteDatoer((prev) => {
            const nyeValgteDatoer = new Set(prev)
            if (valgt) {
                nyeValgteDatoer.add(dato)
            } else {
                nyeValgteDatoer.delete(dato)
            }
            return nyeValgteDatoer
        })
    }

    const handleVelgAlle = (valgt: boolean) => {
        setValgteDatoer(valgt ? new Set(aktivYrkesaktivitetDagoversikt.map((dag) => dag.dato)) : new Set())
    }

    const handleAvbrytRedigering = () => {
        setErIRedigeringsmodus(false)
        setValgteDatoer(new Set())
    }

    if (yrkesaktivitetLoading) {
        return <SaksbildePanel value={value}>Laster dagoversikt...</SaksbildePanel>
    }

    if (yrkesaktivitetError) {
        return (
            <SaksbildePanel value={value}>
                <FetchError refetch={refetch} message="Kunne ikke laste dagoversikt." />
            </SaksbildePanel>
        )
    }

    if (yrkesaktivitetMedDagoversikt.length === 0) {
        return (
            <SaksbildePanel value={value}>
                <Alert variant="info">
                    <Heading size="small">Ingen dagoversikt funnet</Heading>
                    <BodyShort>Det finnes ingen yrkesaktivitet for denne behandlingen med dagoversikt.</BodyShort>
                </Alert>
            </SaksbildePanel>
        )
    }

    return (
        <SaksbildePanel value={value} className="pb-0 pl-0">
            <Tabs
                className="pl-8"
                value={aktivYrkesaktivitetId || yrkesaktivitetMedDagoversikt[0]?.id}
                onChange={(value) => setAktivYrkesaktivitetId(value)}
            >
                <TabsList>
                    {yrkesaktivitetMedDagoversikt.map((forhold) => (
                        <TabsTab
                            key={forhold.id}
                            value={forhold.id}
                            label={getInntektsforholdDisplayText(forhold.kategorisering, forhold.orgnavn)}
                        />
                    ))}
                    {yrkesaktivitetMedDagoversikt.length > 1 && (
                        <TabsTab
                            value="overview"
                            label={
                                <BodyShort size="small" weight="semibold">
                                    Oversikt
                                </BodyShort>
                            }
                        />
                    )}
                </TabsList>
                <TabsPanel value="overview" className="py-8">
                    <ComparisonTable
                        yrkesaktiviteter={yrkesaktivitetMedDagoversikt}
                        utbetalingsberegning={utbetalingsberegning}
                    />
                </TabsPanel>
                {yrkesaktivitetMedDagoversikt.map((yrkesaktivitet) => (
                    <TabsPanel
                        className={cn('pt-6 pb-8', {
                            '-mx-8 border-l-6 border-ax-border-accent bg-ax-bg-neutral-soft pr-8 pl-[26px]':
                                erIRedigeringsmodus,
                        })}
                        key={yrkesaktivitet.id}
                        value={yrkesaktivitet.id}
                    >
                        {yrkesaktivitet.dagoversikt && yrkesaktivitet.dagoversikt.length > 0 && (
                            <VStack gap="6" align="start">
                                {/* Periode-form for arbeidsgiverperiode/ventetid */}
                                <PeriodeForm yrkesaktivitet={yrkesaktivitet} kanSaksbehandles={kanSaksbehandles} />

                                {kanSaksbehandles && (
                                    <Button
                                        size="small"
                                        type="button"
                                        variant="tertiary"
                                        icon={<PersonPencilIcon aria-hidden />}
                                        onClick={() =>
                                            erIRedigeringsmodus
                                                ? handleAvbrytRedigering()
                                                : setErIRedigeringsmodus(true)
                                        }
                                    >
                                        {erIRedigeringsmodus ? 'Avbryt' : 'Endre dager'}
                                    </Button>
                                )}
                                <Table size="small">
                                    <TableHeader>
                                        <TableRow>
                                            {erIRedigeringsmodus && (
                                                <TableHeaderCell className="w-px">
                                                    <Checkbox
                                                        checked={erAlleValgt}
                                                        indeterminate={erNoenValgt && !erAlleValgt}
                                                        onChange={(e) => handleVelgAlle(e.target.checked)}
                                                        hideLabel
                                                    >
                                                        Velg alle dager
                                                    </Checkbox>
                                                </TableHeaderCell>
                                            )}
                                            <TableHeaderCell className="w-px whitespace-nowrap">Dato</TableHeaderCell>
                                            <TableHeaderCell className="w-px whitespace-nowrap">
                                                Dagtype
                                            </TableHeaderCell>
                                            <TableHeaderCell align="right" className="w-px whitespace-nowrap">
                                                Grad
                                            </TableHeaderCell>
                                            <TableHeaderCell className="w-px whitespace-nowrap">Kilde</TableHeaderCell>
                                            <TableHeaderCell
                                                align="right"
                                                className="w-px whitespace-nowrap"
                                                title="Total sykdomsgrad for alle yrkesaktiviteter denne dagen"
                                            >
                                                Total grad
                                            </TableHeaderCell>
                                            <TableHeaderCell align="right" className="w-px whitespace-nowrap">
                                                Refusjon
                                            </TableHeaderCell>
                                            <TableHeaderCell align="right" className="w-px whitespace-nowrap">
                                                Utbetaling
                                            </TableHeaderCell>
                                            <TableHeaderCell
                                                align="right"
                                                className="hidden w-px whitespace-nowrap md:table-cell"
                                            >
                                                Dager igjen
                                            </TableHeaderCell>
                                            <TableHeaderCell className="whitespace-nowrap">Merknader</TableHeaderCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TotalRow
                                            utbetalingsberegning={utbetalingsberegning}
                                            yrkesaktivitetId={yrkesaktivitet.id}
                                        />
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
                                                            'bg-ax-bg-neutral-soft shadow-[inset_3px_0_0_0_var(--ax-border-neutral-strong)] hover:bg-ax-bg-neutral-moderate-hover',
                                                        erHelgedag && 'bg-stripes',
                                                        erAGP && (erVentetid || erHelgedag) && 'bg-agp-helg',
                                                    )}
                                                >
                                                    {erIRedigeringsmodus && (
                                                        <TableDataCell>
                                                            <Checkbox
                                                                value={dag.dato}
                                                                checked={valgteDatoer.has(dag.dato)}
                                                                onChange={(e) =>
                                                                    handleDatoToggle(dag.dato, e.target.checked)
                                                                }
                                                                hideLabel
                                                            >
                                                                Velg dag
                                                            </Checkbox>
                                                        </TableDataCell>
                                                    )}
                                                    <TableDataCell>{getFormattedDateString(dag.dato)}</TableDataCell>
                                                    <TableDataCell>
                                                        <HStack wrap={false} gap="2" align="center">
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
                                                    <TableDataCell align="right" className="whitespace-nowrap">
                                                        {dag.grad ? `${dag.grad} %` : '-'}
                                                    </TableDataCell>
                                                    <TableDataCell>
                                                        <span className="flex justify-center">
                                                            {dag.kilde && DagoversiktKildeTag[dag.kilde]}
                                                        </span>
                                                    </TableDataCell>
                                                    <TableDataCell align="right" className="w-px whitespace-nowrap">
                                                        {formaterTotalGrad(utbetalingsdata?.økonomi.totalGrad)}
                                                    </TableDataCell>
                                                    <TableDataCell align="right">
                                                        {formaterBeløpKroner(
                                                            utbetalingsdata?.økonomi.arbeidsgiverbeløp,
                                                            2,
                                                            'currency',
                                                            false,
                                                        )}
                                                    </TableDataCell>
                                                    <TableDataCell align="right">
                                                        {formaterBeløpKroner(
                                                            utbetalingsdata?.økonomi.personbeløp,
                                                            2,
                                                            'currency',
                                                            false,
                                                        )}
                                                    </TableDataCell>
                                                    <TableDataCell align="right" className="hidden md:table-cell">
                                                        -
                                                    </TableDataCell>
                                                    <TableDataCell>
                                                        {dag.dagtype === 'Avslått' &&
                                                        dag.avslåttBegrunnelse &&
                                                        dag.avslåttBegrunnelse.length > 0 ? (
                                                            <AvslåttBegrunnelser
                                                                avslåttBegrunnelse={dag.avslåttBegrunnelse}
                                                                kodeverk={kodeverk}
                                                            />
                                                        ) : null}
                                                    </TableDataCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>

                                {erIRedigeringsmodus && (
                                    <DagendringForm
                                        valgteDataer={valgteDatoer}
                                        avbryt={handleAvbrytRedigering}
                                        aktivtInntektsForhold={aktivYrkesaktivitet}
                                    />
                                )}
                            </VStack>
                        )}

                        {(!yrkesaktivitet.dagoversikt || yrkesaktivitet.dagoversikt.length === 0) && (
                            <Alert variant="info">Ingen dagoversikt funnet for dette yrkesaktivitetet.</Alert>
                        )}
                    </TabsPanel>
                ))}
            </Tabs>
        </SaksbildePanel>
    )
}

interface TotalRowProps {
    utbetalingsberegning: BeregningResponse | null | undefined
    yrkesaktivitetId: string
}

function TotalRow({ utbetalingsberegning, yrkesaktivitetId }: TotalRowProps): ReactElement {
    return (
        <TableRow>
            <TableHeaderCell className="border-b border-ax-border-neutral-strong">TOTAL</TableHeaderCell>
            <TableDataCell className="border-b border-ax-border-neutral-strong">
                {formaterDager(countUtbetalingsdagerForYrkesaktivitet(utbetalingsberegning, yrkesaktivitetId))}
            </TableDataCell>
            <TableDataCell className="border-b border-ax-border-neutral-strong" />
            <TableDataCell className="border-b border-ax-border-neutral-strong" />
            <TableDataCell className="border-b border-ax-border-neutral-strong" />
            <TableDataCell className="border-b border-ax-border-neutral-strong" align="right">
                {formaterBeløpKroner(
                    sumArbeidsgiverbeløpForYrkesaktivitet(utbetalingsberegning, yrkesaktivitetId),
                    2,
                    'currency',
                    false,
                )}
            </TableDataCell>
            <TableDataCell className="border-b border-ax-border-neutral-strong" align="right">
                {formaterBeløpKroner(
                    sumPersonbeløpForYrkesaktivitet(utbetalingsberegning, yrkesaktivitetId),
                    2,
                    'currency',
                    false,
                )}
            </TableDataCell>
            <TableDataCell className="border-b border-ax-neutral-900" />
            <TableDataCell className="border-b border-ax-neutral-900" />
        </TableRow>
    )
}
