import { ReactElement, useState, Fragment } from 'react'
import { Table, BodyShort, Detail, VStack, HStack, Button } from '@navikt/ds-react'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'

import { Ainntekt } from '@schemas/ainntekt'

interface AinntektVisningProps {
    ainntekt: Ainntekt
}

export function AinntektVisning({ ainntekt }: AinntektVisningProps): ReactElement {
    const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set())

    const toggleMonth = (month: string) => {
        setExpandedMonths((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(month)) {
                newSet.delete(month)
            } else {
                newSet.add(month)
            }
            return newSet
        })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('nb-NO', {
            style: 'currency',
            currency: 'NOK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const formatMonth = (aarMaaned: string) => {
        const [year, month] = aarMaaned.split('-')
        const date = new Date(parseInt(year), parseInt(month) - 1)
        return date.toLocaleDateString('nb-NO', { year: 'numeric', month: 'long' })
    }

    return (
        <VStack gap="2" className="mt-2">
            <Detail className="text-gray-600">
                Viser {ainntekt.arbeidsInntektMaaned.length} måned(er) med inntektsdata
            </Detail>

            <Table size="small" className="w-full">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Måned</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Antall inntekter</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Total</Table.HeaderCell>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {ainntekt.arbeidsInntektMaaned.map((maaned) => {
                        const totalBeloep = maaned.arbeidsInntektInformasjon.inntektListe.reduce(
                            (sum, inntekt) => sum + inntekt.beloep,
                            0,
                        )
                        const isExpanded = expandedMonths.has(maaned.aarMaaned)

                        return (
                            <Fragment key={maaned.aarMaaned}>
                                <Table.Row>
                                    <Table.DataCell>
                                        <BodyShort size="small">{formatMonth(maaned.aarMaaned)}</BodyShort>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <BodyShort size="small">
                                            {maaned.arbeidsInntektInformasjon.inntektListe.length}
                                        </BodyShort>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <BodyShort size="small" className="font-medium">
                                            {formatCurrency(totalBeloep)}
                                        </BodyShort>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <Button
                                            variant="tertiary"
                                            size="xsmall"
                                            onClick={() => toggleMonth(maaned.aarMaaned)}
                                            icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                            iconPosition="right"
                                        >
                                            {isExpanded ? 'Skjul' : 'Vis'}
                                        </Button>
                                    </Table.DataCell>
                                </Table.Row>
                                {isExpanded && (
                                    <Table.Row className="bg-gray-50">
                                        <Table.DataCell colSpan={4}>
                                            <VStack gap="2" className="p-2">
                                                {maaned.arbeidsInntektInformasjon.inntektListe.map((inntekt, index) => (
                                                    <div key={index} className="border-l-4 border-blue-300 pl-3">
                                                        <HStack gap="4" className="mb-2">
                                                            <VStack gap="1">
                                                                <Detail className="text-xs text-gray-600">Beløp</Detail>
                                                                <BodyShort size="small" className="font-medium">
                                                                    {formatCurrency(inntekt.beloep)}
                                                                </BodyShort>
                                                            </VStack>
                                                            <VStack gap="1">
                                                                <Detail className="text-xs text-gray-600">Type</Detail>
                                                                <BodyShort size="small">
                                                                    {inntekt.inntektType}
                                                                </BodyShort>
                                                            </VStack>
                                                            <VStack gap="1">
                                                                <Detail className="text-xs text-gray-600">
                                                                    Beskrivelse
                                                                </Detail>
                                                                <BodyShort size="small">
                                                                    {inntekt.beskrivelse}
                                                                </BodyShort>
                                                            </VStack>
                                                        </HStack>
                                                        <HStack gap="4">
                                                            <VStack gap="1">
                                                                <Detail className="text-xs text-gray-600">
                                                                    Virksomhet
                                                                </Detail>
                                                                <BodyShort size="small">
                                                                    {inntekt.virksomhet.identifikator}
                                                                </BodyShort>
                                                            </VStack>
                                                            <VStack gap="1">
                                                                <Detail className="text-xs text-gray-600">
                                                                    Status
                                                                </Detail>
                                                                <BodyShort size="small">
                                                                    {inntekt.inntektsstatus}
                                                                </BodyShort>
                                                            </VStack>
                                                            {inntekt.antall && (
                                                                <VStack gap="1">
                                                                    <Detail className="text-xs text-gray-600">
                                                                        Antall
                                                                    </Detail>
                                                                    <BodyShort size="small">{inntekt.antall}</BodyShort>
                                                                </VStack>
                                                            )}
                                                        </HStack>
                                                    </div>
                                                ))}
                                            </VStack>
                                        </Table.DataCell>
                                    </Table.Row>
                                )}
                            </Fragment>
                        )
                    })}
                </Table.Body>
            </Table>
        </VStack>
    )
}
