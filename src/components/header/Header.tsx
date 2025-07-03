import React, { ReactElement } from 'react'
import NextLink from 'next/link'
import { InternalHeader, Spacer } from '@navikt/ds-react'
import { InternalHeaderTitle } from '@navikt/ds-react/InternalHeader'

import { BrukerMeny } from '@components/header/brukermeny/BrukerMeny'
import { SystemMeny } from '@components/header/systemmeny/SystemMeny'
import { Personsøk } from '@components/personsøk/Personsøk'

export function Header(): ReactElement {
    return (
        <InternalHeader className="h-header">
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
