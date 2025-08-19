'use client'

import React, { ReactElement, useState } from 'react'
import { Alert, Bleed, BodyLong, BodyShort, BoxNew, Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { BriefcaseIcon, PersonPencilIcon } from '@navikt/aksel-icons'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'
import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'

interface SykepengegrunnlagProps {
    value: string
}

export function Sykepengegrunnlag({ value }: SykepengegrunnlagProps): ReactElement {
    const [erIRedigeringsmodus, setErIRedigeringsmodus] = useState(false)
    const {
        data: inntektsforhold,
        isLoading: inntektsforholdLoading,
        isError: inntektsforholdError,
    } = useInntektsforhold()

    if (inntektsforholdLoading || !inntektsforhold) {
        return <SaksbildePanel value={value}>Laster inntektsforhold...</SaksbildePanel>
    }

    if (inntektsforholdError) {
        return (
            <SaksbildePanel value={value}>
                <Alert variant="error">Kunne ikke laste inntektsforhold</Alert>
            </SaksbildePanel>
        )
    }

    return (
        <SaksbildePanel value={value}>
            <VStack gap="6" className="max-w-[500px]">
                <HStack gap="4">
                    <Heading size="small" level="1">
                        Inntekter
                    </Heading>
                    <Button
                        size="small"
                        type="button"
                        variant="tertiary"
                        icon={<PersonPencilIcon aria-hidden />}
                        onClick={() =>
                            erIRedigeringsmodus ? setErIRedigeringsmodus(false) : setErIRedigeringsmodus(true)
                        }
                    >
                        {erIRedigeringsmodus ? 'Avbryt' : 'Rediger'}
                    </Button>
                </HStack>
                {inntektsforhold.map((forhold) => {
                    const orgnummer = forhold.kategorisering['ORGNUMMER'] as string
                    return (
                        <HStack key={forhold.id} justify="space-between">
                            <HStack gap="2">
                                <BriefcaseIcon aria-hidden fontSize="1.5rem" />
                                <BodyShort>
                                    <Organisasjonsnavn orgnummer={orgnummer} />
                                </BodyShort>
                            </HStack>
                            <BodyShort>-</BodyShort>
                        </HStack>
                    )
                })}
                <span className="border-t border-t-ax-bg-neutral-strong" />
                <HStack justify="space-between">
                    <BodyShort weight="semibold">Totalt</BodyShort>
                    <BodyShort>-</BodyShort>
                </HStack>
            </VStack>
            <VStack gap="6" className="mt-6 max-w-[500px]">
                <Bleed marginInline="4 32" asChild reflectivePadding>
                    <BoxNew background="neutral-soft" className="py-4" borderRadius="large" marginBlock="4 0">
                        <HStack justify="space-between">
                            <BodyShort weight="semibold">Sykepengegrunnlag</BodyShort>
                            <BodyShort>-</BodyShort>
                        </HStack>
                    </BoxNew>
                </Bleed>
                <BodyLong className="text-ax-text-neutral-subtle">
                    Sykepengegrunnlaget er begrenset til 6G: 780 960 kr §8-10 Grunnbeløp (G) ved skjæringstidspunkt: 130
                    160 kr (1. mai 2025)
                </BodyLong>
            </VStack>
        </SaksbildePanel>
    )
}
