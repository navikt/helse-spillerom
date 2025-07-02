import { ReactElement, useState, Fragment } from 'react'
import { Table, BodyShort, Detail, VStack, HStack, Button } from '@navikt/ds-react'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'

import { Ainntekt } from '@schemas/ainntekt'
import { Organisasjonsnavn } from '@/components/organisasjon/Organisasjonsnavn'

interface AinntektVisningProps {
    ainntekt: Ainntekt
}

interface GroupedByYear {
    [year: string]: Ainntekt['arbeidsInntektMaaned']
}

export function AinntektVisning({ ainntekt }: AinntektVisningProps): ReactElement {
    const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set())
    const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set())

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
        return date.toLocaleDateString('nb-NO', { month: 'short' })
    }

    const getUniqueInntekterCount = (
        inntektListe: {
            virksomhet: { identifikator: string }
            inntektType: string
        }[],
    ) => {
        const uniqueKeys = new Set(
            inntektListe.map((inntekt) => `${inntekt.virksomhet.identifikator}_${inntekt.inntektType}`),
        )
        return uniqueKeys.size
    }

    // Gruppere data per år
    const groupedByYear: GroupedByYear = ainntekt.arbeidsInntektMaaned.reduce((acc, maaned) => {
        const year = maaned.aarMaaned.split('-')[0]
        if (!acc[year]) {
            acc[year] = []
        }
        acc[year].push(maaned)
        return acc
    }, {} as GroupedByYear)

    // Sortere år synkende (nyest først)
    const sortedYears = Object.keys(groupedByYear).sort((a: string, b: string) => parseInt(b) - parseInt(a))

    // Sortere måneder innenfor hvert år synkende (nyest måned først)
    sortedYears.forEach((year: string) => {
        groupedByYear[year].sort((a, b) => b.aarMaaned.localeCompare(a.aarMaaned))
    })

    return (
        <VStack gap="2" className="mt-2">
            <Detail className="text-gray-600">
                Viser {ainntekt.arbeidsInntektMaaned.length} måned(er) med inntektsdata fordelt på {sortedYears.length}{' '}
                år
            </Detail>

            <Table size="small" className="w-full">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col" className="text-xs">
                            År/Måned
                        </Table.HeaderCell>
                        <Table.HeaderCell scope="col" className="text-xs">
                            Unike
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
                        const yearTotal = yearData.reduce(
                            (sum: number, maaned) =>
                                sum +
                                maaned.arbeidsInntektInformasjon.inntektListe.reduce(
                                    (monthSum: number, inntekt) => monthSum + inntekt.beloep,
                                    0,
                                ),
                            0,
                        )

                        // Samle alle inntekter for året og tell unike kombinasjoner
                        const allYearInntekter = yearData.flatMap(
                            (maaned) => maaned.arbeidsInntektInformasjon.inntektListe,
                        )
                        const yearUniqueCount = getUniqueInntekterCount(allYearInntekter)

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
                                            {yearUniqueCount}
                                        </BodyShort>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <BodyShort size="small" className="font-semibold">
                                            {formatCurrency(yearTotal)}
                                        </BodyShort>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <Button
                                            variant="tertiary"
                                            size="xsmall"
                                            onClick={() => toggleYear(year)}
                                            icon={isYearExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                            iconPosition="right"
                                        >
                                            {isYearExpanded ? 'Skjul' : 'Vis'}
                                        </Button>
                                    </Table.DataCell>
                                </Table.Row>
                                {isYearExpanded &&
                                    yearData.map((maaned) => {
                                        const totalBeloep = maaned.arbeidsInntektInformasjon.inntektListe.reduce(
                                            (sum, inntekt) => sum + inntekt.beloep,
                                            0,
                                        )
                                        const uniqueCount = getUniqueInntekterCount(
                                            maaned.arbeidsInntektInformasjon.inntektListe,
                                        )
                                        const isMonthExpanded = expandedMonths.has(maaned.aarMaaned)

                                        return (
                                            <Fragment key={maaned.aarMaaned}>
                                                <Table.Row className="bg-gray-25">
                                                    <Table.DataCell className="pl-8">
                                                        <BodyShort size="small">
                                                            {formatMonth(maaned.aarMaaned)}
                                                        </BodyShort>
                                                    </Table.DataCell>
                                                    <Table.DataCell>
                                                        <BodyShort size="small">{uniqueCount}</BodyShort>
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
                                                            icon={
                                                                isMonthExpanded ? (
                                                                    <ChevronUpIcon />
                                                                ) : (
                                                                    <ChevronDownIcon />
                                                                )
                                                            }
                                                            iconPosition="right"
                                                        >
                                                            {isMonthExpanded ? 'Skjul' : 'Vis'}
                                                        </Button>
                                                    </Table.DataCell>
                                                </Table.Row>
                                                {isMonthExpanded && (
                                                    <Table.Row className="bg-gray-50">
                                                        <Table.DataCell colSpan={4}>
                                                            <VStack gap="2" className="p-2">
                                                                {maaned.arbeidsInntektInformasjon.inntektListe.map(
                                                                    (inntekt, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className="border-l-4 border-blue-300 pl-3"
                                                                        >
                                                                            <HStack gap="4" className="mb-2">
                                                                                <VStack gap="1">
                                                                                    <Detail className="text-xs text-gray-600">
                                                                                        Beløp
                                                                                    </Detail>
                                                                                    <BodyShort
                                                                                        size="small"
                                                                                        className="font-medium"
                                                                                    >
                                                                                        {formatCurrency(inntekt.beloep)}
                                                                                    </BodyShort>
                                                                                </VStack>
                                                                                <VStack gap="1">
                                                                                    <Detail className="text-xs text-gray-600">
                                                                                        Type
                                                                                    </Detail>
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
                                                                                        <Organisasjonsnavn
                                                                                            orgnummer={
                                                                                                inntekt.virksomhet
                                                                                                    .identifikator
                                                                                            }
                                                                                        />
                                                                                    </BodyShort>
                                                                                    <BodyShort
                                                                                        size="small"
                                                                                        className="text-gray-800"
                                                                                    >
                                                                                        {
                                                                                            inntekt.virksomhet
                                                                                                .identifikator
                                                                                        }
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
                                                                                        <BodyShort size="small">
                                                                                            {inntekt.antall}
                                                                                        </BodyShort>
                                                                                    </VStack>
                                                                                )}
                                                                            </HStack>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </VStack>
                                                        </Table.DataCell>
                                                    </Table.Row>
                                                )}
                                            </Fragment>
                                        )
                                    })}
                            </Fragment>
                        )
                    })}
                </Table.Body>
            </Table>
        </VStack>
    )
}
