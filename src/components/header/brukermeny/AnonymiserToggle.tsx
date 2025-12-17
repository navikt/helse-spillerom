'use client'

import React, { ReactElement } from 'react'
import { DropdownMenuList, DropdownMenuListItem } from '@navikt/ds-react/Dropdown'

import { useAnonymizationContext } from '@components/anonymization/context'

export function AnonymiserToggle(): ReactElement {
    const { isAnonymized, toggle } = useAnonymizationContext()

    return (
        <>
            <DropdownMenuList>
                <DropdownMenuListItem as="a" onClick={toggle}>
                    {isAnonymized ? 'Fjern anonymisering' : 'Anonymiser personopplysninger'}
                </DropdownMenuListItem>
            </DropdownMenuList>
        </>
    )
}
