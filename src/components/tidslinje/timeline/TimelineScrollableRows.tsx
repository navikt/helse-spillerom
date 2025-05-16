import React, { ComponentPropsWithRef, ReactElement } from 'react'
import { VStack } from '@navikt/ds-react'

import { useTimelineContext } from '@components/tidslinje/timeline/context'
import { TimelineDateLabels } from '@components/tidslinje/timeline/TimelineDateLabels'

export function TimelineScrollableRows({ ref, children }: ComponentPropsWithRef<'div'>): ReactElement {
    const { width } = useTimelineContext()

    return (
        <VStack ref={ref} className="grow overflow-x-scroll pb-4" style={{ width }}>
            <TimelineDateLabels />
            {children}
        </VStack>
    )
}
