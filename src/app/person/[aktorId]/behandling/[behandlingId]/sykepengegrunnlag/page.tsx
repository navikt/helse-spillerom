'use client'

import React, { ReactElement } from 'react'

import { Sykepengegrunnlag } from '@components/sykepengegrunnlag/Sykepengegrunnlag'
import { NesteSteg } from '@components/nestesteg/NesteSteg'

export default function Page(): ReactElement {
    return (
        <>
            <Sykepengegrunnlag />
            <NesteSteg nesteFane="vilkarsvurdering" />
        </>
    )
}
