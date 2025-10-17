import React, { ReactElement } from 'react'
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react'

import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/ny/defaultValues'
import { Maybe } from '@utils/tsUtils'
import { InntektData } from '@schemas/inntektData'
import { SykepengegrunnlagV2 } from '@schemas/sykepengegrunnlagV2'
import { formaterBeløpKroner } from '@schemas/sykepengegrunnlag'
import { pensjonsgivendeSkjønnsfastsettelseÅrsakLabels } from '@components/saksbilde/sykepengegrunnlag/form/ny/pensjonsgivende/PensjonsgivendeInntektFormFields'

type SelvstendigNæringsdrivendeInntektViewProps = {
    inntektRequest?: InntektRequestFor<'SELVSTENDIG_NÆRINGSDRIVENDE'>
    inntektData?: Maybe<InntektData>
    sykepengegrunnlag?: Maybe<SykepengegrunnlagV2>
}

export function SelvstendigNæringsdrivendeInntektView({
    inntektRequest,
    inntektData,
    sykepengegrunnlag,
}: SelvstendigNæringsdrivendeInntektViewProps): ReactElement {
    const inntektRequestData = inntektRequest?.data

    if (!inntektRequestData) {
        return (
            <VStack gap="2" className="w-fit">
                <BodyShort weight="semibold">Årsinntekt</BodyShort>
                <BodyShort className="text-right">-</BodyShort>
            </VStack>
        )
    }

    if (inntektRequestData.type === 'PENSJONSGIVENDE_INNTEKT') {
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
                    <BodyShort>{pensjonsgivendeSkjønnsfastsettelseÅrsakLabels[årsak]}</BodyShort>
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
