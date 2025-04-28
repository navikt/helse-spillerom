'use client'

import { ReactElement } from 'react'
import { BodyShort, HStack, Skeleton, Timeline, VStack } from '@navikt/ds-react'
import { TimelinePeriod, TimelineRow } from '@navikt/ds-react/Timeline'
import { BriefcaseIcon } from '@navikt/aksel-icons'
import dayjs from 'dayjs'

import { useSoknader } from '@hooks/queries/useSoknader'
import { Søknad } from '@/schemas/søknad'

export function Tidslinje(): ReactElement {
    const { data: søknader, isLoading, isError } = useSoknader()

    if (isLoading) return <TimelineSkeleton />
    if (isError || !søknader) return <></> // vis noe fornuftig

    const søknaderGruppert = søknader.reduce((acc: Record<string, Søknad[]>, soknad) => {
        const key = soknad.arbeidsgiver?.orgnummer || '' + soknad.arbeidssituasjon
        acc[key] = acc[key] || []
        acc[key].push(soknad)
        return acc
    }, {})

    const alleDatoer: string[] = søknader.flatMap((s) => [s.fom!, s.tom!])
    const sortert = alleDatoer.sort()

    const først = dayjs(sortert[0] || '2025-01-01').subtract(2, 'month')
    const sist = dayjs(sortert[sortert.length - 1] || '2025-03-31').add(1, 'week')

    return (
        <Timeline
            className="border-b-1 border-border-divider p-8"
            direction="right"
            startDate={først.toDate()}
            endDate={sist.toDate()}
        >
            {Object.entries(søknaderGruppert || {}).map(([label, søknader]) => (
                <TimelineRow
                    key={label}
                    label={'Søknader ' + label}
                    icon={<BriefcaseIcon aria-hidden fontSize="1.5rem" />}
                >
                    {søknader.map((søknad, i) => (
                        <TimelinePeriod
                            key={i}
                            start={new Date(søknad.fom!)}
                            end={new Date(søknad.tom!)}
                            status="success"
                            statusLabel="Sendt"
                        >
                            <BodyShort>{søknad.arbeidssituasjon}</BodyShort>
                            <BodyShort>{søknad.arbeidsgiver?.navn}</BodyShort>
                            <BodyShort>{søknad.fom + ' ' + søknad.tom}</BodyShort>
                        </TimelinePeriod>
                    ))}
                </TimelineRow>
            ))}
        </Timeline>
    )
}

function TimelineSkeleton(): ReactElement {
    return (
        <VStack className="mt-7 border-b-1 border-border-divider p-8 pb-6" gap="4">
            <TimelineRowSkeleton />
            <TimelineRowSkeleton />
        </VStack>
    )
}

function TimelineRowSkeleton(): ReactElement {
    return (
        <HStack gap="4" align="center">
            <Skeleton variant="text" width={176} className="size-10" />
            <Skeleton variant="text" className="size-10 flex-1" />
        </HStack>
    )
}
