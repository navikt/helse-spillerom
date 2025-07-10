'use client'

import { ReactElement, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button, VStack, BodyShort, HStack } from '@navikt/ds-react'
import { CalendarIcon, DocPencilIcon } from '@navikt/aksel-icons'

import { Sidemeny } from '@components/sidemenyer/Sidemeny'
import { useSaksbehandlingsperioder } from '@hooks/queries/useSaksbehandlingsperioder'
import { useBrukerRoller } from '@hooks/queries/useBrukerRoller'
import { useSendTilBeslutning } from '@hooks/mutations/useSendTilBeslutning'
import { getFormattedDateString } from '@utils/date-format'
import { useToast } from '@components/ToastProvider'

import { SendTilGodkjenningModal } from './SendTilGodkjenningModal'
import { KategoriTag } from './KategoriTag'

export function Venstremeny(): ReactElement {
    const params = useParams()
    const router = useRouter()
    const { visToast } = useToast()
    const { data: saksbehandlingsperioder } = useSaksbehandlingsperioder()
    const { data: brukerRoller } = useBrukerRoller()
    const [visGodkjenningModal, setVisGodkjenningModal] = useState(false)

    const sendTilBeslutning = useSendTilBeslutning({
        onSuccess: () => {
            // Vis success toast og naviger etter at cache invalidation er ferdig
            visToast('Saken er sendt til beslutter', 'success')
            router.push('/')
        },
    })

    // Finn aktiv saksbehandlingsperiode hvis vi er inne i en
    const aktivSaksbehandlingsperiode = saksbehandlingsperioder?.find(
        (periode) => periode.id === params.saksbehandlingsperiodeId,
    )

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

                        {brukerRoller.saksbehandler && (
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
