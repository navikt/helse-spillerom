'use client'

import React, { ReactElement, useState } from 'react'
import { DropdownMenuList, DropdownMenuListItem } from '@navikt/ds-react/Dropdown'

import { TastatursnarveierModal } from '@components/header/brukermeny/TastatursnarveierModal'

export function Tastatursnarveier(): ReactElement {
    const [showModal, setShowModal] = useState(false)
    return (
        <>
            <DropdownMenuList>
                <DropdownMenuListItem as="a" onClick={() => setShowModal(true)}>
                    Tastatursnarveier
                </DropdownMenuListItem>
            </DropdownMenuList>
            {showModal && <TastatursnarveierModal closeModal={() => setShowModal(false)} showModal={showModal} />}
        </>
    )
}
