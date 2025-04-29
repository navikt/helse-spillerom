'use client'

import {erLokalEllerDemo} from '@/env'
import {Button, Heading, Modal, Tooltip} from "@navikt/ds-react";
import React, {useState} from "react";
import {SandboxIcon} from "@navikt/aksel-icons";

type LayoutWrapperProps = {
    children: React.ReactNode
}

export const DemoPersonsok: React.FC<LayoutWrapperProps> = ({children}) => {
    const [openState, setOpenState] = useState(false)

    if (!erLokalEllerDemo) {
        return <>{children}</>
    }
    return (
        <div className="relative min-h-screen">
            {children}

            <div className={"fixed right-4 bottom-4 z-50"}>

            <Tooltip  content="Testpersoner">
                <Button
                    type="button"
                    onClick={() => setOpenState((b) => !b)}
                    icon={<SandboxIcon title="Åpne testdataverktøy" aria-hidden/>}
                    variant="tertiary-neutral"
                />
            </Tooltip>
            </div>
            <Modal
                open={openState}
                onClose={() => {
                    setOpenState(false)
                }}
                header={{heading: 'Testdataverktøy', closeButton: true}}
                className="h-screen max-h-max max-w-[369px] rounded-none p-0 left-auto m-0"
            >
                <Modal.Body>
                    easfd
                </Modal.Body>
            </Modal>
        </div>
    )
}
