'use client'

import React, { ReactElement } from 'react'
import { ActionMenuItem } from '@navikt/ds-react/ActionMenu'

import { useAnonymizationContext } from '@components/anonymization/context'

export function AnonymiserToggle(): ReactElement {
    const { isAnonymized, toggle } = useAnonymizationContext()

    return (
        <ActionMenuItem onSelect={toggle}>
            {isAnonymized ? 'Fjern anonymisering' : 'Anonymiser personopplysninger'}
        </ActionMenuItem>
    )
}
