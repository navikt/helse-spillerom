'use client'

import { ReactElement, useState } from 'react'
import { BodyShort, Button, Heading, HStack, Modal, Textarea, VStack } from '@navikt/ds-react'
import { ModalBody, ModalFooter } from '@navikt/ds-react/Modal'

import { TilkommenInntektResponse, TilkommenInntektYrkesaktivitetType } from '@schemas/tilkommenInntekt'
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date-format'
import { formaterBeløpKroner } from '@schemas/øreUtils'
import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'
import { useSlettTilkommenInntekt } from '@hooks/mutations/useSlettTilkommenInntekt'

const yrkesaktivitetTypeLabels: Record<TilkommenInntektYrkesaktivitetType, string> = {
    VIRKSOMHET: 'Virksomhet',
    PRIVATPERSON: 'Privatperson',
    NÆRINGSDRIVENDE: 'Næringsdrivende',
}

interface TilkommenInntektViewProps {
    tilkommenInntekt: TilkommenInntektResponse
}

export function TilkommenInntektView({ tilkommenInntekt }: TilkommenInntektViewProps): ReactElement {
    const [slettModalOpen, setSlettModalOpen] = useState(false)
    const [begrunnelse, setBegrunnelse] = useState('')
    const slettMutation = useSlettTilkommenInntekt()

    const handleSlett = () => {
        setSlettModalOpen(true)
    }

    const handleBekreftSlett = () => {
        slettMutation.mutate(
            { tilkommenInntektId: tilkommenInntekt.id },
            {
                onSuccess: () => {
                    setSlettModalOpen(false)
                    setBegrunnelse('')
                },
            },
        )
    }

    const handleAvbrytSlett = () => {
        setSlettModalOpen(false)
        setBegrunnelse('')
    }

    const periodeTekst = `${getFormattedDateString(tilkommenInntekt.fom)} - ${getFormattedDateString(tilkommenInntekt.tom)}`

    return (
        <>
            <div className="mb-8 p-8">
                <VStack gap="6">
                    <HStack justify="space-between" align="center">
                        <Heading level="2" size="medium">
                            Tilkommen inntekt
                        </Heading>
                        <Button variant="tertiary" onClick={handleSlett}>
                            Fjern periode
                        </Button>
                    </HStack>

                    <VStack gap="4">
                        <HStack gap="4">
                            <VStack gap="2" className="min-w-[200px]">
                                <BodyShort size="small" className="text-ax-text-neutral-subtle">
                                    Organisasjonsnummer
                                </BodyShort>
                                <BodyShort as="span">
                                    <Organisasjonsnavn orgnummer={tilkommenInntekt.ident} medOrgnummer />
                                </BodyShort>
                            </VStack>

                            <VStack gap="2" className="min-w-[200px]">
                                <BodyShort size="small" className="text-ax-text-neutral-subtle">
                                    Yrkesaktivitetstype
                                </BodyShort>
                                <BodyShort>{yrkesaktivitetTypeLabels[tilkommenInntekt.yrkesaktivitetType]}</BodyShort>
                            </VStack>
                        </HStack>

                        <HStack gap="4">
                            <VStack gap="2" className="min-w-[200px]">
                                <BodyShort size="small" className="text-ax-text-neutral-subtle">
                                    Periode f.o.m
                                </BodyShort>
                                <BodyShort>{getFormattedDateString(tilkommenInntekt.fom)}</BodyShort>
                            </VStack>

                            <VStack gap="2" className="min-w-[200px]">
                                <BodyShort size="small" className="text-ax-text-neutral-subtle">
                                    Periode t.o.m
                                </BodyShort>
                                <BodyShort>{getFormattedDateString(tilkommenInntekt.tom)}</BodyShort>
                            </VStack>
                        </HStack>

                        <HStack gap="4">
                            <VStack gap="2" className="min-w-[200px]">
                                <BodyShort size="small" className="text-ax-text-neutral-subtle">
                                    Inntekt for perioden
                                </BodyShort>
                                <BodyShort>{formaterBeløpKroner(tilkommenInntekt.inntektForPerioden)}</BodyShort>
                            </VStack>
                        </HStack>

                        {tilkommenInntekt.notatTilBeslutter && (
                            <VStack gap="2">
                                <BodyShort size="small" className="text-ax-text-neutral-subtle">
                                    Notat til beslutter
                                </BodyShort>
                                <BodyShort className="whitespace-pre-wrap">
                                    {tilkommenInntekt.notatTilBeslutter}
                                </BodyShort>
                            </VStack>
                        )}

                        <HStack gap="4">
                            <VStack gap="2" className="min-w-[200px]">
                                <BodyShort size="small" className="text-ax-text-neutral-subtle">
                                    Opprettet
                                </BodyShort>
                                <BodyShort>{getFormattedDatetimeString(tilkommenInntekt.opprettet)}</BodyShort>
                            </VStack>

                            <VStack gap="2" className="min-w-[200px]">
                                <BodyShort size="small" className="text-ax-text-neutral-subtle">
                                    Opprettet av
                                </BodyShort>
                                <BodyShort>{tilkommenInntekt.opprettetAvNavIdent}</BodyShort>
                            </VStack>
                        </HStack>
                    </VStack>
                </VStack>
            </div>

            <Modal open={slettModalOpen} onClose={handleAvbrytSlett} aria-label="Fjern periode">
                <Modal.Header>
                    <Heading size="medium">Fjern periode</Heading>
                </Modal.Header>
                <ModalBody>
                    <VStack gap="4">
                        <BodyShort>Vil du fjerne perioden {periodeTekst}?</BodyShort>
                        <VStack gap="2">
                            <BodyShort size="small" weight="semibold">
                                Begrunn hvorfor perioden fjernes
                            </BodyShort>
                            <BodyShort size="small" className="text-ax-text-neutral-subtle">
                                Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn.
                            </BodyShort>
                            <Textarea
                                label=""
                                value={begrunnelse}
                                onChange={(e) => setBegrunnelse(e.target.value)}
                                minRows={3}
                            />
                        </VStack>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="primary" onClick={handleBekreftSlett} loading={slettMutation.isPending}>
                        Ja
                    </Button>
                    <Button variant="secondary" onClick={handleAvbrytSlett} disabled={slettMutation.isPending}>
                        Nei
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
