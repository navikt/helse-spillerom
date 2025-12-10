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
import { BehandlingStatus } from '@schemas/behandling'

export type TidslinjeVariant = BehandlingStatus | 'GHOST' | 'TILKOMMEN_INNTEKT'

export interface TimelinePeriodProps extends PropsWithChildren {
    startDate: Dayjs
    endDate: Dayjs
    skjæringstidspunkt?: Dayjs
    activePeriod?: boolean
    onSelectPeriod?: () => void
    icon?: ReactElement
    variant: TidslinjeVariant
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
                data-color={statusTilDataColor[variant]}
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

export const statusTilDataColor: Record<TidslinjeVariant, string> = {
    UNDER_BEHANDLING: 'warning',
    TIL_BESLUTNING: 'warning',
    UNDER_BESLUTNING: 'warning',
    GODKJENT: 'success',
    REVURDERT: 'error',
    GHOST: 'neutral',
    TILKOMMEN_INNTEKT: 'info',
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
