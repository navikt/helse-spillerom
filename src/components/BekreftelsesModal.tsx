import { Alert, Button, Dialog } from '@navikt/ds-react'
import {
    DialogBody,
    DialogCloseTrigger,
    DialogFooter,
    DialogHeader,
    DialogPopup,
    DialogTitle,
} from '@navikt/ds-react/Dialog'
import { Dispatch, ReactElement, SetStateAction } from 'react'

interface BekreftelsesModalProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    tittel: string
    melding: string
    onBekreft: () => void
}

export function BekreftelsesModal({ open, tittel, melding, onBekreft, setOpen }: BekreftelsesModalProps): ReactElement {
    return (
        <Dialog open={open} onOpenChange={setOpen} aria-label={tittel}>
            <DialogPopup>
                <DialogHeader>
                    <DialogTitle>{tittel}</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Alert variant="warning">{melding}</Alert>
                </DialogBody>
                <DialogFooter>
                    <DialogCloseTrigger>
                        <Button type="button" variant="secondary">
                            Avbryt
                        </Button>
                    </DialogCloseTrigger>
                    <Button data-color="danger" type="button" variant="primary" onClick={onBekreft}>
                        Bekreft
                    </Button>
                </DialogFooter>
            </DialogPopup>
        </Dialog>
    );
}
