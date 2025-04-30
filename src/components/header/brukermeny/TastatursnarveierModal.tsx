import React, { ReactElement } from 'react'
import { Heading, Modal, Table } from '@navikt/ds-react'
import { ModalBody, ModalHeader } from '@navikt/ds-react/Modal'
import { TableBody, TableDataCell, TableRow } from '@navikt/ds-react/Table'

import { shortcutMetadata } from '@components/tastatursnarveier/shortcutMetadata'
import { Shortcut } from '@components/header/Shortcut'

interface TastatursnarveierModalProps {
    closeModal: () => void
    showModal: boolean
}

export function TastatursnarveierModal({ closeModal, showModal }: TastatursnarveierModalProps): ReactElement {
    return (
        <Modal aria-label="Tastatursnarveier modal" open={showModal} onClose={closeModal} portal closeOnBackdropClick>
            <ModalHeader>
                <Heading level="1" size="medium">
                    Tastatursnarveier
                </Heading>
            </ModalHeader>
            <ModalBody>
                <Table size="small" zebraStripes className="min-w-md">
                    <TableBody>
                        {shortcutMetadata.map((shortcut) => (
                            <TableRow key={shortcut.id}>
                                <TableDataCell>
                                    <Shortcut keyCode={shortcut.key} modifier={shortcut.modifier} />
                                </TableDataCell>
                                <TableDataCell>{shortcut.visningstekst}</TableDataCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ModalBody>
        </Modal>
    )
}
