import { ReactElement, useState, Fragment } from 'react'
import { Table, BodyShort, Detail, VStack, Button } from '@navikt/ds-react'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'

import { PensjonsgivendeInntekt } from '@schemas/pensjonsgivende'

interface PensjonsgivendeInntektVisningProps {
    pensjonsgivendeInntekt: PensjonsgivendeInntekt
}

interface InntektRad {
    år: number
    type: string
    beløp: number | null
    skatteordning: string
}

interface GroupedByYear {
    [year: string]: InntektRad[]
}

export function PensjonsgivendeInntektVisning({
    pensjonsgivendeInntekt,
}: PensjonsgivendeInntektVisningProps): ReactElement {
    const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set())

    const toggleYear = (year: string) => {
        setExpandedYears((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(year)) {
                newSet.delete(year)
            } else {
                newSet.add(year)
            }
            return newSet
        })
    }

    const formatAmount = (amount: number | null) => {
        if (amount === null || amount === 0) return '-'
        return amount.toLocaleString('nb-NO')
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('nb-NO', {
            style: 'currency',
            currency: 'NOK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    // Konverter data til rader for tabellen
    const tableRader: InntektRad[] = []

    // Sorter etter år, nyeste først
    const sortedData = [...pensjonsgivendeInntekt].sort((a, b) => b.inntektsaar - a.inntektsaar)

    sortedData.forEach((årData) => {
        if (årData.pensjonsgivendeInntekt === null) {
            // År uten data - legg til en rad som viser dette
            tableRader.push({
                år: årData.inntektsaar,
                type: 'Ingen data',
                beløp: null,
                skatteordning: '-',
            })
        } else {
            // År med data - lag rader for hver inntektstype som har verdi
            årData.pensjonsgivendeInntekt.forEach((inntektItem) => {
                const skatteordning = inntektItem.skatteordning === 'FASTLAND' ? 'NORSK' : inntektItem.skatteordning

                // Lønnsinntekt
                if (
                    inntektItem.pensjonsgivendeInntektAvLoennsinntekt !== null &&
                    inntektItem.pensjonsgivendeInntektAvLoennsinntekt !== 0
                ) {
                    tableRader.push({
                        år: årData.inntektsaar,
                        type: 'Lønnsinntekt',
                        beløp: inntektItem.pensjonsgivendeInntektAvLoennsinntekt,
                        skatteordning,
                    })
                }

                // Lønnsinntekt bare pensjonsdel
                if (
                    inntektItem.pensjonsgivendeInntektAvLoennsinntektBarePensjonsdel !== null &&
                    inntektItem.pensjonsgivendeInntektAvLoennsinntektBarePensjonsdel !== 0
                ) {
                    tableRader.push({
                        år: årData.inntektsaar,
                        type: 'Lønn (pensjonsdel)',
                        beløp: inntektItem.pensjonsgivendeInntektAvLoennsinntektBarePensjonsdel,
                        skatteordning,
                    })
                }

                // Næringsinntekt
                if (
                    inntektItem.pensjonsgivendeInntektAvNaeringsinntekt !== null &&
                    inntektItem.pensjonsgivendeInntektAvNaeringsinntekt !== 0
                ) {
                    tableRader.push({
                        år: årData.inntektsaar,
                        type: 'Næringsinntekt',
                        beløp: inntektItem.pensjonsgivendeInntektAvNaeringsinntekt,
                        skatteordning,
                    })
                }

                // Fiske/fangst/familiebarnehage
                if (
                    inntektItem.pensjonsgivendeInntektAvNaeringsinntektFraFiskeFangstEllerFamiliebarnehage !== null &&
                    inntektItem.pensjonsgivendeInntektAvNaeringsinntektFraFiskeFangstEllerFamiliebarnehage !== 0
                ) {
                    tableRader.push({
                        år: årData.inntektsaar,
                        type: 'Fiske/fangst/barnehage',
                        beløp: inntektItem.pensjonsgivendeInntektAvNaeringsinntektFraFiskeFangstEllerFamiliebarnehage,
                        skatteordning,
                    })
                }

                // Hvis ingen inntektstyper har verdi, vis en rad med total 0
                const harInntekt = [
                    inntektItem.pensjonsgivendeInntektAvLoennsinntekt,
                    inntektItem.pensjonsgivendeInntektAvLoennsinntektBarePensjonsdel,
                    inntektItem.pensjonsgivendeInntektAvNaeringsinntekt,
                    inntektItem.pensjonsgivendeInntektAvNaeringsinntektFraFiskeFangstEllerFamiliebarnehage,
                ].some((verdi) => verdi !== null && verdi !== 0)

                if (!harInntekt) {
                    tableRader.push({
                        år: årData.inntektsaar,
                        type: 'Ingen inntekt',
                        beløp: 0,
                        skatteordning,
                    })
                }
            })
        }
    })

    // Gruppere data per år
    const groupedByYear: GroupedByYear = tableRader.reduce((acc, rad) => {
        const year = rad.år.toString()
        if (!acc[year]) {
            acc[year] = []
        }
        acc[year].push(rad)
        return acc
    }, {} as GroupedByYear)

    // Sortere år synkende (nyest først)
    const sortedYears = Object.keys(groupedByYear).sort((a: string, b: string) => parseInt(b) - parseInt(a))

    if (tableRader.length === 0) {
        return (
            <VStack gap="2" className="mt-2">
                <Detail className="text-gray-600">Ingen pensjonsgivende inntekt funnet</Detail>
            </VStack>
        )
    }

    return (
        <VStack gap="2" className="mt-2">
            <Detail className="text-gray-600">Pensjonsgivende inntekt for {sortedYears.length} år</Detail>

            <Table size="small" className="w-full">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col" className="text-xs">
                            År
                        </Table.HeaderCell>
                        <Table.HeaderCell scope="col" className="text-xs">
                            Total
                        </Table.HeaderCell>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {sortedYears.map((year) => {
                        const yearData = groupedByYear[year]
                        const yearTotal = yearData.reduce((sum: number, rad) => {
                            const beløp = rad.beløp ?? 0
                            return sum + beløp
                        }, 0)

                        // Sjekk om året bare har "Ingen data" eller "Ingen inntekt"
                        const harBareIngenData = yearData.every(
                            (rad) =>
                                rad.type === 'Ingen data' ||
                                rad.type === 'Ingen inntekt' ||
                                rad.beløp === null ||
                                rad.beløp === 0,
                        )

                        const isYearExpanded = expandedYears.has(year)

                        return (
                            <Fragment key={year}>
                                <Table.Row className="bg-blue-50">
                                    <Table.DataCell>
                                        <BodyShort size="small" className="font-semibold">
                                            {year}
                                        </BodyShort>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <BodyShort size="small" className="font-semibold">
                                            {harBareIngenData
                                                ? 'Ingen data'
                                                : yearTotal > 0
                                                  ? formatCurrency(yearTotal)
                                                  : '-'}
                                        </BodyShort>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {!harBareIngenData && (
                                            <Button
                                                variant="tertiary"
                                                size="xsmall"
                                                onClick={() => toggleYear(year)}
                                                icon={isYearExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                                iconPosition="right"
                                            ></Button>
                                        )}
                                    </Table.DataCell>
                                </Table.Row>
                                {isYearExpanded &&
                                    !harBareIngenData &&
                                    yearData.map((rad, index) => (
                                        <Table.Row
                                            key={`${rad.år}-${rad.type}-${index}`}
                                            className={`${rad.beløp === null || rad.beløp === 0 ? 'opacity-60' : ''} bg-gray-25`}
                                        >
                                            <Table.DataCell className="pl-8">
                                                <BodyShort
                                                    size="small"
                                                    className={
                                                        rad.beløp === null || rad.beløp === 0
                                                            ? 'text-gray-500 italic'
                                                            : ''
                                                    }
                                                >
                                                    {rad.type}
                                                </BodyShort>
                                            </Table.DataCell>
                                            <Table.DataCell>
                                                <BodyShort
                                                    size="small"
                                                    className={`${rad.beløp && rad.beløp > 0 ? 'font-medium' : 'text-gray-500'}`}
                                                >
                                                    {formatAmount(rad.beløp)}
                                                </BodyShort>
                                            </Table.DataCell>
                                            <Table.DataCell></Table.DataCell>
                                        </Table.Row>
                                    ))}
                            </Fragment>
                        )
                    })}
                </Table.Body>
            </Table>
        </VStack>
    )
}
