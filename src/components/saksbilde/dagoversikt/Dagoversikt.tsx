'use client'

import React, { Fragment, ReactElement, useState } from 'react'
import { Alert, BodyShort, Button, Checkbox, Heading, HStack, Link, Table, Tabs, Tag, Tooltip } from '@navikt/ds-react'
import { TabsList, TabsPanel, TabsTab } from '@navikt/ds-react/Tabs'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'
import { BandageIcon, PersonPencilIcon } from '@navikt/aksel-icons'

import { Dagtype } from '@schemas/dagoversikt'
import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'
import { useUtbetalingsberegning } from '@hooks/queries/useUtbetalingsberegning'
import { getFormattedDateString } from '@utils/date-format'
import { Kilde } from '@/schemas/dagoversikt'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'
import { cn } from '@utils/tw'
import { DagendringForm } from '@components/saksbilde/dagoversikt/DagendringForm'
import { PeriodeForm } from '@components/saksbilde/dagoversikt/PeriodeForm'
import { FetchError } from '@components/saksbilde/FetchError'
import { useKodeverk } from '@/hooks/queries/useKodeverk'
import { type Kodeverk, type Årsak } from '@schemas/kodeverkV2'
import { formatParagraf, getLovdataUrl } from '@utils/paragraf-formatering'
import { erHelg } from '@utils/erHelg'
import { Periode, Periodetype, Yrkesaktivitet } from '@schemas/yrkesaktivitet'

import { getInntektsforholdDisplayText } from '../yrkesaktivitet/yrkesaktivitetVisningTekst'

interface DagoversiktProps {
    value: string
}

