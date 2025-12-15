import React, { PropsWithChildren, ReactElement } from 'react'
import { HStack, VStack } from '@navikt/ds-react'

import { useTimelineContext } from '@components/tidslinje/timeline/context'
import { ComponentWithType } from '@components/tidslinje/timeline'
import { useExpandedRows, useRowContext } from '@components/tidslinje/timeline/row/context'
import { TimelinePeriod } from '@components/tidslinje/timeline/period/TimelinePeriod'
import { PeriodContext } from '@components/tidslinje/timeline/period/context'

export interface TimelineRowProps extends PropsWithChildren {
    label: string
    icon: ReactElement
    copyLabelButton?: boolean
}

export const TimelineRow: ComponentWithType<TimelineRowProps> = (): ReactElement => {
    const { width } = useTimelineContext()
    const expandedRows = useExpandedRows()
    const { periods, generasjonPeriodsByLevel, rowIndex } = useRowContext()

    return (
        <VStack className="my-4 bg-ax-bg-accent-soft" gap="2" style={{ width }}>
            <HStack className="relative h-[24px]">
                {periods.map((period) => (
                    <PeriodContext.Provider key={period.id} value={{ periodId: period.id }}>
                        <TimelinePeriod
                            startDate={period.startDate}
                            endDate={period.endDate}
                            skjæringstidspunkt={period.skjæringstidspunkt}
                            icon={period.icon}
                            variant={period.variant}
                        />
                    </PeriodContext.Provider>
                ))}
            </HStack>

            {expandedRows.has(rowIndex) &&
                Array.from(generasjonPeriodsByLevel.entries()).map(([level, levelPeriods]) => (
                    <HStack key={`gen-level-${level}`} className="relative h-[24px]">
                        {levelPeriods.map((period) => (
                            <PeriodContext.Provider key={period.id} value={{ periodId: period.id }}>
                                <TimelinePeriod
                                    startDate={period.startDate}
                                    endDate={period.endDate}
                                    skjæringstidspunkt={period.skjæringstidspunkt}
                                    icon={period.icon}
                                    variant={period.variant}
                                />
                            </PeriodContext.Provider>
                        ))}
                    </HStack>
                ))}
        </VStack>
    )
}

TimelineRow.componentType = 'TimelineRow'
