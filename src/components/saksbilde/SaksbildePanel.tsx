import { PropsWithChildren, ReactElement } from 'react'
import { TabsPanel } from '@navikt/ds-react/Tabs'

export interface SaksbildePanelProps extends PropsWithChildren {
    value: string
}

export function SaksbildePanel({ value, children }: SaksbildePanelProps): ReactElement {
    return (
        <TabsPanel value={value} className="p-8">
            {children}
        </TabsPanel>
    )
}
