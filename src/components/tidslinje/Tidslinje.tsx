'use client'

import { ReactElement, useState } from 'react'
import { BodyShort, Button, HStack, Skeleton, VStack } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { CheckmarkCircleFillIcon, FolderFileFillIcon } from '@navikt/aksel-icons'
import { useParams, useRouter } from 'next/navigation'

import { useSoknader } from '@hooks/queries/useSoknader'
import { Søknad } from '@/schemas/søknad'
import { getFormattedDateString } from '@utils/date-format'
import { formaterArbeidssituasjon } from '@utils/arbeidssituasjon'
import { TimelinePeriod } from '@components/tidslinje/timeline/period/TimelinePeriod'
import { TimelineRow } from '@components/tidslinje/timeline/row/TimelineRow'
import { TimelineZoom } from '@components/tidslinje/timeline/zoom/TimelineZoom'
import { Timeline } from '@components/tidslinje/timeline/Timeline'
import { useSaksbehandlingsperioder } from '@/hooks/queries/useSaksbehandlingsperioder'

export function Tidslinje(): ReactElement {
    const [activeSoknadId, setActiveSoknadId] = useState<string>('')
    const router = useRouter()
    const params = useParams()
    const {
        data: søknader,
        isLoading: søknaderLoading,
        isError: søknaderError,
        refetch: refetchSøknader,
    } = useSoknader(dayjs('2020-01-01'))
    const {
        data: saksbehandlingsperioder,
        isLoading: saksbehandlingsperioderLoading,
        isError: saksbehandlingsperioderError,
        refetch: refetchSaksbehandlingsperioder,
    } = useSaksbehandlingsperioder()

    if (søknaderLoading || saksbehandlingsperioderLoading) return <TimelineSkeleton />
    if (søknaderError || saksbehandlingsperioderError)
        return <TimelineError refetch={() => Promise.all([refetchSøknader(), refetchSaksbehandlingsperioder()])} />
    if (søknader?.length === 0 && saksbehandlingsperioder?.length === 0) return <TimelineEmpty />

    const søknaderGruppert = (søknader || []).reduce((acc: Record<string, Søknad[]>, soknad) => {
        const key = soknad.arbeidsgiver?.navn || formaterArbeidssituasjon(soknad.arbeidssituasjon) || soknad.type

        acc[key] = acc[key] || []
        acc[key].push(soknad)
        return acc
    }, {})

    return (
        <Timeline>
            {saksbehandlingsperioder && saksbehandlingsperioder.length > 0 && (
                <TimelineRow label="Behandlinger">
                    {saksbehandlingsperioder.map((periode) => (
                        <TimelinePeriod
                            key={periode.id}
                            startDate={dayjs(periode.fom)}
                            endDate={dayjs(periode.tom)}
                            onSelectPeriod={() => {
                                if (params.saksbehandlingsperiodeId !== periode.id) {
                                    router.push(`/person/${params.personId as string}/${periode.id}`)
                                }
                            }}
                            activePeriod={params.saksbehandlingsperiodeId === periode.id}
                            icon={<FolderFileFillIcon />}
                            status="behandling"
                        >
                            <BodyShort size="small">Saksbehandlingsperiode</BodyShort>
                            <BodyShort size="small">
                                Periode:{' '}
                                {getFormattedDateString(periode.fom) + ' - ' + getFormattedDateString(periode.tom)}
                            </BodyShort>
                        </TimelinePeriod>
                    ))}
                </TimelineRow>
            )}
            {Object.entries(søknaderGruppert || {}).map(([label, søknader], i) => (
                <TimelineRow key={i} label={label}>
                    {søknader.map((søknad) => (
                        <TimelinePeriod
                            key={søknad.id}
                            startDate={dayjs(søknad.fom!)}
                            endDate={dayjs(søknad.tom!)}
                            onSelectPeriod={() => setActiveSoknadId(søknad.id)}
                            activePeriod={activeSoknadId === søknad.id}
                            icon={<CheckmarkCircleFillIcon />} // TODO velge ikon avhengig av status på behandling
                            status="utbetalt" // TODO ta inn status fra behandling og utvide farge map-ene i TimelinePeriod
                        >
                            <BodyShort size="small">{formaterArbeidssituasjon(søknad.arbeidssituasjon)}</BodyShort>
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

function TimelineEmpty(): ReactElement {
    return (
        <HStack className="h-60 w-full border-b-1 border-border-divider" align="center" justify="center" gap="4">
            <BodyShort>Fant ingen søknader/behandlinger.</BodyShort>
        </HStack>
    )
}
