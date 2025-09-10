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
import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'
import { Kilde } from '@/schemas/dagoversikt'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'
import { cn } from '@utils/tw'
import { DagendringForm } from '@components/saksbilde/dagoversikt/DagendringForm'
import { FetchError } from '@components/saksbilde/FetchError'
import { useKodeverk } from '@/hooks/queries/useKodeverk'
import { Vilkårshjemmel, type Kodeverk, type Årsak } from '@schemas/kodeverkV2'

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

        return yrkesaktivitetData.dager.find((dag) => dag.dato === dato) || null
    }

    // Hjelpefunksjon for å formatere beløp
    const formaterBeløp = (beløpØre: number) => {
        return new Intl.NumberFormat('nb-NO', {
            style: 'currency',
            currency: 'NOK',
            minimumFractionDigits: 0,
        }).format(beløpØre / 100)
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
                <FetchError refetch={() => refetch()} message="Kunne ikke laste dagoversikt." />
            </SaksbildePanel>
        )
    }

    if (sykmeldingsforhold.length === 0) {
        return (
            <SaksbildePanel value={value}>
                <Alert variant="info">
                    <Heading size="small">Ingen dagoversikt funnet</Heading>
                    <BodyShort>
                        Det finnes ingen yrkesaktivitet for denne saksbehandlingsperioden med dagoversikt.
                    </BodyShort>
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
                            label={getInntektsforholdDisplayText(forhold.kategorisering)}
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
                                <Table size="small">
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
                                            <TableHeaderCell>Dato</TableHeaderCell>
                                            <TableHeaderCell className="min-w-24">Dagtype</TableHeaderCell>
                                            <TableHeaderCell align="right">Grad</TableHeaderCell>
                                            <TableHeaderCell>Kilde</TableHeaderCell>
                                            <TableHeaderCell
                                                align="right"
                                                title="Total sykdomsgrad for alle yrkesaktiviteter denne dagen"
                                            >
                                                Total grad
                                            </TableHeaderCell>
                                            <TableHeaderCell align="right">Refusjon</TableHeaderCell>
                                            <TableHeaderCell align="right">Utbetaling</TableHeaderCell>
                                            <TableHeaderCell align="right">Dager igjen</TableHeaderCell>
                                            <TableHeaderCell>Merknader</TableHeaderCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {forhold.dagoversikt.map((dag, i) => {
                                            const utbetalingsdata = finnUtbetalingsdata(forhold.id, dag.dato)

                                            return (
                                                <TableRow
                                                    key={i}
                                                    className={
                                                        dag.dagtype === 'Avslått' ? 'bg-ax-bg-danger-moderate' : ''
                                                    }
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
                                                            {getDagtypeIcon(dag.dagtype)}
                                                            <BodyShort>
                                                                {getDagtypeText(
                                                                    dag.dagtype,
                                                                    dag.andreYtelserBegrunnelse,
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
                                                            {utbetalingsdata?.totalGrad
                                                                ? formaterTotalGrad(utbetalingsdata.totalGrad)
                                                                : '-'}
                                                        </BodyShort>
                                                    </TableDataCell>
                                                    <TableDataCell align="right">
                                                        <BodyShort>
                                                            {utbetalingsdata
                                                                ? formaterBeløp(utbetalingsdata.refusjonØre)
                                                                : '-'}
                                                        </BodyShort>
                                                    </TableDataCell>
                                                    <TableDataCell align="right">
                                                        <BodyShort>
                                                            {utbetalingsdata
                                                                ? formaterBeløp(utbetalingsdata.utbetalingØre)
                                                                : '-'}
                                                        </BodyShort>
                                                    </TableDataCell>
                                                    <TableDataCell align="right">
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

function getDagtypeIcon(dagtype: Dagtype): ReactElement {
    switch (dagtype) {
        case 'Syk':
        case 'SykNav':
            return <BandageIcon aria-hidden />
        default:
            return <span className="w-[18px]" />
    }
}

function KildeTag({ kilde }: { kilde: Kilde | null }): ReactElement {
    if (kilde === 'Søknad') {
        return (
            <Tag variant="alt1" className="text-small mt-[2px] h-5 min-h-5 w-6 rounded-sm leading-0">
                SØ
            </Tag>
        )
    }
    if (kilde === 'Saksbehandler') {
        return (
            <Tag variant="neutral" className="text-small mt-[2px] h-5 min-h-5 w-6 rounded-sm leading-0">
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

function getLovdataUrl(hjemmel: Vilkårshjemmel): string | undefined {
    const { lovverk, kapittel, paragraf } = hjemmel

    // Kun for folketrygdloven
    if (lovverk?.toLowerCase().includes('folketrygdloven') && kapittel) {
        const paragrafNummer = paragraf || '1' // Bruk paragraf 1 hvis ingen paragraf er spesifisert
        return `https://lovdata.no/lov/1997-02-28-19/§${kapittel}-${paragrafNummer}`
    }

    return undefined
}

function formatParagraf(hjemmel: Vilkårshjemmel): string {
    const { kapittel, paragraf, ledd, setning, bokstav } = hjemmel
    if (!kapittel) return ''

    let result = `§${kapittel}`
    if (paragraf) result += `-${paragraf}`
    if (ledd) result += ` ${ledd}. ledd`
    if (setning) result += ` ${setning}. setning`
    if (bokstav) result += ` bokstav ${bokstav}`
    return result
}

function getDagtypeText(type: Dagtype, andreYtelserType?: string[]): string {
    switch (type) {
        case 'Syk':
            return 'Syk'
        case 'SykNav':
            return 'Syk (NAV)'
        case 'Helg':
            return 'Helg'
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

function getInntektsforholdDisplayText(kategorisering: Record<string, string | string[]>): ReactElement {
    const inntektskategori = kategorisering['INNTEKTSKATEGORI'] as string
    const orgnummer = kategorisering['ORGNUMMER'] as string

    let typeText: string
    switch (inntektskategori) {
        case 'ARBEIDSTAKER': {
            const typeArbeidstaker = kategorisering['TYPE_ARBEIDSTAKER']
            switch (typeArbeidstaker) {
                case 'ORDINÆRT_ARBEIDSFORHOLD':
                    typeText = 'Ordinært arbeidsforhold'
                    break
                case 'MARITIMT_ARBEIDSFORHOLD':
                    typeText = 'Maritimt arbeidsforhold'
                    break
                case 'FISKER':
                    typeText = 'Fisker (arbeidstaker)'
                    break
                case 'VERNEPLIKTIG':
                    typeText = 'Vernepliktig'
                    break
                default:
                    typeText = 'Arbeidstaker'
            }
            break
        }
        case 'FRILANSER':
            typeText = 'Frilanser'
            break
        case 'SELVSTENDIG_NÆRINGSDRIVENDE': {
            // TODO Her må det gjøres noe
            const typeSelvstendig = kategorisering['TYPE_SELVSTENDIG_NÆRINGSDRIVENDE']
            switch (typeSelvstendig) {
                case 'FISKER':
                    typeText = 'Fisker (selvstendig)'
                    break
                case 'JORDBRUKER':
                    typeText = 'Jordbruker'
                    break
                case 'REINDRIFT':
                    typeText = 'Reindrift'
                    break
                default:
                    typeText = 'Selvstendig næringsdrivende'
            }
            break
        }
        case 'INAKTIV':
            typeText = 'Inaktiv'
            break
        default:
            typeText = inntektskategori || 'Ukjent'
    }

    // Hvis det finnes orgnummer, vis organisasjonsnavn
    if (orgnummer) {
        return (
            <div className="text-center">
                <div className="text-sm font-medium">
                    <Organisasjonsnavn orgnummer={orgnummer} />
                </div>
                <div className="text-gray-600 text-xs">{typeText}</div>
            </div>
        )
    }

    return <span>{typeText}</span>
}
