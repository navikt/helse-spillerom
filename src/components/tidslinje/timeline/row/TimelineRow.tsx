import React, { PropsWithChildren, ReactElement } from 'react'
import { HStack } from '@navikt/ds-react'

import { useTimelineContext } from '@components/tidslinje/timeline/context'
import { ComponentWithType } from '@components/tidslinje/timeline'
import { useRowContext } from '@components/tidslinje/timeline/row/context'
import { TimelinePeriod } from '@components/tidslinje/timeline/period/TimelinePeriod'
import { PeriodContext } from '@components/tidslinje/timeline/period/context'

export interface TimelineRowProps extends PropsWithChildren {
    label: string
}

export const TimelineRow: ComponentWithType<TimelineRowProps> = (): ReactElement => {
    const { width } = useTimelineContext()
    const { periods } = useRowContext()

    return (
        <HStack className="relative my-4 h-[24px] grow bg-ax-bg-accent-soft" style={{ width }}>
            {periods.map((period) => (
                <PeriodContext.Provider
                    key={period.id}
                    value={{
                        periodId: period.id,
                    }}
                >
                    <TimelinePeriod
                        startDate={period.startDate}
                        endDate={period.endDate}
                        skjæringstidspunkt={period.skjæringstidspunkt}
                        icon={period.icon}
                        status={period.status}
                    />
                </PeriodContext.Provider>
            ))}
        </HStack>
    )
}

TimelineRow.componentType = 'TimelineRow'
