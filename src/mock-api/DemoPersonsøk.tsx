'use client'

import { Button, Modal, Table, Tooltip } from '@navikt/ds-react'
import React, { PropsWithChildren, ReactElement, useState } from 'react'
import { SandboxIcon } from '@navikt/aksel-icons'
import { ModalBody } from '@navikt/ds-react/Modal'
import { TableBody, TableDataCell, TableRow } from '@navikt/ds-react/Table'

import { erLokalEllerDemo } from '@/env'
import { useTestdata } from '@hooks/queries/useTestdata'

export function DemoPersonsøk({ children }: PropsWithChildren): ReactElement {
    const [showModal, setShowModal] = useState(false)

    if (!erLokalEllerDemo) {
        return <>{children}</>
    }
    return (
        <div className="relative min-h-screen">
            {children}

            <div className="fixed right-4 bottom-4 z-50">
                <Tooltip content="Testpersoner">
                    <Button
                        type="button"
                        onClick={() => setShowModal((b) => !b)}
                        icon={<SandboxIcon title="Åpne testdataverktøy" aria-hidden />}
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
                    header={{ heading: 'Testdata', closeButton: true }}
                    className="left-auto m-0 h-screen max-h-max max-w-[369px] rounded-none p-0"
                >
                    <ModalBody>
                        <TestpersonTabell />
                    </ModalBody>
                </Modal>
            )}
        </div>
    )
}

function TestpersonTabell() {
    const testdata = useTestdata()
    if (testdata.isLoading) {
        return <div>Loading...</div>
    }
    if (testdata.isError) {
        return <div>Error: {testdata.error.message}</div>
    }
    if (testdata.isSuccess) {
        return (
            <Table className="w-full">
                <TableBody>
                    {testdata.data.map((person) => (
                        <TableRow
                            key={person.fnr}
                            className="hover:cursor-pointer"
                            onClick={() => {
                                window.location.href = `/person/${person.personId}`
                            }}
                        >
                            <TableDataCell>{person.personinfo.navn}</TableDataCell>
                            <TableDataCell>{person.fnr}</TableDataCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }
}
