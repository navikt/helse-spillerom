import React, { ReactElement } from 'react'
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react'

import { formaterBeløpKroner } from '@schemas/sykepengegrunnlag'
import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/ny/defaultValues'
import { arbeidstakerSkjønnsfastsettelseÅrsakLabels } from '@components/saksbilde/sykepengegrunnlag/form/ny/arbeidstaker/ArbeidstakerInntektFormFields'
import { ArbeidstakerInntektType, ArbeidstakerSkjønnsfastsettelseÅrsak, InntektRequest } from '@schemas/inntektRequest'
import { InntektData } from '@schemas/inntektData'
import { SykepengegrunnlagV2 } from '@schemas/sykepengegrunnlagV2'
import { Maybe } from '@utils/tsUtils'

type ArbeidstakerInntektViewProps = {
    inntektRequest?: InntektRequestFor<'ARBEIDSTAKER'>
    inntektData?: Maybe<InntektData>
    sykepengegrunnlag?: Maybe<SykepengegrunnlagV2>
}

export function ArbeidstakerInntektView({
    inntektRequest,
    inntektData,
    sykepengegrunnlag,
}: ArbeidstakerInntektViewProps): ReactElement {
    const inntektRequestData = inntektRequest?.data

    if (!inntektRequestData) {
        return (
            <VStack gap="2" className="w-fit">
                <BodyShort weight="semibold">Månedsbeløp</BodyShort>
                <BodyShort className="text-right">-</BodyShort>
            </VStack>
        )
    }

    if (inntektRequestData.type === 'INNTEKTSMELDING' || inntektRequestData.type === 'AINNTEKT') {
        return (
            <>
                <BodyShort>Data fra inntektdata og inntektrequest</BodyShort>
                <pre className="text-sm">{JSON.stringify(inntektRequestData, null, 2)}</pre>
                {inntektData && <pre className="text-sm">{JSON.stringify(inntektData, null, 2)}</pre>}
                {sykepengegrunnlag?.næringsdel && (
                    <pre className="text-sm">{JSON.stringify(sykepengegrunnlag.næringsdel, null, 2)}</pre>
                )}
            </>
        )
    }

    const { type, månedsbeløp, årsak, begrunnelse } = normalize(inntektRequestData)

    return (
        <>
            {månedsbeløp && (
                <VStack gap="1">
                    <BodyShort weight="semibold">Månedsbeløp</BodyShort>
                    <HStack gap="2">
                        <BodyShort className="w-[103px] text-right">{formaterBeløpKroner(månedsbeløp)}</BodyShort>
                        {TagFor[type]}
                    </HStack>
                </VStack>
            )}

            {årsak && (
                <VStack gap="1">
                    <BodyShort weight="semibold">Årsak</BodyShort>
                    <BodyShort>{arbeidstakerSkjønnsfastsettelseÅrsakLabels[årsak]}</BodyShort>
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
        inntektsmeldingId: 'inntektsmeldingId' in data ? data.inntektsmeldingId : undefined,
        månedsbeløp: 'månedsbeløp' in data ? data.månedsbeløp : undefined,
        årsak: 'årsak' in data ? (data.årsak as ArbeidstakerSkjønnsfastsettelseÅrsak) : undefined,
        refusjon: 'refusjon' in data ? data.refusjon : undefined,
        begrunnelse: 'begrunnelse' in data ? data.begrunnelse : undefined,
    }
}

const TagFor: Record<ArbeidstakerInntektType, ReactElement> = {
    INNTEKTSMELDING: (
        <Tag variant="neutral" size="xsmall">
            IM
        </Tag>
    ),
    AINNTEKT: (
        <Tag variant="neutral" size="xsmall">
            AO
        </Tag>
    ),
    SKJONNSFASTSETTELSE: (
        <Tag variant="neutral" size="xsmall">
            skjønnsfastsatt
        </Tag>
    ),
    MANUELT_BEREGNET: (
        <Tag variant="neutral" size="xsmall">
            manuelt beregnet
        </Tag>
    ),
}
