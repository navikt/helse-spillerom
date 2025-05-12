import React, { PropsWithChildren, ReactElement, useRef, useState } from 'react'
import { Dayjs } from 'dayjs'
import { Popover } from '@navikt/ds-react'
import { PopoverContent } from '@navikt/ds-react/Popover'

import { Maybe } from '@utils/tsUtils'
import { useTimelineContext } from '@components/tidslinje/timeline/context'
import { cn } from '@utils/tw'
import { ComponentWithType, getNumberOfDays } from '@components/tidslinje/timeline'
import { useRowContext } from '@components/tidslinje/timeline/row/context'
import { usePeriodContext } from '@components/tidslinje/timeline/period/context'

export interface TimelinePeriodProps extends PropsWithChildren {
    startDate: Dayjs
    endDate: Dayjs
}

export const TimelinePeriod: ComponentWithType<TimelinePeriodProps> = (): ReactElement => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const { onMouseOver, onMouseOut, ...popoverProps } = usePopoverAnchor()
    const { dayLength, startDate: timelineStart } = useTimelineContext()
    const { periods } = useRowContext()
    const { periodId } = usePeriodContext()

    const period = periods.find((p) => p.id === periodId)
    if (!period) return <></>
    const { startDate, endDate, cropLeft, cropRight, children } = period

    // TODO ordne bredde og plassering et annet sted
    const width = getNumberOfDays(startDate, endDate) * dayLength
    const daysFromStart = startDate.diff(timelineStart, 'day')
    const placement = daysFromStart * dayLength

    return (
        <>
            <button
                className={cn(
                    'absolute h-[24px] rounded-full border-1 border-border-success bg-surface-success-subtle hover:cursor-pointer hover:bg-surface-success-subtle-hover',
                    {
                        'rounded-l-none': cropLeft,
                        'rounded-r-none': cropRight,
                    },
                )}
                style={{ right: placement, width }}
                ref={buttonRef}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
            />
            <Popover strategy="fixed" {...popoverProps}>
                <PopoverContent>{children}</PopoverContent>
            </Popover>
        </>
    )
}

TimelinePeriod.componentType = 'TimelinePeriod'

type PopoverAnchor = {
    anchorEl: Maybe<HTMLElement>
    open: boolean
    onClose: () => void
    onMouseOver: (event: React.MouseEvent<HTMLElement>) => void
    onMouseOut: (event: React.MouseEvent<HTMLElement>) => void
}

function usePopoverAnchor(): PopoverAnchor {
    const [anchor, setAnchor] = useState<Maybe<HTMLElement>>(null)

    const assignAnchor = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(event.currentTarget)
    }

    const removeAnchor = () => {
        setAnchor(null)
    }

    return {
        anchorEl: anchor,
        open: anchor !== null,
        onClose: removeAnchor,
        onMouseOver: assignAnchor,
        onMouseOut: removeAnchor,
    }
}
