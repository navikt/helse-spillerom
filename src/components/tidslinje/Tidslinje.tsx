'use client'

import { ReactElement, useState } from 'react'
import { BodyShort, Button, HStack, Skeleton, VStack } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons'

import { useSoknader } from '@hooks/queries/useSoknader'
import { Søknad } from '@/schemas/søknad'
import { getFormattedDateString } from '@utils/date-format'
import { TimelinePeriod } from '@components/tidslinje/timeline/period/TimelinePeriod'
import { TimelineRow } from '@components/tidslinje/timeline/row/TimelineRow'
import { TimelineZoom } from '@components/tidslinje/timeline/zoom/TimelineZoom'
import { Timeline } from '@components/tidslinje/timeline/Timeline'

export function Tidslinje(): ReactElement {
    const [activePeriod, setActivePeriod] = useState<string>('')
    const { data: søknader, isLoading, isError, refetch } = useSoknader(dayjs('2020-01-01'))

    if (isLoading) return <TimelineSkeleton />
    if (isError || !søknader) return <TimelineError refetch={() => refetch()} />
    if (søknader.length === 0) return <></> // vis noe fornuftig

    const søknaderGruppert = søknader.reduce((acc: Record<string, Søknad[]>, soknad) => {
        const key = soknad.arbeidsgiver?.navn || soknad.arbeidssituasjon || soknad.type

        acc[key] = acc[key] || []
        acc[key].push(soknad)
        return acc
    }, {})

    return (
        <Timeline>
            {Object.entries(søknaderGruppert || {}).map(([label, søknader], i) => (
                <TimelineRow key={i} label={label}>
                    {søknader.map((søknad, i) => (
                        <TimelinePeriod
                            key={i}
                            startDate={dayjs(søknad.fom!)}
                            endDate={dayjs(søknad.tom!)}
                            onSelectPeriod={() => setActivePeriod(søknad.id)}
                            activePeriod={activePeriod === søknad.id}
                            icon={<CheckmarkCircleFillIcon />} // TODO velge ikon avhengig av status på behandling
                            status="utbetalt" // TODO ta inn status fra behandling og utvide farge map-ene i TimelinePeriod
                        >
                            <BodyShort size="small">{søknad.arbeidssituasjon}</BodyShort>
                            <BodyShort size="small">{søknad.arbeidsgiver?.navn}</BodyShort>
                            <BodyShort size="small">
                                Periode:{' '}
                                {getFormattedDateString(søknad.fom) + ' - ' + getFormattedDateString(søknad.tom)}
                            </BodyShort>
                        </TimelinePeriod>
                    ))}
                </TimelineRow>
            ))}
            <TimelineZoom />
        </Timeline>
    )
}

function TimelineSkeleton(): ReactElement {
    return (
        <VStack className="mt-7 border-b-1 border-border-divider p-8 pb-4" gap="3">
            <TimelineRowSkeleton />
            <TimelineRowSkeleton />
            <Skeleton variant="rectangle" height={14} className="mt-[15px] ml-[265px] grow" />
            <Skeleton variant="rectangle" height={36} width={246} className="self-end" />
        </VStack>
    )
}

function TimelineRowSkeleton(): ReactElement {
    return (
        <HStack gap="4" align="center">
            <Skeleton variant="text" width={248} height={42} />
            <Skeleton variant="text" height={42} className="grow" />
        </HStack>
    )
}

function TimelineError({ refetch }: { refetch: () => void }): ReactElement {
    return (
        <HStack className="h-60 w-full border-b-1 border-border-divider" align="center" justify="center" gap="4">
            <BodyShort>Kunne ikke hente data for å vise tidslinjen akkurat nå.</BodyShort>
            <Button type="button" size="xsmall" variant="secondary" onClick={refetch}>
                Prøv igjen
            </Button>
        </HStack>
    )
}
