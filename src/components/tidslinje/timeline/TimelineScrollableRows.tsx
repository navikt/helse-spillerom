import React, { PropsWithChildren, ReactElement } from 'react'
import { VStack } from '@navikt/ds-react'

import { useTimelineContext } from '@components/tidslinje/timeline/context'
import { TimelineDateLabels } from '@components/tidslinje/timeline/TimelineDateLabels'

export function TimelineScrollableRows({ children }: PropsWithChildren): ReactElement {
    const { width } = useTimelineContext()

    return (
        <VStack className="grow overflow-x-auto pb-4" style={{ width }}>
            <TimelineDateLabels />
            {children}
        </VStack>
    )
}
