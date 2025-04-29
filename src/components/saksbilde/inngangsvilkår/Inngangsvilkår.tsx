import { ReactElement } from 'react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'

interface InngangsvilkårProps {
    value: string
}

export function Inngangsvilkår({ value }: InngangsvilkårProps): ReactElement {
    return <SaksbildePanel value={value}>Inngangsvilkår</SaksbildePanel>
}
