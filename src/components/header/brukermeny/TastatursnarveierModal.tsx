import React, { Dispatch, ReactElement, SetStateAction } from 'react'
import { Dialog, Heading, Table } from '@navikt/ds-react'
import { TableBody, TableDataCell, TableRow } from '@navikt/ds-react/Table'

import { ShortcutMetadata, shortcutMetadata } from '@components/tastatursnarveier/shortcutMetadata'
import { Shortcut } from '@components/header/Shortcut'

interface TastatursnarveierModalProps {
    open: boolean
    onOpenChange: Dispatch<SetStateAction<boolean>>
}

export function TastatursnarveierModal({ open, onOpenChange }: TastatursnarveierModalProps): ReactElement {
    const [utviklerOnlyShortcuts, shortcuts] = shortcutMetadata.reduce<[ShortcutMetadata[], ShortcutMetadata[]]>(
        ([a, b], shortcut) => (shortcut.utviklerOnly ? [[...a, shortcut], b] : [a, [...b, shortcut]]),
        [[], []],
    )
    return (
        <Dialog open={open} onOpenChange={onOpenChange} aria-label="Tastatursnarveier modal">
            <Dialog.Popup width="small">
                <Dialog.Header>
                    <Dialog.Title>Tastatursnarveier</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <Table size="small" zebraStripes>
                        <TableBody>
                            {shortcuts.map((shortcut) => (
                                <TableRow key={shortcut.id}>
                                    <TableDataCell className="w-full">{shortcut.visningstekst}</TableDataCell>
                                    <TableDataCell className="text-right">
                                        <Shortcut keyCode={shortcut.key} modifier={shortcut.modifier} />
                                    </TableDataCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {utviklerOnlyShortcuts.length > 0 && (
                        <>
                            <Heading level="2" size="xsmall" className="my-4">
                                Utviklersnacks
                            </Heading>
                            <Table size="small" zebraStripes>
                                <TableBody>
                                    {utviklerOnlyShortcuts.map((shortcut) => (
                                        <TableRow key={shortcut.id}>
                                            <TableDataCell className="w-full">{shortcut.visningstekst}</TableDataCell>
                                            <TableDataCell className="text-right">
                                                <Shortcut keyCode={shortcut.key} modifier={shortcut.modifier} />
                                            </TableDataCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>
                    )}
                </Dialog.Body>
            </Dialog.Popup>
        </Dialog>
    )
}
