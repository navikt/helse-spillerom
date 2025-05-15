'use client'

import { ReactElement } from 'react'
import { Table, Heading } from '@navikt/ds-react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useAareg } from '@hooks/queries/useAareg'

interface AaregProps {
    value: string
}

export function Aareg({ value }: AaregProps): ReactElement {
    const { data: arbeidsforhold, isLoading } = useAareg()

    if (isLoading) {
        return <SaksbildePanel value={value}>Laster arbeidsforhold...</SaksbildePanel>
    }

    if (!arbeidsforhold || arbeidsforhold.length === 0) {
        return <SaksbildePanel value={value}>Ingen arbeidsforhold funnet</SaksbildePanel>
    }

    return (
        <SaksbildePanel value={value}>
            <Heading level="2" size="medium" className="mb-8">
                Arbeidsforhold
            </Heading>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Arbeidssted</Table.HeaderCell>
                        <Table.HeaderCell>Startdato</Table.HeaderCell>
                        <Table.HeaderCell>Stillingsprosent</Table.HeaderCell>
                        <Table.HeaderCell>Yrke</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {arbeidsforhold.map((forhold) => (
                        <Table.Row key={forhold.id}>
                            <Table.DataCell>{forhold.type.beskrivelse}</Table.DataCell>
                            <Table.DataCell>{forhold.arbeidssted.identer[0]?.ident}</Table.DataCell>
                            <Table.DataCell>{forhold.ansettelsesperiode.startdato}</Table.DataCell>
                            <Table.DataCell>{forhold.ansettelsesdetaljer[0]?.avtaltStillingsprosent}%</Table.DataCell>
                            <Table.DataCell>{forhold.ansettelsesdetaljer[0]?.yrke?.beskrivelse}</Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </SaksbildePanel>
    )
}
