import React, { PropsWithChildren, ReactElement, RefObject, useEffect, useRef, useState } from 'react'
import { Dayjs } from 'dayjs'
import { HStack, VStack } from '@navikt/ds-react'

import { getNumberOfDays, useParsedRows } from '@components/tidslinje/timeline/index'
import { TimelineRowLabels } from '@components/tidslinje/timeline/TimelineRowLabels'
import { TimelineScrollableRows } from '@components/tidslinje/timeline/TimelineScrollableRows'
import { RowContext } from '@components/tidslinje/timeline/row/context'
import { TimelineRow } from '@components/tidslinje/timeline/row/TimelineRow'
import { Maybe } from '@utils/tsUtils'
import { ZoomLevel, zoomLevels } from '@components/tidslinje/timeline/TimelineZoom'

import { TimelineContext } from './context'

export function Timeline({ children }: PropsWithChildren): ReactElement {
    const timelineScrollableContainerRef = useRef<HTMLDivElement>(null)
    const { rowLabels, earliestDate, latestDate, parsedRows, zoomComponent } = useParsedRows(children)

    const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('6 måneder')
    const [zoomSpanInDays, setZoomSpanInDays] = useState<number>(zoomLevels[zoomLevel])
    const [startDate, setStartDate] = useState<Dayjs>(earliestDate)
    const [endDate, setEndDate] = useState<Dayjs>(latestDate)
    const [dayLength, setDayLength] = useState<number>(0)
    const [width, setWidth] = useState<number>(0)

    const containerWidth = useResizeObserver(timelineScrollableContainerRef)
    useEffect(() => {
        if (!containerWidth) return
        const pxPerDay = containerWidth / zoomSpanInDays
        const numberOfDaysBetweenPeriods = getNumberOfDays(startDate, endDate)
        const timelineStartDate = endDate.subtract(zoomSpanInDays - 1, 'day')

        if (containerWidth > numberOfDaysBetweenPeriods * pxPerDay) {
            setStartDate(timelineStartDate)
        }

        const numberOfDaysInTimeline =
            containerWidth > numberOfDaysBetweenPeriods * pxPerDay
                ? getNumberOfDays(timelineStartDate, endDate)
                : numberOfDaysBetweenPeriods

        setDayLength(pxPerDay)
        setWidth(numberOfDaysInTimeline * pxPerDay)
    }, [containerWidth, zoomSpanInDays, startDate, endDate, setDayLength, setWidth])

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

function useResizeObserver(ref: RefObject<Maybe<HTMLElement>>) {
    const [width, setWidth] = useState(0)

    useEffect(() => {
        if (!ref.current) return

        const observer = new ResizeObserver(([entry]) => {
            setWidth(entry.contentRect.width)
        })

        observer.observe(ref.current)

        return () => observer.disconnect()
    }, [ref])

    return width
}
