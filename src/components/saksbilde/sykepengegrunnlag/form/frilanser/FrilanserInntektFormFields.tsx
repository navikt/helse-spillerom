import React, { Fragment, ReactElement } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Alert, BodyShort, Radio, RadioGroup, VStack } from '@navikt/ds-react'

import {
    FrilanserInntektType,
    frilanserInntektTypeSchema,
    FrilanserSkjønnsfastsettelseÅrsak,
    frilanserSkjønnsfastsettelseÅrsakSchema,
    Inntektskategori,
} from '@schemas/inntektRequest'
import { PengerField } from '@components/saksbilde/sykepengegrunnlag/form/PengerField'
import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'
import { useAinntektYrkesaktivitet } from '@hooks/queries/useAinntektYrkesaktivitet'
import { AinntektInntektDataView } from '@components/saksbilde/sykepengegrunnlag/form/ainntekt/AinntektInntektDataView'

export function FrilanserInntektFormFields({
    yrkesaktivitetId,
}: {
    yrkesaktivitetId: string
    kategori: Inntektskategori
}): ReactElement {
    const { control, watch, setValue } = useFormContext<InntektRequestFor<'FRILANSER'>>()
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
                                setValue('data.årsak', frilanserSkjønnsfastsettelseÅrsakSchema.options[0])
                                setValue('data.årsinntekt', 0)
                            }
                        }}
                    >
                        {frilanserInntektTypeSchema.options.map((option) => (
                            <Fragment key={option}>
                                <Radio value={option}>{typeLabels[option]}</Radio>
                                {valgtType === 'AINNTEKT' && option === 'AINNTEKT' && (
                                    <VisAinntekt yrkesaktivitetId={yrkesaktivitetId} />
                                )}
                            </Fragment>
                        ))}
                    </RadioGroup>
                )}
            />
            {valgtType === 'SKJONNSFASTSETTELSE' && (
                <>
                    <PengerField className="w-[212px]" name="data.årsinntekt" label="Årsinntekt" />
                    <Controller
                        control={control}
                        name="data.årsak"
                        render={({ field }) => (
                            <RadioGroup {...field} legend="Årsak til skjønnsfastsettelse" size="small">
                                {frilanserSkjønnsfastsettelseÅrsakSchema.options.map((option) => (
                                    <Radio key={option} value={option}>
                                        {frilanserSkjønnsfastsettelseÅrsakLabels[option]}
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

const typeLabels: Record<FrilanserInntektType, string> = {
    AINNTEKT: 'Hent fra A-inntekt',
    SKJONNSFASTSETTELSE: 'Skjønnsfastsatt',
}

export const frilanserSkjønnsfastsettelseÅrsakLabels: Record<FrilanserSkjønnsfastsettelseÅrsak, string> = {
    AVVIK_25_PROSENT: 'Skjønnsfastsettelse ved mer enn 25 % avvik (§ 8-30 andre ledd)',
    MANGELFULL_RAPPORTERING: 'Skjønnsfastsettelse ved mangelfull eller uriktig rapportering (§ 8-30 tredje ledd)',
}

interface VisAinntektProps {
    yrkesaktivitetId: string
}

function VisAinntekt({ yrkesaktivitetId }: VisAinntektProps): ReactElement {
    const { data, isLoading, isError } = useAinntektYrkesaktivitet(yrkesaktivitetId)

    if (isLoading) {
        return (
            <VStack gap="2" className="m-4 ml-6">
                <BodyShort>Laster a-inntekt...</BodyShort>
            </VStack>
        )
    }

    if (isError) {
        return (
            <VStack gap="2" className="m-4 ml-6">
                <Alert variant="error" size="small">
                    Kunne ikke hente a-inntekt
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
            <AinntektInntektDataView inntektData={data.data} />
        </VStack>
    )
}
