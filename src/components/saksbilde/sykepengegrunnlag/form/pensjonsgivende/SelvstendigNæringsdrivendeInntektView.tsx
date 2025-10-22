import React, { ReactElement } from 'react'
import { BodyShort, HStack, Tag, VStack } from '@navikt/ds-react'

import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'
import { Maybe } from '@utils/tsUtils'
import { InntektData } from '@schemas/inntektData'
import { SykepengegrunnlagV2 } from '@schemas/sykepengegrunnlagV2'
import { formaterBeløpKroner } from '@schemas/sykepengegrunnlag'
import { pensjonsgivendeSkjønnsfastsettelseÅrsakLabels } from '@components/saksbilde/sykepengegrunnlag/form/pensjonsgivende/PensjonsgivendeInntektFormFields'

import { PensjonsgivendeInntektView } from './PensjonsgivendeInntektView'
import { NæringsdelView } from './NæringsdelView'

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

    if (inntektData?.inntektstype === 'SELVSTENDIG_NÆRINGSDRIVENDE_PENSJONSGIVENDE') {
        return (
            <>
                <PensjonsgivendeInntektView inntektData={inntektData} />
                <NæringsdelView næringsdel={sykepengegrunnlag?.næringsdel} />
            </>
        )
    }
    if (inntektRequestData.type === 'SKJONNSFASTSETTELSE') {
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

                <NæringsdelView næringsdel={sykepengegrunnlag?.næringsdel} />
            </>
        )
    }
    return <></>
}
