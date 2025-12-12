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

export type TimelineVariant =
    | 'behandles'
    | 'godkjent'
    | 'ingen_utbetaling'
    | 'revurdert'
    | 'ghost'
    | 'tilkommen_inntekt'

export interface TimelinePeriodProps extends PropsWithChildren {
    startDate: Dayjs
    endDate: Dayjs
    skjæringstidspunkt?: Dayjs
    activePeriod?: boolean
    onSelectPeriod?: () => void
    icon?: ReactElement
    variant: TimelineVariant
    generasjonIndex?: number
}

export const TimelinePeriod: ComponentWithType<TimelinePeriodProps> = (): ReactElement => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const { onMouseOver, onMouseOut, ...popoverProps } = usePopoverAnchor()
    const { dayLength, endDate: timelineEnd } = useTimelineContext()
    const { allPeriods } = useRowContext()
    const { periodId } = usePeriodContext()
    const showIcon = useIsWiderThan(buttonRef, 32)

    const period = allPeriods.find((p) => p.id === periodId)

    if (!period) return <></>

    const { startDate, endDate, cropLeft, cropRight, isActive, onSelectPeriod, icon, variant, children } = period

    // TODO ordne bredde og plassering et annet sted
    const width = getNumberOfDays(startDate, endDate) * dayLength
    const daysFromEnd = timelineEnd.diff(endDate, 'day')
    const placement = daysFromEnd * dayLength

    return (
        <>
            <button
                data-period-variant={variant}
                className={cn(
                    'aksel-timeline__period--clickable aksel-timeline__period absolute h-[24px] rounded-full',
                    {
                        'rounded-l-none': cropLeft,
                        'rounded-r-none': cropRight,
                        'border-ax-border-accent-strong inset-ring-1 inset-ring-ax-border-accent-strong': isActive,
                    },
                )}
                style={{ left: placement, width }}
                ref={buttonRef}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={() => onSelectPeriod?.()}
            >
                {showIcon && <span className={cn('aksel-timeline__period--inner')}>{icon}</span>}
            </button>
            <Popover strategy="fixed" {...popoverProps}>
                <PopoverContent>{children}</PopoverContent>
            </Popover>
        </>
    )
}

TimelinePeriod.componentType = 'TimelinePeriod'

const useIsWiderThan = (ref: RefObject<HTMLElement | null>, targetWidth: number) => {
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
