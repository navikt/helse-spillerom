import React, { PropsWithChildren, ReactElement, useRef, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { Popover } from '@navikt/ds-react'
import { PopoverContent } from '@navikt/ds-react/Popover'

import { Maybe } from '@utils/tsUtils'
import { useTimelineContext } from '@components/tidslinje/timeline/context'
import { cn } from '@utils/tw'
import { ComponentWithType, getNumberOfDays } from '@components/tidslinje/timeline/index'

export interface TimelinePeriodProps extends PropsWithChildren {
    startDate: Dayjs
    endDate: Dayjs
    prevPeriodTom?: Maybe<string>
    nextPeriodFom?: Maybe<string>
}

export const TimelinePeriod: ComponentWithType<TimelinePeriodProps> = ({
    startDate,
    endDate,
    prevPeriodTom,
    nextPeriodFom,
    children,
}: TimelinePeriodProps): ReactElement => {
    const { onMouseOver, onMouseOut, ...popoverProps } = usePopoverAnchor()
    const { dayLength, startDate: timelineStart } = useTimelineContext()
    const buttonRef = useRef<HTMLButtonElement>(null)
    const width = getNumberOfDays(startDate, endDate) * dayLength
    const daysFromStart = startDate.diff(timelineStart, 'day')
    const placement = daysFromStart * dayLength

    const cropLeft = nextPeriodFom && dayjs(endDate).add(1, 'day').isSame(nextPeriodFom, 'day')
    const cropRight = prevPeriodTom && dayjs(prevPeriodTom).add(1, 'day').isSame(startDate, 'day')

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
