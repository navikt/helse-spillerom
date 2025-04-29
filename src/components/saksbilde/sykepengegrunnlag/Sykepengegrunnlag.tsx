import { ReactElement } from 'react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'

interface SykepengegrunnlagProps {
    value: string
}

export function Sykepengegrunnlag({ value }: SykepengegrunnlagProps): ReactElement {
    return <SaksbildePanel value={value}>Sykepengegrunnlag</SaksbildePanel>
}
