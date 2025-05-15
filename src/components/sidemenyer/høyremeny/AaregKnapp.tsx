'use client'

import { ReactElement, useState } from 'react'
import { Button, Modal } from '@navikt/ds-react'
import { Table } from '@navikt/ds-react'

import { useAareg } from '@hooks/queries/useAareg'

export function AaregKnapp(): ReactElement {
    const [open, setOpen] = useState(false)
    const { data: arbeidsforhold, isLoading } = useAareg()

    return (
        <>
            <Button variant="secondary" onClick={() => setOpen(true)}>
                Arbeidsforhold
            </Button>
            <Modal open={open} onClose={() => setOpen(false)} header={{ heading: 'Arbeidsforhold' }}>
                <Modal.Body>
                    {isLoading ? (
                        <div>Laster arbeidsforhold...</div>
                    ) : !arbeidsforhold || arbeidsforhold.length === 0 ? (
                        <div>Ingen arbeidsforhold funnet</div>
                    ) : (
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Type</Table.HeaderCell>
                                    <Table.HeaderCell>Arbeidssted</Table.HeaderCell>
                                    <Table.HeaderCell>Startdato</Table.HeaderCell>
                                    <Table.HeaderCell>Stillingsprosent</Table.HeaderCell>
                                    <Table.HeaderCell>Yrke</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {arbeidsforhold.map((forhold) => (
                                    <Table.Row key={forhold.id}>
                                        <Table.DataCell>{forhold.type.beskrivelse}</Table.DataCell>
                                        <Table.DataCell>{forhold.arbeidssted.identer[0]?.ident}</Table.DataCell>
                                        <Table.DataCell>{forhold.ansettelsesperiode.startdato}</Table.DataCell>
                                        <Table.DataCell>
                                            {forhold.ansettelsesdetaljer[0]?.avtaltStillingsprosent}%
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {forhold.ansettelsesdetaljer[0]?.yrke?.beskrivelse}
                                        </Table.DataCell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    )}
                </Modal.Body>
            </Modal>
        </>
    )
}
