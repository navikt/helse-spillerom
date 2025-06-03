'use client'

import React, { PropsWithChildren, ReactElement, useState } from 'react'
import { Button, Modal, Select, Table, TextField, Tooltip } from '@navikt/ds-react'
import { ParagraphIcon } from '@navikt/aksel-icons'
import { ModalBody } from '@navikt/ds-react/Modal'
import { useParams } from 'next/navigation'

import { useVilkaarsvurderinger } from '@hooks/queries/useVilkaarsvurderinger'
import { useOpprettVilkaarsvurdering } from '@hooks/mutations/useOpprettVilkaarsvurdering'
import { Vurdering } from '@/schemas/vilkaarsvurdering'
import { erProd } from '@/env'

export function VilkarsvurderingDebugging({ children }: PropsWithChildren): ReactElement {
    const [showModal, setShowModal] = useState(false)
    const params = useParams()

    if (erProd || !params.saksbehandlingsperiodeId) {
        return <>{children}</>
    }
    return (
        <div className="relative min-h-screen">
            {children}

            <div className="fixed right-20 bottom-4 z-50">
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
                    className="left-auto m-0 m-10 h-screen max-h-max max-w-[800px] rounded-none p-0"
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
    const [kode, setKode] = useState('')
    const [vurdering, setVurdering] = useState<Vurdering>('OPPFYLT')
    const [årsak, setÅrsak] = useState('')

    const { data: vurderinger = [] } = useVilkaarsvurderinger()
    const { mutate: opprettVurdering } = useOpprettVilkaarsvurdering()

    const handleSubmit = () => {
        opprettVurdering(
            { kode, vurdering, årsak },
            {
                onSuccess: () => {
                    setKode('')
                    setVurdering('OPPFYLT')
                    setÅrsak('')
                },
            },
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <TextField label="Kode" value={kode} onChange={(e) => setKode(e.target.value)} />
                <Select label="Vurdering" value={vurdering} onChange={(e) => setVurdering(e.target.value as Vurdering)}>
                    <option value="OPPFYLT">OPPFYLT</option>
                    <option value="IKKE_OPPFYLT">IKKE_OPPFYLT</option>
                    <option value="IKKE_RELEVANT">IKKE_RELEVANT</option>
                </Select>
                <TextField label="Begrunnelse" value={årsak} onChange={(e) => setÅrsak(e.target.value)} />
                <Button onClick={handleSubmit}>Opprett vurdering</Button>
            </div>

            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Kode</Table.HeaderCell>
                        <Table.HeaderCell>Vurdering</Table.HeaderCell>
                        <Table.HeaderCell>Begrunnelse</Table.HeaderCell>
                        <Table.HeaderCell>Notat</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {vurderinger.map((vurdering) => (
                        <Table.Row key={vurdering.kode}>
                            <Table.DataCell>{vurdering.kode}</Table.DataCell>
                            <Table.DataCell>{vurdering.vurdering}</Table.DataCell>
                            <Table.DataCell>{vurdering.årsak}</Table.DataCell>
                            <Table.DataCell>{vurdering.notat}</Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    )
}
