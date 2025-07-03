'use client'

import React, { PropsWithChildren, ReactElement, useState } from 'react'
import { Button, Modal, Table, Tooltip } from '@navikt/ds-react'
import { ParagraphIcon, TrashIcon } from '@navikt/aksel-icons'
import { ModalBody } from '@navikt/ds-react/Modal'
import { useParams } from 'next/navigation'

import { useVilkaarsvurderinger } from '@hooks/queries/useVilkaarsvurderinger'
import { useSlettVilkaarsvurdering } from '@hooks/mutations/useSlettVilkaarsvurdering'
import { erProd } from '@/env'
import { useKodeverk } from '@hooks/queries/useKodeverk'

export function VilkarsvurderingDebugging({ children }: PropsWithChildren): ReactElement {
    const [showModal, setShowModal] = useState(false)
    const params = useParams()

    if (erProd || !params.saksbehandlingsperiodeId) {
        return <>{children}</>
    }
    return (
        <div className="relative min-h-screen">
            {children}

            <div className="fixed bottom-4 right-20 z-50">
                <Tooltip content="Vilkårsvurderinger">
                    <Button
                        type="button"
                        onClick={() => setShowModal((prev) => !prev)}
                        icon={<ParagraphIcon title="Åpne vilkårsvurdering debugging" aria-hidden />}
                        variant="tertiary-neutral"
                    />
                </Tooltip>
            </div>
            {showModal && (
                <Modal
                    open={showModal}
                    onClose={() => {
                        setShowModal(false)
                    }}
                    header={{ heading: 'Vurderte vilkår', closeButton: true }}
                    className="left-auto m-0 m-10 h-screen max-h-max min-h-[600px] min-w-[800px] max-w-[1200px] rounded-none p-0"
                >
                    <ModalBody>
                        <Vilkårsvurdering />
                    </ModalBody>
                </Modal>
            )}
        </div>
    )
}

function Vilkårsvurdering(): ReactElement {
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
                                        <div className="text-sm text-gray-500">
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
                                        <div className="text-sm text-gray-500">
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
