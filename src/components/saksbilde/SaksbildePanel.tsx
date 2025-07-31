import { PropsWithChildren, ReactElement } from 'react'
import { TabsPanel } from '@navikt/ds-react/Tabs'

import { cn } from '@utils/tw'

export function SaksbildePanel({
    value,
    className,
    children,
}: PropsWithChildren<{ value: string; className?: string }>): ReactElement {
    return (
        <TabsPanel value={value} className={cn('p-8', className)}>
            {children}
        </TabsPanel>
    )
}
