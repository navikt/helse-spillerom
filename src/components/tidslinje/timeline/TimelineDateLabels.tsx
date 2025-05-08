import { Dayjs } from 'dayjs'
import React, { ReactElement } from 'react'
import { HStack } from '@navikt/ds-react'

import { useTimelineContext } from '@components/tidslinje/timeline/context'

export function TimelineDateLabels(): ReactElement {
    const { startDate, endDate, width, dayLength } = useTimelineContext()

    const months = generateMonthsBetween(startDate, endDate)

    return (
        <HStack className="relative h-[20px] text-small text-text-subtle" justify="space-between" style={{ width }}>
            {months.map((month, i) => {
                const daysFromEnd = endDate.diff(month, 'day')
                const placement = daysFromEnd * dayLength

                return (
                    <span key={i} className="absolute -translate-x-full whitespace-nowrap" style={{ left: placement }}>
                        {month.format('MMM YY')}
                    </span>
                )
            })}
        </HStack>
    )
}

function generateMonthsBetween(start: Dayjs, end: Dayjs): Dayjs[] {
    const months: Dayjs[] = []
    let current = start.startOf('month')

    while (current.isBefore(end)) {
        months.push(current)
        current = current.add(1, 'month')
    }

    return months
}
