import React, { PropsWithChildren, ReactElement, useState } from 'react'
import { Dayjs } from 'dayjs'
import { HStack, VStack } from '@navikt/ds-react'

import { getNumberOfDays, useParsedRows } from '@components/tidslinje/timeline/index'
import { TimelineRowLabels } from '@components/tidslinje/timeline/TimelineRowLabels'
import { TimelineScrollableRows } from '@components/tidslinje/timeline/TimelineScrollableRows'

import { TimelineContext } from './context'

export function Timeline({ children }: PropsWithChildren): ReactElement {
    const { rowLabels, earliestDate, latestDate } = useParsedRows(children)

    const [startDate, setStartDate] = useState<Dayjs>(earliestDate)
    const [endDate, setEndDate] = useState<Dayjs>(latestDate)
    const [dayLength, setDayLength] = useState<number>(8)
    const [width, setWidth] = useState<number>(getNumberOfDays(startDate, endDate) * dayLength)

    return (
        <TimelineContext.Provider
            value={{
                startDate,
                setStartDate,
                endDate,
                setEndDate,
                width,
                setWidth,
                dayLength,
                setDayLength,
            }}
        >
            <VStack className="w-full border-b-1 border-border-divider p-8">
                <HStack gap="2" wrap={false}>
                    <TimelineRowLabels labels={rowLabels} />
                    <TimelineScrollableRows>{children}</TimelineScrollableRows>
                </HStack>
            </VStack>
        </TimelineContext.Provider>
    )
}
