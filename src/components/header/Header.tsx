'use client'

import Link from 'next/link'
import React from 'react'
import { InternalHeader } from '@navikt/ds-react'

import { UserMenu } from '@/components/UserMenu'

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
            <InternalHeader.Title as={Link} href="/">
                Manuell saksbehandling
            </InternalHeader.Title>
            <div className="mx-auto"></div>
            <UserMenu />
        </InternalHeader>
    )
}
