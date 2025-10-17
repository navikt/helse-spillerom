import React, { ReactElement } from 'react'
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react'

import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'
import { formaterBeløpKroner } from '@schemas/sykepengegrunnlag'
import { ArbeidstakerInntektType, InntektRequest } from '@schemas/inntektRequest'

type ArbeidsledigInntektViewProps = {
    inntektRequest?: InntektRequestFor<'ARBEIDSLEDIG'>
}

export function ArbeidsledigInntektView({ inntektRequest }: ArbeidsledigInntektViewProps): ReactElement {
    const inntektRequestData = inntektRequest?.data

    if (!inntektRequestData) {
        return (
            <VStack gap="2" className="w-fit">
                <BodyShort weight="semibold">Dagbeløp</BodyShort>
                <BodyShort className="text-right">-</BodyShort>
            </VStack>
        )
    }

    const { månedsbeløp, dagbeløp, begrunnelse } = normalize(inntektRequestData)

    return (
        <>
            {månedsbeløp && (
                <VStack gap="1">
                    <BodyShort weight="semibold">Månedsbeløp</BodyShort>
                    <HStack gap="2">
                        <BodyShort className="w-[103px] text-right">{formaterBeløpKroner(månedsbeløp)}</BodyShort>
                        <Tag variant="neutral" size="xsmall">
                            manuelt beregnet
                        </Tag>
                    </HStack>
                </VStack>
            )}

            {dagbeløp && (
                <VStack gap="1">
                    <BodyShort weight="semibold">Dagbeløp</BodyShort>
                    <HStack gap="2">
                        <BodyShort className="w-[103px] text-right">{formaterBeløpKroner(dagbeløp)}</BodyShort>
                        <Tag variant="neutral" size="xsmall">
                            manuelt beregnet
                        </Tag>
                    </HStack>
                </VStack>
            )}

            {begrunnelse && (
                <VStack gap="1">
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
        type: data.type as ArbeidstakerInntektType,
        månedsbeløp: 'månedsbeløp' in data ? data.månedsbeløp : undefined,
        dagbeløp: 'dagbeløp' in data ? data.dagbeløp : undefined,
        begrunnelse: 'begrunnelse' in data ? data.begrunnelse : undefined,
    }
}
