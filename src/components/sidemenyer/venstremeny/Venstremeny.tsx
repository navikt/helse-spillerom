'use client'

import { ReactElement, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bleed, BodyShort, BoxNew, Button, HStack, Tooltip, VStack } from '@navikt/ds-react'
import { CalendarIcon } from '@navikt/aksel-icons'

import { Sidemeny } from '@components/sidemenyer/Sidemeny'
import { useAktivSaksbehandlingsperiodeMedLoading } from '@hooks/queries/useAktivSaksbehandlingsperiode'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'
import { useErBeslutter } from '@hooks/queries/useErBeslutter'
import { useBrukerRoller } from '@hooks/queries/useBrukerRoller'
import { useBrukerinfo } from '@hooks/queries/useBrukerinfo'
import { useSaksbehandlingsperioder } from '@hooks/queries/useSaksbehandlingsperioder'
import { useSendTilBeslutning } from '@hooks/mutations/useSendTilBeslutning'
import { useTaTilBeslutning } from '@hooks/mutations/useTaTilBeslutning'
import { useGodkjenn } from '@hooks/mutations/useGodkjenn'
import { useSendTilbake } from '@hooks/mutations/useSendTilbake'
import { useRevurder } from '@hooks/mutations/useRevurder'
import { getFormattedDateString } from '@utils/date-format'
import { useToast } from '@components/ToastProvider'
import { Skjæringstidspunkt } from '@components/sidemenyer/venstremeny/skjæringstidspunkt/Skjæringstidspunkt'
import { VenstremenySkeleton } from '@components/sidemenyer/venstremeny/VenstremenySkeleton'
import { StatusTag } from '@components/statustag/StatusTag'

import { SendTilGodkjenningModal } from './SendTilGodkjenningModal'
import { KategoriTag } from './KategoriTag'
import { SendTilbakeModal } from './SendTilbakeModal'
import { BeløpForPerioden } from './BeløpForPerioden'
import { SykepengegrunnlagVisning } from './SykepengegrunnlagVisning'
import { Utbetalingsdager } from './Utbetalingsdager'
import { DekningsgradVisning } from './DekningsgradVisning'
import { IndividuellBegrunnelse } from './IndividuellBegrunnelse'

