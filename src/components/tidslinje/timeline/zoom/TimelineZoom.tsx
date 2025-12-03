import { PropsWithChildren, ReactElement } from 'react'
import { HStack } from '@navikt/ds-react'

import { ComponentWithType } from '@components/tidslinje/timeline'
import { cn } from '@utils/tw'
import { useTimelineContext } from '@components/tidslinje/timeline/context'

export type ZoomLevel = '2 måneder' | '6 måneder' | '1 år' | '4 år'

export type ZoomLevels = Record<ZoomLevel, number>

export const zoomLevels: ZoomLevels = {
    '2 måneder': 60,
    '6 måneder': 180,
    '1 år': 365,
    '4 år': 365 * 4,
}

export const TimelineZoom: ComponentWithType<PropsWithChildren> = (): ReactElement => {
    const { zoomLevel, setZoomLevel, setZoomSpanInDays } = useTimelineContext()

    return (
        <HStack className="self-end rounded-sm border border-ax-border-neutral">
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
            className={cn('leading-medium border-l border-ax-border-neutral p-[6px_9px_6px_8px] first:border-l-0', {
                'cursor-pointer hover:bg-ax-bg-accent-moderate-hover': !selected,
                'bg-ax-bg-neutral-strong-pressed': selected,
            })}
        >
            <span className={cn('text-small', { 'text-ax-text-neutral-contrast': selected })}>{label}</span>
        </button>
    )
}
