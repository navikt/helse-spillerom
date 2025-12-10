'use client'

import React, { PropsWithChildren, ReactElement } from 'react'
import { BodyShort, Button, Heading, HGrid, HStack, Skeleton, VStack } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { CheckmarkCircleFillIcon, PencilFillIcon, PlusIcon } from '@navikt/aksel-icons'
import { useParams, useRouter } from 'next/navigation' // Brukes kun for behandlingId og tilkommenId som kan være undefined

import { usePersonRouteParams } from '@hooks/useRouteParams'
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date-format'
import { formaterBeløpKroner } from '@schemas/øreUtils'
import { TimelinePeriod } from '@components/tidslinje/timeline/period/TimelinePeriod'
import { TimelineRow } from '@components/tidslinje/timeline/row/TimelineRow'
import { TimelineZoom } from '@components/tidslinje/timeline/zoom/TimelineZoom'
import { Timeline } from '@components/tidslinje/timeline/Timeline'
import { BehandlingStatus } from '@schemas/behandling'
import { statusTilTekst } from '@components/statustag/StatusTag'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'
import { useAktivSaksbehandlingsperiode } from '@hooks/queries/useAktivSaksbehandlingsperiode'
import { useTidslinje } from '@hooks/queries/useTidslinje'
import { useBehandlingsperiodeMedLoading } from '@hooks/queries/useBehandlingsperiode'
import { useTilkommenInntektById } from '@hooks/queries/useTilkommenInntektById'
import { groupTidslinjeData } from '@components/tidslinje/groupTidslinjeData'

export function Tidslinje(): ReactElement {
    const router = useRouter()
    const { pseudoId } = usePersonRouteParams()
    const params = useParams() // Brukes kun for behandlingId og tilkommenId som kan være undefined

    const { data, isLoading, isError, refetch } = useTidslinje()

    if (isLoading) return <TimelineSkeleton />
    if (isError) return <TimelineError refetch={refetch} />
    if (data == null || data.length === 0) return <TimelineEmpty />

    const { behandlinger, tilkomneInntekter } = groupTidslinjeData(data)

    return (
        <>
            <Timeline>
                {behandlinger.map((rad) => (
                    <TimelineRow key={rad.id} label={rad.navn} icon={rad.icon}>
                        {rad.tidslinjeElementer.map((periode) => (
                            <TimelinePeriod
                                key={rad.id + periode.fom + periode.tom}
                                startDate={dayjs(periode.fom)}
                                endDate={dayjs(periode.tom)}
                                skjæringstidspunkt={
                                    periode.skjæringstidspunkt ? dayjs(periode.skjæringstidspunkt) : undefined
                                }
                                onSelectPeriod={() => router.push(`/person/${pseudoId}/${periode.behandlingId}`)}
                                activePeriod={params.behandlingId === periode.behandlingId && !params.tilkommenId}
                                icon={statusTilIkon[periode.status]}
                                variant={periode.ghost ? 'GHOST' : periode.status}
                                generasjonIndex={periode.generasjonIndex}
                            >
                                <BehandlingPopover behandlingId={periode.behandlingId} />
                            </TimelinePeriod>
                        ))}
                    </TimelineRow>
                ))}
                {tilkomneInntekter.map((rad) => (
                    <TimelineRow key={rad.id} label={rad.navn} icon={rad.icon}>
                        {rad.tidslinjeElementer.map((periode) => (
                            <TimelinePeriod
                                key={rad.id + periode.fom + periode.tom}
                                startDate={dayjs(periode.fom)}
                                endDate={dayjs(periode.tom)}
                                onSelectPeriod={() =>
                                    router.push(
                                        `/person/${pseudoId}/${periode.behandlingId}/tilkommen-inntekt/${periode.tilkommenInntektId}`,
                                    )
                                }
                                activePeriod={
                                    params.behandlingId === periode.behandlingId &&
                                    params.tilkommenId === periode.tilkommenInntektId
                                }
                                icon={<PlusIcon />}
                                variant="TILKOMMEN_INNTEKT"
                            >
                                <TilkommenInntektPopover
                                    behandlingId={periode.behandlingId}
                                    tilkommenInntektId={periode.tilkommenInntektId}
                                />
                            </TimelinePeriod>
                        ))}
                    </TimelineRow>
                ))}
                <TimelineZoom />
            </Timeline>
            <TilkommenInntektKnapp />
        </>
    )
}

