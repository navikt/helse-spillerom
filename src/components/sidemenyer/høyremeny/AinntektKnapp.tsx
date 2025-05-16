'use client'

import { ReactElement, useState } from 'react'
import { Button, Modal } from '@navikt/ds-react'

import { useAinntekt } from '@hooks/queries/useAinntekt'

export function AinntektKnapp(): ReactElement {
    const [open, setOpen] = useState(false)
    const { data: ainntekt, isLoading } = useAinntekt()

    return (
        <>
            <Button variant="secondary" onClick={() => setOpen(true)}>
                A-inntekt
            </Button>
            <Modal open={open} onClose={() => setOpen(false)} header={{ heading: 'A-inntekt' }}>
                <Modal.Body>
                    {isLoading ? (
                        <div>Laster A-inntekt...</div>
                    ) : !ainntekt ? (
                        <div>Ingen A-inntekt funnet</div>
                    ) : (
                        <pre className="whitespace-pre-wrap">{JSON.stringify(ainntekt, null, 2)}</pre>
                    )}
                </Modal.Body>
            </Modal>
        </>
    )
}
