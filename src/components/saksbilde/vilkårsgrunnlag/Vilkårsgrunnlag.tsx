import { ReactElement } from 'react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'

interface VilkårsgrunnlagProps {
    value: string
}

export function Vilkårsgrunnlag({ value }: VilkårsgrunnlagProps): ReactElement {
    return <SaksbildePanel value={value}>Vilkårsgrunnlag</SaksbildePanel>
}
