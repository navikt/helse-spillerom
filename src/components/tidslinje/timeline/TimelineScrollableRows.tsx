import React, { ComponentPropsWithRef, ReactElement } from 'react'
import { VStack } from '@navikt/ds-react'

import { useTimelineContext } from '@components/tidslinje/timeline/context'
import { TimelineDateLabels } from '@components/tidslinje/timeline/TimelineDateLabels'

export function TimelineScrollableRows({ ref, children }: ComponentPropsWithRef<'div'>): ReactElement {
    const { width } = useTimelineContext()

    return (
        <VStack ref={ref} className="relative -mx-2 grow overflow-x-scroll px-2 pb-4" style={{ width }}>
            <TimelineDateLabels />
            {children}
        </VStack>
    )
}
