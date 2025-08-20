'use client'

import React, { ReactElement } from 'react'
import { Button, Table, Tag } from '@navikt/ds-react'
import { TrashIcon } from '@navikt/aksel-icons'

import { useVilkaarsvurderinger } from '@hooks/queries/useVilkaarsvurderinger'
import { useSlettVilkaarsvurdering } from '@hooks/mutations/useSlettVilkaarsvurdering'
import { useKodeverk } from '@/hooks/queries/useKodeverk'

export function VilkårsvurderingInnsikt(): ReactElement {
    const { data: vurderinger = [] } = useVilkaarsvurderinger()
    const { data: kodeverk = [] } = useKodeverk()
    const { mutate: slettVurdering } = useSlettVilkaarsvurdering()

    // Samle alle vurderte årsakskoder (bruker underspørsmål.svar som koden)
    const alleVurderteÅrsakskoder = new Set<string>()
    vurderinger.forEach((vurdering) => {
        vurdering.underspørsmål.forEach((usp) => {
            alleVurderteÅrsakskoder.add(usp.svar)
        })
    })

    // Finn vilkår som har vurderte årsakskoder
    const vilkårMedVurderteÅrsaker = kodeverk.filter((vilkår) => {
        const harVurdertOppfylt = vilkår.oppfylt.some((årsak) => alleVurderteÅrsakskoder.has(årsak.kode))
        const harVurdertIkkeOppfylt = vilkår.ikkeOppfylt.some((årsak) => alleVurderteÅrsakskoder.has(årsak.kode))
        return harVurdertOppfylt || harVurdertIkkeOppfylt
    })

    return (
        <div className="space-y-6">
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Vilkår</Table.HeaderCell>
                        <Table.HeaderCell>Vurdering</Table.HeaderCell>
                        <Table.HeaderCell>Notat</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {vilkårMedVurderteÅrsaker.map((vilkår) => {
                        // Finn alle vurderte årsaker for dette vilkåret
                        const vurderteOppfylt = vilkår.oppfylt.filter((årsak) =>
                            alleVurderteÅrsakskoder.has(årsak.kode),
                        )
                        const vurderteIkkeOppfylt = vilkår.ikkeOppfylt.filter((årsak) =>
                            alleVurderteÅrsakskoder.has(årsak.kode),
                        )
                        const alleVurderteÅrsaker = [
                            ...vurderteOppfylt.map((å) => ({ ...å, type: 'oppfylt' as const })),
                            ...vurderteIkkeOppfylt.map((å) => ({ ...å, type: 'ikkeOppfylt' as const })),
                        ]

                        // Finn relaterte vurderinger for notat og slett-funksjonalitet
                        const relaterteVurderinger = vurderinger.filter((vurdering) =>
                            vurdering.underspørsmål.some((usp) =>
                                alleVurderteÅrsaker.some((vÅ) => vÅ.kode === usp.svar),
                            ),
                        )

                        // Bestem samlet status for vilkåret
                        const harIkkeOppfylt = alleVurderteÅrsaker.some((årsak) => årsak.type === 'ikkeOppfylt')
                        const samletStatus = harIkkeOppfylt ? 'ikkeOppfylt' : 'oppfylt'

                        return (
                            <Table.Row key={vilkår.vilkårskode}>
                                <Table.DataCell>
                                    <div>
                                        <div className="font-medium">{vilkår.vilkårskode}</div>
                                        <div className="text-gray-600 mb-2 text-sm">{vilkår.beskrivelse}</div>
                                        <Tag
                                            variant={samletStatus === 'oppfylt' ? 'success' : 'error'}
                                            size="small"
                                            className="mb-2"
                                        >
                                            {samletStatus === 'oppfylt' ? 'Oppfylt' : 'Ikke oppfylt'}
                                        </Tag>
                                        {vilkår.vilkårshjemmel && (
                                            <div className="text-gray-500 text-xs">
                                                {vilkår.vilkårshjemmel.lovverk} §{vilkår.vilkårshjemmel.paragraf}
                                                {vilkår.vilkårshjemmel.ledd && ` ledd ${vilkår.vilkårshjemmel.ledd}`}
                                                {vilkår.vilkårshjemmel.setning &&
                                                    ` setning ${vilkår.vilkårshjemmel.setning}`}
                                                {vilkår.vilkårshjemmel.bokstav &&
                                                    ` bokstav ${vilkår.vilkårshjemmel.bokstav}`}
                                            </div>
                                        )}
                                    </div>
                                </Table.DataCell>
                                <Table.DataCell>
                                    <div className="space-y-3">
                                        {alleVurderteÅrsaker.map((årsak) => {
                                            return (
                                                <div key={årsak.kode} className="border-gray-200 border-l-2 pl-3">
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <span className="font-mono text-sm">{årsak.kode}</span>
                                                    </div>
                                                    <Tag
                                                        variant={årsak.type === 'oppfylt' ? 'success' : 'error'}
                                                        size="xsmall"
                                                    >
                                                        {årsak.type === 'oppfylt' ? 'Oppfylt' : 'Ikke oppfylt'}
                                                    </Tag>
                                                    <div className="mb-1 text-sm font-medium">{årsak.beskrivelse}</div>

                                                    {årsak.vilkårshjemmel && (
                                                        <div className="text-gray-500 mb-1 text-xs">
                                                            {årsak.vilkårshjemmel.lovverk} §
                                                            {årsak.vilkårshjemmel.paragraf}
                                                            {årsak.vilkårshjemmel.ledd &&
                                                                ` ledd ${årsak.vilkårshjemmel.ledd}`}
                                                            {årsak.vilkårshjemmel.setning &&
                                                                ` setning ${årsak.vilkårshjemmel.setning}`}
                                                            {årsak.vilkårshjemmel.bokstav &&
                                                                ` bokstav ${årsak.vilkårshjemmel.bokstav}`}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Table.DataCell>
                                <Table.DataCell>
                                    <div className="space-y-1">
                                        {relaterteVurderinger.map((vurdering, index) => (
                                            <div key={index} className="text-sm">
                                                {vurdering.notat && (
                                                    <div className="text-gray-600">{vurdering.notat}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </Table.DataCell>
                                <Table.DataCell>
                                    <div className="space-y-1">
                                        {relaterteVurderinger.map((vurdering, index) => (
                                            <Button
                                                key={index}
                                                variant="tertiary"
                                                size="small"
                                                icon={
                                                    <TrashIcon className="text-icon-danger" title="Slett vurdering" />
                                                }
                                                onClick={() => slettVurdering({ kode: vurdering.hovedspørsmål })}
                                            />
                                        ))}
                                    </div>
                                </Table.DataCell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table>
        </div>
    )
}
