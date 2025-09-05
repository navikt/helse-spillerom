'use client'

import { ReactElement } from 'react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { Vilkårsvurdering } from '@/components/saksbilde/vilkårsvurdering/Vilkårsvurdering'

export function VilkårsvurderingTab({ value }: { value: string }): ReactElement {
    return (
        <SaksbildePanel value={value}>
            <Vilkårsvurdering />
        </SaksbildePanel>
    )
}
