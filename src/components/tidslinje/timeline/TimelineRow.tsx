import React, { PropsWithChildren, ReactElement } from 'react'
import { HStack } from '@navikt/ds-react'

import { useTimelineContext } from '@components/tidslinje/timeline/context'

export function TimelineRow({ children }: PropsWithChildren): ReactElement {
    const { width } = useTimelineContext()
    return (
        <HStack className="relative my-4 h-[24px] bg-surface-subtle" style={{ width }}>
            {children}
        </HStack>
    )
}
