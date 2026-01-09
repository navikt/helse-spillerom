'use client'

import React, { ReactElement } from 'react'
import { BodyShort, Table } from '@navikt/ds-react'
import { TableBody, TableDataCell } from '@navikt/ds-react/Table'

import { useKafkaOutbox } from '@hooks/queries/useKafkaOutbox'

type PayloadRecord = Record<string, unknown>

function asPayloadRecord(payload: unknown): PayloadRecord | null {
    if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
        return payload as PayloadRecord
    }

    return null
}

function hentMetadataFraPayload(payload: unknown): { fnr?: string; fom?: string; tom?: string } {
    const record = asPayloadRecord(payload)

    if (!record) {
        return {}
    }

    const plukkString = (key: string): string | undefined => {
        const value = record[key]

        if (typeof value === 'string' || typeof value === 'number') {
            return String(value)
        }

        return undefined
    }

    return {
        fnr: plukkString('fnr'),
        fom: plukkString('fom'),
        tom: plukkString('tom'),
    }
}

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
                        <Table.HeaderCell scope="col">FNR</Table.HeaderCell>
                        <Table.HeaderCell scope="col">FOM</Table.HeaderCell>
                        <Table.HeaderCell scope="col">TOM</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <TableBody>
                    {sortedEntries.map((entry) => {
                        const { fnr, fom, tom } = hentMetadataFraPayload(entry.payload)

                        return (
                            <Table.ExpandableRow
                                key={entry.id}
                                content={
                                    <div className="space-y-2">
                                        <BodyShort size="small" className="wrap-break-word">
                                            <span className="font-semibold">Kafka key: </span>
                                            {entry.kafkaKey}
                                        </BodyShort>
                                        <pre className="overflow-auto rounded bg-ax-bg-neutral-soft p-2 text-xs">
                                            {JSON.stringify(entry.payload, null, 2)}
                                        </pre>
                                    </div>
                                }
                            >
                                <TableDataCell className="text-sm">{entry.id}</TableDataCell>
                                <TableDataCell className="text-sm">{entry.topic}</TableDataCell>
                                <TableDataCell className="text-sm">
                                    {new Date(entry.opprettet).toLocaleString('no-NO')}
                                </TableDataCell>
                                <TableDataCell className="text-sm">{fnr ?? '-'}</TableDataCell>
                                <TableDataCell className="text-sm">{fom ?? '-'}</TableDataCell>
                                <TableDataCell className="text-sm">{tom ?? '-'}</TableDataCell>
                            </Table.ExpandableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
