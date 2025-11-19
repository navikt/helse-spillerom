'use client'

import { ReactElement } from 'react'
import { BodyShort, Heading, HStack, VStack } from '@navikt/ds-react'

import { TilkommenInntektResponse, TilkommenInntektYrkesaktivitetType } from '@schemas/tilkommenInntekt'
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date-format'
import { formaterBeløpKroner } from '@schemas/øreUtils'
import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'

const yrkesaktivitetTypeLabels: Record<TilkommenInntektYrkesaktivitetType, string> = {
    VIRKSOMHET: 'Virksomhet',
    PRIVATPERSON: 'Privatperson',
    NÆRINGSDRIVENDE: 'Næringsdrivende',
}

interface TilkommenInntektViewProps {
    tilkommenInntekt: TilkommenInntektResponse
}

export function TilkommenInntektView({ tilkommenInntekt }: TilkommenInntektViewProps): ReactElement {
    return (
        <div className="mb-8 p-8">
            <VStack gap="6">
                <HStack justify="space-between" align="center">
                    <Heading level="2" size="medium">
                        Tilkommen inntekt
                    </Heading>
                </HStack>

                <VStack gap="4">
                    <HStack gap="4">
                        <VStack gap="2" className="min-w-[200px]">
                            <BodyShort size="small" className="text-ax-text-neutral-subtle">
                                Organisasjonsnummer
                            </BodyShort>
                            <BodyShort>
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
                            <BodyShort className="whitespace-pre-wrap">{tilkommenInntekt.notatTilBeslutter}</BodyShort>
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
    )
}
