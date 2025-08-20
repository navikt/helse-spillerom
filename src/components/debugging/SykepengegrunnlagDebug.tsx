'use client'

import React, { ReactElement, useState, useEffect } from 'react'
import { Button, Table, TextField, Select, VStack, HStack, Heading, BodyShort, Tag, Alert } from '@navikt/ds-react'
import { CalculatorIcon } from '@navikt/aksel-icons'

import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'
import { useSykepengegrunnlag } from '@hooks/queries/useSykepengegrunnlag'
import { useSettSykepengegrunnlag } from '@hooks/mutations/useSettSykepengegrunnlag'
import { kronerTilØrer, ørerTilKroner, formaterBeløpØre } from '@/schemas/sykepengegrunnlag'

interface InntektInput {
    inntektsforholdId: string
    beløpPerMånedKroner: string
    kilde: 'AINNTEKT' | 'SAKSBEHANDLER' | 'SKJONNSFASTSETTELSE'
}

export function SykepengegrunnlagDebug(): ReactElement {
    const { data: inntektsforhold = [] } = useInntektsforhold()
    const { data: eksisterendeGrunnlag } = useSykepengegrunnlag()
    const {
        mutate: settSykepengegrunnlag,
        isPending,
        isSuccess,
        isError,
        data: lagretGrunnlag,
    } = useSettSykepengegrunnlag()

    const [inntekter, setInntekter] = useState<InntektInput[]>(() => {
        // Initialiser med eksisterende data eller tomme verdier
        if (eksisterendeGrunnlag) {
            return eksisterendeGrunnlag.inntekter.map((inntekt) => ({
                inntektsforholdId: inntekt.inntektsforholdId,
                beløpPerMånedKroner: ørerTilKroner(inntekt.beløpPerMånedØre).toString(),
                kilde: inntekt.kilde as 'AINNTEKT' | 'SAKSBEHANDLER' | 'SKJONNSFASTSETTELSE',
            }))
        }
        return inntektsforhold.map((forhold) => ({
            inntektsforholdId: forhold.id,
            beløpPerMånedKroner: '',
            kilde: 'AINNTEKT' as const,
        }))
    })

    const [begrunnelse, setBegrunnelse] = useState(eksisterendeGrunnlag?.begrunnelse || '')

    // Oppdater state når eksisterende data endres
    useEffect(() => {
        if (eksisterendeGrunnlag) {
            const nyeInntekter = eksisterendeGrunnlag.inntekter.map((inntekt) => ({
                inntektsforholdId: inntekt.inntektsforholdId,
                beløpPerMånedKroner: ørerTilKroner(inntekt.beløpPerMånedØre).toString(),
                kilde: inntekt.kilde as 'AINNTEKT' | 'SAKSBEHANDLER' | 'SKJONNSFASTSETTELSE',
            }))
            setInntekter(nyeInntekter)
            setBegrunnelse(eksisterendeGrunnlag.begrunnelse || '')
        } else if (inntektsforhold.length > 0) {
            // Hvis ingen eksisterende data, initialiser med tomme verdier
            const tommeInntekter = inntektsforhold.map((forhold) => ({
                inntektsforholdId: forhold.id,
                beløpPerMånedKroner: '',
                kilde: 'AINNTEKT' as const,
            }))
            setInntekter(tommeInntekter)
            setBegrunnelse('')
        }
    }, [eksisterendeGrunnlag, inntektsforhold])

    const handleInntektChange = (index: number, field: keyof InntektInput, value: string) => {
        const nyeInntekter = [...inntekter]
        nyeInntekter[index] = { ...nyeInntekter[index], [field]: value }
        setInntekter(nyeInntekter)
    }

    const handleLagre = () => {
        const inntekterForAPI = inntekter
            .filter((inntekt) => inntekt.beløpPerMånedKroner && parseFloat(inntekt.beløpPerMånedKroner) > 0)
            .map((inntekt) => ({
                inntektsforholdId: inntekt.inntektsforholdId,
                beløpPerMånedØre: kronerTilØrer(parseFloat(inntekt.beløpPerMånedKroner)),
                kilde: inntekt.kilde,
                refusjon: [],
            }))

        settSykepengegrunnlag({
            inntekter: inntekterForAPI,
            begrunnelse: begrunnelse || undefined,
        })
    }

    const getInntektsforholdInfo = (inntektsforholdId: string) => {
        const forhold = inntektsforhold.find((f) => f.id === inntektsforholdId)
        if (!forhold) return { navn: 'Ukjent', orgnummer: 'Ukjent' }

        const orgnummer = forhold.kategorisering['ORGNUMMER'] as string
        const kategori = forhold.kategorisering['INNTEKTSKATEGORI'] as string

        return {
            navn: orgnummer || 'Ukjent organisasjon',
            orgnummer: orgnummer || 'Ukjent',
            kategori: kategori || 'Ukjent kategori',
        }
    }

    // Vis beregning hvis vi har eksisterende data eller nylig lagret data
    const grunnlagTilVising = lagretGrunnlag || eksisterendeGrunnlag
    const visBeregning = grunnlagTilVising !== null && grunnlagTilVising !== undefined

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <CalculatorIcon className="h-5 w-5" />
                <Heading size="medium">Sykepengegrunnlag Debug</Heading>
            </div>

            {isSuccess && <Alert variant="success">Sykepengegrunnlag ble lagret successfully!</Alert>}

            {isError && <Alert variant="error">Feil ved lagring av sykepengegrunnlag. Prøv igjen.</Alert>}

            <div className="space-y-4">
                <TextField
                    label="Begrunnelse (valgfritt)"
                    value={begrunnelse}
                    onChange={(e) => setBegrunnelse(e.target.value)}
                    placeholder="Skriv begrunnelse for sykepengegrunnlaget..."
                />

                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Inntektsforhold</Table.HeaderCell>
                            <Table.HeaderCell>Månedsinntekt (kr)</Table.HeaderCell>
                            <Table.HeaderCell>Kilde</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {inntekter.map((inntekt, index) => {
                            const forholdInfo = getInntektsforholdInfo(inntekt.inntektsforholdId)
                            return (
                                <Table.Row key={inntekt.inntektsforholdId}>
                                    <Table.DataCell>
                                        <div>
                                            <div className="font-medium">{forholdInfo.navn}</div>
                                            <div className="text-gray-600 text-sm">{forholdInfo.kategori}</div>
                                            <div className="text-gray-500 text-xs">{forholdInfo.orgnummer}</div>
                                        </div>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <TextField
                                            label=""
                                            value={inntekt.beløpPerMånedKroner}
                                            onChange={(e) =>
                                                handleInntektChange(index, 'beløpPerMånedKroner', e.target.value)
                                            }
                                            placeholder="0"
                                            type="number"
                                            min="0"
                                            step="100"
                                            size="small"
                                        />
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <Select
                                            label=""
                                            value={inntekt.kilde}
                                            onChange={(e) =>
                                                handleInntektChange(
                                                    index,
                                                    'kilde',
                                                    e.target.value as
                                                        | 'AINNTEKT'
                                                        | 'SAKSBEHANDLER'
                                                        | 'SKJONNSFASTSETTELSE',
                                                )
                                            }
                                            size="small"
                                        >
                                            <option value="AINNTEKT">A-Inntekt</option>
                                            <option value="SAKSBEHANDLER">Saksbehandler</option>
                                            <option value="SKJONNSFASTSETTELSE">Skjønnsfastsettelse</option>
                                        </Select>
                                    </Table.DataCell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>

                {visBeregning && grunnlagTilVising && (
                    <div className="border-t pt-4">
                        <div className="mb-2 flex items-center gap-2">
                            <Heading size="small" level="2">
                                Beregning
                            </Heading>
                            {lagretGrunnlag && (
                                <Tag variant="success" size="small">
                                    Nylig lagret
                                </Tag>
                            )}
                        </div>
                        <VStack gap="2" className="mt-2">
                            <HStack justify="space-between">
                                <BodyShort>Total månedsinntekt:</BodyShort>
                                <BodyShort className="font-medium">
                                    {formaterBeløpØre(grunnlagTilVising.totalInntektØre / 12)}
                                </BodyShort>
                            </HStack>
                            <HStack justify="space-between">
                                <BodyShort>Årsinntekt:</BodyShort>
                                <BodyShort className="font-medium">
                                    {formaterBeløpØre(grunnlagTilVising.totalInntektØre)}
                                </BodyShort>
                            </HStack>
                            <HStack justify="space-between">
                                <BodyShort>6G (2024):</BodyShort>
                                <BodyShort className="font-medium">
                                    {formaterBeløpØre(grunnlagTilVising.grunnbeløp6GØre)}
                                </BodyShort>
                            </HStack>
                            <HStack justify="space-between">
                                <BodyShort>Sykepengegrunnlag:</BodyShort>
                                <div className="flex items-center gap-2">
                                    <BodyShort className="font-medium">
                                        {formaterBeløpØre(grunnlagTilVising.sykepengegrunnlagØre)}
                                    </BodyShort>
                                    {grunnlagTilVising.begrensetTil6G && (
                                        <Tag variant="warning" size="small">
                                            Begrenset til 6G
                                        </Tag>
                                    )}
                                </div>
                            </HStack>
                        </VStack>
                    </div>
                )}

                <div className="flex justify-end">
                    <Button
                        onClick={handleLagre}
                        loading={isPending}
                        disabled={
                            isPending ||
                            inntekter.every(
                                (inntekt) =>
                                    !inntekt.beløpPerMånedKroner || parseFloat(inntekt.beløpPerMånedKroner) === 0,
                            )
                        }
                        icon={<CalculatorIcon />}
                    >
                        Lagre sykepengegrunnlag
                    </Button>
                </div>
            </div>
        </div>
    )
}
