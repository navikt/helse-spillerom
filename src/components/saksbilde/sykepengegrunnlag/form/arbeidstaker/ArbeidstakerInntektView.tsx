import React, { ReactElement } from 'react'
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react'

import { formaterBeløpKroner } from '@schemas/sykepengegrunnlag'
import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'
import { arbeidstakerSkjønnsfastsettelseÅrsakLabels } from '@components/saksbilde/sykepengegrunnlag/form/arbeidstaker/ArbeidstakerInntektFormFields'
import { ArbeidstakerInntektType, ArbeidstakerSkjønnsfastsettelseÅrsak, InntektRequest } from '@schemas/inntektRequest'
import { InntektData } from '@schemas/inntektData'
import { SykepengegrunnlagV2 } from '@schemas/sykepengegrunnlagV2'
import { Maybe, notNull } from '@utils/tsUtils'
import { getFormattedDateString } from '@utils/date-format'

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
                <BodyShort weight="semibold">Årsinntekt</BodyShort>
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

    const { type, årsinntekt, årsak, refusjon, begrunnelse } = normalize(inntektRequestData)

    return (
        <>
            {notNull(årsinntekt) && (
                <VStack gap="1">
                    <BodyShort weight="semibold">Årsinntekt</BodyShort>
                    <HStack gap="2">
                        <BodyShort className="w-[103px] text-right">{formaterBeløpKroner(årsinntekt)}</BodyShort>
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

            {refusjon && refusjon.length > 0 && (
                <VStack gap="1">
                    <BodyShort weight="semibold">Refusjon</BodyShort>
                    {refusjon.map((refusjon) => (
                        <HStack key={refusjon.fom} gap="12">
                            <BodyShort>
                                {refusjon.tom
                                    ? `${getFormattedDateString(refusjon.fom)} - ${getFormattedDateString(refusjon.tom)}`
                                    : `${getFormattedDateString(refusjon.fom)} - til nå`}
                            </BodyShort>
                            <BodyShort>{formaterBeløpKroner(refusjon.beløp)}</BodyShort>
                        </HStack>
                    ))}
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

function normalize(data: InntektRequest['data']) {
    return {
        type: data.type as ArbeidstakerInntektType,
        inntektsmeldingId: 'inntektsmeldingId' in data ? data.inntektsmeldingId : undefined,
        årsinntekt: 'årsinntekt' in data ? data.årsinntekt : undefined,
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
