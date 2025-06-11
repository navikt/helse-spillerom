'use client'

import { ReactElement, useState } from 'react'
import { Button, HStack, VStack, Table, BodyShort, Heading, Select, Switch, Alert, TextField } from '@navikt/ds-react'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'
import { PlusIcon } from '@navikt/aksel-icons'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'
import { useOpprettInntektsforhold } from '@hooks/mutations/useOpprettInntektsforhold'
import { Inntektsforholdtype } from '@schemas/inntektsforhold'

interface InntektsforholdProps {
    value: string
}

export function Inntektsforhold({ value }: InntektsforholdProps): ReactElement {
    const { data: inntektsforhold, isLoading, isError } = useInntektsforhold()
    const opprettInntektsforhold = useOpprettInntektsforhold()

    const [visSopprettForm, setVisOpprettForm] = useState(false)
    const [nyInntektsforholdtype, setNyInntektsforholdtype] = useState<Inntektsforholdtype>('ORDINÆRT_ARBEIDSFORHOLD')
    const [nySykmeldtFraForholdet, setNySykmeldtFraForholdet] = useState(false)
    const [nyOrgnummer, setNyOrgnummer] = useState('')

    const handleOpprett = () => {
        // Valider at orgnummer er påkrevd for alle typer utenom arbeidsledig
        const erArbeidsledig = nyInntektsforholdtype === 'ARBEIDSLEDIG'
        if (!erArbeidsledig && !nyOrgnummer.trim()) {
            return // Du kan legge til error state her hvis ønskelig
        }

        opprettInntektsforhold.mutate(
            {
                inntektsforholdtype: nyInntektsforholdtype,
                sykmeldtFraForholdet: nySykmeldtFraForholdet,
                orgnummer: nyOrgnummer.trim() || undefined,
            },
            {
                onSuccess: () => {
                    setVisOpprettForm(false)
                    setNyInntektsforholdtype('ORDINÆRT_ARBEIDSFORHOLD')
                    setNySykmeldtFraForholdet(false)
                    setNyOrgnummer('')
                },
            },
        )
    }

    const getInntektsforholdtypeText = (type: Inntektsforholdtype): string => {
        switch (type) {
            case 'ORDINÆRT_ARBEIDSFORHOLD':
                return 'Ordinært arbeidsforhold'
            case 'FRILANSER':
                return 'Frilanser'
            case 'SELVSTENDIG_NÆRINGSDRIVENDE':
                return 'Selvstendig næringsdrivende'
            case 'ARBEIDSLEDIG':
                return 'Arbeidsledig'
            default:
                return type
        }
    }

    if (isLoading) return <SaksbildePanel value={value}>Laster...</SaksbildePanel>
    if (isError)
        return (
            <SaksbildePanel value={value}>
                <Alert variant="error">Kunne ikke laste inntektsforhold</Alert>
            </SaksbildePanel>
        )

    return (
        <SaksbildePanel value={value}>
            <VStack gap="6">
                <HStack justify="space-between" align="center">
                    <Heading size="medium">Inntektsforhold</Heading>
                    <Button
                        variant="secondary"
                        size="small"
                        icon={<PlusIcon />}
                        onClick={() => setVisOpprettForm(!visSopprettForm)}
                    >
                        Legg til inntektsforhold
                    </Button>
                </HStack>

                {visSopprettForm && (
                    <Alert variant="info">
                        <VStack gap="4">
                            <Heading size="small">Opprett nytt inntektsforhold</Heading>

                            <Select
                                label="Inntektsforholdtype"
                                value={nyInntektsforholdtype}
                                onChange={(e) => {
                                    setNyInntektsforholdtype(e.target.value as Inntektsforholdtype)
                                    // Tøm orgnummer hvis arbeidsledig velges
                                    if (e.target.value === 'ARBEIDSLEDIG') {
                                        setNyOrgnummer('')
                                    }
                                }}
                            >
                                <option value="ORDINÆRT_ARBEIDSFORHOLD">Ordinært arbeidsforhold</option>
                                <option value="FRILANSER">Frilanser</option>
                                <option value="SELVSTENDIG_NÆRINGSDRIVENDE">Selvstendig næringsdrivende</option>
                                <option value="ARBEIDSLEDIG">Arbeidsledig</option>
                            </Select>

                            {nyInntektsforholdtype !== 'ARBEIDSLEDIG' && (
                                <TextField
                                    label="Organisasjonsnummer"
                                    value={nyOrgnummer}
                                    onChange={(e) => setNyOrgnummer(e.target.value)}
                                    placeholder="123456789"
                                    description="9-sifret organisasjonsnummer"
                                />
                            )}

                            <Switch
                                checked={nySykmeldtFraForholdet}
                                onChange={() => setNySykmeldtFraForholdet(!nySykmeldtFraForholdet)}
                            >
                                Sykmeldt fra forholdet
                            </Switch>

                            <HStack gap="2">
                                <Button
                                    variant="primary"
                                    size="small"
                                    onClick={handleOpprett}
                                    loading={opprettInntektsforhold.isPending}
                                >
                                    Opprett
                                </Button>
                                <Button variant="secondary" size="small" onClick={() => setVisOpprettForm(false)}>
                                    Avbryt
                                </Button>
                            </HStack>
                        </VStack>
                    </Alert>
                )}

                {inntektsforhold && inntektsforhold.length > 0 ? (
                    <Table size="medium">
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell>ID</TableHeaderCell>
                                <TableHeaderCell>Type</TableHeaderCell>
                                <TableHeaderCell>Organisasjon</TableHeaderCell>
                                <TableHeaderCell>Sykmeldt fra forholdet</TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inntektsforhold.map((forhold) => (
                                <TableRow key={forhold.id}>
                                    <TableDataCell>
                                        <BodyShort className="font-mono text-sm">
                                            {forhold.id.substring(0, 8)}...
                                        </BodyShort>
                                    </TableDataCell>
                                    <TableDataCell>
                                        <BodyShort>{getInntektsforholdtypeText(forhold.inntektsforholdtype)}</BodyShort>
                                    </TableDataCell>
                                    <TableDataCell>
                                        <VStack gap="1">
                                            {forhold.orgnavn && (
                                                <BodyShort weight="semibold">{forhold.orgnavn}</BodyShort>
                                            )}
                                            {forhold.orgnummer && (
                                                <BodyShort className="font-mono text-sm text-gray-600">
                                                    {forhold.orgnummer}
                                                </BodyShort>
                                            )}
                                            {!forhold.orgnummer && !forhold.orgnavn && (
                                                <BodyShort className="text-gray-500">-</BodyShort>
                                            )}
                                        </VStack>
                                    </TableDataCell>
                                    <TableDataCell>
                                        <BodyShort>{forhold.sykmeldtFraForholdet ? 'Ja' : 'Nei'}</BodyShort>
                                    </TableDataCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Alert variant="info">
                        <BodyShort>Ingen inntektsforhold registrert for denne saksbehandlingsperioden.</BodyShort>
                    </Alert>
                )}
            </VStack>
        </SaksbildePanel>
    )
}
