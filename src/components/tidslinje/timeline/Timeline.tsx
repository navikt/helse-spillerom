import React, { PropsWithChildren, ReactElement, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { HStack, VStack } from '@navikt/ds-react'

import { Søknad } from '@/schemas/søknad'
import { TimelineContext } from '@components/tidslinje/timeline/context'
import { TimelineRowLabels } from '@components/tidslinje/timeline/TimelineRowLabels'
import { TimelineScrollableRows } from '@components/tidslinje/timeline/TimelineScrollableRows'

interface TimelineProps extends PropsWithChildren {
    søknaderGruppert: Record<string, Søknad[]>
}

export function Timeline({ søknaderGruppert, children }: TimelineProps): ReactElement {
    const arbeidsgivernavn = Object.keys(søknaderGruppert)
    const alleDatoerSortert: string[] = Object.values(søknaderGruppert)
        .flat()
        .flatMap((s) => [s.fom!, s.tom!])
        .sort()

    const [startDate, setStartDate] = useState<Dayjs>(dayjs(alleDatoerSortert[0]))
    const [endDate, setEndDate] = useState<Dayjs>(dayjs(alleDatoerSortert[alleDatoerSortert.length - 1]))
    const [dayLength, setDayLength] = useState<number>(8)
    const [width, setWidth] = useState<number>(getNumberOfDays(startDate, endDate) * dayLength)

    return (
        <TimelineContext.Provider
            value={{
                startDate,
                setStartDate,
                endDate,
                setEndDate,
                width,
                setWidth,
                dayLength,
                setDayLength,
            }}
        >
            <VStack className="w-full border-b-1 border-border-divider p-8">
                <HStack gap="2" wrap={false}>
                    <TimelineRowLabels labels={arbeidsgivernavn} />
                    <TimelineScrollableRows>{children}</TimelineScrollableRows>
                </HStack>
            </VStack>
        </TimelineContext.Provider>
    )
}

export const getNumberOfDays = (start: Dayjs, end: Dayjs): number => end.diff(start, 'day') + 1
