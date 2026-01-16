import React, { ReactElement } from 'react'
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react'

import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'
import { formaterBeløpKroner } from '@schemas/pengerUtils'
import { ArbeidsledigInntektType, InntektRequest } from '@schemas/inntektRequest'

type ArbeidsledigInntektViewProps = {
    inntektRequest?: InntektRequestFor<'ARBEIDSLEDIG'>
}

export function ArbeidsledigInntektView({ inntektRequest }: ArbeidsledigInntektViewProps): ReactElement {
    const inntektRequestData = inntektRequest?.data

    if (!inntektRequestData) {
        return (
            <VStack gap="space-8" className="w-fit">
                <BodyShort weight="semibold">Dagbeløp</BodyShort>
                <BodyShort className="text-right">-</BodyShort>
            </VStack>
        )
    }

    const { årsinntekt, dagbeløp, begrunnelse } = normalize(inntektRequestData)

    return (
        <>
            {årsinntekt && (
                <VStack gap="space-4">
                    <BodyShort weight="semibold">Årsinntekt</BodyShort>
                    <HStack gap="space-8">
                        <BodyShort className="w-[103px] text-right">{formaterBeløpKroner(årsinntekt)}</BodyShort>
                        <Tag data-color="neutral" variant="outline" size="xsmall">
                            manuelt beregnet
                        </Tag>
                    </HStack>
                </VStack>
            )}
            {dagbeløp && (
                <VStack gap="space-4">
                    <BodyShort weight="semibold">Dagbeløp</BodyShort>
                    <HStack gap="space-8">
                        <BodyShort className="w-[103px] text-right">{formaterBeløpKroner(dagbeløp)}</BodyShort>
                        <Tag data-color="neutral" variant="outline" size="xsmall">
                            manuelt beregnet
                        </Tag>
                    </HStack>
                </VStack>
            )}
            {begrunnelse && (
                <VStack gap="space-4">
                    <BodyShort weight="semibold">Begrunnelse</BodyShort>
                    <BodyShort>{begrunnelse}</BodyShort>
                </VStack>
            )}
        </>
    )
}

function normalize(data?: InntektRequest['data']) {
    if (!data) return {}
    return {
        type: data.type as ArbeidsledigInntektType,
        årsinntekt: 'årsinntekt' in data ? data.årsinntekt : undefined,
        dagbeløp: 'dagbeløp' in data ? data.dagbeløp : undefined,
        begrunnelse: 'begrunnelse' in data ? data.begrunnelse : undefined,
    }
}
