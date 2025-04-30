'use client'

import React, { ReactElement, useState } from 'react'
import { DropdownMenuList, DropdownMenuListItem } from '@navikt/ds-react/Dropdown'

import { TastatursnarveierModal } from '@components/header/brukermeny/TastatursnarveierModal'
import { useRegisterShortcutHandler } from '@components/tastatursnarveier/useRegisterShortcutHandler'

export function Tastatursnarveier(): ReactElement {
    const [showModal, setShowModal] = useState(false)
    useRegisterShortcutHandler('open_tastatursnarveier', () => setShowModal((prev) => !prev))

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
