'use client'

import React, { ReactElement } from 'react'
import { Heading } from '@navikt/ds-react'

export function HelloWorld(): ReactElement {
    return (
        <Heading size="xlarge" level="1">
            Hello World
        </Heading>
    )
}
