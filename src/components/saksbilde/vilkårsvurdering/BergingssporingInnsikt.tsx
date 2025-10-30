'use client'

import React, { ReactElement } from 'react'
import { Table } from '@navikt/ds-react'

import { useUtbetalingsberegning } from '@hooks/queries/useUtbetalingsberegning'
import { useBeregningsregler } from '@/hooks/queries/useBeregningsregler'
import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'

export function BergingssporingInnsikt(): ReactElement {
    const { data: beregning } = useUtbetalingsberegning()
    const { data: beregningsregler } = useBeregningsregler()
    const { data: yrkesaktiviteter } = useYrkesaktivitet()

    // Hent sporing fra beregning
    const sporing = beregning?.beregningData?.yrkesaktiviteter?.map((ya) => ya.dekningsgrad?.sporing) || []

    // Finn beskrivelse og lovreferanse for hver regelkode
    const sporingMedInfo = sporing.map((regelkode) => {
        const regel = beregningsregler?.find((r) => r.kode === regelkode)
        return {
            regelkode,
            beskrivelse: regel?.beskrivelse,
            vilkårshjemmel: regel?.vilkårshjemmel,
        }
    })

    yrkesaktiviteter?.forEach((ya) => {
        const inntektSporing = ya.inntektData?.sporing
        if (inntektSporing) {
            const regel = beregningsregler?.find((r) => r.kode === inntektSporing)
            sporingMedInfo.push({
                regelkode: inntektSporing,
                beskrivelse: regel?.beskrivelse,
                vilkårshjemmel: regel?.vilkårshjemmel,
            })
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
                                {item.vilkårshjemmel ? (
                                    <div className="text-gray-500 text-xs">
                                        {item.vilkårshjemmel.lovverk} §{item.vilkårshjemmel.kapittel}-§
                                        {item.vilkårshjemmel.paragraf}
                                        {item.vilkårshjemmel.ledd && ` ledd ${item.vilkårshjemmel.ledd}`}
                                        {item.vilkårshjemmel.setning && ` setning ${item.vilkårshjemmel.setning}`}
                                        {item.vilkårshjemmel.bokstav && ` bokstav ${item.vilkårshjemmel.bokstav}`}
                                    </div>
                                ) : (
                                    <span className="text-gray-400 text-xs italic">Ingen vilkårshjemmel</span>
                                )}
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    )
}
