import { Dayjs } from 'dayjs'
import { RefObject, useEffect, useRef, useState } from 'react'

import { ZoomLevel, zoomLevels } from '@components/tidslinje/timeline/zoom/TimelineZoom'
import { Maybe } from '@utils/tsUtils'
import { getNumberOfDays } from '@components/tidslinje/timeline/index'

export function useTimelineState(earliestDate: Dayjs, latestDate: Dayjs) {
    const timelineScrollableContainerRef = useRef<HTMLDivElement>(null)
    const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('6 måneder')
    const [zoomSpanInDays, setZoomSpanInDays] = useState<number>(zoomLevels[zoomLevel])

    const containerWidth = useResizeObserver(timelineScrollableContainerRef)

    const pxPerDay = containerWidth ? containerWidth / zoomSpanInDays : 0
    const numberOfDaysBetweenPeriods = getNumberOfDays(earliestDate, latestDate)
    const timelineStartDate = latestDate.subtract(zoomSpanInDays - 1, 'day')

    const fitsInContainer = containerWidth ? containerWidth > numberOfDaysBetweenPeriods * pxPerDay : false

    const startDate = fitsInContainer ? timelineStartDate : earliestDate

    const numberOfDaysInTimeline = fitsInContainer
        ? getNumberOfDays(timelineStartDate, latestDate)
        : numberOfDaysBetweenPeriods

    const dayLength = pxPerDay
    const width = numberOfDaysInTimeline * pxPerDay

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
