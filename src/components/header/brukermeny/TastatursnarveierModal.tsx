import React, { ReactElement } from 'react'
import { Heading, Modal, Table } from '@navikt/ds-react'
import { ModalBody, ModalHeader } from '@navikt/ds-react/Modal'
import { TableBody, TableDataCell, TableRow } from '@navikt/ds-react/Table'

import { ShortcutMetadata, shortcutMetadata } from '@components/tastatursnarveier/shortcutMetadata'
import { Shortcut } from '@components/header/Shortcut'

interface TastatursnarveierModalProps {
    closeModal: () => void
    showModal: boolean
}

export function TastatursnarveierModal({ closeModal, showModal }: TastatursnarveierModalProps): ReactElement {
    const [utviklerOnlyShortcuts, shortcuts] = shortcutMetadata.reduce<[ShortcutMetadata[], ShortcutMetadata[]]>(
        ([a, b], shortcut) => (shortcut.utviklerOnly ? [[...a, shortcut], b] : [a, [...b, shortcut]]),
        [[], []],
    )
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
                        {shortcuts.map((shortcut) => (
                            <TableRow key={shortcut.id}>
                                <TableDataCell>
                                    <Shortcut keyCode={shortcut.key} modifier={shortcut.modifier} />
                                </TableDataCell>
                                <TableDataCell>{shortcut.visningstekst}</TableDataCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {utviklerOnlyShortcuts.length > 0 && (
                    <>
                        <Heading level="2" size="xsmall" className="my-4">
                            Utviklersnacks
                        </Heading>
                        <Table size="small" zebraStripes className="min-w-md">
                            <TableBody>
                                {utviklerOnlyShortcuts.map((shortcut) => (
                                    <TableRow key={shortcut.id}>
                                        <TableDataCell>
                                            <Shortcut keyCode={shortcut.key} modifier={shortcut.modifier} />
                                        </TableDataCell>
                                        <TableDataCell className="w-full">{shortcut.visningstekst}</TableDataCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                )}
            </ModalBody>
        </Modal>
    )
}
