import React, { ReactElement } from 'react'
import NextLink from 'next/link'
import { InternalHeader, Spacer } from '@navikt/ds-react'
import { InternalHeaderTitle } from '@navikt/ds-react/InternalHeader'

import { BrukerMeny } from '@components/header/BrukerMeny'

export function Header(): ReactElement {
    return (
        <InternalHeader
            className="h-14"
            style={
                {
                    '--ac-internalheader-hover-bg': 'var(--a-green-700)',
                    '--ac-internalheader-bg': 'var(--a-green-500)',
                } as React.CSSProperties
            }
        >
            <InternalHeaderTitle as={NextLink} href="/">
                Manuell saksbehandling
            </InternalHeaderTitle>
            <Spacer />
            <BrukerMeny />
        </InternalHeader>
    )
}
