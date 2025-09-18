'use client'

import React, { ReactElement } from 'react'
import { Table } from '@navikt/ds-react'

import { useUtbetalingsberegning } from '@hooks/queries/useUtbetalingsberegning'
import { useBeregningsregler } from '@/hooks/queries/useBeregningsregler'

export function BergingssporingInnsikt(): ReactElement {
    const { data: beregning } = useUtbetalingsberegning()
    const { data: beregningsregler } = useBeregningsregler()

    // Hent sporing fra beregning
    const sporing = beregning?.beregningData?.sporing || []

    // Finn beskrivelse og lovreferanse for hver regelkode
    const sporingMedInfo = sporing.map((regelkode) => {
        const regel = beregningsregler?.beregningsregler.find((r) => r.regelkode === regelkode)
        return {
            regelkode,
            beskrivelse: regel?.beskrivelse,
            lovreferanse: regel?.lovreferanse,
        }
    })

    return (
        <div className="space-y-6">
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Regelkode</Table.HeaderCell>
                        <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
                        <Table.HeaderCell>Lovreferanse</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {sporingMedInfo.map((item, idx) => (
                        <Table.Row key={idx}>
                            <Table.DataCell>
                                <div className="font-mono font-medium">{item.regelkode}</div>
                            </Table.DataCell>
                            <Table.DataCell>
                                <div className="text-sm">
                                    {item.beskrivelse || (
                                        <span className="text-gray-500 italic">Ingen beskrivelse tilgjengelig</span>
                                    )}
                                </div>
                            </Table.DataCell>
                            <Table.DataCell>
                                {item.lovreferanse ? (
                                    <div className="text-gray-500 text-xs">
                                        {item.lovreferanse.lovverk} §{item.lovreferanse.paragraf}
                                        {item.lovreferanse.ledd && ` ledd ${item.lovreferanse.ledd}`}
                                        {item.lovreferanse.setning && ` setning ${item.lovreferanse.setning}`}
                                        {item.lovreferanse.bokstav && ` bokstav ${item.lovreferanse.bokstav}`}
                                    </div>
                                ) : (
                                    <span className="text-gray-400 text-xs italic">Ingen lovreferanse</span>
                                )}
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    )
}
