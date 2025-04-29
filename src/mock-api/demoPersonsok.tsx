'use client'

import { Button, Modal, Table, Tooltip } from '@navikt/ds-react'
import React, { useState } from 'react'
import { SandboxIcon } from '@navikt/aksel-icons'

import { erLokalEllerDemo } from '@/env'
import { useTestdata } from '@hooks/queries/useTestdata'

type LayoutWrapperProps = {
    children: React.ReactNode
}

export const DemoPersonsok: React.FC<LayoutWrapperProps> = ({ children }) => {
    const [openState, setOpenState] = useState(false)

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
                        onClick={() => setOpenState((b) => !b)}
                        icon={<SandboxIcon title="Åpne testdataverktøy" aria-hidden />}
                        variant="tertiary-neutral"
                    />
                </Tooltip>
            </div>
            <Modal
                open={openState}
                onClose={() => {
                    setOpenState(false)
                }}
                header={{ heading: 'Testdata', closeButton: true }}
                className="left-auto m-0 h-screen max-h-max max-w-[369px] rounded-none p-0"
            >
                <Modal.Body>
                    <TestpersonTabell />
                </Modal.Body>
            </Modal>
        </div>
    )
}

const TestpersonTabell = () => {
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
                <Table.Body>
                    {testdata.data.map((person) => (
                        <Table.Row
                            key={person.fnr}
                            className="hover:cursor-pointer"
                            onClick={() => {
                                window.location.href = `/person/${person.personId}`
                            }}
                        >
                            <Table.DataCell>{person.personinfo.navn}</Table.DataCell>
                            <Table.DataCell>{person.fnr}</Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        )
    }
}
