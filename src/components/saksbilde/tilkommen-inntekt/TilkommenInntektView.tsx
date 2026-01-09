'use client'

import React, { ReactElement, useState } from 'react'
import { BodyShort, Button, Heading, HStack, VStack } from '@navikt/ds-react'

import { TilkommenInntektResponse, TilkommenInntektYrkesaktivitetType } from '@schemas/tilkommenInntekt'
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date-format'
import { formaterBeløpKroner } from '@schemas/pengerUtils'
import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'
import { SlettTilkommenDialog } from '@components/saksbilde/tilkommen-inntekt/SlettTilkommenDialog'

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

    return (
        <>
            <div className="mb-8 p-8">
                <VStack gap="6">
                    <HStack justify="space-between" align="center">
                        <Heading level="2" size="medium">
                            Tilkommen inntekt
                        </Heading>
                        <Button
                            size="small"
                            variant="tertiary"
                            onClick={() => setSlettModalOpen(true)}
                            aria-haspopup="dialog"
                            aria-expanded={slettModalOpen}
                            aria-controls={slettModalOpen ? 'slett-tilkommen-dialog-popup' : undefined}
                        >
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

            <SlettTilkommenDialog
                open={slettModalOpen}
                setOpen={setSlettModalOpen}
                tilkommenInntekt={tilkommenInntekt}
            />
        </>
    )
}
