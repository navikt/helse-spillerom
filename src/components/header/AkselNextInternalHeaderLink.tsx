'use client'

import NextLink from 'next/link'
import { InternalHeaderTitle } from '@navikt/ds-react/InternalHeader'
import React, { PropsWithChildren, ReactElement } from 'react'

export function AkselNextInternalHeaderLink({ href, children }: PropsWithChildren<{ href: string }>): ReactElement {
    return (
        <InternalHeaderTitle as={NextLink} href={href}>
            {children}
        </InternalHeaderTitle>
    )
}
