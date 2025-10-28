import React, { Fragment, ReactElement } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Radio, RadioGroup } from '@navikt/ds-react'

import {
    FrilanserInntektType,
    frilanserInntektTypeSchema,
    FrilanserSkjønnsfastsettelseÅrsak,
    frilanserSkjønnsfastsettelseÅrsakSchema,
} from '@schemas/inntektRequest'
import { PengerField } from '@components/saksbilde/sykepengegrunnlag/form/PengerField'
import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'
import { VisAinntekt } from '@components/saksbilde/sykepengegrunnlag/form/VisAinntekt'

export function FrilanserInntektFormFields({ yrkesaktivitetId }: { yrkesaktivitetId: string }): ReactElement {
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
