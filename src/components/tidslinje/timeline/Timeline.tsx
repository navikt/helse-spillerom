import React, { PropsWithChildren, ReactElement } from 'react'
import { HStack, VStack } from '@navikt/ds-react'

import { useParsedRows } from '@components/tidslinje/timeline/index'
import { TimelineRowLabels } from '@components/tidslinje/timeline/TimelineRowLabels'
import { TimelineScrollableRows } from '@components/tidslinje/timeline/TimelineScrollableRows'
import { ExpandedRowsContext, RowContext, ToggleRowContext } from '@components/tidslinje/timeline/row/context'
import { TimelineRow } from '@components/tidslinje/timeline/row/TimelineRow'
import { useExpandableRows, useTimelineState } from '@components/tidslinje/timeline/state'

import { TimelineContext } from './context'

export function Timeline({ children }: PropsWithChildren): ReactElement {
    const { rowLabels, earliestDate, latestDate, parsedRows, zoomComponent } = useParsedRows(children)
    const { expandedRows, toggleRowExpanded } = useExpandableRows()
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
            <ExpandedRowsContext.Provider value={expandedRows}>
                <ToggleRowContext.Provider value={toggleRowExpanded}>
                    <VStack gap="4" className="ignore-axe w-full border-b border-ax-border-neutral-subtle p-8 pb-4">
                        <HStack gap="2" wrap={false}>
                            <TimelineRowLabels labels={rowLabels} />
                            <TimelineScrollableRows ref={timelineScrollableContainerRef}>
                                {parsedRows.map((row, rowIndex) => (
                                    <RowContext.Provider
                                        key={rowIndex}
                                        value={{
                                            periods: row.periods,
                                            generasjonPeriodsByLevel: row.generasjonPeriodsByLevel,
                                            allPeriods: [
                                                ...row.periods,
                                                ...Array.from(row.generasjonPeriodsByLevel.values()).flat(),
                                            ],
                                            rowIndex,
                                        }}
                                    >
                                        <TimelineRow label={row.label} icon={row.icon} />
                                    </RowContext.Provider>
                                ))}
                            </TimelineScrollableRows>
                        </HStack>
                        {zoomComponent}
                    </VStack>
                </ToggleRowContext.Provider>
            </ExpandedRowsContext.Provider>
        </TimelineContext.Provider>
    )
}