function TilkommenInntektPopover({
    behandlingId,
    tilkommenInntektId,
}: {
    behandlingId: string
    tilkommenInntektId: string
}): ReactElement {
    const { tilkommenInntekt, isLoading } = useTilkommenInntektById(behandlingId, tilkommenInntektId)
    if (!tilkommenInntekt || isLoading) {
        return <></>
    }

    return (
        <PopoverContentWrapper heading="Tilkommen inntekt">
            <BodyShort size="small">Organisasjonsnummer:</BodyShort>
            <BodyShort size="small">{tilkommenInntekt.ident}</BodyShort>

            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {getFormattedDateString(tilkommenInntekt.fom) + ' - ' + getFormattedDateString(tilkommenInntekt.tom)}
            </BodyShort>

            <BodyShort size="small">Inntekt for perioden:</BodyShort>
            <BodyShort size="small">{formaterBeløpKroner(tilkommenInntekt.inntektForPerioden)}</BodyShort>

            <BodyShort size="small">Opprettet:</BodyShort>
            <BodyShort size="small">{getFormattedDatetimeString(tilkommenInntekt.opprettet)}</BodyShort>
        </PopoverContentWrapper>
    )
}

function TilkommenInntektKnapp(): ReactElement {
    const kanSaksbehandles = useKanSaksbehandles()
    const aktivSaksbehandlingsperiode = useAktivSaksbehandlingsperiode()
    const router = useRouter()
    const { pseudoId } = usePersonRouteParams()
    const params = useParams() // Brukes kun for behandlingId som kan være undefined

    if (!kanSaksbehandles || !aktivSaksbehandlingsperiode) {
        return <></>
    }

    const handleLeggTilTilkommenInntekt = () => {
        if (pseudoId && params.behandlingId) {
            router.push(`/person/${pseudoId}/${params.behandlingId}/tilkommen-inntekt/opprett`)
        }
    }

    return (
        <div className="border-b border-ax-border-neutral-subtle px-8 py-4">
            <HStack gap="4" align="center" justify="space-between">
                <Button variant="tertiary" size="small" onClick={handleLeggTilTilkommenInntekt}>
                    + Legg til tilkommen inntekt
                </Button>
            </HStack>
        </div>
    )
}

function BehandlingPopover({ behandlingId }: { behandlingId: string }): ReactElement {
    const { behandling, isLoading } = useBehandlingsperiodeMedLoading(behandlingId)
    if (!behandling || isLoading) {
        return <></>
    }

    return (
        <PopoverContentWrapper heading="Behandling">
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {getFormattedDateString(behandling.fom) + ' - ' + getFormattedDateString(behandling.tom)}
            </BodyShort>

            {behandling.skjæringstidspunkt && (
                <>
                    <BodyShort size="small">Skjæringstidspunkt:</BodyShort>
                    <BodyShort size="small">{getFormattedDateString(behandling.skjæringstidspunkt)}</BodyShort>
                </>
            )}

            <BodyShort size="small">Opprettet:</BodyShort>
            <BodyShort size="small">{getFormattedDatetimeString(behandling.opprettet)}</BodyShort>

            <BodyShort size="small">Opprettet av:</BodyShort>
            <BodyShort size="small">{behandling.opprettetAvNavIdent}</BodyShort>

            <BodyShort size="small">Status:</BodyShort>
            <BodyShort size="small">{statusTilTekst[behandling.status]}</BodyShort>
            {behandling.beslutterNavIdent && (
                <>
                    <BodyShort size="small">Beslutter:</BodyShort>
                    <BodyShort size="small">{behandling.beslutterNavIdent}</BodyShort>
                </>
            )}
        </PopoverContentWrapper>
    )
}

function PopoverContentWrapper({ heading, children }: PropsWithChildren<{ heading: string }>): ReactElement {
    return (
        <VStack gap="1">
            <Heading size="xsmall" level="3">
                {heading}
            </Heading>
            <HGrid columns={2} gap="1 6">
                {children}
            </HGrid>
        </VStack>
    )
}

export const statusTilIkon: Record<BehandlingStatus, ReactElement> = {
    UNDER_BEHANDLING: <PencilFillIcon />,
    TIL_BESLUTNING: <PencilFillIcon />,
    UNDER_BESLUTNING: <PencilFillIcon />,
    GODKJENT: <CheckmarkCircleFillIcon />,
    REVURDERT: <PencilFillIcon />,
}

function TimelineSkeleton(): ReactElement {
    return (
        <VStack className="mt-7 border-b border-ax-border-neutral-subtle p-8 pb-4" gap="3">
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
        <HStack
            className="h-60 w-full border-b border-ax-border-neutral-subtle"
            align="center"
            justify="center"
            gap="4"
        >
            <BodyShort>Kunne ikke hente data for å vise tidslinjen akkurat nå.</BodyShort>
            <Button type="button" size="xsmall" variant="secondary" onClick={refetch}>
                Prøv igjen
            </Button>
        </HStack>
    )
}

function TimelineEmpty(): ReactElement {
    return (
        <HStack
            className="h-60 w-full border-b border-ax-border-neutral-subtle"
            align="center"
            justify="center"
            gap="4"
        >
            <BodyShort>Fant ingen søknader/behandlinger.</BodyShort>
        </HStack>
    )
}
