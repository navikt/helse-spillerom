import React, { ReactElement } from 'react'
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react'

import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'
import { InntektData } from '@schemas/inntektData'
import { SykepengegrunnlagBase } from '@schemas/sykepengegrunnlag'
import { formaterBeløpKroner } from '@schemas/øreUtils'
import { frilanserSkjønnsfastsettelseÅrsakLabels } from '@components/saksbilde/sykepengegrunnlag/form/frilanser/FrilanserInntektFormFields'
import { AinntektInntektDataView } from '@components/saksbilde/sykepengegrunnlag/form/ainntekt/AinntektInntektDataView'

type FrilanserInntektViewProps = {
    inntektRequest?: InntektRequestFor<'FRILANSER'>
    inntektData?: InntektData | null
    sykepengegrunnlag?: SykepengegrunnlagBase | null
}

export function FrilanserInntektView({ inntektRequest, inntektData }: FrilanserInntektViewProps): ReactElement {
    const inntektRequestData = inntektRequest?.data

    if (!inntektRequestData) {
        return (
            <VStack gap="2" className="w-fit">
                <BodyShort weight="semibold">Årsinntekt</BodyShort>
                <BodyShort className="text-right">-</BodyShort>
            </VStack>
        )
    }

    if (inntektData?.inntektstype === 'FRILANSER_AINNTEKT') {
        return <AinntektInntektDataView inntektData={inntektData} />
    }

    if (inntektRequestData.type == 'SKJONNSFASTSETTELSE') {
        const { årsinntekt, årsak, begrunnelse } = inntektRequestData

        return (
            <>
                {årsinntekt && (
                    <VStack gap="1">
                        <BodyShort weight="semibold">Årsinntekt</BodyShort>
                        <HStack gap="2">
                            <BodyShort className="w-[103px] text-right">{formaterBeløpKroner(årsinntekt)}</BodyShort>
                            <Tag variant="neutral" size="xsmall">
                                skjønnsfastsatt
                            </Tag>
                        </HStack>
                    </VStack>
                )}

                {årsak && (
                    <VStack gap="1">
                        <BodyShort weight="semibold">Årsak</BodyShort>
                        <BodyShort>{frilanserSkjønnsfastsettelseÅrsakLabels[årsak]}</BodyShort>
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
    return <></>
}
