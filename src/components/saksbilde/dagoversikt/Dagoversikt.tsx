import { ReactElement } from 'react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { VilkårsvurderingDebug } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingDebug'

interface DagoversiktProps {
    value: string
}

export function Dagoversikt({ value }: DagoversiktProps): ReactElement {
    return (
        <SaksbildePanel value={value}>
            <VilkårsvurderingDebug />
        </SaksbildePanel>
    )
}
