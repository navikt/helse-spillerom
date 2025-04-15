'use client'

import React, { ReactElement, useEffect } from 'react'
import { Heading } from '@navikt/ds-react'
import { useRouter } from 'next/navigation'

export function Redirect(): ReactElement {
    const router = useRouter()

    useEffect(() => {
        router.push('/person/1210841234500')
    }, [router])
    return (
        <Heading size="xsmall" level="1">
            videresender
        </Heading>
    )
}
