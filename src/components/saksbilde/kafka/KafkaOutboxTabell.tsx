'use client'

import React, { ReactElement } from 'react'
import { BodyShort, Table } from '@navikt/ds-react'
import { TableBody, TableDataCell } from '@navikt/ds-react/Table'

import { useKafkaOutbox } from '@hooks/queries/useKafkaOutbox'

export function KafkaOutboxTabell(): ReactElement {
    const { data: entries, isLoading, isError, error } = useKafkaOutbox()

    if (isLoading) {
        return (
            <div className="p-4">
                <BodyShort>Laster Kafka outbox...</BodyShort>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="p-4">
                <BodyShort className="text-red-600">
                    Feil ved henting av Kafka outbox: {error?.message || 'Ukjent feil'}
                </BodyShort>
            </div>
        )
    }

    if (!entries || entries.length === 0) {
        return (
            <div className="p-4">
                <BodyShort>Ingen upubliserte Kafka-meldinger funnet.</BodyShort>
            </div>
        )
    }

    const sortedEntries = [...entries].sort((a, b) => b.id - a.id)

    return (
        <div className="p-4">
            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                        <Table.HeaderCell scope="col">ID</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Topic</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Opprettet</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Key</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <TableBody>
                    {sortedEntries.map((entry) => (
                        <Table.ExpandableRow
                            key={entry.id}
                            content={
                                <pre className="bg-gray-50 overflow-auto rounded p-2 text-xs">
                                    {JSON.stringify(entry.payload, null, 2)}
                                </pre>
                            }
                        >
                            <TableDataCell>{entry.id}</TableDataCell>
                            <TableDataCell>{entry.topic}</TableDataCell>
                            <TableDataCell className="text-xs">
                                {new Date(entry.opprettet).toLocaleString('no-NO')}
                            </TableDataCell>
                            <TableDataCell className="text-xs">{entry.kafkaKey}</TableDataCell>

                            <TableDataCell></TableDataCell>
                        </Table.ExpandableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
