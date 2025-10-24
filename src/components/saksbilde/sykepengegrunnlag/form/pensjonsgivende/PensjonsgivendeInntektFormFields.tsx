import React, { Fragment, ReactElement } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Alert, BodyShort, Radio, RadioGroup, VStack } from '@navikt/ds-react'

import {
    Inntektskategori,
    PensjonsgivendeInntektType,
    pensjonsgivendeInntektTypeSchema,
    PensjonsgivendeSkjønnsfastsettelseÅrsak,
    pensjonsgivendeSkjønnsfastsettelseÅrsakSchema,
} from '@schemas/inntektRequest'
import { PengerField } from '@components/saksbilde/sykepengegrunnlag/form/PengerField'
import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'
import { usePensjonsgivendeInntekt } from '@hooks/queries/usePensjonsgivendeInntekt'
import { PensjonsgivendeInntektView } from '@components/saksbilde/sykepengegrunnlag/form/pensjonsgivende/PensjonsgivendeInntektView'

type PensjonsgivendeInntektFormFieldsProps = {
    kategori: Inntektskategori
    yrkesaktivitetId: string
}

export function PensjonsgivendeInntektFormFields({
    kategori,
    yrkesaktivitetId,
}: PensjonsgivendeInntektFormFieldsProps): ReactElement {
    const { control, watch, setValue } = useFormContext<InntektRequestFor<typeof kategori>>()
    const valgtType = watch('data.type')

    return (
        <>
            <Controller
                control={control}
                name="data.type"
                render={({ field }) => (
                    <RadioGroup
                        {...field}
                        legend="Velg kilde for inntektsdata"
                        size="small"
                        onChange={(value) => {
                            field.onChange(value)
                            if (value === 'SKJONNSFASTSETTELSE') {
                                setValue('data.årsak', pensjonsgivendeSkjønnsfastsettelseÅrsakSchema.options[0])
                                setValue('data.årsinntekt', 0)
                            }
                        }}
                    >
                        {pensjonsgivendeInntektTypeSchema.options.map((option) => (
                            <Fragment key={option}>
                                <Radio value={option}>{typeLabels[option]}</Radio>
                                {valgtType === 'PENSJONSGIVENDE_INNTEKT' && option === 'PENSJONSGIVENDE_INNTEKT' && (
                                    <VisPensjonsgivendeInntekt yrkesaktivitetId={yrkesaktivitetId} />
                                )}
                            </Fragment>
                        ))}
                    </RadioGroup>
                )}
            />
            {valgtType === 'SKJONNSFASTSETTELSE' && (
                <>
                    <PengerField className="w-[212px]" name="data.årsinntekt" label="Pensjonsgivende årsinntekt" />
                    <Controller
                        control={control}
                        name="data.årsak"
                        render={({ field }) => (
                            <RadioGroup {...field} legend="Årsak til skjønnsfastsettelse" size="small">
                                {pensjonsgivendeSkjønnsfastsettelseÅrsakSchema.options.map((option) => (
                                    <Radio key={option} value={option}>
                                        {pensjonsgivendeSkjønnsfastsettelseÅrsakLabels[option]}
                                    </Radio>
                                ))}
                            </RadioGroup>
                        )}
                    />
                </>
            )}
        </>
    )
}

const typeLabels: Record<PensjonsgivendeInntektType, string> = {
    PENSJONSGIVENDE_INNTEKT: 'Bruk pensjonsgivende inntekt fra skatteetaten',
    SKJONNSFASTSETTELSE: 'Skjønnsfastsatt',
}

export const pensjonsgivendeSkjønnsfastsettelseÅrsakLabels: Record<PensjonsgivendeSkjønnsfastsettelseÅrsak, string> = {
    AVVIK_25_PROSENT_VARIG_ENDRING: '25% avvik og varig endring (§ 8-35 tredje ledd første punktum)',
    SISTE_TRE_YRKESAKTIV: 'Har blitt yrkesaktiv i løpet av de siste tre årene (§ 8-35 tredje ledd andre punktum)',
}

interface VisPensjonsgivendeInntektProps {
    yrkesaktivitetId: string
}

function VisPensjonsgivendeInntekt({ yrkesaktivitetId }: VisPensjonsgivendeInntektProps): ReactElement {
    const { data, isLoading, isError } = usePensjonsgivendeInntekt(yrkesaktivitetId)

    if (isLoading) {
        return (
            <VStack gap="2" className="m-4 ml-6">
                <BodyShort>Laster pensjonsgivende inntekt...</BodyShort>
            </VStack>
        )
    }

    if (isError) {
        return (
            <VStack gap="2" className="m-4 ml-6">
                <Alert variant="error" size="small">
                    Kunne ikke hente pensjonsgivende inntekt
                </Alert>
            </VStack>
        )
    }

    if (!data) {
        return (
            <VStack gap="2" className="m-4 ml-6">
                <BodyShort>Ingen data tilgjengelig</BodyShort>
            </VStack>
        )
    }

    if (!data.success) {
        return (
            <VStack gap="2" className="m-4 ml-6">
                <Alert variant="warning" size="small">
                    {data.feilmelding}
                </Alert>
            </VStack>
        )
    }

    return (
        <VStack gap="4" className="m-4 ml-6">
            <PensjonsgivendeInntektView inntektData={data.data} />
        </VStack>
    )
}
