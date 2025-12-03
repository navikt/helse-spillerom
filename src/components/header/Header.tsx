import React, { ReactElement } from 'react'
import { InternalHeader, Spacer } from '@navikt/ds-react'

import { BrukerMeny } from '@components/header/brukermeny/BrukerMeny'
import { SystemMeny } from '@components/header/systemmeny/SystemMeny'
import { Personsøk } from '@components/personsøk/Personsøk'
import { UtviklingMeny } from '@components/header/utvikling/UtviklingMeny'
import { AkselNextInternalHeaderLink } from '@components/header/AkselNextInternalHeaderLink'

export function Header(): ReactElement {
    return (
        <InternalHeader className="h-14">
            <AkselNextInternalHeaderLink href="/">Spillerom</AkselNextInternalHeaderLink>
            <Personsøk />
            <Spacer />
            <UtviklingMeny />
            <SystemMeny />
            <BrukerMeny />
        </InternalHeader>
    )
}
