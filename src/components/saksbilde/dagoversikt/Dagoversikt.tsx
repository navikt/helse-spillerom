'use client'

import { ReactElement, useState } from 'react'
import { Alert, BodyShort, Button, Heading, HStack, Table, Tabs } from '@navikt/ds-react'
import { TabsList, TabsPanel, TabsTab } from '@navikt/ds-react/Tabs'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'
import { BandageIcon, PersonPencilIcon } from '@navikt/aksel-icons'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'
import { getFormattedDateString } from '@utils/date-format'
import { kildeIcon } from '@components/ikoner/kilde/kildeIcon'

interface DagoversiktProps {
    value: string
}

export function Dagoversikt({ value }: DagoversiktProps): ReactElement {
    const {
        data: inntektsforhold,
        isLoading: inntektsforholdLoading,
        isError: inntektsforholdError,
    } = useInntektsforhold()

    // Filtrer kun inntektsforhold hvor personen har dagoversikt med innhold
    const sykmeldingsforhold =
        inntektsforhold?.filter((forhold) => forhold.dagoversikt && forhold.dagoversikt.length > 0) || []

    const [aktivtInntektsforholdId, setAktivtInntektsforholdId] = useState<string>()

    // Sett første sykmeldingsforhold som aktivt hvis det ikke er satt
    const aktivtForhold = aktivtInntektsforholdId
        ? sykmeldingsforhold.find((f) => f.id === aktivtInntektsforholdId)
        : sykmeldingsforhold[0]

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
            case 'Foreldet':
                return 'Foreldet'
            case 'Avvist':
                return 'Avvist'
            default:
                return type
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
                    <Heading size="small">Ingen dagoversikt funnet</Heading>
                    <BodyShort>
                        Det finnes ingen inntektsforhold for denne saksbehandlingsperioden med dagoversikt.
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
                        {forhold.dagoversikt && forhold.dagoversikt.length > 0 && (
                            <>
                                <Button
                                    size="small"
                                    type="button"
                                    variant="tertiary"
                                    className="my-6"
                                    icon={<PersonPencilIcon />}
                                >
                                    Endre dager
                                </Button>
                                <Table size="small">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHeaderCell>Dato</TableHeaderCell>
                                            <TableHeaderCell>Dagtype</TableHeaderCell>
                                            <TableHeaderCell align="right">Grad</TableHeaderCell>
                                            <TableHeaderCell>Kilde</TableHeaderCell>
                                            <TableHeaderCell align="right">Total grad</TableHeaderCell>
                                            <TableHeaderCell align="right">Refusjon</TableHeaderCell>
                                            <TableHeaderCell align="right">Utbetaling</TableHeaderCell>
                                            <TableHeaderCell align="right">Dager igjen</TableHeaderCell>
                                            <TableHeaderCell>Merknader</TableHeaderCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {forhold.dagoversikt.map((dag, i) => (
                                            <TableRow key={i}>
                                                <TableDataCell>
                                                    <BodyShort>{getFormattedDateString(dag.dato)}</BodyShort>
                                                </TableDataCell>
                                                <TableDataCell>
                                                    <HStack wrap={false} gap="2" align="center">
                                                        {getDagtypeIcon(dag.dagtype)}
                                                        <BodyShort>{getDagtypeText(dag.dagtype)}</BodyShort>
                                                    </HStack>
                                                </TableDataCell>
                                                <TableDataCell align="right">
                                                    <BodyShort>100 %</BodyShort>
                                                </TableDataCell>
                                                <TableDataCell>
                                                    <div className="ml-2">{kildeIcon[dag.kilde]}</div>
                                                </TableDataCell>
                                                <TableDataCell align="right">
                                                    <BodyShort>100 %</BodyShort>
                                                </TableDataCell>
                                                <TableDataCell align="right">
                                                    <BodyShort>100,00 kr</BodyShort>
                                                </TableDataCell>
                                                <TableDataCell align="right">
                                                    <BodyShort>-</BodyShort>
                                                </TableDataCell>
                                                <TableDataCell align="right">
                                                    <BodyShort>{248 - i}</BodyShort>
                                                </TableDataCell>
                                                <TableDataCell />
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </>
                        )}

                        {(!forhold.dagoversikt || forhold.dagoversikt.length === 0) && (
                            <Alert variant="info">Ingen dagoversikt funnet for dette inntektsforholdet.</Alert>
                        )}
                    </TabsPanel>
                ))}
            </Tabs>
        </SaksbildePanel>
    )
}

function getDagtypeIcon(dagtype: string): ReactElement {
    switch (dagtype) {
        case 'Syk':
        case 'SykNav':
            return <BandageIcon />
        default:
            return <span className="w-[18px]" />
    }
}
