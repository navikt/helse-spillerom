import { ReactElement } from 'react'
import { Modal, VStack, HStack, BodyShort, Button, Heading } from '@navikt/ds-react'
import { ModalBody, ModalHeader, ModalFooter } from '@navikt/ds-react/Modal'

import { Utbetalingsinformasjon } from './Utbetalingsinformasjon'

interface SendTilGodkjenningModalProps {
    åpen: boolean
    onLukk: () => void
    onSendTilGodkjenning: () => void
}

export function SendTilGodkjenningModal({
    åpen,
    onLukk,
    onSendTilGodkjenning,
}: SendTilGodkjenningModalProps): ReactElement {
    const håndterJa = () => {
        onSendTilGodkjenning()
        onLukk()
    }

    return (
        <Modal aria-label="Send til godkjenning modal" open={åpen} onClose={onLukk} portal closeOnBackdropClick>
            <ModalHeader>
                <Heading size="medium">Er du sikker?</Heading>
            </ModalHeader>
            <ModalBody>
                <VStack gap="4">
                    <Utbetalingsinformasjon />

                    <BodyShort size="small" className="text-gray-700">
                        Når du trykker ja sendes saken til beslutter for godkjenning.
                    </BodyShort>
                </VStack>
            </ModalBody>
            <ModalFooter>
                <HStack gap="2">
                    <Button variant="primary" onClick={håndterJa}>
                        Ja
                    </Button>
                    <Button variant="secondary" onClick={onLukk}>
                        Avbryt
                    </Button>
                </HStack>
            </ModalFooter>
        </Modal>
    )
}
