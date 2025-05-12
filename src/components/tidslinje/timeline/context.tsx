import { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { Dayjs } from 'dayjs'

import { Maybe } from '@utils/tsUtils'

type TimelineContextType = {
    startDate: Dayjs
    setStartDate: Dispatch<SetStateAction<Dayjs>>
    endDate: Dayjs
    setEndDate: Dispatch<SetStateAction<Dayjs>>
    width: number
    setWidth: Dispatch<SetStateAction<number>>
    dayLength: number
    setDayLength: Dispatch<SetStateAction<number>>
}

export const TimelineContext = createContext<Maybe<TimelineContextType>>(null)

export function useTimelineContext(): TimelineContextType {
    const context = useContext(TimelineContext)
    if (!context) {
        throw new Error('useTimelineContext must be used within a TimelineContext.Provider')
    }
    return context
}
