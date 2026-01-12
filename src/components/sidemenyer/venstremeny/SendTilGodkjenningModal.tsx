'use client'

import { Dispatch, ReactElement, SetStateAction } from 'react'
import { BodyShort, Button, Dialog, VStack } from '@navikt/ds-react'
import { useRouter } from 'next/navigation'

import { Valideringer } from '@components/valideringer/Valideringer'
import { useSendTilBeslutning } from '@hooks/mutations/useSendTilBeslutning'
import { useToast } from '@components/ToastProvider'

import { BeløpForPerioden } from './BeløpForPerioden'

interface SendTilGodkjenningModalProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    aktivBehandlingId: string
}

export function SendTilGodkjenningModal({
    open,
    setOpen,
    aktivBehandlingId,
}: SendTilGodkjenningModalProps): ReactElement {
    const router = useRouter()
    const { visToast } = useToast()
    const mutation = useSendTilBeslutning()

    async function håndterSendTilGodkjenning() {
        const storageValue = sessionStorage.getItem(`${aktivBehandlingId}-individuell-begrunnelse`)
        await mutation.mutateAsync(
            {
                behandlingId: aktivBehandlingId,
                individuellBegrunnelse: storageValue ? JSON.parse(storageValue) : undefined,
            },
            {
                onSuccess: () => {
                    // Vis success toast og naviger etter at cache invalidation er ferdig
                    sessionStorage.removeItem(`${aktivBehandlingId}-individuell-begrunnelse`)
                    visToast('Saken er sendt til beslutter', 'success')
                    router.push('/')
                },
            },
        )
    }

    return (
        <Dialog aria-label="Send til godkjenning modal" open={open} onOpenChange={setOpen}>
            <Dialog.Popup width="small">
                <Dialog.Header>
                    <Dialog.Title>Er du sikker?</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <VStack gap="4">
                        <BeløpForPerioden />
                        <Valideringer sluttvalidering={true} />
                        <BodyShort size="small" className="text-gray-700">
                            Når du trykker ja sendes saken til beslutter for godkjenning.
                        </BodyShort>
                    </VStack>
                </Dialog.Body>
                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button type="button" variant="secondary" disabled={mutation.isPending}>
                            Avbryt
                        </Button>
                    </Dialog.CloseTrigger>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={håndterSendTilGodkjenning}
                        loading={mutation.isPending}
                    >
                        Ja
                    </Button>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    )
}
