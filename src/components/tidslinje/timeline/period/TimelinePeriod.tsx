import React, { PropsWithChildren, ReactElement, RefObject, useEffect, useRef, useState } from 'react'
import { Dayjs } from 'dayjs'
import { Popover } from '@navikt/ds-react'
import { PopoverContent } from '@navikt/ds-react/Popover'

import { useTimelineContext } from '@components/tidslinje/timeline/context'
import { cn } from '@utils/tw'
import { ComponentWithType, getNumberOfDays } from '@components/tidslinje/timeline'
import { useRowContext } from '@components/tidslinje/timeline/row/context'
import { usePeriodContext } from '@components/tidslinje/timeline/period/context'
import { usePopoverAnchor } from '@components/tidslinje/timeline/period/usePopoverAnchor'
import { Maybe } from '@/utils/tsUtils'

export interface TimelinePeriodProps extends PropsWithChildren {
    startDate: Dayjs
    endDate: Dayjs
    activePeriod?: boolean
    onSelectPeriod?: () => void
    icon: ReactElement
    status: string
}

export const TimelinePeriod: ComponentWithType<TimelinePeriodProps> = (): ReactElement => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const { onMouseOver, onMouseOut, ...popoverProps } = usePopoverAnchor()
    const { dayLength, endDate: timelineEnd } = useTimelineContext()
    const { periods } = useRowContext()
    const { periodId } = usePeriodContext()
    const showIcon = useIsWiderThan(buttonRef, 32)

    const period = periods.find((p) => p.id === periodId)
    if (!period) return <></>
    const { startDate, endDate, cropLeft, cropRight, isActive, onSelectPeriod, icon, status, children } = period

    // TODO ordne bredde og plassering et annet sted
    const width = getNumberOfDays(startDate, endDate) * dayLength
    const daysFromEnd = timelineEnd.diff(endDate, 'day')
    const placement = daysFromEnd * dayLength

    return (
        <>
            <button
                className={cn(
                    'absolute h-[24px] rounded-full hover:cursor-pointer',
                    {
                        'rounded-l-none': cropLeft,
                        'rounded-r-none': cropRight,
                        'navds-timeline__period--selected': isActive,
                    },
                    periodColors[status],
                )}
                style={{ left: placement, width }}
                ref={buttonRef}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={() => onSelectPeriod?.()}
            >
                {showIcon && <span className={cn('navds-timeline__period--inner', iconColors[status])}>{icon}</span>}
            </button>
            <Popover strategy="fixed" {...popoverProps}>
                <PopoverContent>{children}</PopoverContent>
            </Popover>
        </>
    )
}

TimelinePeriod.componentType = 'TimelinePeriod'

// TODO utvide - avhengig av hvordan "behandling" blir seendes ut, og hvilke statuser vi ser for oss
const iconColors: Record<string, string> = {
    test: 'text-icon-default',
    utbetalt: 'text-border-success',
}

// TODO utvide - avhengig av hvordan "behandling" blir seendes ut, og hvilke statuser vi ser for oss
const periodColors: Record<string, string> = {
    test: 'navds-timeline__period--neutral hover:bg-surface-neutral-subtle-hover',
    utbetalt: 'navds-timeline__period--success hover:bg-surface-success-subtle-hover',
}

const useIsWiderThan = (ref: RefObject<Maybe<HTMLElement>>, targetWidth: number) => {
    const [isWider, setIsWider] = useState(false)

    useEffect(() => {
        if (!ref.current) return

        const observer = new ResizeObserver(([entry]) => {
            setIsWider(entry.contentRect.width >= targetWidth)
        })

        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [ref, targetWidth])

    return isWider
}
