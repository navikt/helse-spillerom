import React, { ReactElement, useState } from 'react'
import { BodyShort, Button, Dialog, Heading, HStack } from '@navikt/ds-react'

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

    const handleBekreftSlett = () => {
        slettMutation.mutate(undefined, {
            onSuccess: () => {
                setSlettModalOpen(false)
            },
        })
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
                            <Button variant="danger" size="small" onClick={() => setSlettModalOpen(true)}>
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
                            <Button variant="danger" size="small" onClick={() => setSlettModalOpen(true)}>
                                Slett sykepengegrunnlag
                            </Button>
                        </HStack>
                    </div>
                ) : (
                    <FrihåndSykepengegrunnlagForm />
                )}
            </SaksbildePanel>

            <Dialog open={slettModalOpen} onOpenChange={setSlettModalOpen} aria-label="Slett sykepengegrunnlag">
                <Dialog.Popup>
                    <Dialog.Header>
                        <Dialog.Title>Slett sykepengegrunnlag</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <BodyShort>
                            Er du sikker på at du vil slette dette sykepengegrunnlaget? Denne handlingen kan ikke
                            angres.
                        </BodyShort>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.CloseTrigger>
                            <Button type="button" variant="secondary" disabled={slettMutation.isPending}>
                                Avbryt
                            </Button>
                        </Dialog.CloseTrigger>
                        <Button
                            type="button"
                            variant="danger"
                            onClick={handleBekreftSlett}
                            loading={slettMutation.isPending}
                        >
                            Slett
                        </Button>
                    </Dialog.Footer>
                </Dialog.Popup>
            </Dialog>
        </>
    )
}
