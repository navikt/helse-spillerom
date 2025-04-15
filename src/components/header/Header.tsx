'use client'

import React from 'react'
import { InternalHeader } from '@navikt/ds-react'

export const Header = () => {
    return (
        <InternalHeader
            className="h-14 "
            style={
                {
                    '--ac-internalheader-hover-bg': 'var(--a-green-700)',
                    '--ac-internalheader-bg': 'var(--a-green-500)',
                } as React.CSSProperties
            }
        >
            <InternalHeader.Title as={'h1'} href="/">
                Manuell saksbehandling
            </InternalHeader.Title>
        </InternalHeader>
    )
}
