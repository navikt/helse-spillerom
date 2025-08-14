'use client'

import { ReactElement } from 'react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { VilkårsvurderingV2 } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingV2'

export function VilkårsvurderingTabs({ value }: { value: string }): ReactElement {
    return (
        <SaksbildePanel value={value}>
            <VilkårsvurderingV2 />
        </SaksbildePanel>
    )
}
