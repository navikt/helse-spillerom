import React, { PropsWithChildren, ReactElement } from 'react'
import { HStack } from '@navikt/ds-react'

import { useTimelineContext } from '@components/tidslinje/timeline/context'
import { ComponentWithType } from '@components/tidslinje/timeline/index'

export interface TimelineRowProps extends PropsWithChildren {
    label: string
}

export const TimelineRow: ComponentWithType<TimelineRowProps> = ({ children }: TimelineRowProps): ReactElement => {
    const { width } = useTimelineContext()
    return (
        <HStack className="relative my-4 h-[24px] bg-surface-subtle" style={{ width }}>
            {children}
        </HStack>
    )
}

TimelineRow.componentType = 'TimelineRow'
