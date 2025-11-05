import { BodyShort, Button, Detail, HStack, Switch, Table, VStack } from '@navikt/ds-react'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Fragment, ReactElement, useState } from 'react'

import { Ainntekt } from '@schemas/ainntekt'
import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'

interface AinntektVisningProps {
    ainntekt: Ainntekt
}

interface GroupedByEmployer {
    [employer: string]: {
        navn: string
        orgnummer: string
        data: Ainntekt['data']
    }
}

export function AinntektVisning({ ainntekt }: AinntektVisningProps): ReactElement {
    const [groupByEmployer, setGroupByEmployer] = useState<boolean>(false)
    const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set())
    const [expandedEmployers, setExpandedEmployers] = useState<Set<string>>(new Set())

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

    const toggleEmployer = (employer: string) => {
        setExpandedEmployers((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(employer)) {
                newSet.delete(employer)
            } else {
                newSet.add(employer)
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

    const formatMonth = (maaned: string) => {
        const [year, month] = maaned.split('-')
        const date = new Date(parseInt(year), parseInt(month) - 1)
        return date.toLocaleDateString('nb-NO', { year: 'numeric', month: 'short' })
    }

    const getUniqueInntekterCount = (
        inntektListe: {
            type: string
        }[],
        underenhet: string,
    ) => {
        const uniqueKeys = new Set(inntektListe.map((inntekt) => `${underenhet}_${inntekt.type}`))
        return uniqueKeys.size
    }

    // Sortere måneder synkende (nyest først)
    const sortedMonths = [...ainntekt.data].sort((a, b) => b.maaned.localeCompare(a.maaned))

    // Gruppere data per arbeidsgiver (underenhet)
    const groupedByEmployer: GroupedByEmployer = {}

    ainntekt.data.forEach((maaned) => {
        const orgnummer = maaned.underenhet
        if (!groupedByEmployer[orgnummer]) {
            groupedByEmployer[orgnummer] = {
                navn: '', // Navn hentes fra Organisasjonsnavn-komponenten
                orgnummer: orgnummer,
                data: [],
            }
        }
        groupedByEmployer[orgnummer].data.push(maaned)
    })

    // Sortere arbeidsgivere alfabetisk
    const sortedEmployers = Object.keys(groupedByEmployer).sort()

    // Sortere måneder innenfor hver arbeidsgiver
    sortedEmployers.forEach((employer) => {
        groupedByEmployer[employer].data.sort((a, b) => b.maaned.localeCompare(a.maaned))
    })

    const renderByYear = () => (
        <Table size="small" className="w-full">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col" className="text-xs">
                        Måned
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
                {sortedMonths.map((maaned) => {
                    const totalBeloep = maaned.inntektListe.reduce((sum, inntekt) => sum + inntekt.beloep, 0)
                    const uniqueCount = getUniqueInntekterCount(maaned.inntektListe, maaned.underenhet)
                    const isMonthExpanded = expandedMonths.has(maaned.maaned)

                    return (
                        <Fragment key={maaned.maaned}>
                            <Table.Row className="bg-gray-25">
                                <Table.DataCell>
                                    <BodyShort size="small">{formatMonth(maaned.maaned)}</BodyShort>
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
                                        onClick={() => toggleMonth(maaned.maaned)}
                                        icon={isMonthExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                        iconPosition="right"
                                    ></Button>
                                </Table.DataCell>
                            </Table.Row>
                            {isMonthExpanded && (
                                <Table.Row className="bg-gray-50">
                                    <Table.DataCell colSpan={4}>
                                        <VStack gap="2" className="p-2">
                                            {maaned.inntektListe.map((inntekt, index) => (
                                                <div key={index} className="border-l-4 border-ax-border-info pl-3">
                                                    <HStack gap="4" className="mb-2">
                                                        <VStack gap="1">
                                                            <Detail className="text-gray-600 text-xs">Beløp</Detail>
                                                            <BodyShort size="small" className="font-medium">
                                                                {formatCurrency(inntekt.beloep)}
                                                            </BodyShort>
                                                        </VStack>
                                                        <VStack gap="1">
                                                            <Detail className="text-gray-600 text-xs">Type</Detail>
                                                            <BodyShort size="small">{inntekt.type}</BodyShort>
                                                        </VStack>
                                                        <VStack gap="1">
                                                            <Detail className="text-gray-600 text-xs">
                                                                Beskrivelse
                                                            </Detail>
                                                            <BodyShort size="small">{inntekt.beskrivelse}</BodyShort>
                                                        </VStack>
                                                    </HStack>
                                                    <HStack gap="4">
                                                        <VStack gap="1">
                                                            <Detail className="text-gray-600 text-xs">
                                                                Virksomhet
                                                            </Detail>
                                                            <BodyShort size="small">
                                                                <Organisasjonsnavn orgnummer={maaned.underenhet} />
                                                            </BodyShort>
                                                            <BodyShort size="small" className="text-gray-800">
                                                                {maaned.underenhet}
                                                            </BodyShort>
                                                        </VStack>
                                                        <VStack gap="1">
                                                            <Detail className="text-gray-600 text-xs">Fordel</Detail>
                                                            <BodyShort size="small">{inntekt.fordel}</BodyShort>
                                                        </VStack>
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
    )

    const renderByEmployer = () => (
        <Table size="small" className="w-full">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col" className="text-xs">
                        Arbeidsgiver/Måned
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col" className="text-xs">
                        Total
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {sortedEmployers.map((employer) => {
                    const employerData = groupedByEmployer[employer]
                    const isEmployerExpanded = expandedEmployers.has(employer)

                    return (
                        <Fragment key={employer}>
                            <Table.Row className="bg-green-50">
                                <Table.DataCell colSpan={2}>
                                    <VStack gap="0">
                                        <BodyShort size="small" className="font-semibold">
                                            <Organisasjonsnavn orgnummer={employer} />
                                        </BodyShort>
                                        <BodyShort size="small" className="text-gray-600">
                                            {employer}
                                        </BodyShort>
                                    </VStack>
                                </Table.DataCell>
                                <Table.DataCell>
                                    <Button
                                        variant="tertiary"
                                        size="xsmall"
                                        onClick={() => toggleEmployer(employer)}
                                        icon={isEmployerExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                        iconPosition="right"
                                    ></Button>
                                </Table.DataCell>
                            </Table.Row>
                            {isEmployerExpanded &&
                                employerData.data.map((maaned) => {
                                    const totalBeloep = maaned.inntektListe.reduce(
                                        (sum, inntekt) => sum + inntekt.beloep,
                                        0,
                                    )
                                    const monthKey = `${employer}-${maaned.maaned}`
                                    const isMonthExpanded = expandedMonths.has(monthKey)

                                    return (
                                        <Fragment key={monthKey}>
                                            <Table.Row className="bg-gray-25">
                                                <Table.DataCell className="pl-8">
                                                    <BodyShort size="small">{formatMonth(maaned.maaned)}</BodyShort>
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
                                                        onClick={() => toggleMonth(monthKey)}
                                                        icon={isMonthExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                                        iconPosition="right"
                                                    ></Button>
                                                </Table.DataCell>
                                            </Table.Row>
                                            {isMonthExpanded && (
                                                <Table.Row className="bg-gray-50">
                                                    <Table.DataCell colSpan={3}>
                                                        <VStack gap="2" className="p-2">
                                                            {maaned.inntektListe.map((inntekt, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="border-l-4 border-ax-border-info pl-3"
                                                                >
                                                                    <HStack gap="4" className="mb-2">
                                                                        <VStack gap="1">
                                                                            <Detail className="text-gray-600 text-xs">
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
                                                                            <Detail className="text-gray-600 text-xs">
                                                                                Type
                                                                            </Detail>
                                                                            <BodyShort size="small">
                                                                                {inntekt.type}
                                                                            </BodyShort>
                                                                        </VStack>
                                                                        <VStack gap="1">
                                                                            <Detail className="text-gray-600 text-xs">
                                                                                Beskrivelse
                                                                            </Detail>
                                                                            <BodyShort size="small">
                                                                                {inntekt.beskrivelse}
                                                                            </BodyShort>
                                                                        </VStack>
                                                                    </HStack>
                                                                    <HStack gap="4">
                                                                        <VStack gap="1">
                                                                            <Detail className="text-gray-600 text-xs">
                                                                                Fordel
                                                                            </Detail>
                                                                            <BodyShort size="small">
                                                                                {inntekt.fordel}
                                                                            </BodyShort>
                                                                        </VStack>
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
                        </Fragment>
                    )
                })}
            </Table.Body>
        </Table>
    )

    return (
        <VStack gap="4" className="mt-2">
            <Switch checked={groupByEmployer} onChange={(event) => setGroupByEmployer(event.target.checked)}>
                Gruppering per arbeidsgiver
            </Switch>

            {groupByEmployer ? renderByEmployer() : renderByYear()}
        </VStack>
    )
}
