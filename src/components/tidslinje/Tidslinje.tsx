'use client'

import { PropsWithChildren, ReactElement } from 'react'
import { BodyShort, Button, Heading, HGrid, HStack, Skeleton, VStack } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { CheckmarkCircleFillIcon, ClipboardFillIcon, PencilFillIcon, PlusIcon } from '@navikt/aksel-icons'
import { useParams, useRouter } from 'next/navigation'

import { useSoknader } from '@hooks/queries/useSoknader'
import { Søknad } from '@/schemas/søknad'
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date-format'
import { formaterArbeidssituasjon } from '@utils/arbeidssituasjon'
import { formaterBeløpKroner } from '@schemas/øreUtils'
import { TimelinePeriod } from '@components/tidslinje/timeline/period/TimelinePeriod'
import { TimelineRow } from '@components/tidslinje/timeline/row/TimelineRow'
import { TimelineZoom } from '@components/tidslinje/timeline/zoom/TimelineZoom'
import { Timeline } from '@components/tidslinje/timeline/Timeline'
import { useSaksbehandlingsperioder } from '@/hooks/queries/useSaksbehandlingsperioder'
import { Saksbehandlingsperiode, SaksbehandlingsperiodeStatus } from '@schemas/saksbehandlingsperiode'
import { statusTilTekst } from '@components/statustag/StatusTag'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'
import { useAktivSaksbehandlingsperiode } from '@hooks/queries/useAktivSaksbehandlingsperiode'
import { useTilkommenInntekt } from '@hooks/queries/useTilkommenInntekt'
import { TilkommenInntektResponse } from '@schemas/tilkommenInntekt'

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
    const {
        data: tilkomneInntekter,
        isLoading: tilkomneInntekterLoading,
        isError: tilkomneInntekterError,
    } = useTilkommenInntekt()

    if (søknaderLoading || saksbehandlingsperioderLoading || tilkomneInntekterLoading) return <TimelineSkeleton />
    if (søknaderError || saksbehandlingsperioderError || tilkomneInntekterError)
        return <TimelineError refetch={() => Promise.all([refetchSøknader(), refetchSaksbehandlingsperioder()])} />
    if (søknader?.length === 0 && saksbehandlingsperioder?.length === 0 && tilkomneInntekter?.length === 0)
        return <TimelineEmpty />

    const søknaderGruppert = (søknader || []).reduce((acc: Record<string, Søknad[]>, soknad) => {
        const key = soknad.arbeidsgiver?.navn || formaterArbeidssituasjon(soknad.arbeidssituasjon) || soknad.type

        ;(acc[key] ||= []).push(soknad)
        return acc
    }, {})

    // Grupper tilkomne inntekter etter ident (organisasjonsnummer)
    const tilkomneInntekterGruppert = (tilkomneInntekter || []).reduce(
        (acc: Record<string, TilkommenInntektResponse[]>, ti) => {
            const key = ti.ident
            ;(acc[key] ||= []).push(ti)
            return acc
        },
        {},
    )

    return (
        <>
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
                                    // Hvis vi er på en tilkommen inntekt-side, naviger tilbake til behandlingen
                                    if (params.tilkommenId) {
                                        router.push(`/person/${params.personId as string}/${periode.id}`)
                                    } else if (params.saksbehandlingsperiodeId !== periode.id) {
                                        router.push(`/person/${params.personId as string}/${periode.id}`)
                                    }
                                }}
                                activePeriod={params.saksbehandlingsperiodeId === periode.id && !params.tilkommenId}
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
                {Object.entries(tilkomneInntekterGruppert || {}).map(([ident, inntekter]) => {
                    return (
                        <TimelineRow label={ident} key={ident}>
                            {inntekter.map((ti) => (
                                <TimelinePeriod
                                    key={ti.id}
                                    startDate={dayjs(ti.fom)}
                                    endDate={dayjs(ti.tom)}
                                    onSelectPeriod={() => {
                                        router.push(
                                            `/person/${params.personId}/${params.saksbehandlingsperiodeId}/tilkommen-inntekt/${ti.id}`,
                                        )
                                    }}
                                    activePeriod={params.tilkommenId === ti.id}
                                    icon={<PlusIcon />}
                                    status="TI"
                                >
                                    <TilkommenInntektPopover tilkommenInntekt={ti} />
                                </TimelinePeriod>
                            ))}
                        </TimelineRow>
                    )
                })}

                <TimelineZoom />
            </Timeline>
            <TilkommenInntektKnapp />
        </>
    )
}

function TilkommenInntektPopover({ tilkommenInntekt }: { tilkommenInntekt: TilkommenInntektResponse }): ReactElement {
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
    const params = useParams()

    if (!kanSaksbehandles || !aktivSaksbehandlingsperiode) {
        return <></>
    }

    const handleLeggTilTilkommenInntekt = () => {
        if (params.personId && params.saksbehandlingsperiodeId) {
            router.push(`/person/${params.personId}/${params.saksbehandlingsperiodeId}/tilkommen-inntekt/opprett`)
        }
    }

    return (
        <div className="border-b-1 border-ax-border-neutral-subtle px-8 py-4">
            <HStack gap="4" align="center" justify="space-between">
                <Button variant="tertiary" size="small" onClick={handleLeggTilTilkommenInntekt}>
                    + Legg til tilkommen inntekt/periode
                </Button>
            </HStack>
        </div>
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
            {periode.beslutterNavIdent && (
                <>
                    <BodyShort size="small">Beslutter:</BodyShort>
                    <BodyShort size="small">{periode.beslutterNavIdent}</BodyShort>
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
    REVURDERT: <PencilFillIcon />,
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
