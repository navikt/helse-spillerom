'use client'

import { ReactElement, useState } from 'react'
import { Button, Dialog, HStack, ReadMore, Textarea } from '@navikt/ds-react'
import { ExpandIcon, ShrinkIcon } from '@navikt/aksel-icons'

import { Behandling } from '@schemas/behandling'

interface IndividuellBegrunnelseProps {
    aktivSaksbehandlingsperiode: Behandling
}

export function IndividuellBegrunnelse({
    aktivSaksbehandlingsperiode,
}: IndividuellBegrunnelseProps): ReactElement | null {
    const [begrunnelse, setBegrunnelse] = useState(() => getBegrunnelseFromStorage(aktivSaksbehandlingsperiode))
    const [openReadMore, setOpenReadMore] = useState(
        () => getBegrunnelseFromStorage(aktivSaksbehandlingsperiode) !== '',
    )

    function handleChange(value: string) {
        setBegrunnelse(value)
        sessionStorage.setItem(`${aktivSaksbehandlingsperiode.id}-individuell-begrunnelse`, JSON.stringify(value))
    }

    return (
        <>
            <div className="relative">
                <ReadMore
                    header="Individuell begrunnelse"
                    size="small"
                    className="[&>div]:m-0 [&>div]:border-none [&>div]:p-0"
                    open={openReadMore}
                    onOpenChange={setOpenReadMore}
                >
                    <BegrunnelseTextArea begrunnelse={begrunnelse} handleChange={handleChange} />
                </ReadMore>
                {openReadMore && (
                    <Dialog>
                        <Dialog.Trigger>
                            <Button
                                size="xsmall"
                                variant="tertiary-neutral"
                                className="absolute top-0 right-0"
                                icon={<ExpandIcon />}
                            />
                        </Dialog.Trigger>
                        <Dialog.Popup width="large" position="center">
                            <Dialog.Header withClosebutton={false}>
                                <HStack justify="space-between" align="center">
                                    <Dialog.Title>Individuell begrunnelse</Dialog.Title>
                                    <Dialog.CloseTrigger>
                                        <Button size="small" variant="tertiary-neutral" icon={<ShrinkIcon />} />
                                    </Dialog.CloseTrigger>
                                </HStack>
                            </Dialog.Header>
                            <Dialog.Body>
                                <BegrunnelseTextArea
                                    begrunnelse={begrunnelse}
                                    handleChange={handleChange}
                                    minRows={12}
                                />
                            </Dialog.Body>
                        </Dialog.Popup>
                    </Dialog>
                )}
            </div>
        </>
    )
}

function getBegrunnelseFromStorage(periode: Behandling) {
    const storageValue = sessionStorage.getItem(`${periode.id}-individuell-begrunnelse`)
    return periode.individuellBegrunnelse ?? (storageValue ? JSON.parse(storageValue) : '')
}

interface BegrunnelseTextAreaProps {
    begrunnelse?: string
    minRows?: number
    handleChange: (value: string) => void
}

function BegrunnelseTextArea({ begrunnelse, handleChange, minRows = 6 }: BegrunnelseTextAreaProps): ReactElement {
    return (
        <Textarea
            size="small"
            label=""
            description="Teksten vises til den sykmeldte i «Svar på søknad om sykepenger»."
            value={begrunnelse}
            onChange={(e) => handleChange(e.target.value)}
            minRows={minRows}
        />
    )
}
