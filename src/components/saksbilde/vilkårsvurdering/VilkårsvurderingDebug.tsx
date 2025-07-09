'use client'

import React, { ReactElement } from 'react'
import { Button, Table } from '@navikt/ds-react'
import { TrashIcon } from '@navikt/aksel-icons'

import { useVilkaarsvurderingerV2 } from '@hooks/queries/useVilkaarsvurderingerV2'
import { useSlettVilkaarsvurdering } from '@hooks/mutations/useSlettVilkaarsvurdering'
import { useKodeverkV2 } from '@hooks/queries/useKodeverkV2'

export function VilkårsvurderingDebug(): ReactElement {
    const { data: vurderinger = [] } = useVilkaarsvurderingerV2()
    const { data: kodeverk = [] } = useKodeverkV2()
    const { mutate: slettVurdering } = useSlettVilkaarsvurdering()

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Kode</Table.HeaderCell>
                    <Table.HeaderCell>Vurdering</Table.HeaderCell>
                    <Table.HeaderCell>Årsaker</Table.HeaderCell>
                    <Table.HeaderCell>Notat</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vurderinger.map((vurdering) => {
                    const vilkår = kodeverk.find((v) => v.vilkårskode === vurdering.kode)

                    return (
                        <Table.Row key={vurdering.kode}>
                            <Table.DataCell>
                                <div>
                                    {vurdering.kode}
                                    {vilkår?.vilkårshjemmel && (
                                        <div className="text-gray-500 text-sm">
                                            {vilkår.vilkårshjemmel.lovverk} §{vilkår.vilkårshjemmel.paragraf}
                                            {vilkår.vilkårshjemmel.ledd && ` ledd ${vilkår.vilkårshjemmel.ledd}`}
                                            {vilkår.vilkårshjemmel.bokstav &&
                                                ` bokstav ${vilkår.vilkårshjemmel.bokstav}`}
                                        </div>
                                    )}
                                </div>
                            </Table.DataCell>
                            <Table.DataCell>{vurdering.vurdering}</Table.DataCell>
                            <Table.DataCell>
                                <div>
                                    {vurdering.årsaker.map((årsak, index) => (
                                        <div key={index}>
                                            <div>{årsak.kode}</div>
                                            <div className="text-gray-500 text-sm">{årsak.vurdering}</div>
                                        </div>
                                    ))}
                                </div>
                            </Table.DataCell>
                            <Table.DataCell>{vurdering.notat}</Table.DataCell>
                            <Table.DataCell>
                                <Button
                                    variant="tertiary"
                                    size="small"
                                    icon={<TrashIcon className="text-icon-danger" title="Slett vurdering" />}
                                    onClick={() => slettVurdering({ kode: vurdering.kode })}
                                />
                            </Table.DataCell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table>
    )
}
