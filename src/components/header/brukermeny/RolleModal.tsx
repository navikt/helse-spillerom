'use client'

import React from 'react'
import { Modal, VStack, Checkbox, Alert, Button } from '@navikt/ds-react'
import { ModalBody, ModalFooter } from '@navikt/ds-react/Modal'
import { useForm } from 'react-hook-form'

import { useBrukerRoller } from '@hooks/queries/useBrukerRoller'
import { useOppdaterBrukerRoller } from '@hooks/mutations/useOppdaterBrukerRoller'
import { Rolle } from '@/schemas/bruker'

interface RolleModalProps {
    open: boolean
    onClose: () => void
}

interface RolleFormData {
    leserolle: boolean
    saksbehandler: boolean
    beslutter: boolean
}

export function RolleModal({ open, onClose }: RolleModalProps): React.ReactElement {
    const { data: brukerRoller } = useBrukerRoller()
    const oppdaterRoller = useOppdaterBrukerRoller()

    const { register, handleSubmit, reset } = useForm<RolleFormData>({
        defaultValues: {
            leserolle: brukerRoller.leserolle,
            saksbehandler: brukerRoller.saksbehandler,
            beslutter: brukerRoller.beslutter,
        },
    })

    const onSubmit = async (data: RolleFormData) => {
        const roller: Rolle[] = []

        if (data.leserolle) roller.push('LES')
        if (data.saksbehandler) roller.push('SAKSBEHANDLER')
        if (data.beslutter) roller.push('BESLUTTER')

        await oppdaterRoller.mutateAsync({ roller })
        onClose()
    }

    const handleAvbryt = () => {
        // Reset form til opprinnelige verdier
        reset({
            leserolle: brukerRoller.leserolle,
            saksbehandler: brukerRoller.saksbehandler,
            beslutter: brukerRoller.beslutter,
        })
        onClose()
    }

    return (
        <Modal
            open={open}
            onClose={handleAvbryt}
            header={{ heading: 'Endre brukerroller', closeButton: true }}
            className="max-w-md"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                    <VStack gap="4">
                        <Alert variant="info" size="small">
                            Her kan du endre rollene for demo-modus. Endringene lagres på sesjonen.
                        </Alert>

                        <VStack gap="3">
                            <Checkbox {...register('leserolle')}>Leserolle</Checkbox>

                            <Checkbox {...register('saksbehandler')}>Saksbehandler</Checkbox>

                            <Checkbox {...register('beslutter')}>Beslutter</Checkbox>
                        </VStack>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button type="submit" variant="primary" loading={oppdaterRoller.isPending}>
                        Lagre
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleAvbryt}
                        disabled={oppdaterRoller.isPending}
                    >
                        Avbryt
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}
