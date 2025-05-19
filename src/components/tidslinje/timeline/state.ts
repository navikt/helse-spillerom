import { Dayjs } from 'dayjs'
import { RefObject, useEffect, useRef, useState } from 'react'

import { ZoomLevel, zoomLevels } from '@components/tidslinje/timeline/zoom/TimelineZoom'
import { Maybe } from '@utils/tsUtils'
import { getNumberOfDays } from '@components/tidslinje/timeline/index'

export function useTimelineState(earliestDate: Dayjs, latestDate: Dayjs) {
    const timelineScrollableContainerRef = useRef<HTMLDivElement>(null)
    const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('6 måneder')
    const [zoomSpanInDays, setZoomSpanInDays] = useState<number>(zoomLevels[zoomLevel])
    const [startDate, setStartDate] = useState<Dayjs>(earliestDate)
    const [dayLength, setDayLength] = useState<number>(0)
    const [width, setWidth] = useState<number>(0)

    const containerWidth = useResizeObserver(timelineScrollableContainerRef)
    useEffect(() => {
        if (!containerWidth) return
        const pxPerDay = containerWidth / zoomSpanInDays
        const numberOfDaysBetweenPeriods = getNumberOfDays(earliestDate, latestDate)
        const timelineStartDate = latestDate.subtract(zoomSpanInDays - 1, 'day')

        if (containerWidth > numberOfDaysBetweenPeriods * pxPerDay) {
            setStartDate(timelineStartDate)
        } else {
            setStartDate(earliestDate)
        }

        const numberOfDaysInTimeline =
            containerWidth > numberOfDaysBetweenPeriods * pxPerDay
                ? getNumberOfDays(timelineStartDate, latestDate)
                : numberOfDaysBetweenPeriods

        setDayLength(pxPerDay)
        setWidth(numberOfDaysInTimeline * pxPerDay)
    }, [containerWidth, zoomSpanInDays, earliestDate, latestDate, setDayLength, setWidth])

    return {
        startDate,
        endDate: latestDate,
        width,
        dayLength,
        zoomLevel,
        setZoomLevel,
        setZoomSpanInDays,
        timelineScrollableContainerRef,
    }
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
