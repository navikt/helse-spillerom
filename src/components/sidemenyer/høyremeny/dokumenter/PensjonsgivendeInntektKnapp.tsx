'use client'

import { ReactElement, useState } from 'react'
import { Button, Modal } from '@navikt/ds-react'
import { ExternalLinkIcon } from '@navikt/aksel-icons'

import { usePensjonsgivendeInntekt } from '@hooks/queries/usePensjonsgivendeInntekt'

export function PensjonsgivendeInntektKnapp(): ReactElement {
    const [open, setOpen] = useState(false)
    const { data: pensjonsgivendeInntekt, isLoading } = usePensjonsgivendeInntekt()

    return (
        <>
            <div className="inline-block">
                <Button
                    variant="tertiary"
                    size="small"
                    onClick={() => setOpen(true)}
                    aria-label="Vis pensjonsgivende inntekt"
                    icon={<ExternalLinkIcon aria-hidden />}
                >
                    Pensjonsgivende inntekt
                </Button>
            </div>
            <Modal open={open} onClose={() => setOpen(false)} header={{ heading: 'Pensjonsgivende inntekt' }}>
                <Modal.Body>
                    {isLoading ? (
                        <div role="status" aria-live="polite">
                            Laster pensjonsgivende inntekt...
                        </div>
                    ) : !pensjonsgivendeInntekt ? (
                        <div>Ingen pensjonsgivende inntekt funnet</div>
                    ) : (
                        <div role="region" aria-label="Pensjonsgivende inntekt oversikt">
                            <pre>{JSON.stringify(pensjonsgivendeInntekt, null, 2)}</pre>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </>
    )
}
