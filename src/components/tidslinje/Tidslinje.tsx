'use client'

import { PropsWithChildren, ReactElement } from 'react'
import { BodyShort, Button, Heading, HGrid, HStack, Skeleton, VStack } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { CheckmarkCircleFillIcon, ClipboardFillIcon, PencilFillIcon } from '@navikt/aksel-icons'
import { useParams, useRouter } from 'next/navigation'

import { useSoknader } from '@hooks/queries/useSoknader'
import { Søknad } from '@/schemas/søknad'
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date-format'
import { formaterArbeidssituasjon } from '@utils/arbeidssituasjon'
import { TimelinePeriod } from '@components/tidslinje/timeline/period/TimelinePeriod'
import { TimelineRow } from '@components/tidslinje/timeline/row/TimelineRow'
import { TimelineZoom } from '@components/tidslinje/timeline/zoom/TimelineZoom'
import { Timeline } from '@components/tidslinje/timeline/Timeline'
import { useSaksbehandlingsperioder } from '@/hooks/queries/useSaksbehandlingsperioder'
import { statusTilTekst } from '@components/oppgaveliste/Oppgaveliste'
import { Saksbehandlingsperiode, SaksbehandlingsperiodeStatus } from '@schemas/saksbehandlingsperiode'

export function Tidslinje(): ReactElement {
    // const [activeSoknadId, setActiveSoknadId] = useState<string>('')
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

        ;(acc[key] ||= []).push(soknad)
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
                            skjæringstidspunkt={dayjs(periode.skjæringstidspunkt)}
                            onSelectPeriod={() => {
                                if (params.saksbehandlingsperiodeId !== periode.id) {
                                    router.push(`/person/${params.personId as string}/${periode.id}`)
                                }
                            }}
                            activePeriod={params.saksbehandlingsperiodeId === periode.id}
                            icon={statusTilIkon[periode.status]}
                            status={periode.status}
                        >
                            <SaksbehandlingsperiodePopover periode={periode} />
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
                            // onSelectPeriod={() => setActiveSoknadId(søknad.id)}
                            // activePeriod={activeSoknadId === søknad.id}
                            icon={<ClipboardFillIcon />}
                            status="SØKNAD"
                        >
                            <SøknadPopover søknad={søknad} />
                        </TimelinePeriod>
                    ))}
                </TimelineRow>
            ))}
            <TimelineZoom />
        </Timeline>
    )
}

function SaksbehandlingsperiodePopover({ periode }: { periode: Saksbehandlingsperiode }): ReactElement {
    return (
        <PopoverContentWrapper heading="Saksbehandlingsperiode">
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {getFormattedDateString(periode.fom) + ' - ' + getFormattedDateString(periode.tom)}
            </BodyShort>

            {periode.skjæringstidspunkt && (
                <>
                    <BodyShort size="small">Skjæringstidspunkt:</BodyShort>
                    <BodyShort size="small">{getFormattedDateString(periode.skjæringstidspunkt)}</BodyShort>
                </>
            )}

            <BodyShort size="small">Opprettet:</BodyShort>
            <BodyShort size="small">{getFormattedDatetimeString(periode.opprettet)}</BodyShort>

            <BodyShort size="small">Opprettet av:</BodyShort>
            <BodyShort size="small">{periode.opprettetAvNavIdent}</BodyShort>

            <BodyShort size="small">Status:</BodyShort>
            <BodyShort size="small">{statusTilTekst[periode.status]}</BodyShort>
            {periode.beslutter && (
                <>
                    <BodyShort size="small">Beslutter:</BodyShort>
                    <BodyShort size="small">{periode.beslutter}</BodyShort>
                </>
            )}
        </PopoverContentWrapper>
    )
}

function SøknadPopover({ søknad }: { søknad: Søknad }): ReactElement {
    return (
        <PopoverContentWrapper heading="Søknad">
            <BodyShort size="small">Arbeidssituasjon:</BodyShort>
            <BodyShort size="small">{formaterArbeidssituasjon(søknad.arbeidssituasjon)}</BodyShort>

            {søknad.arbeidsgiver && (
                <>
                    <BodyShort size="small">Arbeidsgivernavn:</BodyShort>
                    <BodyShort size="small">{søknad.arbeidsgiver.navn}</BodyShort>

                    <BodyShort size="small">Orgnummer:</BodyShort>
                    <BodyShort size="small">{søknad.arbeidsgiver.orgnummer}</BodyShort>
                </>
            )}

            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {getFormattedDateString(søknad.fom) + ' - ' + getFormattedDateString(søknad.tom)}
            </BodyShort>
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

export const statusTilIkon: Record<SaksbehandlingsperiodeStatus, ReactElement> = {
    UNDER_BEHANDLING: <PencilFillIcon />,
    TIL_BESLUTNING: <PencilFillIcon />,
    UNDER_BESLUTNING: <PencilFillIcon />,
    GODKJENT: <CheckmarkCircleFillIcon />,
}

function TimelineSkeleton(): ReactElement {
    return (
        <VStack className="mt-7 border-b-1 border-ax-border-neutral-subtle p-8 pb-4" gap="3">
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
            className="h-60 w-full border-b-1 border-ax-border-neutral-subtle"
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
            className="h-60 w-full border-b-1 border-ax-border-neutral-subtle"
            align="center"
            justify="center"
            gap="4"
        >
            <BodyShort>Fant ingen søknader/behandlinger.</BodyShort>
        </HStack>
    )
}
