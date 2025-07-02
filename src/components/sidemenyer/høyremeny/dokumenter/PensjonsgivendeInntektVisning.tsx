import { ReactElement } from 'react'
import { Table, BodyShort, Detail, VStack } from '@navikt/ds-react'

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

export function PensjonsgivendeInntektVisning({
    pensjonsgivendeInntekt,
}: PensjonsgivendeInntektVisningProps): ReactElement {
    const formatAmount = (amount: number | null) => {
        if (amount === null || amount === 0) return '-'
        return amount.toLocaleString('nb-NO')
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

    if (tableRader.length === 0) {
        return (
            <VStack gap="2" className="mt-2">
                <Detail className="text-gray-600">Ingen pensjonsgivende inntekt funnet</Detail>
            </VStack>
        )
    }

    return (
        <VStack gap="2" className="mt-2">
            <Detail className="text-gray-600">Pensjonsgivende inntekt for {pensjonsgivendeInntekt.length} år</Detail>

            <Table size="small" className="w-full text-xs">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col" className="w-8 text-xs">
                            År
                        </Table.HeaderCell>
                        <Table.HeaderCell scope="col" className="text-right text-xs">
                            Beløp
                        </Table.HeaderCell>
                        <Table.HeaderCell scope="col" className="text-xs">
                            Inntektstype
                        </Table.HeaderCell>
                        <Table.HeaderCell scope="col" className="text-xs">
                            Ordning
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {tableRader.map((rad, index) => (
                        <Table.Row
                            key={`${rad.år}-${rad.type}-${index}`}
                            className={rad.beløp === null || rad.beløp === 0 ? 'opacity-60' : ''}
                        >
                            <Table.DataCell>
                                <BodyShort size="small">{String(rad.år).slice(-2)}</BodyShort>
                            </Table.DataCell>
                            <Table.DataCell className="text-right">
                                <BodyShort
                                    size="small"
                                    className={`${rad.beløp && rad.beløp > 0 ? 'font-medium' : 'text-gray-500'}`}
                                >
                                    {formatAmount(rad.beløp)}
                                </BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                                <BodyShort
                                    size="small"
                                    className={rad.beløp === null || rad.beløp === 0 ? 'text-gray-500 italic' : ''}
                                >
                                    {rad.type}
                                </BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                                <BodyShort size="small" className="text-gray-600">
                                    {rad.skatteordning}
                                </BodyShort>
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </VStack>
    )
}
