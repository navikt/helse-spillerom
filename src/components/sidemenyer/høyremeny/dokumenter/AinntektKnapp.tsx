'use client'

import { ReactElement, useState } from 'react'
import { Button, Modal, Table } from '@navikt/ds-react'
import { ExternalLinkIcon } from '@navikt/aksel-icons'

import { useAinntekt } from '@hooks/queries/useAinntekt'

export function AinntektKnapp(): ReactElement {
    const [open, setOpen] = useState(false)
    const { data: ainntekt, isLoading } = useAinntekt()

    return (
        <>
            <div className="inline-block">
                <Button
                    variant="tertiary"
                    size="small"
                    onClick={() => setOpen(true)}
                    aria-label="Vis A-inntekt data"
                    icon={<ExternalLinkIcon aria-hidden />}
                >
                    A-inntekt
                </Button>
            </div>
            <Modal open={open} onClose={() => setOpen(false)} header={{ heading: 'A-inntekt' }}>
                <Modal.Body>
                    {isLoading ? (
                        <div role="status" aria-live="polite">
                            Laster A-inntekt...
                        </div>
                    ) : !ainntekt ? (
                        <div>Ingen A-inntekt funnet</div>
                    ) : (
                        <div role="region" aria-label="A-inntekt oversikt">
                            <Table aria-label="A-inntekt tabell">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell scope="col">Måned</Table.HeaderCell>
                                        <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                                        <Table.HeaderCell scope="col">Beløp</Table.HeaderCell>
                                        <Table.HeaderCell scope="col">Beskrivelse</Table.HeaderCell>
                                        <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {ainntekt.arbeidsInntektMaaned.map((maaned) =>
                                        maaned.arbeidsInntektInformasjon.inntektListe.map((inntekt, index) => (
                                            <Table.Row key={`${maaned.aarMaaned}-${index}`}>
                                                <Table.DataCell>{maaned.aarMaaned}</Table.DataCell>
                                                <Table.DataCell>{inntekt.inntektType}</Table.DataCell>
                                                <Table.DataCell>
                                                    {inntekt.beloep.toLocaleString('nb-NO')} kr
                                                </Table.DataCell>
                                                <Table.DataCell>{inntekt.beskrivelse}</Table.DataCell>
                                                <Table.DataCell>{inntekt.inntektsstatus}</Table.DataCell>
                                            </Table.Row>
                                        )),
                                    )}
                                </Table.Body>
                            </Table>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </>
    )
}
