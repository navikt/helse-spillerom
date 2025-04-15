'use client'

import React, { ReactElement } from 'react'

import { Inntektsforhold } from '@components/inntektsforhold/Inntektsforhold'
import { NesteSteg } from '@components/nestesteg/NesteSteg'

export default function Page(): ReactElement {
    return (
        <>
            <Inntektsforhold />
            <NesteSteg nesteFane="inngangsvilkaar" />
        </>
    )
}
