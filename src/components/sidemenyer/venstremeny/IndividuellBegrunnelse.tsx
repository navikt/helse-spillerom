'use client'

import { ReactElement, useEffect, useState } from 'react'
import { Button, Heading, HStack, Modal, ReadMore, Textarea } from '@navikt/ds-react'
import { ExpandIcon, ShrinkIcon } from '@navikt/aksel-icons'
import { ModalBody, ModalHeader } from '@navikt/ds-react/Modal'

import { Maybe } from '@utils/tsUtils'
import { Saksbehandlingsperiode } from '@schemas/saksbehandlingsperiode'

interface IndividuellBegrunnelseProps {
    aktivSaksbehandlingsperiode: Saksbehandlingsperiode
}

export function IndividuellBegrunnelse({
    aktivSaksbehandlingsperiode,
}: IndividuellBegrunnelseProps): Maybe<ReactElement> {
    const [begrunnelse, setBegrunnelse] = useState('')
    const [openReadMore, setOpenReadMore] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    useEffect(() => {
        const storageValue = sessionStorage.getItem(`${aktivSaksbehandlingsperiode.id}-individuell-begrunnelse`)
        const value =
            aktivSaksbehandlingsperiode.individuellBegrunnelse ?? (storageValue ? JSON.parse(storageValue) : '')
        setBegrunnelse(value)
        setOpenReadMore(value !== '')
    }, [aktivSaksbehandlingsperiode])

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
                    <Button
                        size="xsmall"
                        variant="tertiary-neutral"
                        className="absolute top-0 right-0"
                        icon={<ExpandIcon />}
                        onClick={() => setOpenModal(true)}
                    />
                )}
            </div>
            {openModal && (
                <Modal
                    aria-label="Tastatursnarveier modal"
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    portal
                    closeOnBackdropClick
                    width="800px"
                >
                    <ModalHeader closeButton={false}>
                        <HStack justify="space-between" align="center">
                            <Heading level="1" size="medium">
                                Individuell begrunnelse
                            </Heading>
                            <Button
                                size="small"
                                variant="tertiary-neutral"
                                onClick={() => setOpenModal(false)}
                                icon={<ShrinkIcon />}
                            />
                        </HStack>
                    </ModalHeader>
                    <ModalBody>
                        <BegrunnelseTextArea begrunnelse={begrunnelse} handleChange={handleChange} minRows={12} />
                    </ModalBody>
                </Modal>
            )}
        </>
    )
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
