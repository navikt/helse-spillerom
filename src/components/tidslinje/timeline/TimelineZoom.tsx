import { PropsWithChildren, ReactElement } from 'react'
import { HStack } from '@navikt/ds-react'

import { ComponentWithType } from '@components/tidslinje/timeline/index'
import { cn } from '@utils/tw'
import { useTimelineContext } from '@components/tidslinje/timeline/context'

export interface TimelineZoomProps extends PropsWithChildren {}

export type ZoomLevel = '2 måneder' | '6 måneder' | '1 år' | '4 år'

export type ZoomLevels = Record<ZoomLevel, number>

export const zoomLevels: ZoomLevels = {
    '2 måneder': 60,
    '6 måneder': 180,
    '1 år': 365,
    '4 år': 365 * 4,
}

export const TimelineZoom: ComponentWithType<TimelineZoomProps> = (): ReactElement => {
    const { zoomLevel, setZoomLevel, setZoomSpanInDays } = useTimelineContext()

    return (
        <HStack className="self-end rounded-sm border-1">
            {(Object.keys(zoomLevels) as ZoomLevel[]).map((label) => (
                <TimelineZoomButton
                    key={label}
                    label={label}
                    selected={label === zoomLevel}
                    onSelect={() => {
                        setZoomLevel(label)
                        setZoomSpanInDays(zoomLevels[label])
                    }}
                />
            ))}
        </HStack>
    )
}

TimelineZoom.componentType = 'TimelineZoom'

type TimelineZoomButtonProps = {
    label: string
    selected: boolean
    onSelect: () => void
}

function TimelineZoomButton({ label, selected, onSelect }: TimelineZoomButtonProps): ReactElement {
    return (
        <button
            onClick={onSelect}
            className={cn('border-l p-[6px_9px_6px_8px] leading-medium first:border-l-0', {
                'cursor-pointer hover:bg-surface-action-subtle-hover': !selected,
                'bg-surface-inverted text-text-on-inverted': selected,
            })}
        >
            <span className="text-small">{label}</span>
        </button>
    )
}
