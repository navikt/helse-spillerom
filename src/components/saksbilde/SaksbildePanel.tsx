import { PropsWithChildren, ReactElement } from 'react'
import { TabsPanel } from '@navikt/ds-react/Tabs'

export function SaksbildePanel({ value, children }: PropsWithChildren<{ value: string }>): ReactElement {
    return (
        <TabsPanel value={value} className="p-8">
            {children}
        </TabsPanel>
    )
}
