'use client'

import { ReactElement, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, VStack, BodyShort, HStack } from '@navikt/ds-react'
import { CalendarIcon, DocPencilIcon } from '@navikt/aksel-icons'

import { Sidemeny } from '@components/sidemenyer/Sidemeny'
import { useAktivSaksbehandlingsperiode } from '@hooks/queries/useAktivSaksbehandlingsperiode'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'
import { useErBeslutter } from '@hooks/queries/useErBeslutter'
import { useSendTilBeslutning } from '@hooks/mutations/useSendTilBeslutning'
import { useTaTilBeslutning } from '@hooks/mutations/useTaTilBeslutning'
import { useGodkjenn } from '@hooks/mutations/useGodkjenn'
import { useSendTilbake } from '@hooks/mutations/useSendTilbake'
import { getFormattedDateString } from '@utils/date-format'
import { useToast } from '@components/ToastProvider'

import { SendTilGodkjenningModal } from './SendTilGodkjenningModal'
import { KategoriTag } from './KategoriTag'
import { StatusTag } from './StatusTag'
import { SendTilbakeModal } from './SendTilbakeModal'
import { BeløpForPerioden } from './BeløpForPerioden'
import { SykepengegrunnlagVisning } from './SykepengegrunnlagVisning'
import { Utbetalingsdager } from './Utbetalingsdager'
import { DekningsgradVisning } from './DekningsgradVisning'

export function Venstremeny(): ReactElement {
    const router = useRouter()
    const { visToast } = useToast()
    const aktivSaksbehandlingsperiode = useAktivSaksbehandlingsperiode()
    const kanSaksbehandles = useKanSaksbehandles()
    const erBeslutter = useErBeslutter()
    const [visGodkjenningModal, setVisGodkjenningModal] = useState(false)
    const [visSendTilbakeModal, setVisSendTilbakeModal] = useState(false)

    const sendTilBeslutning = useSendTilBeslutning({
        onSuccess: () => {
            // Vis success toast og naviger etter at cache invalidation er ferdig
            visToast('Saken er sendt til beslutter', 'success')
            router.push('/')
        },
    })

    const taTilBeslutning = useTaTilBeslutning()
    const godkjenn = useGodkjenn()
    const sendTilbake = useSendTilbake()

    const håndterSendTilGodkjenning = () => {
        if (aktivSaksbehandlingsperiode) {
            sendTilBeslutning.mutate({
                saksbehandlingsperiodeId: aktivSaksbehandlingsperiode.id,
            })
        }
    }

    const håndterTaTilBeslutning = () => {
        if (aktivSaksbehandlingsperiode) {
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
    }

    const håndterGodkjenn = () => {
        if (aktivSaksbehandlingsperiode) {
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
    }

    const håndterSendTilbake = () => {
        setVisSendTilbakeModal(true)
    }

    const håndterSendTilbakeBekreft = (kommentar: string) => {
        if (aktivSaksbehandlingsperiode) {
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
    }

    return (
        <Sidemeny side="left">
            <VStack gap="4">
                <HStack gap="2" wrap role="region" aria-label="Saksinformasjon">
                    <KategoriTag />
                    <StatusTag />
                </HStack>

                {aktivSaksbehandlingsperiode && (
                    <>
                        <HStack gap="2" align="center">
                            <CalendarIcon aria-hidden fontSize="1.25rem" />
                            <BodyShort size="small">
                                {getFormattedDateString(aktivSaksbehandlingsperiode.fom)} -{' '}
                                {getFormattedDateString(aktivSaksbehandlingsperiode.tom)}
                            </BodyShort>
                        </HStack>

                        {aktivSaksbehandlingsperiode.skjæringstidspunkt && (
                            <HStack gap="2" align="center" className="mb-4">
                                <CalendarIcon aria-hidden fontSize="1.25rem" aria-label="Skjæringstidspunkt" />
                                <BodyShort size="small">
                                    {getFormattedDateString(aktivSaksbehandlingsperiode.skjæringstidspunkt)}
                                </BodyShort>
                            </HStack>
                        )}

                        <SykepengegrunnlagVisning />
                        <DekningsgradVisning />
                        <Utbetalingsdager />
                        <BeløpForPerioden />

                        {kanSaksbehandles && (
                            <>
                                <Button
                                    variant="tertiary"
                                    size="small"
                                    icon={<DocPencilIcon aria-hidden fontSize="1.25rem" />}
                                    className="w-fit"
                                    onClick={() => {
                                        // TODO: Implementer individuell begrunnelse funksjonalitet
                                    }}
                                >
                                    Skriv individuell begrunnelse
                                </Button>

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
                        )}

                        {erBeslutter && (
                            <>
                                {aktivSaksbehandlingsperiode?.status === 'TIL_BESLUTNING' && (
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

                                {aktivSaksbehandlingsperiode?.status === 'UNDER_BESLUTNING' && (
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
