import { ReactElement } from 'react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'

interface StartBehandlingProps {
    value: string
}

export function StartBehandling({ value }: StartBehandlingProps): ReactElement {
    return <SaksbildePanel value={value}>Saksbilde</SaksbildePanel>
}
