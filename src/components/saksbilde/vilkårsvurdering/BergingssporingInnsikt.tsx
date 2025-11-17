'use client'

import React, { ReactElement } from 'react'
import { Table } from '@navikt/ds-react'

import { useUtbetalingsberegning } from '@hooks/queries/useUtbetalingsberegning'
import { useBeregningsregler } from '@/hooks/queries/useBeregningsregler'
import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'
import { useSykepengegrunnlag } from '@hooks/queries/useSykepengegrunnlag'

export function BergingssporingInnsikt(): ReactElement {
    const { data: beregning } = useUtbetalingsberegning()
    const { data: beregningsregler } = useBeregningsregler()
    const { data: yrkesaktiviteter } = useYrkesaktivitet()
    const { data: sykepengegrunnlag } = useSykepengegrunnlag()

    const regelkoder: string[] = []

    // Hent sporing fra beregning
    beregning?.beregningData?.yrkesaktiviteter
        ?.map((ya) => ya.dekningsgrad?.sporing)
        .forEach((regelkode) => {
            if (regelkode) {
                regelkoder.push(regelkode)
            }
        })

    yrkesaktiviteter?.forEach((ya) => {
        const inntektSporing = ya.inntektData?.sporing
        if (inntektSporing) {
            regelkoder.push(inntektSporing)
        }
    })

    if (sykepengegrunnlag?.sykepengegrunnlag?.kombinertBeregningskode) {
        regelkoder.push(sykepengegrunnlag?.sykepengegrunnlag?.kombinertBeregningskode)
    }

    // Finn beskrivelse og lovreferanse for hver regelkode
    const sporingMedInfo = regelkoder.map((regelkode) => {
        const regel = beregningsregler?.find((r) => r.kode === regelkode)
        return {
            regelkode,
            beskrivelse: regel?.beskrivelse,
            vilkårshjemmel: regel?.vilkårshjemmel,
        }
    })

    return (
        <>
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
                                {item.vilkårshjemmel.lovverk} §{item.vilkårshjemmel.kapittel}-
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
        </>
    )
}
