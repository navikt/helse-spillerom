'use client'

import { ReactElement, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, VStack, BodyShort, HStack } from '@navikt/ds-react'
import { CalendarIcon, DocPencilIcon } from '@navikt/aksel-icons'

import { Sidemeny } from '@components/sidemenyer/Sidemeny'
import { useAktivSaksbehandlingsperiode } from '@hooks/queries/useAktivSaksbehandlingsperiode'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'
import { useSendTilBeslutning } from '@hooks/mutations/useSendTilBeslutning'
import { getFormattedDateString } from '@utils/date-format'
import { useToast } from '@components/ToastProvider'

import { SendTilGodkjenningModal } from './SendTilGodkjenningModal'
import { KategoriTag } from './KategoriTag'

export function Venstremeny(): ReactElement {
    const router = useRouter()
    const { visToast } = useToast()
    const aktivSaksbehandlingsperiode = useAktivSaksbehandlingsperiode()
    const kanSaksbehandles = useKanSaksbehandles()
    const [visGodkjenningModal, setVisGodkjenningModal] = useState(false)

    const sendTilBeslutning = useSendTilBeslutning({
        onSuccess: () => {
            // Vis success toast og naviger etter at cache invalidation er ferdig
            visToast('Saken er sendt til beslutter', 'success')
            router.push('/')
        },
    })

    const håndterSendTilGodkjenning = () => {
        if (aktivSaksbehandlingsperiode) {
            sendTilBeslutning.mutate({
                saksbehandlingsperiodeId: aktivSaksbehandlingsperiode.id,
            })
        }
    }

    return (
        <Sidemeny side="left">
            <VStack gap="4">
                <KategoriTag />

                {aktivSaksbehandlingsperiode && (
                    <>
                        <HStack gap="2" align="center">
                            <CalendarIcon aria-hidden fontSize="1.25rem" />
                            <BodyShort size="small">
                                {getFormattedDateString(aktivSaksbehandlingsperiode.fom)} -{' '}
                                {getFormattedDateString(aktivSaksbehandlingsperiode.tom)}
                            </BodyShort>
                        </HStack>

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
                    </>
                )}
            </VStack>

            <SendTilGodkjenningModal
                åpen={visGodkjenningModal}
                onLukk={() => setVisGodkjenningModal(false)}
                onSendTilGodkjenning={håndterSendTilGodkjenning}
            />
        </Sidemeny>
    )
}
