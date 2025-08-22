import { useState } from 'react'
import { Button, Modal, Textarea, VStack, Heading, BodyShort } from '@navikt/ds-react'
import { ModalBody, ModalHeader, ModalFooter } from '@navikt/ds-react/Modal'

interface SendTilbakeModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (kommentar: string) => void
    isLoading?: boolean
}

export function SendTilbakeModal({ isOpen, onClose, onConfirm, isLoading }: SendTilbakeModalProps) {
    const [kommentar, setKommentar] = useState('')

    const handleConfirm = () => {
        if (kommentar.trim()) {
            onConfirm(kommentar.trim())
            setKommentar('')
        }
    }

    const handleClose = () => {
        setKommentar('')
        onClose()
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-label="Send tilbake til saksbehandler"
            portal
            closeOnBackdropClick
        >
            <ModalHeader>
                <Heading size="medium">Send tilbake til saksbehandler</Heading>
            </ModalHeader>
            <ModalBody>
                <VStack gap="4">
                    <BodyShort size="small" className="text-gray-700">
                        Du må oppgi en kommentar når du sender saken tilbake til saksbehandler.
                    </BodyShort>
                    <Textarea
                        label="Kommentar"
                        value={kommentar}
                        onChange={(e) => setKommentar(e.target.value)}
                        placeholder="Skriv inn kommentar til saksbehandler..."
                        rows={4}
                        maxLength={1000}
                        error={
                            kommentar.length > 0 && kommentar.trim().length === 0
                                ? 'Kommentar kan ikke være tom'
                                : undefined
                        }
                    />
                </VStack>
            </ModalBody>
            <ModalFooter>
                <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                    Avbryt
                </Button>
                <Button
                    variant="primary"
                    onClick={handleConfirm}
                    loading={isLoading}
                    disabled={isLoading || !kommentar.trim()}
                >
                    Send tilbake
                </Button>
            </ModalFooter>
        </Modal>
    )
}
