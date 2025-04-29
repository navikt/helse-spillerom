import React, { ReactElement } from 'react'
import NextLink from 'next/link'
import { InternalHeader, Spacer } from '@navikt/ds-react'
import { InternalHeaderTitle } from '@navikt/ds-react/InternalHeader'

import { BrukerMeny } from '@components/header/BrukerMeny'
import { SystemMeny } from '@components/systemmeny/SystemMeny'
import { Personsøk } from '@components/personsøk/Personsøk'

export function Header(): ReactElement {
    return (
        <InternalHeader
            className="h-14"
            style={
                {
                    '--ac-internalheader-hover-bg': 'var(--a-blue-700)',
                    '--ac-internalheader-bg': 'var(--a-blue-800)',
                    '--ac-internalheader-active-bg': 'var(--a-blue-600)',
                } as React.CSSProperties
            }
        >
            <InternalHeaderTitle as={NextLink} href="/">
                Spillerom
            </InternalHeaderTitle>
            <Personsøk size="small" variant="secondary" hideLabel />
            <Spacer />
            <SystemMeny />
            <BrukerMeny />
        </InternalHeader>
    )
}
