import React, { PropsWithChildren, ReactElement } from 'react'
import { HStack, VStack } from '@navikt/ds-react'

import { useParsedRows } from '@components/tidslinje/timeline/index'
import { TimelineRowLabels } from '@components/tidslinje/timeline/TimelineRowLabels'
import { TimelineScrollableRows } from '@components/tidslinje/timeline/TimelineScrollableRows'
import { RowContext } from '@components/tidslinje/timeline/row/context'
import { TimelineRow } from '@components/tidslinje/timeline/row/TimelineRow'
import { useTimelineState } from '@components/tidslinje/timeline/state'

import { TimelineContext } from './context'

export function Timeline({ children }: PropsWithChildren): ReactElement {
    const { rowLabels, earliestDate, latestDate, parsedRows, zoomComponent } = useParsedRows(children)
    const {
        startDate,
        endDate,
        width,
        dayLength,
        zoomLevel,
        setZoomLevel,
        setZoomSpanInDays,
        timelineScrollableContainerRef,
    } = useTimelineState(earliestDate, latestDate)

    return (
        <TimelineContext.Provider
            value={{
                startDate,
                endDate,
                width,
                dayLength,
                zoomLevel,
                setZoomLevel,
                setZoomSpanInDays,
            }}
        >
            <VStack gap="4" className="ignore-axe w-full border-b-1 border-border-divider p-8 pb-4">
                <HStack gap="2" wrap={false}>
                    <TimelineRowLabels labels={rowLabels} />
                    <TimelineScrollableRows ref={timelineScrollableContainerRef}>
                        {parsedRows.map((row, i) => (
                            <RowContext.Provider
                                key={i}
                                value={{
                                    periods: row.periods,
                                }}
                            >
                                <TimelineRow label={row.label} />
                            </RowContext.Provider>
                        ))}
                    </TimelineScrollableRows>
                </HStack>
                {zoomComponent}
            </VStack>
        </TimelineContext.Provider>
    )
}
