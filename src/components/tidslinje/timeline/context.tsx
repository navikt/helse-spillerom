import { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { Dayjs } from 'dayjs'

import { Maybe } from '@utils/tsUtils'
import { ZoomLevel } from '@components/tidslinje/timeline/zoom/TimelineZoom'

type TimelineContextType = {
    startDate: Dayjs
    endDate: Dayjs
    width: number
    dayLength: number
    zoomLevel: ZoomLevel
    setZoomLevel: Dispatch<SetStateAction<ZoomLevel>>
    setZoomSpanInDays: Dispatch<SetStateAction<number>>
}

export const TimelineContext = createContext<Maybe<TimelineContextType>>(null)

export function useTimelineContext(): TimelineContextType {
    const context = useContext(TimelineContext)
    if (!context) {
        throw new Error('useTimelineContext must be used within a TimelineContext.Provider')
    }
    return context
}
