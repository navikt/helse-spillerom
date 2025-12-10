import dayjs, { Dayjs } from 'dayjs'
import React, { PropsWithChildren, ReactElement, ReactNode } from 'react'

import { TimelineRowProps } from '@components/tidslinje/timeline/row/TimelineRow'
import { TidslinjeVariant, TimelinePeriodProps } from '@components/tidslinje/timeline/period/TimelinePeriod'

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
    skjæringstidspunkt?: Dayjs
    icon?: ReactElement
    variant: TidslinjeVariant
    cropLeft: boolean
    cropRight: boolean
}

type ParsedRowsResult = {
    rowLabels: { label: string; icon: ReactElement }[]
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

    const zoomComponent: ReactElement<PropsWithChildren>[] = React.Children.toArray(children).filter(
        (child: ReactNode) =>
            React.isValidElement(child) && (child.type as ComponentWithType).componentType === 'TimelineZoom',
    ) as ReactElement<PropsWithChildren>[]

    const parsedRows = parseRows(rowChildren)

    const rowLabels = parsedRows.map((row) => {
        return { label: row.label, icon: row.icon }
    })
    const allPeriods = parsedRows.map((row) => row.periods).flat()

    const earliestDate = useEarliestDate(allPeriods) ?? dayjs().subtract(1, 'year')
    const latestDate = useLatestDate(allPeriods) ?? dayjs().add(1, 'month')

    return { rowLabels, earliestDate, latestDate, parsedRows, zoomComponent }
}

export type ParsedRow = {
    label: string
    icon: ReactElement
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

        periodChildren
            .sort((a, b) => a.props.startDate.diff(b.props.startDate))
            .forEach((period, periodIndex) => {
                const startDate = period.props.startDate
                const endDate = period.props.endDate
                const skjæringstidspunkt = period.props.skjæringstidspunkt
                const prevPeriodEndDate = periodChildren[periodIndex - 1]?.props.endDate
                const prevPeriodSkjæringstidspunkt = periodChildren[periodIndex - 1]?.props.skjæringstidspunkt
                const nextPeriodStartDate = periodChildren[periodIndex + 1]?.props.startDate
                const nextPeriodSkjæringstidspunkt = periodChildren[periodIndex + 1]?.props.skjæringstidspunkt
                const cropLeft = Boolean(
                    nextPeriodStartDate &&
                    dayjs(endDate).add(1, 'day').isSame(nextPeriodStartDate, 'day') &&
                    shouldCrop(skjæringstidspunkt, nextPeriodSkjæringstidspunkt),
                )

                const cropRight = Boolean(
                    prevPeriodEndDate &&
                    dayjs(prevPeriodEndDate).add(1, 'day').isSame(startDate, 'day') &&
                    shouldCrop(skjæringstidspunkt, prevPeriodSkjæringstidspunkt),
                )

                periods.push({
                    id: `r-${rowIndex}-p-${periodIndex}`,
                    children: period.props.children,
                    isActive: period.props.activePeriod,
                    onSelectPeriod: period.props.onSelectPeriod,
                    icon: period.props.icon,
                    variant: period.props.variant,
                    startDate,
                    endDate,
                    skjæringstidspunkt,
                    cropLeft,
                    cropRight,
                })
            })

        parsedRow.push({
            label: row.props?.label,
            icon: row.props?.icon,
            periods,
        })
    })

    return parsedRow
}

function shouldCrop(thisSkjæringstidspunkt?: Dayjs, neighborSkjæringstidspunkt?: Dayjs): boolean {
    return (
        !!thisSkjæringstidspunkt &&
        !!neighborSkjæringstidspunkt &&
        thisSkjæringstidspunkt.isSame(neighborSkjæringstidspunkt)
    )
}

export const getNumberOfDays = (start: Dayjs, end: Dayjs): number => end.diff(start, 'day') + 1

function useEarliestDate(periods: ParsedRow['periods']): Dayjs | undefined {
    const dates = periods.filter((period) => period.startDate).map((period) => period.startDate)

    if (dates.length === 0) return undefined

    return dates.reduce((earliestDate, currentDate) =>
        currentDate.isBefore(earliestDate) ? currentDate : earliestDate,
    )
}

function useLatestDate(periods: ParsedRow['periods']): Dayjs | undefined {
    const dates = periods.filter((period) => period.endDate).map((period) => period.endDate)

    if (dates.length === 0) return undefined

    return dates.reduce((latestDate, currentDate) => (currentDate.isAfter(latestDate) ? currentDate : latestDate))
}
