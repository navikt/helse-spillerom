'use client'

import React, { ReactElement } from 'react'
import { Button, Table } from '@navikt/ds-react'
import { TrashIcon } from '@navikt/aksel-icons'

import { useVilkaarsvurderinger } from '@hooks/queries/useVilkaarsvurderinger'
import { useSlettVilkaarsvurdering } from '@hooks/mutations/useSlettVilkaarsvurdering'
import { useKodeverk } from '@hooks/queries/useKodeverk'

export function VilkårsvurderingDebug(): ReactElement {
    const { data: vurderinger = [] } = useVilkaarsvurderinger()
    const { data: kodeverk = [] } = useKodeverk()
    const { mutate: slettVurdering } = useSlettVilkaarsvurdering()

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Kode</Table.HeaderCell>
                    <Table.HeaderCell>Vurdering</Table.HeaderCell>
                    <Table.HeaderCell>Begrunnelse</Table.HeaderCell>
                    <Table.HeaderCell>Notat</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vurderinger.map((vurdering) => {
                    const vilkår = kodeverk.find((v) => v.vilkårskode === vurdering.kode)
                    const årsak = vilkår?.mulige_resultater[vurdering.vurdering]?.find(
                        (a) => a.kode === vurdering.årsak,
                    )
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
                                    {vurdering.årsak}
                                    {årsak?.vilkårshjemmel && (
                                        <div className="text-gray-500 text-sm">
                                            {årsak.vilkårshjemmel.lovverk} §{årsak.vilkårshjemmel.paragraf}
                                            {årsak.vilkårshjemmel.ledd && ` ledd ${årsak.vilkårshjemmel.ledd}`}
                                            {årsak.vilkårshjemmel.bokstav && ` bokstav ${årsak.vilkårshjemmel.bokstav}`}
                                        </div>
                                    )}
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