export function Venstremeny(): ReactElement {
    const router = useRouter()
    const { visToast } = useToast()
    const { aktivSaksbehandlingsperiode, isLoading } = useAktivSaksbehandlingsperiodeMedLoading()
    const kanSaksbehandles = useKanSaksbehandles()
    const erBeslutter = useErBeslutter()
    const { data: brukerRoller } = useBrukerRoller()
    const { data: brukerinfo } = useBrukerinfo()
    const { data: saksbehandlingsperioder } = useSaksbehandlingsperioder()
    const [visGodkjenningModal, setVisGodkjenningModal] = useState(false)
    const [visSendTilbakeModal, setVisSendTilbakeModal] = useState(false)

    const sendTilBeslutning = useSendTilBeslutning({
        onSuccess: () => {
            // Vis success toast og naviger etter at cache invalidation er ferdig
            sessionStorage.removeItem(`${aktivSaksbehandlingsperiode!.id}-individuell-begrunnelse`)
            visToast('Saken er sendt til beslutter', 'success')
            router.push('/')
        },
    })

    const taTilBeslutning = useTaTilBeslutning()
    const godkjenn = useGodkjenn()
    const sendTilbake = useSendTilbake()
    const revurder = useRevurder()

    const kanRevurderes = useMemo(() => {
        if (!aktivSaksbehandlingsperiode || !saksbehandlingsperioder) return false

        // Sjekk om perioden er godkjent
        if (aktivSaksbehandlingsperiode.status !== 'GODKJENT') return false

        // Sjekk om noen andre perioder har revurdererSaksbehandlingsperiodeId som peker på denne periodens id
        const harEksisterendeRevurdering = saksbehandlingsperioder.some(
            (periode) =>
                periode.id !== aktivSaksbehandlingsperiode.id &&
                periode.revurdererSaksbehandlingsperiodeId === aktivSaksbehandlingsperiode.id,
        )

        return !harEksisterendeRevurdering
    }, [aktivSaksbehandlingsperiode, saksbehandlingsperioder])

    if (isLoading) return <VenstremenySkeleton />

    const håndterSendTilGodkjenning = () => {
        if (!aktivSaksbehandlingsperiode) return
        const storageValue = sessionStorage.getItem(`${aktivSaksbehandlingsperiode.id}-individuell-begrunnelse`)
        sendTilBeslutning.mutate({
            saksbehandlingsperiodeId: aktivSaksbehandlingsperiode.id,
            individuellBegrunnelse: storageValue ? JSON.parse(storageValue) : undefined,
        })
    }

    const håndterTaTilBeslutning = () => {
        if (!aktivSaksbehandlingsperiode) return
        taTilBeslutning.mutate(
            {
                saksbehandlingsperiodeId: aktivSaksbehandlingsperiode.id,
            },
            {
                onSuccess: () => {
                    visToast('Saken er tatt til beslutning', 'success')
                },
            },
        )
    }

    const håndterGodkjenn = () => {
        if (!aktivSaksbehandlingsperiode) return
        godkjenn.mutate(
            {
                saksbehandlingsperiodeId: aktivSaksbehandlingsperiode.id,
            },
            {
                onSuccess: () => {
                    visToast('Saken er godkjent', 'success')
                    router.push('/')
                },
            },
        )
    }

    const håndterSendTilbake = () => {
        setVisSendTilbakeModal(true)
    }

    const håndterSendTilbakeBekreft = (kommentar: string) => {
        if (!aktivSaksbehandlingsperiode) return
        sendTilbake.mutate(
            {
                saksbehandlingsperiodeId: aktivSaksbehandlingsperiode.id,
                kommentar,
            },
            {
                onSuccess: () => {
                    visToast('Saken er sendt tilbake til saksbehandler', 'success')
                    setVisSendTilbakeModal(false)
                },
            },
        )
    }

    const håndterRevurder = () => {
        if (!aktivSaksbehandlingsperiode) return
        revurder.mutate({
            saksbehandlingsperiodeId: aktivSaksbehandlingsperiode.id,
        })
    }

    return (
        <Sidemeny side="left">
            <VStack gap="4" className="pb-24">
                <HStack gap="2" wrap role="region" aria-label="Saksinformasjon">
                    <KategoriTag />
                    <StatusTag periode={aktivSaksbehandlingsperiode} size="small" />
                </HStack>

                {aktivSaksbehandlingsperiode && (
                    <>
                        <HStack gap="2" align="center">
                            <Tooltip content="Sykmeldingsperiode">
                                <CalendarIcon aria-hidden fontSize="1.25rem" />
                            </Tooltip>
                            <BodyShort size="small">
                                {getFormattedDateString(aktivSaksbehandlingsperiode.fom)} -{' '}
                                {getFormattedDateString(aktivSaksbehandlingsperiode.tom)}
                            </BodyShort>
                        </HStack>

                        {aktivSaksbehandlingsperiode.skjæringstidspunkt && (
                            <Skjæringstidspunkt
                                dato={aktivSaksbehandlingsperiode.skjæringstidspunkt}
                                saksbehandlingsperiodeId={aktivSaksbehandlingsperiode.id}
                            />
                        )}

                        <SykepengegrunnlagVisning />
                        <DekningsgradVisning />
                        <Utbetalingsdager />
                        <BeløpForPerioden />

                        {kanSaksbehandles ? (
                            <>
                                <IndividuellBegrunnelse aktivSaksbehandlingsperiode={aktivSaksbehandlingsperiode} />

                                <Button
                                    variant="primary"
                                    size="small"
                                    className="w-fit"
                                    onClick={() => setVisGodkjenningModal(true)}
                                    loading={sendTilBeslutning.isPending}
                                    disabled={sendTilBeslutning.isPending}
                                >
                                    Send til godkjenning
                                </Button>
                            </>
                        ) : (
                            aktivSaksbehandlingsperiode.individuellBegrunnelse && (
                                <Bleed asChild marginInline="4 4" reflectivePadding>
                                    <VStack as={BoxNew} gap="4" background="neutral-soft" className="py-4">
                                        <BodyShort size="small" weight="semibold">
                                            Individuell begrunnelse
                                        </BodyShort>
                                        <BodyShort size="small" className="whitespace-pre-wrap">
                                            {aktivSaksbehandlingsperiode.individuellBegrunnelse}
                                        </BodyShort>
                                    </VStack>
                                </Bleed>
                            )
                        )}

                        {erBeslutter && (
                            <>
                                {(aktivSaksbehandlingsperiode?.status === 'TIL_BESLUTNING' ||
                                    (aktivSaksbehandlingsperiode?.status === 'UNDER_BESLUTNING' &&
                                        aktivSaksbehandlingsperiode.beslutterNavIdent &&
                                        aktivSaksbehandlingsperiode.beslutterNavIdent !== brukerinfo?.navIdent)) && (
                                    <Button
                                        variant="primary"
                                        size="small"
                                        className="w-fit"
                                        onClick={håndterTaTilBeslutning}
                                        loading={taTilBeslutning.isPending}
                                        disabled={taTilBeslutning.isPending}
                                    >
                                        Ta til beslutning
                                    </Button>
                                )}

                                {aktivSaksbehandlingsperiode?.status === 'UNDER_BESLUTNING' &&
                                    aktivSaksbehandlingsperiode.beslutterNavIdent &&
                                    aktivSaksbehandlingsperiode.beslutterNavIdent === brukerinfo?.navIdent && (
                                        <>
                                            <Button
                                                variant="primary"
                                                size="small"
                                                className="w-fit"
                                                onClick={håndterGodkjenn}
                                                loading={godkjenn.isPending}
                                                disabled={godkjenn.isPending}
                                            >
                                                Godkjenn og fatt vedtak
                                            </Button>

                                            <Button
                                                variant="secondary"
                                                size="small"
                                                className="w-fit"
                                                onClick={håndterSendTilbake}
                                                loading={sendTilbake.isPending}
                                                disabled={sendTilbake.isPending}
                                            >
                                                Returner
                                            </Button>
                                        </>
                                    )}
                            </>
                        )}

                        {brukerRoller.saksbehandler && kanRevurderes && (
                            <Button
                                variant="primary"
                                size="small"
                                className="w-fit"
                                onClick={håndterRevurder}
                                loading={revurder.isPending}
                                disabled={revurder.isPending}
                            >
                                Revurder periode
                            </Button>
                        )}
                    </>
                )}
            </VStack>

            <SendTilGodkjenningModal
                åpen={visGodkjenningModal}
                onLukk={() => setVisGodkjenningModal(false)}
                onSendTilGodkjenning={håndterSendTilGodkjenning}
            />
            <SendTilbakeModal
                isOpen={visSendTilbakeModal}
                onClose={() => setVisSendTilbakeModal(false)}
                onConfirm={håndterSendTilbakeBekreft}
                isLoading={sendTilbake.isPending}
            />
        </Sidemeny>
    )
}
