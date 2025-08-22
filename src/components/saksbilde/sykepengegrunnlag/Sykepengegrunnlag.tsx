'use client'

import React, { ReactElement, useState } from 'react'
import { Alert, Bleed, BodyLong, BodyShort, BoxNew, Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { BriefcaseIcon, PersonPencilIcon } from '@navikt/aksel-icons'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'
import { cn } from '@utils/tw'
import { SykepengegrunnlagForm } from '@components/saksbilde/sykepengegrunnlag/SykepengegrunnlagForm'
import { useSykepengegrunnlag } from '@hooks/queries/useSykepengegrunnlag'
import { formaterBeløpØre } from '@schemas/sykepengegrunnlag'
import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'
import { getFormattedNorwegianLongDate } from '@utils/date-format'

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
    const {
        data: sykepengegrunnlag,
        isLoading: sykepengegrunnlagLoading,
        isError: sykepengegrunnlagError,
    } = useSykepengegrunnlag()

    if (sykepengegrunnlagLoading || inntektsforholdLoading || !inntektsforhold) {
        return <SaksbildePanel value={value}>Laster inntektsforhold...</SaksbildePanel>
    }

    if (inntektsforholdError || sykepengegrunnlagError) {
        return (
            <SaksbildePanel value={value}>
                <Alert variant="error">Kunne ikke laste sykepengegrunnlag</Alert>
            </SaksbildePanel>
        )
    }

    return (
        <SaksbildePanel value={value} className="mb-8 p-0">
            <VStack
                gap="6"
                className={cn('max-w-[508px] px-8 pt-8', {
                    'max-w-[780px] border-l-6 border-ax-border-accent bg-ax-bg-neutral-soft pl-[26px]':
                        erIRedigeringsmodus,
                })}
            >
                <HStack gap="4">
                    <Heading size="small" level="1">
                        Inntekter
                    </Heading>
                    <Button
                        size="small"
                        type="button"
                        variant="tertiary"
                        icon={<PersonPencilIcon aria-hidden />}
                        onClick={() => setErIRedigeringsmodus(!erIRedigeringsmodus)}
                    >
                        {erIRedigeringsmodus ? 'Avbryt' : 'Rediger'}
                    </Button>
                </HStack>
                {!erIRedigeringsmodus && (
                    <>
                        {inntektsforhold.map((forhold) => {
                            const inntektFraSykepengegrunnlag = sykepengegrunnlag?.inntekter.find(
                                (inntekt) => inntekt.inntektsforholdId === forhold.id,
                            )
                            return (
                                <HStack key={forhold.id} justify="space-between">
                                    <NavnOgIkon orgnummer={forhold.kategorisering['ORGNUMMER'] as string} />
                                    <BodyShort>
                                        {formaterBeløpØre(inntektFraSykepengegrunnlag?.beløpPerMånedØre)}
                                    </BodyShort>
                                </HStack>
                            )
                        })}
                        <span className="border-t border-t-ax-bg-neutral-strong" />
                        <HStack justify="space-between">
                            <BodyShort weight="semibold">Totalt</BodyShort>
                            <BodyShort>{formaterBeløpØre(sykepengegrunnlag?.totalInntektØre)}</BodyShort>
                        </HStack>
                    </>
                )}
                {erIRedigeringsmodus && (
                    <SykepengegrunnlagForm
                        sykepengegrunnlag={sykepengegrunnlag}
                        inntektsforhold={inntektsforhold}
                        avbryt={() => setErIRedigeringsmodus(false)}
                    />
                )}
            </VStack>
            <VStack gap="6" className={cn('mt-6 max-w-[508px] px-8', { 'max-w-[686px]': erIRedigeringsmodus })}>
                <Bleed marginInline="4 32" asChild reflectivePadding>
                    <BoxNew background="neutral-soft" className="py-4" borderRadius="large" marginBlock="4 0">
                        <HStack justify="space-between">
                            <BodyShort weight="semibold">Sykepengegrunnlag</BodyShort>
                            <BodyShort>{formaterBeløpØre(sykepengegrunnlag?.sykepengegrunnlagØre)}</BodyShort>
                        </HStack>
                    </BoxNew>
                </Bleed>
                {sykepengegrunnlag && sykepengegrunnlag.begrensetTil6G && (
                    <BodyLong size="small" className="text-ax-text-neutral-subtle">
                        Sykepengegrunnlaget er begrenset til 6G:{' '}
                        {formaterBeløpØre(sykepengegrunnlag.grunnbeløp6GØre, 0)} §8-10 <br />
                        Grunnbeløp (G) ved skjæringstidspunkt: {formaterBeløpØre(sykepengegrunnlag.grunnbeløpØre, 0)} (
                        {getFormattedNorwegianLongDate(sykepengegrunnlag.grunnbeløpVirkningstidspunkt)})
                    </BodyLong>
                )}
            </VStack>
        </SaksbildePanel>
    )
}

export function NavnOgIkon({ orgnummer, className }: { orgnummer: string; className?: string }): ReactElement {
    return (
        <HStack gap="2" className={className} wrap={false}>
            <BriefcaseIcon aria-hidden fontSize="1.5rem" />
            <BodyShort>
                <Organisasjonsnavn orgnummer={orgnummer} />
            </BodyShort>
        </HStack>
    )
}
