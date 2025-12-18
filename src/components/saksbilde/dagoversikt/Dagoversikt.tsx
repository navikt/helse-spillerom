'use client'

import React, { ReactElement, useState } from 'react'
import { Alert, BodyShort, Button, Checkbox, Heading, HStack, Table, Tabs } from '@navikt/ds-react'
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
} from '@components/saksbilde/dagoversikt/dagoversiktUtils'
import { ComparisonTable } from '@components/saksbilde/dagoversikt/ComparisonTable'

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
                <TabsPanel value="overview">
                    <ComparisonTable
                        yrkesaktiviteter={yrkesaktivitetMedDagoversikt}
                        utbetalingsberegning={utbetalingsberegning}
                    />
                </TabsPanel>
                {yrkesaktivitetMedDagoversikt.map((forhold) => (
                    <TabsPanel
                        className={cn('pb-8', {
                            '-mx-8 border-l-6 border-ax-border-accent bg-ax-bg-neutral-soft pr-8 pl-[26px]':
                                erIRedigeringsmodus,
                        })}
                        key={forhold.id}
                        value={forhold.id}
                    >
                        {forhold.dagoversikt && forhold.dagoversikt.length > 0 && (
                            <>
                                {/* Periode-form for arbeidsgiverperiode/ventetid */}
                                <div className="mb-6">
                                    <PeriodeForm yrkesaktivitet={forhold} kanSaksbehandles={kanSaksbehandles} />
                                </div>

                                {kanSaksbehandles && (
                                    <Button
                                        size="small"
                                        type="button"
                                        variant="tertiary"
                                        className="my-6"
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
                                <Table
                                    size="small"
                                    // prettier-ignore
                                    className="min-w-[800px] table-fixed xl:min-w-[1200px] lg:min-w-[1000px]"
                                >
                                    <TableHeader>
                                        <TableRow>
                                            {erIRedigeringsmodus && (
                                                <TableHeaderCell className="w-12">
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
                                            <TableHeaderCell className="w-26 min-w-20">Dato</TableHeaderCell>
                                            <TableHeaderCell className="w-46">Dagtype</TableHeaderCell>
                                            <TableHeaderCell align="right" className="w-16 min-w-16">
                                                Grad
                                            </TableHeaderCell>
                                            <TableHeaderCell className="w-14 min-w-14">Kilde</TableHeaderCell>
                                            <TableHeaderCell
                                                align="right"
                                                className="w-24 min-w-20 whitespace-nowrap"
                                                title="Total sykdomsgrad for alle yrkesaktiviteter denne dagen"
                                            >
                                                Total grad
                                            </TableHeaderCell>
                                            <TableHeaderCell align="right" className="w-28 min-w-28">
                                                Refusjon
                                            </TableHeaderCell>
                                            <TableHeaderCell align="right" className="w-28 min-w-28">
                                                Utbetaling
                                            </TableHeaderCell>
                                            <TableHeaderCell
                                                align="right"
                                                className="hidden w-28 min-w-20 whitespace-nowrap md:table-cell"
                                            >
                                                Dager igjen
                                            </TableHeaderCell>
                                            <TableHeaderCell className="min-w-28">Merknader</TableHeaderCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {forhold.dagoversikt.map((dag, i) => {
                                            const utbetalingsdata = utbetalingsberegning
                                                ? finnUtbetalingsdata(utbetalingsberegning, forhold.id, dag.dato)
                                                : null

                                            const erHelgedag = erHelg(new Date(dag.dato))
                                            const erAGP = erDagIPeriode(dag.dato, 'ARBEIDSGIVERPERIODE', forhold)
                                            const erVentetid =
                                                erDagIPeriode(dag.dato, 'VENTETID', forhold) ||
                                                erDagIPeriode(dag.dato, 'VENTETID_INAKTIV', forhold)

                                            return (
                                                <TableRow
                                                    key={i}
                                                    className={cn(
                                                        dag.dagtype === 'Avslått' && 'bg-ax-bg-danger-moderate',
                                                        (erAGP || erVentetid) &&
                                                            'bg-ax-bg-neutral-soft hover:bg-ax-bg-neutral-moderate-hover shadow-[inset_3px_0_0_0_var(--ax-border-neutral-strong)]',
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
                                                            {getDagtypeText(
                                                                dag.dagtype,
                                                                dag.andreYtelserBegrunnelse,
                                                                erHelgedag,
                                                                erAGP,
                                                                erVentetid,
                                                            )}
                                                        </HStack>
                                                    </TableDataCell>
                                                    <TableDataCell align="right">
                                                        {dag.grad ? `${dag.grad} %` : '-'}
                                                    </TableDataCell>
                                                    <TableDataCell>
                                                        <span className="flex justify-center">
                                                            {dag.kilde && DagoversiktKildeTag[dag.kilde]}
                                                        </span>
                                                    </TableDataCell>
                                                    <TableDataCell align="right">
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
                            </>
                        )}

                        {(!forhold.dagoversikt || forhold.dagoversikt.length === 0) && (
                            <Alert variant="info">Ingen dagoversikt funnet for dette yrkesaktivitetet.</Alert>
                        )}
                    </TabsPanel>
                ))}
            </Tabs>
        </SaksbildePanel>
    )
}
