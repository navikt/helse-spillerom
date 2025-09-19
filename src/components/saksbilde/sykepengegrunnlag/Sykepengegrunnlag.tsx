'use client'

import React, { ReactElement, useState } from 'react'
import { Alert, Bleed, BodyLong, BodyShort, BoxNew, Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { BriefcaseIcon, PersonPencilIcon } from '@navikt/aksel-icons'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'
import { cn } from '@utils/tw'
import { SykepengegrunnlagForm } from '@components/saksbilde/sykepengegrunnlag/form/SykepengegrunnlagForm'
import { useSykepengegrunnlag } from '@hooks/queries/useSykepengegrunnlag'
import { formaterBeløpØre } from '@schemas/sykepengegrunnlag'
import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'
import { getFormattedDateString, getFormattedNorwegianLongDate } from '@utils/date-format'
import { FetchError } from '@components/saksbilde/FetchError'
import { SykepengegrunnlagSkeleton } from '@components/saksbilde/sykepengegrunnlag/SykepengegrunnlagSkeleton'

interface SykepengegrunnlagProps {
    value: string
}

export function Sykepengegrunnlag({ value }: SykepengegrunnlagProps): ReactElement {
    const [erIRedigeringsmodus, setErIRedigeringsmodus] = useState(false)
    const {
        data: yrkesaktivitet,
        isLoading: yrkesaktivitetLoading,
        isError: yrkesaktivitetError,
        refetch: yrkesaktivitetRefetch,
    } = useYrkesaktivitet()
    const {
        data: sykepengegrunnlag,
        isLoading: sykepengegrunnlagLoading,
        isError: sykepengegrunnlagError,
        refetch,
    } = useSykepengegrunnlag()
    const kanSaksbehandles = useKanSaksbehandles()

    if (sykepengegrunnlagLoading || yrkesaktivitetLoading || !yrkesaktivitet) {
        return (
            <SaksbildePanel value={value}>
                <SykepengegrunnlagSkeleton />
            </SaksbildePanel>
        )
    }

    if (yrkesaktivitetError || sykepengegrunnlagError) {
        return (
            <SaksbildePanel value={value}>
                <FetchError
                    refetch={() => void Promise.all([refetch(), yrkesaktivitetRefetch()])}
                    message="Kunne ikke laste sykepengegrunnlag."
                />
            </SaksbildePanel>
        )
    }

    if (yrkesaktivitet.length === 0) {
        return (
            <SaksbildePanel value={value}>
                <Alert variant="info">
                    <BodyShort>Du kan ikke sette sykepengegrunnlag før yrkesaktiviteter er satt.</BodyShort>
                </Alert>
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
                    {kanSaksbehandles && (
                        <Button
                            size="small"
                            type="button"
                            variant="tertiary"
                            icon={<PersonPencilIcon aria-hidden />}
                            onClick={() => setErIRedigeringsmodus(!erIRedigeringsmodus)}
                        >
                            {erIRedigeringsmodus ? 'Avbryt' : 'Rediger'}
                        </Button>
                    )}
                </HStack>
                {!erIRedigeringsmodus && (
                    <>
                        <VStack gap="3">
                            {yrkesaktivitet.map((forhold, i) => {
                                const inntektFraSykepengegrunnlag = sykepengegrunnlag?.inntekter.find(
                                    (inntekt) => inntekt.yrkesaktivitetId === forhold.id,
                                )
                                return (
                                    <React.Fragment key={forhold.id}>
                                        <VStack gap="3">
                                            <HStack justify="space-between">
                                                <NavnOgIkon orgnummer={forhold.kategorisering['ORGNUMMER'] as string} />
                                                <BodyShort>
                                                    {formaterBeløpØre(inntektFraSykepengegrunnlag?.beløpPerMånedØre)}
                                                </BodyShort>
                                            </HStack>
                                            {(inntektFraSykepengegrunnlag?.refusjon ?? []).length > 0 && (
                                                <VStack className="ml-8" gap="1">
                                                    <BodyShort weight="semibold" size="small">
                                                        Refusjon
                                                    </BodyShort>
                                                    <VStack gap="1">
                                                        {inntektFraSykepengegrunnlag?.refusjon?.map((refusjon, i) => (
                                                            <HStack
                                                                key={i}
                                                                justify="space-between"
                                                                className="max-w-70"
                                                            >
                                                                <BodyShort size="small">
                                                                    {refusjon.tom
                                                                        ? `${getFormattedDateString(refusjon.fom)} - ${getFormattedDateString(refusjon.tom)}: `
                                                                        : `${getFormattedDateString(refusjon.fom)} - til nå: `}
                                                                </BodyShort>
                                                                <BodyShort size="small">
                                                                    {formaterBeløpØre(refusjon.beløpØre)}
                                                                </BodyShort>
                                                            </HStack>
                                                        ))}
                                                    </VStack>
                                                </VStack>
                                            )}
                                        </VStack>
                                        {i < yrkesaktivitet.length - 1 && (
                                            <span className="h-px bg-ax-border-neutral-subtle" />
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </VStack>
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
                        yrkesaktivitet={yrkesaktivitet}
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
                {sykepengegrunnlag && (
                    <BodyLong size="small" className="text-ax-text-neutral-subtle">
                        {sykepengegrunnlag.begrensetTil6G && (
                            <>
                                Sykepengegrunnlaget er begrenset til 6G:{' '}
                                {formaterBeløpØre(sykepengegrunnlag.grunnbeløp6GØre, 0)} §8-10 <br />
                            </>
                        )}
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