export function Dagoversikt({ value }: DagoversiktProps): ReactElement {
    const {
        data: yrkesaktivitet,
        isLoading: yrkesaktivitetLoading,
        isError: yrkesaktivitetError,
        refetch,
    } = useYrkesaktivitet()
    const { data: utbetalingsberegning } = useUtbetalingsberegning()
    const { data: kodeverk = [] } = useKodeverk()

    // Filtrer kun yrkesaktivitet hvor personen har dagoversikt med innhold
    const sykmeldingsforhold =
        yrkesaktivitet?.filter((forhold) => forhold.dagoversikt && forhold.dagoversikt.length > 0) || []

    const kanSaksbehandles = useKanSaksbehandles()
    const [aktivtInntektsforholdId, setAktivtInntektsforholdId] = useState<string>()
    const [erIRedigeringsmodus, setErIRedigeringsmodus] = useState(false)
    const [valgteDataer, setValgteDataer] = useState<Set<string>>(new Set())

    // Sett første sykmeldingsforhold som aktivt hvis det ikke er sett
    const aktivtForhold = aktivtInntektsforholdId
        ? sykmeldingsforhold.find((f) => f.id === aktivtInntektsforholdId)
        : sykmeldingsforhold[0]

    const handleDatoToggle = (dato: string, valgt: boolean) => {
        const nyeValgteDataer = new Set(valgteDataer)
        if (valgt) {
            nyeValgteDataer.add(dato)
        } else {
            nyeValgteDataer.delete(dato)
        }
        setValgteDataer(nyeValgteDataer)
    }

    const handleVelgAlle = (valgt: boolean) => {
        if (!aktivtForhold?.dagoversikt) return

        if (valgt) {
            // Velg alle dager
            const alleDataer = new Set(aktivtForhold.dagoversikt.map((dag) => dag.dato))
            setValgteDataer(alleDataer)
        } else {
            // Fjern alle dager
            setValgteDataer(new Set())
        }
    }

    const handleAvbrytRedigering = () => {
        setErIRedigeringsmodus(false)
        setValgteDataer(new Set())
    }

    // Sjekk om alle dager er valgt for aktivt forhold
    const erAlleValgt = aktivtForhold?.dagoversikt
        ? aktivtForhold.dagoversikt.every((dag) => valgteDataer.has(dag.dato))
        : false

    // Sjekk om noen dager er valgt (for indeterminate state)
    const erNoenValgt = aktivtForhold?.dagoversikt
        ? aktivtForhold.dagoversikt.some((dag) => valgteDataer.has(dag.dato))
        : false

    // Hjelpefunksjon for å finne utbetalingsdata for en spesifikk dag og yrkesaktivitet
    const finnUtbetalingsdata = (yrkesaktivitetId: string, dato: string) => {
        if (!utbetalingsberegning?.beregningData?.yrkesaktiviteter) {
            return null
        }

        const yrkesaktivitetData = utbetalingsberegning.beregningData.yrkesaktiviteter.find(
            (ya) => ya.yrkesaktivitetId === yrkesaktivitetId,
        )

        if (!yrkesaktivitetData) {
            return null
        }

        return yrkesaktivitetData.utbetalingstidslinje.dager.find((dag) => dag.dato === dato) || null
    }

    // Hjelpefunksjon for å sjekke om en dag er i en spesifikk periode
    const erDagIPeriode = (dato: string, periodeType: Periodetype, yrkesaktivitet: Yrkesaktivitet) => {
        if (!yrkesaktivitet?.perioder) return false

        // Sjekk om perioder.type matcher ønsket periodeType
        if (yrkesaktivitet.perioder.type !== periodeType) return false

        // Sjekk om datoen faller innenfor noen av periodene
        return yrkesaktivitet.perioder.perioder.some((periode: Periode) => dato >= periode.fom && dato <= periode.tom)
    }

    // Hjelpefunksjon for å formatere beløp
    const formaterBeløp = (beløp: number) => {
        return new Intl.NumberFormat('nb-NO', {
            style: 'currency',
            currency: 'NOK',
            minimumFractionDigits: 0,
        }).format(beløp)
    }

    // Hjelpefunksjon for å formatere total grad med farger
    const formaterTotalGrad = (totalGrad: number) => {
        const colorClass = totalGrad >= 20 ? 'text-green-600' : totalGrad > 0 ? 'text-orange-600' : 'text-gray-500'
        return <span className={colorClass}>{totalGrad} %</span>
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

    if (sykmeldingsforhold.length === 0) {
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
                value={aktivtForhold?.id || sykmeldingsforhold[0]?.id}
                onChange={(value) => setAktivtInntektsforholdId(value)}
            >
                <TabsList>
                    {sykmeldingsforhold.map((forhold) => (
                        <TabsTab
                            key={forhold.id}
                            value={forhold.id}
                            label={getInntektsforholdDisplayText(forhold.kategorisering, forhold.orgnavn)}
                        />
                    ))}
                </TabsList>

                {sykmeldingsforhold.map((forhold) => (
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
                                <div className="overflow-x-auto">
                                    <Table
                                        size="small"
                                        // prettier-ignore
                                        className="min-w-[800px] table-fixed xl:min-w-[1200px] lg:min-w-[1000px]"
                                    >
                                        <TableHeader>
                                            <TableRow>
                                                {erIRedigeringsmodus && (
                                                    <TableHeaderCell>
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
                                                <TableHeaderCell className="w-16 min-w-16">Kilde</TableHeaderCell>
                                                <TableHeaderCell
                                                    align="right"
                                                    className="w-24 min-w-20 whitespace-nowrap"
                                                    title="Total sykdomsgrad for alle yrkesaktiviteter denne dagen"
                                                >
                                                    Total grad
                                                </TableHeaderCell>
                                                <TableHeaderCell align="right" className="w-24 min-w-24">
                                                    Refusjon
                                                </TableHeaderCell>
                                                <TableHeaderCell align="right" className="w-24 min-w-24">
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
                                                const utbetalingsdata = finnUtbetalingsdata(forhold.id, dag.dato)

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
                                                            erHelgedag && 'bg-stripes',
                                                            (erAGP || erVentetid) && 'bg-gray-100',
                                                        )}
                                                    >
                                                        {erIRedigeringsmodus && (
                                                            <TableDataCell>
                                                                <Checkbox
                                                                    value={dag.dato}
                                                                    checked={valgteDataer.has(dag.dato)}
                                                                    onChange={(e) =>
                                                                        handleDatoToggle(dag.dato, e.target.checked)
                                                                    }
                                                                    hideLabel
                                                                >
                                                                    Velg dag
                                                                </Checkbox>
                                                            </TableDataCell>
                                                        )}
                                                        <TableDataCell>
                                                            <BodyShort>{getFormattedDateString(dag.dato)}</BodyShort>
                                                        </TableDataCell>
                                                        <TableDataCell>
                                                            <HStack wrap={false} gap="2" align="center">
                                                                {getDagtypeIcon(dag.dagtype, erHelgedag)}
                                                                <BodyShort>
                                                                    {getDagtypeText(
                                                                        dag.dagtype,
                                                                        dag.andreYtelserBegrunnelse,
                                                                        erHelgedag,
                                                                        erAGP,
                                                                        erVentetid,
                                                                    )}
                                                                </BodyShort>
                                                            </HStack>
                                                        </TableDataCell>
                                                        <TableDataCell align="right">
                                                            <BodyShort className="whitespace-nowrap">
                                                                {dag.grad ? `${dag.grad} %` : '-'}
                                                            </BodyShort>
                                                        </TableDataCell>
                                                        <TableDataCell>
                                                            <KildeTag kilde={dag.kilde} />
                                                        </TableDataCell>
                                                        <TableDataCell align="right">
                                                            <BodyShort>
                                                                {utbetalingsdata?.økonomi.totalGrad
                                                                    ? formaterTotalGrad(
                                                                          Math.round(
                                                                              utbetalingsdata.økonomi.totalGrad * 100,
                                                                          ),
                                                                      )
                                                                    : '-'}
                                                            </BodyShort>
                                                        </TableDataCell>
                                                        <TableDataCell align="right">
                                                            <BodyShort>
                                                                {utbetalingsdata
                                                                    ? formaterBeløp(
                                                                          utbetalingsdata.økonomi.arbeidsgiverbeløp ||
                                                                              0,
                                                                      )
                                                                    : '-'}
                                                            </BodyShort>
                                                        </TableDataCell>
                                                        <TableDataCell align="right">
                                                            <BodyShort>
                                                                {utbetalingsdata
                                                                    ? formaterBeløp(
                                                                          utbetalingsdata.økonomi.personbeløp || 0,
                                                                      )
                                                                    : '-'}
                                                            </BodyShort>
                                                        </TableDataCell>
                                                        <TableDataCell align="right" className="hidden md:table-cell">
                                                            <BodyShort>-</BodyShort>
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
                                </div>

                                {erIRedigeringsmodus && (
                                    <DagendringForm
                                        valgteDataer={valgteDataer}
                                        avbryt={handleAvbrytRedigering}
                                        aktivtInntektsForhold={aktivtForhold}
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

function getDagtypeIcon(dagtype: Dagtype, helgedag: boolean): ReactElement {
    const spanMedBredde = <span className="w-[18px]" />

    if (helgedag) {
        return spanMedBredde
    }

    switch (dagtype) {
        case 'Syk':
        case 'SykNav':
        case 'Behandlingsdag':
            return <BandageIcon aria-hidden />
        default:
            return spanMedBredde
    }
}

function KildeTag({ kilde }: { kilde: Kilde | null }): ReactElement {
    if (kilde === 'Søknad') {
        return (
            <Tag variant="alt1" className="text-small mt-0.5 h-5 min-h-5 w-6 rounded-sm leading-0">
                SØ
            </Tag>
        )
    }
    if (kilde === 'Saksbehandler') {
        return (
            <Tag variant="neutral" className="text-small mt-0.5 h-5 min-h-5 w-6 rounded-sm leading-0">
                SB
            </Tag>
        )
    }
    return <Fragment />
}

interface AvslåttBegrunnelserProps {
    avslåttBegrunnelse: string[]
    kodeverk: Kodeverk
}

function AvslåttBegrunnelser({ avslåttBegrunnelse, kodeverk }: AvslåttBegrunnelserProps): ReactElement {
    if (!avslåttBegrunnelse || avslåttBegrunnelse.length === 0 || !kodeverk) {
        return <Fragment />
    }

    // Finn paragraf-referanser og beskrivelser for alle avslagsbegrunnelser
    const begrunnelser: Array<{ paragraf: string; beskrivelse: string; lovdataUrl?: string }> = []

    for (const kode of avslåttBegrunnelse) {
        for (const vilkår of kodeverk) {
            const årsak = vilkår.ikkeOppfylt.find((årsak: Årsak) => årsak.kode === kode)
            if (årsak) {
                const paragraf = årsak.vilkårshjemmel ? formatParagraf(årsak.vilkårshjemmel) : kode
                const lovdataUrl = årsak.vilkårshjemmel ? getLovdataUrl(årsak.vilkårshjemmel) : undefined
                begrunnelser.push({ paragraf, beskrivelse: årsak.beskrivelse, lovdataUrl })
                break
            }
        }
    }

    if (begrunnelser.length === 0) {
        return <Fragment />
    }

    return (
        <HStack gap="1" wrap={false}>
            {begrunnelser.map((begrunnelse, index) => (
                <Fragment key={index}>
                    <Tooltip content={begrunnelse.beskrivelse}>
                        {begrunnelse.lovdataUrl ? (
                            <Link href={begrunnelse.lovdataUrl} target="_blank" rel="noopener noreferrer">
                                <BodyShort size="small">{begrunnelse.paragraf}</BodyShort>
                            </Link>
                        ) : (
                            <BodyShort size="small">{begrunnelse.paragraf}</BodyShort>
                        )}
                    </Tooltip>
                    {index < begrunnelser.length - 1 && <span>, </span>}
                </Fragment>
            ))}
        </HStack>
    )
}

function getDagtypeText(
    type: Dagtype,
    andreYtelserType?: string[],
    erHelgedag?: boolean,
    erAGP?: boolean,
    erVentetid?: boolean,
): string {
    const baseText = (() => {
        switch (type) {
            case 'Syk':
                return 'Syk'
            case 'SykNav':
                return 'Syk (NAV)'
            case 'Behandlingsdag':
                return 'Behandlingsdag'
            case 'Ferie':
                return 'Ferie'
            case 'Arbeidsdag':
                return 'Arbeid'
            case 'Permisjon':
                return 'Permisjon'
            case 'Avslått':
                return 'Avslått'
            case 'AndreYtelser':
                return andreYtelserType ? andreYtelserTypeText[andreYtelserType[0]] : 'Andre ytelser'
            default:
                return type
        }
    })()

    // Prioriter AGP og ventetid over dagtype for helgedager
    if (erHelgedag) {
        if (erAGP) {
            return 'Helg (AGP)'
        }
        if (erVentetid) {
            return 'Helg (Ventetid)'
        }
        return `Helg (${baseText})`
    }

    if (erAGP) {
        return `${baseText} (AGP)`
    }

    if (erVentetid) {
        return `${baseText} (Ventetid)`
    }

    return baseText
}

export const andreYtelserTypeText: Record<string, string> = {
    AndreYtelserAap: 'AAP',
    AndreYtelserDagpenger: 'Dagpenger',
    AndreYtelserForeldrepenger: 'Foreldrepenger',
    AndreYtelserOmsorgspenger: 'Omsorgspenger',
    AndreYtelserOpplaringspenger: 'Opplæringspenger',
    AndreYtelserPleiepenger: 'Pleiepenger',
    AndreYtelserSvangerskapspenger: 'Svangerskapspenger',
}
