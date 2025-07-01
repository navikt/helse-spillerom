import dayjs, { Dayjs } from 'dayjs'
import React, { ReactElement, ReactNode, useMemo } from 'react'

import { TimelineRowProps } from '@components/tidslinje/timeline/row/TimelineRow'
import { TimelinePeriodProps } from '@components/tidslinje/timeline/period/TimelinePeriod'
import { TimelineZoomProps } from '@components/tidslinje/timeline/zoom/TimelineZoom'

export interface ComponentWithType<P = unknown> extends React.FC<P> {
    componentType: string
}

type Period = {
    id: string
    children: ReactNode
    isActive?: boolean
    onSelectPeriod?: () => void
    startDate: Dayjs
    endDate: Dayjs
    icon?: ReactElement
    status: string // finne ut hvilke statuser vi skal ha på behandlinger
    cropLeft: boolean
    cropRight: boolean
}

type ParsedRowsResult = {
    rowLabels: string[]
    earliestDate: Dayjs
    latestDate: Dayjs
    parsedRows: ParsedRow[]
    zoomComponent: ReactNode
}

export function useParsedRows(children: ReactNode): ParsedRowsResult {
    const rowChildren: ReactElement<TimelineRowProps>[] = React.Children.toArray(children).filter(
        (child: ReactNode) =>
            React.isValidElement(child) && (child.type as ComponentWithType).componentType === 'TimelineRow',
    ) as ReactElement<TimelineRowProps>[]

    const zoomComponent: ReactElement<TimelineZoomProps>[] = React.Children.toArray(children).filter(
        (child: ReactNode) =>
            React.isValidElement(child) && (child.type as ComponentWithType).componentType === 'TimelineZoom',
    ) as ReactElement<TimelineZoomProps>[]

    const parsedRows = useMemo(() => {
        return parseRows(rowChildren)
    }, [rowChildren])

    const rowLabels = parsedRows.map((row) => row.label)
    const allPeriods = parsedRows.map((row) => row.periods).flat()

    const earliestDate = useEarliestDate(allPeriods) ?? dayjs().subtract(1, 'year')
    const latestDate = useLatestDate(allPeriods) ?? dayjs().add(1, 'month')

    return { rowLabels, earliestDate, latestDate, parsedRows, zoomComponent }
}

export type ParsedRow = {
    label: string
    periods: Period[]
}

export function parseRows(rows: ReactElement<TimelineRowProps>[]): ParsedRow[] {
    const parsedRow: ParsedRow[] = []
    rows.forEach((row, rowIndex) => {
        const periods: ParsedRow['periods'] = []
        const periodChildren: ReactElement<TimelinePeriodProps>[] = React.Children.toArray(row.props.children).filter(
            (child: ReactNode) =>
                React.isValidElement(child) && (child.type as ComponentWithType).componentType === 'TimelinePeriod',
        ) as ReactElement<TimelinePeriodProps>[]

        periodChildren.forEach((period, periodIndex) => {
            const startDate = period.props.startDate
            const endDate = period.props.endDate
            const prevPeriodEndDate = periodChildren[periodIndex - 1]?.props.endDate
            const nextPeriodStartDate = periodChildren[periodIndex + 1]?.props.startDate
            const cropLeft = !!nextPeriodStartDate && dayjs(endDate).add(1, 'day').isSame(nextPeriodStartDate, 'day')
            const cropRight = !!prevPeriodEndDate && dayjs(prevPeriodEndDate).add(1, 'day').isSame(startDate, 'day')

            periods.push({
                id: `r-${rowIndex}-p-${periodIndex}`,
                children: period.props.children,
                isActive: period.props.activePeriod,
                onSelectPeriod: period.props.onSelectPeriod,
                icon: period.props.icon,
                status: period.props.status,
                startDate,
                endDate,
                cropLeft,
                cropRight,
            })
        })

        parsedRow.push({
            label: row.props?.label,
            periods,
        })
    })

    return parsedRow
}

export const getNumberOfDays = (start: Dayjs, end: Dayjs): number => end.diff(start, 'day') + 1

function useEarliestDate(periods: ParsedRow['periods']): Dayjs | undefined {
    return useMemo(() => {
        const dates = periods.filter((period) => period.startDate).map((period) => period.startDate)

        if (dates.length === 0) return undefined

        return dates.reduce((earliestDate, currentDate) =>
            currentDate.isBefore(earliestDate) ? currentDate : earliestDate,
        )
    }, [periods])
}

function useLatestDate(periods: ParsedRow['periods']): Dayjs | undefined {
    return useMemo(() => {
        const dates = periods.filter((period) => period.endDate).map((period) => period.endDate)

        if (dates.length === 0) return undefined

        return dates.reduce((latestDate, currentDate) => (currentDate.isAfter(latestDate) ? currentDate : latestDate))
    }, [periods])
}
