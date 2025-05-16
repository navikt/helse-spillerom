'use client'

import { ReactElement, useState } from 'react'
import { Button, Modal, Table } from '@navikt/ds-react'

import { useAinntekt } from '@hooks/queries/useAinntekt'

export function AinntektKnapp(): ReactElement {
    const [open, setOpen] = useState(false)
    const { data: ainntekt, isLoading } = useAinntekt()

    return (
        <>
            <Button variant="secondary" onClick={() => setOpen(true)}>
                A-inntekt
            </Button>
            <Modal open={open} onClose={() => setOpen(false)} header={{ heading: 'A-inntekt' }}>
                <Modal.Body>
                    {isLoading ? (
                        <div>Laster A-inntekt...</div>
                    ) : !ainntekt ? (
                        <div>Ingen A-inntekt funnet</div>
                    ) : (
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Måned</Table.HeaderCell>
                                    <Table.HeaderCell>Type</Table.HeaderCell>
                                    <Table.HeaderCell>Beløp</Table.HeaderCell>
                                    <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
                                    <Table.HeaderCell>Status</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {ainntekt.arbeidsInntektMaaned.map((maaned) =>
                                    maaned.arbeidsInntektInformasjon.inntektListe.map((inntekt, index) => (
                                        <Table.Row key={`${maaned.aarMaaned}-${index}`}>
                                            <Table.DataCell>{maaned.aarMaaned}</Table.DataCell>
                                            <Table.DataCell>{inntekt.inntektType}</Table.DataCell>
                                            <Table.DataCell>{inntekt.beloep.toLocaleString('nb-NO')} kr</Table.DataCell>
                                            <Table.DataCell>{inntekt.beskrivelse}</Table.DataCell>
                                            <Table.DataCell>{inntekt.inntektsstatus}</Table.DataCell>
                                        </Table.Row>
                                    )),
                                )}
                            </Table.Body>
                        </Table>
                    )}
                </Modal.Body>
            </Modal>
        </>
    )
}
