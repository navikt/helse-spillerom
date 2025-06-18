'use client'

import { ReactElement, useState } from 'react'
import { Alert, BodyShort, Heading, Table, Tabs, Tag } from '@navikt/ds-react'
import { TabsList, TabsPanel, TabsTab } from '@navikt/ds-react/Tabs'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'
import { useDagoversikt } from '@hooks/queries/useDagoversikt'

interface DagoversiktProps {
    value: string
}

export function Dagoversikt({ value }: DagoversiktProps): ReactElement {
    const {
        data: inntektsforhold,
        isLoading: inntektsforholdLoading,
        isError: inntektsforholdError,
    } = useInntektsforhold()

    // Filtrer kun inntektsforhold hvor personen er sykmeldt fra
    const sykmeldingsforhold =
        inntektsforhold?.filter((forhold) => forhold.kategorisering['ER_SYKMELDT'] === 'ER_SYKMELDT_JA') || []

    const [aktivtInntektsforholdId, setAktivtInntektsforholdId] = useState<string>()

    // Sett første sykmeldingsforhold som aktivt hvis det ikke er satt
    const aktivtForhold = aktivtInntektsforholdId
        ? sykmeldingsforhold.find((f) => f.id === aktivtInntektsforholdId)
        : sykmeldingsforhold[0]

    const {
        data: dagoversikt,
        isLoading: dagoversiktLoading,
        isError: dagoversiktError,
    } = useDagoversikt({
        inntektsforholdId: aktivtForhold?.id,
    })

    const getInntektsforholdDisplayText = (kategorisering: Record<string, string | string[]>): string => {
        const inntektskategori = kategorisering['INNTEKTSKATEGORI'] as string

        switch (inntektskategori) {
            case 'ARBEIDSTAKER': {
                const typeArbeidstaker = kategorisering['TYPE_ARBEIDSTAKER']
                switch (typeArbeidstaker) {
                    case 'ORDINÆRT_ARBEIDSFORHOLD':
                        return 'Ordinært arbeidsforhold'
                    case 'MARITIMT_ARBEIDSFORHOLD':
                        return 'Maritimt arbeidsforhold'
                    case 'FISKER':
                        return 'Fisker (arbeidstaker)'
                    default:
                        return 'Arbeidstaker'
                }
            }
            case 'FRILANSER':
                return 'Frilanser'
            case 'SELVSTENDIG_NÆRINGSDRIVENDE': {
                // TODO Her må det gjøres noe
                const typeSelvstendig = kategorisering['TYPE_SELVSTENDIG_NÆRINGSDRIVENDE']
                switch (typeSelvstendig) {
                    case 'FISKER':
                        return 'Fisker (selvstendig)'
                    case 'JORDBRUKER':
                        return 'Jordbruker'
                    case 'REINDRIFT':
                        return 'Reindrift'
                    default:
                        return 'Selvstendig næringsdrivende'
                }
            }
            case 'INAKTIV':
                return 'Inaktiv'
            default:
                return inntektskategori || 'Ukjent'
        }
    }

    const getDagtypeText = (type: string): string => {
        switch (type) {
            case 'SYKEDAG':
                return 'Sykedag'
            case 'HELGEDAG':
                return 'Helgedag'
            case 'FERIEDAG':
                return 'Feriedag'
            case 'ARBEIDSDAG':
                return 'Arbeidsdag'
            case 'PERMISJONSDAG':
                return 'Permisjonsdag'
            default:
                return type
        }
    }

    const getDagtypeVariant = (type: string): 'success' | 'warning' | 'info' | 'neutral' | 'error' => {
        switch (type) {
            case 'SYKEDAG':
                return 'error'
            case 'HELGEDAG':
                return 'neutral'
            case 'FERIEDAG':
                return 'info'
            case 'ARBEIDSDAG':
                return 'success'
            case 'PERMISJONSDAG':
                return 'warning'
            default:
                return 'neutral'
        }
    }

    if (inntektsforholdLoading) {
        return <SaksbildePanel value={value}>Laster inntektsforhold...</SaksbildePanel>
    }

    if (inntektsforholdError) {
        return (
            <SaksbildePanel value={value}>
                <Alert variant="error">Kunne ikke laste inntektsforhold</Alert>
            </SaksbildePanel>
        )
    }

    if (sykmeldingsforhold.length === 0) {
        return (
            <SaksbildePanel value={value}>
                <Alert variant="info">
                    <Heading size="small">Ingen sykmeldingsforhold funnet</Heading>
                    <BodyShort>
                        Det finnes ingen inntektsforhold for denne saksbehandlingsperioden hvor personen er sykmeldt fra
                        forholdet.
                    </BodyShort>
                </Alert>
            </SaksbildePanel>
        )
    }

    return (
        <SaksbildePanel value={value}>
            <Tabs
                value={aktivtForhold?.id || sykmeldingsforhold[0]?.id}
                onChange={(value) => setAktivtInntektsforholdId(value)}
            >
                <TabsList>
                    {sykmeldingsforhold.map((forhold) => (
                        <TabsTab
                            key={forhold.id}
                            value={forhold.id}
                            label={`${getInntektsforholdDisplayText(forhold.kategorisering)}${forhold.kategorisering['ORGNAVN'] ? ` - ${forhold.kategorisering['ORGNAVN']}` : ''}`}
                        />
                    ))}
                </TabsList>

                {sykmeldingsforhold.map((forhold) => (
                    <TabsPanel key={forhold.id} value={forhold.id}>
                        {dagoversiktLoading && <BodyShort>Laster dagoversikt...</BodyShort>}

                        {dagoversiktError && <Alert variant="error">Kunne ikke laste dagoversikt</Alert>}

                        {dagoversikt && dagoversikt.length > 0 && (
                            <Table size="medium">
                                <TableHeader>
                                    <TableRow>
                                        <TableHeaderCell>Dato</TableHeaderCell>
                                        <TableHeaderCell>Dagtype</TableHeaderCell>
                                        <TableHeaderCell>Status</TableHeaderCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dagoversikt.map((dag) => (
                                        <TableRow key={dag.id}>
                                            <TableDataCell>
                                                <BodyShort>
                                                    {new Date(dag.dato).toLocaleDateString('nb-NO', {
                                                        weekday: 'short',
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                    })}
                                                </BodyShort>
                                            </TableDataCell>
                                            <TableDataCell>
                                                <BodyShort>{getDagtypeText(dag.type)}</BodyShort>
                                            </TableDataCell>
                                            <TableDataCell>
                                                <Tag variant={getDagtypeVariant(dag.type)} size="small">
                                                    {getDagtypeText(dag.type)}
                                                </Tag>
                                            </TableDataCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {dagoversikt && dagoversikt.length === 0 && (
                            <Alert variant="info">Ingen dagoversikt funnet for dette inntektsforholdet.</Alert>
                        )}
                    </TabsPanel>
                ))}
            </Tabs>
        </SaksbildePanel>
    )
}
