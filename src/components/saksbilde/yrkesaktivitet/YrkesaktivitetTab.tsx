import { ReactElement } from 'react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { Yrkesaktivitet } from '@components/saksbilde/yrkesaktivitet/Yrkesaktivitet'

export function YrkesaktivitetTab({ value }: { value: string }): ReactElement {
    return (
        <SaksbildePanel value={value}>
            <Yrkesaktivitet />
        </SaksbildePanel>
    )
}
