import { Dispatch, ReactElement, SetStateAction } from 'react'
import { BodyShort, Button, Dialog, VStack } from '@navikt/ds-react'
import {
    DialogBody,
    DialogCloseTrigger,
    DialogFooter,
    DialogHeader,
    DialogPopup,
    DialogTitle,
} from '@navikt/ds-react/Dialog'

import { Valideringer } from '@components/valideringer/Valideringer'

import { BeløpForPerioden } from './BeløpForPerioden'

interface SendTilGodkjenningModalProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    sendTilGodkjenning: () => void
}

export function SendTilGodkjenningModal({
    open,
    setOpen,
    sendTilGodkjenning,
}: SendTilGodkjenningModalProps): ReactElement {
    return (
        <Dialog aria-label="Send til godkjenning modal" open={open} onOpenChange={setOpen}>
            <DialogPopup width="small">
                <DialogHeader>
                    <DialogTitle>Er du sikker?</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <VStack gap="4">
                        <BeløpForPerioden />
                        <Valideringer sluttvalidering={true} />
                        <BodyShort size="small" className="text-gray-700">
                            Når du trykker ja sendes saken til beslutter for godkjenning.
                        </BodyShort>
                    </VStack>
                </DialogBody>
                <DialogFooter>
                    <DialogCloseTrigger>
                        <Button type="button" variant="secondary">
                            Avbryt
                        </Button>
                    </DialogCloseTrigger>
                    <Button type="button" variant="primary" onClick={sendTilGodkjenning}>
                        Ja
                    </Button>
                </DialogFooter>
            </DialogPopup>
        </Dialog>
    )
}
