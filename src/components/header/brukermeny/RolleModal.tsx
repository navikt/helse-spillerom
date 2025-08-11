'use client'

import React from 'react'
import { Modal, VStack, Alert, Button, HStack, BodyShort, Heading } from '@navikt/ds-react'
import { ModalBody, ModalFooter } from '@navikt/ds-react/Modal'
import { PersonIcon, CheckmarkIcon } from '@navikt/aksel-icons'

import { useOppdaterBrukerRoller } from '@hooks/mutations/useOppdaterBrukerRoller'
import { predefinerteBrukere } from '@/mock-api/predefinerte-brukere'
import { useBrukerinfo } from '@hooks/queries/useBrukerinfo'

interface RolleModalProps {
    open: boolean
    onClose: () => void
}

export function RolleModal({ open, onClose }: RolleModalProps): React.ReactElement {
    const { data: aktivBruker } = useBrukerinfo()
    const oppdaterBruker = useOppdaterBrukerRoller()

    const handleBrukerValg = async (navIdent: string) => {
        await oppdaterBruker.mutateAsync({ navIdent })
        onClose()
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            header={{ heading: 'Velg bruker', closeButton: true }}
            className="max-w-lg"
        >
            <ModalBody>
                <VStack gap="4">
                    <Alert variant="info" size="small">
                        Her kan du velge mellom forskjellige brukere i demo-modus.
                    </Alert>

                    <VStack gap="3">
                        {predefinerteBrukere.map((bruker) => (
                            <Button
                                key={bruker.navIdent}
                                variant={aktivBruker?.navIdent === bruker.navIdent ? 'primary' : 'secondary'}
                                size="medium"
                                onClick={() => handleBrukerValg(bruker.navIdent)}
                                loading={oppdaterBruker.isPending}
                                disabled={oppdaterBruker.isPending}
                                className="w-full justify-start"
                            >
                                <HStack gap="3" align="center" className="w-full">
                                    <PersonIcon aria-hidden />
                                    <VStack gap="1" className="flex-1 text-left">
                                        <HStack gap="2" align="center">
                                            <Heading size="xsmall" className="text-current">
                                                {bruker.navn}
                                            </Heading>
                                            {aktivBruker?.navIdent === bruker.navIdent && (
                                                <CheckmarkIcon aria-hidden className="text-green-600" />
                                            )}
                                        </HStack>
                                        <BodyShort size="small" className="text-current opacity-75">
                                            {bruker.navIdent} • {bruker.roller.join(', ')}
                                        </BodyShort>
                                    </VStack>
                                </HStack>
                            </Button>
                        ))}
                    </VStack>
                </VStack>
            </ModalBody>

            <ModalFooter>
                <Button type="button" variant="secondary" onClick={onClose} disabled={oppdaterBruker.isPending}>
                    Lukk
                </Button>
            </ModalFooter>
        </Modal>
    )
}
