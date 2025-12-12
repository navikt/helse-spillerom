import React, { ReactElement, useState } from 'react'
import { BodyShort, Button, Heading, HStack, Modal } from '@navikt/ds-react'
import { ModalBody, ModalFooter } from '@navikt/ds-react/Modal'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useSykepengegrunnlag } from '@hooks/queries/useSykepengegrunnlag'
import { useSlettSykepengegrunnlag } from '@hooks/mutations/useSlettSykepengegrunnlag'
import { notNull } from '@utils/tsUtils'

import { FrihåndSykepengegrunnlagForm } from './FrihåndSykepengegrunnlagForm'
import { FrihåndSykepengegrunnlagVisning } from './FrihåndSykepengegrunnlagVisning'

export function FrihåndSykepengegrunnlagTab({ value }: { value: string }): ReactElement {
    const { data: sykepengegrunnlagResponse, isLoading } = useSykepengegrunnlag()
    const sykepengegrunnlag = sykepengegrunnlagResponse?.sykepengegrunnlag
    const harSykepengegrunnlag = notNull(sykepengegrunnlag)
    const erFrihåndSykepengegrunnlag = sykepengegrunnlag?.type === 'FRIHÅND_SYKEPENGEGRUNNLAG'
    const slettMutation = useSlettSykepengegrunnlag()
    const [slettModalOpen, setSlettModalOpen] = useState(false)

    const handleSlett = () => {
        setSlettModalOpen(true)
    }

    const handleBekreftSlett = () => {
        slettMutation.mutate(undefined, {
            onSuccess: () => {
                setSlettModalOpen(false)
            },
        })
    }

    const handleAvbrytSlett = () => {
        setSlettModalOpen(false)
    }

    return (
        <>
            <SaksbildePanel value={value}>
                {isLoading ? (
                    <div className="p-8">Laster...</div>
                ) : harSykepengegrunnlag && erFrihåndSykepengegrunnlag ? (
                    <>
                        <HStack justify="space-between" align="center">
                            <Heading size="small" level="2" spacing>
                                Frihånd sykepengegrunnlag
                            </Heading>
                            <Button variant="danger" size="small" onClick={handleSlett}>
                                Slett sykepengegrunnlag
                            </Button>
                        </HStack>
                        <FrihåndSykepengegrunnlagVisning sykepengegrunnlag={sykepengegrunnlag} />
                    </>
                ) : harSykepengegrunnlag ? (
                    <div className="p-8">
                        <HStack justify="space-between" align="center">
                            <p>
                                Sykepengegrunnlag er allerede opprettet, men det er ikke et frihånd sykepengegrunnlag.
                            </p>
                            <Button variant="danger" size="small" onClick={handleSlett}>
                                Slett sykepengegrunnlag
                            </Button>
                        </HStack>
                    </div>
                ) : (
                    <FrihåndSykepengegrunnlagForm />
                )}
            </SaksbildePanel>

            <Modal open={slettModalOpen} onClose={handleAvbrytSlett} aria-label="Slett sykepengegrunnlag">
                <Modal.Header>
                    <Heading size="medium">Slett sykepengegrunnlag</Heading>
                </Modal.Header>
                <ModalBody>
                    <BodyShort>
                        Er du sikker på at du vil slette dette sykepengegrunnlaget? Denne handlingen kan ikke angres.
                    </BodyShort>
                </ModalBody>
                <ModalFooter>
                    <HStack gap="2">
                        <Button variant="danger" onClick={handleBekreftSlett} loading={slettMutation.isPending}>
                            Slett
                        </Button>
                        <Button variant="secondary" onClick={handleAvbrytSlett} disabled={slettMutation.isPending}>
                            Avbryt
                        </Button>
                    </HStack>
                </ModalFooter>
            </Modal>
        </>
    )
}
